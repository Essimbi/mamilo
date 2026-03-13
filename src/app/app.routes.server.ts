import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // === Routes publiques dynamiques (slug inconnu au build) ===
  {
    path: 'articles/:slug',
    renderMode: RenderMode.Server,
  },
  {
    path: 'events/:slug',
    renderMode: RenderMode.Server,
  },

  // === Routes admin (protégées + paramètres dynamiques) ===
  {
    path: 'admin',
    renderMode: RenderMode.Server,
  },
  {
    path: 'admin/**',
    renderMode: RenderMode.Server,
  },

  // === Routes statiques publiques (pré-rendues au build) ===
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
