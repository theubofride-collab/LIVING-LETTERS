package com.livingletters.backend.dto;

import com.livingletters.backend.model.CommandeStatut;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommandeDTO {
    private Long id;
    private LocalDateTime dateCommande;
    private CommandeStatut statut;
    private BigDecimal montantTotal;
    private Long utilisateurId;
    private Long adresseId;
    private AdresseLivraisonDTO adresse;
    private List<LigneCommandeDTO> lignes;
}
