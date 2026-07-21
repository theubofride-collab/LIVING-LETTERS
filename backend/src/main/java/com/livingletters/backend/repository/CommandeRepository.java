package com.livingletters.backend.repository;

import com.livingletters.backend.model.Commande;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    Page<Commande> findByUtilisateurId(Long utilisateurId, Pageable pageable);
    Page<Commande> findByUtilisateurEmail(String email, Pageable pageable);
}
