import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '../../core/models/post.model';
import { BadgeTypeComponent } from './badge-type.component';
import { LucideAngularModule, Clock, Calendar, User } from 'lucide-angular';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, BadgeTypeComponent, LucideAngularModule],
  styleUrl: './post-card.component.scss',
  template: `
    <article class="post-card" [class]="'variant-' + variant">
      <!-- Background Image for Featured -->
      <div *ngIf="variant === 'featured' && post.coverImage" class="card-bg-image">
        <img [src]="post.coverImage.url" [alt]="post.coverImage.alt">
        <div class="card-overlay"></div>
      </div>

      <!-- Image Section for Horizontal / Vertical -->
      <div *ngIf="variant !== 'featured'" class="card-image">
        <img 
          *ngIf="post.coverImage" 
          [src]="post.coverImage.url" 
          [alt]="post.coverImage.alt"
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
