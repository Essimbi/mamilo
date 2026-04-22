import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper">
      <!-- Stat cards skeleton -->
      <div *ngIf="type === 'stats'" class="skeleton-stats">
        <div *ngFor="let _ of [1,2,3,4]" class="skeleton-stat-card">
          <div class="skeleton-line w60 h12"></div>
          <div class="skeleton-line w40 h28 mt8"></div>
          <div class="skeleton-line w80 h10 mt12"></div>
        </div>
      </div>

      <!-- Table skeleton -->
      <div *ngIf="type === 'table'" class="skeleton-table">
        <div class="skeleton-table-header">
          <div *ngFor="let _ of [1,2,3,4,5]" class="skeleton-line" [style.width]="getColWidth(_)"></div>
        </div>
        <div *ngFor="let _ of rows" class="skeleton-table-row">
          <div class="skeleton-line w30 h14"></div>
          <div class="skeleton-line w15 h14"></div>
          <div class="skeleton-line w20 h14"></div>
          <div class="skeleton-line w15 h14"></div>
          <div class="skeleton-line w10 h14"></div>
        </div>
      </div>

      <!-- Card grid skeleton -->
      <div *ngIf="type === 'cards'" class="skeleton-card-grid">
        <div *ngFor="let _ of rows" class="skeleton-card">
          <div class="skeleton-card-banner"></div>
          <div class="skeleton-card-body">
            <div class="skeleton-line w50 h10"></div>
            <div class="skeleton-line w90 h16 mt8"></div>
            <div class="skeleton-line w70 h10 mt12"></div>
          </div>
        </div>
      </div>

      <!-- Media grid skeleton -->
      <div *ngIf="type === 'media'" class="skeleton-media-grid">
        <div *ngFor="let _ of rows" class="skeleton-media-item"></div>
      </div>

      <!-- Sidebar form skeleton -->
      <div *ngIf="type === 'form'" class="skeleton-form">
        <div class="skeleton-line w40 h12"></div>
        <div class="skeleton-line w100 h38 mt8"></div>
        <div class="skeleton-line w40 h12 mt16"></div>
        <div class="skeleton-line w100 h38 mt8"></div>
        <div class="skeleton-line w40 h12 mt16"></div>
        <div class="skeleton-line w100 h80 mt8"></div>
      </div>

      <!-- Dashboard skeleton -->
      <div *ngIf="type === 'dashboard'" class="skeleton-dashboard">
        <div class="skeleton-stats">
          <div *ngFor="let _ of [1,2,3,4]" class="skeleton-stat-card">
            <div class="skeleton-line w60 h12"></div>
            <div class="skeleton-line w40 h28 mt8"></div>
          </div>
        </div>
        <div class="skeleton-dash-grid mt16">
          <div class="skeleton-dash-main">
            <div class="skeleton-line w100 h200"></div>
          </div>
          <div class="skeleton-dash-side">
            <div class="skeleton-line w100 h140"></div>
            <div class="skeleton-line w100 h140 mt16"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper { width: 100%; }

    .skeleton-line {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s ease-in-out infinite;
      border-radius: 6px;
      height: 14px;
    }

    .w10 { width: 10%; } .w15 { width: 15%; } .w20 { width: 20%; }
    .w30 { width: 30%; } .w40 { width: 40%; } .w50 { width: 50%; }
    .w60 { width: 60%; } .w70 { width: 70%; } .w80 { width: 80%; }
    .w90 { width: 90%; } .w100 { width: 100%; }
    .h10 { height: 10px; } .h12 { height: 12px; } .h14 { height: 14px; }
    .h16 { height: 16px; } .h28 { height: 28px; } .h38 { height: 38px; }
    .h80 { height: 80px; } .h140 { height: 140px; } .h200 { height: 200px; }
    .mt8 { margin-top: 8px; } .mt12 { margin-top: 12px; } .mt16 { margin-top: 16px; }

    /* Stats */
    .skeleton-stats {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem;
    }
    .skeleton-stat-card {
      background: white; border-radius: 12px; padding: 1.5rem;
      border: 1px solid #f1f5f9;
    }

    /* Table */
    .skeleton-table { background: white; border-radius: 12px; padding: 1rem 1.5rem; border: 1px solid #f1f5f9; }
    .skeleton-table-header {
      display: flex; gap: 1.5rem; padding-bottom: 1rem;
      margin-bottom: 1rem; border-bottom: 1px solid #f1f5f9;
    }
    .skeleton-table-row { display: flex; gap: 1.5rem; padding: 0.75rem 0; }

    /* Cards */
    .skeleton-card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .skeleton-card {
      background: white; border-radius: 12px; overflow: hidden; border: 1px solid #f1f5f9;
    }
    .skeleton-card-banner { height: 140px; background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; }
    .skeleton-card-body { padding: 1.25rem; }

    /* Media */
    .skeleton-media-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
    .skeleton-media-item {
      aspect-ratio: 1; border-radius: 12px;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite;
    }

    /* Form */
    .skeleton-form { padding: 1.5rem; }

    /* Dashboard */
    .skeleton-dash-grid { display: grid; grid-template-columns: 1fr 380px; gap: 1.5rem; }
    .skeleton-dash-main, .skeleton-dash-side {
      background: white; border-radius: 12px; padding: 1.5rem; border: 1px solid #f1f5f9;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @media (max-width: 1024px) {
      .skeleton-stats { grid-template-columns: repeat(2, 1fr); }
      .skeleton-dash-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 640px) {
      .skeleton-stats { grid-template-columns: 1fr; }
      .skeleton-card-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: 'stats' | 'table' | 'cards' | 'media' | 'form' | 'dashboard' = 'table';
  @Input() count = 5;

  get rows(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }

  getColWidth(index: number): string {
    const widths = ['30%', '15%', '20%', '15%', '10%'];
    return widths[(index - 1) % widths.length];
  }
}
