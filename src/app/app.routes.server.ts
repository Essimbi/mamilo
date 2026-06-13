import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // === Routes publiques dynamiques (slug inconnu au build) ===
  {
    path: 'articles/:slug',
    renderMode: RenderMode.Client,
  },
  {
    path: 'events/:slug',
    renderMode: RenderMode.Client,
  },

  // === Routes admin (protégées + paramètres dynamiques) ===
  {
    path: 'admin',
    renderMode: RenderMode.Client,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Client,
  },

  // === Routes statiques publiques (pré-rendues au build) ===
  {
    path: '**',
    renderMode: RenderMode.Client,
  },
];


