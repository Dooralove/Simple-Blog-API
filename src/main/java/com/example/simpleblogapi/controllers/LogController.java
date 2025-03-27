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
import java.util.stream.Collectors;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogController {

    private static final String LOG_DIRECTORY_PATH = "logs"; // Путь к папке с логами
    private static final String LOG_FILE_PATH = LOG_DIRECTORY_PATH + "/app.log"; // Путь к общему лог-файлу

    @Operation(
            summary = "Генерация лог-файла за указанную дату",
            description = "Возвращает лог-файл, содержащий строки из общего лог-файла, начинающиеся с указанной даты в формате yyyy-MM-dd. "
                    + "При неверном формате даты или отсутствии логов возвращается соответствующая ошибка."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Лог-файл успешно сгенерирован"),
            @ApiResponse(responseCode = "400", description = "Неверный формат даты", content = @Content),
            @ApiResponse(responseCode = "404", description = "Лог-файл не найден или логи за указанную дату отсутствуют", content = @Content),
            @ApiResponse(responseCode = "500", description = "Ошибка создания директории для логов", content = @Content)
    })
    @GetMapping("/logs/file")
    public ResponseEntity<?> generateLogFile(
            @Parameter(in = ParameterIn.QUERY, description = "Дата для фильтрации логов в формате yyyy-MM-dd", required = true)
            @RequestParam String date) throws IOException {

        // Проверка валидности формата даты
        if (!isValidDate(date)) {
            return ResponseEntity.badRequest().body("Invalid date format.");
        }

        // Проверка существования директории с логами
        File logDirectory = new File(LOG_DIRECTORY_PATH);
        if (!logDirectory.exists() && !logDirectory.mkdirs()) {
            return ResponseEntity.status(500).body("Failed to create log directory.");
        }

        // Проверка существования общего лог-файла
        File logFile = new File(LOG_FILE_PATH);
        if (!logFile.exists()) {
            return ResponseEntity.status(404).body("Main log file not found.");
        }

        // Чтение строк из общего лог-файла
        List<String> logLines = Files.readAllLines(Paths.get(LOG_FILE_PATH));

        // Фильтрация строк, содержащих указанную дату
        List<String> filteredLogs = logLines.stream()
                .filter(line -> line.startsWith(date))
                .collect(Collectors.toList());

        if (filteredLogs.isEmpty()) {
            return ResponseEntity.status(404).body("No logs found for the specified date.");
        }

        // Создание файла с логами за указанную дату
        String dailyLogFilePath = LOG_DIRECTORY_PATH + "/daily-log-" + date + ".log";
        File dailyLogFile = new File(dailyLogFilePath);
        try (FileWriter writer = new FileWriter(dailyLogFile)) {
            for (String log : filteredLogs) {
                writer.write(log + System.lineSeparator());
            }
        }

        // Возвращаем созданный файл в ответе
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=daily-log-" + date + ".log");

        return ResponseEntity.ok()
                .headers(headers)
                .body(Files.readString(Paths.get(dailyLogFilePath)));
    }

    // Проверка формата даты
    private boolean isValidDate(String date) {
        String regex = "^\\d{4}-\\d{2}-\\d{2}$"; // Формат: yyyy-MM-dd
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(date).matches();
    }
}
