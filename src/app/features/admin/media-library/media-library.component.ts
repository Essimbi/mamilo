import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { MediaAsset } from '../../../core/models/user.model';
import { FormsModule } from '@angular/forms';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-media-library',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, SkeletonLoaderComponent],
  template: `
    <div class="admin-page">
      <!-- Premium Glassmorphism Header -->
      <header class="media-header card glass">
        <div class="header-main">
          <h1>Médiathèque <span>Beta</span></h1>
          <p>Gérez, organisez et optimisez vos ressources numériques.</p>
        </div>
        <div class="header-actions">
           <div class="search-box">
              <lucide-icon name="search" size="18"></lucide-icon>
              <input type="text" placeholder="Rechercher par nom ou texte alt..." 
                     [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)">
           </div>
           <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none">
           <button class="btn-upload" (click)="fileInput.click()" [disabled]="isLoading()">
             <lucide-icon name="plus" size="18"></lucide-icon>
             Nouveau Média
           </button>
        </div>
      </header>

      <div class="media-layout" [class.has-selection]="!!selectedAsset()">
        <!-- Filter Toolbar -->
        <nav class="filter-toolbar card glass">
          <div class="filter-section">
             <label><lucide-icon name="filter" size="14"></lucide-icon> Filtrer par</label>
             <div class="btn-group">
                <button [class.active]="typeFilter() === 'all'" (click)="typeFilter.set('all')">Tous</button>
                <button [class.active]="typeFilter() === 'image'" (click)="typeFilter.set('image')">Images</button>
                <button [class.active]="typeFilter() === 'video'" (click)="typeFilter.set('video')">Vidéos</button>
                <button [class.active]="typeFilter() === 'application'" (click)="typeFilter.set('application')">Documents</button>
             </div>
          </div>
          <div class="filter-section">
             <label><lucide-icon name="sort-asc" size="14"></lucide-icon> Trier par</label>
             <select class="minimal-select" [ngModel]="sortBy()" (ngModelChange)="sortBy.set($event)">
                <option value="newest">Plus récent</option>
                <option value="oldest">Plus ancien</option>
                <option value="size">Taille</option>
                <option value="alpha">Nom (A-Z)</option>
             </select>
          </div>
        </nav>

        <!-- Gallery Section -->
        <main class="media-gallery">
          <!-- Skeleton Grid -->
          <app-skeleton *ngIf="isLoading() && media().length === 0" type="media" [count]="12"></app-skeleton>

          <div class="gallery-grid" *ngIf="(!isLoading() || media().length > 0) && filteredMedia().length > 0; else emptyState">
            <div *ngFor="let asset of filteredMedia(); let i = index" 
                 class="asset-card" 
                 [class.selected]="selectedAsset()?.id === asset.id" 
                 [style.animation-delay]="(i * 0.05) + 's'"
                 (click)="selectAsset(asset)">
              <div class="asset-preview">
                <img [src]="asset.thumbnail_url || asset.url" [alt]="asset.alt" loading="lazy">
                <div class="asset-overlay">
                   <span class="file-type">{{ getFileTypeLabel(asset.mime_type) }}</span>
                </div>
              </div>
              <div class="asset-meta">
                <p class="asset-name">{{ asset.filename }}</p>
                <span class="asset-size">{{ formatSize(asset.size) }}</span>
              </div>
            </div>
          </div>

          <ng-template #emptyState>
             <div class="empty-state-card card" *ngIf="!isLoading()">
                <lucide-icon name="image-off" size="48"></lucide-icon>
                <h3>Aucun résultat</h3>
                <p>Nous n'avons trouvé aucun média correspondant à vos filtres.</p>
                <button class="btn-inline" (click)="resetFilters()">Réinitialiser</button>
             </div>
          </ng-template>
        </main>

        <!-- Right Side Panel: Asset Intelligence -->
        <aside class="asset-panel card glass" *ngIf="selectedAsset() as asset">
          <div class="panel-header">
            <h3>Intelligence Asset</h3>
            <button class="btn-icon-close" (click)="selectedAsset.set(null)">
               <lucide-icon name="x" size="20"></lucide-icon>
            </button>
          </div>

          <div class="panel-hero">
             <div class="preview-box">
                <img [src]="asset.url" [alt]="asset.alt">
             </div>
             <div class="quick-stats">
                <div class="stat">
                   <label>Résolution</label>
                   <span>{{ asset.width || '--' }} × {{ asset.height || '--' }}px</span>
                </div>
                <div class="stat">
                   <label>Extension</label>
                   <span class="uppercase">{{ getFileTypeLabel(asset.mime_type) }}</span>
                </div>
             </div>
          </div>

          <div class="panel-tabs">
             <div class="tab-content">
                <div class="form-group">
                   <label>Texte descriptif (SEO)</label>
                   <div class="input-wrapper">
                      <lucide-icon name="type" size="14"></lucide-icon>
                      <input type="text" [(ngModel)]="tempAlt" placeholder="Saisissez le texte ALT...">
                   </div>
                </div>
                <div class="form-group">
                   <label>Légende détaillée</label>
                   <textarea rows="3" [(ngModel)]="tempCaption" placeholder="Informations complémentaires..."></textarea>
                </div>
                <button class="btn-save shadow-sm" (click)="saveMetadata()" [disabled]="isLoading()">
                   <lucide-icon name="check" size="16" *ngIf="!isLoading()"></lucide-icon>
                   <span>{{ isLoading() ? 'Synchronisation...' : 'Enregistrer' }}</span>
                </button>
             </div>
          </div>

          <div class="panel-system-info">
             <div class="info-row">
                <label>Nom système</label>
                <span>{{ asset.filename }}</span>
             </div>
             <div class="info-row">
                <label>Date import</label>
                <span>{{ asset.uploaded_at | date:'dd MMM yyyy, HH:mm' }}</span>
             </div>
             <div class="info-row">
                <label>Poids réel</label>
                <span>{{ asset.size | number }} bytes</span>
             </div>
          </div>

          <div class="panel-actions">
             <button class="btn-action-ghost" (click)="copyLink(asset.url)">
                <lucide-icon name="external-link" size="14"></lucide-icon>
                Copier l'URL publique
             </button>
             <button class="btn-action-danger" (click)="deleteAsset(asset)">
                <lucide-icon name="trash-2" size="14"></lucide-icon>
                Supprimer de la base
             </button>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host { --primary: #2563eb; --primary-light: #eff6ff; --surface: #ffffff; --text-main: #0f172a; --text-muted: #64748b; --border: #e2e8f0; --glass: rgba(255, 255, 255, 0.85); }
    
    .admin-page { padding: 2.5rem; max-width: 1600px; margin: 0 auto; min-height: 100vh; background: #f8fafc; }
    
    .card { background: var(--surface); border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .glass { backdrop-filter: blur(12px); background: var(--glass); }

    .media-header {
      padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      .header-main h1 { font-size: 1.75rem; font-weight: 800; color: var(--text-main); margin: 0; span { font-size: 0.7rem; background: var(--primary); color: white; padding: 2px 8px; border-radius: 20px; vertical-align: middle; margin-left: 0.5rem; } }
      .header-main p { color: var(--text-muted); font-size: 0.9rem; margin: 0.25rem 0 0; }
    }

    .header-actions {
      display: flex; gap: 1rem; align-items: center;
      .search-box {
        position: relative; border: 1px solid var(--border); border-radius: 12px; background: white; width: 320px;
        lucide-icon { position: absolute; left: 0.85rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        input { border: none; background: transparent; padding: 0.65rem 1rem 0.65rem 2.65rem; width: 100%; font-size: 0.875rem; outline: none; }
      }
      .btn-upload { background: var(--text-main); color: white; border: none; padding: 0.65rem 1.25rem; border-radius: 12px; font-weight: 600; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; transition: transform 0.2s; }
      .btn-upload:hover { transform: translateY(-1px); background: #1e293b; }
    }

    .media-layout {
      display: grid; grid-template-columns: 1fr; gap: 2rem; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      &.has-selection { grid-template-columns: 1fr 380px; }
    }

    .filter-toolbar {
      padding: 0.75rem 1.5rem; display: flex; justify-content: space-between; align-items: center;
      .filter-section { display: flex; align-items: center; gap: 1rem; label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem; } }
      .btn-group {
        display: flex; background: #f1f5f9; padding: 3px; border-radius: 10px;
        button { border: none; background: transparent; padding: 0.45rem 1.25rem; border-radius: 8px; font-size: 0.85rem; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: all 0.2s; }
        button.active { background: white; color: var(--primary); box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
      }
      .minimal-select { border: none; background: #f1f5f9; padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.85rem; font-weight: 600; outline: none; cursor: pointer; }
    }

    .media-gallery { position: relative; min-height: 500px; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.5rem; }

    .asset-card {
      background: white; border-radius: 18px; border: 1px solid var(--border); overflow: hidden; 
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative;
      animation: fadeInUp 0.5s ease backwards;

      &:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.1); }
      &.selected { border-color: var(--primary); border-width: 2px; }
      
      .asset-preview {
        aspect-ratio: 1; background: #f8fafc; position: relative; overflow: hidden;
        img { width: 100%; height: 100%; object-fit: cover; }
        .asset-overlay { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 60%); opacity: 0; transition: opacity 0.3s; display: flex; align-items: flex-end; padding: 1rem; }
        .file-type { background: rgba(255,255,255,0.9); color: var(--text-main); font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; }
      }
      &:hover .asset-overlay { opacity: 1; }

      .asset-meta { padding: 1rem; .asset-name { font-size: 0.85rem; font-weight: 700; color: var(--text-main); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } .asset-size { font-size: 0.75rem; color: var(--text-muted); } }
    }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    .asset-panel {
      padding: 1.5rem; position: sticky; top: 2.5rem; height: calc(100vh - 5rem); display: flex; flex-direction: column; gap: 1.5rem;
      animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);

      .panel-header { display: flex; justify-content: space-between; align-items: center; h3 { font-size: 1rem; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; } .btn-icon-close { border: none; background: #f1f5f9; padding: 0.4rem; border-radius: 8px; cursor: pointer; color: var(--text-muted); } }
      .panel-hero { .preview-box { border-radius: 16px; overflow: hidden; background: #f1f5f9; img { width: 100%; max-height: 200px; object-fit: contain; } } }
      .quick-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; .stat { background: #f8fafc; padding: 0.75rem; border-radius: 12px; label { display: block; font-size: 0.65rem; color: var(--text-muted); font-weight: 700; margin-bottom: 2px; } span { font-size: 0.8rem; font-weight: 600; color: var(--text-main); } } }
      
      .form-group { label { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; display: block; } .input-wrapper { position: relative; lucide-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); } input { width: 100%; background: #f8fafc; border: 1px solid var(--border); padding: 0.6rem 1rem 0.6rem 2.5rem; border-radius: 10px; font-size: 0.85rem; outline: none; &:focus { border-color: var(--primary); background: white; } } } textarea { width: 100%; background: #f8fafc; border: 1px solid var(--border); border-radius: 10px; padding: 0.75rem; font-size: 0.85rem; outline: none; &:focus { border-color: var(--primary); background: white; } } }
      .btn-save { background: var(--primary); color: white; border: none; padding: 0.75rem; border-radius: 12px; font-weight: 700; font-size: 0.9rem; width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; transition: all 0.2s; &:hover { background: #1d4ed8; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); } &:disabled { opacity: 0.6; cursor: not-allowed; } }
      
      .panel-system-info { border-top: 1px solid var(--border); padding-top: 1.25rem; display: flex; flex-direction: column; gap: 0.65rem; .info-row { display: flex; justify-content: space-between; label { font-size: 0.75rem; color: var(--text-muted); } span { font-size: 0.75rem; font-weight: 600; color: var(--text-main); } } }
      .panel-actions { margin-top: auto; display: flex; flex-direction: column; gap: 0.75rem; .btn-action-ghost { background: #f1f5f9; border: none; color: var(--text-main); font-weight: 600; font-size: 0.8rem; padding: 0.7rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; } .btn-action-danger { background: #fff1f2; color: #e11d48; border: none; font-weight: 700; font-size: 0.8rem; padding: 0.7rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; &:hover { background: #ffe4e6; } } }
    }

    @keyframes slideInRight { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .empty-state-card { padding: 4rem; text-align: center; color: var(--text-muted); lucide-icon { margin-bottom: 1.5rem; color: #cbd5e1; } h3 { font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin: 0 0 0.5rem; } p { margin: 0 0 1.5rem; } .btn-inline { background: var(--primary-light); color: var(--primary); border: none; padding: 0.5rem 1.5rem; border-radius: 8px; font-weight: 700; cursor: pointer; } }
    
    .loader-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.4); z-index: 5; }
    .ios-spinner { width: 32px; height: 32px; border: 3px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .uppercase { text-transform: uppercase; }
  `]
})
export class MediaLibraryComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);
  private toast = inject(ToastService);

  typeFilter = signal('all');
  searchQuery = signal('');
  sortBy = signal('newest');
  selectedAsset = signal<MediaAsset | null>(null);
  
  tempAlt = '';
  tempCaption = '';
  
  media = this.state.media;
  isLoading = this.state.isLoading;

  filteredMedia = computed(() => {
    const list_orig = [...this.media()];

    
    let list = list_orig;
    
    // Type Filter (with safety check)
    if (this.typeFilter() !== 'all') {
      const target = this.typeFilter().toLowerCase();
      list = list.filter(m => {
        const mime = (m.mime_type || '').toLowerCase();
        // Handle common cases like 'image/jpeg' or even if backend sends 'image'
        return mime.startsWith(target) || mime === target;
      });
      console.log('After Type Filter:', list.length);
    }

    // Search Filter (with safety check)
    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(m => 
        (m.filename || '').toLowerCase().includes(q) || 
        (m.alt || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      switch (this.sortBy()) {
        case 'newest': return new Date(b.uploaded_at || 0).getTime() - new Date(a.uploaded_at || 0).getTime();
        case 'oldest': return new Date(a.uploaded_at || 0).getTime() - new Date(b.uploaded_at || 0).getTime();
        case 'size': return (b.size || 0) - (a.size || 0);
        case 'alpha': return (a.filename || '').localeCompare(b.filename || '');
        default: return 0;
      }
    });

    return list;
  });

  ngOnInit(): void {
    this.store.loadMedia();
  }

  selectAsset(asset: MediaAsset) {
    this.selectedAsset.set(asset);
    this.tempAlt = asset.alt || '';
    this.tempCaption = asset.caption || '';
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.store.uploadMedia(file).subscribe({
        next: (newAsset: MediaAsset) => {
          this.toast.success('Fichier téléchargé avec succès');
          this.selectAsset(newAsset);
        },
        error: () => this.toast.error('Erreur lors du téléchargement')
      });
    }
  }

  saveMetadata() {
    const asset = this.selectedAsset();
    if (asset) {
      this.store.updateMediaMetadata(asset.id, {
        alt: this.tempAlt,
        description: this.tempCaption
      }).subscribe({
        next: (updated: MediaAsset) => {
          this.toast.success('Métadonnées mises à jour');
          this.selectedAsset.set(updated);
        },
        error: () => this.toast.error('Erreur lors de la mise à jour')
      });
    }
  }

  formatSize(bytes: number) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  getFileTypeLabel(mime: string): string {
    if (!mime) return '???';
    const parts = mime.split('/');
    return parts[1] || parts[0];
  }

  resetFilters() {
    this.typeFilter.set('all');
    this.searchQuery.set('');
    this.sortBy.set('newest');
  }

  copyLink(url: string) {
    const fullUrl = url.startsWith('http') ? url : window.location.origin + url;
    navigator.clipboard.writeText(fullUrl).then(() => {
      this.toast.info('Lien copié dans le presse-papier');
    });
  }

  deleteAsset(asset: MediaAsset) {
    if (confirm('Voulez-vous vraiment supprimer ce fichier ?')) {
      this.store.deleteMedia(asset.id).subscribe({
        next: () => {
          this.toast.success('Fichier supprimé de la médiathèque');
          this.selectedAsset.set(null);
        },
        error: () => this.toast.error('Erreur lors de la suppression')
      });
    }
  }
}
