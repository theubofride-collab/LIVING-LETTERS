package com.livingletters.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentaireDTO {
    private Long id;
    private Integer note;
    private String commentaire;
    private LocalDateTime dateAvis;
    private Long livreId;
    private Long utilisateurId;
    private UtilisateurDTO utilisateur;
}
