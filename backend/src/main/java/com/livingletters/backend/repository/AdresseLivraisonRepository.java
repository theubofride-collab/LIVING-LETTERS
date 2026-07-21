package com.livingletters.backend.repository;

import com.livingletters.backend.model.AdresseLivraison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdresseLivraisonRepository extends JpaRepository<AdresseLivraison, Long> {
    List<AdresseLivraison> findByUtilisateurId(Long utilisateurId);
    List<AdresseLivraison> findByUtilisateurEmail(String email);
}
