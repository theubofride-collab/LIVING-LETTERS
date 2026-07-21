package com.livingletters.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "L'adresse email est requise")
    @Email(message = "L'adresse email est invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String motDePasse;
}
