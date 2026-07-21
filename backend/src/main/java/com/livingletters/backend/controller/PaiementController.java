package com.livingletters.backend.controller;

import com.livingletters.backend.dto.PaiementDTO;
import com.livingletters.backend.dto.PaiementRequest;
import com.livingletters.backend.service.PaiementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Tag(name = "Paiements", description = "Paiement des commandes")
public class PaiementController {

    private final PaiementService paiementService;

    @PostMapping("/v1/commandes/{commandeId}/paiement")
    @Operation(summary = "Payer une commande", description = "Enregistre le paiement pour la commande spécifiée. Uniquement le propriétaire de la commande peut payer.")
    public ResponseEntity<PaiementDTO> payer(
            @PathVariable Long commandeId,
            @Valid @RequestBody PaiementRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        PaiementDTO paiement = paiementService.payer(commandeId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(paiement);
    }
}
