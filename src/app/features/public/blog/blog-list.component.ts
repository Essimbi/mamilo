import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { SeoService } from '../../../core/services/seo.service';
import { Post } from '../../../core/models/post.model';
import { PostCardComponent } from '../../../shared/components/post-card.component';
import { LucideAngularModule } from 'lucide-angular';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IContentService } from '../../../core/services/content.interface';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, PostCardComponent, LucideAngularModule],
  styleUrl: './blog-list.component.scss',
  template: `
    <div class="blog-list-container">
      <!-- Header List -->
      <div class="blog-header">
        <div class="header-content">
          <h1>L'ÉDITORIAL</h1>
          <p *ngIf="!activeSearch()">
            Parcourez l'ensemble de nos publications classées par thématiques et formats.
          </p>
          <div *ngIf="activeSearch()" class="search-result-info">
            <p>Résultats pour : <strong>"{{ activeSearch() }}"</strong></p>
            <button (click)="clearSearch()" class="btn-clear-search">Voir tous les articles</button>
          </div>
        </div>
      </div>

      <!-- Filters & Content -->
      <div class="content-section">
        <!-- Tabs Filters -->
        <div class="filters-wrapper">
          <button 
            *ngFor="let type of types; trackBy: trackByType"
            [routerLink]="[]"
            [queryParams]="{ type: type.value === 'all' ? null : type.value }"
            queryParamsHandling="merge"
            [class.active]="activeType() === type.value"
            class="filter-btn"
          >
            {{ type.label }}
          </button>
        </div>

        <div class="posts-list" *ngIf="posts$ | async as posts; else loading">
          <app-post-card 
            *ngFor="let post of posts; trackBy: trackByPost" 
            [post]="post" 
            variant="horizontal"
          ></app-post-card>

          <div *ngIf="posts.length === 0" class="empty-state">
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
  private contentService = inject(IContentService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  activeType = signal<string>('all');
  activeSearch = signal<string>('');

  posts$!: Observable<Post[]>;

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
      s?.site_description || 'Toutes les publications de Dr. Christian Mamilo. Articles, notes et récaps de séminaires.',
      ['blog', 'éditorial', 'articles', 'mamilo']
    );

    this.route.queryParams.subscribe(params => {
      this.activeType.set(params['type'] || 'all');
      this.activeSearch.set(params['search'] || '');
    });

    this.posts$ = this.route.queryParams.pipe(
      switchMap(params => {
        const filters: any = {};
        if (params['category']) filters.category = params['category'];
        if (params['tag']) filters.tag = params['tag'];
        if (params['search']) filters.search = params['search'];
        if (params['type'] && params['type'] !== 'all') filters.type = params['type'];
        
        return this.contentService.getPosts(filters).pipe(map(res => res.items));
      })
    );
  }

  clearSearch() {
    this.activeSearch.set('');
    // Update URL without search param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge'
    });
  }

  trackByPost(_: number, post: any) { return post.id; }
  trackByType(_: number, type: any) { return type.value; }
}
