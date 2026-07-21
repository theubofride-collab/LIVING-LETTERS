package com.livingletters.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FactureDTO {
    private Long id;
    private LocalDate date;
    private LocalTime heure;
    private String numFacture;
    private Long commandeId;
}
