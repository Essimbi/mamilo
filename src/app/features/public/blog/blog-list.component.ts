import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { SeoService } from '../../../core/services/seo.service';
import { Post } from '../../../core/models/post.model';
import { PostCardComponent } from '../../../shared/components/post-card.component';
import { LucideAngularModule } from 'lucide-angular';
import { map } from 'rxjs';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PostCardComponent, LucideAngularModule],
  styleUrl: './blog-list.component.scss',
  template: `
    <div class="blog-list-container">
      <!-- Header List -->
      <div class="blog-header">
        <div class="header-content">
          <h1>L'ÉDITORIAL</h1>
          <p>
            Parcourez l'ensemble de nos publications classées par thématiques et formats.
          </p>
        </div>
      </div>

      <!-- Filters & Content -->
      <div class="content-section">
        <!-- Tabs Filters -->
        <div class="filters-wrapper">
          <button 
            *ngFor="let type of types"
            [routerLink]="[]"
            [queryParams]="{ type: type.value === 'all' ? null : type.value }"
            queryParamsHandling="merge"
            [class.active]="activeType() === type.value"
            class="filter-btn"
          >
            {{ type.label }}
          </button>
        </div>

        <!-- Grid -->
        <div class="posts-list">
          <app-post-card 
            *ngFor="let post of posts()" 
            [post]="post" 
            variant="horizontal"
          ></app-post-card>

          <div *ngIf="posts().length === 0" class="empty-state">
            <lucide-icon name="file-text" size="48"></lucide-icon>
            <h3>Aucun article trouvé</h3>
          </div>
        </div>

        <ng-template #loading>
          <div class="loading-skeleton">
            <div *ngFor="let i of [1,2,3]" class="skeleton-item"></div>
          </div>
        </ng-template>
      </div>
    </div>
  `
})
export class BlogListComponent implements OnInit {
  private state = inject(GlobalStateService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);

  activeType = signal<string>('all');

  posts = computed(() => {
    const allPosts = this.state.posts();
    const type = this.activeType();

    if (type === 'all') return allPosts;
    return allPosts.filter(p => p.type === type);
  });

  types = [
    { label: 'Tous', value: 'all' },
    { label: 'Articles', value: 'article' },
    { label: 'Notes d\'intention', value: 'note' },
    { label: 'Récaps', value: 'recap' }
  ];

  ngOnInit(): void {
    const s = this.state.settings();
    this.seoService.updateTitle('L\'Éditorial');
    this.seoService.updateMeta(
      s?.siteDescription || 'Toutes les publications de Jean Dupont. Articles, notes et récaps de séminaires.',
      s?.keywords || ['blog', 'éditorial', 'articles']
    );

    this.route.queryParams.subscribe(params => {
      this.activeType.set(params['type'] || 'all');
    });
  }
}
