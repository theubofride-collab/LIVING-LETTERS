package com.livingletters.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContenuPanierDTO {
    private Long id;
    private Integer qte;
    private Long panierId;
    private Long livreId;
    private LivreDTO livre;
}
