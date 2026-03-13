import { Component, OnInit, inject, HostListener, AfterViewInit, ElementRef, PLATFORM_ID, Inject, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { SeoService } from '../../../core/services/seo.service';
import { Post } from '../../../core/models/post.model';
import { Event } from '../../../core/models/event.model';
import { MOCK_USER } from '../../../mock-data/data/users.mock';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, AfterViewInit {
  private state = inject(GlobalStateService);
  private seoService = inject(SeoService);
  private elementRef = inject(ElementRef);
  private isBrowser: boolean;

  featuredPost = computed(() => this.state.posts()[0]);
  latestPosts = computed(() => this.state.posts().slice(0, 3));
  latestEvents = computed(() => this.state.events().slice(0, 3));
  author = this.state.user;
  settings = this.state.settings;

  stats = computed(() => [
    { value: this.state.posts().length + '+', label: 'Articles publiés' },
    { value: '12k+', label: 'Audience mensuelle' },
    { value: '15+', label: 'Distinctions académiques' }
  ]);

  highlights = [
    'Recherche académique appliquée',
    'Stratégies de communication digitale',
    'Consulting & formations sur mesure'
  ];

  mediaPartners = [
    'Cambridge Press',
    'The Economist',
    'MIT Technology Review',
    'Oxford University',
    'Sage Journals'
  ];

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const s = this.settings();
    this.seoService.updateTitle('Accueil');
    this.seoService.updateMeta(
      s?.siteDescription || 'Plateforme éditoriale du Dr. Christian Mamilo. Communication digitale et perspectives académiques.',
      s?.keywords || ['communication', 'digital', 'académique', 'expertise']
    );
  }

  ngAfterViewInit(): void {
    // Only run animations in browser environment
    if (this.isBrowser) {
      setTimeout(() => this.checkScrollAnimations(), 100);
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (this.isBrowser) {
      this.checkScrollAnimations();
    }
  }

  private checkScrollAnimations(): void {
    if (!this.isBrowser) return;

    const elements = this.elementRef.nativeElement.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;

    elements.forEach((element: HTMLElement) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150; // Distance from bottom of viewport to trigger animation

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('animated');
      }
    });
  }
}