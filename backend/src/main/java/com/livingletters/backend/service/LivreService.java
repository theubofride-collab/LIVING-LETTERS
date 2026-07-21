package com.livingletters.backend.service;

import com.livingletters.backend.dto.LivreDTO;
import com.livingletters.backend.exception.ResourceNotFoundException;
import com.livingletters.backend.mapper.LivreMapper;
import com.livingletters.backend.model.Auteur;
import com.livingletters.backend.model.Categorie;
import com.livingletters.backend.model.Livre;
import com.livingletters.backend.repository.AuteurRepository;
import com.livingletters.backend.repository.CategorieRepository;
import com.livingletters.backend.repository.CommentaireRepository;
import com.livingletters.backend.repository.LivreRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LivreService {

    private final LivreRepository livreRepository;
    private final CategorieRepository categorieRepository;
    private final AuteurRepository auteurRepository;
    private final CommentaireRepository commentaireRepository;
    private final LivreMapper livreMapper;

    @Transactional(readOnly = true)
    public Page<LivreDTO> getAll(Long categorieId, Long auteurId, String q,
                                  BigDecimal minPrix, BigDecimal maxPrix,
                                  int page, int size, String sort) {
        Pageable pageable = buildPageable(page, size, sort);

        Specification<Livre> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categorieId != null) {
                predicates.add(cb.equal(root.get("categorie").get("id"), categorieId));
            }
            if (auteurId != null) {
                predicates.add(cb.isMember(auteurId, root.get("auteurs").get("id")));
            }
            if (q != null && !q.isBlank()) {
                String pattern = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("nom")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }
            if (minPrix != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("prix"), minPrix));
            }
            if (maxPrix != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("prix"), maxPrix));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Page<Livre> livresPage = livreRepository.findAll(spec, pageable);

        List<Long> livreIds = livresPage.getContent().stream()
                .map(Livre::getId)
                .collect(Collectors.toList());

        Map<Long, double[]> statsMap = fetchCommentaireStats(livreIds);

        return livresPage.map(livre -> {
            double[] stats = statsMap.get(livre.getId());
            Double notemoyenne = stats != null ? Math.round(stats[0] * 10.0) / 10.0 : null;
            Long nbCommentaires = stats != null ? (long) stats[1] : 0L;
            return livreMapper.toDTO(livre, notemoyenne, nbCommentaires);
        });
    }

    @Transactional(readOnly = true)
    public LivreDTO getById(Long id) {
        Livre livre = livreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livre", id));
        double[] stats = fetchSingleLivreStats(id);
        return livreMapper.toDTO(livre, stats[0], (long) stats[1]);
    }

    @Transactional(readOnly = true)
    public LivreDTO getBySlug(String slug) {
        Livre livre = livreRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Livre", "slug", slug));
        double[] stats = fetchSingleLivreStats(livre.getId());
        return livreMapper.toDTO(livre, stats[0], (long) stats[1]);
    }

    @Transactional
    public LivreDTO create(LivreDTO dto) {
        Livre livre = livreMapper.toEntity(dto);
        livre.setId(null);

        if (dto.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categorie", dto.getCategorieId()));
            livre.setCategorie(categorie);
        }

        livre = livreRepository.save(livre);

        if (dto.getAuteurs() != null && !dto.getAuteurs().isEmpty()) {
            List<Auteur> auteurs = dto.getAuteurs().stream()
                    .map(a -> auteurRepository.findById(a.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Auteur", a.getId())))
                    .collect(Collectors.toList());
            livre.setAuteurs(auteurs);
            livre = livreRepository.save(livre);
        }

        return livreMapper.toDTO(livre);
    }

    @Transactional
    public LivreDTO update(Long id, LivreDTO dto) {
        Livre livre = livreRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Livre", id));

        livreMapper.updateEntity(livre, dto);

        if (dto.getCategorieId() != null) {
            Categorie categorie = categorieRepository.findById(dto.getCategorieId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categorie", dto.getCategorieId()));
            livre.setCategorie(categorie);
        }

        if (dto.getAuteurs() != null) {
            List<Auteur> auteurs = dto.getAuteurs().stream()
                    .map(a -> auteurRepository.findById(a.getId())
                            .orElseThrow(() -> new ResourceNotFoundException("Auteur", a.getId())))
                    .collect(Collectors.toList());
            livre.setAuteurs(auteurs);
        }

        livre = livreRepository.save(livre);
        return livreMapper.toDTO(livre);
    }

    @Transactional
    public void delete(Long id) {
        if (!livreRepository.existsById(id)) {
            throw new ResourceNotFoundException("Livre", id);
        }
        livreRepository.deleteById(id);
    }

    private Map<Long, double[]> fetchCommentaireStats(List<Long> livreIds) {
        if (livreIds.isEmpty()) return Collections.emptyMap();
        List<Object[]> stats = commentaireRepository.findStatsByLivreIds(livreIds);
        Map<Long, double[]> map = new HashMap<>();
        for (Object[] row : stats) {
            Long livreId = (Long) row[0];
            Double avg = row[1] != null ? ((Number) row[1]).doubleValue() : null;
            Long count = row[2] != null ? ((Number) row[2]).longValue() : 0L;
            map.put(livreId, new double[]{avg != null ? avg : 0.0, count});
        }
        return map;
    }

    private double[] fetchSingleLivreStats(Long livreId) {
        List<Object[]> stats = commentaireRepository.findStatsByLivreIds(List.of(livreId));
        if (stats.isEmpty()) return new double[]{0.0, 0};
        Object[] row = stats.get(0);
        Double avg = row[1] != null ? ((Number) row[1]).doubleValue() : 0.0;
        Long count = row[2] != null ? ((Number) row[2]).longValue() : 0L;
        return new double[]{avg, count};
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
