import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LucideAngularModule } from 'lucide-angular';
import { ToastContainerComponent } from '../../../shared/components/toast-container.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    LucideAngularModule,
    ToastContainerComponent
  ],
  template: `
    <div class="admin-wrapper">
      <app-sidebar></app-sidebar>
      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
      <app-toast-container></app-toast-container>
    </div>
  `,
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent { }
