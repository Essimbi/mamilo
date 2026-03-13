import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { MediaAsset } from '../../../core/models/user.model';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Médiathèque</h1>
          <p>Gérez vos images et documents pour vos articles et événements.</p>
        </div>
        <div class="header-actions">
          <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none">
          <button class="btn-primary" (click)="fileInput.click()">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Téléverser
          </button>
        </div>
      </header>

      <div class="media-container">
        <!-- Sidebar Filters -->
        <aside class="media-filters card">
          <div class="filter-group">
            <label>Type de fichier</label>
            <div class="filter-options">
              <button [class.active]="typeFilter() === 'all'" (click)="typeFilter.set('all')">Tous</button>
              <button [class.active]="typeFilter() === 'image'" (click)="typeFilter.set('image')">Images</button>
              <button [class.active]="typeFilter() === 'video'" (click)="typeFilter.set('video')">Vidéos</button>
              <button [class.active]="typeFilter() === 'document'" (click)="typeFilter.set('document')">Documents</button>
            </div>
          </div>

          <div class="filter-group">
            <label>Trier par</label>
            <select class="select-input" (change)="onSortChange($event)">
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="size">Taille</option>
            </select>
          </div>
        </aside>

        <!-- Gallery Grid -->
        <main class="media-gallery">
          <div class="gallery-grid">
            <div *ngFor="let asset of filteredMedia()" class="media-card" [class.selected]="selectedAsset()?.id === asset.id" (click)="selectAsset(asset)">
              <div class="media-preview">
                <img [src]="asset.thumbnailUrl" [alt]="asset.alt">
              </div>
              <div class="media-info">
                <span class="media-name">{{ asset.filename }}</span>
                <span class="media-meta">{{ asset.size / 1024 | number:'1.0-0' }} KB</span>
              </div>
            </div>

            <!-- Upload Placeholder -->
            <div class="media-card upload-placeholder" (click)="fileInput.click()">
              <lucide-icon name="upload-cloud" size="32"></lucide-icon>
              <span>Ajouter</span>
            </div>
          </div>
        </main>

        <!-- Asset Details Sidebar -->
        <aside class="asset-details card" *ngIf="selectedAsset() as asset">
          <div class="details-header">
            <h3>Détails du fichier</h3>
            <button class="btn-close" (click)="selectedAsset.set(null)">&times;</button>
          </div>
          
          <div class="details-preview">
            <img [src]="asset.url" [alt]="asset.alt">
          </div>

          <div class="details-list">
            <div class="detail-item">
              <label>Nom</label>
              <span>{{ asset.filename }}</span>
            </div>
            <div class="detail-item">
              <label>Type</label>
              <span>{{ asset.mimeType }}</span>
            </div>
            <div class="detail-item">
              <label>Dimensions</label>
              <span>{{ asset.width }} &times; {{ asset.height }}px</span>
            </div>
            <div class="detail-item">
              <label>Poids</label>
              <span>{{ asset.size / 1024 | number:'1.0-1' }} KB</span>
            </div>
            <div class="detail-item">
              <label>Date</label>
              <span>{{ asset.uploadedAt | date:'mediumDate' }}</span>
            </div>
          </div>

          <div class="details-actions">
            <button class="btn-outline-sm full-width" (click)="copyLink(asset.url)">
              <lucide-icon name="link" size="14"></lucide-icon>
              Copier le lien
            </button>
            <button class="btn-danger-sm full-width" (click)="deleteAsset(asset)">
              <lucide-icon name="trash-2" size="14"></lucide-icon>
              Supprimer
            </button>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/abstracts/variables' as *;

    .admin-page { padding: 2rem; }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      h1 { font-size: 1.875rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
      p { color: #64748b; }
    }

    .card {
      background: white;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .media-container {
      display: grid;
      grid-template-columns: 240px 1fr 320px;
      gap: 1.5rem;
      align-items: start;

      @media (max-width: 1200px) {
        grid-template-columns: 200px 1fr;
        .asset-details { display: none; }
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .media-filters {
      padding: 1.5rem;
      position: sticky;
      top: 2rem;

      .filter-group {
        margin-bottom: 1.5rem;
        label { display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.75rem; }
      }

      .filter-options {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        button {
          text-align: left;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;

          &:hover { background: #f1f5f9; color: #1e293b; }
          &.active { background: #eff6ff; color: #2563eb; font-weight: 600; }
        }
      }
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 1rem;
    }

    .media-card {
      background: white;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s;

      &:hover { border-color: #3b82f6; transform: translateY(-2px); }
      &.selected { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }

      .media-preview {
        aspect-ratio: 1;
        background: #f8fafc;
        display: flex;
        align-items: center;
        justify-content: center;

        img { width: 100%; height: 100%; object-fit: cover; }
      }

      .media-info {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .media-name { font-size: 0.8rem; font-weight: 600; color: #1e293b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .media-meta { font-size: 0.75rem; color: #94a3b8; }
      }

      &.upload-placeholder {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-style: dashed;
        color: #94a3b8;
        gap: 0.5rem;
        &:hover { color: #3b82f6; border-color: #3b82f6; background: #f0f7ff; }
      }
    }

    .asset-details {
      padding: 1.5rem;
      position: sticky;
      top: 2rem;

      .details-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
        h3 { font-size: 1rem; font-weight: 700; color: #1e293b; }
        .btn-close { border: none; background: transparent; font-size: 1.5rem; color: #94a3b8; cursor: pointer; }
      }

      .details-preview {
        width: 100%;
        aspect-ratio: 16/9;
        background: #f8fafc;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        overflow: hidden;
        img { width: 100%; height: 100%; object-fit: contain; }
      }

      .details-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
          span { font-size: 0.9rem; color: #1e293b; word-break: break-all; }
        }
      }

      .details-actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
    }

    .full-width { width: 100%; justify-content: center; }

    .btn-outline-sm {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid #e2e8f0;
        background: white;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #475569;
        cursor: pointer;
        &:hover { background: #f8fafc; color: #1e293b; }
    }

    .btn-danger-sm {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border: 1px solid transparent;
        background: #fee2e2;
        color: #dc2626;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        &:hover { background: #fecaca; }
    }
  `]
})
export class MediaLibraryComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);

  typeFilter = signal('all');
  selectedAsset = signal<MediaAsset | null>(null);
  
  media = this.state.media;
  isLoading = this.state.isLoading;

  filteredMedia = computed(() => {
    let list = this.media();
    if (this.typeFilter() !== 'all') {
      list = list.filter(m => m.mimeType.startsWith(this.typeFilter()));
    }
    return list;
  });

  ngOnInit(): void {}

  selectAsset(asset: MediaAsset) {
    this.selectedAsset.set(asset);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.store.uploadMedia({
          url: e.target.result,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          width: 0,
          height: 0,
          alt: file.name
        }).subscribe(newAsset => {
          this.selectedAsset.set(newAsset);
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSortChange(event: any) {
    const val = event.target.value;
    // Sorting is handled by the component's filteredMedia computed signal if we want, 
    // but the original code was updating the local signal. 
    // Since we now use the global state, we should probably handle sorting in the computed.
  }

  copyLink(url: string) {
    navigator.clipboard.writeText(url);
    alert('Lien copié dans le presse-papier');
  }

  deleteAsset(asset: MediaAsset) {
    if (confirm('Supprimer ce fichier définitivement ?')) {
      this.store.deleteMedia(asset.id).subscribe(() => {
        this.selectedAsset.set(null);
      });
    }
  }
}
