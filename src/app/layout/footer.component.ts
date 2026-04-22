import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, BookOpen, Twitter, Linkedin, Instagram, Globe } from 'lucide-angular';
import { GlobalStateService } from '../core/services/global-state.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <!-- Main Footer -->
    <footer class="footer">
      <div class="footer-container">
        <!-- Footer Grid -->
        <div class="footer-grid">
          <!-- Column 1: Brand -->
          <div class="footer-column brand-col">
            <a routerLink="/" class="footer-logo">
              <div class="logo-box">
                 <lucide-icon name="book-open" size="18"></lucide-icon>
              </div>
              <span class="logo-text">{{ s()?.site_name || 'Mamilo Insights' }}</span>
            </a>
            <p class="footer-description">
              {{ s()?.site_description || 'Explorer l\\'esprit à travers les savoirs, la recherche, et les perspectives intellectuelles contemporaines.' }}
            </p>
            <div class="social-links">
              <a [href]="u()?.social?.twitter" *ngIf="u()?.social?.twitter" class="social-link" title="Twitter/X">
                <lucide-icon name="twitter" size="18"></lucide-icon>
              </a>
              <a [href]="u()?.social?.linkedin" *ngIf="u()?.social?.linkedin" class="social-link" title="LinkedIn">
                <lucide-icon name="linkedin" size="18"></lucide-icon>
              </a>
              <a [href]="u()?.social?.researchgate" *ngIf="u()?.social?.researchgate" class="social-link" title="ResearchGate">
                <lucide-icon name="globe" size="18"></lucide-icon>
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div class="footer-column links-col">
            <h4 class="footer-title">Quick Links</h4>
            <ul class="footer-links">
              <li><a routerLink="/" class="link-item">Accueil</a></li>
              <li><a routerLink="/articles" class="link-item">Articles</a></li>
              <li><a routerLink="/events" class="link-item">Évènements</a></li>
              <li><a routerLink="/about" class="link-item">À Propos</a></li>
              <li><a routerLink="/contact" class="link-item">Contact</a></li>
            </ul>
          </div>

          <!-- Column 3: Newsletter -->
          <div class="footer-column newsletter-col">
            <h4 class="footer-title">Newsletter</h4>
            <p class="newsletter-text">
              Recevez directement dans votre boîte de réception les informations stratégiques et les nouvelles du monde intellectuel.
            </p>
            <div class="newsletter-form">
              <input type="email" placeholder="Votre email" class="newsletter-input">
              <button class="newsletter-btn">S'abonner</button>
            </div>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div class="footer-bottom">
          <div class="copyright">
            © {{ currentYear }} {{ s()?.site_name || 'Mamilo Insights' }}. Tous les droits réservés.
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  private state = inject(GlobalStateService);
  
  s = this.state.settings;
  u = this.state.user;
  currentYear = new Date().getFullYear();
}
