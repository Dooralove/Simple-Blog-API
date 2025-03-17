package com.example.simpleblogapi.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

@RestController
public class LogController {

    @GetMapping("/logs")
    public ResponseEntity<byte[]> getLogFile(@RequestParam String date) throws IOException {
        String filePath = "logs/app-" + date + ".log";
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
}
