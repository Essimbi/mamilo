# Requirements Document

## Introduction

This document specifies the requirements for a complete, production-ready homepage for "Mamilo Insights", a French-language professional blog belonging to a communication expert specializing in traditional and digital marketing. The homepage will serve as the primary entry point for visitors, showcasing expertise, featured content, and engagement opportunities.

## Glossary

- **Homepage**: The main landing page of the Mamilo Insights website
- **Navigation_System**: The sticky navigation bar component
- **Hero_Section**: The primary above-the-fold content area featuring personal branding
- **Article_Cards**: Individual content preview components for blog posts
- **Engagement_Cards**: Event and conference listing components
- **Newsletter_Form**: Email subscription interface
- **Media_Partners**: Publication and citation display section
- **Footer_Component**: Site-wide footer with links and social media

## Requirements

### Requirement 1: Responsive Navigation System

**User Story:** As a visitor, I want to navigate the site easily across all devices, so that I can access different sections efficiently.

#### Acceptance Criteria

1. THE Navigation_System SHALL display as a sticky header with 64px height
2. WHEN the viewport is desktop size, THE Navigation_System SHALL show logo, navigation links, search icon, and subscription CTA
3. WHEN the viewport is mobile (<900px), THE Navigation_System SHALL hide menu items and show hamburger icon
4. WHEN a navigation link is active, THE Navigation_System SHALL highlight it with primary color and background pill
5. THE Navigation_System SHALL maintain backdrop-filter blur effect with white background

### Requirement 2: Hero Section Personal Branding

**User Story:** As a potential client or reader, I want to understand the expert's background and credentials immediately, so that I can assess their expertise.

#### Acceptance Criteria

1. THE Hero_Section SHALL display personal information in a two-column grid layout
2. WHEN displaying content, THE Hero_Section SHALL show eyebrow label, multi-line heading, biographical text, and CTA buttons
3. THE Hero_Section SHALL include professional statistics with values and labels
4. WHEN displaying the portrait, THE Hero_Section SHALL show professional image with decorative gold frame and certification badge
5. WHEN the viewport is mobile (<768px), THE Hero_Section SHALL switch to single column and hide portrait elements

### Requirement 3: Featured Articles Display

**User Story:** As a reader, I want to see the most important articles prominently featured, so that I can quickly access valuable content.

#### Acceptance Criteria

1. THE Article_Cards SHALL display in a responsive grid (3 columns desktop, 2 tablet, 1 mobile)
2. WHEN displaying an article, THE Article_Cards SHALL show image, category badge, title, description, and metadata
3. WHEN hovering over a card, THE Article_Cards SHALL animate with translateY and enhanced shadow
4. THE Article_Cards SHALL truncate descriptions to 3 lines maximum
5. THE Article_Cards SHALL include "Lire plus" links with hover animations

### Requirement 4: Theory and Practice Section

**User Story:** As a potential client, I want to understand the expert's approach and methodology, so that I can evaluate their services.

#### Acceptance Criteria

1. THE approach section SHALL display content in a two-column layout with text and visuals
2. WHEN presenting the approach, THE section SHALL show eyebrow, heading, description, and bullet points
3. THE section SHALL include overlapping professional images as visual elements
4. THE section SHALL provide CTA buttons for services and additional information
5. WHEN the viewport is mobile (<768px), THE section SHALL hide visual elements and use single column

### Requirement 5: Recent Engagements Display

**User Story:** As a visitor, I want to see current and upcoming professional engagements, so that I can understand the expert's active involvement in the field.

#### Acceptance Criteria

1. THE Engagement_Cards SHALL display in a vertical list format
2. WHEN showing an engagement, THE Engagement_Cards SHALL include image, type tag, title, location, date, and description
3. THE Engagement_Cards SHALL use a three-column grid layout (image, content, action)
4. WHEN hovering over a card, THE Engagement_Cards SHALL show enhanced shadow effect
5. WHEN the viewport is mobile (<700px), THE Engagement_Cards SHALL switch to single column layout

### Requirement 6: Newsletter Subscription

**User Story:** As an interested reader, I want to subscribe to updates, so that I can stay informed about new content and insights.

#### Acceptance Criteria

1. THE Newsletter_Form SHALL display with prominent heading and description
2. WHEN a user enters an email, THE Newsletter_Form SHALL validate the input format
3. THE Newsletter_Form SHALL use inline layout with email input and submit button
4. THE Newsletter_Form SHALL provide visual feedback on form interactions
5. WHEN submitting the form, THE Newsletter_Form SHALL prevent default browser submission

### Requirement 7: Media Partners Recognition

**User Story:** As a visitor, I want to see where the expert has been published or cited, so that I can assess their credibility and reach.

#### Acceptance Criteria

1. THE Media_Partners SHALL display publication names in a horizontal layout
2. WHEN showing partners, THE Media_Partners SHALL use consistent typography and spacing
3. WHEN hovering over a partner logo, THE Media_Partners SHALL change opacity and color
4. THE Media_Partners SHALL include a descriptive label "Paru & Cité dans"
5. THE Media_Partners SHALL wrap responsively on smaller screens

### Requirement 8: Comprehensive Footer

**User Story:** As a user, I want to access additional site information and social links, so that I can explore more content and connect on social platforms.

#### Acceptance Criteria

1. THE Footer_Component SHALL display in a four-column grid layout
2. WHEN showing footer content, THE Footer_Component SHALL include brand, quick links, resources, and newsletter sections
3. THE Footer_Component SHALL provide social media icon buttons with hover effects
4. THE Footer_Component SHALL include copyright information and legal text
5. WHEN the viewport is responsive, THE Footer_Component SHALL adapt to 2 columns then 1 column

### Requirement 9: Visual Design System

**User Story:** As a visitor, I want a cohesive and professional visual experience, so that I can trust the expertise and quality of the content.

#### Acceptance Criteria

1. THE Homepage SHALL use specified color tokens for primary, accent, and text colors
2. THE Homepage SHALL implement Google Fonts (Playfair Display, Source Serif 4, DM Sans) consistently
3. THE Homepage SHALL maintain consistent spacing using 24px padding and 96px section padding
4. THE Homepage SHALL use smooth transitions (0.18s-0.28s ease) for all interactive elements
5. THE Homepage SHALL implement hover effects for buttons, cards, and links

### Requirement 10: Content Management

**User Story:** As a content manager, I want the homepage to display dynamic content from data sources, so that I can update information without code changes.

#### Acceptance Criteria

1. THE Homepage SHALL accept article data through component inputs or hardcoded arrays
2. THE Homepage SHALL display statistics data with configurable values and labels
3. THE Homepage SHALL render engagement data with all required fields
4. THE Homepage SHALL use Angular directives (*ngFor) for repeated content
5. THE Homepage SHALL implement lazy loading for images except hero portrait