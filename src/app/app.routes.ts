import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/public/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'articles',
        loadComponent: () => import('./features/public/blog/blog-list.component').then(m => m.BlogListComponent)
    },
    {
        path: 'articles/:slug',
        loadComponent: () => import('./features/public/article-detail/article-detail.component').then(m => m.ArticleDetailComponent)
    },
    {
        path: 'notes',
        loadComponent: () => import('./features/public/blog/blog-list.component').then(m => m.BlogListComponent),
        data: { type: 'note' }
    },
    {
        path: 'recaps',
        loadComponent: () => import('./features/public/blog/blog-list.component').then(m => m.BlogListComponent),
        data: { type: 'recap' }
    },
    {
        path: 'events',
        loadComponent: () => import('./features/public/events/events-list.component').then(m => m.EventsListComponent)
    },
    {
        path: 'events/:slug',
        loadComponent: () => import('./features/public/events/event-detail.component').then(m => m.EventDetailComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./features/public/about/about.component').then(m => m.AboutComponent)
    },
    {
        path: 'contact',
        loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'articles',
                loadComponent: () => import('./features/admin/article-list/article-list.component').then(m => m.ArticleListComponent)
            },
            {
                path: 'events',
                loadComponent: () => import('./features/admin/event-manager/event-manager.component').then(m => m.EventManagerComponent)
            },
            {
                path: 'categories',
                loadComponent: () => import('./features/admin/category-manager/category-manager.component').then(m => m.CategoryManagerComponent)
            },
            {
                path: 'tags',
                loadComponent: () => import('./features/admin/tag-manager/tag-manager.component').then(m => m.TagManagerComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent)
            },
            {
                path: 'media',
                loadComponent: () => import('./features/admin/media-library/media-library.component').then(m => m.MediaLibraryComponent)
            },
            {
                path: 'posts/new',
                loadComponent: () => import('./features/admin/article-editor/post-editor.component').then(m => m.PostEditorComponent)
            },
            {
                path: 'posts/edit/:slug',
                loadComponent: () => import('./features/admin/article-editor/post-editor.component').then(m => m.PostEditorComponent)
            }
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./features/public/auth/login.component').then(m => m.LoginComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
