package com.livingletters.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "auteurs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Auteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 1000)
    private String description;

    private String profession;
}
