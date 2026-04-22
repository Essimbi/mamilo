import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScrollRevealDirective } from '../directives/scroll-reveal.directive';
import { LucideAngularModule } from 'lucide-angular';
import { IContentService } from '../../core/services/content.interface';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ScrollRevealDirective, LucideAngularModule],
  template: `
    <section class="newsletter-section" appScrollReveal>
        <div class="newsletter-inner">
            <div class="newsletter-content">
                <h2>Rejoignez le réseau intellectuel</h2>
                <p>
                    Abonnez-vous pour recevoir chaque mois des résumés des nouvelles
                    recherches, des enregistrements d'événements et des recommandations
                    de livres directement du Dr Mamilo.
                </p>
            </div>
            <div class="newsletter-action-area">
                <ng-container *ngIf="!submitted(); else successTpl">
                    <form class="newsletter-form" (ngSubmit)="onSubmit()">
                        <input 
                            type="email" 
                            name="email"
                            [(ngModel)]="email" 
                            required 
                            email
                            placeholder="Entrez votre email académique" 
                            class="newsletter-input" 
                        />
                        <button type="submit" class="btn-newsletter" [disabled]="!email || isLoading()">
                            {{ isLoading() ? 'Envoi...' : 'Rejoindre' }}
                        </button>
                    </form>
                    <p *ngIf="errorMessage()" class="error-text text-red-500 text-xs mt-2">{{ errorMessage() }}</p>
                    <p class="newsletter-privacy">
                        Nous respectons votre vie privée. Votre adresse ne sera jamais communiquée à des tiers.
                    </p>
                </ng-container>
                <ng-template #successTpl>
                    <div class="success-message" appScrollReveal>
                        <lucide-icon name="check" size="24"></lucide-icon>
                        <span>Merci ! Vous êtes bien inscrit à la newsletter académique.</span>
                    </div>
                </ng-template>
            </div>
        </div>
    </section>
  `,
  styles: [`
    .newsletter-section {
        display: block;
        background-color: #1B3A6B !important;
        color: #ffffff !important;
        padding: 5rem 0;
        margin: 4rem 0 0 0; /* Align with bottom of previous section */
        border-radius: 0 !important; /* Removed rounded borders */
        overflow: hidden;
        position: relative;
        z-index: 10;
        width: 100%;
    }

    .newsletter-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.5rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4rem;
        align-items: center;
    }

    @media (max-width: 768px) {
        .newsletter-inner {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
        }
    }

    .newsletter-content h2 {
        color: #ffffff !important;
        font-family: inherit;
        font-size: 2.25rem;
        font-weight: 850;
        margin-bottom: 1.5rem;
        line-height: 1.2;
    }

    .newsletter-content p {
        color: rgba(255, 255, 255, 0.9) !important;
        font-size: 1.0625rem;
        line-height: 1.6;
    }

    .newsletter-form {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    @media (max-width: 768px) {
        .newsletter-form {
            flex-direction: column;
        }
    }

    .newsletter-input {
        flex: 1;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        color: #ffffff;
        font-size: 0.9375rem;
    }

    .newsletter-input::placeholder {
        color: rgba(255, 255, 255, 0.5);
    }

    .newsletter-input:focus {
        outline: none;
        border-color: #ffffff;
        background-color: rgba(255, 255, 255, 0.2);
    }

    .btn-newsletter {
        background-color: #ffffff;
        color: #1B3A6B;
        border: none;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        font-weight: 800;
        font-size: 0.9375rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .btn-newsletter:hover:not(:disabled) {
        background-color: #e2e8f0;
        transform: translateY(-2px);
    }

    .btn-newsletter:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .newsletter-privacy {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
    }

    .success-message {
        display: flex;
        align-items: center;
        gap: 1rem;
        background-color: rgba(255, 255, 255, 0.1);
        color: #ffffff;
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-weight: 600;
    }
  `]
})
export class NewsletterComponent {
  private contentService = inject(IContentService);
  
  email = '';
  submitted = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  onSubmit() {
    if (this.email && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      
      this.contentService.subscribeNewsletter(this.email).subscribe({
        next: () => {
          this.submitted.set(true);
          this.email = '';
          this.isLoading.set(false);
        },
        error: (err: any) => {
          console.error('Newsletter error:', err);
          this.errorMessage.set(err.error?.message || "Une erreur est survenue lors de l'inscription.");
          this.isLoading.set(false);
        }
      });
    }
  }
}
