package com.livingletters.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuteurDTO {
    private Long id;
    @NotBlank(message = "Le nom de l'auteur est obligatoire")
    private String nom;
    private String description;
    private String profession;
}
