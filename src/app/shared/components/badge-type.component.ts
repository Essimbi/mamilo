import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostType } from '../../core/models/post.model';

@Component({
    selector: 'app-badge-type',
    standalone: true,
    imports: [CommonModule],
    styles: [`
    .badge-label {
        padding: 0.125rem 0.625rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        display: inline-block;
    }

    .badge-label.badge-article {
        background-color: #1B3A6B;
        color: #ffffff;
    }

    .badge-label.badge-note {
        background-color: #f1f5f9;
        color: #1e293b;
    }

    .badge-label.badge-recap {
        background-color: #4A90C4;
        color: #ffffff;
    }
  `],
    template: `
    <span class="badge-label" [class]="'badge-' + type">
      {{ typeLabel }}
    </span>
  `
})
export class BadgeTypeComponent {
    @Input() type!: PostType;

    get typeLabel(): string {
        switch (this.type) {
            case 'article': return 'Article';
            case 'note': return 'Note';
            case 'recap': return 'Récap';
            default: return this.type;
        }
    }

    getBadgeClass(): string {
        switch (this.type) {
            case 'article':
                return 'bg-navy text-white';
            case 'note':
                return 'bg-slate-200 text-slate-800';
            case 'recap':
                return 'bg-light-blue text-white';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
}
