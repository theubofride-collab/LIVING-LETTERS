// ============================================================
// Living Letters — Données mockées (lib/mockData.ts)
// Utilisées en développement quand NEXT_PUBLIC_API_URL n'est pas défini
// ============================================================

import {
  Livre, Categorie, Auteur, Utilisateur,
  Commande, Facture, Commentaire, AdresseLivraison,
  Panier, ContenuPanier
} from '@/types'

export const MOCK_CATEGORIES: Categorie[] = [
  { id: 1, nom: 'Bibles', description: 'Toutes les éditions et versions de la Bible' },
  { id: 2, nom: 'Développement spirituel', description: 'Croissance dans la foi et la prière' },
  { id: 3, nom: 'Leadership', description: 'Servir et diriger selon les principes bibliques' },
  { id: 4, nom: 'Développement personnel', description: 'Épanouissement humain et chrétien' },
  { id: 5, nom: 'Famille & Mariage', description: 'Construire un foyer selon Dieu' },
  { id: 6, nom: 'Jeunesse', description: 'Livres pour les jeunes et les adolescents' },
  { id: 7, nom: 'Entrepreneuriat chrétien', description: 'Gérer ses talents et ressources' },
]

export const MOCK_AUTEURS: Auteur[] = [
  { id: 1, nom: 'Rick Warren', description: 'Pasteur américain, auteur de référence.', profession: 'Pasteur & Auteur' },
  { id: 2, nom: 'Joyce Meyer', description: 'Auteure et évangéliste internationale.', profession: 'Évangéliste' },
  { id: 3, nom: 'T.D. Jakes', description: 'Évêque et auteur américain renommé.', profession: 'Évêque & Auteur' },
  { id: 4, nom: 'Myles Munroe', description: 'Théologien, enseignant et auteur des Bahamas.', profession: 'Théologien & Auteur' },
  { id: 5, nom: 'John C. Maxwell', description: 'Expert mondial en leadership chrétien.', profession: 'Conférencier & Auteur' },
  { id: 6, nom: 'Charles Spurgeon', description: 'Prince des prédicateurs, XIXe siècle.', profession: 'Prédicateur & Théologien' },
]

export const MOCK_LIVRES: Livre[] = [
  {
    id: 1,
    nom: 'Une Vie Motivée par l\'Essentiel',
    description: 'Rick Warren vous guide à travers les 40 jours qui peuvent transformer votre vie. Une exploration profonde du sens de l\'existence à la lumière de la Parole de Dieu.',
    stock: 24,
    prix: 8500,
    categorieId: 2,
    categorie: MOCK_CATEGORIES[1],
    auteurs: [MOCK_AUTEURS[0]],
    couverture: '/placeholder-book.jpg',
    slug: 'une-vie-motivee-par-lessentiel',
    notemoyenne: 4.8,
    nbCommentaires: 47,
  },
  {
    id: 2,
    nom: 'Champ de Bataille de l\'Esprit',
    description: 'Joyce Meyer explore comment nos pensées influencent notre vie quotidienne et comment renouveler notre esprit par la Parole de Dieu pour vivre en victoire.',
    stock: 18,
    prix: 7200,
    categorieId: 2,
    categorie: MOCK_CATEGORIES[1],
    auteurs: [MOCK_AUTEURS[1]],
    couverture: '/placeholder-book.jpg',
    slug: 'champ-de-bataille-de-lesprit',
    notemoyenne: 4.6,
    nbCommentaires: 32,
  },
  {
    id: 3,
    nom: 'Instinct',
    description: 'T.D. Jakes révèle comment faire confiance à vos instincts divins pour prendre de meilleures décisions dans votre vie personnelle et professionnelle.',
    stock: 12,
    prix: 9000,
    categorieId: 4,
    categorie: MOCK_CATEGORIES[3],
    auteurs: [MOCK_AUTEURS[2]],
    couverture: '/placeholder-book.jpg',
    slug: 'instinct',
    notemoyenne: 4.5,
    nbCommentaires: 21,
  },
  {
    id: 4,
    nom: 'Les Principes et le Pouvoir de la Vision',
    description: 'Myles Munroe enseigne comment découvrir, développer et accomplir la vision que Dieu a placée en vous pour votre vie et votre communauté.',
    stock: 30,
    prix: 8000,
    categorieId: 3,
    categorie: MOCK_CATEGORIES[2],
    auteurs: [MOCK_AUTEURS[3]],
    couverture: '/placeholder-book.jpg',
    slug: 'principes-et-pouvoir-de-la-vision',
    notemoyenne: 4.9,
    nbCommentaires: 58,
  },
  {
    id: 5,
    nom: 'Les 21 Lois Irréfutables du Leadership',
    description: 'John C. Maxwell présente les principes fondamentaux du vrai leadership, illustrés d\'exemples bibliques et contemporains pour tout chrétien en position d\'influence.',
    stock: 15,
    prix: 9500,
    categorieId: 3,
    categorie: MOCK_CATEGORIES[2],
    auteurs: [MOCK_AUTEURS[4]],
    couverture: '/placeholder-book.jpg',
    slug: 'les-21-lois-irrefutables-du-leadership',
    notemoyenne: 4.7,
    nbCommentaires: 39,
  },
  {
    id: 6,
    nom: 'Bible Segond 21 — Couverture Rigide',
    description: 'La Bible Segond 21, traduction moderne et fidèle au texte original, avec couverture rigide violet dorée. Idéale pour l\'étude personnelle et le culte.',
    stock: 50,
    prix: 15000,
    categorieId: 1,
    categorie: MOCK_CATEGORIES[0],
    auteurs: [],
    couverture: '/placeholder-book.jpg',
    slug: 'bible-segond-21-rigide',
    notemoyenne: 4.9,
    nbCommentaires: 112,
  },
  {
    id: 7,
    nom: 'Le Pouvoir du Pardon',
    description: 'Joyce Meyer explore l\'un des thèmes les plus libérateurs de la foi chrétienne : comment pardonner et se libérer de la rancœur pour vivre pleinement.',
    stock: 8,
    prix: 6500,
    categorieId: 2,
    categorie: MOCK_CATEGORIES[1],
    auteurs: [MOCK_AUTEURS[1]],
    couverture: '/placeholder-book.jpg',
    slug: 'le-pouvoir-du-pardon',
    notemoyenne: 4.4,
    nbCommentaires: 28,
  },
  {
    id: 8,
    nom: 'Kingdom Entrepreneurship',
    description: 'Un guide pratique pour les entrepreneurs chrétiens qui veulent allier foi et excellence professionnelle, bâtir une entreprise alignée sur les valeurs du Royaume.',
    stock: 20,
    prix: 10000,
    categorieId: 7,
    categorie: MOCK_CATEGORIES[6],
    auteurs: [MOCK_AUTEURS[4]],
    couverture: '/placeholder-book.jpg',
    slug: 'kingdom-entrepreneurship',
    notemoyenne: 4.6,
    nbCommentaires: 19,
  },
]

