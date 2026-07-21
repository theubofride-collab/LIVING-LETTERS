package com.livingletters.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdresseLivraisonDTO {
    private Long id;

    @NotNull(message = "La rue est requise")
    private String rue;

    @NotNull(message = "La ville est requise")
    private String ville;

    @NotNull(message = "Le pays est requis")
    private String pays;
}
