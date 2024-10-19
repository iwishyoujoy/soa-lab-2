package ru.itmo.soa.mainservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Digits(integer = 10, fraction = 0, message = "X must be an integer with up to 10 digits")
    private BigDecimal x;

    @NotNull(message = "Y coordinate cannot be null")
    @Min(value = -439, message = "Y coordinate cannot be less than -439")
    @Column(nullable = false)
    private BigDecimal y;
}