package com.example.simpleblogapi.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.regex.Pattern;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogController {

    private static final String LOG_DIRECTORY_PATH = "logs";
    private static final String LOG_FILE_PATH = LOG_DIRECTORY_PATH + "/app.log";

    @Operation(
            summary = "Генерация лог-файла за указанную дату",
            description = "Возвращает лог-файл, содержащий только те строки общего лог-файла,"
                    + " которые начинаются с указанной даты. "
                    + "Дата должна быть передана в формате yyyy-MM-dd."
                    + " Если формат даты неверен, основной лог-файл отсутствует "
                    + "или за заданную дату логи не найдены,"
                    + " возвращаются соответствующие сообщения об ошибке."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description =
                "Лог-файл успешно сгенерирован и готов для загрузки"),
        @ApiResponse(responseCode = "400", description =
                "Неверный формат даты. Ожидается формат yyyy-MM-dd", content = @Content),
        @ApiResponse(responseCode = "404", description =
                "Основной лог-файл не найден или логи"
                        + " за указанную дату отсутствуют", content = @Content),
        @ApiResponse(responseCode = "500", description =
                "Ошибка создания директории для логов"
                        + " или работы с файловой системой", content = @Content)
    })
    @GetMapping("/logs/file")
    public ResponseEntity<String> generateLogFile(
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Дата для фильтрации логов (формат yyyy-MM-dd)",
                    required = true
            ) @RequestParam String date) throws IOException {

        if (!isValidDate(date)) {
            return ResponseEntity.badRequest().body("Неверный формат даты.");
        }

        File logDirectory = new File(LOG_DIRECTORY_PATH);
        if (!logDirectory.exists() && !logDirectory.mkdirs()) {
            return ResponseEntity.status(500).body("Не удалось создать директорию для логов.");
        }

        File logFile = new File(LOG_FILE_PATH);
        if (!logFile.exists()) {
            return ResponseEntity.status(404).body("Основной лог-файл не найден.");
        }

        List<String> logLines = Files.readAllLines(Paths.get(LOG_FILE_PATH));

        List<String> filteredLogs = logLines.stream()
                .filter(line -> line.startsWith(date))
                .toList();

        if (filteredLogs.isEmpty()) {
            return ResponseEntity.status(404).body("Логи за указанную дату не найдены.");
        }

        String dailyLogFilePath = LOG_DIRECTORY_PATH + "/daily-log-" + date + ".log";
        File dailyLogFile = new File(dailyLogFilePath);
        try (FileWriter writer = new FileWriter(dailyLogFile)) {
            for (String log : filteredLogs) {
                writer.write(log + System.lineSeparator());
            }
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=daily-log-" + date + ".log");

        return ResponseEntity.ok()
                .headers(headers)
                .body(Files.readString(Paths.get(dailyLogFilePath)));
    }

    private boolean isValidDate(String date) {
        String regex = "^\\d{4}-\\d{2}-\\d{2}$";
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(date).matches();
    }
}
