import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { Post } from '../../../core/models/post.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Gestion des Articles</h1>
          <p>Visualisez et gérez l'ensemble de vos publications.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" routerLink="/admin/posts/new">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Nouvel Article
          </button>
        </div>
      </header>

      <div class="filters-bar card">
        <div class="search-box">
          <lucide-icon name="search" size="18"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Rechercher un article..."
            (input)="onSearch()"
          >
        </div>
        <div class="filters-actions">
          <select [(ngModel)]="statusFilter" (change)="onFilterChange()" class="select-input">
            <option value="all">Tous les statuts</option>
            <option value="published">Publiés</option>
            <option value="draft">Brouillons</option>
          </select>
          <select [(ngModel)]="typeFilter" (change)="onFilterChange()" class="select-input">
            <option value="all">Tous les types</option>
            <option value="article">Articles</option>
            <option value="note">Notes</option>
            <option value="recap">Recaps</option>
          </select>
        </div>
      </div>

      <div class="table-container card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Statut</th>
              <th>Catégorie</th>
              <th>Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let post of filteredPosts()">
              <td class="article-cell">
                <div class="article-info">
                  <span class="article-title">{{ post.title }}</span>
                  <span class="article-slug">{{ post.slug }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" [class]="post.status">
                  {{ post.status === 'published' ? 'Publié' : 'Brouillon' }}
                </span>
              </td>
              <td>{{ post.category.name }}</td>
              <td>{{ (post.publishedAt || post.createdAt) | date:'d MMM yyyy' }}</td>
              <td class="text-right">
                <div class="actions-group">
                  <a [routerLink]="['/admin/posts/edit', post.slug]" class="btn-icon" title="Modifier">
                    <lucide-icon name="pencil" size="16"></lucide-icon>
                  </a>
                  <button (click)="onDelete(post)" class="btn-icon delete" title="Supprimer">
                    <lucide-icon name="trash-2" size="16"></lucide-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredPosts().length === 0">
              <td colspan="5" class="empty-state">
                <lucide-icon name="file-text" size="48"></lucide-icon>
                <p>Aucun article ne correspond à votre recherche.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/abstracts/variables' as *;

    .admin-page {
      padding: 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        font-size: 1.875rem;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 0.5rem;
      }

      p {
        color: #64748b;
      }
    }

    .card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .filters-bar {
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;

      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 400px;

      lucide-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        color: #94a3b8;
      }

      input {
        width: 100%;
        padding: 0.625rem 1rem 0.625rem 2.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 0.95rem;

        &:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      }
    }

    .filters-actions {
      display: flex;
      gap: 0.75rem;
    }

    .select-input {
      padding: 0.625rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      font-size: 0.95rem;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #3b82f6;
      }
    }

    .table-container {
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;

      th {
        padding: 1rem 1.5rem;
        font-weight: 600;
        color: #475569;
        font-size: 0.875rem;
        border-bottom: 1px solid #f1f5f9;
        background: #f8fafc;
      }

      td {
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #f1f5f9;
        font-size: 0.95rem;
        vertical-align: middle;
      }

      tr:hover {
        background-color: #f8fafc;
      }
    }

    .article-cell {
      .article-info {
        display: flex;
        flex-direction: column;

        .article-title {
          font-weight: 600;
          color: #1e293b;
        }

        .article-slug {
          font-size: 0.8rem;
          color: #94a3b8;
        }
      }
    }

    .status-badge {
      display: inline-flex;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;

      &.published {
        background: #dcfce7;
        color: #166534;
      }

      &.draft {
        background: #f1f5f9;
        color: #475569;
      }
    }

    .actions-group {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      color: #64748b;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;

      &:hover {
        background: #f1f5f9;
        color: #1e293b;
      }

      &.delete:hover {
        background: #fee2e2;
        color: #dc2626;
        border-color: #fecaca;
      }
    }

    .empty-state {
      padding: 4rem 0;
      text-align: center;
      color: #94a3b8;

      lucide-icon {
        margin-bottom: 1rem;
        opacity: 0.3;
      }
    }

    .text-right { text-align: right; }
  `]
})
export class ArticleListComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);

  searchQuery = '';
  statusFilter = 'all';
  typeFilter = 'all';

  allPosts = this.state.posts;

  filteredPosts = computed(() => {
    return this.allPosts().filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          post.slug.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesStatus = this.statusFilter === 'all' || post.status === this.statusFilter;
      const matchesType = this.typeFilter === 'all' || post.type === this.typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  });

  ngOnInit(): void {}

  onSearch() {
    // Computed signal handles this reactively
  }

  onFilterChange() {
    // Computed signal handles this reactively
  }

  onDelete(post: Post) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${post.title}" ?`)) {
      this.store.deletePost(post.id).subscribe({
        next: (success) => {
          if (success) {
            console.log('Post deleted');
          }
        },
        error: (err) => console.error('Delete failed', err)
      });
    }
  }
}
