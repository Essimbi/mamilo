import { Component, HostListener, inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Search, Menu, X, BookOpen, Twitter, Linkedin, Github, User } from 'lucide-angular';
import { GlobalStateService } from '../core/services/global-state.service';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule],
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
          <div class="search-container" [class.active]="isSearchOpen">
            <input 
              #searchInput
              type="text" 
              [(ngModel)]="searchQuery" 
              (keyup.enter)="onSearch()"
              placeholder="Rechercher des articles..."
              class="search-input"
            />
            <button class="search-icon" (click)="toggleSearch()" [title]="isSearchOpen ? 'Fermer' : 'Rechercher'">
              <lucide-icon [name]="isSearchOpen ? 'x' : 'search'" size="18"></lucide-icon>
            </button>
          </div>
          
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

      <!-- Mobile Menu Overlay -->
      <div class="mobile-overlay" [class.active]="isMenuOpen" (click)="isMenuOpen = false"></div>

      <!-- Mobile Menu Drawer -->
      <div class="mobile-drawer" [class.open]="isMenuOpen">
        <div class="drawer-header">
           <a routerLink="/" (click)="isMenuOpen = false" class="drawer-logo">
             <div class="logo-box">
                <lucide-icon name="book-open" size="16"></lucide-icon>
             </div>
             <span>{{ s()?.siteName || 'Mamilo Insights' }}</span>
           </a>
           <button class="close-btn" (click)="isMenuOpen = false">
              <lucide-icon name="x" size="24"></lucide-icon>
           </button>
        </div>

        <nav class="drawer-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="isMenuOpen = false">
            <span class="nav-num">01.</span> Accueil
          </a>
          <a routerLink="/articles" routerLinkActive="active" (click)="isMenuOpen = false">
            <span class="nav-num">02.</span> Articles
          </a>
          <a routerLink="/events" routerLinkActive="active" (click)="isMenuOpen = false">
            <span class="nav-num">03.</span> Évènements
          </a>
          <a routerLink="/about" routerLinkActive="active" (click)="isMenuOpen = false">
            <span class="nav-num">04.</span> À Propos
          </a>
          <a routerLink="/contact" routerLinkActive="active" (click)="isMenuOpen = false">
            <span class="nav-num">05.</span> Contact
          </a>
        </nav>

        <div class="drawer-footer">
          <div class="drawer-actions">
            <a *ngIf="isAuthenticated()" routerLink="/admin" (click)="isMenuOpen = false" class="btn-admin-mobile">
              <lucide-icon name="user" size="18"></lucide-icon>
              Tableau de bord
            </a>
            
            <a routerLink="/contact" (click)="isMenuOpen = false" class="btn-subscribe-mobile">
              S'abonner à l'édito
            </a>
          </div>

          <div class="drawer-socials">
            <a *ngIf="author()?.social?.twitter" [href]="author()?.social?.twitter" target="_blank" class="social-link"><lucide-icon name="twitter" size="18"></lucide-icon></a>
            <a *ngIf="author()?.social?.linkedin" [href]="author()?.social?.linkedin" target="_blank" class="social-link"><lucide-icon name="linkedin" size="18"></lucide-icon></a>
            <a *ngIf="author()?.social?.researchgate" [href]="author()?.social?.researchgate" target="_blank" class="social-link"><lucide-icon name="book-open" size="18"></lucide-icon></a>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private state = inject(GlobalStateService);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  author = this.state.user;
  s = this.state.settings;
  isAuthenticated = this.state.isAuthenticated;
  isMenuOpen = false;
  isSearchOpen = false;
  searchQuery = '';
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 20;
    }
  }

  logout() {
    this.authService.logout();
  }

  toggleSearch() {
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) {
      setTimeout(() => {
        this.searchInput.nativeElement.focus();
      }, 100);
    } else {
      this.searchQuery = '';
    }
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/articles'], { 
        queryParams: { search: this.searchQuery.trim() } 
      });
      this.isSearchOpen = false;
      this.searchQuery = '';
    }
  }
}
