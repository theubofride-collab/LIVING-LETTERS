package com.livingletters.backend.controller;

import com.livingletters.backend.dto.CommentaireDTO;
import com.livingletters.backend.dto.CreateCommentaireRequest;
import com.livingletters.backend.model.Role;
import com.livingletters.backend.service.CommentaireService;
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
@RequiredArgsConstructor
@Tag(name = "Commentaires", description = "Avis et commentaires sur les livres")
public class CommentaireController {

    private final CommentaireService commentaireService;

    @GetMapping("/v1/livres/{livreId}/commentaires")
    @Operation(summary = "Obtenir les commentaires d'un livre")
    public ResponseEntity<List<CommentaireDTO>> getByLivre(@PathVariable Long livreId) {
        return ResponseEntity.ok(commentaireService.getByLivre(livreId));
    }

    @PostMapping("/v1/livres/{livreId}/commentaires")
    @Operation(summary = "Ajouter un commentaire", description = "Authentification requise")
    public ResponseEntity<CommentaireDTO> create(
            @PathVariable Long livreId,
            @Valid @RequestBody CreateCommentaireRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        CommentaireDTO created = commentaireService.create(livreId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/v1/commentaires/{id}")
    @Operation(summary = "Modifier un commentaire", description = "Auteur du commentaire ou ADMIN uniquement")
    public ResponseEntity<CommentaireDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateCommentaireRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Role role = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? Role.ADMIN : Role.CLIENT;
        return ResponseEntity.ok(commentaireService.update(id, request, userDetails.getUsername(), role));
    }

    @DeleteMapping("/v1/commentaires/{id}")
    @Operation(summary = "Supprimer un commentaire", description = "Auteur du commentaire ou ADMIN uniquement")
    public ResponseEntity<Void> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Role role = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")) ? Role.ADMIN : Role.CLIENT;
        commentaireService.delete(id, userDetails.getUsername(), role);
        return ResponseEntity.noContent().build();
    }
}
