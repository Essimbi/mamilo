import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '../../core/models/post.model';
import { BadgeTypeComponent } from './badge-type.component';
import { LucideAngularModule, Clock, Calendar, User, Heart, MessageSquare } from 'lucide-angular';

@Component({
  selector: 'app-post-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, BadgeTypeComponent, LucideAngularModule],
  styles: [`
    .post-card {
        display: flex;
        transition: all 0.3s ease;
        border-radius: 0.5rem;
        background-color: #ffffff;
        overflow: hidden;
        border: 1px solid #f1f5f9;
        position: relative;
    }

    .post-card:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .post-card:hover .card-image img {
        transform: scale(1.1);
    }

    .post-card.variant-horizontal {
        flex-direction: row;
        gap: 1.5rem;
    }

    @media (max-width: 768px) {
        .post-card.variant-horizontal {
            flex-direction: column;
            gap: 1rem;
        }
    }

    .post-card.variant-horizontal .card-image {
        width: 33.333333%;
        aspect-ratio: 4/3;
    }

    @media (max-width: 768px) {
        .post-card.variant-horizontal .card-image {
            width: 100%;
            aspect-ratio: 16/9;
        }
    }

    .post-card.variant-vertical {
        flex-direction: column;
    }

    .post-card.variant-vertical .card-image {
        width: 100%;
        aspect-ratio: 16/9;
    }

    .post-card.variant-featured {
        position: relative;
        background-color: #1B3A6B;
        color: #ffffff;
        min-height: 400px;
        display: flex;
        align-items: flex-end;
        padding: 2rem;
        border-radius: 0.75rem;
    }

    .post-card.variant-featured:hover .card-image img {
        transform: scale(1.05);
    }

    .post-card.variant-featured .card-bg-image {
        position: absolute;
        inset: 0;
        z-index: 0;
    }

    .post-card.variant-featured .card-bg-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.4;
        transition: transform 0.5s ease;
    }

    .post-card.variant-featured .card-bg-image .card-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, #1B3A6B, rgba(27, 58, 107, 0.6), transparent);
    }

    .post-card.variant-featured .card-content {
        position: relative;
        z-index: 10;
        width: 100%;
        max-width: 42rem;
        padding: 0;
    }

    .post-card.variant-featured .card-title {
        font-size: 2.25rem;
        font-weight: 800;
        margin-bottom: 1rem;
        color: #ffffff;
    }

    .post-card.variant-featured .card-excerpt {
        color: #e2e8f0;
        font-size: 1.125rem;
        margin-bottom: 1.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .post-card.variant-featured .card-meta {
        color: #cbd5e1;
    }

    .card-image {
        overflow: hidden;
        background-color: #f1f5f9;
    }

    .card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }

    .card-image .placeholder-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e2e8f0;
        color: #94a3b8;
    }

    .card-content {
        flex: 1;
        padding: 1.5rem;
    }

    .card-tags {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .card-tags .category-badge {
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.125rem 0.5rem;
        border-radius: 0.25rem;
        background-color: rgba(74, 144, 196, 0.1);
        color: #2E6DA4;
    }

    .card-title {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        font-family: inherit;
        line-height: 1.25;
    }

    .card-title a {
        text-decoration: none;
        color: inherit;
    }

    .card-title a::after {
        content: '';
        position: absolute;
        inset: 0;
    }

    .card-title a:hover {
        color: #2E6DA4;
    }

    .card-excerpt {
        color: #475569;
        font-family: inherit;
        margin-bottom: 1.5rem;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .card-meta {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: #64748b;
    }

    .card-meta .meta-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
  `]
,
  template: `
    <article class="post-card" [class]="'variant-' + variant">
      <!-- Background Image for Featured -->
      <div *ngIf="variant === 'featured' && post.coverImage" class="card-bg-image">
        <img [src]="post.coverImage.url" [alt]="post.coverImage.alt" loading="lazy" decoding="async">
        <div class="card-overlay"></div>
      </div>

      <!-- Image Section for Horizontal / Vertical -->
      <div *ngIf="variant !== 'featured'" class="card-image">
        <img 
          *ngIf="post.coverImage" 
          [src]="post.coverImage.url" 
          [alt]="post.coverImage.alt"
          loading="lazy" decoding="async"
        >
        <div *ngIf="!post.coverImage" class="placeholder-image">
          <lucide-icon name="image" size="48"></lucide-icon>
        </div>
      </div>

      <!-- Content Section -->
      <div class="card-content">
        <div class="card-tags">
          <app-badge-type [type]="post.type"></app-badge-type>
          <span class="category-badge">
            {{ post.category.name }}
          </span>
        </div>

        <h3 class="card-title">
          <a [routerLink]="['/blog', post.slug]">
            {{ post.title }}
          </a>
        </h3>

        <p class="card-excerpt">
          {{ post.excerpt }}
        </p>

        <div class="card-meta">
          <div class="meta-item">
            <lucide-icon name="calendar" size="14"></lucide-icon>
            <span>{{ post.publishedAt | date:'dd MMM yyyy' }}</span>
          </div>
          <div class="meta-item">
            <lucide-icon name="clock" size="14"></lucide-icon>
            <span>{{ post.readingTime }} min</span>
          </div>
          <div class="meta-item" *ngIf="post.likesCount">
            <lucide-icon name="heart" size="14"></lucide-icon>
            <span>{{ post.likesCount }}</span>
          </div>
          <div class="meta-item">
            <lucide-icon name="message-square" size="14"></lucide-icon>
            <span>{{ (post?.comments)?.length || 0 }}</span>
          </div>
          <div class="meta-item">
            <lucide-icon name="user" size="14"></lucide-icon>
            <span>{{ post.author.name }}</span>
          </div>
        </div>
      </div>
    </article>
  `
})
export class PostCardComponent {
  @Input() post!: Post;
  @Input() variant: 'horizontal' | 'vertical' | 'featured' = 'vertical';
}
