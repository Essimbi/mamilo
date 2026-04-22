import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { Event } from '../../../../../core/models/event.model';

@Component({
  selector: 'app-upcoming-events',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  template: `
    <div class="events-card">
      <div class="card-header">
        <div class="header-info">
          <h3>Prochains Événements</h3>
          <p>Votre agenda académique</p>
        </div>
        <a routerLink="/admin/events" class="link-all">Tout voir</a>
      </div>

      <div class="events-list">
        <div *ngFor="let evt of events" class="event-item">
          <div class="event-date-badge">
            <span class="day">{{ evt.eventDate | date:'dd' }}</span>
            <span class="month">{{ evt.eventDate | date:'MMM' }}</span>
          </div>
          <div class="event-info">
            <h4>{{ evt.title }}</h4>
            <div class="event-meta">
              <span class="meta-item">
                <lucide-icon name="clock" size="12"></lucide-icon>
                {{ evt.eventDate | date:'HH:mm' }}
              </span>
              <span class="meta-item">
                <lucide-icon name="map-pin" size="12"></lucide-icon>
                {{ evt.location }}
              </span>
            </div>
          </div>
          <div class="event-type-chip">{{ evt.type }}</div>
        </div>

        <div *ngIf="events.length === 0" class="empty-events">
          <lucide-icon name="calendar-off" size="28"></lucide-icon>
          <p>Aucun événement à venir</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .events-card {
      background: white; border-radius: 16px; padding: 1.5rem;
      border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .card-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;
      .header-info {
        h3 { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
        p { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; }
      }
      .link-all {
        font-size: 0.75rem; font-weight: 700; color: #3b82f6; text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }
    .events-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .event-item {
      display: flex; align-items: center; gap: 1rem; padding: 0.75rem;
      border-radius: 12px; background: #f8fafc; transition: all 0.2s;
      &:hover { background: #eff6ff; transform: translateX(2px); }
    }
    .event-date-badge {
      width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, #1B3A6B, #2E6DA4); color: white;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      .day { font-size: 1.1rem; font-weight: 800; line-height: 1; }
      .month { font-size: 0.55rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.85; }
    }
    .event-info {
      flex: 1; min-width: 0;
      h4 { font-size: 0.85rem; font-weight: 700; color: #1e293b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .event-meta {
        display: flex; gap: 0.75rem; margin-top: 0.25rem;
        .meta-item { display: flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; color: #94a3b8; }
      }
    }
    .event-type-chip {
      font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;
      padding: 0.2rem 0.6rem; border-radius: 6px; background: #eff6ff; color: #3b82f6; flex-shrink: 0;
    }
    .empty-events {
      text-align: center; padding: 2rem; color: #94a3b8;
      p { margin-top: 0.5rem; font-size: 0.85rem; }
    }
  `]
})
export class UpcomingEventsComponent {
  @Input() events: Event[] = [];
}
