package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.ContenuPanierDTO;
import com.livingletters.backend.dto.PanierDTO;
import com.livingletters.backend.model.ContenuPanier;
import com.livingletters.backend.model.Panier;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class PanierMapper {

    private final LivreMapper livreMapper;

    public PanierMapper(LivreMapper livreMapper) {
        this.livreMapper = livreMapper;
    }

    public PanierDTO toDTO(Panier panier) {
        if (panier == null) return null;
        return PanierDTO.builder()
                .id(panier.getId())
                .nom(panier.getNom())
                .dateCreation(panier.getDateCreation())
                .utilisateurId(panier.getUtilisateur() != null ? panier.getUtilisateur().getId() : null)
                .contenus(panier.getContenus() != null
                        ? panier.getContenus().stream().map(this::toContenuDTO).collect(Collectors.toList())
                        : Collections.emptyList())
                .build();
    }

    public ContenuPanierDTO toContenuDTO(ContenuPanier contenu) {
        if (contenu == null) return null;
        return ContenuPanierDTO.builder()
                .id(contenu.getId())
                .qte(contenu.getQte())
                .panierId(contenu.getPanier() != null ? contenu.getPanier().getId() : null)
                .livreId(contenu.getLivre() != null ? contenu.getLivre().getId() : null)
                .livre(contenu.getLivre() != null ? livreMapper.toDTO(contenu.getLivre()) : null)
                .build();
    }
}
