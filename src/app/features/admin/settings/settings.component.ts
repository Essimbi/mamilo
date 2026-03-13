import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { ContentStore } from '../../../core/services/content-store.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MOCK_USER } from '../../../mock-data/data/users.mock';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Paramètres & Profil</h1>
          <p>Gérez votre identité numérique et les configurations globales de la plateforme.</p>
        </div>
      </header>

      <div class="settings-grid">
        <!-- Profile Section -->
        <div class="settings-card card">
          <div class="card-header">
            <lucide-icon name="user" size="20"></lucide-icon>
            <h2>Profil de l'Auteur</h2>
          </div>
          
          <form [formGroup]="profileForm" class="settings-form">
            <div class="profile-header">
              <div class="avatar-upload">
                <img [src]="u()?.avatar?.url" alt="Avatar" *ngIf="u()">
                <button type="button" class="btn-avatar-edit">
                  <lucide-icon name="camera" size="14"></lucide-icon>
                </button>
              </div>
              <div class="profile-intro">
                <h3>{{ profileForm.get('name')?.value }}</h3>
                <p>Administrateur Principal</p>
              </div>
            </div>

            <div class="form-group">
              <label>Nom Complet</label>
              <input type="text" formControlName="name">
            </div>

            <div class="form-group">
              <label>Email Professionnel</label>
              <input type="email" formControlName="email">
            </div>

            <div class="form-group">
              <label>Biographie</label>
              <textarea formControlName="bio" rows="4"></textarea>
            </div>

            <div class="form-section">
              <h4>Réseaux Sociaux</h4>
              <div class="form-group">
                <label>LinkedIn</label>
                <div class="input-with-icon">
                  <lucide-icon name="linkedin" size="16"></lucide-icon>
                  <input type="text" formControlName="linkedin">
                </div>
              </div>
              <div class="form-group">
                <label>ResearchGate</label>
                <div class="input-with-icon">
                  <lucide-icon name="globe" size="16"></lucide-icon>
                  <input type="text" formControlName="researchgate">
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">Enregistrer les modifications</button>
            </div>
          </form>
        </div>

        <!-- Site Settings -->
        <div class="settings-card card">
          <div class="card-header">
            <lucide-icon name="settings" size="20"></lucide-icon>
            <h2>Configuration du Site</h2>
          </div>

          <form [formGroup]="settingsForm" (ngSubmit)="onUpdateSite()" class="settings-form">
            <div class="form-group">
              <label>Nom du Site</label>
              <input type="text" formControlName="siteName">
            </div>

            <div class="form-group">
              <label>Description SEO (Meta)</label>
              <textarea rows="3" formControlName="siteDescription"></textarea>
            </div>

            <div class="form-group">
              <label>Mots-clés par défaut (séparez par virgule)</label>
              <input type="text" formControlName="keywords">
            </div>

            <div class="form-section">
              <h4>Notifications</h4>
              <div class="toggle-group">
                <div class="toggle-item">
                  <span>Nouveaux commentaires</span>
                  <input type="checkbox" formControlName="comments">
                </div>
                <div class="toggle-item">
                  <span>Inscriptions Newsletter</span>
                  <input type="checkbox" formControlName="newsletter">
                </div>
              </div>
            </div>

             <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="settingsForm.invalid">Mettre à jour le site</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use '../../../styles/abstracts/variables' as *;

    .admin-page { padding: 2rem; }
    .page-header { margin-bottom: 2rem; h1 { font-size: 1.875rem; font-weight: 700; color: #1e293b; } p { color: #64748b; } }

    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;
      @media (max-width: 1024px) { grid-template-columns: 1fr; }
    }

    .card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
    .card-header { padding: 1.25rem 1.5rem; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 0.75rem;
      h2 { font-size: 1rem; font-weight: 700; color: #1e293b; }
      lucide-icon { color: #64748b; }
    }

    .settings-form { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

    .profile-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 0.5rem;
      .avatar-upload { position: relative; width: 64px; height: 64px;
        img { width: 100%; height: 100%; border-radius: 12px; object-fit: cover; }
        .btn-avatar-edit { position: absolute; bottom: -6px; right: -6px; width: 24px; height: 24px; border-radius: 6px; background: #3b82f6; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
      }
      .profile-intro { h3 { font-size: 1.125rem; font-weight: 700; color: #1e293b; } p { font-size: 0.875rem; color: #64748b; } }
    }

    .form-group { display: flex; flex-direction: column; gap: 0.5rem;
      label { font-size: 0.875rem; font-weight: 600; color: #475569; }
      input, select, textarea { padding: 0.625rem 0.875rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.95rem; &:focus { outline: none; border-color: #3b82f6; } }
    }

    .input-with-icon { position: relative;
      lucide-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
      input { width: 100%; padding-left: 2.25rem; }
    }

    .form-section { border-top: 1px solid #f1f5f9; padding-top: 1rem; margin-top: 0.5rem;
      h4 { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 1rem; letter-spacing: 0.05em; }
    }

    .toggle-group { display: flex; flex-direction: column; gap: 1rem; }
    .toggle-item { display: flex; justify-content: space-between; align-items: center; span { font-size: 0.95rem; color: #1e293b; } }

    .form-actions { margin-top: 0.5rem; }
    .btn-primary { background: #1e293b; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%; transition: opacity 0.2s; &:hover { opacity: 0.9; } }
  `]
})
export class SettingsComponent implements OnInit {
  private state = inject(GlobalStateService);
  private store = inject(ContentStore);
  private fb = inject(FormBuilder);
  
  u = this.state.user;
  s = this.state.settings;

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    bio: [''],
    linkedin: [''],
    twitter: [''],
    researchgate: ['']
  });

  settingsForm: FormGroup = this.fb.group({
    siteName: ['', [Validators.required]],
    siteDescription: [''],
    keywords: [''],
    comments: [true],
    newsletter: [true]
  });

  ngOnInit(): void {
    // Patch Profile
    const currentUser = this.u();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name,
        email: currentUser.email,
        bio: currentUser.bio,
        linkedin: currentUser.social.linkedin,
        twitter: currentUser.social.twitter,
        researchgate: currentUser.social.researchgate
      });
    }

    // Patch Settings
    const settings = this.s();
    if (settings) {
      this.patchSettings(settings);
    }
  }

  private patchSettings(settings: any) {
    this.settingsForm.patchValue({
      siteName: settings.siteName,
      siteDescription: settings.siteDescription,
      keywords: settings.keywords.join(', '),
      comments: settings.notifications.comments,
      newsletter: settings.notifications.newsletter
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;
    
    const formVal = this.profileForm.value;
    this.store.updateProfile({
      name: formVal.name,
      email: formVal.email,
      bio: formVal.bio,
      social: {
        linkedin: formVal.linkedin,
        twitter: formVal.twitter,
        researchgate: formVal.researchgate
      }
    }).subscribe(() => {
      alert('Profil mis à jour avec succès');
    });
  }

  onUpdateSite() {
    if (this.settingsForm.invalid) return;

    const val = this.settingsForm.value;
    this.store.updateSettings({
      siteName: val.siteName,
      siteDescription: val.siteDescription,
      keywords: val.keywords.split(',').map((k: string) => k.trim()),
      notifications: {
        comments: val.comments,
        newsletter: val.newsletter
      }
    }).subscribe(() => {
      alert('Paramètres du site mis à jour');
    });
  }
}
