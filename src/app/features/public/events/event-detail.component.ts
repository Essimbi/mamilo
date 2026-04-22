import { Component, OnInit, HostListener, PLATFORM_ID, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IContentService } from '../../../core/services/content.interface';
import { SeoService } from '../../../core/services/seo.service';
import { Event } from '../../../core/models/event.model';
import { LucideAngularModule } from 'lucide-angular';
import { Observable, switchMap, tap } from 'rxjs';
import { ContentStore } from '../../../core/services/content-store.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormsModule } from '@angular/forms';

@Component({
   selector: 'app-event-detail',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
   styleUrl: './event-detail.component.scss',
   template: `
    <article *ngIf="event() as event" class="event-page-wrapper">
      <!-- Hero Header Section -->
      <section class="event-hero" [style.backgroundImage]="'url(' + (event.coverImage?.url || 'assets/images/placeholder.jpg') + ')'">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="hero-breadcrumb">
            <a routerLink="/events"><lucide-icon name="chevron-left" size="14"></lucide-icon> Retour à la liste</a>
          </nav>
          
          <div class="hero-badge">{{ event.type || 'Événement' }}</div>
          
          <h1 class="hero-title">{{ event.title }}</h1>
          
           <div class="hero-actions">
              <button class="hero-like-btn" (click)="onLike(event.id)" [class.liked]="hasLiked()">
                <lucide-icon name="heart" [class.fill]="hasLiked()" size="18"></lucide-icon>
                <span>{{ event.likesCount || 0 }} intéressés</span>
              </button>
           </div>
        </div>
      </section>

      <!-- Main Layout -->
      <div class="content-container">
        <div class="layout-grid">
          <!-- Left Column: Main Content -->
          <main class="main-column">
            <section class="about-section">
              <span class="section-badge">À propos</span>
              <h2 class="section-title">À propos de l'événement</h2>
              <div class="event-full-description" [innerHTML]="event.description"></div>
            </section>

            <!-- Gallery -->
            <section class="gallery-section" *ngIf="event.gallery && event.gallery.length > 0">
              <h2 class="section-title">Aperçu Visuel</h2>
              <div class="gallery-layout">
                <div class="gallery-main" *ngIf="event.gallery[0]">
                  <img [src]="event.gallery[0].url" class="gallery-img" [alt]="event.gallery[0].alt" loading="lazy" decoding="async">
                </div>
                <div class="gallery-side" *ngIf="event.gallery.length > 1">
                  <ng-container *ngFor="let img of event.gallery | slice:1:4; let i = index">
                    <img [src]="img.url" class="gallery-img" [alt]="img.alt" loading="lazy" decoding="async">
                  </ng-container>
                </div>
              </div>
            </section>

            <!-- Map / Location -->
            <section class="map-section" *ngIf="event.location">
              <h2 class="section-title">Emplacement et directions</h2>
              <div class="map-placeholder">
                <div class="location-card">
                  <lucide-icon name="map-pin" size="24" class="map-icon"></lucide-icon>
                  <h4>Sur place / Distanciel</h4>
                  <p>{{ event.location }}</p>
                </div>
              </div>
            </section>

            <!-- Discussions -->
            <section class="discussion-section">
              <h2 class="discussion-title"><lucide-icon name="message-square" size="20"></lucide-icon> Questions & Discussions ({{ event.comments?.length || 0 }})</h2>
              <div class="comment-input-area">
                <div class="avatar-placeholder">
                  <lucide-icon name="user" size="20"></lucide-icon>
                </div>
                <div class="input-wrapper">
                  <textarea [(ngModel)]="newComment" placeholder="Posez une question sur cet événement..."></textarea>
                  <div class="input-footer">
                    <p class="char-info">
                      <lucide-icon name="shield-check" size="14"></lucide-icon>
                      Soumis à modération avant publication
                    </p>
                    <button class="submit-btn" (click)="onSubmitComment(event.id)" [disabled]="!newComment.trim()">
                      <lucide-icon name="send" size="16"></lucide-icon>
                      Envoyer
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="comments-list" *ngIf="event.comments && event.comments.length > 0; else noComments">
                <div class="comment-item" *ngFor="let comment of event.comments; trackBy: trackByComment">
                  <div class="comment-avatar">
                    <img [src]="comment.author_avatar || 'assets/images/mock/avatar.jpg'" [alt]="comment.author_name">
                  </div>
                  <div class="comment-content-wrap">
                    <div class="comment-header">
                      <span class="comment-author">{{ comment.author_name }}</span>
                      <span class="comment-date">{{ comment.created_at | date:'longDate':'':'fr' }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
              <ng-template #noComments>
                <div class="no-comments">
                  <p>Aucune discussion pour le moment. Soyez le premier à participer !</p>
                </div>
              </ng-template>
            </section>

          </main>

          <!-- Right Column: Sidebar -->
          <aside class="sidebar-column">
            <!-- Registration Card -->
            <div class="registration-card">
              <h3 class="reg-title">Inscrivez-vous maintenant</h3>
              <p class="reg-text">Réservez votre place pour cet événement.</p>
              <div class="event-date-box">
                <lucide-icon name="calendar" size="16"></lucide-icon>
                <span>{{ event.eventDate | date:'fullDate':'':'fr' }}</span>
              </div>
              <button class="register-button" [disabled]="event.status === 'past'" [class.disabled]="event.status === 'past'">
                {{ event.status === 'past' ? 'Événement passé' : 'Terminer l\\'inscription' }}
              </button>
            </div>

            <!-- Related Events -->
            <div class="related-events-box" *ngIf="relatedEvents().length > 0">
              <h4 class="related-title"><lucide-icon name="book-open" size="18"></lucide-icon> Événements à venir</h4>
              <div class="related-list">
                <div class="related-item" *ngFor="let rel of relatedEvents(); trackBy: trackByIndex" [routerLink]="['/events', rel.slug]">
                  <div class="date-mini">
                    <span class="mini-month">{{ rel.eventDate | date:'MMM':'':'fr' }}</span>
                    <span class="mini-day">{{ rel.eventDate | date:'dd' }}</span>
                  </div>
                  <div class="related-info">
                    <h5>{{ rel.title }}</h5>
                    <p *ngIf="rel.location"><lucide-icon name="map-pin" size="10"></lucide-icon> {{ rel.location }}</p>
                  </div>
                </div>
              </div>
              <a routerLink="/events" class="view-all-link">Voir tous les événements <lucide-icon name="arrow-right" size="14"></lucide-icon></a>
            </div>
          </aside>
        </div>
      </div>
    </article>
  `
})
export class EventDetailComponent implements OnInit {
   private contentService = inject(IContentService);
   private contentStore = inject(ContentStore);
   private seoService = inject(SeoService);
   private route = inject(ActivatedRoute);
   private platformId = inject(PLATFORM_ID);
   private toastService = inject(ToastService);

