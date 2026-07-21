package com.livingletters.backend.dto;

import com.livingletters.backend.model.ModePaiement;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementRequest {
    @NotNull(message = "Le montant est requis")
    private BigDecimal montant;

    @NotNull(message = "Le mode de paiement est requis")
    private ModePaiement modePaiement;

    private String numeroTelephone;
}
