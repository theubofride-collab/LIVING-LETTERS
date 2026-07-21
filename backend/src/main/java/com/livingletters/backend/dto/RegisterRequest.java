package com.livingletters.backend.dto;

import com.livingletters.backend.model.Role;
import com.livingletters.backend.model.Sexe;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Le nom est requis")
    private String nom;

    @NotBlank(message = "L'adresse email est requise")
    @Email(message = "L'adresse email est invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String motDePasse;

    @NotNull(message = "Le sexe est requis")
    private Sexe sexe;

    private Role role; // Defaults to CLIENT in service if null
}
