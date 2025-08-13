# Unified Event Panel Template Documentation

## Overview

The `unified-event-panel.html` file serves as the centralized HTML template for all event panel components across the NZGDC widget system. This template defines the standardized structure for event panels used by Thursday, Morning, and Afternoon schedule widgets.

## File Location

```
JS Embed/html/nzgdc-widget/templates/unified-event-panel.html
```

## Purpose

This template provides a unified HTML structure that can be dynamically populated with event data and styled consistently across all three widget types. It eliminates code duplication and ensures visual consistency while allowing for widget-specific customizations through CSS classes.

## Template Structure

### Root Container
```html
<div class="nzgdc-event-panel-big">
```
- **Class**: `nzgdc-event-panel-big`
- **Purpose**: Main container for the event panel
- **Usage**: Applied to all "big" event panels (620x300px)

### Left Side - Event Thumbnail
```html
<div class="nzgdc-event-panel-big-thumbnail">
    <div class="nzgdc-session-thumbnail-big"></div>
    <div class="nzgdc-event-detail-overlay-big">
        <div class="nzgdc-call-to-action-big">
            <div class="nzgdc-open-marker-big"></div>
            <div class="nzgdc-cta-text-big">Click for More Event Details</div>
        </div>
    </div>
</div>
```

#### Components:
- **`nzgdc-event-panel-big-thumbnail`**: Container for the thumbnail section
- **`nzgdc-session-thumbnail-big`**: Background image container for event thumbnails
- **`nzgdc-event-detail-overlay-big`**: Overlay container for interactive elements
- **`nzgdc-call-to-action-big`**: CTA section with hover effects
- **`nzgdc-open-marker-big`**: Visual indicator (typically a triangle or arrow)
- **`nzgdc-cta-text-big`**: Text prompt for user interaction

### Right Side - Event Details
```html
<div class="nzgdc-event-panel-big-details">
    <!-- Category Section -->
    <div class="nzgdc-event-category-big">
        <div class="nzgdc-category-text-big"></div>
    </div>
    
    <!-- Title Section -->
    <div class="nzgdc-event-title-big">
        <div class="nzgdc-title-text-big"></div>
    </div>
    
    <!-- Speaker Details Section -->
    <div class="nzgdc-event-speaker-details-big">
        <div class="nzgdc-introduction-text-big">NZGDC 2025 Event by</div>
        <div class="nzgdc-speaker-details-big">
            <!-- Multiple speaker containers -->
        </div>
        <div class="nzgdc-timeframe-big">
            <div class="nzgdc-timeframe-text-big"></div>
        </div>
    </div>
</div>
```

#### Components:
- **`nzgdc-event-panel-big-details`**: Main container for text content
- **`nzgdc-event-category-big`**: Event category label container
- **`nzgdc-category-text-big`**: Category text content
- **`nzgdc-event-title-big`**: Event title container
- **`nzgdc-title-text-big`**: Title text content
- **`nzgdc-event-speaker-details-big`**: Speaker information container
- **`nzgdc-introduction-text-big`**: Static introduction text
- **`nzgdc-speaker-details-big`**: Container for all speaker information
- **`nzgdc-speaker-biolines-big`**: Individual speaker container (up to 3)
- **`nzgdc-speaker-bioName-big`**: Speaker name
- **`nzgdc-speaker-bioPosition-big`**: Speaker position/company
- **`nzgdc-timeframe-big`**: Event duration container
- **`nzgdc-timeframe-text-big`**: Duration text content

## Usage in Widget System

### JavaScript Integration

The template is loaded and utilized by the `UnifiedEventLoader` class:

```javascript
// Located in: js/unified-event-loader.js
class UnifiedEventLoader {
    async loadTemplate() {
        const response = await fetch(`${this.basePath}templates/unified-event-panel.html`);
        this.template = await response.text();
    }
}
```

### Template Population Process

1. **Template Loading**: The HTML template is fetched and stored in memory
2. **Dynamic Population**: Event data is injected into specific elements using `querySelector`
3. **Widget-Specific Styling**: CSS classes are modified based on widget type and panel size

### Widget-Specific Adaptations

#### Thursday Schedule Widget
- Uses standard template structure
- Populates with workshop event data from `WORKSHOP_EVENTS`
- Styled with Thursday-specific CSS bundle

#### Morning Schedule Widget
- Adapts template for morning events
- Uses `MORNING_EVENTS` data source
- Supports both "big" and "main" panel variations
- Styled with morning-specific CSS bundle

