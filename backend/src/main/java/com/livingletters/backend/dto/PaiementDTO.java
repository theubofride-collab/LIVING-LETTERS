package com.livingletters.backend.dto;

import com.livingletters.backend.model.ModePaiement;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaiementDTO {
    private Long id;
    private BigDecimal montant;
    private ModePaiement modePaiement;
    private Long commandeId;
}
