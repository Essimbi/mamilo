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
            *ngFor="let category of categories(); trackBy: trackByCategory"
            [routerLink]="[]"
            [queryParams]="{ category: category.slug === 'all' ? null : category.slug }"
            queryParamsHandling="merge"
            [class.active]="activeCategory() === category.slug"
            class="filter-btn"
          >
            {{ category.name }}
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

  activeCategory = signal<string>('all');
  activeSearch = signal<string>('');

  posts$!: Observable<Post[]>;
  categories = signal<any[]>([{ slug: 'all', name: 'Tous' }]);

  ngOnInit(): void {
    const s = this.state.settings();
    this.seoService.updateTitle('L\'Éditorial');
    this.seoService.updateMeta(
      s?.site_description || 'Toutes les publications de Dr. Christian Mamilo. Articles, notes et récaps de séminaires.',
      ['blog', 'éditorial', 'articles', 'mamilo']
    );

    this.route.queryParams.subscribe(params => {
      this.activeCategory.set(params['category'] || 'all');
      this.activeSearch.set(params['search'] || '');
    });

    this.contentService.getCategories().subscribe(res => {
      this.categories.set([{ slug: 'all', name: 'Tous' }, ...res]);
    });

    this.posts$ = this.route.queryParams.pipe(
      switchMap(params => {
        const filters: any = {};
        if (params['category'] && params['category'] !== 'all') filters.category = params['category'];
        if (params['tag']) filters.tag = params['tag'];
        if (params['search']) filters.search = params['search'];
        
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
  trackByCategory(_: number, category: any) { return category.slug; }
}
