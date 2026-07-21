package com.livingletters.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LigneCommandeDTO {
    private Long livreId;
    private LivreDTO livre;
    private Integer qte;
    private BigDecimal prixUnitaire;
}
