import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader.component';

import { StatCardComponent } from './components/stat-card/stat-card.component';
import { ActivityTimelineComponent, TimelineItem } from './components/activity-timeline/activity-timeline.component';
import { ContentChartComponent, ChartSegment } from './components/content-chart/content-chart.component';
import { TopPostsComponent } from './components/top-posts/top-posts.component';
import { UpcomingEventsComponent } from './components/engagement-card/engagement-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule, RouterModule, LucideAngularModule,
    StatCardComponent, ActivityTimelineComponent, ContentChartComponent,
    TopPostsComponent, UpcomingEventsComponent, SkeletonLoaderComponent
  ],
  template: `
    <div class="dashboard-page">
      <!-- Skeleton while loading -->
      <app-skeleton *ngIf="isLoading()" type="dashboard"></app-skeleton>

      <ng-container *ngIf="!isLoading()">
      <header class="page-header">
        <div class="header-content">
          <div class="greeting">
            <h1>Tableau de bord</h1>
            <p>Vue d'ensemble de votre activité académique et de la performance du contenu.</p>
          </div>
          <div class="header-actions">
            <button class="btn-outline" routerLink="/admin/articles">
              <lucide-icon name="layout-grid" size="16"></lucide-icon>
              Articles
            </button>
            <button class="btn-primary" routerLink="/admin/posts/new">
              <lucide-icon name="plus" size="16"></lucide-icon>
              Nouveau
            </button>
          </div>
        </div>
      </header>

      <!-- Stats Row -->
      <div class="stats-grid">
        <app-stat-card
          label="Articles publiés"
          [value]="publishedCount()"
          icon="book-open"
          [trend]="draftCount() + ' brouillons'"
          trendType="stable"
          meta="total sur la plateforme"
          accentColor="#3b82f6"
          accentBg="#eff6ff">
        </app-stat-card>
        <app-stat-card
          label="Événements"
          [value]="totalEvents()"
          icon="calendar"
          [trend]="upcomingCount() + ' à venir'"
          trendType="up"
          meta="conférences et séminaires"
          accentColor="#8b5cf6"
          accentBg="#f5f3ff">
        </app-stat-card>
        <app-stat-card
          label="Médias"
          [value]="totalMedia()"
          icon="image"
          trend="Bibliothèque"
          trendType="stable"
          meta="images et fichiers"
          accentColor="#10b981"
          accentBg="#ecfdf5">
        </app-stat-card>
        <app-stat-card
          label="Engagement"
          [value]="totalLikes()"
          icon="heart"
          [trend]="totalComments() + ' commentaires'"
          trendType="up"
          meta="réactions totales"
          accentColor="#f43f5e"
          accentBg="#fff1f2">
        </app-stat-card>
      </div>

      <!-- Main Grid -->
      <div class="main-grid">
        <!-- Left Column: Timeline + Content Charts -->
        <div class="left-column">
          <app-activity-timeline [items]="timelineItems()"></app-activity-timeline>

          <div class="charts-row">
            <app-content-chart
              title="Types de contenu"
              subtitle="Répartition par type"
              [segments]="typeSegments()">
            </app-content-chart>
            <app-content-chart
              title="Statut des articles"
              subtitle="Publiés vs Brouillons"
              [segments]="statusSegments()">
            </app-content-chart>
          </div>
        </div>

        <!-- Right Column: Top Posts + Upcoming Events -->
        <div class="right-column">
          <app-top-posts [posts]="topPosts()"></app-top-posts>
          <app-upcoming-events [events]="upcomingEvents()"></app-upcoming-events>
        </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem; max-width: 1400px; margin: 0 auto; background: #f8fafc; min-height: 100vh;
    }

    .page-header {
      margin-bottom: 2rem;
      .header-content {
        display: flex; justify-content: space-between; align-items: center;
      }
      .greeting {
        h1 { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0; }
        p { font-size: 0.9rem; color: #64748b; margin: 0.3rem 0 0; }
      }
      .header-actions { display: flex; gap: 0.75rem; }
    }

    .btn-primary {
      background: #0f172a; color: white; border: none; padding: 0.65rem 1.25rem;
      border-radius: 10px; font-weight: 700; font-size: 0.82rem; cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;
      &:hover { background: #1e293b; transform: translateY(-1px); }
    }

    .btn-outline {
      background: white; color: #475569; border: 1px solid #e2e8f0; padding: 0.65rem 1.25rem;
      border-radius: 10px; font-weight: 700; font-size: 0.82rem; cursor: pointer;
      display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;
      &:hover { background: #f8fafc; border-color: #cbd5e1; }
    }

    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin-bottom: 2rem;
    }

    .main-grid {
      display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem;
    }

    .left-column { display: flex; flex-direction: column; gap: 1.5rem; }
    .right-column { display: flex; flex-direction: column; gap: 1.5rem; }

    .charts-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
    }

    @media (max-width: 1200px) {
      .main-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .charts-row { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .dashboard-page { padding: 1rem; }
      .stats-grid { grid-template-columns: 1fr; }
      .page-header .header-content {
        flex-direction: column; align-items: flex-start; gap: 1rem;
        .header-actions { width: 100%; }
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);

  // Raw data signals
  private posts = this.state.posts;
  private events = this.state.events;
  private media = this.state.media;
  isLoading = this.state.isLoading;

  // Computed stats
  publishedCount = computed(() => this.posts().filter(p => p.status === 'published').length);
  draftCount = computed(() => this.posts().filter(p => p.status === 'draft').length);
  totalEvents = computed(() => this.events().length);
  upcomingCount = computed(() => this.events().filter(e => e.status === 'upcoming').length);
  totalMedia = computed(() => this.media().length);
  totalLikes = computed(() => {
    const postLikes = this.posts().reduce((sum, p) => sum + (p.likesCount || 0), 0);
    const eventLikes = this.events().reduce((sum, e) => sum + (e.likesCount || 0), 0);
    return postLikes + eventLikes;
  });
  totalComments = computed(() =>
    this.posts().reduce((sum, p) => sum + (p.comments?.length || 0), 0)
  );

  // Top posts (by likes)
  topPosts = computed(() =>
    [...this.posts()]
      .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
      .slice(0, 5)
  );

  // Upcoming events (sorted by date)
  upcomingEvents = computed(() =>
    this.events()
      .filter(e => e.status === 'upcoming')
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
      .slice(0, 3)
  );

  // Content type distribution
  typeSegments = computed((): ChartSegment[] => {
    const posts = this.posts();
    const articles = posts.filter(p => p.type === 'article').length;
    const notes = posts.filter(p => p.type === 'note').length;
    const recaps = posts.filter(p => p.type === 'recap').length;
    return [
      { label: 'Articles', value: articles, color: '#3b82f6' },
      { label: 'Notes', value: notes, color: '#8b5cf6' },
      { label: 'Récaps', value: recaps, color: '#f59e0b' },
    ].filter(s => s.value > 0);
  });

  // Status distribution
  statusSegments = computed((): ChartSegment[] => {
    const posts = this.posts();
    const published = posts.filter(p => p.status === 'published').length;
    const drafts = posts.filter(p => p.status === 'draft').length;
    const scheduled = posts.filter(p => p.status === 'scheduled').length;
    return [
      { label: 'Publiés', value: published, color: '#10b981' },
      { label: 'Brouillons', value: drafts, color: '#94a3b8' },
      { label: 'Planifiés', value: scheduled, color: '#f59e0b' },
    ].filter(s => s.value > 0);
  });

  // Activity timeline
  timelineItems = computed((): TimelineItem[] => {
    const postItems: TimelineItem[] = this.posts()
      .slice(0, 5)
      .map(p => ({
        id: p.id,
        title: p.title,
        type: 'post' as const,
        action: p.status === 'published' ? 'Article publié' : 'Brouillon créé',
        date: p.updatedAt || p.createdAt,
        icon: 'file-text',
      }));

    const eventItems: TimelineItem[] = this.events()
      .slice(0, 3)
      .map(e => ({
        id: e.id,
        title: e.title,
        type: 'event' as const,
        action: 'Événement planifié',
        date: e.createdAt,
        icon: 'calendar',
      }));

    return [...postItems, ...eventItems]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  });

  ngOnInit(): void {
    setTimeout(() => {
      this.store.loadAllInitialData();
    });
  }
}
