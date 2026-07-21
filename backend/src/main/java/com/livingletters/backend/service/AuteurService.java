package com.livingletters.backend.service;

import com.livingletters.backend.dto.AuteurDTO;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.AuteurMapper;
import com.livingletters.backend.model.Auteur;
import com.livingletters.backend.repository.AuteurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuteurService {

    private final AuteurRepository auteurRepository;
    private final AuteurMapper auteurMapper;

    @Transactional(readOnly = true)
    public List<AuteurDTO> getAll() {
        return auteurRepository.findAll().stream()
                .map(auteurMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AuteurDTO getById(Long id) {
        Auteur auteur = auteurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auteur", id));
        return auteurMapper.toDTO(auteur);
    }

    @Transactional
    public AuteurDTO create(AuteurDTO dto) {
        Auteur auteur = auteurMapper.toEntity(dto);
        auteur.setId(null);
        auteur = auteurRepository.save(auteur);
        return auteurMapper.toDTO(auteur);
    }

    @Transactional
    public AuteurDTO update(Long id, AuteurDTO dto) {
        Auteur auteur = auteurRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auteur", id));
        auteurMapper.updateEntity(auteur, dto);
        auteur = auteurRepository.save(auteur);
        return auteurMapper.toDTO(auteur);
    }

    @Transactional
    public void delete(Long id) {
        if (!auteurRepository.existsById(id)) {
            throw new ResourceNotFoundException("Auteur", id);
        }
        auteurRepository.deleteById(id);
    }
}
