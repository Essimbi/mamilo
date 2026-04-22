import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { Category } from '../../../core/models/category.model';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-category-manager',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule, SkeletonLoaderComponent],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Gestion des Catégories</h1>
          <p>Organisez vos articles par thématiques.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openEditor()">
            <lucide-icon name="plus" size="18"></lucide-icon>
            Ajouter une catégorie
          </button>
        </div>
      </header>

      <div class="manager-layout">
        <main class="categories-list card">
          <div class="table-container">
            <!-- Skeleton Loading -->
            <app-skeleton *ngIf="isLoading() && categories().length === 0" type="table" [count]="6"></app-skeleton>

            <table class="admin-table" *ngIf="!isLoading() || categories().length > 0">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Slug</th>
                  <th>Articles</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cat of categories()">
                  <td>
                    <span class="cat-name">{{ cat.name }}</span>
                  </td>
                  <td>
                    <code>{{ cat.slug }}</code>
                  </td>
                  <td>{{ cat.postCount || 0 }} articles</td>
                  <td class="text-right">
                    <div class="actions-group">
                      <button (click)="openEditor(cat)" class="btn-icon" title="Modifier">
                        <lucide-icon name="pencil" size="16"></lucide-icon>
                      </button>
                      <button (click)="onDelete(cat)" class="btn-icon delete" title="Supprimer">
                        <lucide-icon name="trash-2" size="16"></lucide-icon>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr *ngIf="categories().length === 0 && !isLoading()">
                  <td colspan="4" class="empty-state">Aucune catégorie enregistrée.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </main>

        <aside class="editor-sidebar card" *ngIf="isEditorOpen()">
          <div class="editor-header">
            <h3>{{ editingCategory() ? 'Modifier' : 'Nouvelle' }} Catégorie</h3>
            <button class="btn-close" (click)="closeEditor()">&times;</button>
          </div>

          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="editor-form">
            <div class="form-group">
              <label>Nom</label>
              <input type="text" formControlName="name" placeholder="Ex: Technologie">
            </div>

            <div class="form-group">
              <label>Slug</label>
              <input type="text" formControlName="slug" placeholder="technologie">
            </div>

            <div class="form-actions">
              <button type="button" class="btn-outline" (click)="closeEditor()">Annuler</button>
              <button type="submit" class="btn-primary" [disabled]="categoryForm.invalid">
                {{ editingCategory() ? 'Mettre à jour' : 'Enregistrer' }}
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
      grid-template-columns: 1fr 350px;
    }

    .categories-list { overflow: hidden; }

    .admin-table {
      width: 100%; border-collapse: collapse; text-align: left;
      th { padding: 1rem 1.5rem; font-weight: 600; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; }
      td { padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }
    }

    .cat-name { font-weight: 600; color: #1e293b; }

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
        input {
          padding: 0.625rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem;
          &:focus { outline: none; border-color: #3b82f6; }
        }
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
    code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; color: #475569; font-size: 0.85rem; }
  `],
})
export class CategoryManagerComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  isLoading = this.state.isLoading;
  categories = this.state.categories;
  isEditorOpen = signal(false);
  editingCategory = signal<Category | null>(null);

  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    slug: ['', [Validators.required]]
  });

  ngOnInit(): void {}

  openEditor(cat?: Category) {
    this.isEditorOpen.set(true);
    if (cat) {
      this.editingCategory.set(cat);
      this.categoryForm.patchValue({
        name: cat.name,
        slug: cat.slug
      });
    } else {
      this.editingCategory.set(null);
      this.categoryForm.reset();
    }
  }

  closeEditor() {
    this.isEditorOpen.set(false);
    this.editingCategory.set(null);
  }

  onSubmit() {
    if (this.categoryForm.invalid) return;
    
    const formVal = this.categoryForm.value;
    const catData: Partial<Category> = {
      name: formVal.name,
      slug: formVal.slug
    };

    if (this.editingCategory()) {
      this.store.updateCategory(this.editingCategory()!.id, catData).subscribe({
        next: () => {
          this.toast.success('Catégorie mise à jour');
          this.closeEditor();
        },
        error: () => this.toast.error('Erreur lors de la mise à jour')
      });
    } else {
      this.store.createCategory(catData).subscribe({
        next: () => {
          this.toast.success('Catégorie créée avec succès');
          this.closeEditor();
        },
        error: () => this.toast.error('Erreur lors de la création')
      });
    }
  }

  onDelete(cat: Category) {
    if (confirm(`Supprimer la catégorie "${cat.name}" ?`)) {
      this.store.deleteCategory(cat.id).subscribe({
        next: () => this.toast.success('Catégorie supprimée'),
        error: () => this.toast.error('Erreur lors de la suppression')
      });
    }
  }
}
