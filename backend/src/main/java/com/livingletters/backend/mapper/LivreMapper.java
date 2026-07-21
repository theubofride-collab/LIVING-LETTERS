package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.AuteurDTO;
import com.livingletters.backend.dto.CategorieDTO;
import com.livingletters.backend.dto.LivreDTO;
import com.livingletters.backend.model.Auteur;
import com.livingletters.backend.model.Categorie;
import com.livingletters.backend.model.Livre;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class LivreMapper {

    public LivreDTO toDTO(Livre livre) {
        return toDTO(livre, null, null);
    }

    public LivreDTO toDTO(Livre livre, Double notemoyenne, Long nbCommentaires) {
        if (livre == null) return null;
        return LivreDTO.builder()
                .id(livre.getId())
                .nom(livre.getNom())
                .description(livre.getDescription())
                .stock(livre.getStock())
                .prix(livre.getPrix())
                .couverture(livre.getCouverture())
                .slug(livre.getSlug())
                .categorieId(livre.getCategorie() != null ? livre.getCategorie().getId() : null)
                .categorie(toCategorieDTO(livre.getCategorie()))
                .auteurs(toAuteurDTOs(livre.getAuteurs()))
                .notemoyenne(notemoyenne)
                .nbCommentaires(nbCommentaires != null ? nbCommentaires : 0L)
                .build();
    }

    public Livre toEntity(LivreDTO dto) {
        if (dto == null) return null;
        return Livre.builder()
                .id(dto.getId())
                .nom(dto.getNom())
                .description(dto.getDescription())
                .stock(dto.getStock())
                .prix(dto.getPrix())
                .couverture(dto.getCouverture())
                .slug(dto.getSlug())
                .build();
    }

    public void updateEntity(Livre livre, LivreDTO dto) {
        if (dto.getNom() != null) livre.setNom(dto.getNom());
        if (dto.getDescription() != null) livre.setDescription(dto.getDescription());
        if (dto.getStock() != null) livre.setStock(dto.getStock());
        if (dto.getPrix() != null) livre.setPrix(dto.getPrix());
        if (dto.getCouverture() != null) livre.setCouverture(dto.getCouverture());
    }

    private CategorieDTO toCategorieDTO(Categorie categorie) {
        if (categorie == null) return null;
        return CategorieDTO.builder()
                .id(categorie.getId())
                .nom(categorie.getNom())
                .description(categorie.getDescription())
                .build();
    }

    private List<AuteurDTO> toAuteurDTOs(List<Auteur> auteurs) {
        if (auteurs == null) return Collections.emptyList();
        return auteurs.stream().map(a -> AuteurDTO.builder()
                .id(a.getId())
                .nom(a.getNom())
                .description(a.getDescription())
                .profession(a.getProfession())
                .build()
        ).collect(Collectors.toList());
    }
}
