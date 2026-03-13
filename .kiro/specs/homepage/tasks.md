# Implementation Plan: Homepage

## Overview

This implementation plan breaks down the Mamilo Insights homepage into discrete coding tasks that build incrementally. Each task focuses on implementing specific components and features while ensuring proper integration and testing throughout the development process.

## Tasks

- [x] 1. Set up project structure and Google Fonts integration
  - Add Google Fonts link to index.html with preconnect optimization
  - Create CSS custom properties for design tokens in global styles
  - Set up homepage component file structure in features/public/home/
  - _Requirements: 9.1, 9.2_

- [ ] 2. Implement navigation component
  - [ ] 2.1 Create navigation HTML structure with responsive elements
    - Build navbar with logo, menu links, search button, and subscribe CTA
    - Implement mobile hamburger menu toggle
    - Add conditional rendering for desktop/mobile elements
    - _Requirements: 1.1, 1.2, 1.3_

  - [ ]* 2.2 Write property test for navigation responsive display
    - **Property 1: Navigation responsive display**
    - **Validates: Requirements 1.2, 1.3**

  - [ ] 2.3 Style navigation with sticky positioning and backdrop blur
    - Apply 64px height, sticky positioning, and backdrop-filter
    - Style active link highlighting with primary color and background pill
    - Implement smooth transitions for interactive elements
    - _Requirements: 1.1, 1.4, 1.5_

  - [ ]* 2.4 Write property test for navigation styling consistency
    - **Property 2: Navigation styling consistency**
    - **Validates: Requirements 1.1, 1.4, 1.5**

- [ ] 3. Implement hero section
  - [ ] 3.1 Create hero section HTML structure and content
    - Build two-column CSS Grid layout with content and visual columns
    - Add eyebrow label, multi-line heading, biographical text, and CTA buttons
    - Include professional statistics with values and labels
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 3.2 Write property test for hero content completeness
    - **Property 3: Hero section content completeness**
    - **Validates: Requirements 2.2, 2.3**

  - [ ] 3.3 Add hero visual elements with decorative styling
    - Implement professional portrait with gold frame and certification badge
    - Add decorative background gradient element
    - Position floating badge with shield icon and "Expert Certifié" text
    - _Requirements: 2.4_

  - [ ]* 3.4 Write property test for hero visual elements
    - **Property 4: Hero section visual elements**
    - **Validates: Requirements 2.4**

  - [ ] 3.5 Implement hero responsive behavior
    - Add mobile breakpoint styling for single column layout
    - Hide portrait and decorative elements on mobile viewports
    - Ensure content remains accessible and well-formatted
    - _Requirements: 2.5_

- [ ] 4. Checkpoint - Ensure navigation and hero tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement featured articles section
  - [ ] 5.1 Create article cards component structure
    - Build responsive CSS Grid (3 columns desktop, 2 tablet, 1 mobile)
    - Create article card HTML with image, category badge, title, description, and metadata
    - Implement 3-line text truncation for descriptions
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ]* 5.2 Write property test for article grid responsiveness
    - **Property 6: Article grid responsiveness**
    - **Validates: Requirements 3.1**

  - [ ]* 5.3 Write property test for article card content completeness
    - **Property 7: Article card content completeness**
    - **Validates: Requirements 3.2, 3.4, 3.5**

  - [ ] 5.4 Add article card hover animations and interactions
    - Implement translateY(-6px) and enhanced shadow on card hover
    - Add image scale(1.05) animation on parent hover
    - Style "Lire plus" links with hover gap animation
    - _Requirements: 3.3, 3.5_

  - [ ]* 5.5 Write property test for interactive hover effects
    - **Property 10: Interactive hover effects**
    - **Validates: Requirements 3.3, 5.4, 7.3, 8.3, 9.5**

- [ ] 6. Implement theory and practice section
  - [ ] 6.1 Create approach section with two-column layout
    - Build CSS Grid layout with text content and visual elements
    - Add eyebrow, heading, description, and bullet points with checkmark icons
    - Include CTA buttons for services and additional information
    - _Requirements: 4.1, 4.2, 4.4_

  - [ ] 6.2 Add overlapping professional images
    - Position main and secondary images with absolute positioning
    - Apply border-radius, box-shadow, and white border styling
    - Ensure proper z-index layering for overlapping effect
    - _Requirements: 4.3_

  - [ ] 6.3 Implement approach section responsive behavior
    - Hide visual elements on mobile viewports (<768px)
    - Switch to single column layout for mobile
    - Maintain content accessibility and readability
    - _Requirements: 4.5_

- [ ] 7. Implement recent engagements section
  - [ ] 7.1 Create engagement cards with three-column layout
    - Build vertical list of engagement cards
    - Implement three-column grid (image, content, action) for each card
    - Add type tag, title, location, date, description, and action button
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 7.2 Write property test for engagement card structure
    - **Property 8: Engagement card structure**
    - **Validates: Requirements 5.2, 5.3**

  - [ ] 7.3 Add engagement card hover effects and mobile responsiveness
    - Implement enhanced shadow effect on card hover
    - Switch to single column layout on mobile (<700px)
    - Adjust image height for mobile layout
    - _Requirements: 5.4, 5.5_

