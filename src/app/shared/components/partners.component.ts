import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-partners',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  template: `
    <section class="partners-section">
        <div class="partners-inner">
            <p class="partners-label">RECONNU ET PUBLIÉ PAR</p>
            <div class="partners-grid">
                <span *ngFor="let partner of partners; trackBy: trackByPartner" class="partner-name">{{ partner }}</span>
            </div>
        </div>
    </section>
  `,
  styles: [`
    .partners-section {
        display: block;
        padding: 4rem 0;
        background-color: #ffffff !important;
    }

    .partners-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.5rem;
        text-align: center;
    }

    .partners-label {
        font-size: 0.6875rem;
        font-weight: 850;
        color: #64748b !important;
        letter-spacing: 0.15em;
        margin-bottom: 2.5rem;
    }

    .partners-grid {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        gap: 3rem 5rem;
    }

    @media (max-width: 768px) {
        .partners-grid {
            gap: 2.5rem;
        }
    }

    .partner-name {
        font-family: inherit;
        font-size: 1.25rem;
        font-weight: 800;
        color: #94a3b8 !important;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: color 0.3s ease;
        cursor: default;
    }

    .partner-name:hover {
        color: #1B3A6B !important;
    }

    @media (max-width: 768px) {
        .partner-name {
            font-size: 1rem;
        }
    }
  `]
})
export class PartnersComponent {
  @Input() partners: string[] = [
    'Cambridge Press',
    'The Economist',
    'MIT Technology Review',
    'Oxford University',
    'Sage Journals'
  ];

  trackByPartner(_: number, partner: string) { return partner; }
}
