package com.livingletters.backend.controller;

import com.livingletters.backend.dto.CommandeDTO;
import com.livingletters.backend.dto.PasserCommandeRequest;
import com.livingletters.backend.dto.StatutRequest;
import com.livingletters.backend.model.Role;
import com.livingletters.backend.service.CommandeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/commandes")
@RequiredArgsConstructor
@Tag(name = "Commandes", description = "Passer et gérer les commandes")
public class CommandeController {

    private final CommandeService commandeService;

    @PostMapping
    @Operation(summary = "Passer une commande", description = "Crée la commande à partir du panier, décrémente le stock, vide le panier")
    public ResponseEntity<CommandeDTO> passerCommande(@Valid @RequestBody PasserCommandeRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        CommandeDTO commande = commandeService.passerCommande(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(commande);
    }

    @GetMapping
    @Operation(summary = "Lister les commandes", description = "CLIENT: ses commandes / ADMIN: toutes les commandes, paginé")
    public ResponseEntity<Page<CommandeDTO>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Role role = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? Role.ADMIN : Role.CLIENT;
        return ResponseEntity.ok(commandeService.getAll(userDetails.getUsername(), role, page, size, sort));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une commande par ID", description = "CLIENT: uniquement ses propres commandes / ADMIN: toutes")
    public ResponseEntity<CommandeDTO> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Role role = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? Role.ADMIN : Role.CLIENT;
        return ResponseEntity.ok(commandeService.getById(id, userDetails.getUsername(), role));
    }

    @PatchMapping("/{id}/statut")
    @Operation(summary = "Mettre à jour le statut d'une commande", description = "ADMIN uniquement")
    public ResponseEntity<CommandeDTO> updateStatut(@PathVariable Long id, @Valid @RequestBody StatutRequest request) {
        return ResponseEntity.ok(commandeService.updateStatut(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Annuler une commande", description = "Uniquement si le statut est EN_ATTENTE")
    public ResponseEntity<Void> annuler(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        commandeService.annuler(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
