package com.livingletters.backend.controller;

import com.livingletters.backend.dto.FactureDTO;
import com.livingletters.backend.model.Role;
import com.livingletters.backend.service.FactureService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Factures", description = "Factures et téléchargement PDF")
public class FactureController {

    private final FactureService factureService;

    @GetMapping("/v1/factures")
    @Operation(summary = "Lister les factures", description = "CLIENT: ses factures / ADMIN: toutes les factures")
    public ResponseEntity<List<FactureDTO>> getAll(@AuthenticationPrincipal UserDetails userDetails) {
        Role role = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? Role.ADMIN : Role.CLIENT;
        return ResponseEntity.ok(factureService.getAll(userDetails.getUsername(), role));
    }

    @GetMapping("/v1/factures/{id}")
    @Operation(summary = "Obtenir une facture par ID", description = "CLIENT: uniquement ses propres factures / ADMIN: toutes")
    public ResponseEntity<FactureDTO> getById(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Role role = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? Role.ADMIN : Role.CLIENT;
        return ResponseEntity.ok(factureService.getById(id, userDetails.getUsername(), role));
    }

    @GetMapping("/v1/factures/{id}/pdf")
    @Operation(summary = "Télécharger la facture en PDF", description = "Retourne un fichier PDF de la facture")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Role role = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? Role.ADMIN : Role.CLIENT;
        byte[] pdf = factureService.downloadPdf(id, userDetails.getUsername(), role);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "facture-" + id + ".pdf");
        return new ResponseEntity<>(pdf, headers, HttpStatus.OK);
    }

    @PostMapping("/v1/commandes/{commandeId}/facture")
    @Operation(summary = "Générer une facture", description = "ADMIN uniquement — génère la facture pour une commande validée")
    public ResponseEntity<FactureDTO> generer(@PathVariable Long commandeId) {
        FactureDTO facture = factureService.generer(commandeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(facture);
    }
}
