import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Search, Menu, X, BookOpen, Twitter, Linkedin, Github, User } from 'lucide-angular';
import { GlobalStateService } from '../core/services/global-state.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <header class="navbar" [class.scrolled]="isScrolled">
      <div class="nav-container">
        <!-- Logo -->
        <a routerLink="/" class="logo-area">
          <div class="logo-box">
             <lucide-icon name="book-open" size="18"></lucide-icon>
          </div>
          <span class="logo-text">{{ s()?.siteName || 'Mamilo Insights' }}</span>
        </a>

        <!-- Desktop Nav -->
        <nav class="desktop-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Accueil</a>
          <a routerLink="/articles" routerLinkActive="active" class="nav-link">Articles</a>
          <a routerLink="/events" routerLinkActive="active" class="nav-link">Évènements</a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">À Propos</a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>
        </nav>

        <!-- Actions -->
        <div class="actions-area">
          <button class="search-icon" title="Rechercher">
            <lucide-icon name="search" size="18"></lucide-icon>
          </button>
          
          <ng-container *ngIf="isAuthenticated(); else subscribeTpl">
            <a routerLink="/admin" class="btn-admin" title="Tableau de bord admin">
              <lucide-icon name="user" size="18"></lucide-icon>
              <span>Admin</span>
            </a>
          </ng-container>

          <ng-template #subscribeTpl>
            <a routerLink="/contact" class="btn-subscribe">
              S'abonner
            </a>
          </ng-template>

          <!-- Mobile Toggle -->
          <button (click)="isMenuOpen = !isMenuOpen" class="mobile-toggle">
            <lucide-icon [name]="isMenuOpen ? 'x' : 'menu'" size="28"></lucide-icon>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="isMenuOpen">
        <div class="mobile-header">
           <span>{{ s()?.siteName || 'Mamilo Insights' }}</span>
           <button (click)="isMenuOpen = false">
              <lucide-icon name="x" size="32"></lucide-icon>
           </button>
        </div>
        <nav>
          <a routerLink="/" (click)="isMenuOpen = false">Accueil</a>
          <a routerLink="/articles" (click)="isMenuOpen = false">Articles</a>
          <a routerLink="/events" (click)="isMenuOpen = false">Évènements</a>
          <a routerLink="/about" (click)="isMenuOpen = false">À Propos</a>
          <a routerLink="/contact" (click)="isMenuOpen = false">Contact</a>
          
          <a *ngIf="isAuthenticated()" routerLink="/admin" (click)="isMenuOpen = false" class="mobile-admin-link">Dashboard Admin</a>
          
          <a *ngIf="!isAuthenticated()" routerLink="/contact" (click)="isMenuOpen = false" class="btn-subscribe">
            S'abonner
          </a>
        </nav>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private state = inject(GlobalStateService);
  private authService = inject(AuthService);

  user = this.state.user;
  s = this.state.settings;
  isAuthenticated = this.state.isAuthenticated;
  isMenuOpen = false;
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  logout() {
    this.authService.logout();
  }
}
