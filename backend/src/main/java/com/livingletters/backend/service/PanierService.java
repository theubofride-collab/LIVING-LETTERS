package com.livingletters.backend.service;

import com.livingletters.backend.dto.AddPanierItemRequest;
import com.livingletters.backend.dto.ContenuPanierDTO;
import com.livingletters.backend.dto.PanierDTO;
import com.livingletters.backend.dto.UpdatePanierItemRequest;
import com.livingletters.backend.exception.ConflictException;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.PanierMapper;
import com.livingletters.backend.model.ContenuPanier;
import com.livingletters.backend.model.Livre;
import com.livingletters.backend.model.Panier;
import com.livingletters.backend.model.Utilisateur;
import com.livingletters.backend.repository.ContenuPanierRepository;
import com.livingletters.backend.repository.LivreRepository;
import com.livingletters.backend.repository.PanierRepository;
import com.livingletters.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PanierService {

    private final PanierRepository panierRepository;
    private final ContenuPanierRepository contenuPanierRepository;
    private final LivreRepository livreRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PanierMapper panierMapper;

    @Transactional(readOnly = true)
    public PanierDTO getPanier(String email) {
        Panier panier = getOrCreatePanier(email);
        return panierMapper.toDTO(panier);
    }

    @Transactional
    public ContenuPanierDTO addItem(AddPanierItemRequest request, String email) {
        Panier panier = getOrCreatePanier(email);

        Livre livre = livreRepository.findById(request.getLivreId())
                .orElseThrow(() -> new ResourceNotFoundException("Livre", request.getLivreId()));

        if (livre.getStock() < request.getQte()) {
            throw new ConflictException("Stock insuffisant pour le livre: " + livre.getNom() + " (stock disponible: " + livre.getStock() + ")");
        }

        Optional<ContenuPanier> existing = contenuPanierRepository.findByPanierIdAndLivreId(panier.getId(), livre.getId());

        ContenuPanier contenu;
        if (existing.isPresent()) {
            contenu = existing.get();
            int newQte = contenu.getQte() + request.getQte();
            if (livre.getStock() < newQte) {
                throw new ConflictException("Stock insuffisant pour le livre: " + livre.getNom() + " (stock disponible: " + livre.getStock() + ", quantité demandée: " + newQte + ")");
            }
            contenu.setQte(newQte);
        } else {
            contenu = ContenuPanier.builder()
                    .panier(panier)
                    .livre(livre)
                    .qte(request.getQte())
                    .build();
        }

        contenu = contenuPanierRepository.save(contenu);
        return panierMapper.toContenuDTO(contenu);
    }

    @Transactional
    public ContenuPanierDTO updateItem(Long itemId, UpdatePanierItemRequest request, String email) {
        ContenuPanier contenu = contenuPanierRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Élément du panier", itemId));

        if (!contenu.getPanier().getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Élément du panier", itemId);
        }

        contenu.setQte(request.getQte());
        contenu = contenuPanierRepository.save(contenu);
        return panierMapper.toContenuDTO(contenu);
    }

    @Transactional
    public void removeItem(Long itemId, String email) {
        ContenuPanier contenu = contenuPanierRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Élément du panier", itemId));

        if (!contenu.getPanier().getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Élément du panier", itemId);
        }

        contenuPanierRepository.deleteById(itemId);
    }

    private Panier getOrCreatePanier(String email) {
        return panierRepository.findByUtilisateurEmail(email)
                .orElseGet(() -> {
                    Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                            .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
                    Panier panier = Panier.builder()
                            .nom("Panier de " + utilisateur.getNom())
                            .dateCreation(LocalDateTime.now())
                            .utilisateur(utilisateur)
                            .build();
                    return panierRepository.save(panier);
                });
    }
}
