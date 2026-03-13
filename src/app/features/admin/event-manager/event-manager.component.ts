import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { Event, EventType } from '../../../core/models/event.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event-manager',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Gestionnaire d'Événements</h1>
          <p>Organisez votre agenda académique et vos interventions publiques.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openEditor()">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Ajouter un événement
          </button>
        </div>
      </header>

      <div class="manager-layout">
        <!-- Events List -->
        <main class="events-list card">
          <div class="table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Événement</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Lieu</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let event of events()">
                  <td class="event-cell">
                    <span class="event-title">{{ event.title }}</span>
                  </td>
                  <td>
                    <span class="type-badge">{{ event.type | titlecase }}</span>
                  </td>
                  <td>{{ event.startDate | date:'d MMM yyyy' }}</td>
                  <td>{{ event.location.city }}, {{ event.location.country }}</td>
                  <td class="text-right">
                    <div class="actions-group">
                      <button (click)="openEditor(event)" class="btn-icon" title="Modifier">
                        <lucide-icon name="pencil" size="16"></lucide-icon>
                      </button>
                      <button (click)="onDelete(event)" class="btn-icon delete" title="Supprimer">
                        <lucide-icon name="trash-2" size="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="events().length === 0">
                  <td colspan="5" class="empty-state">Aucun événement enregistré.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>

        <!-- Editor Sidebar -->
        <aside class="editor-sidebar card" *ngIf="isEditorOpen()">
          <div class="editor-header">
            <h3>{{ editingEvent() ? 'Modifier' : 'Nouvel' }} Événement</h3>
            <button class="btn-close" (click)="closeEditor()">&times;</button>
          </div>

          <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="editor-form">
            <div class="form-group">
              <label>Titre</label>
              <input type="text" formControlName="title" placeholder="Ex: Sommet mondial sur le climat">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Type</label>
                <select formControlName="type">
                  <option value="conference">Conférence</option>
                  <option value="seminar">Séminaire</option>
                  <option value="workshop">Atelier</option>
                  <option value="webinar">Webinaire</option>
                </select>
              </div>
              <div class="form-group">
                <label>Statut</label>
                <select formControlName="status">
                  <option value="upcoming">À venir</option>
                  <option value="ongoing">En cours</option>
                  <option value="past">Passé</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date de début</label>
                <input type="date" formControlName="startDate">
              </div>
              <div class="form-group">
                <label>Date de fin</label>
                <input type="date" formControlName="endDate">
              </div>
            </div>

            <div class="form-section">
              <h4>Localisation</h4>
              <div class="form-row">
                <div class="form-group">
                  <label>Ville</label>
                  <input type="text" formControlName="city">
                </div>
                <div class="form-group">
                  <label>Pays</label>
                  <input type="text" formControlName="country">
                </div>
              </div>
              <div class="form-group">
                <label>Lieu / Venue</label>
                <input type="text" formControlName="venue">
              </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea formControlName="description" rows="4" placeholder="Objectifs et contexte..."></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-outline" (click)="closeEditor()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="eventForm.invalid">
                {{ editingEvent() ? 'Mettre à jour' : 'Enregistrer' }}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/abstracts/variables' as *;

    .admin-page { padding: 2rem; }
    .page-header {
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
      h1 { font-size: 1.875rem; font-weight: 700; color: #1e293b; }
      p { color: #64748b; }
    }

    .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; }

    .manager-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    :host:has(.editor-sidebar) .manager-layout {
      grid-template-columns: 1fr 400px;
    }

    .events-list { overflow: hidden; }

    .admin-table {
      width: 100%; border-collapse: collapse; text-align: left;
      th { padding: 1rem 1.5rem; font-weight: 600; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; }
      td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }
    }

    .event-title { font-weight: 600; color: #1e293b; }
    .type-badge { padding: 0.25rem 0.625rem; background: #eff6ff; color: #2563eb; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; }

    .editor-sidebar {
      padding: 1.5rem; position: sticky; top: 2rem;
      .editor-header {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;
        h3 { font-size: 1.125rem; font-weight: 700; color: #1e293b; }
        .btn-close { border: none; background: transparent; font-size: 1.5rem; color: #94a3b8; cursor: pointer; }
      }
    }

    .editor-form {
      display: flex; flex-direction: column; gap: 1.25rem;
      .form-group {
        display: flex; flex-direction: column; gap: 0.5rem;
        label { font-size: 0.875rem; font-weight: 600; color: #475569; }
        input, select, textarea {
          padding: 0.625rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem;
          &:focus { outline: none; border-color: #3b82f6; }
        }
      }
      .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      .form-section {
        border-top: 1px solid #f1f5f9; padding-top: 1rem; margin-top: 0.5rem;
        h4 { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.05em; }
      }
      .form-actions { display: flex; gap: 0.75rem; margin-top: 1rem; button { flex: 1; } }
    }

    .actions-group { display: flex; justify-content: flex-end; gap: 0.5rem; }
    .btn-icon {
      width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      &:hover { background: #f8fafc; color: #1e293b; }
      &.delete:hover { border-color: #fecaca; background: #fee2e2; color: #dc2626; }
    }

    .text-right { text-align: right; }
    .btn-outline { border: 1px solid #e2e8f0; background: white; color: #475569; padding: 0.625rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .btn-primary { background: #1e293b; color: white; border: none; padding: 0.625rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
  `]
})
export class EventManagerComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);
  private fb = inject(FormBuilder);

  events = this.state.events;
  isLoading = this.state.isLoading;
  isEditorOpen = signal(false);
  editingEvent = signal<Event | null>(null);

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    type: ['conference', [Validators.required]],
    status: ['upcoming', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    city: ['', [Validators.required]],
    country: ['', [Validators.required]],
    venue: ['', [Validators.required]],
    description: ['']
  });

  ngOnInit(): void {}

  openEditor(event?: Event) {
    this.isEditorOpen.set(true);
    if (event) {
      this.editingEvent.set(event);
      this.eventForm.patchValue({
        title: event.title,
        type: event.type,
        status: event.status,
        startDate: event.startDate.split('T')[0],
        endDate: event.endDate.split('T')[0],
        city: event.location.city,
        country: event.location.country,
        venue: event.location.venue,
        description: event.description
      });
    } else {
      this.editingEvent.set(null);
      this.eventForm.reset({ type: 'conference', status: 'upcoming' });
    }
  }

  closeEditor() {
    this.isEditorOpen.set(false);
    this.editingEvent.set(null);
  }

  onSubmit() {
    if (this.eventForm.invalid) return;
    
    const formVal = this.eventForm.value;
    const eventData: Partial<Event> = {
      title: formVal.title,
      type: formVal.type,
      status: formVal.status,
      startDate: new Date(formVal.startDate).toISOString(),
      endDate: new Date(formVal.endDate).toISOString(),
      location: {
        city: formVal.city,
        country: formVal.country,
        venue: formVal.venue,
        isOnline: false
      },
      description: formVal.description
    };

    if (this.editingEvent()) {
      this.store.updateEvent(this.editingEvent()!.id, eventData).subscribe(() => {
        this.closeEditor();
      });
    } else {
      this.store.createEvent(eventData).subscribe(() => {
        this.closeEditor();
      });
    }
  }

  onDelete(event: Event) {
    if (confirm(`Supprimer l'événement "${event.title}" ?`)) {
      this.store.deleteEvent(event.id).subscribe();
    }
  }
}
