import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="stat-card">
      <div class="stat-info">
        <span class="stat-label">{{ label }}</span>
        <div class="stat-value-row">
          <h2 class="stat-value">{{ value }}</h2>
          <div class="stat-trend" [ngClass]="trendType" *ngIf="trend">
            <lucide-icon [name]="trendIcon" size="14"></lucide-icon>
            <span>{{ trend }}</span>
          </div>
        </div>
        <p class="stat-meta" *ngIf="meta">{{ meta }}</p>
      </div>
      <div class="stat-icon" [style.background]="accentBg" [style.color]="accentColor">
        <lucide-icon [name]="icon" size="20"></lucide-icon>
      </div>
    </div>
  `,
  styleUrl: './stat-card.component.scss'
})
export class StatCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() icon: string = '';
  @Input() trend?: string;
  @Input() trendType: 'up' | 'down' | 'stable' = 'stable';
  @Input() meta?: string;
  @Input() accentColor: string = '#2E6DA4';
  @Input() accentBg: string = '#f0f7ff';

  get trendIcon() {
    if (this.trendType === 'up') return 'trending-up';
    if (this.trendType === 'down') return 'trending-down';
    return 'minus';
  }
}
