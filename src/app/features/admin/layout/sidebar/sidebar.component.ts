import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, LayoutGrid, FileText, Calendar, Image, Settings, LogOut } from 'lucide-angular';
import { AuthService } from '../../../../core/services/auth.service';
import { GlobalStateService } from '../../../../core/services/global-state.service';

// Re-using the same icons but explicitly for indexing
const ICONS = { LayoutGrid, FileText, Calendar, Image, Settings, LogOut };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
           <!-- Logo placeholder -->
           <div class="logo-circle"></div>
           <span class="logo-text">3CM Admin</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li *ngFor="let item of navItems">
            <a [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{exact: item.exact}">
              <lucide-icon [name]="item.icon" size="20"></lucide-icon>
              <span>{{ item.label }}</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer" *ngIf="user() as u">
        <div class="user-profile">
          <img [src]="u.avatar.url" [alt]="u.name" class="avatar">
          <div class="user-info">
            <span class="user-name">{{ u.name }}</span>
            <span class="user-role">Admin</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">
          <lucide-icon name="log-out" size="18"></lucide-icon>
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  `,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private authService = inject(AuthService);
  private state = inject(GlobalStateService);

  user = computed(() => this.state.user());
  navItems = [
    { path: '/admin', label: 'Tableau de bord', icon: 'layout-grid', exact: true },
    { path: '/admin/articles', label: 'Articles', icon: 'file-text', exact: false },
    { path: '/admin/events', label: 'Événements', icon: 'calendar', exact: false },
    { path: '/admin/media', label: 'Gestionnaire de médias', icon: 'image', exact: false },
    { path: '/admin/settings', label: 'Paramètres', icon: 'settings', exact: false }
  ];

  logout() {
    this.authService.logout();
  }
}
