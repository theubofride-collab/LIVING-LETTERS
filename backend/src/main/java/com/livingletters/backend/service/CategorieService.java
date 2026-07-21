package com.livingletters.backend.service;

import com.livingletters.backend.dto.CategorieDTO;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.CategorieMapper;
import com.livingletters.backend.model.Categorie;
import com.livingletters.backend.repository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategorieService {

    private final CategorieRepository categorieRepository;
    private final CategorieMapper categorieMapper;

    @Transactional(readOnly = true)
    public List<CategorieDTO> getAll() {
        return categorieRepository.findAll().stream()
                .map(categorieMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategorieDTO getById(Long id) {
        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categorie", id));
        return categorieMapper.toDTO(categorie);
    }

    @Transactional
    public CategorieDTO create(CategorieDTO dto) {
        Categorie categorie = categorieMapper.toEntity(dto);
        categorie.setId(null);
        categorie = categorieRepository.save(categorie);
        return categorieMapper.toDTO(categorie);
    }

    @Transactional
    public CategorieDTO update(Long id, CategorieDTO dto) {
        Categorie categorie = categorieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categorie", id));
        categorieMapper.updateEntity(categorie, dto);
        categorie = categorieRepository.save(categorie);
        return categorieMapper.toDTO(categorie);
    }

    @Transactional
    public void delete(Long id) {
        if (!categorieRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categorie", id);
        }
        categorieRepository.deleteById(id);
    }
}
