import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { LucideAngularModule, Linkedin, Twitter, GraduationCap } from 'lucide-angular';

@Component({
  selector: 'app-author-block',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  styleUrl: './author-block.component.scss',
  template: `
    <div class="author-block">
      <div class="author-content">
        <!-- Avatar -->
        <div class="avatar-wrapper">
          <img 
            [src]="author.avatar.url" 
            [alt]="author.avatar.alt"
            class="author-avatar"
          >
          <div class="badge-icon">
            <lucide-icon name="graduation-cap" size="18"></lucide-icon>
          </div>
        </div>

        <!-- Info -->
        <div class="author-info">
          <h4 class="author-name">{{ author.name }}</h4>
          <p class="author-role">
            Auteur & {{ author.role === 'admin' ? 'Expert Consultant' : 'Éditeur' }}
          </p>
          
          <p class="author-bio">
            "{{ author.bio }}"
          </p>

          <!-- Social Links -->
          <div class="social-links">
            <a 
              *ngIf="author.social.linkedin" 
              [href]="author.social.linkedin"
              target="_blank"
              class="social-link linkedin"
              title="LinkedIn"
            >
              <lucide-icon name="linkedin" size="20"></lucide-icon>
            </a>
            <a 
              *ngIf="author.social.twitter" 
              [href]="author.social.twitter"
              target="_blank"
              class="social-link twitter"
              title="Twitter / X"
            >
              <lucide-icon name="twitter" size="20"></lucide-icon>
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthorBlockComponent {
  @Input() author!: User;
}
