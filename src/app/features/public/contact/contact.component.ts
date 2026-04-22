import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { SeoService } from '../../../core/services/seo.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';
import { NewsletterComponent } from '../../../shared/components/newsletter.component';
import { IContentService } from '../../../core/services/content.interface';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, ScrollRevealDirective, NewsletterComponent],
    template: `
    <div class="contact-page">
      <!-- 1. HERO SECTION -->
      <header class="contact-hero" appScrollReveal>
        <div class="container">
          <h1>Se connecter pour <span>collaborer</span></h1>
          <p class="hero-subtitle">
            Que vous soyez étudiant en quête de conseils, chercheur intéressé par une 
            collaboration ou organisateur d'événement, je suis ouvert à toute 
            communication professionnelle.
          </p>
        </div>
      </header>

      <!-- 2. MAIN CONTENT -->
      <section class="contact-main">
        <div class="container contact-grid">
          
          <!-- LEFT COLUMN: FORM -->
          <div class="contact-column-left" appScrollReveal [delay]="200">
            <div class="form-wrapper" [class.is-submitted]="submitted()">
              <ng-container *ngIf="!submitted(); else successMessage">
                <h3>Formulaire de demande</h3>
                <p class="form-desc">Veuillez utiliser le formulaire ci-dessous pour les collaborations académiques, les interventions publiques ou les demandes de renseignements des étudiants.</p>
                
                <form class="contact-form" [formGroup]="contactForm" (ngSubmit)="onSubmit()">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Nom et prénom</label>
                      <input type="text" formControlName="name" placeholder="John Doe" [class.error]="isFieldInvalid('name')">
                    </div>
                    <div class="form-group">
                      <label>Adresse email</label>
                      <input type="email" formControlName="email" placeholder="j.doe@university.edu" [class.error]="isFieldInvalid('email')">
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label>Sujet</label>
                    <input type="text" formControlName="subject" placeholder="Collaboration académique / Recherche orale" [class.error]="isFieldInvalid('subject')">
                  </div>
                  
                  <div class="form-group">
                    <label>Votre message</label>
                    <textarea formControlName="message" placeholder="Description détaillée de votre demande..." [class.error]="isFieldInvalid('message')"></textarea>
                  </div>
                  
                  <button type="submit" class="btn-submit" [disabled]="contactForm.invalid || isLoading()">
                    {{ isLoading() ? 'Envoi en cours...' : 'Soumettre' }}
                    <lucide-icon *ngIf="!isLoading()" name="arrow-right" size="18"></lucide-icon>
                  </button>
                </form>
              </ng-container>

              <ng-template #successMessage>
                <div class="success-state" appScrollReveal>
                  <div class="success-icon">
                    <lucide-icon name="check" size="48"></lucide-icon>
                  </div>
                  <h3>Message envoyé avec succès</h3>
                  <p>Merci pour votre intérêt. Je reviendrai vers vous dans les meilleurs délais selon les normes de réponse indiquées.</p>
                  <button class="btn-primary" (click)="resetForm()">Envoyer un autre message</button>
                </div>
              </ng-template>
            </div>
            
            <div class="response-norms" appScrollReveal [delay]="400">
              <div class="norms-header">
                <lucide-icon name="mail" size="18"></lucide-icon>
                <h3>Normes de réponse</h3>
              </div>
              <ul>
                <li>Les questions d'ordre académique sont traitées du lundi au jeudi.</li>
                <li>Pour les demandes urgentes des médias, veuillez utiliser l'objet.</li>
                <li>Les heures de permanence des étudiants se font uniquement sur rendez-vous.</li>
              </ul>
            </div>
          </div>
          
          <!-- RIGHT COLUMN: INFO -->
          <div class="contact-column-right" appScrollReveal [delay]="300">
            <div class="info-section">
              <h3>Portée directe</h3>
              
              <div class="info-list">
                <div class="info-item">
                  <div class="info-icon">
                    <lucide-icon name="mail" size="18"></lucide-icon>
                  </div>
                  <div class="info-content">
                    <div class="info-label-row">
                      <span class="info-title">E-mail</span>
                      <span class="badge-pref">Préféré</span>
                    </div>
                    <p class="info-value">a.jameson@metropolis.edu</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <lucide-icon name="globe" size="18"></lucide-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-title">University Affiliation</span>
                    <p class="info-value">Department of Modern Communication <br> Metropolis State University</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <lucide-icon name="clock" size="18"></lucide-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-title">Heures de bureau</span>
                    <p class="info-value">Lundi: 14:00 – 16:00 <br> Samedi: 10:00 – 12:00</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <div class="info-icon">
                    <lucide-icon name="phone" size="18"></lucide-icon>
                  </div>
                  <div class="info-content">
                    <span class="info-title">Department Office</span>
                    <p class="info-value">+1 (555) 012-3456</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="location-section" appScrollReveal [delay]="450">
              <h3>Emplacement du campus</h3>
              <div class="map-placeholder">
                <div class="map-card">
                  <lucide-icon name="map-pin" size="24" class="pin-icon"></lucide-icon>
                  <div class="map-info">
                    <strong>Faculty of Communications</strong>
                    <p>Building B, Level 4, Room 402 <br> Metropolis State University</p>
                  </div>
                </div>
                <div class="map-footer">
                  METROPOLIS CAMPUS NORTH
                </div>
              </div>
              <div class="location-note">
                <lucide-icon name="map-pin" size="14"></lucide-icon>
                <span>Les visiteurs doivent s'enregistrer à la réception de la faculté, au rez-de-chaussée.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. NEWSLETTER SECTION -->
      <app-newsletter></app-newsletter>
    </div>
  `,
    styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
    private seoService = inject(SeoService);
    private fb = inject(FormBuilder);
    private contentService = inject(IContentService);
    private toastService = inject(ToastService);
    
    contactForm!: FormGroup;
    submitted = signal(false);
    isLoading = signal(false);

    ngOnInit(): void {
        this.seoService.updateTitle('Contact & Collaboration');
        this.initForm();
    }

    private initForm(): void {
        this.contactForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', [Validators.required]],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.contactForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit(): void {
        if (this.contactForm.valid && !this.isLoading()) {
            this.isLoading.set(true);
            this.contentService.sendContactMessage(this.contactForm.value).subscribe({
                next: () => {
                    this.submitted.set(true);
                    this.isLoading.set(false);
                    this.toastService.success('Votre message a été envoyé avec succès.');
                },
                error: (err) => {
                    console.error('Contact error:', err);
                    this.toastService.error(err.error?.message || "Une erreur est survenue lors de l'envoi du message.");
                    this.isLoading.set(false);
                }
            });
        }
    }

    resetForm(): void {
        this.contactForm.reset();
        this.submitted.set(false);
    }
}
