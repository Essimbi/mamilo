import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-media-gallery-widget',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="card media-widget">
      <div class="card-header">
        <div class="header-info">
          <h3>Actifs multimédias</h3>
          <p>Visuels de publications récentes.</p>
        </div>
        <button class="btn-add">
          <lucide-icon name="plus" size="18"></lucide-icon>
        </button>
      </div>
      
      <div class="media-grid">
        <div *ngFor="let item of media" class="media-item">
          <img [src]="item.url" [alt]="item.alt">
        </div>
        <div class="media-item placeholder" *ngIf="media.length < 6">
            <lucide-icon name="image" size="20"></lucide-icon>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn-full-width">Gérer la médiathèque</button>
      </div>
    </div>
  `,
  styleUrl: './media-gallery-widget.component.scss'
})
export class MediaGalleryWidgetComponent {
  @Input() media: any[] = [];
}
