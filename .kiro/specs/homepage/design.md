# Design Document

## Overview

This design document outlines the architecture and implementation approach for the Mamilo Insights homepage, a production-ready Angular 17+ application featuring standalone components, modern CSS Grid layouts, and comprehensive responsive design. The homepage serves as a professional showcase for a communication expert, emphasizing credibility, expertise, and engagement through carefully crafted visual hierarchy and interactive elements.

## Architecture

### Component Structure

The homepage follows Angular 17+ standalone component architecture, eliminating the need for NgModules and promoting better modularity:

```typescript
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // Component logic and data
}
```

### Technology Stack

- **Framework**: Angular 17+ with standalone components
- **Styling**: SCSS with CSS Grid and Flexbox
- **Typography**: Google Fonts (Playfair Display, Source Serif 4, DM Sans)
- **Routing**: Angular RouterModule for navigation
- **Build System**: Angular CLI with Vite bundler
- **Responsive Design**: Mobile-first approach with CSS Grid and Flexbox

### File Organization

```
src/app/features/public/home/
├── home.component.ts
├── home.component.html
├── home.component.scss
└── home.component.spec.ts
```

## Components and Interfaces

### HomeComponent Interface

```typescript
interface HomeComponent {
  // Data properties
  stats: StatItem[];
  featuredArticles: Article[];
  engagements: Engagement[];
  mediaPartners: string[];
  
  // Methods
  onNewsletterSubmit(event: Event): void;
  onSearchClick(): void;
  onSubscribeClick(): void;
}

interface StatItem {
  value: string;
  label: string;
}

interface Article {
  id: string;
  category: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  slug: string;
}

interface Engagement {
  id: string;
  type: string;
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
}
```

### Navigation Component Structure

The navigation system will be implemented as part of the main component with conditional rendering:

```html
<nav class="navbar" [class.mobile-menu-open]="isMobileMenuOpen">
  <div class="navbar-container">
    <div class="navbar-brand">
      <div class="logo">MI</div>
      <span class="brand-name">Mamilo Insights</span>
    </div>
    
    <div class="navbar-menu" [class.hidden]="!isDesktop">
      <a *ngFor="let link of navLinks" 
         [routerLink]="link.path" 
         [class.active]="isActiveLink(link.path)">
        {{ link.label }}
      </a>
    </div>
    
    <div class="navbar-actions" [class.hidden]="!isDesktop">
      <button class="search-btn" (click)="onSearchClick()">
        <svg><!-- search icon --></svg>
      </button>
      <button class="subscribe-btn" (click)="onSubscribeClick()">
        S'abonner
      </button>
    </div>
    
    <button class="mobile-menu-toggle" 
            [class.hidden]="isDesktop"
            (click)="toggleMobileMenu()">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

## Data Models

### Component Data Structure

```typescript
export class HomeComponent {
  stats: StatItem[] = [
    { value: '20+', label: 'Années d\'expérience' },
    { value: '14k', label: 'Abonnés & Followers' },
    { value: '350+', label: 'Articles & Publications' }
  ];

  featuredArticles: Article[] = [
    {
      id: '1',
      category: 'Communication Digitale',
      title: 'L\'évolution des stratégies de communication à l\'ère du numérique',
      description: 'Une analyse approfondie des transformations récentes dans le domaine de la communication professionnelle et leur impact sur les entreprises modernes.',
      date: '2024-02-15',
      imageUrl: 'https://picsum.photos/seed/article1/800/600',
      slug: 'evolution-strategies-communication-numerique'
    },
    // Additional articles...
  ];

  engagements: Engagement[] = [
    {
      id: '1',
      type: 'Conférence Internationale',
      title: 'Digital Transformation in Corporate Communication',
      location: 'Paris, France',
      date: '2024-03-20',
      description: 'Présentation des dernières tendances en matière de transformation digitale pour les équipes de communication d\'entreprise.',
      imageUrl: 'https://picsum.photos/seed/event1/800/600'
    },
    // Additional engagements...
  ];

