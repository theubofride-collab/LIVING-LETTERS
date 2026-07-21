package com.livingletters.backend.service;

import com.livingletters.backend.dto.PaiementDTO;
import com.livingletters.backend.dto.PaiementRequest;
import com.livingletters.backend.exception.ConflictException;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.PaiementMapper;
import com.livingletters.backend.model.Commande;
import com.livingletters.backend.model.Paiement;
import com.livingletters.backend.repository.CommandeRepository;
import com.livingletters.backend.repository.PaiementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaiementService {

    private final PaiementRepository paiementRepository;
    private final CommandeRepository commandeRepository;
    private final PaiementMapper paiementMapper;

    @Transactional
    public PaiementDTO payer(Long commandeId, PaiementRequest request, String email) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new ResourceNotFoundException("Commande", commandeId));

        if (!commande.getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Commande", commandeId);
        }

        if (commande.getPaiement() != null) {
            throw new ConflictException("Cette commande a déjà été payée");
        }

        Paiement paiement = Paiement.builder()
                .montant(request.getMontant())
                .modePaiement(request.getModePaiement())
                .numeroTelephone(request.getNumeroTelephone())
                .commande(commande)
                .build();

        paiement = paiementRepository.save(paiement);
        return paiementMapper.toDTO(paiement);
    }
}
