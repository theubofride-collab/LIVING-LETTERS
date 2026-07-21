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
public class PasserCommandeRequest {
    @NotNull(message = "L'identifiant de l'adresse est requis")
    private Long adresseId;
}