   event = signal<Event | null>(null);
   relatedEvents = signal<Event[]>([]);
   hasLiked = signal(false);
   newComment = '';
   private isBrowser = isPlatformBrowser(this.platformId);

   ngOnInit(): void {
      this.route.params.pipe(
         switchMap(params => this.contentService.getEventBySlug(params['slug']))
      ).subscribe({
         next: (event) => {
            if (event) {
               this.event.set(event);
               this.seoService.updateTitle(event.title);
               this.seoService.updateMeta(event.description, [event.type, 'événement']);
               this.loadRelatedEvents();
            }
         },
         error: (err) => {
            this.toastService.error("Erreur lors du chargement de l'événement.");
         }
      });
   }

   private loadRelatedEvents() {
      this.contentService.getEvents('upcoming').subscribe(events => {
         const currentId = this.event()?.id;
         this.relatedEvents.set(events.filter(e => e.id !== currentId).slice(0, 3));
      });
   }

   onLike(id: string) {
      if (this.hasLiked()) return;
      this.contentStore.likeEvent(id).subscribe({
         next: (newCount) => {
            this.hasLiked.set(true);
            this.toastService.success('Événement ajouté à vos favoris !');
            const currentEvent = this.event();
            if (currentEvent && newCount !== undefined) {
               this.event.set({ ...currentEvent, likesCount: newCount });
            }
         },
         error: () => this.toastService.error('Une erreur est survenue.')
      });
   }

   onSubmitComment(eventId: string) {
      if (!this.newComment.trim()) return;
      
      const commentText = this.newComment.trim();
      // Use the generic addComment for events if applicable, or we use store
      this.contentStore.addComment(eventId, commentText).subscribe({
         next: (newCommentData) => {
            this.newComment = '';
            this.toastService.success('Votre question a été posée avec succès !');
            const currentEvent = this.event();
            if (currentEvent) {
               this.event.set({ 
                  ...currentEvent, 
                  comments: [newCommentData, ...(currentEvent.comments || [])] 
               });
            }
         },
         error: () => this.toastService.error('Erreur lors de la publication.')
      });
   }

   trackByIndex(index: number) { return index; }
   trackByComment(_: number, comment: any) { return comment.id; }
}
