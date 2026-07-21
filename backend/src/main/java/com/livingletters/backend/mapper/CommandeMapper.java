package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.AdresseLivraisonDTO;
import com.livingletters.backend.dto.CommandeDTO;
import com.livingletters.backend.dto.LigneCommandeDTO;
import com.livingletters.backend.model.AdresseLivraison;
import com.livingletters.backend.model.Commande;
import com.livingletters.backend.model.LigneCommande;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class CommandeMapper {

    private final LivreMapper livreMapper;

    public CommandeMapper(LivreMapper livreMapper) {
        this.livreMapper = livreMapper;
    }

    public CommandeDTO toDTO(Commande commande) {
        if (commande == null) return null;
        return CommandeDTO.builder()
                .id(commande.getId())
                .dateCommande(commande.getDateCommande())
                .statut(commande.getStatut())
                .montantTotal(commande.getMontantTotal())
                .utilisateurId(commande.getUtilisateur() != null ? commande.getUtilisateur().getId() : null)
                .adresseId(commande.getAdresse() != null ? commande.getAdresse().getId() : null)
                .adresse(toAdresseDTO(commande.getAdresse()))
                .lignes(toLigneDTOs(commande.getLignes()))
                .build();
    }

    public List<LigneCommandeDTO> toLigneDTOs(List<LigneCommande> lignes) {
        if (lignes == null) return Collections.emptyList();
        return lignes.stream().map(this::toLigneDTO).collect(Collectors.toList());
    }

    public LigneCommandeDTO toLigneDTO(LigneCommande ligne) {
        if (ligne == null) return null;
        return LigneCommandeDTO.builder()
                .livreId(ligne.getLivre() != null ? ligne.getLivre().getId() : null)
                .livre(ligne.getLivre() != null ? livreMapper.toDTO(ligne.getLivre()) : null)
                .qte(ligne.getQte())
                .prixUnitaire(ligne.getPrixUnitaire())
                .build();
    }

    private AdresseLivraisonDTO toAdresseDTO(AdresseLivraison adresse) {
        if (adresse == null) return null;
        return AdresseLivraisonDTO.builder()
                .id(adresse.getId())
                .rue(adresse.getRue())
                .ville(adresse.getVille())
                .pays(adresse.getPays())
                .build();
    }
}