- [ ] 8. Checkpoint - Ensure content sections tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement newsletter CTA section
  - [ ] 9.1 Create newsletter subscription form
    - Build inline form layout with email input and submit button
    - Add prominent heading and descriptive text
    - Style form with navy background and white/transparent elements
    - _Requirements: 6.1, 6.3_

  - [ ] 9.2 Add form validation and interaction handling
    - Implement email format validation
    - Add visual feedback for focus, hover, and validation states
    - Prevent default form submission and handle custom submission
    - _Requirements: 6.2, 6.4, 6.5_

  - [ ]* 9.3 Write property test for newsletter form functionality
    - **Property 9: Newsletter form functionality**
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5**

- [ ] 10. Implement media partners section
  - [ ] 10.1 Create media partners display
    - Build horizontal flex layout with descriptive label
    - Add publication names with consistent typography
    - Implement responsive wrapping for smaller screens
    - _Requirements: 7.1, 7.2, 7.4, 7.5_

  - [ ] 10.2 Add media partners hover effects
    - Implement opacity and color changes on hover
    - Style partner logos with proper spacing and alignment
    - Ensure accessibility for interactive elements
    - _Requirements: 7.3_

- [ ] 11. Implement comprehensive footer
  - [ ] 11.1 Create footer structure with four-column grid
    - Build brand, quick links, resources, and newsletter sections
    - Add copyright information and legal text
    - Implement responsive grid adaptation (4 → 2 → 1 columns)
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

  - [ ] 11.2 Add footer social media buttons and interactions
    - Create circular social icon buttons with hover effects
    - Implement gold background fill on hover
    - Add proper accessibility labels and keyboard navigation
    - _Requirements: 8.3_

- [ ] 12. Implement data binding and Angular directives
  - [ ] 12.1 Set up component data arrays and interfaces
    - Define TypeScript interfaces for StatItem, Article, and Engagement
    - Create hardcoded data arrays for stats, articles, engagements, and media partners
    - Implement component methods for event handling
    - _Requirements: 10.1, 10.2, 10.3_

  - [ ]* 12.2 Write property test for data binding functionality
    - **Property 13: Data binding functionality**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

  - [ ] 12.3 Implement Angular directives for dynamic content
    - Use *ngFor for articles, engagements, statistics, and media partners
    - Add routerLink directives for navigation links
    - Implement conditional rendering with *ngIf for responsive elements
    - _Requirements: 10.4_

- [ ] 13. Implement responsive layout properties
  - [ ] 13.1 Add comprehensive responsive breakpoint handling
    - Implement mobile-first CSS with proper breakpoint management
    - Ensure all sections adapt correctly across viewport sizes
    - Test layout consistency at various screen dimensions
    - _Requirements: 2.1, 2.5, 4.1, 4.5, 5.5, 8.1, 8.5_

  - [ ]* 13.2 Write property test for responsive layout adaptation
    - **Property 5: Responsive layout adaptation**
    - **Validates: Requirements 2.1, 2.5, 4.1, 4.5, 5.5, 8.1, 8.5**

- [ ] 14. Implement design system consistency
  - [ ] 14.1 Apply design tokens and typography consistently
    - Ensure all elements use specified color tokens and Google Fonts
    - Apply consistent spacing (24px padding, 96px section padding)
    - Implement smooth transitions (0.18s-0.28s ease) for interactive elements
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

  - [ ]* 14.2 Write property test for design system consistency
    - **Property 11: Design system consistency**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4**

- [ ] 15. Implement image optimization and loading
  - [ ] 15.1 Add lazy loading for images
    - Apply lazy loading attributes to all images except hero portrait
    - Use eager loading for hero portrait image
    - Implement proper alt text and accessibility attributes
    - _Requirements: 10.5_

  - [ ]* 15.2 Write property test for image loading optimization
    - **Property 14: Image loading optimization**
    - **Validates: Requirements 10.5**

- [ ] 16. Add content rendering completeness verification
  - [ ] 16.1 Ensure all required content elements are present
    - Verify approach section bullet points are rendered
    - Confirm media partners label and logos display correctly
    - Check footer sections and social buttons are complete
    - _Requirements: 4.2, 4.4, 6.1, 7.1, 7.4, 8.2, 8.4_

  - [ ]* 16.2 Write property test for content rendering completeness
    - **Property 12: Content rendering completeness**
    - **Validates: Requirements 4.2, 4.4, 6.1, 7.1, 7.4, 8.2, 8.4**

- [ ] 17. Final integration and testing
  - [ ] 17.1 Wire all components together
    - Ensure proper component integration and data flow
    - Test navigation between sections and external links
    - Verify all interactive elements function correctly
    - _Requirements: All requirements_

  - [ ]* 17.2 Write comprehensive integration tests
    - Test end-to-end user flows and interactions
    - Verify cross-component functionality
    - Test responsive behavior across all sections

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout development
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- The implementation follows Angular 17+ standalone component patterns
- All styling uses SCSS with CSS Grid and Flexbox for responsive layouts