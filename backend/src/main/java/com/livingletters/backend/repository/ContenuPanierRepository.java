package com.livingletters.backend.repository;

import com.livingletters.backend.model.ContenuPanier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ContenuPanierRepository extends JpaRepository<ContenuPanier, Long> {
    Optional<ContenuPanier> findByPanierIdAndLivreId(Long panierId, Long livreId);
    void deleteByPanierId(Long panierId);
}
