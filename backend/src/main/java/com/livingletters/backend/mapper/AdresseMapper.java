package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.AdresseLivraisonDTO;
import com.livingletters.backend.model.AdresseLivraison;
import org.springframework.stereotype.Component;

@Component
public class AdresseMapper {

    public AdresseLivraisonDTO toDTO(AdresseLivraison adresse) {
        if (adresse == null) return null;
        return AdresseLivraisonDTO.builder()
                .id(adresse.getId())
                .rue(adresse.getRue())
                .ville(adresse.getVille())
                .pays(adresse.getPays())
                .build();
    }

    public AdresseLivraison toEntity(AdresseLivraisonDTO dto) {
        if (dto == null) return null;
        return AdresseLivraison.builder()
                .id(dto.getId())
                .rue(dto.getRue())
                .ville(dto.getVille())
                .pays(dto.getPays())
                .build();
    }

    public void updateEntity(AdresseLivraison adresse, AdresseLivraisonDTO dto) {
        if (dto.getRue() != null) adresse.setRue(dto.getRue());
        if (dto.getVille() != null) adresse.setVille(dto.getVille());
        if (dto.getPays() != null) adresse.setPays(dto.getPays());
    }
}
