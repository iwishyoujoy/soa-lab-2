package ru.itmo.soa.mainservice.repositories;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import ru.itmo.soa.mainservice.exceptions.InvalidParameterException;
import ru.itmo.soa.mainservice.model.Band;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

public class BandSpecifications {
    public static Specification<Band> createSpecification(String[] filters) {
        return (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();

            if (filters != null) {
                for (String filter : filters) {
                    if (!filter.contains("[")) {
                        throw new InvalidParameterException("Invalid filter format: " + filter);
                    }

                    String[] paramParts = filter.split("\\[");
                    if (paramParts.length != 2) {
                        throw new InvalidParameterException("Invalid filter parameter format: " + filter);
                    }

                    String field = paramParts[0].trim();
                    String operatorAndValue = paramParts[1].trim();

                    String operator;
                    String value;

                    if (operatorAndValue.contains("]")) {
                        int operatorEndIndex = operatorAndValue.indexOf("]");
                        operator = operatorAndValue.substring(0, operatorEndIndex).trim();
                        value = operatorAndValue.substring(operatorEndIndex + 1).trim();
                    } else {
                        throw new InvalidParameterException("Invalid filter format: " + filter);
                    }

                    String[] fieldParts = field.split("\\.");
                    Path<?> currentPath = root;

                    for (String part : fieldParts) {
                        currentPath = currentPath.get(part);
                    }

                    Class<?> fieldType = currentPath.getJavaType();
                    Predicate condition = switch (operator.toLowerCase()) {
                        case "eq" -> handleEqual(currentPath, fieldType, value, criteriaBuilder);
                        case "neq" -> handleNotEqual(currentPath, fieldType, value, criteriaBuilder);
                        case "gt" -> handleGreaterThan(currentPath, fieldType, value, criteriaBuilder);
                        case "gte" -> handleGreaterThanOrEqualTo(currentPath, fieldType, value, criteriaBuilder);
                        case "lt" -> handleLessThan(currentPath, fieldType, value, criteriaBuilder);
                        case "lte" -> handleLessThanOrEqualTo(currentPath, fieldType, value, criteriaBuilder);
                        case "~" -> handleLike(currentPath, fieldType, value, criteriaBuilder);
                        default -> throw new InvalidParameterException("Unknown operator: " + operator);
                    };

                    predicate = criteriaBuilder.and(predicate, condition);
                }
            }

            return predicate;
        };
    }

