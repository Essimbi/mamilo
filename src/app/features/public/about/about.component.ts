import { Component, OnInit, inject, ElementRef, PLATFORM_ID, HostListener, AfterViewInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../../core/services/seo.service';
import { GlobalStateService } from '../../../core/services/global-state.service';
import { LucideAngularModule, GraduationCap, Book, Mic, ExternalLink, Calendar, MapPin, ArrowRight, ChevronRight, Mail, Globe, Route } from 'lucide-angular';
import { IContentService } from '../../../core/services/content.interface';
import { NewsletterComponent } from '../../../shared/components/newsletter.component';
import { PartnersComponent } from '../../../shared/components/partners.component';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule, NewsletterComponent, PartnersComponent, RouterModule],
  styleUrl: './about.component.scss',
  template: `
    <div class="about-page">
      <!-- 1. HERO SECTION -->
      <header class="about-hero">
        <div class="hero-container container">
          <div class="hero-profile">
            <div class="profile-column-left">
              <div class="profile-image-container">
                <div class="image-frame-top"></div>
                <div class="profile-image-wrapper">
                  <img [src]="authorVal?.avatar?.url || '/hero-mamilo.png'" [alt]="author()?.name" loading="eager" decoding="async" fetchpriority="high">
                </div>
                <div class="image-frame-bottom"></div>
              </div>
            </div>
            
            <div class="profile-column-right">
              <div class="hero-badge">Professeur depuis 2012</div>
              <h1>Professeur {{ author()?.name }}, Ph.D.</h1>
              <p class="hero-subtitle">Chaire d'études en communication et d'éthique des médias numériques</p>
              
              <div class="hero-declaration">
                <span class="declaration-label">DÉCLARATION D'INTENTION</span>
                <blockquote>
                  « Mon travail est consacré à la mise au jour des mécanismes profonds par lesquels les architectures numériques façonnent le comportement humain. Je m'efforce de combler le fossé entre progrès technique et responsabilité éthique, afin que notre avenir numérique commun demeure un espace de croissance démocratique et de connexion authentique. »
                </blockquote>
              </div>
              
              <div class="hero-actions">
                <button class="btn-collaboration" (click)="onContact()">
                  <lucide-icon name="mail" size="18"></lucide-icon>
                  Contacter pour une collaboration
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. BIOGRAPHY -->
      <section class="bio-section animate-on-scroll">
        <div class="container">
          <div class="bio-header">
            <h2>Biographie</h2>
            <div class="bio-divider"></div>
          </div>
          
          <div class="bio-content">
            <p>
              MAMILO Christian est une figure de proue de la sociologie numérique et de l'éthique de la communication. Depuis vingt ans, ses recherches anticipent les conséquences sociales des mutations technologiques, des débuts de la blogosphère à la domination actuelle de l'intelligence artificielle et de la curation algorithmique.
            </p>
            <p>
              Son parcours universitaire a débuté à l'Université de Cambridge, où il a étudié l'anthropologie sociale avant de rejoindre Oxford pour ses recherches doctorales. Depuis, il a bénéficié de prestigieuses bourses de recherche au Centre Berkman Klein de Harvard et à l'Institut Max Planck pour le développement humain.
            </p>
            <p>
              En dehors de ses activités d'enseignement, le Prof. Mamilo intervient comme consultant auprès d'instances décisionnelles de l'Union européenne, les conseillant sur le pluralisme des médias et les cadres de littératie numérique. Il collabore régulièrement au New York Times et au Guardian, où il traduit des résultats universitaires complexes en arguments concrets pour le grand public.
            </p>
          </div>
        </div>
      </section>

      <!-- 3. ACADEMIC TIMELINE -->
      <section class="academic-section animate-on-scroll">
        <div class="container">
          <div class="section-divider">
            <span class="divider-text">Réalisations académiques</span>
            <div class="divider-line"></div>
          </div>

          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-dot current">
                <lucide-icon name="graduation-cap" size="14"></lucide-icon>
              </div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-date">2022 — PRÉSENT</span>
                  <span class="timeline-tag">MISE EN L'ÉCOUTE</span>
                </div>
                <h3>Professeur titulaire et directeur du département d'études de la communication</h3>
                <p class="timeline-location">Metropolitan University of Technology</p>
                <p class="timeline-desc">
                  Responsable du département de recherche en éthique numérique et psychologie des médias. A supervisé plus de 12 doctorants et obtenu 2 millions de dollars de subventions du National Endowment for Science.
                </p>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-date">2015 — 2019</span>
                  <span class="timeline-tag">ADMINISTRATION</span>
                </div>
                <h3>Chercheur principal</h3>
                <p class="timeline-location">International Center for Media Literacy</p>
                <p class="timeline-desc">
                  A coordonné le « Projet mondial d'alphabétisation », une initiative axée sur la lutte contre la désinformation sur les marchés numériques émergents en Europe et en Amérique du Nord.
                </p>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-date">2012 — 2015</span>
                  <span class="timeline-tag">AMÉNAGEMENT</span>
                </div>
                <h3>Professeur invité</h3>
                <p class="timeline-location">The Institute of Advanced Social Sciences</p>
                <p class="timeline-desc">
                  Publication de recherches fondamentales sur l'impact des biais algorithmiques sur l'opinion publique pendant les cycles électoraux.
                </p>
              </div>
            </div>

            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-header">
                  <span class="timeline-date">2009</span>
                  <span class="timeline-tag">DIPLÔME OBTENU</span>
                </div>
                <h3>Doctorat en sociologie numérique</h3>
                <p class="timeline-location">Oxford Academic University</p>
                <p class="timeline-desc">
                  Thèse : « Le pacte frontal : interactions et dissonance à l'ère de la connexion permanente ». Mention très bien (Summa Cum Laude).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. PUBLICATIONS -->
      <section class="publications-section animate-on-scroll">
        <div class="container">
          <div class="section-divider">
            <span class="divider-text">Publications sélectionnées</span>
            <div class="divider-line"></div>
          </div>

          <div class="publications-grid">
            <div class="pub-card" *ngFor="let post of recentArticles(); let i = index">
              <div class="pub-type">Article</div>
              <div class="pub-year">{{ post.publishedAt | date:'yyyy' }}</div>
              <h3 class="pub-title">
                {{ post.title }}
              </h3>
              <p class="pub-publisher">
                {{ post.category?.name || 'Publication' }}
              </p>
              <a [routerLink]="['/articles', post.slug]" class="pub-link">
                 Lire l'article
                 <lucide-icon name="arrow-right" size="12"></lucide-icon>
              </a>
            </div>
          </div>

          <div class="publications-action">
            <a routerLink="/articles" class="btn-outline">
              Voir toutes les publications
              <lucide-icon name="chevron-right" size="16"></lucide-icon>
            </a>
          </div>
        </div>
      </section>

      <!-- 5. ENGAGEMENTS -->
      <section class="engagements-section animate-on-scroll">
        <div class="container">
          <div class="section-divider">
            <h2 class="divider-text">Conférences et engagements</h2>
            <div class="divider-line"></div>
          </div>

          <div class="featured-engagements" *ngIf="pastEvents().length">
            <div class="eng-featured-card" *ngFor="let event of pastEvents()">
              <div [class]="'eng-card-left ' + (event.type === 'Keynotes' ? 'keynote' : 'symposium')">
                <div class="eng-icon-box">
                  <lucide-icon [name]="event.type === 'Keynotes' ? 'mic' : 'globe'" size="28" strokeWidth="1.5"></lucide-icon>
                  <span class="eng-type">{{ event.type | uppercase }}</span>
                </div>
                <div class="eng-year">{{ event.eventDate | date:'yyyy' }}</div>
              </div>
              <div class="eng-info">
                <h4>{{ event.title }}</h4>
                <p class="location-text">{{ event.location }}</p>
                <p class="desc">{{ (event.description | slice:0:100) + '...' }}</p>
              </div>
            </div>
          </div>

          <div class="upcoming-seminars" *ngIf="upcomingEvents().length">
            <!-- <div class="seminar-header">
                <lucide-icon name="calendar" size="18" class="text-blue-600"></lucide-icon>
                <h3>Évènements à venir</h3>
            </div> -->
            <div class="seminar-list">
                <div class="seminar-row" *ngFor="let event of upcomingEvents()" style="cursor: pointer" [routerLink]="['/events', event.slug]">
                    <span class="seminar-date">{{ event.eventDate | date:'MMM dd, yyyy' }}</span>
                    <span class="seminar-title">{{ event.title }}</span>
                    <div class="seminar-end">
                        <span class="seminar-venue">{{ event.location }}</span>
                        <lucide-icon name="chevron-right" size="16"></lucide-icon>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5.5 STATISTICS -->
      <section class="stats-section animate-on-scroll">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ state.posts().length }}<span>+</span></div>
              <div class="stat-label">ARTICLES PUBLIÉS</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">15k</div>
              <div class="stat-label">CITATIONS</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ state.events().length }}</div>
              <div class="stat-label">ÉVÉNEMENTS</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">22</div>
              <div class="stat-label">ANNÉES UNIVERSITAIRES</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. NEWSLETTER CTA -->
      <app-newsletter></app-newsletter>

      <!-- 7. PARTENAIRES -->
      <app-partners></app-partners>
    </div>
    `
})
export class AboutComponent implements OnInit, AfterViewInit {
  state = inject(GlobalStateService);
  private seoService = inject(SeoService);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private contentService = inject(IContentService);

