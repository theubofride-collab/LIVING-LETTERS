package com.livingletters.backend.controller;

import com.livingletters.backend.dto.AddPanierItemRequest;
import com.livingletters.backend.dto.ContenuPanierDTO;
import com.livingletters.backend.dto.PanierDTO;
import com.livingletters.backend.dto.UpdatePanierItemRequest;
import com.livingletters.backend.service.PanierService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/panier")
@RequiredArgsConstructor
@Tag(name = "Panier", description = "Gestion du panier d'achat de l'utilisateur connecté")
public class PanierController {

    private final PanierService panierService;

    @GetMapping
    @Operation(summary = "Obtenir le panier", description = "Retourne le panier de l'utilisateur connecté (créé automatiquement si inexistant)")
    public ResponseEntity<PanierDTO> getPanier(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(panierService.getPanier(userDetails.getUsername()));
    }

    @PostMapping("/items")
    @Operation(summary = "Ajouter un livre au panier", description = "Incrémente la quantité si le livre est déjà dans le panier")
    public ResponseEntity<ContenuPanierDTO> addItem(@Valid @RequestBody AddPanierItemRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        ContenuPanierDTO added = panierService.addItem(request, userDetails.getUsername());
        return ResponseEntity.ok(added);
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Modifier la quantité d'un article du panier")
    public ResponseEntity<ContenuPanierDTO> updateItem(@PathVariable Long itemId, @Valid @RequestBody UpdatePanierItemRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        ContenuPanierDTO updated = panierService.updateItem(itemId, request, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Supprimer un article du panier")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId, @AuthenticationPrincipal UserDetails userDetails) {
        panierService.removeItem(itemId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
