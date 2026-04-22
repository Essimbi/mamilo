import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 0;
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', duration = 4000) {
    const id = this.nextId++;
    const toast: Toast = { id, message, type, duration };
    this.toasts.update(list => [...list, toast]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  success(message: string, duration = 4000) { this.show(message, 'success', duration); }
  error(message: string, duration = 5000) { this.show(message, 'error', duration); }
  warning(message: string, duration = 4500) { this.show(message, 'warning', duration); }
  info(message: string, duration = 4000) { this.show(message, 'info', duration); }

  dismiss(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
