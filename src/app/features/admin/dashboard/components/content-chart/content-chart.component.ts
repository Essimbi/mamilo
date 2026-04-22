import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-content-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-card">
      <div class="card-header">
        <h3>{{ title }}</h3>
        <p>{{ subtitle }}</p>
      </div>

      <div class="chart-body">
        <div class="donut-container">
          <svg viewBox="0 0 36 36" class="donut-chart">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" stroke-width="3.5"/>
            <circle *ngFor="let seg of computedSegments"
                    cx="18" cy="18" r="15.9" fill="none"
                    [attr.stroke]="seg.color"
                    stroke-width="3.5"
                    [attr.stroke-dasharray]="seg.dash"
                    [attr.stroke-dashoffset]="seg.offset"
                    stroke-linecap="round"
                    class="donut-segment"/>
          </svg>
          <div class="donut-center">
            <span class="center-value">{{ total }}</span>
            <span class="center-label">Total</span>
          </div>
        </div>

        <div class="chart-legend">
          <div *ngFor="let seg of segments" class="legend-item">
            <span class="legend-dot" [style.background]="seg.color"></span>
            <span class="legend-label">{{ seg.label }}</span>
            <span class="legend-value">{{ seg.value }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chart-card {
      background: white; border-radius: 16px; padding: 1.5rem;
      border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .card-header {
      margin-bottom: 1.5rem;
      h3 { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0; }
      p { font-size: 0.8rem; color: #94a3b8; margin: 0.25rem 0 0; }
    }
    .chart-body {
      display: flex; align-items: center; gap: 2rem;
    }
    .donut-container {
      position: relative; width: 140px; height: 140px; flex-shrink: 0;
    }
    .donut-chart { width: 100%; height: 100%; transform: rotate(-90deg); }
    .donut-segment { transition: stroke-dasharray 0.8s ease, stroke-dashoffset 0.8s ease; }
    .donut-center {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      .center-value { font-size: 1.5rem; font-weight: 800; color: #0f172a; }
      .center-label { font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    }
    .chart-legend { display: flex; flex-direction: column; gap: 0.75rem; flex: 1; }
    .legend-item {
      display: flex; align-items: center; gap: 0.5rem;
      .legend-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
      .legend-label { font-size: 0.8rem; color: #64748b; flex: 1; }
      .legend-value { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
    }
    @media (max-width: 640px) {
      .chart-body { flex-direction: column; }
      .donut-container { width: 120px; height: 120px; }
    }
  `]
})
export class ContentChartComponent implements OnChanges {
  @Input() title = 'Répartition';
  @Input() subtitle = '';
  @Input() segments: ChartSegment[] = [];

  computedSegments: { color: string; dash: string; offset: string }[] = [];
  total = 0;

  ngOnChanges(): void {
    this.total = this.segments.reduce((sum, s) => sum + s.value, 0);
    if (this.total === 0) {
      this.computedSegments = [];
      return;
    }

    const circumference = 2 * Math.PI * 15.9; // ~99.9
    let accumulated = 0;
    this.computedSegments = this.segments.map(seg => {
      const pct = seg.value / this.total;
      const dash = `${pct * circumference} ${circumference}`;
      const offset = `${-accumulated * circumference}`;
      accumulated += pct;
      return { color: seg.color, dash, offset };
    });
  }
}
