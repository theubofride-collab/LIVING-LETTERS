package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.AuteurDTO;
import com.livingletters.backend.model.Auteur;
import org.springframework.stereotype.Component;

@Component
public class AuteurMapper {

    public AuteurDTO toDTO(Auteur auteur) {
        if (auteur == null) return null;
        return AuteurDTO.builder()
                .id(auteur.getId())
                .nom(auteur.getNom())
                .description(auteur.getDescription())
                .profession(auteur.getProfession())
                .build();
    }

    public Auteur toEntity(AuteurDTO dto) {
        if (dto == null) return null;
        return Auteur.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .description(dto.getDescription())
                .profession(dto.getProfession())
                .build();
    }

    public void updateEntity(Auteur auteur, AuteurDTO dto) {
        if (dto.getNom() != null) auteur.setNom(dto.getNom());
        if (dto.getDescription() != null) auteur.setDescription(dto.getDescription());
        if (dto.getProfession() != null) auteur.setProfession(dto.getProfession());
    }
}
