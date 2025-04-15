package com.example.simpleblogapi.controllers;

import com.example.simpleblogapi.service.VisitCounterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/visits")
public class VisitController {

    private final VisitCounterService visitCounterService;

    public VisitController(VisitCounterService visitCounterService) {
        this.visitCounterService = visitCounterService;
    }

    @Operation(
            summary = "Увеличение счетчика посещений",
            description = "Увеличивает счетчик посещений для"
                    + " указанного URL. После вызова возвращается текущее "
                    + "количество посещений данного URL."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Счетчик успешно увеличен"),
        @ApiResponse(responseCode = "400", description = "Некорректный запрос или параметр")
    })
    @PostMapping("/increment")
    public ResponseEntity<String> incrementVisit(
            @Parameter(
                    description = "URL, по которому необходимо увеличить счетчик посещений",
                    required = true
            )
            @RequestParam String url) {

        long count = visitCounterService.incrementVisit(url);
        return ResponseEntity.ok("URL '" + url + "' посещён " + count + " раз.");
    }

    @Operation(
            summary = "Получение счетчика посещений",
            description = "Возвращает текущее количество посещений для заданного URL."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Запрос выполнен успешно,"
                    + " возвращает количество посещений"),
            @ApiResponse(responseCode = "400", description = "Некорректный запрос или параметр")
    })
    @GetMapping("/count")
    public ResponseEntity<String> getVisitCount(
            @Parameter(
                    description = "URL, для которого необходимо получить количество посещений",
                    required = true
            )
            @RequestParam String url) {

        long count = visitCounterService.getVisitCount(url);
        return ResponseEntity.ok("URL '" + url + "' посещён " + count + " раз.");
    }
}
