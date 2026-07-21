package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.PaiementDTO;
import com.livingletters.backend.model.Paiement;
import org.springframework.stereotype.Component;

@Component
public class PaiementMapper {

    public PaiementDTO toDTO(Paiement paiement) {
        if (paiement == null) return null;
        return PaiementDTO.builder()
                .id(paiement.getId())
                .montant(paiement.getMontant())
                .modePaiement(paiement.getModePaiement())
                .commandeId(paiement.getCommande() != null ? paiement.getCommande().getId() : null)
                .build();
    }
}
