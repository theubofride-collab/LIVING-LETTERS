package com.livingletters.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "livres")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"commentaires", "auteurs"})
@EqualsAndHashCode(exclude = {"commentaires", "auteurs"})
public class Livre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal prix;

    private String couverture;

    @Column(unique = true)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categorie_id", nullable = false)
    private Categorie categorie;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "livre_auteur",
        joinColumns = @JoinColumn(name = "livre_id"),
        inverseJoinColumns = @JoinColumn(name = "auteur_id")
    )
    private List<Auteur> auteurs;

    @OneToMany(mappedBy = "livre", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Commentaire> commentaires;

    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (this.nom != null) {
            this.slug = this.nom.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .trim();
            if (this.slug.startsWith("-")) {
                this.slug = this.slug.substring(1);
            }
            if (this.slug.endsWith("-")) {
                this.slug = this.slug.substring(0, this.slug.length() - 1);
            }
        }
    }
}
