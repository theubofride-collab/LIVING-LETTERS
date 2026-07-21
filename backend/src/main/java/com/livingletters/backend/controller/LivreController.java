package com.livingletters.backend.controller;

import com.livingletters.backend.dto.LivreDTO;
import com.livingletters.backend.service.LivreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/v1/livres")
@RequiredArgsConstructor
@Tag(name = "Livres", description = "Catalogue de livres — lecture publique, écriture ADMIN")
public class LivreController {

    private final LivreService livreService;

    @GetMapping
    @Operation(summary = "Lister les livres", description = "Recherche avec filtres (catégorie, auteur, mot-clé, fourchette de prix) et pagination")
    public ResponseEntity<Page<LivreDTO>> getAll(
            @RequestParam(required = false) Long categorieId,
            @RequestParam(required = false) Long auteurId,
            @RequestParam(required = false) String q,
            @RequestParam(required = false) BigDecimal minPrix,
            @RequestParam(required = false) BigDecimal maxPrix,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sort
    ) {
        return ResponseEntity.ok(livreService.getAll(categorieId, auteurId, q, minPrix, maxPrix, page, size, sort));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un livre par ID")
    public ResponseEntity<LivreDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(livreService.getById(id));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Obtenir un livre par slug", description = "Utilisé pour les URLs友好的 du frontend")
    public ResponseEntity<LivreDTO> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(livreService.getBySlug(slug));
    }

    @PostMapping
    @Operation(summary = "Créer un livre", description = "ADMIN uniquement")
    public ResponseEntity<LivreDTO> create(@Valid @RequestBody LivreDTO dto) {
        LivreDTO created = livreService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un livre", description = "ADMIN uniquement")
    public ResponseEntity<LivreDTO> update(@PathVariable Long id, @Valid @RequestBody LivreDTO dto) {
        return ResponseEntity.ok(livreService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un livre", description = "ADMIN uniquement")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        livreService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
