package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.service.AsyncLogFileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/logs/async")
public class AsyncLogFileController {

    private final AsyncLogFileService asyncLogFileService;

    public AsyncLogFileController(AsyncLogFileService asyncLogFileService) {
        this.asyncLogFileService = asyncLogFileService;
    }

    @Operation(
            summary = "Запуск асинхронного создания лог-файла",
            description = "Запускает асинхронную задачу по созданию "
                    + "лог-файла для указанной даты и возвращает ID задачи."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "ID задачи успешно получен"),
        @ApiResponse(responseCode = "400", description = "Неверный формат даты", content = @Content)
    })
    @PostMapping("/generate")
    public ResponseEntity<Long> generateLogFile(
            @Parameter(
                    in = ParameterIn.QUERY,
                    description = "Дата для фильтрации логов (формат yyyy-MM-dd)",
                    required = true
            ) @RequestParam String date) {
        Long taskId = asyncLogFileService.startLogFileGeneration(date);
        return ResponseEntity.ok(taskId);
    }

    @Operation(
            summary = "Получение статуса задачи",
            description = "Возвращает статус задачи по её уникальному идентификатору."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description =
                    "Статус задачи успешно получен"),
        @ApiResponse(responseCode = "404", description =
                    "Задача с указанным ID не найдена", content = @Content)
    })
    @GetMapping("/{taskId}/status")
    public ResponseEntity<String> getTaskStatus(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор задачи",
                    required = true
            ) @PathVariable Long taskId) {
        var status = asyncLogFileService.getTaskStatus(taskId);
        if (status == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Задача с таким ID не найдена");
        }
        return ResponseEntity.ok(status.toString());
    }

    @Operation(
            summary = "Получение сгенерированного лог-файла",
            description = "Возвращает сгенерированный лог-файл"
                    + " для задачи с указанным ID, если задача завершена."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Файл успешно получен"),
        @ApiResponse(responseCode = "404", description =
                "Файл не найден или задача не завершена", content = @Content)
    })
    @GetMapping("/{taskId}/file")
    public ResponseEntity<?> getLogFile(
            @Parameter(
                    in = ParameterIn.PATH,
                    description = "Уникальный идентификатор задачи",
                    required = true
            ) @PathVariable Long taskId) {
        var file = asyncLogFileService.getLogFile(taskId);
        if (file == null || !file.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Файл "
                    + "не найден или задача не завершена");
        }
        Resource resource = new FileSystemResource(file);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=" + file.getName());
        return ResponseEntity.ok().headers(headers).body(resource);
    }
}