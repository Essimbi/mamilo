import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { Post } from '../../../../../core/models/post.model';

@Component({
  selector: 'app-top-posts',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="top-posts-card">
      <div class="card-header">
        <div class="header-info">
          <h3>Articles Populaires</h3>
          <p>Classement par nombre de réactions</p>
        </div>
        <div class="header-badge">
          <lucide-icon name="trophy" size="16"></lucide-icon>
        </div>
      </div>

      <div class="posts-list">
        <div *ngFor="let post of posts; let i = index" class="post-item">
          <span class="rank" [class.gold]="i === 0" [class.silver]="i === 1" [class.bronze]="i === 2">
            {{ i + 1 }}
          </span>
          <div class="post-thumb" *ngIf="post.coverImage?.url">
            <img [src]="post.coverImage!.url" [alt]="post.title">
          </div>
          <div class="post-thumb placeholder" *ngIf="!post.coverImage?.url">
            <lucide-icon name="file-text" size="14"></lucide-icon>
          </div>
          <div class="post-info">
            <a [routerLink]="['/admin/posts/edit', post.slug]" class="post-title">{{ post.title }}</a>
            <div class="post-stats">
              <div class="mini-bar-container">
                <div class="mini-bar" [style.width.%]="getBarWidth(post)"></div>
              </div>
              <span class="likes-count">
                <lucide-icon name="heart" size="12"></lucide-icon>
                {{ post.likesCount }}
              </span>
            </div>
          </div>
        </div>

        <div *ngIf="posts.length === 0" class="empty-list">
          <p>Aucun article pour le moment</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .top-posts-card {
      background: white; border-radius: 16px; padding: 1.5rem;
      border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;
      .header-info {
        h3 { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
        p { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; }
      }
      .header-badge {
        width: 36px; height: 36px; border-radius: 10px; display: flex;
        align-items: center; justify-content: center;
        background: linear-gradient(135deg, #f59e0b, #ef4444); color: white;
      }
    }
    .posts-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .post-item {
      display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.5rem;
      border-radius: 10px; transition: background 0.2s;
      &:hover { background: #f8fafc; }
    }
    .rank {
      width: 24px; height: 24px; border-radius: 6px; font-size: 0.7rem; font-weight: 800;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      background: #f1f5f9; color: #64748b;
      &.gold { background: #fef3c7; color: #b45309; }
      &.silver { background: #f1f5f9; color: #475569; }
      &.bronze { background: #fed7aa; color: #c2410c; }
    }
    .post-thumb {
      width: 36px; height: 36px; border-radius: 8px; overflow: hidden; flex-shrink: 0;
      img { width: 100%; height: 100%; object-fit: cover; }
      &.placeholder {
        background: #f1f5f9; display: flex; align-items: center; justify-content: center;
        color: #94a3b8;
      }
    }
    .post-info {
      flex: 1; min-width: 0;
      .post-title {
        font-size: 0.82rem; font-weight: 600; color: #1e293b; text-decoration: none;
        display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        &:hover { color: #3b82f6; }
      }
      .post-stats {
        display: flex; align-items: center; gap: 0.75rem; margin-top: 0.3rem;
      }
    }
    .mini-bar-container {
      flex: 1; height: 4px; background: #f1f5f9; border-radius: 2px; overflow: hidden;
    }
    .mini-bar {
      height: 100%; background: linear-gradient(90deg, #3b82f6, #6366f1); border-radius: 2px;
      transition: width 0.6s ease;
    }
    .likes-count {
      display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem;
      font-weight: 700; color: #f43f5e; flex-shrink: 0;
    }
    .empty-list { text-align: center; padding: 1.5rem; color: #94a3b8; font-size: 0.85rem; }
  `]
})
export class TopPostsComponent {
  @Input() posts: Post[] = [];

  private maxLikes = 0;

  ngOnChanges(): void {
    this.maxLikes = Math.max(...this.posts.map(p => p.likesCount || 0), 1);
  }

  getBarWidth(post: Post): number {
    if (this.maxLikes === 0) return 0;
    return ((post.likesCount || 0) / this.maxLikes) * 100;
  }
}
