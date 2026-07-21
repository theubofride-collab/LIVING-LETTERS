package com.livingletters.backend.service;

import com.livingletters.backend.dto.AuthResponse;
import com.livingletters.backend.dto.LoginRequest;
import com.livingletters.backend.dto.RefreshRequest;
import com.livingletters.backend.dto.RegisterRequest;
import com.livingletters.backend.dto.UtilisateurDTO;
import com.livingletters.backend.exception.ConflictException;
import com.livingletters.backend.mapper.AuthMapper;
import com.livingletters.backend.model.Role;
import com.livingletters.backend.model.Utilisateur;
import com.livingletters.backend.repository.UtilisateurRepository;
import com.livingletters.backend.security.JwtService;
import com.livingletters.backend.security.TokenBlacklistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final AuthMapper authMapper;
    private final TokenBlacklistService tokenBlacklistService;

    @Transactional
    public UtilisateurDTO register(RegisterRequest request) {
        if (utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Un compte existe déjà avec l'email: " + request.getEmail());
        }

        Utilisateur utilisateur = Utilisateur.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .sexe(request.getSexe())
                .role(request.getRole() != null ? request.getRole() : Role.CLIENT)
                .build();

        utilisateurRepository.save(utilisateur);

        return authMapper.toUtilisateurDTO(utilisateur);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getMotDePasse())
        );

        Utilisateur utilisateur = utilisateurRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String accessToken = jwtService.generateAccessToken(utilisateur);
        String refreshToken = jwtService.generateRefreshToken(utilisateur);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .utilisateur(authMapper.toUtilisateurDTO(utilisateur))
                .build();
    }

    public String refresh(RefreshRequest request) {
        String userEmail = jwtService.extractEmail(request.getRefreshToken());

        if (userEmail == null || !jwtService.isTokenValid(request.getRefreshToken())) {
            throw new IllegalArgumentException("Refresh token invalide ou expiré");
        }

        Utilisateur utilisateur = utilisateurRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        return jwtService.generateAccessToken(utilisateur);
    }

    public void logout(String token) {
        tokenBlacklistService.blacklist(token);
    }

    public UtilisateurDTO me(String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        return authMapper.toUtilisateurDTO(utilisateur);
    }
}
