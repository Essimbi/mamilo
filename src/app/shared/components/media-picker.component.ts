import { Component, EventEmitter, Input, Output, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ContentStore } from '../../core/services/content-store.service';
import { GlobalStateService } from '../../core/services/global-state.service';
import { MediaAsset } from '../../core/models/user.model';

@Component({
  selector: 'app-media-picker',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="media-picker-overlay" (click)="$event.stopPropagation()">
      <div class="media-picker-modal">
        <header class="picker-header">
          <div class="header-info">
            <h2>{{ title }}</h2>
            <p>Sélectionnez un fichier existant ou téléversez-en un nouveau.</p>
          </div>
          <button class="btn-close" (click)="close.emit()">&times;</button>
        </header>

        <nav class="picker-nav">
          <div class="search-box">
             <lucide-icon name="search" size="18"></lucide-icon>
             <input type="text" placeholder="Rechercher..." (input)="onSearch($event)">
          </div>
          <div class="filter-tabs">
            <button [class.active]="typeFilter() === 'all'" (click)="typeFilter.set('all')">Tous</button>
            <button [class.active]="typeFilter() === 'image'" (click)="typeFilter.set('image')">Images</button>
            <button [class.active]="typeFilter() === 'video'" (click)="typeFilter.set('video')">Vidéos</button>
          </div>
        </nav>

        <main class="picker-body">
          <div class="media-grid">
            <!-- Upload Card -->
            <div class="media-card upload-card" (click)="fileInput.click()">
              <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" [accept]="accept">
              <lucide-icon name="upload-cloud" size="32"></lucide-icon>
              <span>Téléverser</span>
            </div>

            <!-- Asset Cards -->
            <div *ngFor="let asset of filteredMedia()" 
                 class="media-card" 
                 [class.selected]="isSelected(asset.id)"
                 (click)="toggleSelection(asset.id)">
              <div class="media-preview">
                <img [src]="asset.thumbnail_url || asset.url" [alt]="asset.alt" loading="lazy">
              </div>
              <div class="media-info">
                <span class="filename">{{ asset.filename }}</span>
              </div>
              <div class="selection-badge" *ngIf="isSelected(asset.id)">
                <lucide-icon name="check" size="14"></lucide-icon>
              </div>
            </div>
          </div>
          
          <div *ngIf="isLoading()" class="loading-overlay">
            <div class="spinner"></div>
          </div>
        </main>

        <footer class="picker-footer">
          <div class="selection-summary" *ngIf="multiSelect">
            {{ selectedIds().length }} élément(s) sélectionné(s)
          </div>
          <button class="btn-outline" (click)="close.emit()">Annuler</button>
          <button class="btn-primary" 
                  [disabled]="selectedIds().length === 0" 
                  (click)="confirmSelection()">
            {{ multiSelect ? 'Ajouter à la sélection' : 'Confirmer la sélection' }}
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .media-picker-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      display: flex; align-items: center; justify-content: center; z-index: 9999;
      backdrop-filter: blur(4px);
    }
    .media-picker-modal {
      background: white; border-radius: 20px; width: 90%; max-width: 900px;
      height: 85vh; display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    }

    .picker-header {
      padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9;
      display: flex; justify-content: space-between; align-items: flex-start;
      h2 { font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0; }
      p { font-size: 0.9rem; color: #64748b; margin: 0.25rem 0 0; }
      .btn-close { border: none; background: none; font-size: 1.5rem; color: #94a3b8; cursor: pointer; }
    }

    .picker-nav {
      padding: 1rem 2rem; background: #f8fafc; border-bottom: 1px solid #f1f5f9;
      display: flex; justify-content: space-between; align-items: center; gap: 1rem;
      
      .search-box {
        flex: 1; position: relative;
        lucide-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #94a3b8; }
        input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 0.9rem; }
      }

      .filter-tabs {
        display: flex; gap: 0.5rem;
        button {
          padding: 0.5rem 1rem; border: none; background: none; font-size: 0.85rem; font-weight: 600;
          color: #64748b; border-radius: 8px; cursor: pointer;
          &.active { background: white; color: #3b82f6; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        }
      }
    }

    .picker-body {
      flex: 1; overflow-y: auto; padding: 2rem; position: relative;
    }

    .media-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.25rem;
    }

    .media-card {
      aspect-ratio: 1; border-radius: 12px; border: 2px solid #f1f5f9; overflow: hidden;
      cursor: pointer; transition: all 0.2s; position: relative;
      
      &:hover { border-color: #3b82f6; transform: translateY(-2px); }
      &.selected { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }

      .media-preview {
        width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f8fafc;
        img { width: 100%; height: 100%; object-fit: cover; }
      }

      .media-info {
        position: absolute; bottom: 0; left: 0; right: 0; padding: 0.5rem;
        background: linear-gradient(transparent, rgba(0,0,0,0.7)); color: white;
        .filename { font-size: 0.75rem; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      }

      &.upload-card {
        border-style: dashed; display: flex; flex-direction: column; align-items: center; justify-content: center;
        gap: 0.75rem; color: #94a3b8;
        &:hover { background: #f0f7ff; color: #3b82f6; border-color: #3b82f6; }
        span { font-size: 0.85rem; font-weight: 600; }
      }

      .selection-badge {
        position: absolute; top: 0.5rem; right: 0.5rem;
        background: #3b82f6; color: white; width: 22px; height: 22px;
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 2;
      }
    }

    .loading-overlay {
      position: absolute; inset: 0; background: rgba(255,255,255,0.7);
      display: flex; align-items: center; justify-content: center;
    }

    .picker-footer {
      padding: 1.5rem 2.4rem; border-top: 1px solid #f1f5f9;
      display: flex; justify-content: flex-end; align-items: center; gap: 1rem;
      .selection-summary { flex: 1; font-size: 0.85rem; font-weight: 600; color: #3b82f6; }
    }

    .btn-outline { padding: 0.6rem 1.5rem; border: 1px solid #e2e8f0; border-radius: 10px; background: white; font-weight: 600; cursor: pointer; }
    .btn-primary { 
      padding: 0.6rem 1.5rem; background: #0f172a; color: white; border: none; border-radius: 10px; 
      font-weight: 600; cursor: pointer;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .spinner {
      width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: #3b82f6; border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class MediaPickerComponent implements OnInit {
  private store = inject(ContentStore);
  private state = inject(GlobalStateService);

  @Input() title = 'Sélecteur de médias';
  @Input() accept = 'image/*';
  @Input() multiSelect = false;
  
  @Output() select = new EventEmitter<MediaAsset>();
  @Output() selectMultiple = new EventEmitter<MediaAsset[]>();
  @Output() close = new EventEmitter<void>();

  media = this.state.media;
  isLoading = this.state.isLoading;
  
  typeFilter = signal('all');
  searchQuery = signal('');
  selectedIds = signal<string[]>([]);

  filteredMedia = computed(() => {
    let list = this.media();
    
    if (this.typeFilter() !== 'all') {
      list = list.filter(m => m.mime_type.startsWith(this.typeFilter()));
    }

    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(m => 
        m.filename.toLowerCase().includes(q) || 
        (m.alt && m.alt.toLowerCase().includes(q))
      );
    }

    return list;
  });

  ngOnInit() {
    // Ensure media is loaded when picker opens
    setTimeout(() => {
      this.store.loadMedia();
    });
  }

  onSearch(event: any) {
    this.searchQuery.set(event.target.value);
  }

  isSelected(id: string): boolean {
    return this.selectedIds().includes(id);
  }

  toggleSelection(id: string) {
    if (this.multiSelect) {
      if (this.isSelected(id)) {
        this.selectedIds.update(ids => ids.filter(i => i !== id));
      } else {
        this.selectedIds.update(ids => [...ids, id]);
      }
    } else {
      this.selectedIds.set([id]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.store.uploadMedia(file).subscribe(newAsset => {
        if (this.multiSelect) {
          this.selectedIds.update(ids => [...ids, newAsset.id]);
        } else {
          this.selectedIds.set([newAsset.id]);
        }
      });
    }
  }

  confirmSelection() {
    const assets = this.media().filter(m => this.selectedIds().includes(m.id));
    if (assets.length > 0) {
      if (this.multiSelect) {
        this.selectMultiple.emit(assets);
      } else {
        this.select.emit(assets[0]);
      }
      this.close.emit();
    }
  }
}
