import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IContentService } from '../../../core/services/content.interface';
import { SeoService } from '../../../core/services/seo.service';
import { Post } from '../../../core/models/post.model';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  styleUrl: './article-detail.component.scss',
  template: `
    <article *ngIf="post$ | async as post" class="article-container">
      <!-- Floating Social Sidebar -->
      <aside class="social-sidebar">
        <div class="sidebar-inner">
          <button class="social-icon" title="Partager sur LinkedIn">
            <lucide-icon name="linkedin" size="18"></lucide-icon>
          </button>
          <button class="social-icon" title="Partager sur Twitter">
            <lucide-icon name="twitter" size="18"></lucide-icon>
          </button>
          <button class="social-icon" title="Enregistrer">
            <lucide-icon name="share-2" size="18"></lucide-icon>
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
            <img [src]="post.author.avatar.url" class="author-avatar" [alt]="post.author.name">
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
          <a *ngFor="let tag of post.tags" [routerLink]="['/articles']" [queryParams]="{tag: tag.name}" class="tag-btn">
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
              <img src="assets/images/mock/article1.jpg" alt="Article 1" class="card-img">
              <div class="card-content">
                <span class="card-category">Technologie</span>
                <h4 class="card-title">L'avenir de l'évaluation par les pairs</h4>
              </div>
            </div>
            <div class="related-card">
              <img src="assets/images/mock/article2.jpg" alt="Article 2" class="card-img">
              <div class="card-content">
                <span class="card-category">Éthique</span>
                <h4 class="card-title">Protection des données de la recherche</h4>
              </div>
            </div>
            <div class="related-card">
              <img src="assets/images/mock/article3.jpg" alt="Article 3" class="card-img">
              <div class="card-content">
                <span class="card-category">Gouvernance</span>
                <h4 class="card-title">Souveraineté académique à l'ère du Big Data</h4>
              </div>
            </div>
          </div>
        </section>

        <!-- Discussions -->
        <section class="discussion-section">
          <h2 class="discussion-title"><lucide-icon name="message-square" size="20"></lucide-icon> Discussions (4)</h2>
          <div class="comment-input-area">
            <img [src]="post.author.avatar.url" class="current-user-avatar" alt="User">
            <div class="input-wrapper">
              <textarea placeholder="Contribuez au discours académique..."></textarea>
              <div class="input-footer">
                <p class="char-info">Votre message sera soumis à la modération avant publication.</p>
                <button class="submit-btn">Publier un commentaire</button>
              </div>
            </div>
          </div>
          <div class="comments-list">
             <!-- Mock comments -->
             <div class="comment-item">
               <img src="assets/images/mock/avatar.jpg" class="comment-avatar" alt="Dr. Claire Morel">
               <div class="comment-content">
                 <div class="comment-header">
                   <h4 class="comment-author">Dr. Claire Morel</h4>
                   <span class="comment-date">Il y a 2 jours</span>
                 </div>
                 <p class="comment-text">Cet article soulève des points cruciaux. La visibilité ne doit pas primer sur la qualité intrinsèque des travaux. Bravo pour cette analyse.</p>
               </div>
             </div>
          </div>
        </section>
      </main>
    </article>
  `
})
export class ArticleDetailComponent implements OnInit {
  private contentService = inject(IContentService);
  private seoService = inject(SeoService);
  private route = inject(ActivatedRoute);

  post$!: Observable<Post | null>;

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
            url: window.location.href
          });
          this.seoService.generateStructuredData(post);
        }
      })
    );
  }
}
