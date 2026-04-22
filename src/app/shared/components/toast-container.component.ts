import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ToastService, Toast } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toastService.toasts()"
           class="toast" [ngClass]="toast.type"
           (click)="toastService.dismiss(toast.id)">
        <div class="toast-icon">
          <lucide-icon [name]="getIcon(toast.type)" size="18"></lucide-icon>
        </div>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" (click)="toastService.dismiss(toast.id)">
          <lucide-icon name="x" size="14"></lucide-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
      display: flex; flex-direction: column-reverse; gap: 0.75rem;
      max-width: 420px; width: 100%;
    }
    .toast {
      display: flex; align-items: center; gap: 0.75rem;
      padding: 0.875rem 1rem; border-radius: 12px;
      background: white; color: #1e293b;
      box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid transparent;
      animation: slideInToast 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer; transition: transform 0.2s, opacity 0.2s;
      &:hover { transform: translateX(-4px); }
      &.success { border-left-color: #10b981; .toast-icon { color: #10b981; background: #ecfdf5; } }
      &.error { border-left-color: #ef4444; .toast-icon { color: #ef4444; background: #fef2f2; } }
      &.warning { border-left-color: #f59e0b; .toast-icon { color: #f59e0b; background: #fffbeb; } }
      &.info { border-left-color: #3b82f6; .toast-icon { color: #3b82f6; background: #eff6ff; } }
    }
    .toast-icon {
      width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .toast-message { flex: 1; font-size: 0.85rem; font-weight: 600; line-height: 1.4; }
    .toast-close {
      border: none; background: none; color: #94a3b8; cursor: pointer; padding: 0.25rem;
      border-radius: 4px; display: flex; flex-shrink: 0;
      &:hover { color: #475569; background: #f1f5f9; }
    }
    @keyframes slideInToast {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @media (max-width: 480px) {
      .toast-container { left: 0.75rem; right: 0.75rem; bottom: 1rem; max-width: 100%; }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check';
      case 'error': return 'alert-circle';
      case 'warning': return 'alert-triangle';
      default: return 'info';
    }
  }
}
