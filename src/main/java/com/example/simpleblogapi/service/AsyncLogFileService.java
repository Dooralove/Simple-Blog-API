package com.example.simpleblogapi.service;

import com.example.simpleblogapi.enums.TaskStatus;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.stereotype.Service;

@Service
@EnableAsync
public class AsyncLogFileService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncLogFileService.class);

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
        logger.info("Task {} started. Setting status to IN_PROGRESS.", taskId);
        taskStatusMap.put(taskId, TaskStatus.IN_PROGRESS);


        try {
            long delaySeconds = 10;
            logger.info("Task {} entering artificial delay of {} seconds...", taskId, delaySeconds);
            TimeUnit.SECONDS.sleep(delaySeconds);
            logger.info("Task {} finished artificial delay.", taskId);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.warn("Task {} sleep interrupted", taskId, e);


            taskStatusMap.put(taskId, TaskStatus.FAILED);
            return;
        }

        try {
            logger.info("Task {} starting file processing...", taskId);
            if (!Files.exists(Paths.get(MAIN_LOG_FILE))) {
                throw new IOException("Основной лог-файл не найден: " + MAIN_LOG_FILE);
            }
            var logLines = Files.readAllLines(Paths.get(MAIN_LOG_FILE));
            var filteredLogs = logLines.stream()
                    .filter(line -> line.startsWith(date))
                    .toList();

            if (filteredLogs.isEmpty()) {

                logger.warn("No logs found for date {} in task {}."
                        + " Completing task without creating file.", date, taskId);
                taskStatusMap.put(taskId, TaskStatus.COMPLETED);

                return;

            }


            Files.createDirectories(Paths.get(LOG_DIRECTORY_PATH));

            String dailyLogFilePath = LOG_DIRECTORY_PATH + "/daily-log-" + taskId + ".log";
            logger.info("Task {} writing {} filtered"
                    + " log lines to {}", taskId, filteredLogs.size(), dailyLogFilePath);
            try (FileWriter writer = new FileWriter(dailyLogFilePath)) {
                for (String log : filteredLogs) {
                    writer.write(log + System.lineSeparator());
                }
            }
            taskFileMap.put(taskId, dailyLogFilePath);
            taskStatusMap.put(taskId, TaskStatus.COMPLETED);
            logger.info("Task {} completed successfully.", taskId);

        } catch (IOException ex) {
            taskStatusMap.put(taskId, TaskStatus.FAILED);
            logger.error("IO Error during log file"
                    + " generation for taskId {}: {}", taskId, ex.getMessage(), ex);
        } catch (Exception ex) {
            taskStatusMap.put(taskId, TaskStatus.FAILED);
            logger.error("Unexpected error during log file"
                    + " generation for taskId {}: {}", taskId, ex.getMessage(), ex);
        }
    }

    public Long startLogFileGeneration(String date) {
        if (dateTaskMap.containsKey(date)) {
            Long existingTaskId = dateTaskMap.get(date);
            TaskStatus currentStatus = taskStatusMap.get(existingTaskId);

            if (currentStatus != null && currentStatus != TaskStatus.FAILED) {
                logger.warn("Task for date {} already exists"
                        + " with ID {} and status {}. Returning "
                        + "existing ID.", date, existingTaskId, currentStatus);
                return existingTaskId;
            }

            logger.warn("Previous task {} for date {} failed."
                    + " Starting a new one.", existingTaskId, date);

            dateTaskMap.remove(date);
        }

        Long taskId = idGenerator.getAndIncrement();
        logger.info("Starting new log generation task {} for date {}", taskId, date);
        taskStatusMap.put(taskId, TaskStatus.IN_PROGRESS);
        dateTaskMap.put(date, taskId);

        AsyncLogFileService proxy = applicationContext.getBean(AsyncLogFileService.class);
        proxy.generateLogFileAsync(date, taskId);

        return taskId;
    }

    public TaskStatus getTaskStatus(Long taskId) {
        return taskStatusMap.get(taskId);
    }

    public File getLogFile(Long taskId) {
        TaskStatus status = taskStatusMap.get(taskId);
        if (status != TaskStatus.COMPLETED) {
            logger.warn("Attempt to get log file for "
                    + "task {} which is not COMPLETED (status: {})", taskId, status);
            return null;
        }
        String path = taskFileMap.get(taskId);
        return path != null ? new File(path) : null;
    }
}