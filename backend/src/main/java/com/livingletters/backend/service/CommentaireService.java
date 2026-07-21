package com.livingletters.backend.service;

import com.livingletters.backend.dto.CommentaireDTO;
import com.livingletters.backend.dto.CreateCommentaireRequest;
import com.livingletters.backend.exception.ConflictException;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.CommentaireMapper;
import com.livingletters.backend.model.Commentaire;
import com.livingletters.backend.model.Livre;
import com.livingletters.backend.model.Role;
import com.livingletters.backend.model.Utilisateur;
import com.livingletters.backend.repository.CommentaireRepository;
import com.livingletters.backend.repository.LivreRepository;
import com.livingletters.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentaireService {

    private final CommentaireRepository commentaireRepository;
    private final LivreRepository livreRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CommentaireMapper commentaireMapper;

    @Transactional(readOnly = true)
    public List<CommentaireDTO> getByLivre(Long livreId) {
        if (!livreRepository.existsById(livreId)) {
            throw new ResourceNotFoundException("Livre", livreId);
        }
        return commentaireRepository.findByLivreIdOrderByDateAvisDesc(livreId).stream()
                .map(commentaireMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentaireDTO create(Long livreId, CreateCommentaireRequest request, String email) {
        Livre livre = livreRepository.findById(livreId)
                .orElseThrow(() -> new ResourceNotFoundException("Livre", livreId));

        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        Commentaire commentaire = Commentaire.builder()
                .note(request.getNote())
                .commentaire(request.getCommentaire())
                .dateAvis(LocalDateTime.now())
                .livre(livre)
                .utilisateur(utilisateur)
                .build();

        commentaire = commentaireRepository.save(commentaire);
        return commentaireMapper.toDTO(commentaire);
    }

    @Transactional
    public CommentaireDTO update(Long id, CreateCommentaireRequest request, String email, Role role) {
        Commentaire commentaire = commentaireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire", id));

        if (!commentaire.getUtilisateur().getEmail().equals(email) && role != Role.ADMIN) {
            throw new ConflictException("Vous ne pouvez modifier que vos propres commentaires");
        }

        commentaire.setNote(request.getNote());
        commentaire.setCommentaire(request.getCommentaire());
        commentaire = commentaireRepository.save(commentaire);
        return commentaireMapper.toDTO(commentaire);
    }

    @Transactional
    public void delete(Long id, String email, Role role) {
        Commentaire commentaire = commentaireRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commentaire", id));

        if (!commentaire.getUtilisateur().getEmail().equals(email) && role != Role.ADMIN) {
            throw new ConflictException("Vous ne pouvez supprimer que vos propres commentaires");
        }

        commentaireRepository.deleteById(id);
    }
}
