package com.livingletters.backend.mapper;

import com.livingletters.backend.dto.UtilisateurDTO;
import com.livingletters.backend.model.Utilisateur;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {

    public UtilisateurDTO toUtilisateurDTO(Utilisateur utilisateur) {
        if (utilisateur == null) return null;
        return UtilisateurDTO.builder()
                .id(utilisateur.getId())
                .nom(utilisateur.getNom())
                .sexe(utilisateur.getSexe())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole())
                .build();
    }
}
