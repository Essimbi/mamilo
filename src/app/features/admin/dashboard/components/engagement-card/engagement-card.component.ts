import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-engagement-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="engagement-card" *ngIf="engagement">
      <span class="card-label">Prochain Engagement</span>
      
      <div class="engagement-main">
        <div class="icon-box">
          <lucide-icon name="calendar" size="24"></lucide-icon>
        </div>
        <div class="engagement-info">
          <h3>{{ engagement.title }}</h3>
          <p class="time">{{ engagement.date }} • {{ engagement.time }}</p>
          <p class="role"><em>{{ engagement.details }}</em></p>
        </div>
      </div>

      <button class="btn-details">Afficher les détails</button>
    </div>
  `,
  styleUrl: './engagement-card.component.scss'
})
export class EngagementCardComponent {
  @Input() engagement: any;
}
