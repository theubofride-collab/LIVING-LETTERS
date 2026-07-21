package com.livingletters.backend.controller;

import com.livingletters.backend.dto.AdresseLivraisonDTO;
import com.livingletters.backend.service.AdresseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/adresses")
@RequiredArgsConstructor
@Tag(name = "Adresses de livraison", description = "Gestion des adresses de livraison de l'utilisateur connecté")
public class AdresseController {

    private final AdresseService adresseService;

    @GetMapping
    @Operation(summary = "Mes adresses", description = "Retourne les adresses de l'utilisateur connecté")
    public ResponseEntity<List<AdresseLivraisonDTO>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(adresseService.getAll(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une adresse par ID")
    public ResponseEntity<AdresseLivraisonDTO> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(adresseService.getById(id, userDetails.getUsername()));
    }

    @PostMapping
    @Operation(summary = "Créer une adresse de livraison")
    public ResponseEntity<AdresseLivraisonDTO> create(@Valid @RequestBody AdresseLivraisonDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        AdresseLivraisonDTO created = adresseService.create(dto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une adresse de livraison")
    public ResponseEntity<AdresseLivraisonDTO> update(@PathVariable Long id, @Valid @RequestBody AdresseLivraisonDTO dto, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(adresseService.update(id, dto, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une adresse de livraison")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        adresseService.delete(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
