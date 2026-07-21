# Living Letters — Guide déploiement Render & espace admin

---

## PARTIE 1 : DÉPLOIEMENT SUR RENDER

### 1.1 Base de données PostgreSQL

Créer sur Render Dashboard → **New + → PostgreSQL**

| Champ | Valeur |
|-------|--------|
| Name | `living-letters-db` |
| Database | `livingletters` |
| User | laisser auto-généré |
| Region | `Frankfurt (EU Central)` |
| Plan | Free (dev) ou Starter $7/mo |

Render fournit une **Internal Database URL** du type : `postgres://user:password@host:5432/livingletters`

⚠️ **Transformer en JDBC** pour le backend Spring Boot : `jdbc:postgresql://host:5432/livingletters?user=user&password=password`

---

### 1.2 Backend Spring Boot — Web Service

Créer sur Render → **New + → Web Service**

| Champ | Valeur |
|-------|--------|
| Source | Repo GitHub branch `main` |
| Root Directory | `backend/` |
| Runtime | **Docker** (le Dockerfile est déjà créé) |
| Name | `living-letters-api` |
| Region | `Frankfurt` |
| Plan | Free (s'endort après 15min) ou Starter $7/mo |

#### Variables d'environnement (obligatoires)

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | `jdbc:postgresql://...` (transformée depuis Render URL) |
| `DATABASE_USERNAME` | username PostgreSQL |
| `DATABASE_PASSWORD` | password PostgreSQL |
| `JWT_SECRET` | générer avec `openssl rand -hex 32` |
| `FRONTEND_URL` | `https://living-letters.onrender.com` (URL du frontend) |

⚠️ **Seed en prod** : Le `DataSeeder` actuel est `@Profile("dev")` → **ne s'exécute pas en prod**. Après déploiement, les tables seront créées mais vides. Il faut soit :

- **Option A** : Créer l'admin manuellement via une requête SQL dans Render (Shell)
- **Option B** : Ajouter un second seeder pour le profil `prod` avec l'admin uniquement

Le backend sera accessible sur `https://living-letters-api.onrender.com/api`

---

### 1.3 Frontend Next.js — Web Service

Créer sur Render → **New + → Web Service**

| Champ | Valeur |
|-------|--------|
| Source | Même repo, même branch |
| Root Directory | laisser vide (racine) |
| Runtime | **Node** |
| Build Command | `npm install && npm run build` |
| Start Command | `npx next start -p 3000` |
| Name | `living-letters` |
| Region | `Frankfurt` |
| Plan | **Starter $7/mo minimum** (Free n'a pas assez de RAM) |

#### Variable d'environnement

| Variable | Valeur |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://living-letters-api.onrender.com/api` |

⚠️ Le `next.config.mjs` est déjà configuré avec `output: 'standalone'` pour Render.

---

### 1.4 Images des couvertures

Stockées actuellement en dur dans `mockData.ts` (`/images/...`). Pour la prod, utiliser un service externe :

- **Cloudinary** (recommandé, gratuit 25 Go) → upload manuel, URL dans la base
- **AWS S3** (plus technique)
- **Render Disk** (simple, mais attaché au serveur)

Dans `application-prod.yml`, prévoir une variable `app.images.base-url` pour générer les URLs complètes.

---

## PARTIE 2 : ESPACE ADMIN — Backend déjà prêt

### 2.1 Ce backend admin est déjà 100% fonctionnel

Tout le backend administrateur est déjà construit et déployable. Voici ce qui existe :

#### Fichiers backend admin déjà créés

| Fichier | Rôle |
|---------|------|
| `controller/LivreController.java` | CRUD livres (POST, PUT, DELETE protégés ADMIN) |
| `controller/CategorieController.java` | CRUD catégories (POST, PUT, DELETE protégés ADMIN) |
| `controller/AuteurController.java` | CRUD auteurs (POST, PUT, DELETE protégés ADMIN) |
| `controller/CommandeController.java` | Gestion commandes + changement statut (PATCH ADMIN) |
| `controller/UtilisateurController.java` | CRUD utilisateurs (toutes les routes ADMIN) |
| `controller/FactureController.java` | Génération facture PDF (POST ADMIN) |
| `controller/CommentaireController.java` | Suppression commentaires (DELETE ADMIN) |
| `service/LivreService.java` | Logique métier livres |
| `service/CommandeService.java` | Logique métier commandes + gestion statuts |
| `service/UtilisateurService.java` | Logique métier utilisateurs |
| `service/FactureService.java` | Génération PDF avec Apache PDFBox |
| `security/SecurityConfig.java` | Routes ADMIN protégées par `hasRole("ADMIN")` |
| `config/DataSeeder.java` | Compte admin seedé en dev |

#### Sécurité : comment le backend protège l'admin

```java
// SecurityConfig.java (lignes 47-53)
.requestMatchers(HttpMethod.POST, "/v1/livres", "/v1/categories", "/v1/auteurs").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/v1/livres/**", "/v1/categories/**", "/v1/auteurs/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/v1/livres/**", "/v1/categories/**", "/v1/auteurs/**").hasRole("ADMIN")
.requestMatchers("/v1/utilisateurs/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.PATCH, "/v1/commandes/*/statut").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/v1/commandes/*/facture").hasRole("ADMIN")
```

Seul un utilisateur avec le rôle `ADMIN` peut appeler ces endpoints. Le frontend doit envoyer le JWT dans `Authorization: Bearer <token>` (déjà géré par `apiClient.ts`).

#### Les contrôleurs backend renvoient des DTO, pas des entités

Chaque contrôleur renvoie des **DTO** (pas les entités JPA directement) :

```java
// LivreController.java
@PostMapping
public ResponseEntity<LivreDTO> create(@Valid @RequestBody LivreDTO dto)

@PutMapping("/{id}")
public ResponseEntity<LivreDTO> update(@PathVariable Long id, @Valid @RequestBody LivreDTO dto)

@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id)
```

---

### 2.2 Contrats JSON backend → frontend pour chaque endpoint admin

#### Livres

```typescript
// POST /v1/livres  (Créer)
> Requête (LivreDTO) :
{
  "id": null,           // ignoré à la création
  "nom": "Titre du livre",
  "description": "...",
  "stock": 50,
  "prix": 5500,
  "categorieId": 1,
  "couverture": "https://...",
  "slug": "titre-du-livre",
  // Note : auteurs s'envoie via leur propre endpoint de liaison livre-auteur
  "auteursIds": [1, 2]  // IDs des auteurs (backend gère ça)
}

< Réponse (LivreDTO) : 201 Created
{
  "id": 10,
  "nom": "Titre du livre",
  "description": "...",
  "stock": 50,
  "prix": 5500,
  "categorieId": 1,
  "categorie": { "id": 1, "nom": "...", "description": "..." },
  "auteurs": [{ "id": 1, "nom": "...", ... }],
  "couverture": "https://...",
  "slug": "titre-du-livre",
  "notemoyenne": 0,
  "nbCommentaires": 0
}

// PUT /v1/livres/{id}  (Modifier)
> Même body que POST
< Réponse : 200 OK avec le LivreDTO mis à jour

// DELETE /v1/livres/{id}  (Supprimer)
< Réponse : 204 No Content
```

#### Catégories

```typescript
// POST /v1/categories
> { "nom": "Bibles", "description": "..." }
< 201 : { "id": 6, "nom": "Bibles", "description": "..." }

// PUT /v1/categories/{id}
> { "nom": "Bibles révisées", "description": "..." }
< 200 : { "id": 6, "nom": "Bibles révisées", "description": "..." }

// DELETE /v1/categories/{id}
< 204 No Content
```

#### Auteurs

```typescript
// POST /v1/auteurs
> { "nom": "Pasteur Samuel", "description": "...", "profession": "Pasteur" }
< 201 : { "id": 5, "nom": "Pasteur Samuel", "description": "...", "profession": "Pasteur" }

// PUT /v1/auteurs/{id}
< 200 : auteur mis à jour

// DELETE /v1/auteurs/{id}
< 204 No Content
```

#### Commandes (admin)

```typescript
// GET /v1/commandes?page=0&size=20  (admin voit TOUTES les commandes)
< 200 : PageResponse<CommandeDTO>
{
  "content": [
    {
      "id": 1,
      "dateCommande": "2024-01-15T10:30:00",
      "statut": "EN_ATTENTE",
      "utilisateurId": 2,
      "adresseId": 1,
      "adresse": { "id": 1, "rue": "...", "ville": "...", "pays": "Cameroun" },
      "lignes": [{ "livreId": 1, "livre": {...}, "qte": 2, "prixUnitaire": 5500 }],
      "montantTotal": 11000
    }
  ],
  "totalElements": 50,
  "totalPages": 3,
  "number": 0,
  "size": 20
}

// PATCH /v1/commandes/{id}/statut
> { "statut": "VALIDEE" }   // ou EN_LIVRAISON, LIVREE, ANNULEE
< 200 : CommandeDTO mis à jour

// POST /v1/commandes/{id}/facture  (Générer PDF)
< 201 : FactureDTO
{
  "id": 1,
  "date": "2024-01-15",
  "heure": "10:35:22",
  "numFacture": "LL-2024-000001",
  "commandeId": 1
}
```

#### Utilisateurs

```typescript
// GET /v1/utilisateurs?page=0&size=20
< 200 : PageResponse<UtilisateurDTO>
{
  "content": [
    {
      "id": 1,
      "nom": "Admin Living Letters",
      "sexe": "M",
      "email": "admin@livingletters.cm",
      "role": "ADMIN"
      // Note : "motDePasse" n'est JAMAIS dans le DTO
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "number": 0,
  "size": 20
}

// GET /v1/utilisateurs/{id}
< 200 : UtilisateurDTO

// PUT /v1/utilisateurs/{id}
> { "nom": "...", "sexe": "M", "email": "...", "role": "CLIENT" }
< 200 : UtilisateurDTO mis à jour

// DELETE /v1/utilisateurs/{id}
< 204 No Content
```

#### Factures

```typescript
// GET /v1/factures  (admin voit TOUTES les factures)
< 200 : FactureDTO[]

// GET /v1/factures/{id}/pdf
< 200 : application/pdf (fichier binaire à télécharger)
```

---

### 2.3 Comment le frontend s'authentifie en tant qu'admin

Le mécanisme est déjà en place :

1. Login avec le compte admin (`admin@livingletters.cm / admin123`)
2. `authService.login()` stocke le JWT dans `localStorage` (token `ll_token`)
3. L'intercepteur axios dans `apiClient.ts` ajoute automatiquement `Authorization: Bearer <token>` à chaque requête
4. Le backend vérifie le JWT, extrait le rôle, et autorise ou refuse l'accès aux routes ADMIN

```typescript
// apiClient.ts (lignes 23-32) — déjà fait
apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

Le middleware Next.js (`middleware.ts`) protège déjà `/admin` :
- Si pas de cookie `ll_token` → redirige vers `/connexion`
- Si pas le rôle `ADMIN` → redirige vers `/`

---

### 2.4 Fichiers frontend déjà prêts pour l'admin

| Service fichier | Méthodes admin | Déjà prêt |
|----------------|---------------|-----------|
| `services/livreService.ts` | `create()`, `update()`, `delete()` | ✅ |
| `services/categorieService.ts` | `create()`, `update()`, `delete()` | ✅ |
| `services/auteurService.ts` | `create()`, `update()`, `delete()` | ✅ |
| `services/commandeService.ts` | `getAll()`, `getById()`, `updateStatut()` | ✅ |
| `services/utilisateurService.ts` | `getAll()`, `getById()`, `update()`, `delete()` | ✅ |
| `services/factureService.ts` | `getAll()`, `getById()`, `generer()`, `downloadPdf()` | ✅ |

---

### 2.5 Structure des données frontend (types/)

Tous les types sont dans `types/index.ts`. Voici ceux que l'admin utilise :

```typescript
// types/index.ts — déjà définis

export type UserRole = 'ADMIN' | 'CLIENT'

export type CommandeStatut =
  | 'EN_ATTENTE'
  | 'VALIDEE'
  | 'EN_LIVRAISON'
  | 'LIVREE'
  | 'ANNULEE'

export interface Utilisateur {
  id: number
  nom: string
  sexe: Sexe      // 'M' | 'F'
  email: string
  role: UserRole
  motDePasse?: string   // optionnel, jamais renvoyé par le backend
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

export interface Facture {
  id: number
  date: string
  heure: string
  numFacture: string
  commandeId: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export interface StatutRequest {
  statut: CommandeStatut
}
```

---

### 2.6 Architecture des pages admin à créer

Pour chaque page admin, voici la structure à respecter :

```
app/admin/
├── layout.tsx                    # Sidebar + header admin
├── page.tsx                      # Dashboard stats
├── livres/
│   ├── page.tsx                  # Liste des livres
│   ├── ajouter/page.tsx          # Créer un livre
│   └── [id]/page.tsx             # Modifier un livre
├── categories/
│   └── page.tsx                  # CRUD catégories (liste + modal)
├── auteurs/
│   └── page.tsx                  # CRUD auteurs (liste + modal)
├── commandes/
│   ├── page.tsx                  # Liste des commandes
│   └── [id]/page.tsx             # Détail + changement statut
├── utilisateurs/
│   ├── page.tsx                  # Liste des utilisateurs
│   └── [id]/page.tsx             # Détail/modification
└── factures/
    └── page.tsx                  # Liste factures + download PDF
```

#### Layout admin — `app/admin/layout.tsx` (exemple)

```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Tags, Users, ShoppingBag, FileText, UserCheck, ArrowLeft } from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/livres', label: 'Livres', icon: BookOpen },
  { href: '/admin/categories', label: 'Catégories', icon: Tags },
  { href: '/admin/auteurs', label: 'Auteurs', icon: Users },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag },
  { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: UserCheck },
  { href: '/admin/factures', label: 'Factures', icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-brand-cream">
      <aside className="w-64 bg-white border-r border-brand-cream-dark p-4 flex flex-col gap-1">
        <Link href="/admin" className="font-serif text-xl font-bold text-brand-dark mb-6 px-3 pt-2">Administration</Link>
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              pathname === href || (href !== '/admin' && pathname.startsWith(href))
                ? 'bg-brand-orange/10 text-brand-orange'
                : 'text-brand-muted hover:bg-brand-cream hover:text-brand-dark'
            }`}>
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
        <div className="mt-auto pt-4 border-t border-brand-cream-dark">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-brand-muted hover:text-brand-dark">
            <ArrowLeft className="w-4 h-4" />
            Retour au site
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
```

#### Dashboard — `app/admin/page.tsx` (exemple)

```tsx
'use client'
import { useEffect, useState } from 'react'
import { commandeService } from '@/services/commandeService'
import { livreService } from '@/services/livreService'
import { utilisateurService } from '@/services/utilisateurService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ commandesAttente: 0, clients: 0, stockBas: 0, totalVentes: 0 })

  useEffect(() => {
    async function load() {
      const [cmdPage, livrePage, userPage] = await Promise.all([
        commandeService.getAll({ page: 0, size: 1000 }),
        livreService.getAll({ page: 0, size: 1000 }),
        utilisateurService.getAll({ page: 0, size: 1 }),
      ])
      setStats({
        commandesAttente: cmdPage.content.filter(c => c.statut === 'EN_ATTENTE').length,
        clients: userPage.totalElements,
        stockBas: livrePage.content.filter(l => l.stock > 0 && l.stock <= 5).length,
        totalVentes: cmdPage.content.reduce((sum, c) => sum + (c.montantTotal || 0), 0),
      })
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-brand-dark mb-6">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CarteStat label="Commandes en attente" value={stats.commandesAttente} />
        <CarteStat label="Clients" value={stats.clients} />
        <CarteStat label="Stock bas" value={stats.stockBas} />
        <CarteStat label="Ventes totales" value={`${stats.totalVentes.toLocaleString()} FCFA`} />
      </div>
    </div>
  )
}

function CarteStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-brand-cream-dark">
      <p className="text-sm text-brand-muted">{label}</p>
      <p className="font-serif text-2xl font-bold text-brand-dark mt-1">{value}</p>
    </div>
  )
}
```

#### Gestion des livres — `app/admin/livres/page.tsx` (exemple)

```tsx
'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { livreService } from '@/services/livreService'
import { Livre } from '@/types'
import { Plus, Pencil, Trash2 } from 'lucide-react'

export default function AdminLivresPage() {
  const [livres, setLivres] = useState<Livre[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    livreService.getAll({ page, size: 20 }).then(res => setLivres(res.content))
  }, [page])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce livre ?')) return
    await livreService.delete(id)
    setLivres(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-brand-dark">Livres</h1>
        <Link href="/admin/livres/ajouter" className="btn-primary text-sm py-2">
          <Plus className="w-4 h-4" /> Nouveau livre
        </Link>
      </div>
      <div className="bg-white rounded-2xl border border-brand-cream-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-brand-cream text-brand-muted text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Titre</th>
              <th className="text-left px-4 py-3">Catégorie</th>
              <th className="text-right px-4 py-3">Prix</th>
              <th className="text-right px-4 py-3">Stock</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {livres.map(l => (
              <tr key={l.id} className="border-t border-brand-cream-dark">
                <td className="px-4 py-3 font-medium">{l.nom}</td>
                <td className="px-4 py-3 text-brand-muted">{l.categorie?.nom}</td>
                <td className="px-4 py-3 text-right">{l.prix.toLocaleString()} FCFA</td>
                <td className="px-4 py-3 text-right">{l.stock}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/livres/${l.id}`} className="p-2 rounded-lg hover:bg-brand-cream">
                      <Pencil className="w-4 h-4 text-brand-muted" />
                    </Link>
                    <button onClick={() => handleDelete(l.id)} className="p-2 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

#### Détail commande + changement statut — `app/admin/commandes/[id]/page.tsx` (exemple)

```tsx
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { commandeService } from '@/services/commandeService'
import { factureService } from '@/services/factureService'
import { Commande, CommandeStatut } from '@/types'
import OrderStatusBadge from '@/components/ui/OrderStatusBadge'

const TRANSITIONS: Record<CommandeStatut, CommandeStatut[]> = {
  EN_ATTENTE: ['VALIDEE', 'ANNULEE'],
  VALIDEE: ['EN_LIVRAISON'],
  EN_LIVRAISON: ['LIVREE'],
  LIVREE: [],
  ANNULEE: [],
}

export default function AdminCommandeDetailPage() {
  const { id } = useParams()
  const [commande, setCommande] = useState<Commande | null>(null)

  useEffect(() => {
    commandeService.getById(Number(id)).then(setCommande)
  }, [id])

  const handleStatut = async (statut: CommandeStatut) => {
    if (!commande) return
    const updated = await commandeService.updateStatut(commande.id, { statut })
    setCommande(updated)
  }

  const handleFacture = async () => {
    if (!commande) return
    const facture = await factureService.generer(commande.id)
    alert(`Facture ${facture.numFacture} générée`)
  }

  if (!commande) return <p>Chargement...</p>

  const transitionsPossibles = TRANSITIONS[commande.statut] || []

  return (
    <div>
      <h1 className="font-serif text-2xl font-bold text-brand-dark mb-6">
        Commande #{commande.id}
      </h1>
      <div className="bg-white rounded-2xl border border-brand-cream-dark p-6 space-y-4">
        <div className="flex items-center justify-between">
          <OrderStatusBadge statut={commande.statut} />
          <p className="font-bold text-lg">{commande.montantTotal?.toLocaleString()} FCFA</p>
        </div>
        <p className="text-sm text-brand-muted">{new Date(commande.dateCommande).toLocaleDateString('fr-FR')}</p>
        <div className="border-t border-brand-cream-dark pt-4 flex gap-2">
          {transitionsPossibles.map(s => (
            <button key={s} onClick={() => handleStatut(s)} className="btn-primary text-sm py-2">
              Passer à {s}
            </button>
          ))}
          <button onClick={handleFacture} className="btn-secondary text-sm py-2">
            Générer facture PDF
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

### 2.7 Ordre de construction recommandé

Le développeur frontend devrait construire dans cet ordre :

1. **`app/admin/layout.tsx`** — Sidebar + structure de base
2. **`app/admin/page.tsx`** — Dashboard (stats)
3. **`app/admin/livres/`** — CRUD livres (liste → ajouter → modifier → supprimer)
4. **`app/admin/categories/page.tsx`** — CRUD catégories (plus simple, bon pour s'échauffer)
5. **`app/admin/auteurs/page.tsx`** — CRUD auteurs (identique aux catégories)
6. **`app/admin/commandes/`** — Liste + détail + changement statut + génération facture
7. **`app/admin/utilisateurs/`** — Liste + détail + changement rôle + suppression
8. **`app/admin/factures/page.tsx`** — Liste + téléchargement PDF

---

## Notes importantes

1. **Upload d'images** : Les endpoints `POST/PUT /v1/livres` attendent des URLs dans `couverture`. Pour l'upload, choisir Cloudinary (simple) ou intégrer un endpoint dédié avec `MultipartFile` dans le backend.

2. **Aucun CRUD pour les rôles** : Les rôles sont définis dans l'enum `Role.java` (`ADMIN`, `CLIENT`). L'admin peut changer le rôle d'un utilisateur via `PUT /v1/utilisateurs/{id}`.

3. **Comptes initiaux en dev** : `admin@livingletters.cm / admin123` et `client@livingletters.cm / client123` (seedés uniquement en profile `dev`).

4. **Token blacklist** : Actuellement en mémoire (perdu au restart). Pour la prod, migrer vers Redis ou une table PostgreSQL.

5. **Le Dockerfile backend** est déjà créé dans `backend/Dockerfile`.

6. **Le frontend doit faire tourner le backend en local pour tester l'admin** :
   ```bash
   cd backend && mvn spring-boot:run
   # Backend sur http://localhost:8080/api
   # Compte admin : admin@livingletters.cm / admin123
   ```
