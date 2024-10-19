package ru.itmo.soa.grammyservice.exceptions;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceAccessException.class)
    public ResponseEntity<Map<String, Object>> handleServiceUnavailableException(ResourceAccessException ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("message", "The service is currently unavailable. Please try again later.");
        return new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<Map<String, Object>> handleRestClientException(RestClientResponseException ex) throws JsonProcessingException {
        ObjectMapper om = new ObjectMapper();

        Map<String, Object> response = new HashMap<>();
        response.put("code", ex.getStatusCode().value());
        response.put("message", om.readTree(ex.getResponseBodyAsString()).get("message"));
        return new ResponseEntity<>(response, ex.getStatusCode());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneralException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("code", HttpStatus.INTERNAL_SERVER_ERROR.value());
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}