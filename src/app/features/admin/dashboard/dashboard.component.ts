import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IContentService } from '../../../core/services/content.interface';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { computed } from '@angular/core';
import { Post } from '../../../core/models/post.model';

import { StatCardComponent } from './components/stat-card/stat-card.component';
import { RecentArticlesComponent } from './components/recent-articles/recent-articles.component';
import { MediaGalleryWidgetComponent } from './components/media-gallery-widget/media-gallery-widget.component';
import { EngagementCardComponent } from './components/engagement-card/engagement-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule,
    StatCardComponent,
    RecentArticlesComponent,
    MediaGalleryWidgetComponent,
    EngagementCardComponent
  ],
  styleUrl: './dashboard.component.scss',
  template: `
    <div class="dashboard-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Présentation du tableau de bord</h1>
          <p>Gerez votre présence académique et analysez la performance de votre contenu.</p>
        </div>
        <div class="header-actions">
          <button class="btn-outline">
            <lucide-icon name="download" size="18"></lucide-icon>
            Exporter
          </button>
          <button class="btn-primary" routerLink="/admin/posts/new">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Nouvel Article
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <app-stat-card 
          label="Vues totales" 
          value="48.2k" 
          icon="eye" 
          trend="+12%" 
          trendType="up"
          meta="du mois dernier">
        </app-stat-card>
        <app-stat-card 
          label="Nouvelles réactions" 
          value="156" 
          icon="message-circle" 
          trend="+5%" 
          trendType="up"
          meta="du mois dernier">
        </app-stat-card>
        <app-stat-card 
          label="Événements à venir" 
          value="3" 
          icon="calendar" 
          trend="Stable" 
          trendType="stable"
          meta="du mois dernier">
        </app-stat-card>
        <app-stat-card 
          label="Brouillons actifs" 
          value="7" 
          icon="file-text" 
          trend="+2" 
          trendType="up"
          meta="du mois dernier">
        </app-stat-card>
      </div>

      <div class="main-grid">
        <!-- Center Column -->
        <div class="center-column" *ngIf="posts().length > 0; else noPosts">
          <app-recent-articles [posts]="posts()"></app-recent-articles>
        </div>
        <ng-template #noPosts>
           <div class="center-column" style="padding: 3rem; text-align: center; background: white; border-radius: 1rem;">
              <p>Aucun article trouvé.</p>
           </div>
        </ng-template>

        <!-- Right Column -->
        <div class="right-column">
          <app-media-gallery-widget [media]="mockMedia"></app-media-gallery-widget>
          <app-engagement-card [engagement]="nextEngagement"></app-engagement-card>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private state = inject(GlobalStateService);

  posts = computed(() => this.state.posts().slice(0, 5));
  isLoading = this.state.isLoading;

  mockMedia = [
    { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=150&q=80', alt: 'Meeting' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=150&q=80', alt: 'Chart' },
    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=150&q=80', alt: 'Discussion' },
    { url: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=150&q=80', alt: 'Office' },
    { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=150&q=80', alt: 'Collaborate' },
  ];

  nextEngagement = {
    title: 'Sommet mondial sur l\'éthique',
    date: 'Demain',
    time: '10:00 AM EST',
    details: 'Conférence principale : La souveraineté'
  };

  ngOnInit(): void { }
}

