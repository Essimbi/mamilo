import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user.model';
import { LucideAngularModule, Linkedin, Twitter, GraduationCap } from 'lucide-angular';

@Component({
  selector: 'app-author-block',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  styles: [`
    .author-block {
        display: block;
        background-color: #f8fafc;
        border-radius: 1.5rem;
        padding: 2rem;
        border: 1px solid #f1f5f9;
        margin: 2rem 0;
    }

    .author-content {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        align-items: center;
        text-align: center;
    }

    @media (min-width: 1024px) {
        .author-content {
            flex-direction: row;
            align-items: flex-start;
            text-align: left;
        }
    }

    .avatar-wrapper {
        position: relative;
    }

    .avatar-wrapper .author-avatar {
        width: 6rem;
        height: 6rem;
        border-radius: 1rem;
        object-fit: cover;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border: 2px solid #ffffff;
    }

    @media (min-width: 1024px) {
        .avatar-wrapper .author-avatar {
            width: 8rem;
            height: 8rem;
        }
    }

    .avatar-wrapper .badge-icon {
        position: absolute;
        bottom: -0.5rem;
        right: -0.5rem;
        background-color: #1B3A6B;
        color: #ffffff;
        padding: 0.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .author-info {
        flex: 1;
    }

    .author-info .author-name {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1B3A6B;
        margin-bottom: 0.5rem;
        font-family: inherit;
    }

    .author-info .author-role {
        color: #64748b;
        font-weight: 500;
        margin-bottom: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75rem;
    }

    .author-info .author-bio {
        color: #475569;
        font-family: inherit;
        line-height: 1.625;
        margin-bottom: 1.5rem;
        font-size: 1.125rem;
        font-style: italic;
    }

    .social-links {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    @media (min-width: 1024px) {
        .social-links {
            justify-content: flex-start;
        }
    }

    .social-links .social-link {
        padding: 0.625rem;
        border-radius: 0.75rem;
        background-color: #ffffff;
        border: 1px solid #f1f5f9;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
    }

    .social-links .social-link.linkedin {
        color: #2E6DA4;
    }

    .social-links .social-link.linkedin:hover {
        background-color: #2E6DA4;
        color: #ffffff;
    }

    .social-links .social-link.twitter {
        color: #60a5fa;
    }

    .social-links .social-link.twitter:hover {
        background-color: #60a5fa;
        color: #ffffff;
    }
  `],
  template: `
    <div class="author-block">
      <div class="author-content">
        <!-- Avatar -->
        <div class="avatar-wrapper">
          <img 
            [src]="author.avatar?.url || 'assets/images/default-avatar.png'" 
            [alt]="author.avatar?.alt || author.name"
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
            {{ author.role === 'admin' ? 'Expert Consultant' : 'Éditeur' }}
          </p>
          
          <p class="author-bio">
            "{{ author.bio }}"
          </p>

          <!-- Social Links -->
          <div class="social-links">
            <a 
              *ngIf="author.social?.linkedin" 
              [href]="author.social?.linkedin"
              target="_blank"
              class="social-link linkedin"
              title="LinkedIn"
            >
              <lucide-icon name="linkedin" size="20"></lucide-icon>
            </a>
            <a 
              *ngIf="author.social?.twitter" 
              [href]="author.social?.twitter"
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
