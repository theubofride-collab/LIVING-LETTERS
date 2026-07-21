package com.livingletters.backend.repository;

import com.livingletters.backend.model.Commentaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentaireRepository extends JpaRepository<Commentaire, Long> {
    List<Commentaire> findByLivreIdOrderByDateAvisDesc(Long livreId);

    @Query("SELECT c.livre.id, AVG(c.note), COUNT(c) FROM Commentaire c WHERE c.livre.id IN :livreIds GROUP BY c.livre.id")
    List<Object[]> findStatsByLivreIds(@Param("livreIds") List<Long> livreIds);
}
