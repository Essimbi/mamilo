import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';

export interface TimelineItem {
  id: string;
  title: string;
  type: 'post' | 'event' | 'media';
  action: string;
  date: string;
  icon: string;
  link?: string;
}

@Component({
  selector: 'app-activity-timeline',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="timeline-card">
      <div class="card-header">
        <div class="header-info">
          <h3>Activité Récente</h3>
          <p>Dernières actions sur votre contenu</p>
        </div>
        <div class="header-badge">
          <lucide-icon name="activity" size="16"></lucide-icon>
        </div>
      </div>

      <div class="timeline">
        <div *ngFor="let item of items; let last = last"
             class="timeline-item" [class.last]="last">
          <div class="timeline-dot" [ngClass]="item.type">
            <lucide-icon [name]="item.icon" size="14"></lucide-icon>
          </div>
          <div class="timeline-content">
            <p class="item-title">{{ item.title }}</p>
            <div class="item-meta">
              <span class="item-action">{{ item.action }}</span>
              <span class="item-date">{{ item.date | date:'dd MMM, HH:mm' }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="items.length === 0" class="empty-timeline">
          <lucide-icon name="inbox" size="32"></lucide-icon>
          <p>Aucune activité récente</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .timeline-card {
      background: white; border-radius: 16px; padding: 1.5rem;
      border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
      .header-info {
        h3 { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
        p { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; }
      }
      .header-badge {
        width: 36px; height: 36px; border-radius: 10px; display: flex;
        align-items: center; justify-content: center;
        background: linear-gradient(135deg, #3b82f6, #6366f1); color: white;
      }
    }
    .timeline {
      display: flex; flex-direction: column; gap: 0;
    }
    .timeline-item {
      display: flex; gap: 1rem; padding: 0.75rem 0;
      position: relative;
      &:not(.last)::after {
        content: ''; position: absolute; left: 15px; top: 42px; bottom: 0;
        width: 2px; background: #e2e8f0;
      }
    }
    .timeline-dot {
      width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      z-index: 1;
      &.post { background: #eff6ff; color: #3b82f6; }
      &.event { background: #fef3c7; color: #d97706; }
      &.media { background: #f0fdf4; color: #16a34a; }
    }
    .timeline-content {
      flex: 1; min-width: 0;
      .item-title {
        font-size: 0.85rem; font-weight: 600; color: #1e293b; margin: 0;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .item-meta {
        display: flex; gap: 0.5rem; margin-top: 0.25rem; font-size: 0.75rem;
        .item-action { color: #64748b; }
        .item-date { color: #94a3b8; }
      }
    }
    .empty-timeline {
      text-align: center; padding: 2rem; color: #94a3b8;
      p { margin-top: 0.5rem; font-size: 0.85rem; }
    }
  `]
})
export class ActivityTimelineComponent {
  @Input() items: TimelineItem[] = [];
}