  mediaPartners: string[] = [
    'Cambridge Press',
    'The Economist',
    'MIT Technology Review',
    'Oxford University'
  ];
}
```
## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Based on the prework analysis, I've identified several key properties that can be consolidated to avoid redundancy:

### Property Reflection

After reviewing all testable criteria, I've identified opportunities to combine related properties:
- Navigation responsive behavior (1.2, 1.3) can be combined into one comprehensive property
- Hero section content rendering (2.2, 2.3, 2.4) can be consolidated 
- Article card rendering (3.2, 3.4, 3.5) can be unified
- Responsive layout properties (2.5, 4.5, 5.5, 8.5) can be grouped by breakpoint behavior
- Hover effects (3.3, 5.4, 7.3, 8.3, 9.5) can be consolidated into interaction properties

### Core Properties

Property 1: Navigation responsive display
*For any* viewport size, the navigation system should display appropriate elements: all elements visible on desktop (≥900px), only logo and hamburger on mobile (<900px)
**Validates: Requirements 1.2, 1.3**

Property 2: Navigation styling consistency
*For any* navigation state, the system should maintain 64px height, sticky positioning, backdrop-filter blur, and active link highlighting
**Validates: Requirements 1.1, 1.4, 1.5**

Property 3: Hero section content completeness
*For any* hero section render, all required elements should be present: eyebrow label, multi-line heading, biographical text, CTA buttons, and statistics with values and labels
**Validates: Requirements 2.2, 2.3**

Property 4: Hero section visual elements
*For any* desktop viewport (≥768px), the hero section should display professional portrait with decorative gold frame and certification badge
**Validates: Requirements 2.4**

Property 5: Responsive layout adaptation
*For any* viewport size change, sections should adapt their layout: two-column on desktop, single-column on mobile, with appropriate element hiding
**Validates: Requirements 2.1, 2.5, 4.1, 4.5, 5.5, 8.1, 8.5**

Property 6: Article grid responsiveness
*For any* viewport size, the article grid should display the correct number of columns: 3 on desktop, 2 on tablet, 1 on mobile
**Validates: Requirements 3.1**

Property 7: Article card content completeness
*For any* article data, each card should render all required elements: image, category badge, title, truncated description (3 lines max), metadata, and "Lire plus" link
**Validates: Requirements 3.2, 3.4, 3.5**

Property 8: Engagement card structure
*For any* engagement data, each card should use three-column layout (image, content, action) and include all required fields: type tag, title, location, date, and description
**Validates: Requirements 5.2, 5.3**

Property 9: Newsletter form functionality
*For any* email input, the form should validate format, provide visual feedback, use inline layout, and prevent default submission
**Validates: Requirements 6.2, 6.3, 6.4, 6.5**

Property 10: Interactive hover effects
*For any* interactive element (cards, buttons, links, media partners), hovering should trigger appropriate visual changes: transforms, shadows, color changes, or animations
**Validates: Requirements 3.3, 5.4, 7.3, 8.3, 9.5**

Property 11: Design system consistency
*For any* page element, the styling should use specified color tokens, Google Fonts, consistent spacing (24px padding, 96px section padding), and smooth transitions (0.18s-0.28s ease)
**Validates: Requirements 9.1, 9.2, 9.3, 9.4**

Property 12: Content rendering completeness
*For any* section with required content elements, all specified elements should be present: approach section bullet points, media partners label and logos, footer sections, and social buttons
**Validates: Requirements 4.2, 4.4, 6.1, 7.1, 7.4, 8.2, 8.4**

Property 13: Data binding functionality
*For any* data array (articles, engagements, statistics, media partners), the component should render all items using Angular directives and display all required fields
**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

Property 14: Image loading optimization
*For any* image element, lazy loading should be applied except for the hero portrait which should use eager loading
**Validates: Requirements 10.5**

## Error Handling

### Form Validation
- Email validation using HTML5 pattern matching and custom validation
- Visual feedback for invalid inputs with error states
- Graceful handling of form submission failures

### Image Loading
- Fallback handling for failed image loads
- Progressive loading with placeholder states
- Error boundaries for component failures

### Responsive Breakpoints
- Graceful degradation for unsupported viewport sizes
- Fallback layouts for edge cases
- CSS feature detection for advanced properties

### Browser Compatibility
- Fallback fonts for Google Fonts loading failures
- CSS Grid fallbacks using Flexbox
- Progressive enhancement for modern CSS features

## Testing Strategy

### Dual Testing Approach

The homepage will use both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and error conditions
- Component initialization and data binding
- Event handler functionality
- Responsive breakpoint behavior at specific viewport sizes
- Form validation with known valid/invalid inputs
- Error handling scenarios

**Property Tests**: Verify universal properties across all inputs
- Layout consistency across viewport ranges
- Content rendering completeness for any data set
- Interactive behavior for all hoverable elements
- Design system consistency across all components
- Data binding functionality with generated test data

### Property-Based Testing Configuration

- **Testing Library**: Angular Testing Library with fast-check for property generation
- **Test Iterations**: Minimum 100 iterations per property test
- **Test Tagging**: Each property test tagged with format: **Feature: homepage, Property {number}: {property_text}**

### Test Implementation Requirements

Each correctness property will be implemented as a single property-based test:

```typescript
// Example property test structure
describe('Homepage Property Tests', () => {
  it('Property 1: Navigation responsive display', () => {
    fc.assert(fc.property(
      fc.integer(320, 1920), // viewport width
      (viewportWidth) => {
        // Test implementation
        // **Feature: homepage, Property 1: Navigation responsive display**
      }
    ), { numRuns: 100 });
  });
});
```

### Unit Test Focus Areas

- Component lifecycle methods
- Data transformation and formatting
- Event handling and user interactions
- Integration between Angular services and components
- Accessibility compliance testing

### Visual Regression Testing

- Screenshot comparison for key viewport sizes
- Cross-browser compatibility verification
- Typography and spacing consistency checks
- Color accuracy validation

This design provides a comprehensive foundation for implementing a production-ready homepage that meets all specified requirements while maintaining high standards for performance, accessibility, and user experience.