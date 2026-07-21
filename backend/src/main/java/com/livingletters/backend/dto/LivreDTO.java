package com.livingletters.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LivreDTO {
    private Long id;
    @NotBlank(message = "Le nom du livre est obligatoire")
    private String nom;
    private String description;
    @PositiveOrZero(message = "Le stock ne peut pas être négatif")
    private Integer stock;
    @NotNull(message = "Le prix est obligatoire")
    @Positive(message = "Le prix doit être positif")
    private BigDecimal prix;
    private String couverture;
    private String slug;
    private Long categorieId;
    private CategorieDTO categorie;
    private List<AuteurDTO> auteurs;
    private Double notemoyenne;
    private Long nbCommentaires;
}