    private static Predicate handleEqual(Path<?> currentPath, Class<?> fieldType, String value, CriteriaBuilder criteriaBuilder) {
        if (fieldType.equals(LocalDate.class)) {
            return criteriaBuilder.equal(currentPath.as(LocalDate.class), parseDate(value));
        } else if (fieldType.equals(LocalDateTime.class)) {
            return criteriaBuilder.equal(currentPath.as(LocalDateTime.class), parseDateTime(value));
        } else if (fieldType.isEnum()) {
            return criteriaBuilder.equal(currentPath, Enum.valueOf((Class<Enum>) fieldType, value.toUpperCase()));
        } else if (fieldType.equals(String.class)) {
            return criteriaBuilder.equal(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else {
            return criteriaBuilder.equal(currentPath, value);
        }
    }

    private static Predicate handleNotEqual(Path<?> currentPath, Class<?> fieldType, String value, CriteriaBuilder criteriaBuilder) {
        if (fieldType.equals(LocalDate.class)) {
            return criteriaBuilder.notEqual(currentPath.as(LocalDate.class), parseDate(value));
        } else if (fieldType.equals(LocalDateTime.class)) {
            return criteriaBuilder.notEqual(currentPath.as(LocalDateTime.class), parseDateTime(value));
        } else if (fieldType.isEnum()) {
            return criteriaBuilder.notEqual(currentPath, Enum.valueOf((Class<Enum>) fieldType, value.toUpperCase()));
        } else if (fieldType.equals(String.class)) {
            return criteriaBuilder.notEqual(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else {
            return criteriaBuilder.notEqual(currentPath, value);
        }
    }

    private static Predicate handleGreaterThan(Path<?> currentPath, Class<?> fieldType, String value, CriteriaBuilder criteriaBuilder) {
        if (fieldType.equals(Long.class)) {
            return criteriaBuilder.greaterThan(currentPath.as(Long.class), Long.valueOf(value));
        } else if (fieldType.equals(Integer.class)) {
            return criteriaBuilder.greaterThan(currentPath.as(Integer.class), Integer.valueOf(value));
        } else if (fieldType.equals(Double.class)) {
            return criteriaBuilder.greaterThan(currentPath.as(Double.class), Double.valueOf(value));
        } else if (fieldType.isEnum()) {
            return criteriaBuilder.equal(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else if (fieldType.equals(LocalDate.class)) {
            return criteriaBuilder.greaterThan(currentPath.as(LocalDate.class), parseDate(value));
        } else if (fieldType.equals(LocalDateTime.class)) {
            return criteriaBuilder.greaterThan(currentPath.as(LocalDateTime.class), parseDateTime(value));
        } else if (fieldType.equals(String.class)) {
            return criteriaBuilder.greaterThan(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else {
            throw new InvalidParameterException("Operator 'gt' can only be applied to numeric, date or string fields");
        }
    }

    private static Predicate handleGreaterThanOrEqualTo(Path<?> currentPath, Class<?> fieldType, String value, CriteriaBuilder criteriaBuilder) {
        if (fieldType.equals(Long.class)) {
            return criteriaBuilder.greaterThanOrEqualTo(currentPath.as(Long.class), Long.valueOf(value));
        } else if (fieldType.equals(Integer.class)) {
            return criteriaBuilder.greaterThanOrEqualTo(currentPath.as(Integer.class), Integer.valueOf(value));
        } else if (fieldType.equals(Double.class)) {
            return criteriaBuilder.greaterThanOrEqualTo(currentPath.as(Double.class), Double.valueOf(value));
        } else if (fieldType.isEnum()) {
            return criteriaBuilder.equal(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else if (fieldType.equals(LocalDate.class)) {
            return criteriaBuilder.greaterThanOrEqualTo(currentPath.as(LocalDate.class), parseDate(value));
        } else if (fieldType.equals(LocalDateTime.class)) {
            return criteriaBuilder.greaterThanOrEqualTo(currentPath.as(LocalDateTime.class), parseDateTime(value));
        } else if (fieldType.equals(String.class)) {
            return criteriaBuilder.greaterThanOrEqualTo(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else {
            throw new InvalidParameterException("Operator 'gte' can only be applied to numeric, date or string fields");
        }
    }

    private static Predicate handleLessThan(Path<?> currentPath, Class<?> fieldType, String value, CriteriaBuilder criteriaBuilder) {
        if (fieldType.equals(Long.class)) {
            return criteriaBuilder.lessThan(currentPath.as(Long.class), Long.valueOf(value));
        } else if (fieldType.equals(Integer.class)) {
            return criteriaBuilder.lessThan(currentPath.as(Integer.class), Integer.valueOf(value));
        } else if (fieldType.equals(Double.class)) {
            return criteriaBuilder.lessThan(currentPath.as(Double.class), Double.valueOf(value));
        } else if (fieldType.isEnum()) {
            String enumValueAsString = ((Enum<?>) value).name();
            return criteriaBuilder.equal(currentPath.as(String.class), criteriaBuilder.literal(enumValueAsString));
        } else if (fieldType.equals(LocalDate.class)) {
            return criteriaBuilder.lessThan(currentPath.as(LocalDate.class), parseDate(value));
        } else if (fieldType.equals(LocalDateTime.class)) {
            return criteriaBuilder.lessThan(currentPath.as(LocalDateTime.class), parseDateTime(value));
        } else if (fieldType.equals(String.class)) {
            return criteriaBuilder.lessThan(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else {
            throw new InvalidParameterException("Operator 'lt' can only be applied to numeric, date or string fields");
        }
    }

    private static Predicate handleLessThanOrEqualTo(Path<?> currentPath, Class<?> fieldType, String value, CriteriaBuilder criteriaBuilder) {
        if (fieldType.equals(Long.class)) {
            return criteriaBuilder.lessThanOrEqualTo(currentPath.as(Long.class), Long.valueOf(value));
        } else if (fieldType.equals(Integer.class)) {
            return criteriaBuilder.lessThanOrEqualTo(currentPath.as(Integer.class), Integer.valueOf(value));
        } else if (fieldType.equals(Double.class)) {
            return criteriaBuilder.lessThanOrEqualTo(currentPath.as(Double.class), Double.valueOf(value));
        } else if (fieldType.isEnum()) {
            return criteriaBuilder.equal(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else if (fieldType.equals(LocalDate.class)) {
            return criteriaBuilder.lessThanOrEqualTo(currentPath.as(LocalDate.class), parseDate(value));
        } else if (fieldType.equals(LocalDateTime.class)) {
            return criteriaBuilder.lessThanOrEqualTo(currentPath.as(LocalDateTime.class), parseDateTime(value));
        } else if (fieldType.equals(String.class)) {
            return criteriaBuilder.lessThanOrEqualTo(criteriaBuilder.upper(currentPath.as(String.class)), value.toUpperCase());
        } else {
            throw new InvalidParameterException("Operator 'lte' can only be applied to numeric, date or string fields");
        }
    }

    private static Predicate handleLike(Path<?> currentPath, Class<?> fieldType, String value, CriteriaBuilder criteriaBuilder) {
        if (fieldType.isEnum()) {
            return criteriaBuilder.like(
                    criteriaBuilder.upper(currentPath.as(String.class)), "%" + value.toUpperCase() + "%"
            );
        } else if (fieldType.equals(String.class)) {
            return criteriaBuilder.like(criteriaBuilder.upper(currentPath.as(String.class)), "%" + value.toUpperCase() + "%");
        } else {
            throw new InvalidParameterException("Operator '~' can only be applied to string or enum fields");
        }
    }

    private static LocalDateTime parseDateTime(String value) {
        try {
            return LocalDateTime.parse(value);
        } catch (DateTimeParseException e) {
            throw new InvalidParameterException("Invalid date format: " + value);
        }
    }

    private static LocalDate parseDate(String value) {
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException e) {
            throw new InvalidParameterException("Invalid date format: " + value);
        }
    }
}
