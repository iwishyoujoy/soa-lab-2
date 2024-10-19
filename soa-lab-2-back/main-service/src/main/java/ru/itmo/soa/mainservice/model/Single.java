package ru.itmo.soa.mainservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Data
public class Single {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Min(value = 1, message = "ID must be greater than or equal to 1")
    private Long id;

    @NotNull(message = "Name is required")
    @Size(min = 1, message = "Name must have at least 1 character")
    @Column(nullable = false, unique = true, columnDefinition = "TEXT")
    private String name;
}
