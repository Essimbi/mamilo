import { Component, OnInit, inject, PLATFORM_ID, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IContentService } from '../../../core/services/content.interface';
import { SeoService } from '../../../core/services/seo.service';
import { Post } from '../../../core/models/post.model';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ContentStore } from '../../../core/services/content-store.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  styleUrl: './article-detail.component.scss',
  template: `
    <article *ngIf="post$ | async as post" class="article-container">
      <!-- Reading Progress Bar -->
      <div class="reading-progress">
        <div class="progress-bar" [style.width.%]="readingProgress()"></div>
      </div>

      <!-- Floating Social Sidebar -->
      <aside class="social-sidebar">
        <div class="sidebar-inner">
          <button class="social-icon" (click)="share('linkedin', post)" title="Partager sur LinkedIn">
            <lucide-icon name="linkedin" size="18"></lucide-icon>
          </button>
          <button class="social-icon" (click)="share('twitter', post)" title="Partager sur Twitter">
            <lucide-icon name="twitter" size="18"></lucide-icon>
          </button>
          <button class="social-icon" (click)="onLike(post.id)" [class.liked]="hasLiked()" title="J'aime">
            <lucide-icon name="heart" [class.fill]="hasLiked()" size="18"></lucide-icon>
            <span class="count" *ngIf="post.likesCount">{{ post.likesCount }}</span>
          </button>
          <div class="divider"></div>
          <button class="social-icon bookmark" title="Sauvegarder">
            <lucide-icon name="hash" size="18"></lucide-icon>
          </button>
        </div>
      </aside>

      <!-- Article Hero Section -->
      <section class="article-hero">
        <div class="hero-content">
          <div class="breadcrumb">
            <a routerLink="/articles"><lucide-icon name="chevron-left" size="16"></lucide-icon> Retour aux articles</a>
          </div>
          
          <div class="category-badge">
            {{ post.category.name }}
          </div>

          <h1 class="article-title">{{ post.title }}</h1>
          <p class="article-subtitle">{{ post.excerpt }}</p>

          <div class="author-meta">
            <img [src]="post.author.avatar.url" class="author-avatar" [alt]="post.author.name" loading="eager" decoding="async" fetchpriority="high">
            <div class="meta-info">
              <span class="author-name">Par {{ post.author.name }}</span>
              <div class="sub-meta">
                <span class="publish-date"><lucide-icon name="calendar" size="14"></lucide-icon> {{ post.publishedAt | date:'mediumDate' }}</span>
                <span class="reading-time"><lucide-icon name="clock" size="14"></lucide-icon> {{ post.readingTime }} min</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Image -->
      <div class="featured-image-container">
        <img 
          *ngIf="post.coverImage" 
          [src]="post.coverImage.url" 
          [alt]="post.coverImage.alt"
          class="featured-image"
          loading="lazy" decoding="async"
        >
        <p class="image-caption">Image : La pédagogie inversée en université, un levier pour l'engagement étudiant.</p>
      </div>

      <!-- Article Body -->
      <main class="article-main">
        <div class="article-body" [innerHTML]="post.content"></div>

        <!-- Blockquote Example (Styled in SCSS) -->
        <div class="highlight-quote">
          <p>« Nous assistons à un passage de la République des Lettres à la République des Pixels... où le poids d’un argument est souvent mesuré par ses métadonnées plutôt que par sa logique. »</p>
          <span class="quote-source">— Pr. MAMELO Christian</span>
        </div>

        <!-- Data Visualization Mockup -->
        <div class="data-section">
          <div class="chart-container">
            <div class="chart-header">
              <h3>Impact des algorithmes sur la visibilité académique</h3>
              <p>Évolution de la visibilité des travaux selon les critères de classement (2020-2024)</p>
            </div>
            <div class="chart-mockup">
              <!-- Placeholder for chart image -->
              <div class="chart-placeholder">
                <lucide-icon name="trending-up" size="48"></lucide-icon>
                <span>Visualisation des données</span>
              </div>
            </div>
            <div class="chart-stat">
              <span class="stat-value">+42%</span>
              <span class="stat-label">de visibilité pour les articles optimisés SEO académique</span>
            </div>
          </div>
        </div>

        <!-- Tags Section -->
        <div class="tags-section">
          <a *ngFor="let tag of post.tags; trackBy: trackByTag" [routerLink]="['/articles']" [queryParams]="{tag: tag.name}" class="tag-btn">
            {{ tag.name }}
          </a>
        </div>

        <!-- Author Card -->
        <section class="author-card">
          <div class="author-card-content">
            <img [src]="post.author.avatar.url" class="author-card-avatar" [alt]="post.author.name">
            <div class="author-card-info">
              <h3 class="author-card-name">{{ post.author.name }}</h3>
              <p class="author-card-role">PROFESSEUR ÉMÉRITE DE LA COMMUNICATION</p>
              <p class="author-card-bio">{{ post.author.bio }}</p>
              <a href="#" class="read-more-link">Lire ses articles <lucide-icon name="chevron-right" size="16"></lucide-icon></a>
            </div>
          </div>
        </section>

        <!-- Related Articles -->
        <section class="related-articles">
          <div class="section-header">
            <h2>Informations connexes</h2>
            <a routerLink="/articles" class="view-all">Découvrir plus d'articles <lucide-icon name="chevron-right" size="16"></lucide-icon></a>
          </div>
          <div class="related-grid">
            <div class="related-card">
              <img src="assets/images/mock/article1.jpg" alt="Article 1" class="card-img" loading="lazy" decoding="async">
              <div class="card-content">
                <span class="card-category">Technologie</span>
                <h4 class="card-title">L'avenir de l'évaluation par les pairs</h4>
              </div>
            </div>
            <div class="related-card">
              <img src="assets/images/mock/article2.jpg" alt="Article 2" class="card-img" loading="lazy" decoding="async">
              <div class="card-content">
                <span class="card-category">Éthique</span>
                <h4 class="card-title">Protection des données de la recherche</h4>
              </div>
            </div>
            <div class="related-card">
              <img src="assets/images/mock/article3.jpg" alt="Article 3" class="card-img" loading="lazy" decoding="async">
              <div class="card-content">
                <span class="card-category">Gouvernance</span>
                <h4 class="card-title">Souveraineté académique à l'ère du Big Data</h4>
              </div>
            </div>
          </div>
        </section>

        <!-- Discussions -->
        <section class="discussion-section">
          <h2 class="discussion-title"><lucide-icon name="message-square" size="20"></lucide-icon> Discussions ({{ post.comments.length }})</h2>
          <div class="comment-input-area">
            <img [src]="'assets/images/mock/avatar.jpg'" class="current-user-avatar" alt="User">
            <div class="input-wrapper">
              <textarea [(ngModel)]="newComment" placeholder="Contribuez au discours académique..."></textarea>
              <div class="input-footer">
                <p class="char-info">Votre message sera soumis à la modération avant publication.</p>
                <button class="submit-btn" (click)="onSubmitComment(post.id)" [disabled]="!newComment.trim()">Publier un commentaire</button>
              </div>
            </div>
          </div>
          <div class="comments-list">
             <div *ngFor="let comment of post.comments; trackBy: trackByComment" class="comment-item" appScrollReveal>
               <img [src]="comment.authorAvatar" class="comment-avatar" [alt]="comment.authorName">
               <div class="comment-content">
                 <div class="comment-header">
                   <h4 class="comment-author">{{ comment.authorName }}</h4>
                   <span class="comment-date">{{ comment.createdAt | date:'shortDate' }}</span>
                 </div>
                 <p class="comment-text">{{ comment.content }}</p>
               </div>
             </div>

             <div *ngIf="!post.comments.length" class="no-comments">
               Soyez le premier à contribuer à cette discussion académique.
             </div>
          </div>
        </section>
      </main>
    </article>
  `
})
export class ArticleDetailComponent implements OnInit {
  private contentService = inject(IContentService);
  private contentStore = inject(ContentStore);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);

  post$!: Observable<Post | null>;
  readingProgress = signal(0);
  newComment = '';
  hasLiked = signal(false);
  private isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(
      switchMap(params => this.contentService.getPostBySlug(params['slug'])),
      tap(post => {
        if (post) {
          this.seoService.updateTitle(post.title);
          this.seoService.updateMeta(post.excerpt, post.seo.keywords);
          this.seoService.updateOpenGraph({
            title: post.seo.ogTitle,
            description: post.seo.ogDescription,
            image: post.seo.ogImage,
            url: this.isBrowser ? window.location.href : ''
          });
          this.seoService.generateStructuredData(post);
        }
      })
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isBrowser) {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const currentScroll = window.scrollY;
      this.readingProgress.set((currentScroll / scrollHeight) * 100);
    }
  }

  onLike(id: string) {
    if (this.hasLiked()) return;
    this.contentStore.likePost(id).subscribe(() => {
      this.hasLiked.set(true);
    });
  }

  onSubmitComment(postId: string) {
    if (!this.newComment.trim()) return;
    this.contentStore.addComment(postId, this.newComment.trim()).subscribe(() => {
      this.newComment = '';
    });
  }

  share(platform: string, post: Post) {
    if (!this.isBrowser) return;
    const url = window.location.href;
    const text = encodeURIComponent(post.title);
    let shareUrl = '';

    if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }

  trackByTag(_: number, tag: any) { return tag.name; }
  trackByComment(_: number, comment: any) { return comment.id; }
}
