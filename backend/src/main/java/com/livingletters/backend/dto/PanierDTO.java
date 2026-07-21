package com.livingletters.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PanierDTO {
    private Long id;
    private String nom;
    private LocalDateTime dateCreation;
    private Long utilisateurId;
    private List<ContenuPanierDTO> contenus;
}
