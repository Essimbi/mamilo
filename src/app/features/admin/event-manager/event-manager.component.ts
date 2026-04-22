import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { Event as AcademicEvent } from '../../../core/models/event.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaPickerComponent } from '../../../shared/components/media-picker.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-event-manager',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule, MediaPickerComponent, SkeletonLoaderComponent],
  template: `
    <div class="admin-page">
      <header class="page-header card glass">
        <div class="header-main">
          <h1>Gestion d'Événements</h1>
          <p>Supervisez vos conférences, séminaires et interventions publiques.</p>
        </div>
        <div class="header-actions">
           <div class="stats-mini">
              <div class="stat">
                 <span class="count">{{ upcomingEvents().length }}</span>
                 <span class="label">À venir</span>
              </div>
           </div>
           <button class="btn-create" (click)="openEditor()">
             <lucide-icon name="calendar-plus" size="18"></lucide-icon>
             Nouvel Événement
           </button>
        </div>
      </header>

      <div class="manager-content" [class.has-sidebar]="isEditorOpen()">
        <!-- Main Grid Area -->
        <main class="events-grid-container">
           <div class="grid-controls">
              <div class="search-bar">
                 <lucide-icon name="search" size="16"></lucide-icon>
                 <input type="text" placeholder="Rechercher un événement..." (input)="onSearch($event)">
              </div>
           </div>

           <!-- Skeleton Loader -->
           <app-skeleton *ngIf="isLoading() && events().length === 0" type="cards" [count]="6"></app-skeleton>

           <div class="events-grid" *ngIf="(!isLoading() || events().length > 0) && filteredEvents().length > 0; else emptyState">
              <div *ngFor="let event of filteredEvents(); let i = index" 
                   class="event-card card" 
                   [style.animation-delay]="(i * 0.05) + 's'"
                   [class.selected]="editingEvent()?.id === event.id">
                 <div class="event-banner" (click)="openEditor(event)">
                    <img [src]="event.coverImage?.url || '/assets/images/event-placeholder.jpg'" alt="Event Cover">
                    <div class="status-chip" [class]="event.status">
                       {{ getStatusLabel(event.status) }}
                    </div>
                 </div>
                 <div class="event-body" (click)="openEditor(event)">
                    <div class="event-type-icon">
                       <lucide-icon [name]="getEventIcon(event.type)" size="16"></lucide-icon>
                       <span>{{ event.type }}</span>
                    </div>
                    <h3 class="event-title">{{ event.title }}</h3>
                    <div class="event-details">
                       <div class="detail">
                          <lucide-icon name="calendar" size="14"></lucide-icon>
                          <span>{{ event.eventDate | date:'dd MMM yyyy' }}</span>
                       </div>
                       <div class="detail">
                          <lucide-icon name="clock" size="14"></lucide-icon>
                          <span>{{ event.eventDate | date:'HH:mm' }}</span>
                       </div>
                       <div class="detail full">
                          <lucide-icon name="map-pin" size="14"></lucide-icon>
                          <span>{{ event.location }}</span>
                       </div>
                    </div>
                 </div>
                 <div class="event-footer">
                    <div class="social-summary">
                       <lucide-icon name="heart" size="12"></lucide-icon>
                       <span>{{ event.likesCount || 0 }}</span>
                    </div>
                    <div class="actions">
                       <button class="btn-edit" (click)="openEditor(event)">
                          <lucide-icon name="edit-3" size="16"></lucide-icon>
                       </button>
                       <button class="btn-delete" (click)="onDelete($event, event)">
                          <lucide-icon name="trash-2" size="16"></lucide-icon>
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           <ng-template #emptyState>
              <div class="empty-state-card card" *ngIf="!isLoading()">
                 <lucide-icon name="calendar-off" size="48"></lucide-icon>
                 <h3>La liste est vide</h3>
                 <p>Commencez par planifier votre premier événement académique.</p>
              </div>
           </ng-template>

           <div *ngIf="isLoading()" class="loader-overlay">
              <div class="ios-spinner"></div>
           </div>
        </main>

        <!-- Dynamic Editor Sidebar -->
        <aside class="editor-sidebar card glass" *ngIf="isEditorOpen()">
           <div class="sidebar-header">
              <h3>{{ editingEvent() ? 'Détails de l\\'événement' : 'Nouvel événement' }}</h3>
              <button class="btn-icon-close" (click)="closeEditor()">
                 <lucide-icon name="x" size="20"></lucide-icon>
              </button>
           </div>

           <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="premium-form">
              <div class="form-section">
                 <label>Informations Générales</label>
                 <div class="form-group">
                    <input type="text" formControlName="title" placeholder="Titre de l\\'événement..." class="title-input">
                 </div>
                 
                 <div class="form-row">
                    <div class="form-group half">
                       <label>Type</label>
                       <select formControlName="type">
                          <option value="conference">Conférence</option>
                          <option value="seminar">Séminaire</option>
                          <option value="workshop">Atelier</option>
                          <option value="webinar">Webinaire</option>
                       </select>
                    </div>
                    <div class="form-group half">
                       <label>Statut</label>
                       <select formControlName="status">
                          <option value="upcoming">À venir</option>
                          <option value="ongoing">En cours</option>
                          <option value="past">Terminé</option>
                       </select>
                    </div>
                 </div>
              </div>

              <div class="form-section">
                 <label>Planification</label>
                 <div class="form-row">
                    <div class="form-group full">
                       <div class="input-with-icon">
                          <lucide-icon name="clock-3" size="16"></lucide-icon>
                          <input type="datetime-local" formControlName="eventDate">
                       </div>
                    </div>
                 </div>
                 <div class="form-group mt-3">
                    <label>Lieu / Plateforme</label>
                    <div class="input-with-icon">
                       <lucide-icon name="map-pin" size="16"></lucide-icon>
                       <input type="text" formControlName="location" placeholder="Villes, Campus, ou lien Zoom...">
                    </div>
                 </div>
              </div>

              <div class="form-section">
                 <label>Contenu & Média</label>
                 <div class="cover-image-picker" [class.has-image]="!!eventForm.get('coverImageId')?.value">
                    <div class="placeholder" *ngIf="!eventForm.get('coverImageId')?.value">
                       <lucide-icon name="image" size="24"></lucide-icon>
                       <span>Image de couverture</span>
                    </div>
                    <img *ngIf="eventForm.get('coverImageId')?.value" 
                         [src]="selectedCoverUrl" class="preview-img">
                    <button type="button" class="btn-picker" (click)="pickImage()">
                       {{ eventForm.get('coverImageId')?.value ? 'Changer l\\'image' : 'Sélectionner' }}
                    </button>
                 </div>
                 
                 <div class="form-group mt-3">
                    <label>Lien Article associé (Récap)</label>
                    <div class="input-with-icon">
                       <lucide-icon name="file-text" size="16"></lucide-icon>
                       <input type="text" formControlName="recapArticleId" placeholder="ID ou titre de l\\'article...">
                    </div>
                 </div>
              </div>

              <div class="form-section">
                 <header class="section-header">
                    <label>Galerie Photos</label>
                    <button type="button" class="btn-text" (click)="pickGallery()">Ajouter des images</button>
                 </header>
                 <div class="gallery-preview-grid">
                    <div *ngFor="let img of gallery()" class="gallery-item">
                       <img [src]="img.thumbnail_url || img.url" [alt]="img.alt">
                       <button type="button" class="btn-remove" (click)="removeGalleryImage(img.id)">
                          <lucide-icon name="x" size="12"></lucide-icon>
                       </button>
                    </div>
                    <div class="gallery-placeholder" *ngIf="gallery().length === 0" (click)="pickGallery()">
                       <lucide-icon name="camera" size="24"></lucide-icon>
                       <span>Images illustratives</span>
                    </div>
                 </div>
              </div>

              <div class="form-section">
                 <label>Description</label>
                 <textarea formControlName="description" rows="4" placeholder="Décrivez les enjeux et objectifs..."></textarea>
              </div>

              <div class="sidebar-footer">
                 <button type="button" class="btn-ghost" (click)="closeEditor()">Fermer</button>
                 <button type="submit" class="btn-save" [disabled]="eventForm.invalid || isLoading()">
                    {{ editingEvent() ? 'Mettre à jour' : 'Publier' }}
                 </button>
              </div>
           </form>
        </aside>
      </div>

      <app-media-picker 
        *ngIf="showMediaPicker()" 
        (select)="onImageSelected($event)" 
        (closed)="showMediaPicker.set(false)">
      </app-media-picker>

      <app-media-picker 
        *ngIf="showGalleryPicker()" 
        [multiSelect]="true"
        title="Ajouter à la galerie"
        (selectMultiple)="onGalleryImagesSelected($event)" 
        (closed)="showGalleryPicker.set(false)">
      </app-media-picker>
    </div>
  `,
  styles: [`
    :host { --primary: #3b82f6; --primary-light: #eff6ff; --text-main: #0f172a; --text-muted: #64748b; --border: #e2e8f0; --glass: rgba(255, 255, 255, 0.85); --radius: 16px; }

    .admin-page { padding: 2rem; background: #f8fafc; min-height: 100vh; position: relative; overflow-x: hidden; }
    .card { background: white; border-radius: var(--radius); border: 1px solid var(--border); box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .glass { backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.9); }

    .page-header {
      padding: 1.5rem 2rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      .header-main h1 { font-size: 1.5rem; font-weight: 800; color: var(--text-main); margin: 0; }
      .header-main p { color: var(--text-muted); font-size: 0.9rem; margin-top: 0.2rem; }
      .header-actions { display: flex; gap: 1.5rem; align-items: center; }
      .stats-mini .stat { display: flex; flex-direction: column; align-items: center; .count { font-weight: 800; color: var(--primary); } .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); } }
      .btn-create { background: var(--text-main); color: white; border: none; padding: 0.7rem 1.2rem; border-radius: 12px; font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; &:hover { transform: translateY(-1px); background: #1e293b; } }
    }

    .manager-content {
      display: grid; grid-template-columns: 1fr; gap: 2rem; transition: all 0.4s ease;
      &.has-sidebar { grid-template-columns: 1fr 420px; }
    }

    .grid-controls {
      margin-bottom: 1.5rem;
      .search-bar {
        position: relative; max-width: 400px;
        lucide-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        input { width: 100%; padding: 0.75rem 1rem 0.75rem 2.8rem; border: 1px solid var(--border); border-radius: 12px; font-size: 0.9rem; outline: none; &:focus { border-color: var(--primary); } }
      }
    }

    .events-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;
    }

    .event-card {
      overflow: hidden; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      &:hover { transform: translateY(-5px); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }
      &.selected { ring: 2px solid var(--primary); }

      .event-banner {
        height: 160px; position: relative; background: #f1f5f9;
        img { width: 100%; height: 100%; object-fit: cover; }
        .status-chip { 
          position: absolute; top: 1rem; right: 1rem; padding: 0.3rem 0.8rem; border-radius: 20px; 
          font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;
          &.upcoming { background: rgba(59, 130, 246, 0.9); color: white; }
          &.ongoing { background: rgba(16, 185, 129, 0.9); color: white; }
          &.past { background: rgba(100, 116, 139, 0.9); color: white; }
        }
      }

      .event-body {
        padding: 1.5rem;
        .event-type-icon { display: flex; align-items: center; gap: 0.5rem; color: var(--primary); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; margin-bottom: 0.75rem; }
        .event-title { font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin: 0 0 1rem; min-height: 2.8rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .event-details {
          display: flex; flex-wrap: wrap; gap: 1rem;
          .detail { display: flex; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.85rem; &.full { width: 100%; } }
        }
      }

      .event-footer {
        padding: 1rem 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
        .social-summary { display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); font-size: 0.75rem; lucide-icon { color: #f43f5e; } }
        .actions { 
          display: flex; gap: 0.5rem;
          button { border: none; background: #f1f5f9; padding: 0.5rem; border-radius: 8px; cursor: pointer; color: var(--text-muted); &:hover { background: #e2e8f0; color: var(--text-main); } &.btn-delete:hover { background: #fee2e2; color: #ef4444; } }
        }
      }
    }

    .editor-sidebar {
      padding: 1.5rem; position: sticky; top: 2rem; height: calc(100vh - 4rem); overflow-y: auto;
      display: flex; flex-direction: column; gap: 1.5rem; z-index: 40;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .sidebar-header { display: flex; justify-content: space-between; align-items: center; gap: 1rem; h3 { font-size: 0.9rem; font-weight: 800; text-transform: uppercase; margin: 0; color: var(--text-main); letter-spacing: 0.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .btn-icon-close { flex-shrink: 0; border: none; background: #f1f5f9; padding: 0.5rem; border-radius: 10px; cursor: pointer; color: var(--text-muted); transition: all 0.2s; &:hover { background: #e2e8f0; color: var(--text-main); } } }
    }

    .premium-form {
      display: flex; flex-direction: column; gap: 1.5rem;
      .form-section { display: flex; flex-direction: column; gap: 0.8rem; label { font-size: 0.7rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; } }
      .title-input { border: none; border-bottom: 2px solid var(--border); font-size: 1.3rem; font-weight: 800; padding: 0.5rem 0; width: 100%; outline: none; transition: border-color 0.3s; color: var(--text-main); &:focus { border-color: var(--primary); } }
      .form-row { display: flex; gap: 1rem; .form-group.half { flex: 1; min-width: 140px; } }
      input, select, textarea { width: 100%; padding: 0.7rem 1rem; border-radius: 12px; border: 1px solid var(--border); font-size: 0.9rem; &:focus { border-color: var(--primary); outline: none; } }
      .input-with-icon { position: relative; lucide-icon { position: absolute; left: 0.8rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); } input { padding-left: 2.5rem; } }
      
      .cover-image-picker {
        height: 140px; border: 2px dashed var(--border); border-radius: 16px; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem;
        transition: all 0.3s; overflow: hidden; &.has-image { border-style: solid; border-color: var(--primary); }
        .preview-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.4; }
        .placeholder { display: flex; flex-direction: column; align-items: center; color: var(--text-muted); z-index: 1; span { font-size: 0.75rem; } }
        .btn-picker { z-index: 2; background: white; border: 1px solid var(--border); padding: 0.4rem 1rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; &:hover { background: #f8fafc; } }
      }

      .sidebar-footer { margin-top: 1rem; display: flex; gap: 1rem; button { flex: 1; padding: 0.75rem; border-radius: 12px; font-weight: 700; cursor: pointer; } .btn-ghost { background: transparent; border: 1px solid var(--border); } .btn-save { background: var(--primary); color: white; border: none; &:hover { background: #2563eb; box-shadow: 0 4px 12px rgba(37,99,235,0.2); } } }
    }

    @media (max-width: 1024px) {
      .manager-content.has-sidebar { grid-template-columns: 1fr; }
      .editor-sidebar { 
        position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 440px; 
        z-index: 100; height: 100vh; border-radius: 0; background: white;
        box-shadow: -10px 0 40px rgba(0,0,0,0.1); padding: 1.5rem 1rem;
      }
    }

    @media (max-width: 640px) {
      .admin-page { padding: 1rem 0.75rem; }
      .page-header { flex-direction: column; align-items: flex-start; gap: 1.5rem; .header-actions { width: 100%; justify-content: space-between; gap: 1rem; } .btn-create { width: 100%; justify-content: center; } }
      .events-grid { grid-template-columns: 1fr; }
      .form-row { flex-direction: column; gap: 1.25rem; }
      .editor-sidebar { max-width: 100%; }
    }

    @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .loader-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.5); display: flex; align-items: center; justify-content: center; z-index: 10; }
    .ios-spinner { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .empty-state-card { padding: 4rem; text-align: center; color: var(--text-muted); lucide-icon { margin-bottom: 1.5rem; } h3 { color: var(--text-main); font-weight: 800; margin-bottom: 0.5rem; } }
    .mt-3 { margin-top: 1rem; }

    .section-header { display: flex; justify-content: space-between; align-items: center; .btn-text { background: none; border: none; color: var(--primary); font-size: 0.75rem; font-weight: 700; cursor: pointer; &:hover { text-decoration: underline; } } }
    .gallery-preview-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 0.5rem; min-height: 80px;
      .gallery-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; img { width: 100%; height: 100%; object-fit: cover; } .btn-remove { position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 4px; padding: 2px; line-height: 0; cursor: pointer; &:hover { background: #ef4444; } } }
      .gallery-placeholder { aspect-ratio: 1; border: 2px dashed var(--border); border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); cursor: pointer; lucide-icon { opacity: 0.5; } span { font-size: 0.6rem; text-align: center; padding: 0 4px; } &:hover { border-color: var(--primary); color: var(--primary); } }
    }
  `]
})
export class EventManagerComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  isLoading = this.state.isLoading;
  events = this.state.events;
  isEditorOpen = signal(false);
  editingEvent = signal<AcademicEvent | null>(null);
  
  searchQuery = signal('');
  showMediaPicker = signal(false);
  showGalleryPicker = signal(false);
  selectedCoverUrl = '';
  gallery = signal<any[]>([]);

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    type: ['conference', [Validators.required]],
    status: ['upcoming', [Validators.required]],
    eventDate: ['', [Validators.required]],
    location: ['', [Validators.required]],
    coverImageId: [''],
    recapArticleId: [''],
    description: ['']
  });

  upcomingEvents = computed(() => this.events().filter(e => e.status === 'upcoming'));
  
  filteredEvents = computed(() => {
    let list = [...this.events()];
    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }
    return list;
  });

  ngOnInit(): void {
    // Delay load to avoid ExpressionChangedAfterItHasBeenCheckedError during hydration/init
    setTimeout(() => {
      this.store.loadEvents();
    });
  }

  onSearch(event: any) {
    this.searchQuery.set(event.target.value);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'past': return 'Terminé';
      default: return status;
    }
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'conference': return 'mic-2';
      case 'seminar': return 'users';
      case 'workshop': return 'wrench';
      case 'webinar': return 'video';
      default: return 'calendar';
    }
  }

  openEditor(event?: AcademicEvent) {
    this.isEditorOpen.set(true);
    if (event) {
      this.editingEvent.set(event);
      this.selectedCoverUrl = event.coverImage?.url || '';
      this.gallery.set(event.gallery || []);
      this.eventForm.patchValue({
        title: event.title,
        type: event.type,
        status: event.status,
        eventDate: event.eventDate ? event.eventDate.substring(0, 16) : '',
        location: event.location,
        coverImageId: event.coverImage?.id || '',
        recapArticleId: event.recapArticle?.id || '',
        description: event.description
      });
    } else {
      this.editingEvent.set(null);
      this.selectedCoverUrl = '';
      this.gallery.set([]);
      this.eventForm.reset({ type: 'conference', status: 'upcoming', coverImageId: '', recapArticleId: '' });
    }
  }

  pickGallery() {
    this.showGalleryPicker.set(true);
  }

  onGalleryImagesSelected(assets: any[]) {
    const current = this.gallery();
    const newAssets = assets.filter(a => !current.find(c => c.id === a.id));
    this.gallery.set([...current, ...newAssets]);
    this.showGalleryPicker.set(false);
  }

  removeGalleryImage(id: string) {
    this.gallery.update(current => current.filter(img => img.id !== id));
  }

  closeEditor() {
    this.isEditorOpen.set(false);
    this.editingEvent.set(null);
  }

  pickImage() {
    this.showMediaPicker.set(true);
  }

  onImageSelected(asset: any) {
    this.eventForm.get('coverImageId')?.setValue(asset.id);
    this.selectedCoverUrl = asset.url;
    this.showMediaPicker.set(false);
  }

  onSubmit() {
    if (this.eventForm.invalid) return;
    
    const formVal = this.eventForm.value;
    const eventData: Partial<AcademicEvent> = {
      title: formVal.title,
      type: formVal.type,
      status: formVal.status,
      eventDate: new Date(formVal.eventDate).toISOString(),
      location: formVal.location,
      description: formVal.description,
      coverImage: formVal.coverImageId ? { id: formVal.coverImageId } as any : null,
      recapArticle: formVal.recapArticleId ? { id: formVal.recapArticleId } as any : null,
      gallery: this.gallery()
    };

    if (this.editingEvent()) {
      this.store.updateEvent(this.editingEvent()!.id, entry_eventData(eventData)).subscribe({
        next: () => {
          this.toast.success('Événement mis à jour avec succès');
          this.closeEditor();
        },
        error: (err) => {
          this.toast.error('Erreur lors de la mise à jour');
          this.handleValidationErrors(err);
        }
      });
    } else {
      this.store.createEvent(entry_eventData(eventData)).subscribe({
        next: () => {
          this.toast.success('Événement créé avec succès');
          this.closeEditor();
        },
        error: (err) => {
          this.toast.error('Erreur lors de la création');
          this.handleValidationErrors(err);
        }
      });
    }
  }

  private handleValidationErrors(err: any) {
    if (err.status === 422 && err.error?.errors) {
      const errors = err.error.errors;
      Object.keys(errors).forEach(key => {
        const control = this.eventForm.get(key);
        if (control) {
          control.setErrors({ serverError: errors[key][0] });
          control.markAsTouched();
        }
      });
    }
  }

  onDelete(event: MouseEvent, eve: AcademicEvent) {
    event.stopPropagation();
    if (confirm(`Supprimer l'événement "${eve.title}" ?`)) {
      this.store.deleteEvent(eve.id).subscribe({
        next: () => this.toast.success('Événement supprimé'),
        error: () => this.toast.error('Erreur lors de la suppression')
      });
    }
  }
}

function entry_eventData(data: any) {
    // Helper to ensure clean data for the store
    return data;
}
