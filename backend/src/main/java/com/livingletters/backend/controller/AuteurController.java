package com.livingletters.backend.controller;

import com.livingletters.backend.dto.AuteurDTO;
import com.livingletters.backend.service.AuteurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/auteurs")
@RequiredArgsConstructor
@Tag(name = "Auteurs", description = "Gestion des auteurs — lecture publique, écriture ADMIN")
public class AuteurController {

    private final AuteurService auteurService;

    @GetMapping
    @Operation(summary = "Lister tous les auteurs")
    public ResponseEntity<List<AuteurDTO>> getAll() {
        return ResponseEntity.ok(auteurService.getAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un auteur par ID")
    public ResponseEntity<AuteurDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(auteurService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Créer un auteur", description = "ADMIN uniquement")
    public ResponseEntity<AuteurDTO> create(@Valid @RequestBody AuteurDTO dto) {
        AuteurDTO created = auteurService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier un auteur", description = "ADMIN uniquement")
    public ResponseEntity<AuteurDTO> update(@PathVariable Long id, @Valid @RequestBody AuteurDTO dto) {
        return ResponseEntity.ok(auteurService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un auteur", description = "ADMIN uniquement")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        auteurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
