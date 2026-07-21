package com.livingletters.backend.repository;

import com.livingletters.backend.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByCommandeUtilisateurId(Long utilisateurId);
    List<Facture> findByCommandeUtilisateurEmail(String email);

    @Query("SELECT COALESCE(MAX(CAST(SUBSTRING(f.numFacture, 9) AS long)), 0) FROM Facture f WHERE f.numFacture LIKE :prefix%")
    Long findMaxSequenceByPrefix(@Param("prefix") String prefix);
}
