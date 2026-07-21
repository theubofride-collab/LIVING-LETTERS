package com.livingletters.backend.controller;

import com.livingletters.backend.dto.CategorieDTO;
import com.livingletters.backend.service.CategorieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/categories")
@RequiredArgsConstructor
@Tag(name = "Catégories", description = "Gestion des catégories de livres — lecture publique, écriture ADMIN")
public class CategorieController {

    private final CategorieService categorieService;

    @GetMapping
    @Operation(summary = "Lister toutes les catégories")
    public ResponseEntity<List<CategorieDTO>> getAll() {
        return ResponseEntity.ok(categorieService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une catégorie par ID")
    public ResponseEntity<CategorieDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(categorieService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Créer une catégorie", description = "ADMIN uniquement")
    public ResponseEntity<CategorieDTO> create(@Valid @RequestBody CategorieDTO dto) {
        CategorieDTO created = categorieService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une catégorie", description = "ADMIN uniquement")
    public ResponseEntity<CategorieDTO> update(@PathVariable Long id, @Valid @RequestBody CategorieDTO dto) {
        return ResponseEntity.ok(categorieService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer une catégorie", description = "ADMIN uniquement")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        categorieService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
