package com.example.simpleblogapi.exceptions;

public class StringToLongConversionException extends RuntimeException {
    public StringToLongConversionException(String message) {
        super(message);
    }

    public StringToLongConversionException(String message, Throwable cause) {
        super(message, cause);
    }
}
