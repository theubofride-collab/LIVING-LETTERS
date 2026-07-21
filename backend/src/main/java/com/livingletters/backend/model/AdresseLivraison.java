package com.livingletters.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "adresse_livraisons")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "utilisateur")
@EqualsAndHashCode(exclude = "utilisateur")
public class AdresseLivraison {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String rue;

    @Column(nullable = false)
    private String ville;

    @Column(nullable = false)
    private String pays;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;
}
