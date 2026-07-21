package com.livingletters.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "contenu_paniers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContenuPanier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer qte;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "panier_id", nullable = false)
    private Panier panier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "livre_id", nullable = false)
    private Livre livre;
}
