package com.livingletters.backend.config;

import com.livingletters.backend.model.*;
import com.livingletters.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
@Profile({"dev", "prod"})
@Slf4j
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(UtilisateurRepository utilisateurRepository,
                               CategorieRepository categorieRepository,
                               AuteurRepository auteurRepository,
                               LivreRepository livreRepository,
                               AdresseLivraisonRepository adresseRepository,
                               CommentaireRepository commentaireRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (categorieRepository.count() > 0) {
                log.info("Données déjà présentes, skip du seeding.");
                return;
            }

            log.info("Seeding des données de test...");

            // === UTILISATEURS ===
            Utilisateur admin = Utilisateur.builder()
                    .nom("Admin Living Letters")
                    .email("admin@livingletters.cm")
                    .motDePasse(passwordEncoder.encode("admin123"))
                    .sexe(Sexe.M)
                    .role(Role.ADMIN)
                    .build();
            admin = utilisateurRepository.save(admin);

            Utilisateur client = Utilisateur.builder()
                    .nom("Marie Ngo Bella")
                    .email("client@livingletters.cm")
                    .motDePasse(passwordEncoder.encode("client123"))
                    .sexe(Sexe.F)
                    .role(Role.CLIENT)
                    .build();
            client = utilisateurRepository.save(client);

            // === ADRESSES ===
            AdresseLivraison adresse1 = AdresseLivraison.builder()
                    .rue("Rue 1.234, Bastos")
                    .ville("Yaoundé")
                    .pays("Cameroun")
                    .utilisateur(client)
                    .build();
            adresseRepository.save(adresse1);

            AdresseLivraison adresse2 = AdresseLivraison.builder()
                    .rue("Boulevard de la joie, Akwa")
                    .ville("Douala")
                    .pays("Cameroun")
                    .utilisateur(client)
                    .build();
            adresseRepository.save(adresse2);

            // === CATEGORIES ===
            Categorie catEvangile = Categorie.builder()
                    .nom("Évangile & Vie chrétienne")
                    .description("Livres sur l'Évangile, la foi et la vie chrétienne au quotidien")
                    .build();

            Categorie catPriere = Categorie.builder()
                    .nom("Prière & Développement spirituel")
                    .description("Ouvrages sur la prière, la méditation et la croissance spirituelle")
                    .build();

            Categorie catJeunesse = Categorie.builder()
                    .nom("Jeunesse & Famille")
                    .description("Livres pour la jeunesse, l'éducation et la vie familiale")
                    .build();

            Categorie catTheologie = Categorie.builder()
                    .nom("Théologie & Enseignement")
                    .description("Études théologiques, doctrines et enseignements bibliques")
                    .build();

            Categorie catTemoignage = Categorie.builder()
                    .nom("Témoignages & Biographies")
                    .description("Récits de vies transformées par la foi")
                    .build();

            List<Categorie> categories = categorieRepository.saveAll(List.of(catEvangile, catPriere, catJeunesse, catTheologie, catTemoignage));

            // === AUTEURS ===
            Auteur auteur1 = Auteur.builder()
                    .nom("Pasteur Samuel Ngoma")
                    .description("Pasteur et évangéliste basé à Yaoundé, auteur de nombreux ouvrages sur la prière")
                    .profession("Pasteur, Évangéliste")
                    .build();

            Auteur auteur2 = Auteur.builder()
                    .nom("Sœur Cécile Mbarga")
                    .description("Enseignante biblique et formatrice, spécialisée dans l'éducation chrétienne")
                    .profession("Enseignante biblique")
                    .build();

            Auteur auteur3 = Auteur.builder()
                    .nom("Jean-Pierre Fotso")
                    .description("Théologien et écrivain camerounais, professeur de théologie systématique")
                    .profession("Théologien, Professeur")
                    .build();

            Auteur auteur4 = Auteur.builder()
                    .nom("Marie-Claire Abena")
                    .description("Autrice de témoignages et de livres pour la jeunesse chrétienne")
                    .profession("Autrice, Animatrice de jeunesse")
                    .build();

            List<Auteur> auteurs = auteurRepository.saveAll(List.of(auteur1, auteur2, auteur3, auteur4));

            // === LIVRES ===
            Livre livre1 = Livre.builder()
                    .nom("La puissance de la prière fervente")
                    .description("Un guide pratique pour développer une vie de prière intense et fructueuse. Le P. Ngoma partage son expérience de 30 ans de ministère.")
                    .stock(50)
                    .prix(new BigDecimal("5500"))
                    .couverture("/images/la-puissance-priere.jpg")
                    .categorie(catPriere)
                    .auteurs(List.of(auteur1))
                    .build();

            Livre livre2 = Livre.builder()
                    .nom("Marcher avec Dieu au quotidien")
                    .description("Découvrez comment intégrer la présence de Dieu dans chaque moment de votre journée, du lever au coucher.")
                    .stock(35)
                    .prix(new BigDecimal("4500"))
                    .couverture("/images/marcher-avec-dieu.jpg")
                    .categorie(catEvangile)
                    .auteurs(List.of(auteur1, auteur2))
                    .build();

            Livre livre3 = Livre.builder()
                    .nom("L'éducation chrétienne des enfants")
                    .description("Un manuel essentiel pour les parents qui veulent élever leurs enfants dans la crainte du Seigneur.")
                    .stock(40)
                    .prix(new BigDecimal("4000"))
                    .couverture("/images/education-chretienne.jpg")
                    .categorie(catJeunesse)
                    .auteurs(List.of(auteur2))
                    .build();

            Livre livre4 = Livre.builder()
                    .nom("Fondements de la foi chrétienne")
                    .description("Une étude approfondie des bases de la théologie chrétienne, adaptée au contexte africain contemporain.")
                    .stock(30)
                    .prix(new BigDecimal("7500"))
                    .couverture("/images/fondements-foi.jpg")
                    .categorie(catTheologie)
                    .auteurs(List.of(auteur3))
                    .build();

            Livre livre5 = Livre.builder()
                    .nom("Résurrections — Témoignages du Cameroun")
                    .description("Histoires vraies de personnes transformées par la grâce de Dieu au Cameroun.")
                    .stock(25)
                    .prix(new BigDecimal("3500"))
                    .couverture("/images/resurrections.jpg")
                    .categorie(catTemoignage)
                    .auteurs(List.of(auteur4))
                    .build();

            Livre livre6 = Livre.builder()
                    .nom("Le jeûne qui libère")
                    .description("Comprendre le jeûne biblique et son impact sur la vie spirituelle, familiale et ministérielle.")
                    .stock(45)
                    .prix(new BigDecimal("5000"))
                    .couverture("/images/jeune-libere.jpg")
                    .categorie(catPriere)
                    .auteurs(List.of(auteur1))
                    .build();

            Livre livre7 = Livre.builder()
                    .nom("Jeunes et debout pour Christ")
                    .description("Un appel aux jeunes chrétiens africains à assumer leur foi avec courage et audace.")
                    .stock(60)
                    .prix(new BigDecimal("3000"))
                    .couverture("/images/jeunes-christ.jpg")
                    .categorie(catJeunesse)
                    .auteurs(List.of(auteur4, auteur2))
                    .build();

            Livre livre8 = Livre.builder()
                    .nom("La théologie de la croix en Afrique")
                    .description("Une réflexion théologique profonde sur le message de la croix appliqué aux défis de l'Afrique moderne.")
                    .stock(20)
                    .prix(new BigDecimal("8000"))
                    .couverture("/images/theologie-croix.jpg")
                    .categorie(catTheologie)
                    .auteurs(List.of(auteur3))
                    .build();

            Livre livre9 = Livre.builder()
                    .nom("Pardon et guérison du cœur")
                    .description("Comment le pardon libère des blessures du passé et ouvre la voie à la guérison intérieure.")
                    .stock(38)
                    .prix(new BigDecimal("4200"))
                    .couverture("/images/pardon-guerison.jpg")
                    .categorie(catEvangile)
                    .auteurs(List.of(auteur2))
                    .build();

            livreRepository.saveAll(List.of(livre1, livre2, livre3, livre4, livre5, livre6, livre7, livre8, livre9));

            // === COMMENTAIRES ===
            Commentaire comm1 = Commentaire.builder()
                    .note(5)
                    .commentaire("Un livre qui a transformé ma vie de prière. Je le recommande à tous les chrétiens!")
                    .dateAvis(LocalDateTime.now().minusDays(10))
                    .livre(livre1)
                    .utilisateur(client)
                    .build();

            Commentaire comm2 = Commentaire.builder()
                    .note(4)
                    .commentaire("Très bon livre, pratique et facile à comprendre. Les exemples sont concrets.")
                    .dateAvis(LocalDateTime.now().minusDays(5))
                    .livre(livre2)
                    .utilisateur(client)
                    .build();

            Commentaire comm3 = Commentaire.builder()
                    .note(5)
                    .commentaire("Indispensable pour tout parent chrétien. Mes enfants adorent les activités proposées.")
                    .dateAvis(LocalDateTime.now().minusDays(3))
                    .livre(livre3)
                    .utilisateur(client)
                    .build();

            commentaireRepository.saveAll(List.of(comm1, comm2, comm3));

            log.info("Seeding terminé !");
            log.info("Admin: admin@livingletters.cm / admin123");
            log.info("Client: client@livingletters.cm / client123");
        };
    }
}
