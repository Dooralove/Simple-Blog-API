package com.example.simpleblogapi.exceptions;

import java.time.LocalDateTime;

public class ApiErrorResponse {
    private int status;
    private String message;
    private String debugMessage;
    private LocalDateTime timestamp;

    public ApiErrorResponse() {
        timestamp = LocalDateTime.now();
    }

    public ApiErrorResponse(int status, String message, String debugMessage) {
        this();
        this.status = status;
        this.message = message;
        this.debugMessage = debugMessage;
    }


    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDebugMessage() {
        return debugMessage;
    }

    public void setDebugMessage(String debugMessage) {
        this.debugMessage = debugMessage;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}