  author = this.state.user;
  settings = this.state.settings;
  isBrowser: boolean;
  authorVal: any | null = null;
  
  recentArticles = this.state.posts; // We can load slice(0, 6) or limit directly
  upcomingEvents = signal<any[]>([]);
  pastEvents = signal<any[]>([]);


  constructor(private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    const s = this.settings();
    this.authorVal = this.author();
    if (this.authorVal?.avatar) {
      this.authorVal.avatar.url = '/hero-mamilo.png';
    }
    this.seoService.updateTitle('À Propos');
    this.seoService.updateMeta(
      s?.site_description || 'Découvrez le Dr. ' + (this.author()?.name || 'Christian Mamilo'),
      ['expert', 'parcours', 'about', 'mamilo']
    );

    // Initial slice on global state if needed, but it's simpler to fetch right amounts:
    this.contentService.getPosts({}, { page: 1, limit: 6 }).subscribe(res => {
      // In case we want to overwrite state, but usually we just bind it to local signal if we want a smaller slice
      // Or we can just use computed
    });
    this.contentService.getEvents({ status: 'upcoming', limit: 3 }).subscribe(res => this.upcomingEvents.set(res));
    this.contentService.getEvents({ status: 'past', limit: 2 }).subscribe(res => this.pastEvents.set(res));
  }

  onContact() {
    this.router.navigate(['/contact']);
  }

  ngAfterViewInit(): void {
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

  private checkScrollAnimations() {
    if (!this.isBrowser) return;
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;

    elements.forEach((el: Element) => {
      const element = el as HTMLElement;
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < windowHeight - elementVisible) {
        element.classList.add('animated');
      }
    });
  }

  onSeeAllPublications() {
    const researchgate = this.author()?.social?.researchgate;
    if (researchgate && this.isBrowser) {
      window.open(researchgate, '_blank');
    }
  }
}
