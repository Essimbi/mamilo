import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { Post } from '../../../../../core/models/post.model';

@Component({
  selector: 'app-recent-articles',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="card recent-articles">
      <div class="card-header">
        <div class="header-info">
          <h3>Articles récents</h3>
          <p>Gérez vos dernières publications et leur visibilité.</p>
        </div>
        <div class="header-actions">
           <button class="btn-icon">
             <lucide-icon name="filter" size="18"></lucide-icon>
           </button>
           <a routerLink="/admin/articles" class="link-action">Tout afficher</a>
        </div>
      </div>

      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Titre de l'article</th>
              <th>Catégorie</th>
              <th>Statut</th>
              <th>Dernière modification</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let post of posts">
              <td>
                <div class="title-cell">
                  <span class="post-title">{{ post.title }}</span>
                </div>
              </td>
              <td>
                <span class="badge-category" [ngClass]="post.category.slug">{{ post.category.name }}</span>
              </td>
              <td>
                <div class="status-cell">
                  <span class="status-dot" [ngClass]="post.status"></span>
                  <span class="status-text">{{ post.status }}</span>
                </div>
              </td>
              <td>
                <span class="date-text">{{ post.updatedAt | date:'yyyy-MM-dd' }}</span>
              </td>
              <td class="text-right">
                <a [routerLink]="['/admin/posts/edit', post.slug]" class="btn-icon" title="Modifier">
                  <lucide-icon name="pencil" size="18"></lucide-icon>
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styleUrl: './recent-articles.component.scss'
})
export class RecentArticlesComponent {
  @Input() posts: Post[] = [];
}
