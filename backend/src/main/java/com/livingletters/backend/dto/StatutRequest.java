package com.livingletters.backend.dto;

import com.livingletters.backend.model.CommandeStatut;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatutRequest {
    @NotNull(message = "Le statut est requis")
    private CommandeStatut statut;
}
