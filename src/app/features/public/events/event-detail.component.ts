import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IContentService } from '../../../core/services/content.interface';
import { SeoService } from '../../../core/services/seo.service';
import { Event } from '../../../core/models/event.model';
import { LucideAngularModule, Heart, ChevronLeft, MapPin, Calendar, Clock, LayoutGrid, Check, BookOpen, ArrowRight } from 'lucide-angular';
import { Observable, switchMap, tap } from 'rxjs';
import { ContentStore } from '../../../core/services/content-store.service';

@Component({
   selector: 'app-event-detail',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [CommonModule, RouterModule, LucideAngularModule],
   styleUrl: './event-detail.component.scss',
   template: `
    <div *ngIf="event$ | async as event" class="event-page-wrapper">
      <!-- Hero Header Section -->
      <section class="event-hero" [style.backgroundImage]="'url(' + (event.coverImage?.url || 'assets/images/placeholder.jpg') + ')'">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <nav class="hero-breadcrumb">
            <a routerLink="/events"><lucide-icon name="chevron-left" size="14"></lucide-icon> Retour à la liste</a>
          </nav>
          
          <div class="hero-badge">Conférence académique</div>
          
          <h1 class="hero-title">{{ event.title }}</h1>
          
           <div class="hero-actions">
              <button class="hero-like-btn" (click)="onLike(event.id)" [class.liked]="hasLiked()">
                <lucide-icon name="heart" [class.fill]="hasLiked()" size="18"></lucide-icon>
                <span>{{ event.likesCount }} intéressés</span>
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
              
              <div class="highlights-box">
                <div class="highlight-col">
                  <h4 class="highlight-title"><lucide-icon name="layout-grid" size="18"></lucide-icon> Objectifs clés</h4>
                  <ul class="highlight-list">
                    <li>Cartographier des tendances interdisciplinaires</li>
                    <li>Intégrer l'IA dans les flux de travail de recherche</li>
                    <li>Améliorer la participation du public</li>
                    <li>Éthique de l'IA et futur numérique</li>
                  </ul>
                </div>
                <div class="highlight-col">
                  <h4 class="highlight-title"><lucide-icon name="map-pin" size="18"></lucide-icon> Informations sur le lieu</h4>
                  <p class="highlight-text">
                    Le Grand Hall est entièrement accessible et doté d'équipements multimédias ultramodernes. Un parking est disponible à proximité, sur l'espace de l'Université.
                  </p>
                </div>
              </div>
            </section>

            <!-- Speakers Grid -->
            <section class="speakers-section">
              <div class="section-header">
                <h2 class="section-title">Conférenciers de renom</h2>
                <span class="header-meta">Intervenants confirmés</span>
              </div>
              
              <div class="speakers-grid">
                <!-- Mock Speakers - In a real app these would come from the model -->
                <div class="speaker-card" *ngFor="let i of [1,2,3,4,5,6]; trackBy: trackByIndex">
                  <img src="assets/images/mock/avatar.jpg" class="speaker-img" alt="Speaker" loading="lazy" decoding="async">
                  <h4 class="speaker-name">Dr. Elena Rossi</h4>
                  <p class="speaker-title">Professor of Digital Ethics</p>
                  <p class="speaker-org">University of Bologna</p>
                </div>
              </div>
            </section>

            <!-- Gallery / Highlights -->
            <section class="gallery-section">
              <h2 class="section-title">Faits saillants des événements passés</h2>
              <p class="section-subtitle">Voici quelques moments clés de nos précédentes collaborations. Nous privilégions les environnements interactifs et collaboratifs.</p>
              
              <div class="gallery-layout">
                <div class="gallery-main">
                  <img src="https://images.unsplash.com/photo-1540575861501-7ad058211a37?auto=format&fit=crop&q=80&w=1000" class="gallery-img" alt="Conference Main" loading="lazy" decoding="async">
                </div>
                <div class="gallery-side">
                  <img src="https://images.unsplash.com/photo-1528605248644-14dd04122c1e?auto=format&fit=crop&q=80&w=600" class="gallery-img" alt="Highlight 1" loading="lazy" decoding="async">
                  <div class="gallery-bottom-row">
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=400" class="gallery-img" alt="Highlight 2" loading="lazy" decoding="async">
                    <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=400" class="gallery-img" alt="Highlight 3" loading="lazy" decoding="async">
                  </div>
                </div>
              </div>
            </section>

            <!-- Map / Location -->
            <section class="map-section">
              <h2 class="section-title">Emplacement et directions</h2>
              <div class="map-placeholder">
                <div class="location-card">
                  <lucide-icon name="map-pin" size="24" class="map-icon"></lucide-icon>
                  <h4>Institute of Communication</h4>
                  <p>Science Park 904, 1098 XH Amsterdam, Netherlands</p>
                </div>
              </div>
            </section>
          </main>

          <!-- Right Column: Sidebar -->
          <aside class="sidebar-column">
            <!-- Registration Card -->
            <div class="registration-card">
              <h3 class="reg-title">Inscrivez-vous maintenant</h3>
              <p class="reg-text">Réservez votre place pour cet événement académique de premier plan. Places limitées.</p>
              
              <ul class="reg-benefits">
                <li><lucide-icon name="check" size="14"></lucide-icon> Accès complet à toutes les sessions</li>
                <li><lucide-icon name="check" size="14"></lucide-icon> Documents de conférence et aux archives</li>
                <li><lucide-icon name="check" size="14"></lucide-icon> Déjeuner réseautage et rafraîchissements</li>
              </ul>
              
              <button class="register-button">Terminer l'inscription</button>
            </div>

            <!-- Related Events -->
            <div class="related-events-box">
              <h4 class="related-title"><lucide-icon name="book-open" size="18"></lucide-icon> Événements connexes</h4>
              <div class="related-list">
                <div class="related-item" *ngFor="let i of [1,2,3]; trackBy: trackByIndex">
                  <div class="date-mini">
                    <span class="mini-month">SEP</span>
                    <span class="mini-day">12</span>
                  </div>
                  <div class="related-info">
                    <h5>Humanités numériques</h5>
                    <p><lucide-icon name="map-pin" size="10"></lucide-icon> Rome</p>
                  </div>
                </div>
              </div>
              <a href="#" class="view-all-link">Voir plus <lucide-icon name="arrow-right" size="14"></lucide-icon></a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  `
})
export class EventDetailComponent implements OnInit {
   private contentService = inject(IContentService);
   private contentStore = inject(ContentStore);
   private seoService = inject(SeoService);
   private route = inject(ActivatedRoute);

   event$!: Observable<Event | null>;
   hasLiked = signal(false);

   ngOnInit(): void {
      this.event$ = this.route.params.pipe(
         switchMap(params => this.contentService.getEventBySlug(params['slug'])),
         tap(event => {
            if (event) {
               this.seoService.updateTitle(event.title);
               this.seoService.updateMeta(event.description, [event.type, 'événement']);
            }
         })
      );
   }

   onLike(id: string) {
      if (this.hasLiked()) return;
      this.contentStore.likeEvent(id).subscribe(() => {
         this.hasLiked.set(true);
      });
   }

   trackByIndex(index: number) { return index; }
}
