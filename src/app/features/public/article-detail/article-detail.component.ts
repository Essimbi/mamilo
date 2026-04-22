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
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
  styleUrl: './article-detail.component.scss',
  template: `
    <article *ngIf="post() as post" class="article-container">
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
          <button class="action-btn" [class.active]="hasLiked()" (click)="onLike(post.id)" title="J'aime">
            <lucide-icon name="heart" [size]="20" [class.filled]="hasLiked()"></lucide-icon>
            <span>{{ post.likesCount }}</span>
          </button>
          <div class="divider"></div>
          <button class="social-icon bookmark" title="Sauvegarder">
            <lucide-icon name="hash" size="18"></lucide-icon>
          </button>
        </div>
      </aside>

      <!-- Full Bleed Hero Header -->
      <header class="hero-banner">
        <div class="hero-image-wrapper" *ngIf="post.coverImage">
          <img 
            [src]="post.coverImage.url" 
            [alt]="post.coverImage.alt || post.title"
            class="hero-image"
            loading="eager" decoding="async" fetchpriority="high"
          >
          <div class="hero-overlay"></div>
        </div>

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
            <img [src]="post.author.avatar?.url || 'assets/images/default-avatar.png'" class="author-avatar" [alt]="post.author.name" loading="eager" decoding="async" fetchpriority="high">
            <div class="meta-info">
              <span class="author-name">Par {{ post.author.name }}</span>
              <div class="sub-meta">
                <span>{{ post.publishedAt! | date:'d MMMM yyyy' }}</span>
                <span class="dot">•</span>
                <span>{{ post.readingTime }} min de lecture</span>
              </div>
            </div>
          </div>
          <p *ngIf="post.coverImage?.alt" class="hero-image-caption">Crédit image : {{ post.coverImage?.alt }}</p>
        </div>
      </header>

      <!-- Article Body -->
      <main class="article-main">
        <div class="article-body">
          <ng-container *ngFor="let block of post.blocks || []">
            <!-- Text Blocks -->
            <div class="content-block text-block" *ngIf="block.type === 'paragraph' || block.type === 'heading'">
              <p *ngIf="block.type === 'paragraph'" [innerHTML]="block.content.text"></p>
              <h2 *ngIf="block.type === 'heading' && (block.content.level === 2 || !block.content.level)" [innerHTML]="block.content.text"></h2>
              <h3 *ngIf="block.type === 'heading' && block.content.level === 3" [innerHTML]="block.content.text"></h3>
              <h4 *ngIf="block.type === 'heading' && block.content.level === 4" [innerHTML]="block.content.text"></h4>
            </div>
            
            <!-- Media Blocks (Images) -->
            <figure *ngIf="block.type === 'image'" class="content-block media-block">
              <img [src]="block.content.url" [alt]="block.content.caption || ''" loading="lazy">
              <figcaption *ngIf="block.content.caption">{{ block.content.caption }}</figcaption>
            </figure>

            <!-- Quotes -->
            <div class="content-block quote-block" *ngIf="block.type === 'quote'">
              <blockquote class="highlight-quote">
                <p [innerHTML]="block.content.text"></p>
                <span *ngIf="block.content.caption" class="quote-source">— {{ block.content.caption }}</span>
              </blockquote>
            </div>
          </ng-container>
        </div>

        <!-- Tags Section -->
        <div *ngIf="(post.tags || []).length > 0" class="tags-section">
          <lucide-icon name="hash" size="16" class="tags-icon"></lucide-icon>
          <a *ngFor="let tag of post.tags; trackBy: trackByTag" [routerLink]="['/articles']" [queryParams]="{tag: tag.name}" class="tag-badge">
            {{ tag.name }}
          </a>
        </div>

        <!-- Author Card -->
        <section class="author-card">
          <div class="author-card-content">
            <img [src]="post.author.avatar?.url || 'assets/images/default-avatar.png'" class="author-card-avatar" [alt]="post.author.name">
            <div class="author-card-info">
              <h3 class="author-card-name">{{ post.author.name }}</h3>
              <p *ngIf="post.author.role" class="author-card-role">{{ post.author.role }}</p>
              <p *ngIf="post.author.bio" class="author-card-bio">{{ post.author.bio }}</p>
              <a routerLink="/about" class="read-more-link">Voir le profil <lucide-icon name="chevron-right" size="16"></lucide-icon></a>
            </div>
          </div>
        </section>

        <!-- Related Articles -->
        <section *ngIf="relatedPosts().length > 0" class="related-articles">
          <div class="section-header">
            <h2>Informations connexes</h2>
            <a routerLink="/articles" class="view-all">Découvrir plus d'articles <lucide-icon name="chevron-right" size="16"></lucide-icon></a>
          </div>
          <div class="related-grid">
            <div *ngFor="let rel of relatedPosts()" class="related-card" [routerLink]="['/articles', rel.slug]">
              <img [src]="rel.coverImage?.url || 'assets/images/mock/article-placeholder.jpg'" [alt]="rel.title" class="card-img" loading="lazy">
              <div class="card-content">
                <span class="card-category">{{ rel.category?.name || 'Recherche' }}</span>
                <h4 class="card-title">{{ rel.title }}</h4>
              </div>
            </div>
          </div>
        </section>

        <!-- Discussions -->
        <section class="discussion-section">
          <h2 class="discussion-title"><lucide-icon name="message-square" size="20"></lucide-icon> Discussions ({{ post.comments?.length || 0 }})</h2>
          <div class="comment-input-area">
            <div class="avatar-placeholder">
              <lucide-icon name="user" size="20"></lucide-icon>
            </div>
            <div class="input-wrapper">
              <textarea [(ngModel)]="newComment" placeholder="Partagez votre avis sur cet article..."></textarea>
              <div class="input-footer">
                <p class="char-info">
                  <lucide-icon name="shield-check" size="14"></lucide-icon>
                  Soumis à modération avant publication
                </p>
                <button class="submit-btn" (click)="onSubmitComment(post.id)" [disabled]="!newComment.trim()">
                  <lucide-icon name="send" size="16"></lucide-icon>
                  Publier
                </button>
              </div>
            </div>
          </div>
          <div class="comments-list">
             <div *ngFor="let comment of post.comments || []; trackBy: trackByComment" 
                  class="comment-item" 
                  [ngClass]="{'admin-comment': isAdminComment(comment), 'visitor-comment': !isAdminComment(comment)}">
               <div class="comment-avatar-wrapper">
                 <img *ngIf="hasValidAvatar(comment.authorAvatar); else fallbackInitial" [src]="comment.authorAvatar" class="comment-avatar" [alt]="comment.authorName">
                 <ng-template #fallbackInitial>
                   <div class="avatar-initial">{{ (comment.authorName || 'A').charAt(0) }}</div>
                 </ng-template>
               </div>
               <div class="comment-content">
                 <div class="comment-header">
                   <h4 class="comment-author">{{ comment.authorName }}</h4>
                   <span class="comment-date">{{ comment.createdAt | date:'d MMM yyyy' }}</span>
                 </div>
                 <p class="comment-text">{{ comment.content }}</p>
               </div>
             </div>

             <div *ngIf="!(post.comments?.length)" class="no-comments">
               <lucide-icon name="message-circle" size="32"></lucide-icon>
               <p>Aucun commentaire pour le moment</p>
               <span>Soyez le premier à partager votre avis sur cet article.</span>
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
  private toastService = inject(ToastService);

  post = signal<Post | null>(null);
  relatedPosts = signal<Post[]>([]);
  navigation = signal<{ previous: Post | null; next: Post | null }>({ previous: null, next: null });
  readingProgress = signal(0);
  newComment = '';
  hasLiked = signal(false);
  private isBrowser = isPlatformBrowser(this.platformId);

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.contentService.getPostBySlug(params['slug']))
    ).subscribe({
      next: (post) => {
        if (post) {
          this.post.set(post);
          this.seoService.updateTitle(post.title);
          this.seoService.updateMeta(post.excerpt, post.seo?.keywords || []);
          this.seoService.updateOpenGraph({
            title: post.seo?.og_title || post.title,
            description: post.seo?.og_description || post.excerpt,
            image: post.seo?.og_image || '',
            url: this.isBrowser ? window.location.href : ''
          });
          this.seoService.generateStructuredData(post);
          
          this.loadAdditionalData(post.id);
        }
      },
      error: (err) => {
        this.toastService.error('Erreur lors du chargement de l\'article.');
        console.error(err);
      }
    });
  }

  private loadAdditionalData(postId: string) {
    this.contentService.getRelatedPosts(postId).subscribe(posts => {
      this.relatedPosts.set(posts);
    });
    
    this.contentService.getPostNavigation(postId).subscribe(nav => {
      this.navigation.set(nav);
    });
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
    this.contentStore.likePost(id).subscribe({
      next: (newCount) => {
        this.hasLiked.set(true);
        this.toastService.success('Article ajouté à vos favoris !');
        // Update local signal to reflect the precise new count from backend
        const currentPost = this.post();
        if (currentPost && newCount !== undefined) {
          this.post.set({ ...currentPost, likesCount: newCount });
        }
      },
      error: () => {
        this.toastService.error('Une erreur est survenue.');
      }
    });
  }

  onSubmitComment(post_id: string) {
    if (!this.newComment.trim()) return;
    
    const commentText = this.newComment.trim();
    this.contentStore.addComment(post_id, commentText).subscribe({
      next: (newCommentData) => {
        this.newComment = '';
        this.toastService.success('Votre commentaire a été posté avec succès !');
        
        // Update local signal immediately
        const currentPost = this.post();
        if (currentPost) {
          this.post.set({ 
            ...currentPost, 
            comments: [...(currentPost.comments || []), newCommentData] 
          });
        }
      },
      error: () => {
        this.toastService.error('Erreur lors de la publication de votre commentaire.');
      }
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
  hasValidAvatar(avatar: string | null | undefined): boolean {
    if (!avatar) return false;
    if (avatar.includes('assets/images/mock/avatar.jpg')) return false;
    return true;
  }

  isAdminComment(comment: any): boolean {
    return comment?.authorName?.toLowerCase().includes('mamilo') || comment?.authorName === 'Christian Mamilo';
  }

  trackByComment(index: number, comment: any): string { return comment.id; }
}
