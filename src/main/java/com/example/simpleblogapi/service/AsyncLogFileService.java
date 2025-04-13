package com.example.simpleblogapi.service;

import com.example.simpleblogapi.enums.TaskStatus;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

@Service
@EnableAsync
public class AsyncLogFileService {

    private static final String LOG_DIRECTORY_PATH = "logs";
    private static final String MAIN_LOG_FILE = LOG_DIRECTORY_PATH + "/app.log";

    private final Map<Long, TaskStatus> taskStatusMap = new ConcurrentHashMap<>();
    private final Map<Long, String> taskFileMap = new ConcurrentHashMap<>();
    private final Map<String, Long> dateTaskMap = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);
    private final ApplicationContext applicationContext;

    public AsyncLogFileService(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Async
    public void generateLogFileAsync(String date, Long taskId) {
        taskStatusMap.put(taskId, TaskStatus.IN_PROGRESS);
        try {
            if (!Files.exists(Paths.get(MAIN_LOG_FILE))) {
                throw new IOException("Основной лог-файл не найден");
            }
            var logLines = Files.readAllLines(Paths.get(MAIN_LOG_FILE));
            var filteredLogs = logLines.stream()
                    .filter(line -> line.startsWith(date))
                    .toList();
            if (filteredLogs.isEmpty()) {
                throw new IOException("Логи за указанную дату не найдены.");
            }

            String dailyLogFilePath = LOG_DIRECTORY_PATH + "/daily-log-" + taskId + ".log";
            try (FileWriter writer = new FileWriter(dailyLogFilePath)) {
                for (String log : filteredLogs) {
                    writer.write(log + System.lineSeparator());
                }
            }
            taskFileMap.put(taskId, dailyLogFilePath);
            taskStatusMap.put(taskId, TaskStatus.COMPLETED);
        } catch (Exception ex) {
            taskStatusMap.put(taskId, TaskStatus.FAILED);
            System.err.println("Error generating log file for "
                    + "taskId " + taskId + ": " + ex.getMessage());
        }
    }

    public Long startLogFileGeneration(String date) {
        if (dateTaskMap.containsKey(date)) {
            return dateTaskMap.get(date);
        }
        Long taskId = idGenerator.getAndIncrement();
        dateTaskMap.put(date, taskId);
        AsyncLogFileService proxy = applicationContext.getBean(AsyncLogFileService.class);
        proxy.generateLogFileAsync(date, taskId);
        return taskId;
    }

    public TaskStatus getTaskStatus(Long taskId) {
        return taskStatusMap.get(taskId);
    }

    public File getLogFile(Long taskId) {
        String path = taskFileMap.get(taskId);
        return path != null ? new File(path) : null;
    }
}
