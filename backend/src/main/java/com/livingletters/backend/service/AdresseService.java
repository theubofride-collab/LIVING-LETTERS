package com.livingletters.backend.service;

import com.livingletters.backend.dto.AdresseLivraisonDTO;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.AdresseMapper;
import com.livingletters.backend.model.AdresseLivraison;
import com.livingletters.backend.model.Utilisateur;
import com.livingletters.backend.repository.AdresseLivraisonRepository;
import com.livingletters.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdresseService {

    private final AdresseLivraisonRepository adresseRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final AdresseMapper adresseMapper;

    @Transactional(readOnly = true)
    public List<AdresseLivraisonDTO> getAll(String email) {
        return adresseRepository.findByUtilisateurEmail(email).stream()
                .map(adresseMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdresseLivraisonDTO getById(Long id, String email) {
        AdresseLivraison adresse = adresseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adresse", id));
        if (!adresse.getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Adresse", id);
        }
        return adresseMapper.toDTO(adresse);
    }

    @Transactional
    public AdresseLivraisonDTO create(AdresseLivraisonDTO dto, String email) {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        AdresseLivraison adresse = adresseMapper.toEntity(dto);
        adresse.setId(null);
        adresse.setUtilisateur(utilisateur);
        adresse = adresseRepository.save(adresse);
        return adresseMapper.toDTO(adresse);
    }

    @Transactional
    public AdresseLivraisonDTO update(Long id, AdresseLivraisonDTO dto, String email) {
        AdresseLivraison adresse = adresseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adresse", id));
        if (!adresse.getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Adresse", id);
        }
        adresseMapper.updateEntity(adresse, dto);
        adresse = adresseRepository.save(adresse);
        return adresseMapper.toDTO(adresse);
    }

    @Transactional
    public void delete(Long id, String email) {
        AdresseLivraison adresse = adresseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adresse", id));
        if (!adresse.getUtilisateur().getEmail().equals(email)) {
            throw new ResourceNotFoundException("Adresse", id);
        }
        adresseRepository.deleteById(id);
    }
}
