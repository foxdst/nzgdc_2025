# NZGDC Widget CSS Documentation

## Overview

This directory contains comprehensive CSS styling for the NZGDC schedule widgets system. The CSS architecture is designed to support three distinct widgets (Morning, Afternoon, and Thursday) while maintaining consistency, preventing conflicts, and optimizing performance.

## CSS File Structure

### Core Files

| File | Purpose | Widgets | Priority |
|------|---------|---------|----------|
| `unified-event-panel.css` | Event panel styling (all formats) | All | 1st |
| `morning-schedule-bundle.css` | Morning widget layout & theme | Morning | 2nd |
| `afternoon-schedule-bundle.css` | Afternoon widget layout & theme | Afternoon | 2nd |
| `thursday-schedule-bundle.css` | Thursday widget layout & theme | Thursday | 2nd |
| `category-filter-overlay.css` | Dropdown filter system | All | 3rd |

### Loading Order

The CSS files are loaded in a specific order by each widget's JavaScript loader:

1. **Unified Event Panel** - Core event styling
2. **Widget Bundle** - Widget-specific layout and theme
3. **Category Filter Overlay** - Interactive filter system

## Architecture Principles

### 1. Centralized Event Styling
- **unified-event-panel.css** contains all event panel internal styling
- Prevents redundancy across widget bundles
- Ensures consistent event appearance across all widgets
- Supports both 620×300 (big) and 300×300 (square) panel formats

### 2. Widget-Specific Themes
- Each widget has its own theme bundle
- **Morning**: Yellow theme with black text
- **Afternoon**: Blue theme with white text
- **Thursday**: Mixed white/yellow/blue theme

### 3. Scoped Styling
All styles are scoped to prevent conflicts:
```css
.nzgdc-morning-schedule-widget { /* Morning styles */ }
.nzgdc-afternoon-schedule-widget { /* Afternoon styles */ }
.nzgdc-schedule-widget { /* Thursday styles */ }
```

### 4. Non-Destructive Overlays
- **category-filter-overlay.css** only adds new functionality
- Never modifies existing bundle styles
- Preserves widget integrity while adding features

## CSS Custom Properties System

### Shared Variables
Each widget bundle defines its own CSS custom properties for:
- **Colors**: Theme-specific color palettes
- **Typography**: Font families and hierarchies
- **Layout**: Container dimensions and spacing
- **Responsive**: Breakpoint-specific adjustments

### Example Usage
```css
.nzgdc-morning-schedule-widget {
  --color-yellow: rgba(255, 236, 81, 1);
  --color-blue: rgba(23, 75, 235, 1);
  --font-primary: "Futura PT Heavy", "Futura", Arial, sans-serif;
  --container-max-width: 1630px;
}
```

## Event Panel System

### Panel Formats

#### Big Panels (620×300px)
- **Usage**: Detailed events, workshops, main sessions
- **Layout**: Horizontal split (300px thumbnail + 320px details)
- **Content**: Category, title, speaker details, time, call-to-action
- **Files**: Styled in `unified-event-panel.css`

#### Square Panels (300×300px)
- **Usage**: Compact events, session summaries
- **Layout**: Vertical stack (category + title + thumbnail overlay)
- **Content**: Category, title, speaker info, call-to-action
- **Files**: Styled in `unified-event-panel.css`

### Category Color System
11 distinct event categories with specific color schemes:

| Category | Background | Text | Theme |
|----------|------------|------|--------|
| Game Design | #9ee6ab | Black | Light |
| Art | #ffc999 | Black | Light |
| Programming | #ccf2f1 | Black | Light |
| Audio | #197bff | White | Dark |
| Story & Narrative | #fff47f | Black | Light |
| Business & Marketing | #e7f1ff | Black | Light |
| Culture | #fac7d5 | Black | Light |
| Production & QA | #512340 | White | Dark |
| Realities (VR/AR/MR) | #d1afff | Black | Light |
| Data/Testing/Research | #917b89 | White | Dark |
| Serious & Educational | #ffafaf | Black | Light |

## Category Filter System

### Dropdown Implementation
- **File**: `category-filter-overlay.css`
- **Scope**: All three widgets
- **Features**: 
  - Dropdown overlay with category colors
  - Background dimming during interaction
  - Responsive design for mobile devices
  - Accessibility features (focus states, reduced motion)

### Filter States
- **Default**: "All Events" with neutral styling
- **Active**: Category-specific background colors
- **Hover**: Visual feedback for interaction
- **Mobile**: Touch-friendly sizing and behavior

### Event Filtering
```css
.filtered-out {
  opacity: 0.3;
  filter: grayscale(70%);
}

.filtered-in {
  opacity: 1;
  filter: none;
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}
```

## Widget-Specific Features

