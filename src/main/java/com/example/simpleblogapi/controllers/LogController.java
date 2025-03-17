package com.example.simpleblogapi.controllers;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.regex.Pattern;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class LogController {

    private static final String LOG_DIRECTORY = "logs/";

    @GetMapping("/logs")
    public ResponseEntity<byte[]> getLogFile(@RequestParam String date) throws IOException {

        if (!isValidDate(date)) {
            return ResponseEntity.badRequest().body("Invalid date format.".getBytes());
        }

        String filePath = LOG_DIRECTORY + "app-" + date + ".log";

        File file = new File(filePath);

        if (file.exists()) {
            byte[] content = Files.readAllBytes(Paths.get(filePath));

            return ResponseEntity.ok()
                    .header("Content-Type", "application/octet-stream")
                    .header("Content-Disposition", "attachment; filename=\"log-" + date + ".log\"")
                    .body(content);
        } else {
            return ResponseEntity.status(404).body("Log file not found".getBytes());
        }
    }

    private boolean isValidDate(String date) {
        String regex = "^\\d{4}-\\d{2}-\\d{2}$";
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(date).matches();
    }
}