package com.livingletters.backend.controller;

import com.livingletters.backend.dto.AuthResponse;
import com.livingletters.backend.dto.LoginRequest;
import com.livingletters.backend.dto.RefreshRequest;
import com.livingletters.backend.dto.RegisterRequest;
import com.livingletters.backend.dto.UtilisateurDTO;
import com.livingletters.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Inscription, connexion, rafraîchissement du token et profil utilisateur")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Inscrire un nouveau compte", description = "Crée un nouveau compte CLIENT par défaut")
    public ResponseEntity<UtilisateurDTO> register(@Valid @RequestBody RegisterRequest request) {
        UtilisateurDTO dto = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @PostMapping("/login")
    @Operation(summary = "Se connecter", description = "Authentifie l'utilisateur et retourne les tokens JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Rafraîchir le token d'accès", description = "Échange un refresh token contre un nouveau access token")
    public ResponseEntity<Map<String, String>> refresh(@Valid @RequestBody RefreshRequest request) {
        String accessToken = authService.refresh(request);
        return ResponseEntity.ok(Map.of("accessToken", accessToken));
    }

    @PostMapping("/logout")
    @Operation(summary = "Se déconnecter", description = "Invalide le token JWT courant (blacklist)")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(token);
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    @Operation(summary = "Obtenir le profil utilisateur connecté", description = "Retourne les informations de l'utilisateur authentifié")
    public ResponseEntity<UtilisateurDTO> me(@AuthenticationPrincipal UserDetails userDetails) {
        UtilisateurDTO dto = authService.me(userDetails.getUsername());
        return ResponseEntity.ok(dto);
    }
}
