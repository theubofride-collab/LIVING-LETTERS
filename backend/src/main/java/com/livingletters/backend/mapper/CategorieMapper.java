package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.CategorieDTO;
import com.livingletters.backend.model.Categorie;
import org.springframework.stereotype.Component;

@Component
public class CategorieMapper {

    public CategorieDTO toDTO(Categorie categorie) {
        if (categorie == null) return null;
        return CategorieDTO.builder()
                .id(categorie.getId())
                .nom(categorie.getNom())
                .description(categorie.getDescription())
                .build();
    }

    public Categorie toEntity(CategorieDTO dto) {
        if (dto == null) return null;
        return Categorie.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .description(dto.getDescription())
                .build();
    }

    public void updateEntity(Categorie categorie, CategorieDTO dto) {
        if (dto.getNom() != null) categorie.setNom(dto.getNom());
        if (dto.getDescription() != null) categorie.setDescription(dto.getDescription());
    }
}
