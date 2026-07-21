package com.livingletters.backend.service;

import com.livingletters.backend.dto.UtilisateurDTO;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.AuthMapper;
import com.livingletters.backend.model.Utilisateur;
import com.livingletters.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final AuthMapper authMapper;

    @Transactional(readOnly = true)
    public Page<UtilisateurDTO> getAll(int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);
        return utilisateurRepository.findAll(pageable).map(authMapper::toUtilisateurDTO);
    }

    @Transactional(readOnly = true)
    public UtilisateurDTO getById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
        return authMapper.toUtilisateurDTO(utilisateur);
    }

    @Transactional
    public UtilisateurDTO update(Long id, UtilisateurDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));

        if (dto.getNom() != null) utilisateur.setNom(dto.getNom());
        if (dto.getSexe() != null) utilisateur.setSexe(dto.getSexe());
        if (dto.getEmail() != null) utilisateur.setEmail(dto.getEmail());
        if (dto.getRole() != null) utilisateur.setRole(dto.getRole());

        utilisateur = utilisateurRepository.save(utilisateur);
        return authMapper.toUtilisateurDTO(utilisateur);
    }

    @Transactional
    public void delete(Long id) {
        if (!utilisateurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utilisateur", id);
        }
        utilisateurRepository.deleteById(id);
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
