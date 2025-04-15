package com.example.simpleblogapi.test;

import com.example.simpleblogapi.enums.TaskStatus;
import com.example.simpleblogapi.service.AsyncLogFileService;
import org.awaitility.Awaitility;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.core.task.SyncTaskExecutor;

import java.io.File;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.TimeUnit;

@SpringBootTest
@ContextConfiguration(classes = {AsyncLogFileService.class, AsyncLogFileServiceTest.TestAsyncConfig.class})
class AsyncLogFileServiceTest {

    @Autowired
    private AsyncLogFileService asyncLogFileService;

    private final Path logsDir = Path.of("logs");
    private final Path mainLogFile = logsDir.resolve("app.log");

    @BeforeEach
    void setUp() throws Exception {
        Files.createDirectories(logsDir);
    }

    @AfterEach
    void tearDown() throws Exception {
        Files.walk(logsDir)
                .map(Path::toFile)
                .forEach(File::delete);
    }

    @Test
    void testGenerateLogFileSuccessfully() throws Exception {
        String date = "2025-04-13";
        String logContent = date + " Log entry 1\n" +
                date + " Log entry 2\n" +
                "2025-04-12 Log entry not matching\n";
        try (FileWriter writer = new FileWriter(mainLogFile.toFile())) {
            writer.write(logContent);
        }

        Long taskId = asyncLogFileService.startLogFileGeneration(date);

        Awaitility.await().atMost(5, TimeUnit.SECONDS).until(() ->
                asyncLogFileService.getTaskStatus(taskId) == TaskStatus.COMPLETED);

        TaskStatus status = asyncLogFileService.getTaskStatus(taskId);
        Assertions.assertEquals(TaskStatus.COMPLETED, status, "Статус задачи должен быть COMPLETED");

        File generatedFile = asyncLogFileService.getLogFile(taskId);
        Assertions.assertNotNull(generatedFile, "Сгенерированный файл не должен быть null");
        Assertions.assertTrue(generatedFile.exists(), "Сгенерированный файл должен существовать");

        String generatedContent = Files.readString(generatedFile.toPath());
        Assertions.assertTrue(generatedContent.contains("Log entry 1"));
        Assertions.assertTrue(generatedContent.contains("Log entry 2"));
        Assertions.assertFalse(generatedContent.contains("2025-04-12"));
    }

    @Configuration
    static class TestAsyncConfig {
        @Bean("taskExecutor")
        public TaskExecutor taskExecutor() {
            return new SyncTaskExecutor();
        }
    }
}
