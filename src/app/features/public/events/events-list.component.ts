import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { SeoService } from '../../../core/services/seo.service';
import { Event } from '../../../core/models/event.model';
import { LucideAngularModule, Calendar, MapPin, Clock, Heart, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-angular';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IContentService } from '../../../core/services/content.interface';

@Component({
  selector: 'app-events-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  styleUrl: './events-list.component.scss',
  template: `
    <div class="events-page-wrapper">
      <!-- Hero Section -->
      <section class="events-hero">
        <div class="hero-container">
          <div class="hero-left">
            <span class="eyebrow">Presse de monde et français</span>
            <h1 class="hero-title">Événements académiques et Engagements professionnels</h1>
            <p class="hero-subtitle">
              Explorer les tendances mondiales en matière de communication à travers des conférences, des ateliers et des colloques internationaux.
            </p>
          </div>
          <div class="hero-right">
            <div class="status-toggle">
              <button 
                [routerLink]="[]" [queryParams]="{ status: 'all' }" queryParamsHandling="merge"
                class="toggle-btn" 
                [class.active]="selectedStatus() === 'all'"
              >Tous</button>
              <button 
                [routerLink]="[]" [queryParams]="{ status: 'upcoming' }" queryParamsHandling="merge"
                class="toggle-btn" 
                [class.active]="selectedStatus() === 'upcoming'"
              >Prochains</button>
              <button 
                [routerLink]="[]" [queryParams]="{ status: 'past' }" queryParamsHandling="merge"
                class="toggle-btn" 
                [class.active]="selectedStatus() === 'past'"
              >Passés</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Filter Bar -->
      <nav class="filter-strip">
        <div class="filter-container">
          <!-- <div class="categories">
            <span class="filter-label">FILTRER PAR CATÉGORIE :</span>
            <button 
              *ngFor="let cat of categories; trackBy: trackByCategory" 
              [routerLink]="[]" [queryParams]="{ type: cat === 'Tous' ? null : cat }" queryParamsHandling="merge"
              class="category-link"
              [class.active]="selectedCategory() === cat"
            >
              {{ cat }}
            </button>
            <button 
              [routerLink]="[]" [queryParams]="{ type: null }" queryParamsHandling="merge"
              class="category-link"
              [class.active]="selectedCategory() === 'Tous'"
            >
              Tous
            </button>
          </div> -->
          <div class="results-count">
            Affichage de {{ (events$ | async)?.length || 0 }} résultats
          </div>
        </div>
      </nav>

      <!-- Main Grid Content -->
      <main class="events-grid-section">
        <div class="grid-container">
          <div *ngIf="events$ | async as events; else loading" class="events-grid">
            <article *ngFor="let event of events; trackBy: trackByEvent" class="event-card" [class.is-past]="event.status === 'past'" [routerLink]="['/events', event.slug]" style="cursor: pointer;">
              <div class="card-visual">
                <img [src]="event.coverImage?.url || 'assets/images/placeholder.jpg'" [alt]="event.title" class="event-img" loading="lazy" decoding="async">
                <div class="date-badge">
                  <span class="month">{{ event.eventDate | date:'MMM' }}</span>
                  <span class="day">{{ event.eventDate | date:'dd' }}</span>
                </div>
                <div class="status-badge" [class.upcoming]="event.status === 'upcoming'" [class.past]="event.status === 'past'">
                  {{ event.status === 'upcoming' ? 'Prochain' : 'Passé' }}
                </div>
              </div>

              <div class="card-content">
                <span class="event-type-label">{{ event.type }}</span>
                <h3 class="event-card-title">{{ event.title }}</h3>
                
                <div class="event-info-list">
                  <div class="info-item">
                    <lucide-icon name="calendar" size="14"></lucide-icon>
                    <span>{{ event.eventDate | date:'MMM dd, yyyy' | uppercase }}</span>
                  </div>
                  <div class="info-item">
                    <lucide-icon name="map-pin" size="14"></lucide-icon>
                    <span>{{ event.location }}</span>
                  </div>
                  <div class="info-item">
                    <lucide-icon name="clock" size="14"></lucide-icon>
                    <span>{{ event.eventDate | date:'HH:mm' }} GMT</span>
                  </div>
                  <div class="info-item" *ngIf="event.likesCount">
                    <lucide-icon name="heart" size="14"></lucide-icon>
                    <span>{{ event.likesCount }} intéressés</span>
                  </div>
                </div>

                <p class="event-excerpt">
                  {{ event.description | slice:0:150 }}...
                </p>
              </div>

              <div *ngIf="event.status === 'past'" class="card-footer">
                <button [routerLink]="['/events', event.slug]" class="recap-btn">
                  Voir le récap <lucide-icon name="arrow-right" size="14"></lucide-icon>
                </button>
              </div>
            </article>
          </div>

          <div class="grid-footer">
            <div class="pagination-info">Affichage de la page 1 sur 1</div>
            <div class="pagination-nav">
              <button class="nav-arrow" disabled><lucide-icon name="chevron-left" size="16"></lucide-icon></button>
              <button class="nav-page active">1</button>
              <button class="nav-arrow" disabled><lucide-icon name="chevron-right" size="16"></lucide-icon></button>
            </div>
          </div>
        </div>
      </main>

      <!-- CTA Engagement Section -->
      <section class="engagement-cta">
        <div class="cta-container">
          <h2 class="cta-title" style="color: aliceblue !important;">Organiser une conférence ou un atelier ?</h2>
          <p class="cta-text">
            Le Dr Smith est disponible pour des conférences, des interventions dans les médias et des missions de conseil institutionnel sur des sujets liés à l'éthique et à la communication numériques modernes.
          </p>
          <button routerLink="/contact" class="cta-button">Demander un engagement</button>
        </div>
      </section>

      <ng-template #loading>
        <div class="loading-grid">
          <div *ngFor="let i of [1,2,3]" class="skeleton-card"></div>
        </div>
      </ng-template>
    </div>
  `
})
export class EventsListComponent implements OnInit {
  private state = inject(GlobalStateService);
  private seoService = inject(SeoService);
  private contentService = inject(IContentService);
  private route = inject(ActivatedRoute);

  selectedStatus = signal<'all' | 'upcoming' | 'past'>('all');
  selectedCategory = signal<string>('Tous');
  
  categories = ['Keynotes', 'Ateliers', 'Colloques', 'Séminaires'];
  
  events$!: Observable<Event[]>;

  ngOnInit(): void {
    this.seoService.updateTitle('Événements');

    this.route.queryParams.subscribe(params => {
      this.selectedStatus.set(params['status'] || 'all');
      this.selectedCategory.set(params['type'] || 'Tous');
    });

    this.events$ = this.route.queryParams.pipe(
      switchMap(params => {
        const filters: any = {};
        if (params['status'] && params['status'] !== 'all') filters.status = params['status'];
        if (params['type'] && params['type'] !== 'Tous') filters.type = params['type'];
        
        return this.contentService.getEvents(filters);
      })
    );
  }

  trackByEvent(_: number, event: any) { return event.id; }
  trackByCategory(_: number, cat: string) { return cat; }
}
