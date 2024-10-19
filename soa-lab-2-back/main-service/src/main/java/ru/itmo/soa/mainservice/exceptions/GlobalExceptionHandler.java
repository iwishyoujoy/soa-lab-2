package ru.itmo.soa.mainservice.exceptions;

import jakarta.validation.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.jpa.repository.query.JSqlParserUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        response.put("message", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, Object>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("message", "Invalid value for parameter '" + ex.getName() + "': '" + ex.getValue() + "' is not a valid " + ex.getRequiredType().getSimpleName() + ".");
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleConstraintViolation(ConstraintViolationException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());

        Map<String, String> errors = new HashMap<>();
        ex.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            errors.put(fieldName, errorMessage);
        });

        response.put("message", errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ResponseEntity<DefaultError> handleResourceNotFound(ResourceNotFoundException ex) {
        DefaultError errorResponse = new DefaultError(
                ex.getMessage() != null ? ex.getMessage() : "Resource not found"
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(InvalidParameterException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleInvalidParameterException(InvalidParameterException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());

        String message = e.getMessage();

        if (message.contains("duplicate key value")) {
            String fieldName = extractFieldNameFromMessage(message);
            response.put("message", "Error: Duplicate value for field '" + fieldName + "'. Please use a unique value.");
        } else {
            response.put("message", e.getMessage());
        }
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    private String extractFieldNameFromMessage(String message) {
        String[] parts = message.split(" ");
        for (String part : parts) {
            if (part.contains("_key")) {
                String[] fieldParts = part.split("_");
                if (fieldParts.length > 1) {
                    return fieldParts[1];
                }
            }
        }
        return "unknown_field";
    }

    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<Map<String, Object>> handleBadSqlGrammarException(BadSqlGrammarException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("message", "Error в SQL-request: " + e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<Map<String, Object>> handleSQLException(SQLException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("message", "Database error occurred: " + e.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}

