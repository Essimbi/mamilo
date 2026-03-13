import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { GlobalStateService } from '../../../core/services/global-state.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, LucideAngularModule],
    template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">
            <span class="logo-text">Mamilo</span>
            <span class="logo-accent">Insights</span>
          </div>
          <h1>Bienvenue</h1>
          <p>Connectez-vous pour gérer votre espace académique</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Adresse e-mail</label>
            <div class="input-wrapper">
              <lucide-icon name="mail" size="18"></lucide-icon>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="nom@exemple.com"
                [class.error]="isFieldInvalid('email')"
              >
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <lucide-icon name="lock" size="18"></lucide-icon>
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                id="password" 
                formControlName="password" 
                placeholder="••••••••"
                [class.error]="isFieldInvalid('password')"
              >
              <button 
                type="button" 
                class="toggle-password" 
                (click)="togglePassword()"
              >
                <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'" size="18"></lucide-icon>
              </button>
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" formControlName="rememberMe">
              <span>Se souvenir de moi</span>
            </label>
            <a routerLink="/forgot-password" class="forgot-link">Oublié ?</a>
          </div>

          <div *ngIf="error()" class="error-message">
            <lucide-icon name="alert-circle" size="16"></lucide-icon>
            <span>{{ error() }}</span>
          </div>

          <button 
            type="submit" 
            class="submit-btn" 
            [disabled]="loginForm.invalid || isLoading()"
          >
            <span *ngIf="!isLoading()">Se connecter</span>
            <span *ngIf="isLoading()" class="loader"></span>
          </button>
        </form>

        <div class="login-footer">
          <p>Retourner à <a routerLink="/">l'accueil</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 1.5rem;
    }

    .login-card {
      width: 100%;
      max-width: 440px;
      background: white;
      border-radius: 1.5rem;
      padding: 3rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .login-header {
      text-align: center;
      margin-bottom: 2.5rem;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 1.5rem;
    }

    .logo-text { color: #1e293b; }
    .logo-accent { color: #2563eb; }

    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 1.875rem;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    p {
      color: #64748b;
      font-size: 0.875rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #475569;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper lucide-icon {
      position: absolute;
      left: 1rem;
      color: #94a3b8;
    }

    input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      transition: all 0.2s;
      outline: none;
    }

    input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
    }

    input.error {
      border-color: #ef4444;
    }

    .toggle-password {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }

    .toggle-password:hover { color: #64748b; }

    .form-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.875rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: #64748b;
    }

    .forgot-link {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .error-message {
      background: #fef2f2;
      color: #b91c1c;
      padding: 0.75rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .submit-btn {
      background: #1e293b;
      color: white;
      padding: 0.875rem;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.5rem;
    }

    .submit-btn:hover:not(:disabled) {
      background: #0f172a;
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .login-footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.875rem;
      color: #64748b;
    }

    .login-footer a {
      color: #2563eb;
      text-decoration: none;
      font-weight: 500;
    }

    .loader {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private state = inject(GlobalStateService);
    private router = inject(Router);

    isLoading = this.state.isLoading;
    error = this.state.error;
    showPassword = signal(false);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false]
    });

    togglePassword() {
        this.showPassword.update(v => !v);
    }

    isFieldInvalid(name: string) {
        const field = this.loginForm.get(name);
        return field?.touched && field?.invalid;
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.state.setError(null);
            const { email, password } = this.loginForm.value;

            this.authService.login({ email: email!, password: password! }).subscribe({
                next: () => {
                    this.router.navigate(['/admin']);
                },
                error: (err) => {
                    // Error handled in service state
                }
            });
        }
    }
}
