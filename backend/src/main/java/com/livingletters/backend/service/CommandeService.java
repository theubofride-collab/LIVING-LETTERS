package com.livingletters.backend.service;

import com.livingletters.backend.dto.CommandeDTO;
import com.livingletters.backend.dto.PasserCommandeRequest;
import com.livingletters.backend.dto.StatutRequest;
import com.livingletters.backend.exception.ConflictException;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.CommandeMapper;
import com.livingletters.backend.model.*;
import com.livingletters.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommandeService {

    private final CommandeRepository commandeRepository;
    private final PanierRepository panierRepository;
    private final ContenuPanierRepository contenuPanierRepository;
    private final AdresseLivraisonRepository adresseRepository;
    private final LivreRepository livreRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final CommandeMapper commandeMapper;

    @Transactional
    public CommandeDTO passerCommande(PasserCommandeRequest request, String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        Panier panier = panierRepository.findByUtilisateurEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Le panier est vide"));

        if (panier.getContenus() == null || panier.getContenus().isEmpty()) {
            throw new ConflictException("Le panier est vide");
        }

        AdresseLivraison adresse = adresseRepository.findById(request.getAdresseId())
                .orElseThrow(() -> new ResourceNotFoundException("Adresse", request.getAdresseId()));

        if (!adresse.getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Adresse", request.getAdresseId());
        }

        BigDecimal montantTotal = BigDecimal.ZERO;
        List<LigneCommande> lignes = new ArrayList<>();

        for (ContenuPanier contenu : panier.getContenus()) {
            Livre livre = contenu.getLivre();
            if (livre.getStock() < contenu.getQte()) {
                throw new ConflictException("Stock insuffisant pour le livre: " + livre.getNom());
            }

            BigDecimal prixLigne = livre.getPrix().multiply(BigDecimal.valueOf(contenu.getQte()));
            montantTotal = montantTotal.add(prixLigne);

            LigneCommande ligne = LigneCommande.builder()
                    .livre(livre)
                    .qte(contenu.getQte())
                    .prixUnitaire(livre.getPrix())
                    .build();
            lignes.add(ligne);

            livre.setStock(livre.getStock() - contenu.getQte());
            livreRepository.save(livre);
        }

        Commande commande = Commande.builder()
                .dateCommande(LocalDateTime.now())
                .statut(CommandeStatut.EN_ATTENTE)
                .montantTotal(montantTotal)
                .utilisateur(utilisateur)
                .adresse(adresse)
                .lignes(new ArrayList<>())
                .build();
        commande = commandeRepository.save(commande);

        for (LigneCommande ligne : lignes) {
            ligne.setCommande(commande);
            commande.getLignes().add(ligne);
        }
        commande = commandeRepository.save(commande);

        contenuPanierRepository.deleteByPanierId(panier.getId());
        panier.getContenus().clear();

        return commandeMapper.toDTO(commande);
    }

    @Transactional(readOnly = true)
    public Page<CommandeDTO> getAll(String email, Role role, int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        Page<Commande> commandes;

        if (role == Role.ADMIN) {
            commandes = commandeRepository.findAll(pageable);
        } else {
            commandes = commandeRepository.findByUtilisateurEmail(email, pageable);
        }

        return commandes.map(commandeMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public CommandeDTO getById(Long id, String email, Role role) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", id));
        if (role != Role.ADMIN && !commande.getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Commande", id);
        }
        return commandeMapper.toDTO(commande);
    }

    @Transactional
    public CommandeDTO updateStatut(Long id, StatutRequest request) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", id));
        commande.setStatut(request.getStatut());
        commande = commandeRepository.save(commande);
        return commandeMapper.toDTO(commande);
    }

    @Transactional
    public void annuler(Long id, String email) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", id));

        if (!commande.getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Commande", id);
        }

        if (commande.getStatut() != CommandeStatut.EN_ATTENTE) {
            throw new ConflictException("Seules les commandes en attente peuvent être annulées");
        }

        commande.setStatut(CommandeStatut.ANNULEE);
        commandeRepository.save(commande);
    }

    private Pageable buildPageable(int page, int size, String sort) {
        if (sort != null && !sort.isBlank()) {
            String[] parts = sort.split(",");
            String field = parts[0];
            Sort.Direction direction = parts.length > 1 && "desc".equalsIgnoreCase(parts[1])
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            return PageRequest.of(page, size, Sort.by(direction, field));
        }
        return PageRequest.of(page, size, Sort.by("id"));
    }
}
