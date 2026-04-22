import { Component, OnInit, inject, HostListener, AfterViewInit, ElementRef, PLATFORM_ID, Inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { SeoService } from '../../../core/services/seo.service';
import { Post } from '../../../core/models/post.model';
import { Event } from '../../../core/models/event.model';
import { MOCK_USER } from '../../../mock-data/data/users.mock';
import { LucideAngularModule } from 'lucide-angular';

import { ScrollRevealDirective } from '../../../shared/directives/scroll-reveal.directive';
import { NewsletterComponent } from '../../../shared/components/newsletter.component';
import { PartnersComponent } from '../../../shared/components/partners.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, LucideAngularModule, ScrollRevealDirective, NewsletterComponent, PartnersComponent],
  styleUrl: './home.component.scss',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  private state = inject(GlobalStateService);
  private seoService = inject(SeoService);
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


  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const s = this.settings();
    this.seoService.updateTitle('Accueil');
    this.seoService.updateMeta(
      s?.site_description || 'Plateforme éditoriale du Dr. Christian Mamilo. Communication digitale et perspectives académiques.',
      ['communication', 'digital', 'académique', 'expertise', 'mamilo']
    );
  }
}