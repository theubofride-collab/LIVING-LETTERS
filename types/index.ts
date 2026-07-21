// ============================================================
// Living Letters — Types TypeScript (alignés entités JPA)
// camelCase par défaut (Jackson Spring Boot)
// ============================================================

// ---- Enums ----
export type UserRole = 'ADMIN' | 'CLIENT'
export type CommandeStatut =
  | 'EN_ATTENTE'
  | 'VALIDEE'
  | 'EN_LIVRAISON'
  | 'LIVREE'
  | 'ANNULEE'
export type ModePaiement = 'MOMO' | 'ORANGE_MONEY' | 'ESPECES'
export type Sexe = 'M' | 'F'

// ---- Entités principales ----
export interface Utilisateur {
  id: number
  nom: string
  sexe: Sexe
  email: string
  role: UserRole
  motDePasse?: string
}

export interface Categorie {
  id: number
  nom: string
  description: string
}

export interface Auteur {
  id: number
  nom: string
  description: string
  profession: string
}

export interface Livre {
  id: number
  nom: string
  description: string
  stock: number
  prix: number
  categorieId: number
  categorie?: Categorie
  auteurs?: Auteur[]
  couverture?: string
  slug?: string
  notemoyenne?: number
  nbCommentaires?: number
}

export interface LivreAuteur {
  qte: number
  prixUnitaire: number
  livreId: number
  auteurId: number
}

export interface Panier {
  id: number
  nom: string
  dateCreation: string
  utilisateurId: number
  contenus?: ContenuPanier[]
}

export interface ContenuPanier {
  qte: number
  panierId: number
  livreId: number
  livre?: Livre
}

export interface AdresseLivraison {
  id: number
  rue: string
  ville: string
  pays: string
}

export interface Commande {
  id: number
  dateCommande: string
  statut: CommandeStatut
  utilisateurId: number
  adresseId: number
  adresse?: AdresseLivraison
  lignes?: LigneCommande[]
  montantTotal?: number
}

export interface LigneCommande {
  livreId: number
  livre?: Livre
  qte: number
  prixUnitaire: number
}

export interface Paiement {
  id: number
  montant: number
  modePaiement: ModePaiement
  commandeId: number
}

export interface Facture {
  id: number
  date: string
  heure: string
  numFacture: string
  commandeId: number
}

export interface Commentaire {
  id: number
  note: number          // 1-5
  commentaire: string
  dateAvis: string
  livreId: number
  utilisateurId: number
  utilisateur?: Pick<Utilisateur, 'id' | 'nom'>
}

// ---- Auth ----
export interface LoginRequest {
  email: string
  motDePasse: string
}

export interface RegisterRequest {
  nom: string
  email: string
  motDePasse: string
  sexe: Sexe
  role?: UserRole
}

export interface AuthResponse {
  accessToken: string
  refreshToken?: string
  utilisateur: Utilisateur
}

// ---- Pagination Spring Data ----
export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number        // page courante (0-indexed)
  size: number
  first: boolean
  last: boolean
}

export interface PageParams {
  page?: number
  size?: number
  sort?: string
}

// ---- Erreur Spring ProblemDetail (RFC 7807) ----
export interface ProblemDetail {
  type?: string
  title: string
  status: number
  detail: string
  instance?: string
  timestamp?: string
}

// ---- Filtres Boutique ----
export interface LivreFilters extends PageParams {
  categorieId?: number
  auteurId?: number
  q?: string
  minPrix?: number
  maxPrix?: number
}

// ---- Payload Checkout ----
export interface PasserCommandeRequest {
  adresseId: number
}

export interface PaiementRequest {
  montant: number
  modePaiement: ModePaiement
  numeroTelephone: string
}

export interface StatutRequest {
  statut: CommandeStatut
}
