# NZGDC Category Filter Overlay CSS Documentation

## Overview

The `category-filter-overlay.css` file provides comprehensive styling for the dropdown category filter system used across all NZGDC schedule widgets (Morning, Afternoon, and Thursday). This file implements a sophisticated dropdown overlay system with category-specific colors, accessibility features, and responsive design.

## File Usage

This CSS file is loaded by:
- `nzgdc-morning-schedule-widget-modular.js` - Morning widget loader
- `nzgdc-afternoon-schedule-widget-modular.js` - Afternoon widget loader
- `nzgdc-schedule-widget-modular.js` - Thursday widget loader
- Used in conjunction with widget-specific bundle CSS files

## Critical Design Principles

### Scoping Strategy
All styles are scoped to three main widget containers to prevent conflicts:
- `.nzgdc-morning-schedule-widget`
- `.nzgdc-afternoon-schedule-widget`
- `.nzgdc-schedule-widget`

### Non-Destructive Approach
- **NEVER** modifies existing filter classes in bundle CSS files
- Only adds **new** dropdown overlay functionality
- Preserves existing widget styling integrity

## Dropdown Overlay System

### Base Dropdown Container
```css
.category-dropdown-overlay
```
- **Purpose**: Main dropdown container positioned below filter area
- **Positioning**: Absolute, top: 100%, right: 0
- **Dimensions**: 300px width
- **Background**: White (#ffffff)
- **Shadow**: 0 4px 12px rgba(0, 0, 0, 0.15)
- **Z-index**: 1000 (above other content)
- **Initial State**: Hidden (opacity: 0, visibility: hidden)
- **Animation**: translateY(-10px) to translateY(0) on show

### Visibility Control
```css
.category-dropdown-overlay.visible
```
- **Purpose**: Show/hide state management
- **Visible State**: opacity: 1, visibility: visible, transform: translateY(0)
- **Hidden State**: opacity: 0, visibility: hidden, transform: translateY(-10px)

### Background Dimming
```css
.category-dropdown-backdrop
```
- **Purpose**: Dim background when dropdown is active
- **Coverage**: Fixed position covering full viewport
- **Background**: rgba(0, 0, 0, 0.15) semi-transparent overlay
- **Z-index**: 999 (below dropdown, above page content)
- **Initial State**: Hidden
- **Interaction**: Clicking backdrop closes dropdown

## Dropdown Items

### Individual Category Items
```css
.category-dropdown-item
```
- **Purpose**: Individual selectable category options
- **Layout**: Flex container, right-aligned content
- **Padding**: 12px 16px
- **Typography**: 14px, 600 weight, uppercase, right-aligned
- **Font**: "Futura PT Medium", "Futura", Arial, sans-serif
- **Cursor**: Pointer for interaction
- **Hover State**: Light gray background (#f8f9fa)
- **Focus State**: Blue outline for accessibility
- **Active State**: Light blue background (#e3f2fd), bold weight

## Category-Specific Color System

### All Events (Default/Reset)
```css
[data-category="ALL"]
```
- **Background**: #f8f9fa (light gray)
- **Text**: #333333 (dark gray)
- **Hover**: #e9ecef (darker gray)

### Game Design
```css
[data-category="GAME_DESIGN"]
```
- **Background**: #9ee6ab (light green)
- **Text**: #000000 (black)
- **Hover**: #8ee09b (darker green)

### Art
```css
[data-category="ART"]
```
- **Background**: #ffc999 (light orange)
- **Text**: #000000 (black)
- **Hover**: #ffbf89 (darker orange)

### Programming
```css
[data-category="PROGRAMMING"]
```
- **Background**: #ccf2f1 (light cyan)
- **Text**: #000000 (black)
- **Hover**: #bcecea (darker cyan)

### Audio
```css
[data-category="AUDIO"]
```
- **Background**: #197bff (blue)
- **Text**: #ffffff (white)
- **Hover**: #0969ef (darker blue)

### Story & Narrative
```css
[data-category="STORY_NARRATIVE"]
```
- **Background**: #fff47f (light yellow)
- **Text**: #000000 (black)
- **Hover**: #fff16f (darker yellow)

### Business & Marketing
```css
[data-category="BUSINESS_MARKETING"]
```
- **Background**: #e7f1ff (very light blue)
- **Text**: #000000 (black)
- **Hover**: #d7e8ff (darker light blue)

### Culture
```css
[data-category="CULTURE"]
```
- **Background**: #fac7d5 (light pink)
- **Text**: #000000 (black)
- **Hover**: #f8b7c5 (darker pink)

### Production & QA
```css
[data-category="PRODUCTION_QA"]
```
- **Background**: #512340 (dark purple)
- **Text**: #ffffff (white)
- **Hover**: #411d33 (darker purple)

### Realities (VR, AR, MR)
```css
[data-category="REALITIES_VR_AR_MR"]
```
- **Background**: #d1afff (light purple)
- **Text**: #000000 (black)
- **Hover**: #c99fff (darker light purple)

### Data, Testing or Research
```css
[data-category="DATA_TESTING_RESEARCH"]
```
- **Background**: #917b89 (muted purple-gray)
- **Text**: #ffffff (white)
- **Hover**: #816b79 (darker muted purple-gray)

### Serious & Educational Games
```css
[data-category="SERIOUS_EDUCATIONAL"]
```
- **Background**: #ffafaf (light red/pink)
- **Text**: #000000 (black)
- **Hover**: #ff9f9f (darker light red)

## Filter Value Enhancement

### Clickable Filter Area
```css
.nzgdc-*-filters-value[data-dropdown-trigger]
```
- **Purpose**: Make existing filter value area clickable
- **Cursor**: Pointer to indicate interaction
- **Hover**: Light gray background for non-active categories
- **Active Protection**: Prevents hover from overriding active category colors

### Active Category Prevention
- **Critical Fix**: Prevents hover states from overriding active category background colors
- **Implementation**: Hover only applies to non-active categories

## Category Filter Label Classes

### Purpose
Replace inline styles with CSS classes for better performance and maintainability.

### Implementation Pattern
```css
.category-{category-name}
```

### All Events
```css
.category-all-events
```
- **Background**: #ffffff (white)
- **Text**: #000000 (black)

### Game Design
```css
.category-game-design
```
- **Background**: #9ee6ab (light green)
- **Text**: #000000 (black)

### Art
```css
.category-art
```
- **Background**: #ffc999 (light orange)
- **Text**: #000000 (black)

### Programming
```css
.category-programming
```
- **Background**: #ccf2f1 (light cyan)
- **Text**: #000000 (black)

### Audio
```css
.category-audio
```
- **Background**: #197bff (blue)
- **Text**: #ffffff (white)

### Story & Narrative
```css
.category-story-narrative
```
- **Background**: #fff47f (light yellow)
- **Text**: #000000 (black)

### Business & Marketing
```css
.category-business-marketing
```
- **Background**: #e7f1ff (very light blue)
- **Text**: #000000 (black)

### Culture
```css
.category-culture
```
- **Background**: #fac7d5 (light pink)
- **Text**: #000000 (black)

### Production & QA
```css
.category-production-qa
```
- **Background**: #512340 (dark purple)
- **Text**: #ffffff (white)

### Realities (VR, AR, MR)
```css
.category-realities-vr-ar-mr
```
- **Background**: #d1afff (light purple)
- **Text**: #000000 (black)

### Data, Testing or Research
```css
.category-data-testing-research
```
- **Background**: #917b89 (muted purple-gray)
- **Text**: #ffffff (white)

### Serious & Educational Games
```css
.category-serious-educational
```
- **Background**: #ffafaf (light red/pink)
- **Text**: #000000 (black)

## Event Panel Filtering Classes

### Filtered Out Events
```css
.filtered-out
```
- **Purpose**: Grey out non-matching events during filtering
- **Effect**: opacity: 0.3, grayscale(70%)
- **Applies to**: All event panel containers
- **Category Badges**: Forced to #999999 background, white text
- **Text Elements**: Forced to #888888 color

### Filtered In Events
```css
.filtered-in
```
- **Purpose**: Highlight matching events during filtering
- **Effect**: opacity: 1, no filter, scale(1.02)
- **Shadow**: Blue shadow for emphasis
- **Applies to**: All event panel containers

### Text Color Overrides
Comprehensive text color management for filtered events across all text elements:
- Event titles
- Speaker names
- Event times
- Category badges

## Thursday Schedule Widget Integration

### Dropdown Items
Special color variations for Thursday widget:
- Data, Testing or Research: #ffb3ba (light pink) instead of muted purple
- Serious & Educational Games: #bae1ff (light blue) instead of light red

### Filter Label Colors
Thursday-specific filter label styling with !important declarations to ensure priority.

### Event Filtering
Thursday-specific event panel filtering including:
- Big event panels (.nzgdc-event-panel-big)
- Regular event panels (.nzgdc-event-panel-container)

## Responsive Design

### Tablet (≤768px)
- Dropdown width: 280px
- Right offset: 10px
- Item padding: 10px 14px
- Font size: 13px

### Mobile (≤480px)
- Dropdown width: 250px
- Right offset: 5px
- Item padding: 8px 12px
- Font size: 12px
- Touch-friendly active states

## Accessibility Features

### High Contrast Support
```css
@media (prefers-contrast: high)
```
- Enhanced shadow: rgba(0, 0, 0, 0.5)
- Improved visibility for users requiring high contrast

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce)
```
- Removes all transitions and transforms
- Provides static experience for motion-sensitive users
- Applies to overlay, backdrop, and item interactions

### Focus Management
- Proper focus states with blue outline
- Keyboard navigation support
- ARIA-compatible structure ready

## JavaScript Integration Points

### Data Attributes Used
- `data-category`: Category identification for styling
- `data-dropdown-trigger`: Marks clickable filter areas
- `data-active-category`: Indicates current active filter

### CSS Classes Applied by JavaScript
- `.visible`: Show/hide dropdown and backdrop
- `.active`: Mark selected dropdown items
- `.filtered-in` / `.filtered-out`: Event filtering states
- `.category-{name}`: Dynamic category styling

### Event Handling Integration
- Click handlers for dropdown items
- Backdrop click for closing
- Keyboard navigation support
- Category selection feedback

## Performance Considerations

### Optimization Features
- Scoped selectors prevent global style pollution
- Efficient CSS custom properties usage
- Minimal DOM manipulation required
- Responsive breakpoints optimize for device types
- Reduced motion preferences respected

### Memory Efficiency
- Single CSS file serves three widget types
- Shared color system across all widgets
- Minimal redundancy in style declarations
- Efficient selector specificity hierarchy

## Widget Compatibility Matrix

### Morning Schedule Widget
- Full dropdown system integration
- Yellow theme compatibility
- Category filtering with morning-specific classes

### Afternoon Schedule Widget
- Full dropdown system integration
- Blue theme compatibility
- Category filtering with afternoon-specific classes

### Thursday Schedule Widget
- Full dropdown system integration
- White/mixed theme compatibility
- Category filtering with thursday-specific classes
- Special color variations for some categories

## Error Prevention

### Style Isolation
- All selectors scoped to prevent conflicts
- No modification of existing bundle styles
- Defensive CSS for unknown states

### Fallback Handling
- Graceful degradation if JavaScript fails
- Proper initial states defined
- Error state styling included