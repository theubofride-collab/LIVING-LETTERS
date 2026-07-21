package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.CommentaireDTO;
import com.livingletters.backend.dto.UtilisateurDTO;
import com.livingletters.backend.model.Commentaire;
import com.livingletters.backend.model.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class CommentaireMapper {

    public CommentaireDTO toDTO(Commentaire commentaire) {
        if (commentaire == null) return null;
        return CommentaireDTO.builder()
                .id(commentaire.getId())
                .note(commentaire.getNote())
                .commentaire(commentaire.getCommentaire())
                .dateAvis(commentaire.getDateAvis())
                .livreId(commentaire.getLivre() != null ? commentaire.getLivre().getId() : null)
                .utilisateurId(commentaire.getUtilisateur() != null ? commentaire.getUtilisateur().getId() : null)
                .utilisateur(toUtilisateurDTO(commentaire.getUtilisateur()))
                .build();
    }

    private UtilisateurDTO toUtilisateurDTO(Utilisateur utilisateur) {
        if (utilisateur == null) return null;
        return UtilisateurDTO.builder()
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .email(utilisateur.getEmail())
                .build();
    }
}