### Morning Schedule Widget
- **Theme**: Yellow background (#ffec51)
- **Navigation**: Morning (active) + Afternoon buttons
- **Typography**: Black text on yellow background
- **Special**: Break sections with black background

### Afternoon Schedule Widget
- **Theme**: Blue background (#174beb)
- **Navigation**: Morning + Afternoon (active) buttons
- **Typography**: White text on blue background
- **Special**: Break sections with black background

### Thursday Schedule Widget
- **Theme**: Mixed (white base, yellow/blue sections)
- **Navigation**: Filter only (no time navigation)
- **Layout**: Workshop-specific terminology
- **Special**: Flexible panel sizing, dual theme sections

## Responsive Design

### Breakpoint Strategy
```css
/* Large screens */
@media (max-width: 1680px) { /* Remove container padding */ }

/* Tablet */
@media (max-width: 1300px) { /* Stack event rows */ }

/* Mobile */
@media (max-width: 768px) { /* Typography scaling, layout adjustments */ }

/* Small mobile */
@media (max-width: 480px) { /* Aggressive space optimization */ }
```

### Responsive Features
- **Layout**: Event rows change from horizontal to vertical stacking
- **Typography**: Font sizes scale down appropriately
- **Interactive Elements**: Touch-friendly sizing on mobile
- **Content**: Maintains readability across all screen sizes

## Performance Optimizations

### CSS Architecture
- **Scoped Selectors**: Prevent global style pollution
- **Variable System**: Efficient color and typography management
- **Minimal Calculations**: Reduced use of calc() functions
- **Optimized Specificity**: Efficient selector hierarchy

### Loading Strategy
- **Critical CSS First**: Event panel styling loaded before layout
- **Bundle Separation**: Widget-specific styles only loaded when needed
- **Lazy Enhancement**: Filter overlays loaded after core functionality

### Memory Efficiency
- **Shared Styles**: Single unified file for all event panels
- **Variable Reuse**: Color system prevents duplication
- **Minimal Redundancy**: DRY principles throughout

## Accessibility Features

### Color Contrast
- **High Contrast**: All color combinations meet WCAG standards
- **Category Colors**: Carefully chosen for readability
- **Interactive States**: Clear visual feedback

### Motion and Animation
```css
@media (prefers-reduced-motion: reduce) {
  /* Remove all transitions and animations */
}
```

### Focus Management
- **Keyboard Navigation**: Proper focus states for all interactive elements
- **Screen Readers**: Semantic structure ready for ARIA labels
- **Touch Targets**: Adequate size for mobile accessibility

## Integration with JavaScript

### CSS Classes Applied by JavaScript
- **Category Classes**: `.category-{name}` for filter states
- **Visibility Classes**: `.visible`, `.hidden` for dynamic content
- **Filter Classes**: `.filtered-in`, `.filtered-out` for event filtering
- **State Classes**: `.loading`, `.error` for content states

### Data Attributes
- **data-category**: Event categorization for styling
- **data-dropdown-trigger**: Interactive element identification
- **data-active-category**: Current filter state
- **data-row**: Layout identification for special alignment

## Maintenance Guidelines

### Adding New Features
1. **Determine Scope**: Widget-specific or cross-widget functionality
2. **Choose File**: Add to appropriate CSS file based on scope
3. **Follow Conventions**: Use existing naming patterns and scoping
4. **Test Integration**: Verify compatibility with all affected widgets
5. **Update Documentation**: Document new features and usage

### Modifying Existing Styles
1. **Identify Impact**: Determine which widgets are affected
2. **Test Thoroughly**: Verify changes across all screen sizes
3. **Check Accessibility**: Ensure color contrast and usability
4. **Performance Review**: Verify no negative performance impact
5. **Cross-Browser Testing**: Test in all supported browsers

### Debugging Tips
1. **Use Dev Tools**: Inspect CSS variable inheritance and cascade
2. **Check Scoping**: Verify styles are properly scoped to widgets
3. **Test Responsiveness**: Use device emulation for mobile testing
4. **Validate Colors**: Use accessibility tools for contrast checking
5. **Performance Profiling**: Check for CSS performance bottlenecks

## File Documentation

Detailed documentation for each CSS file is available:

- **[unified-event-panel.css.md](unified-event-panel.css.md)** - Complete event panel system documentation
- **[morning-schedule-bundle.css.md](morning-schedule-bundle.css.md)** - Morning widget styling guide
- **[afternoon-schedule-bundle.css.md](afternoon-schedule-bundle.css.md)** - Afternoon widget styling guide
- **[thursday-schedule-bundle.css.md](thursday-schedule-bundle.css.md)** - Thursday widget styling guide
- **[category-filter-overlay.css.md](category-filter-overlay.css.md)** - Filter system documentation

Each documentation file includes:
- Comprehensive class and element descriptions
- JavaScript integration points
- Responsive behavior details
- Performance considerations
- Maintenance guidelines

## Browser Support

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### CSS Features Used
- **CSS Custom Properties**: For theme management
- **Flexbox**: For responsive layouts
- **CSS Grid**: Limited use for specific layouts
- **Media Queries**: For responsive design
- **Clip-path**: For arrow shapes (with fallbacks)

### Fallback Strategy
- **Font Fallbacks**: Arial fallback for Futura PT fonts
- **Color Fallbacks**: Hex colors as fallbacks for rgba()
- **Layout Fallbacks**: Flexbox with appropriate browser prefixes
- **Feature Detection**: Graceful degradation for unsupported features

## Contributing

When contributing to the CSS codebase:

1. **Read Documentation**: Review relevant .md files before making changes
2. **Follow Patterns**: Use existing naming conventions and structure
3. **Test Thoroughly**: Verify changes across all widgets and screen sizes
4. **Update Documentation**: Keep documentation current with changes
5. **Consider Performance**: Optimize for rendering and loading performance

## Questions and Support

For questions about the CSS architecture or specific implementations:
1. Check the relevant .md documentation file
2. Review the CSS file comments and structure
3. Test changes in isolation before integration
4. Consider the impact on all three widget types