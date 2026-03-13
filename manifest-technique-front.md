# Manifest Technique — Plateforme Éditoriale Professionnelle

> **Destinataire :** Antigravity — Équipe Front-End  
> **Projet :** Blog Professionnel — Plateforme Éditoriale  
> **Version :** 1.0.0 — Initial Release  
> **Date :** 26 février 2026  
> **Statut :** Document de référence technique  
> **Stack Front :** Angular 17+ avec Angular Universal  
> **Données :** Mock Data statiques (Phase 1)  

*Ce document constitue la référence technique complète pour l'implémentation du front-end.*

---

## Table des matières

1. [Contexte & Vision du Projet](#1-contexte--vision-du-projet)
2. [Stack Technique Front-End](#2-stack-technique-front-end)
3. [Modélisation des Données & Mock Structure](#3-modélisation-des-données--mock-structure)
4. [Pages, Routes & User Stories](#4-pages-routes--user-stories)
5. [Design System & Guidelines Visuelles](#5-design-system--guidelines-visuelles)
6. [Spécifications Détaillées par Page](#6-spécifications-détaillées-par-page)
7. [SEO & Performance](#7-seo--performance)
8. [Responsive Design & Accessibilité](#8-responsive-design--accessibilité)
9. [Préparation à la Connexion API (Phase 2)](#9-préparation-à-la-connexion-api-phase-2)
10. [Conventions de Code & Standards](#10-conventions-de-code--standards)
11. [Jalons de Livraison — Phase 1](#11-jalons-de-livraison--phase-1)
12. [Checklist de Validation Finale](#12-checklist-de-validation-finale)

---

## 1. Contexte & Vision du Projet

Ce document est le manifest technique officiel destiné à l'équipe front-end d'Antigravity pour l'implémentation de la **Plateforme Éditoriale Professionnelle** d'un client expert en communication digitale, marketing, publicité, aménagement de bureau et professeur d'université.

### 1.1 Profil du client

Le client est un professionnel dual — praticien de la communication et académicien. Sa plateforme doit refléter cette double identité : rigueur intellectuelle et modernité professionnelle. Il utilisera la plateforme de manière autonome pour :

- Rédiger et publier des **articles de fond** sur le marketing digital, la publicité et l'aménagement d'espace
- Partager des **notes d'intention** — réflexions courtes, prospectives ou éditoriales
- Publier des **récaps de séminaires et conférences** auxquels il participe ou intervient
- Gérer un **agenda d'événements** professionnels et académiques

### 1.2 Positionnement de la plateforme

Il ne s'agit **PAS** d'un simple blog WordPress. Il s'agit d'une **plateforme éditoriale sérieuse**, inspirée des CMS modernes comme Contentful, Sanity, ou Ghost. L'expérience auteur doit être fluide et professionnelle. L'expérience lecteur doit être élégante, rapide et optimisée pour le SEO.

> 💡 **Note :** L'objectif de qualité visée est comparable à celle des blogs de Harvard Business Review, MIT Media Lab ou de grands cabinets de consulting. Sobre, dense en contenu, sans fioriture.

---

## 2. Stack Technique Front-End

| Technologie | Version cible | Rôle | Justification |
|---|---|---|---|
| Angular | 17+ | Framework principal | Standalone components, Signals, SSR natif |
| Angular Universal | 17+ | Server-Side Rendering | SEO critique pour un blog professionnel |
| Angular Router | 17+ | Navigation & lazy loading | Découpage modulaire des routes |
| Angular Signals | 17+ | State management réactif | Remplace RxJS pour les états simples |
| TailwindCSS | 3.x | Styling utilitaire | Productivité + cohérence design |
| TypeScript | 5.x | Typage statique | Obligatoire avec Angular |
| TipTap | 2.x | Éditeur WYSIWYG | Extensible, headless, riche |
| Lucide Angular | latest | Icônes | Légères, modernes, SVG natif |
| ngx-skeleton-loader | latest | Loading states | UX fluide pendant les fetches |

> ⚠️ **Important :** Antigravity doit utiliser les **Standalone Components** d'Angular 17 exclusivement. Aucun `NgModule` classique ne doit être créé. C'est un prérequis architectural non négociable.

### 2.1 Architecture des dossiers

```
src/
  app/
    core/                       # Services globaux, intercepteurs, guards
      services/
        content.service.ts      # Accès aux mock data
        seo.service.ts          # Gestion balises meta, og:tags
      models/                   # Interfaces TypeScript (data contracts)
      guards/                   # Auth guard (préparé pour la V2)
    shared/                     # Composants réutilisables
      components/               # Card, Badge, Avatar, Button...
      pipes/                    # DateFr, ReadingTime, TruncateText...
      directives/               # LazyLoad, Highlight...
    features/                   # Modules fonctionnels (lazy loaded)
      public/                   # Zone visiteur
        home/
        blog/
        article-detail/
        events/
        search/
        about/
      admin/                    # Zone auteur (lazy loaded, guard protégé)
        dashboard/
        article-editor/
        media-library/
        event-manager/
    layout/                     # Header, Footer, Sidebar
    mock-data/                  # Fichiers JSON et services mock
  assets/                       # Images, fonts, icons
  environments/                 # env.ts, env.prod.ts
```

---

## 3. Modélisation des Données & Mock Structure

Bien que le front utilise des données statiques en Phase 1, la structure de ces données **DOIT** refléter fidèlement le schéma de base de données qui sera implémenté côté Laravel/MySQL. C'est la fondation qui permettra une migration API sans refactoring majeur.

> 💡 **Note :** Chaque interface TypeScript dans `core/models/` correspond à une entité de la base de données relationnelle. Les relations sont modélisées de la même façon qu'un CMS moderne (Contentful, Sanity, Strapi).

### 3.1 Entités Principales

#### 3.1.1 User (Auteur)

```typescript
interface User {
  id: string;                    // UUID v4
  name: string;
  email: string;
  bio: string;
  avatar: MediaAsset;            // relation vers MediaAsset
  role: 'admin' | 'editor';
  social: {
    linkedin?: string;
    twitter?: string;
    researchgate?: string;
  };
  createdAt: string;             // ISO 8601
}
```

#### 3.1.2 Post (Article / Note / Récap)

```typescript
interface Post {
  id: string;                    // UUID v4
  title: string;
  slug: string;                  // SEO-friendly URL
  type: PostType;                // enum
  status: PostStatus;            // enum
  excerpt: string;               // Résumé court (max 300 chars)
  content: string;               // HTML rich content (TipTap output)
  readingTime: number;           // Minutes (calculé)
  coverImage: MediaAsset | null; // relation vers MediaAsset
  author: User;                  // relation eager-loaded
  category: Category;            // relation many-to-one
  tags: Tag[];                   // relation many-to-many
  event: Event | null;           // relation optionnelle (recap)
  seo: SeoMeta;                  // embedded object
  publishedAt: string | null;    // null si brouillon
  scheduledAt: string | null;    // publication planifiée
  createdAt: string;
  updatedAt: string;
}
```

#### 3.1.3 PostType & PostStatus (Enums)

```typescript
type PostType = 'article' | 'note' | 'recap';
type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';
```

#### 3.1.4 Category

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;              // Hex color pour le badge
  icon: string;               // Nom lucide-icon
  postCount: number;          // Calculé côté service
}
```

#### 3.1.5 Tag

```typescript
interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}
```

#### 3.1.6 Event (Séminaire / Conférence)

```typescript
interface Event {
  id: string;
  title: string;
  slug: string;
  type: EventType;
  description: string;
  location: {
    city: string;
    country: string;
    venue: string;
    isOnline: boolean;
    onlineUrl?: string;
  };
  startDate: string;         // ISO 8601
  endDate: string;
  externalUrl?: string;
  role: 'speaker' | 'attendee' | 'organizer';
  recap: Post | null;        // relation inverse (un recap peut être lié)
  coverImage: MediaAsset | null;
  status: 'upcoming' | 'ongoing' | 'past';
  createdAt: string;
}

type EventType = 'conference' | 'seminar' | 'workshop' | 'webinar' | 'forum';
```

#### 3.1.7 MediaAsset

```typescript
interface MediaAsset {
  id: string;
  url: string;               // URL publique (assets/ en mock)
  thumbnailUrl: string;      // Version compressée
  filename: string;
  mimeType: string;          // image/jpeg, image/png...
  width: number;             // Pixels
  height: number;
  size: number;              // Bytes
  alt: string;               // Texte alternatif (accessibilité)
  caption?: string;
  uploadedAt: string;
}
```

#### 3.1.8 SeoMeta (Embedded dans Post)

```typescript
interface SeoMeta {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;           // URL
  canonicalUrl?: string;
  keywords: string[];
}
```

### 3.2 Relations entre entités

| Relation | Type | Description |
|---|---|---|
| Post → User | Many-to-One | Chaque post appartient à un auteur |
| Post → Category | Many-to-One | Chaque post a exactement une catégorie |
| Post → Tag[] | Many-to-Many | Un post peut avoir N tags, un tag N posts |
| Post → Event | Many-to-One (optionnel) | Un recap est lié à un événement |
| Post → MediaAsset | Many-to-One (optionnel) | Image de couverture du post |
| Event → Post | One-to-One (optionnel) | Relation inverse : event ↔ recap |
| Event → MediaAsset | Many-to-One (optionnel) | Image de couverture de l'événement |
| User → MediaAsset | Many-to-One | Avatar de l'auteur |

### 3.3 Structure des fichiers Mock

```
src/app/mock-data/
  data/
    users.mock.ts
    categories.mock.ts
    tags.mock.ts
    media.mock.ts
    events.mock.ts
    posts.mock.ts              # Importe et référence les autres entités
  services/
    content.mock.service.ts    # Service injectable avec méthodes paginées
```

> 💡 **Note :** Le `ContentMockService` doit implémenter la même interface que le futur `ContentApiService`. Prévoir les méthodes : `getPosts(filters, pagination)`, `getPostBySlug(slug)`, `getEvents(filters)`, `getEventBySlug(slug)`, `searchContent(query)`. Cela garantit un **swap API transparent** en Phase 2.

---

## 4. Pages, Routes & User Stories

### 4.1 Routing Public (Visiteur)

| Route | Composant | User Story couverte | SSR requis |
|---|---|---|---|
| `/` | `HomeComponent` | Accéder aux derniers contenus publiés | Oui |
| `/blog` | `BlogListComponent` | Filtrer et parcourir tous les articles | Oui |
| `/blog/:slug` | `ArticleDetailComponent` | Lire un article complet | Oui |
| `/notes` | `NotesListComponent` | Filtrer par type : Notes d'intention | Oui |
| `/recaps` | `RecapsListComponent` | Filtrer par type : Récaps de séminaires | Oui |
| `/events` | `EventsListComponent` | Voir les événements à venir et passés | Oui |
| `/events/:slug` | `EventDetailComponent` | Détail d'un événement et son recap | Oui |
| `/categories/:slug` | `CategoryComponent` | Filtrer par catégorie | Oui |
| `/tags/:slug` | `TagComponent` | Filtrer par tag | Oui |
| `/search` | `SearchComponent` | Recherche plein texte côté client | Non |
| `/about` | `AboutComponent` | Page de présentation de l'auteur | Oui |
| `/**` | `NotFoundComponent` | Page 404 élégante | Non |

### 4.2 Routing Admin (Auteur)

| Route | Composant | User Story couverte |
|---|---|---|
| `/admin` | `DashboardComponent` | Vue d'ensemble : stats, brouillons, prochains events |
| `/admin/posts` | `PostsListAdminComponent` | Lister et gérer tous les posts (filtres, statuts) |
| `/admin/posts/new` | `PostEditorComponent` | Créer un nouvel article / note / recap |
| `/admin/posts/:id/edit` | `PostEditorComponent` | Modifier un post existant |
| `/admin/events` | `EventsAdminComponent` | Gérer les événements |
| `/admin/events/new` | `EventEditorComponent` | Créer un événement |
| `/admin/events/:id/edit` | `EventEditorComponent` | Modifier un événement |
| `/admin/media` | `MediaLibraryComponent` | Médiathèque avec upload et suppression |
| `/admin/categories` | `CategoriesAdminComponent` | CRUD catégories et tags |
| `/admin/settings` | `SettingsComponent` | Profil auteur, SEO global |
| `/admin/login` | `LoginComponent` | Authentification (mock en Phase 1) |

> ⚠️ **Important :** En Phase 1 avec mock data, l'admin est accessible directement (pas d'auth réelle). Implémenter un `authGuard` stub qui retourne toujours `true` mais dont la signature est prête pour la vraie auth **Laravel Sanctum** en Phase 2.

---

## 5. Design System & Guidelines Visuelles

### 5.1 Palette de couleurs

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Primary | Navy Blue | `#1B3A6B` | Titres, CTA principaux, header, accents forts |
| Secondary | Medium Blue | `#2E6DA4` | Sous-titres, liens, boutons secondaires, bordures |
| Accent | Light Blue | `#4A90C4` | Hover states, highlights, progress bars |
| Dark Gray | Slate 800 | `#2D3748` | Corps de texte principal |
| Mid Gray | Slate 500 | `#718096` | Texte secondaire, méta-infos, placeholders |
| Light Gray | Slate 200 | `#E2E8F0` | Backgrounds, séparateurs, zones neutres |
| White | Pure White | `#FFFFFF` | Background principal, cards |
| Success | Green | `#38A169` | Statut publié, confirmations |
| Warning | Amber | `#F59E0B` | Statut planifié, alertes légères |
| Danger | Red | `#E53E3E` | Suppression, erreurs, statut archivé |

### 5.2 Typographie

| Élément | Police | Taille | Poids | Couleur |
|---|---|---|---|---|
| Display (Hero) | Inter | 56px / 4rem | 800 | Navy `#1B3A6B` |
| H1 Page | Inter | 40px / 2.5rem | 700 | Navy `#1B3A6B` |
| H2 Section | Inter | 30px / 1.875rem | 600 | Navy `#1B3A6B` |
| H3 Sous-section | Inter | 22px / 1.375rem | 600 | Slate `#2D3748` |
| Body Regular | Inter | 17px / 1.0625rem | 400 | Slate `#2D3748` |
| Body Small | Inter | 14px / 0.875rem | 400 | Gray `#718096` |
| Caption / Meta | Inter | 12px / 0.75rem | 500 | Gray `#718096` |
| Code / Mono | JetBrains Mono | 15px / 0.9375rem | 400 | Slate `#2D3748` |
| **Article Body** | **Merriweather** | **18px / 1.125rem** | **400** | **Slate `#2D3748`** |

> 💡 **Note :** Utiliser deux familles : **Inter** pour l'UI (navigation, labels, meta) et **Merriweather** pour le corps des articles uniquement. Cette distinction entre police sans-serif UI et serif éditorial est la signature des plateformes éditoriales premium (Medium, Substack, The Atlantic).

### 5.3 Composants Shared (Bibliothèque de composants)

Les composants suivants doivent être créés dans `src/app/shared/components/` et être réutilisables dans toute l'application.

#### `PostCard`
Affiche un aperçu d'un post. Trois variantes : `horizontal` (liste), `vertical` (grid), `featured` (hero). Props : `post: Post`, `variant: 'horizontal' | 'vertical' | 'featured'`.

#### `BadgeType`
Badge coloré indiquant le type du contenu. Couleurs distinctes par type (`article`=navy, `note`=slate, `recap`=accent).

#### `BadgeStatus`
Badge pour l'interface admin. Couleurs sémantiques par statut (published=vert, draft=gris, scheduled=amber, archived=rouge).

#### `EventCard`
Affiche un événement avec date, lieu, rôle de l'auteur et lien vers le recap si disponible.

#### `CategoryPill`
Pill cliquable représentant une catégorie avec couleur dynamique et compteur.

#### `TagCloud`
Nuage de tags cliquables avec taille proportionnelle au `postCount`.

#### `AuthorBlock`
Bloc présentant l'auteur : avatar, nom, bio, liens sociaux. Utilisé en bas de chaque article et sur la page About.

#### `ReadingProgressBar`
Barre de progression en haut de page, visible uniquement sur les articles. Suit le scroll de l'utilisateur.

#### `TableOfContents`
Génère automatiquement un sommaire à partir des balises H2/H3 du contenu HTML de l'article. Sticky sur desktop, collapsible sur mobile.

#### `ShareButtons`
Boutons de partage : LinkedIn, Twitter/X, copie du lien. Props : `post: Post`.

#### `SkeletonCard`
Skeleton loader pour `PostCard`, `EventCard`. Même ratio que les vrais composants. Utilisé pendant les états de chargement.

#### `EmptyState`
Composant d'état vide illustré. Props : `title`, `description`, `cta?`. Utilisé sur les pages sans résultats de recherche.

#### `Pagination`
Pagination numérotée avec prev/next. Gestion des états actifs. Compatible avec les query params Angular Router.

---

## 6. Spécifications Détaillées par Page

### 6.1 Page d'accueil (`/`)

- **Hero Section :** Titre éditorial fort, dernière publication mise en avant (featured post), CTA "Lire l'article"
- **Section "Derniers Articles" :** Grille 3 colonnes, 6 posts les plus récents, avec filtre par type en tabs
- **Section "Prochain Événement" :** Mise en avant du prochain événement à venir avec countdown
- **Section "À propos en bref" :** Avatar, 2-3 lignes de bio, CTA vers `/about`
- **Section "Catégories" :** Liste des catégories avec icône et compteur

> ⚠️ **Performance :** La Hero Section doit avoir un temps de chargement perçu < 200ms. Préférer l'hydratation progressive via Angular Universal. L'image du featured post doit avoir `loading="eager"` et être pré-rendue côté serveur.

### 6.2 Liste des posts (`/blog`)

- Filtres en haut : Type (Tous / Articles / Notes / Récaps), Catégorie (dropdown), Tag (multi-select)
- Recherche inline par mots-clés (côté client sur les mock data)
- Tri : Plus récent, Plus ancien, Temps de lecture croissant
- Affichage : Grid 2 colonnes sur desktop, 1 colonne sur mobile
- Pagination : 9 posts par page
- **URL params synchronisés :** `/blog?type=article&category=marketing&page=2`

### 6.3 Détail d'un article (`/blog/:slug`)

- **Header :** Image de couverture pleine largeur avec overlay gradient, titre, méta (date, temps de lecture, catégorie)
- **Sidebar droite (sticky) :** TOC, `AuthorBlock`, Tags, `ShareButtons`
- **Corps de l'article :** Rendu HTML TipTap, typographie Merriweather, largeur maximale `720px`
- `ReadingProgressBar` en haut de page
- **Section "Articles similaires" :** 3 posts de la même catégorie
- Bloc "Cet article est un récap de [événement]" si `event` lié

> 💡 **SEO :** Le slug doit être utilisé dans l'URL canonique et les balises Open Graph. Le `SeoService` doit être appelé dans `ngOnInit` pour mettre à jour dynamiquement `title`, `meta description`, `og:image`, `og:title`.

### 6.4 Page Événements (`/events`)

- Tabs : "À venir" / "Passés"
- Chaque `EventCard` affiche : type, titre, date, lieu, rôle de l'auteur, lien externe, indicateur "Recap disponible" si lié
- Timeline layout pour les événements passés (ordre chronologique inversé)
- Filtre par type d'événement (conférence, séminaire, webinaire...)

### 6.5 Détail d'un événement (`/events/:slug`)

- Header : titre, type, dates, lieu, rôle de l'auteur
- Description complète de l'événement
- Encadré "Recap de cet événement" si un post recap est lié (lien vers l'article)
- Bouton "Site officiel de l'événement" si `externalUrl` existe

### 6.6 Page About (`/about`)

- Photo professionnelle de l'auteur (format portrait, qualité haute)
- Biographie longue, structurée en sections : parcours académique, expertise professionnelle, centres d'intérêt
- Bloc "Expertises" : liste visuelle (icônes + labels) des domaines de compétence
- Timeline de carrière (optionnel, si données disponibles)
- Liens réseaux : LinkedIn, ResearchGate, Twitter/X
- Call-to-action : "Prendre contact" (mailto)

### 6.7 Interface Admin — Éditeur de Post (`/admin/posts/new`)

- Formulaire deux colonnes : contenu principal (gauche 70%) + panneau de configuration (droite 30%)
- **Colonne principale :** champ titre, sélecteur de `PostType`, éditeur TipTap riche
- **Panneau droit :** statut, catégorie, tags, date de publication planifiée, image de couverture, SEO (accordion)
- Auto-génération du slug à partir du titre (éditable manuellement)
- Auto-calcul du temps de lecture (`mots / 200`)
- Sauvegarde automatique en brouillon toutes les 30 secondes (mock: `localStorage`)
- Sélecteur d'événement lié (visible uniquement si `type === 'recap'`)
- Boutons : "Enregistrer brouillon", "Aperçu", "Publier"

### 6.8 Tableau de Bord Admin (`/admin`)

| Widget | Contenu | Interaction |
|---|---|---|
| Stats Cards | 4 cartes : Total publié, Brouillons, Événements à venir, Vues totales (mock) | Lien vers la liste correspondante |
| Activité récente | Liste des 5 derniers posts modifiés | Lien direct vers l'éditeur |
| Brouillons en cours | Posts en status `draft` | CTA "Continuer à rédiger" |
| Prochains événements | Agenda des 3 prochains events | Lien vers l'éditeur événement |
| Actions rapides | Boutons : Nouvel article, Nouvelle note, Nouveau recap, Nouvel événement | Navigation directe |

---

## 7. SEO & Performance

Le SEO est un enjeu critique. Un blog de professionnel sans SEO est un blog invisible. Toutes les pages publiques **DOIVENT** être server-side rendered.

### 7.1 SeoService

Créer un `SeoService` injectable dans `core/services/` avec les méthodes suivantes :

```typescript
updateTitle(title: string): void
updateMeta(description: string, keywords: string[]): void
updateOpenGraph(og: { title, description, image, url }): void
updateCanonical(url: string): void
generateStructuredData(post: Post): void   // JSON-LD Schema.org Article
```

### 7.2 Structured Data (JSON-LD)

Chaque page article doit injecter un script JSON-LD de type `Schema.org/Article` dans le `<head>` :

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "image": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "dateModified": "..."
}
```

### 7.3 Cibles de Performance

| Optimisation | Implémentation | Cible |
|---|---|---|
| Images lazy loading | `loading="lazy"` sur toutes les images hors fold | LCP < 2.5s |
| Image cover eager | `loading="eager"` sur la cover de hero/article | LCP < 1.5s |
| Lazy routes | `loadComponent()` sur toutes les routes features | Initial bundle < 150KB |
| OnPush | `ChangeDetectionStrategy.OnPush` sur tous les composants | Re-renders minimaux |
| Preconnect | `<link rel="preconnect">` vers Google Fonts dans `index.html` | TTFB amélioré |
| TrackBy | `trackBy` sur tous les `*ngFor` | Performances listes |

---

## 8. Responsive Design & Accessibilité

### 8.1 Breakpoints

| Breakpoint | Largeur | Comportement |
|---|---|---|
| Mobile | < 640px | Navigation hamburger, 1 colonne, sidebar masquée |
| Tablet | 640px – 1024px | Navigation condensée, 2 colonnes max, TOC collapsible |
| Desktop | 1024px – 1280px | Layout complet 3 colonnes, sidebar visible |
| Wide | > 1280px | Contenu centré `max-width: 1200px`, marges augmentées |

### 8.2 Navigation Mobile

- Menu hamburger avec animation slide-in depuis la gauche
- Overlay semi-transparent derrière le menu
- Fermeture par tap sur l'overlay ou bouton ×
- Items de navigation avec icônes Lucide pour meilleure scannabilité

### 8.3 Accessibilité (a11y)

- Score **WCAG 2.1 AA** minimum sur toutes les pages publiques
- Attributs `aria-label` sur tous les boutons icônes
- Navigation clavier complète (focus visible, tab order logique)
- Contraste minimum **4.5:1** pour tous les textes
- `alt` text sur toutes les images (via le champ `alt` de `MediaAsset`)
- Lien "Skip to main content" en début de page
- Balises sémantiques HTML5 : `<main>`, `<article>`, `<nav>`, `<aside>`, `<header>`, `<footer>`

---

## 9. Préparation à la Connexion API (Phase 2)

### 9.1 Pattern Repository / Interface

Définir une interface `IContentService` dans `core/services/content.interface.ts`. Le `ContentMockService` (Phase 1) et le futur `ContentApiService` (Phase 2) doivent tous deux l'implémenter. Le swap se fait via Angular dependency injection — **une seule ligne change** dans `app.config.ts`.

```typescript
// Phase 1
{ provide: IContentService, useClass: ContentMockService }

// Phase 2 — seul ce changement est nécessaire
{ provide: IContentService, useClass: ContentApiService }
```

### 9.2 Endpoints API attendus (référence Phase 2)

| Méthode | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/posts` | Liste paginée avec filtres (type, category, tag, status, search) |
| `GET` | `/api/v1/posts/:slug` | Post unique par slug |
| `POST` | `/api/v1/posts` | Créer un post *(auth requise)* |
| `PUT` | `/api/v1/posts/:id` | Modifier un post *(auth requise)* |
| `DELETE` | `/api/v1/posts/:id` | Supprimer un post *(auth requise)* |
| `GET` | `/api/v1/events` | Liste des événements avec filtres (status, type) |
| `GET` | `/api/v1/events/:slug` | Événement unique par slug |
| `POST` | `/api/v1/events` | Créer un événement *(auth requise)* |
| `GET` | `/api/v1/categories` | Toutes les catégories avec `postCount` |
| `GET` | `/api/v1/tags` | Tous les tags avec `postCount` |
| `GET` | `/api/v1/media` | Médiathèque paginée *(auth requise)* |
| `POST` | `/api/v1/media` | Upload d'un média *(auth requise)* |
| `POST` | `/api/v1/auth/login` | Authentification Laravel Sanctum |
| `POST` | `/api/v1/auth/logout` | Déconnexion |

### 9.3 Gestion des erreurs

Préparer un `HttpErrorInterceptor` (stub en Phase 1, actif en Phase 2) qui intercepte :

- `401` → redirection vers `/admin/login`
- `403` → message "Accès refusé"
- `404` → redirection vers la page Not Found
- `500` → toast "Erreur serveur, veuillez réessayer"

---

## 10. Conventions de Code & Standards

### 10.1 Nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants | PascalCase + suffixe | `PostCardComponent` |
| Services | PascalCase + Service | `ContentMockService` |
| Interfaces | PascalCase (sans I) | `Post`, `User`, `Event` |
| Enums | PascalCase | `PostType`, `PostStatus` |
| Fichiers composant | kebab-case | `post-card.component.ts` |
| Fichiers service | kebab-case | `content.mock.service.ts` |
| Variables / Props | camelCase | `postList`, `isLoading` |
| Constantes | SCREAMING_SNAKE | `POSTS_PER_PAGE` |
| CSS classes | Tailwind utilities | `flex items-center gap-4` |
| Inputs Angular | `@Input() camelCase` | `@Input() post: Post` |
| Outputs Angular | `@Output() on+Événement` | `@Output() onDelete` |

### 10.2 Règles ESLint / Prettier

- ESLint `@angular-eslint` avec règles strictes activées
- Prettier : `printWidth: 100`, `singleQuote: true`, `trailingComma: 'es5'`
- Import order : Angular → Third-party → App (enforced par ESLint rule)
- Aucun `any` TypeScript sans commentaire justificatif `// eslint-disable-next-line`
- **Strict mode TypeScript :** `strict: true` dans `tsconfig.json`

### 10.3 Git & Commits

- Branches : `main` (stable) → `develop` → `feature/nom-feature`
- Commit messages : **Conventional Commits** — `feat:`, `fix:`, `style:`, `refactor:`, `docs:`
- Pull Requests obligatoires vers `develop`, review avant merge
- Jamais de commit direct sur `main`

---

## 11. Jalons de Livraison — Phase 1

| Jalon | Livrable | Critères d'acceptation |
|---|---|---|
| **J1 — Setup** | Projet Angular initialisé, TailwindCSS configuré, routing structuré, mock data créées, design tokens configurés | L'app tourne en local, toutes les routes répondent en 200, palette appliquée |
| **J2 — Design System** | Tous les composants shared créés et documentés : `PostCard`, `EventCard`, `BadgeType`, `AuthorBlock`, `Pagination`, `SkeletonCard`... | Chaque composant fonctionne en isolation avec des données mock |
| **J3 — Pages Publiques** | Home, Blog list, Article detail, Events list, Event detail, About, Search, 404 | Toutes les user stories visiteur couvertes, responsive mobile + desktop, SEO meta en place |
| **J4 — Interface Admin** | Dashboard, Post editor (TipTap), Media library, Events admin, Categories admin, Login stub | Toutes les user stories auteur couvertes en Phase 1 (CRUD mock) |
| **J5 — Qualité & Handoff** | SSR vérifié, Lighthouse score > 90, tests unitaires composants critiques, documentation des composants | Prêt pour connexion API Phase 2 |

---

## 12. Checklist de Validation Finale

### Architecture
- [ ] Structure feature-based respectée
- [ ] Aucun `NgModule`, uniquement Standalone Components
- [ ] `IContentService` interface implémentée par le mock service
- [ ] Lazy loading sur toutes les routes features
- [ ] `ChangeDetectionStrategy.OnPush` sur tous les composants

### Design
- [ ] Palette de couleurs exacte respectée (`#1B3A6B`, `#2E6DA4`, `#4A90C4`...)
- [ ] Typographie Inter (UI) + Merriweather (article body)
- [ ] Tous les composants shared implémentés
- [ ] Design responsive validé sur 320px, 768px, 1024px, 1440px
- [ ] Dark mode non requis en Phase 1 (prévoir les CSS custom properties pour facilitation future)

### SEO & Performance
- [ ] Angular Universal SSR actif sur toutes les routes publiques
- [ ] `SeoService` appelé dans chaque page publique
- [ ] JSON-LD Schema.org sur chaque article
- [ ] Images avec `alt` text, lazy loading, format optimisé
- [ ] Lighthouse Performance **> 90** sur la page d'accueil

### Données Mock
- [ ] Au minimum : 10 posts (mix de types), 4 catégories, 10 tags, 5 événements, 1 user
- [ ] Toutes les relations correctement modélisées dans les objets TypeScript
- [ ] Slugs SEO-friendly générés pour chaque post et événement
- [ ] Données réalistes et représentatives du profil du client

### Code Quality
- [ ] TypeScript strict mode activé, zéro erreur de typage
- [ ] ESLint et Prettier configurés et sans erreurs
- [ ] Aucun `console.log` en production
- [ ] Aucun composant > 200 lignes (découper si nécessaire)

---

*Document préparé par l'architecte technique du projet. Pour toute question, ouvrir un ticket sur le dépôt Git du projet.*
