import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { ContentStore } from './core/services/content-store.service';
import { GlobalStateService } from './core/services/global-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-layout" [class.sidebar-collapsed]="isSidebarCollapsed()">
      <app-header *ngIf="!isAdmin"></app-header>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <app-footer *ngIf="!isAdmin"></app-footer>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: white;
      transition: padding 0.3s ease;
    }

    .main-content {
      flex-grow: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private contentStore = inject(ContentStore);
  private state = inject(GlobalStateService);
  private platformId = inject(PLATFORM_ID);

  isAdmin = false;
  isSidebarCollapsed = this.state.sidebarCollapsed;

  ngOnInit() {
    // Initial data load
    if (isPlatformBrowser(this.platformId)) {
      this.contentStore.loadAllInitialData();
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.isAdmin = event.urlAfterRedirects.startsWith('/admin');
    });
  }
}