#### Afternoon Schedule Widget
- Similar to morning widget structure
- Uses `AFTERNOON_EVENTS` data source
- Blue-themed styling variations
- Styled with afternoon-specific CSS bundle

## Dynamic Content Population

### Data Injection Points

The template provides specific elements that are populated dynamically:

```javascript
// Example population logic
panel.querySelector('.nzgdc-category-text-big').textContent = eventData.category;
panel.querySelector('.nzgdc-title-text-big').textContent = eventData.title;
panel.querySelector('.nzgdc-timeframe-text-big').textContent = eventData.timeframe;
```

### Speaker Information Handling

The template supports up to 3 speakers with this structure:
```html
<div class="nzgdc-speaker-biolines-big">
    <div class="nzgdc-speaker-bioName-big"></div>
    <div class="nzgdc-speaker-bioPosition-big"></div>
</div>
```

### Category System Integration

The template integrates with the Event Categories system through:
- Dynamic background color application
- Category-specific overlay brightness adjustments
- Accessibility-compliant contrast handling

## CSS Styling Dependencies

The template relies on these CSS files for proper rendering:

1. **`unified-event-panel.css`**: Core component styles
2. **Widget-specific bundles**:
   - `thursday-schedule-bundle.css`
   - `morning-schedule-bundle.css`
   - `afternoon-schedule-bundle.css`
3. **`category-filter-overlay.css`**: Category-specific styling

## Responsive Design Considerations

The template structure supports responsive behavior through:
- Flexible container dimensions
- Scalable typography classes
- Adaptive thumbnail sizing
- Mobile-friendly touch targets

## Accessibility Features

### Semantic Structure
- Proper heading hierarchy through nested divs
- Logical content flow from category to title to speakers
- Clear call-to-action text

### Interactive Elements
- CTA overlay provides clear interaction guidance
- Focus-friendly element structure
- Screen reader compatible content organization

## Template Variations

### Panel Size Adaptations

The template supports different panel sizes through class naming conventions:
- **Big Panels** (620x300): `.nzgdc-*-big`
- **Main Panels** (300x300): `.nzgdc-*-main` (generated variations)

### Widget Type Customizations

Different widgets apply specific styling through container classes:
- `.nzgdc-schedule-widget` (Thursday)
- `.nzgdc-morning-schedule-widget` (Morning)
- `.nzgdc-afternoon-schedule-widget` (Afternoon)

## Error Handling

### Missing Template Fallback
If the template fails to load, the system falls back to:
1. Embedded template in JavaScript (`window.UNIFIED_EVENT_PANEL_TEMPLATE`)
2. Minimal HTML structure generation
3. Error logging for debugging

### Content Validation
The template handles missing or invalid data gracefully:
- Empty speaker slots are hidden
- Missing categories default to "PROGRAMMING"
- Fallback text for missing titles or descriptions

## Performance Considerations

### Template Caching
- Template loaded once and cached in memory
- Cloned for each panel instance to avoid re-fetching
- Minimal DOM manipulation during population

### Batch Processing
- Multiple panels created from single template
- Efficient element querying and population
- Optimized for rendering large event lists

## Development and Testing

### Test Files Utilizing Template
1. **`event-categories-test-demo.html`**: Category system validation
2. **`dropdown-filter-test.html`**: Filter functionality testing
3. **`widget-demo.html`**: General widget functionality
4. **`cross-widget-height-consistency-test.html`**: Layout consistency

### Debugging Support
The template supports debugging through:
- `window.NZGDC_DEBUG` flag integration
- Console logging during population
- Element attribute tracking for debugging

## Future Extensibility

The template design allows for:
- Additional speaker slots beyond the current 3
- New event metadata fields
- Alternative panel layouts
- Enhanced interactive elements

## Integration Points

### Data Sources
- `WORKSHOP_EVENTS` (Thursday)
- `MORNING_EVENTS` (Morning)  
- `AFTERNOON_EVENTS` (Afternoon)

### JavaScript Classes
- `UnifiedEventLoader`: Template loading and population
- `NZGDCWidget`: Thursday widget implementation
- `NZGDCMorningWidget`: Morning widget implementation
- `NZGDCAfternoonWidget`: Afternoon widget implementation

### CSS Dependencies
- Unified event panel component styles
- Widget-specific layout and positioning
- Category-based dynamic styling
- Responsive breakpoint definitions

This template serves as the foundation for consistent, scalable, and maintainable event panel rendering across the entire NZGDC widget ecosystem.