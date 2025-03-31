package com.example.simpleblogapi.exceptions;

import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidInput(InvalidInputException ex) {
        logger.error("Ошибка неверного ввода: ", ex);
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                ex.toString());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse>
        handleValidationExceptions(MethodArgumentNotValidException ex) {
        logger.error("Ошибка валидации: ", ex);
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Ошибки валидации: " + errorMessage,
                ex.toString());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        logger.error("Ресурс не найден: ", ex);
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                ex.toString());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    // Новый обработчик для ошибок преобразования типа
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiErrorResponse>
        handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        logger.error("Ошибка преобразования типа: ", ex);

        if (ex.getRequiredType() != null && ex.getRequiredType().equals(Long.class)) {
            String errorMessage = "Не удалось преобразовать значение '"
                    + ex.getValue() + "' к типу Long";
            StringToLongConversionException conversionException =
                    new StringToLongConversionException(errorMessage, ex);

            ApiErrorResponse response = new ApiErrorResponse(
                    HttpStatus.BAD_REQUEST.value(),
                    errorMessage,
                    conversionException.toString());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // Если требуется обработать другие случаи преобразования
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getMessage(),
                ex.toString());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleAllExceptions(Exception ex) {
        logger.error("Произошло непредвиденное исключение: ", ex);
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Внутренняя ошибка сервера",
                ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