export const MOCK_UTILISATEUR: Utilisateur = {
  id: 1,
  nom: 'Marie Nkomo',
  sexe: 'F',
  email: 'marie.nkomo@email.com',
  role: 'CLIENT',
}

export const MOCK_ADRESSES: AdresseLivraison[] = [
  { id: 1, rue: '45 Rue de la Joie', ville: 'Yaoundé', pays: 'Cameroun' },
  { id: 2, rue: 'Quartier Bastos, Carrefour des Nations', ville: 'Yaoundé', pays: 'Cameroun' },
]

export const MOCK_PANIER: Panier = {
  id: 1,
  nom: 'Mon panier',
  dateCreation: new Date().toISOString(),
  utilisateurId: 1,
  contenus: [
    { qte: 1, panierId: 1, livreId: 1, livre: MOCK_LIVRES[0] },
    { qte: 2, panierId: 1, livreId: 5, livre: MOCK_LIVRES[4] },
  ],
}

export const MOCK_COMMANDES: Commande[] = [
  {
    id: 1001,
    dateCommande: '2026-06-15T10:30:00',
    statut: 'LIVREE',
    utilisateurId: 1,
    adresseId: 1,
    adresse: MOCK_ADRESSES[0],
    montantTotal: 17500,
  },
  {
    id: 1002,
    dateCommande: '2026-07-02T14:00:00',
    statut: 'EN_LIVRAISON',
    utilisateurId: 1,
    adresseId: 1,
    adresse: MOCK_ADRESSES[0],
    montantTotal: 8500,
  },
  {
    id: 1003,
    dateCommande: '2026-07-10T09:00:00',
    statut: 'EN_ATTENTE',
    utilisateurId: 1,
    adresseId: 2,
    adresse: MOCK_ADRESSES[1],
    montantTotal: 24000,
  },
]

export const MOCK_FACTURES: Facture[] = [
  {
    id: 1,
    date: '2026-06-15',
    heure: '10:35:22',
    numFacture: 'LL-2026-001001',
    commandeId: 1001,
  },
]

export const MOCK_COMMENTAIRES: Commentaire[] = [
  {
    id: 1, note: 5, livreId: 1, utilisateurId: 2,
    commentaire: 'Ce livre a littéralement changé ma perspective sur la vie. Je le recommande à tous !',
    dateAvis: '2026-05-20T08:00:00',
    utilisateur: { id: 2, nom: 'Pierre Fouda' },
  },
  {
    id: 2, note: 4, livreId: 1, utilisateurId: 3,
    commentaire: 'Très profond et bien structuré. Les 40 jours de réflexion valent vraiment le coup.',
    dateAvis: '2026-06-01T15:30:00',
    utilisateur: { id: 3, nom: 'Grace Mballa' },
  },
  {
    id: 3, note: 5, livreId: 1, utilisateurId: 4,
    commentaire: 'Rick Warren touche le cœur dès les premières pages. Indispensable dans toute bibliothèque chrétienne.',
    dateAvis: '2026-06-10T11:00:00',
    utilisateur: { id: 4, nom: 'Samuel Abega' },
  },
]

// Dashboard admin stats
export const MOCK_STATS = {
  ventesTotales: 847500,
  commandesEnAttente: 12,
  livresStockBas: 3,
  clientsTotal: 128,
  commandesThisMois: 37,
  revenusThisMois: 285000,
}
