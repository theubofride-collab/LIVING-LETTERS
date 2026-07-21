package com.livingletters.backend.dto;

import com.livingletters.backend.model.Role;
import com.livingletters.backend.model.Sexe;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {
    private Long id;
    private String nom;
    private Sexe sexe;
    private String email;
    private Role role;
}
