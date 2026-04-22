import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MediaPickerComponent } from '../../../shared/components/media-picker.component';
import { MediaAsset } from '../../../core/models/user.model';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule, MediaPickerComponent, SkeletonLoaderComponent],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1>{{ activeTab() === 'profile' ? 'Mon Profil' : 'Paramètres du Site' }}</h1>
          <p>{{ activeTab() === 'profile' ? 'Gérez vos informations personnelles et votre identité.' : 'Configurez les paramètres globaux de la plateforme.' }}</p>
        </div>
      </header>

      <div class="tabs-nav">
        <button class="tab-item" [class.active]="activeTab() === 'profile'" (click)="activeTab.set('profile')">
          <lucide-icon name="user" size="18"></lucide-icon>
          <span>Profil</span>
        </button>
        <button class="tab-item" [class.active]="activeTab() === 'settings'" (click)="activeTab.set('settings')">
          <lucide-icon name="settings" size="18"></lucide-icon>
          <span>Paramètres Site</span>
        </button>
      </div>

      <div class="settings-container">
        <!-- Section Profil -->
        <div class="settings-card" *ngIf="activeTab() === 'profile'">
          <div class="card-header">
            <h3>Informations de base</h3>
            <p>Ces informations seront visibles sur vos articles et votre page à propos.</p>
          </div>
          
          <div class="form-body" *ngIf="isLoading() && !u()">
            <app-skeleton type="form" [count]="1"></app-skeleton>
          </div>
          
          <form *ngIf="!isLoading() || u()" [formGroup]="profileForm" (ngSubmit)="onUpdateProfile()" class="form-body">
            <div class="avatar-section">
              <div class="avatar-box" (click)="isMediaPickerOpen.set(true)">
                <img [src]="u()?.avatar?.url || '/hero-mamilo.png'" alt="Avatar">
                <div class="avatar-overlay">
                  <lucide-icon name="plus" size="20"></lucide-icon>
                </div>
              </div>
              <div class="avatar-info">
                <h4>Avatar du profil</h4>
                <p>Sélectionnez une image de la médiathèque ou téléversez-en une.</p>
                <button type="button" class="btn-picker-small" (click)="isMediaPickerOpen.set(true)">
                   Choisir une image
                </button>
                <input type="hidden" formControlName="avatar_id">
                <span class="error-msg" *ngIf="profileErrors()?.avatar_id">{{ profileErrors().avatar_id[0] }}</span>
              </div>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>Nom Complet</label>
                <input type="text" formControlName="name" placeholder="Ex: Christian Mamilo">
                <span class="error-msg" *ngIf="profileErrors()?.name">{{ profileErrors().name[0] }}</span>
              </div>

              <div class="form-group">
                <label>Email (Lecture seule)</label>
                <input type="email" [value]="u()?.email" readonly class="readonly-field">
              </div>

              <div class="form-group full-width">
                <label>Biographie</label>
                <textarea formControlName="bio" rows="5" placeholder="Décrivez votre expertise..."></textarea>
                <span class="error-msg" *ngIf="profileErrors()?.bio">{{ profileErrors().bio[0] }}</span>
              </div>
            </div>

            <div class="form-footer">
              <button type="submit" class="btn-save" [disabled]="profileForm.invalid || profileForm.pristine">
                Enregistrer le profil
              </button>
            </div>
          </form>
        </div>

        <!-- Section Paramètres Site -->
        <div class="settings-card" *ngIf="activeTab() === 'settings'">
          <div class="card-header">
            <h3>Configuration Plateforme</h3>
            <p>Paramètres globaux pour l'identité visuelle et le SEO du site.</p>
          </div>

          <div class="form-body" *ngIf="isLoading() && !s()">
            <app-skeleton type="form" [count]="1"></app-skeleton>
          </div>

          <form *ngIf="!isLoading() || s()" [formGroup]="settingsForm" (ngSubmit)="onUpdateSettings()" class="form-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Nom du Site</label>
                <input type="text" formControlName="site_name">
                <span class="error-msg" *ngIf="siteErrors()?.site_name">{{ siteErrors().site_name[0] }}</span>
              </div>

              <div class="form-group">
                <label>Email de Contact</label>
                <input type="email" formControlName="contact_email">
                <span class="error-msg" *ngIf="siteErrors()?.contact_email">{{ siteErrors().contact_email[0] }}</span>
              </div>

              <div class="form-group full-width">
                <label>Description SEO (Meta)</label>
                <textarea formControlName="site_description" rows="3"></textarea>
                <span class="error-msg" *ngIf="siteErrors()?.site_description">{{ siteErrors().site_description[0] }}</span>
              </div>

              <div class="form-group full-width">
                <label>Réseaux Sociaux (URLs séparées par virgule)</label>
                <textarea formControlName="social_media" rows="2" placeholder="https://linkedin.com/in/..., https://twitter.com/..."></textarea>
                <span class="error-msg" *ngIf="siteErrors()?.social_media">{{ siteErrors().social_media[0] }}</span>
              </div>
            </div>

            <div class="form-footer">
              <button type="submit" class="btn-save" [disabled]="settingsForm.invalid || settingsForm.pristine">
                Sauvegarder les paramètres
              </button>
            </div>
          </form>
        </div>
      </div>

      <app-media-picker
        *ngIf="isMediaPickerOpen()"
        title="Sélectionner votre avatar"
        (select)="onAvatarSelected($event)"
        (close)="isMediaPickerOpen.set(false)">
      </app-media-picker>
    </div>
  `,
  styles: [`
    .admin-page { padding: 2rem; max-width: 1000px; margin: 0 auto; }
    .page-header { margin-bottom: 2rem; 
      h1 { font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem; }
      p { color: #64748b; font-size: 1.1rem; }
    }

    .tabs-nav { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: 1px solid #e2e8f0;
      .tab-item { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; border: none; background: none; cursor: pointer; color: #64748b; font-weight: 600; border-bottom: 3px solid transparent; transition: all 0.2s;
        &:hover { color: #0f172a; background: #f8fafc; }
        &.active { color: #3b82f6; border-bottom-color: #3b82f6; }
      }
    }

    .settings-card { background: white; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
    .card-header { padding: 1.5rem 2rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
      h3 { font-size: 1.25rem; font-weight: 700; color: #0f172a; }
      p { color: #64748b; font-size: 0.9rem; margin-top: 0.25rem; }
    }

    .form-body { padding: 2rem; }

    .avatar-section { display: flex; align-items: center; gap: 2rem; margin-bottom: 2.5rem;
      .avatar-box { position: relative; width: 100px; height: 100px; border-radius: 20px; overflow: hidden; border: 4px solid #f1f5f9;
        img { width: 100%; height: 100%; object-fit: cover; }
        .avatar-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; opacity: 0; transition: opacity 0.2s; cursor: pointer; }
        &:hover .avatar-overlay { opacity: 1; }
      }
      .avatar-info {
        h4 { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 0.25rem; }
        p { font-size: 0.85rem; color: #64748b; margin-bottom: 0.75rem; }
        .id-input { padding: 0.5rem 0.75rem; font-size: 0.8rem; background: #f1f5f9; border: none; border-radius: 6px; width: 300px; font-family: monospace; }
      }
    }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;
      .full-width { grid-column: span 2; }
    }

    .form-group { display: flex; flex-direction: column; gap: 0.5rem;
      label { font-size: 0.9rem; font-weight: 600; color: #334155; }
      input, textarea { padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.95rem; transition: all 0.2s;
        &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        &.readonly-field { background: #f1f5f9; cursor: not-allowed; color: #94a3b8; }
      }
    }

    .form-footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
    .btn-save { padding: 0.75rem 2rem; background: #0f172a; color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s;
      &:hover:not(:disabled) { background: #334155; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .error-msg { color: #ef4444; font-size: 0.8rem; font-weight: 500; }

    .btn-picker-small {
       margin-top: 0.5rem;
       padding: 0.5rem 1rem;
       background: white;
       border: 1px solid #e2e8f0;
       border-radius: 8px;
       font-size: 0.85rem;
       font-weight: 600;
       color: #475569;
       cursor: pointer;
       transition: all 0.2s;
       &:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
    }
  `]
})
export class SettingsComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  
  u = this.state.user;
  s = this.state.settings;
  isLoading = this.state.isLoading;
  activeTab = signal<'profile' | 'settings'>('profile');
  isMediaPickerOpen = signal(false);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    bio: [''],
    avatar_id: ['']
  });

  settingsForm: FormGroup = this.fb.group({
    site_name: ['', [Validators.required, Validators.maxLength(255)]],
    site_description: ['', [Validators.maxLength(1000)]],
    contact_email: ['', [Validators.required, Validators.email]],
    social_media: ['']
  });

  siteErrors = signal<any>(null);
  profileErrors = signal<any>(null);

  ngOnInit(): void {
    if (this.u()) this.patchProfile(this.u());
    if (this.s()) this.patchSettings(this.s());
  }

  private patchProfile(user: any) {
    this.profileForm.patchValue({
      name: user.name,
      bio: user.bio,
      avatar_id: user.avatar_id || ''
    });
  }

  private patchSettings(settings: any) {
    this.settingsForm.patchValue({
      site_name: settings.site_name,
      site_description: settings.site_description,
      contact_email: settings.contact_email,
      social_media: (settings.social_media || []).join(', ')
    });
  }

  onAvatarSelected(asset: MediaAsset) {
    this.profileForm.patchValue({ avatar_id: asset.id });
    // Optimistic UI update
    if (this.u()) {
      this.state.setUser({ 
        ...this.u()!, 
        avatar: asset 
      } as any);
    }
    this.profileForm.markAsDirty();
  }

  onUpdateProfile() {
    if (this.profileForm.invalid) return;
    this.profileErrors.set(null);
    
    this.store.updateProfile(this.profileForm.value).subscribe({
      next: () => this.toast.success('Votre profil a été mis à jour avec succès'),
      error: (err) => {
        if (err.status === 422) {
          this.profileErrors.set(err.error.errors);
          this.toast.error('Veuillez corriger les erreurs dans le formulaire');
        } else {
          this.toast.error('Impossible de mettre à jour le profil');
        }
      }
    });
  }

  onUpdateSettings() {
    if (this.settingsForm.invalid) return;
    this.siteErrors.set(null);

    const val = this.settingsForm.value;
    const payload = {
      site_name: val.site_name,
      site_description: val.site_description,
      contact_email: val.contact_email,
      social_media: val.social_media ? val.social_media.split(',').map((u: string) => u.trim()).filter((u: string) => u !== '') : []
    };

    this.store.updateSettings(payload).subscribe({
      next: () => this.toast.success('Les paramètres du site ont été enregistrés avec succès'),
      error: (err) => {
        if (err.status === 422) {
          this.siteErrors.set(err.error.errors);
          this.toast.error('Veuillez corriger les erreurs de configuration');
        } else {
          this.toast.error('Une erreur est survenue lors de la sauvegarde');
        }
      }
    });
  }
}
