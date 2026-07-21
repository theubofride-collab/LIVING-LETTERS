package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.FactureDTO;
import com.livingletters.backend.model.Facture;
import org.springframework.stereotype.Component;

@Component
public class FactureMapper {

    public FactureDTO toDTO(Facture facture) {
        if (facture == null) return null;
        return FactureDTO.builder()
                .id(facture.getId())
                .date(facture.getDate())
                .heure(facture.getHeure())
                .numFacture(facture.getNumFacture())
                .commandeId(facture.getCommande() != null ? facture.getCommande().getId() : null)
                .build();
    }
}
