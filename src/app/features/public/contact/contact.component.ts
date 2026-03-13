import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Globe, Clock, Phone, MapPin, ArrowRight, ChevronRight } from 'lucide-angular';
import { SeoService } from '../../../core/services/seo.service';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
    <div class="contact-page">
      <!-- 1. HERO SECTION -->
      <header class="contact-hero">
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
          <div class="contact-column-left">
            <div class="form-wrapper">
              <h3>Formulaire de demande</h3>
              <p class="form-desc">Veuillez utiliser le formulaire ci-dessous pour les collaborations académiques, les interventions publiques ou les demandes de renseignements des étudiants.</p>
              
              <form class="contact-form" (submit)="$event.preventDefault()">
                <div class="form-row">
                  <div class="form-group">
                    <label>Nom et prénom</label>
                    <input type="text" placeholder="John Doe">
                  </div>
                  <div class="form-group">
                    <label>Adresse email</label>
                    <input type="email" placeholder="j.doe@university.edu">
                  </div>
                </div>
                
                <div class="form-group">
                  <label>Sujet</label>
                  <input type="text" placeholder="Collaboration académique / Recherche orale">
                </div>
                
                <div class="form-group">
                  <label>Votre message</label>
                  <textarea placeholder="Description détaillée de votre demande..."></textarea>
                </div>
                
                <button type="submit" class="btn-submit">
                  Soumettre
                  <lucide-icon name="arrow-right" size="18"></lucide-icon>
                </button>
              </form>
            </div>
            
            <div class="response-norms">
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
          <div class="contact-column-right">
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
            
            <div class="location-section">
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
      <section class="newsletter-footer">
        <div class="container center-content">
          <h2>Restez informé grâce aux analyses</h2>
          <p>Rejoignez le réseau académique pour recevoir des résumés trimestriels des découvertes scientifiques et des séminaires à venir.</p>
          
          <div class="newsletter-form-inline">
            <input type="email" placeholder="Entrez votre email">
            <button class="btn-subscribe">S'abonner</button>
          </div>
        </div>
      </section>
    </div>
  `,
    styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {
    private seoService = inject(SeoService);

    ngOnInit(): void {
        this.seoService.updateTitle('Contact & Collaboration');
    }
}
