import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostType } from '../../core/models/post.model';

@Component({
    selector: 'app-badge-type',
    standalone: true,
    imports: [CommonModule],
    styleUrl: './badge-type.component.scss',
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
