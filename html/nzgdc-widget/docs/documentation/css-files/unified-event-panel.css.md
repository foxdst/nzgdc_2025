# NZGDC Unified Event Panel CSS Documentation

## Overview

The `unified-event-panel.css` file provides comprehensive styling for all event panels used across the NZGDC schedule widgets (Morning, Afternoon, and Thursday). This file centralizes event panel designs to prevent redundancy and ensure consistency across all widgets while supporting both large (620×300) and square (300×300) event panel formats.

## File Usage

This CSS file is loaded by:
- `nzgdc-morning-schedule-widget-modular.js` - Morning widget loader
- `nzgdc-afternoon-schedule-widget-modular.js` - Afternoon widget loader
- `nzgdc-schedule-widget-modular.js` - Thursday widget loader
- **Priority**: Loaded first before widget-specific bundle CSS files
- **Inheritance**: Widget bundles inherit layout, unified handles content styling

## Design Philosophy

### Centralized Event Panel System
- **Single Source**: All event panel styling centralized to prevent inconsistencies
- **Cross-Widget Compatibility**: Works seamlessly across all three widgets
- **Maintenance Efficiency**: Changes propagate to all widgets automatically
- **Design Consistency**: Ensures uniform event panel appearance

### Dual Format Support
- **Big Panels**: 620×300px horizontal format for detailed events
- **Square Panels**: 300×300px square format for compact events
- **Unified Styling**: Both formats share core design principles
- **Responsive Behavior**: Both formats adapt to screen sizes

## CSS Custom Properties (Variables)

### Typography Variables
```css
--font-family-demi: "Futura PT Demi", "Futura", Arial, sans-serif
--font-family-bold: "Futura PT Bold", "Futura", Arial, sans-serif
--font-family-heavy: "Futura PT Heavy", "Futura", Arial, sans-serif
--font-family-medium: "Futura PT Medium", "Futura", Arial, sans-serif
```

### Color Variables
```css
--color-primary: #f53e3e           /* Default category background */
--color-bg: rgba(255, 255, 255, 1) /* Panel background */
--color-overlay: rgba(0, 0, 0, 0.75) /* Image overlay */
--color-title: rgba(0, 0, 0, 1)    /* Title text */
--color-category-text: rgba(255, 255, 255, 1) /* Category text */
--color-intro: rgba(245, 45, 49, 1) /* Introduction text */
--color-speaker: rgba(255, 255, 255, 1) /* Speaker name */
--color-speaker-secondary: rgba(204, 204, 204, 1) /* Speaker position */
```

## Big Event Panels (620×300)

### Main Container
```css
.nzgdc-event-panel-big
```
- **Purpose**: Primary container for horizontal event panels
- **Dimensions**: 620px width × 300px height
- **Layout**: Flex row with centered alignment
- **Background**: White background
- **Structure**: Two-section layout (thumbnail + details)
- **Usage**: Detailed event presentations, workshops, sessions

### Thumbnail Section (Left Side)
```css
.nzgdc-event-panel-big-thumbnail
```
- **Purpose**: Image display area
- **Dimensions**: 300px × 300px (square within rectangle)
- **Background**: Cover image with center positioning
- **Overlay**: Semi-transparent overlay for content readability
- **Content**: Call-to-action elements over image

#### Session Thumbnail
```css
.nzgdc-session-thumbnail-big
```
- **Purpose**: Background image container
- **Position**: Absolute, full coverage
- **Z-index**: -1 (behind overlay)
- **Background**: Cover sizing, center positioning
- **Integration**: Dynamic image loading from event data

#### Detail Overlay
```css
.nzgdc-event-detail-overlay-big
```
- **Purpose**: Semi-transparent overlay for text content
- **Background**: rgba(0, 0, 0, 0.75) dark overlay
- **Layout**: Flex column, content justified to bottom
- **Padding**: 30px for comfortable text spacing
- **Content**: Call-to-action elements

### Call-to-Action Section
```css
.nzgdc-call-to-action-big
```
- **Purpose**: Interactive element encouraging engagement
- **Layout**: Flex column, centered alignment
- **Dimensions**: 260px width × 61px height
- **Gap**: 10px between elements
- **Cursor**: Pointer for interaction
- **Content**: Arrow marker + descriptive text

#### Open Marker
```css
.nzgdc-open-marker-big
```
- **Purpose**: Visual arrow indicating "click to open"
- **Dimensions**: 25px width × 20px height
- **Shape**: Triangle using clip-path polygon
- **Color**: White background
- **Style**: Upward-pointing triangle

#### CTA Text
```css
.nzgdc-cta-text-big
```
- **Purpose**: "Click to view details" or similar messaging
- **Typography**: 16px, 600 weight, center aligned
- **Color**: White text
- **Font**: Futura PT Heavy
- **Dimensions**: 260px width × 21px height

### Details Section (Right Side)
```css
.nzgdc-event-panel-big-details
```
- **Purpose**: Event information display area
- **Dimensions**: 320px width × 300px height
- **Layout**: Flex column structure
- **Content**: Category, title, speaker details, time
- **Overflow**: Hidden to prevent layout breaks

### Event Category
```css
.nzgdc-event-category-big
```
- **Purpose**: Event category identification badge
- **Dimensions**: 320px width × 30px height
- **Background**: Color-coded by category (see Category System)
- **Padding**: 4px 10px for text spacing
- **Layout**: Flex container, left-aligned content

#### Category Text
```css
.nzgdc-category-text-big
```
- **Typography**: 16px, 500 weight, uppercase
- **Color**: White or black (depends on category background)
- **Overflow**: Ellipsis for long category names
- **Font**: Futura PT Demi
- **Layout**: Full width with text-overflow handling

### Event Title
```css
.nzgdc-event-title-big
```
- **Purpose**: Event title display area
- **Background**: White background
- **Padding**: 8px 10px for comfortable reading
- **Layout**: Flex container, left-aligned content

#### Title Text
```css
.nzgdc-title-text-big
```
- **Typography**: 18px, 600 weight, left aligned
- **Color**: Black text
- **Font**: Futura PT Demi
- **Line Height**: 26px for multi-line titles
- **Overflow**: Word wrapping for long titles

### Speaker Details Section
```css
.nzgdc-event-speaker-details-big
```
- **Purpose**: Speaker information display area
- **Background**: Black background (#000)
- **Layout**: Flex column with space-between justification
- **Padding**: 10px all sides
- **Flex**: 1 (fills remaining space)
- **Gap**: 0.5rem between elements

#### Introduction Text
```css
.nzgdc-introduction-text-big
```
- **Purpose**: "Presented by" or similar introduction
- **Typography**: 14px, 600 weight, left aligned
- **Color**: Red (#f53e3e) for emphasis
- **Font**: Futura PT Heavy
- **Margin**: 0 for tight spacing

#### Speaker Details Container
```css
.nzgdc-speaker-details-big
```
- **Purpose**: Speaker name and position container
- **Layout**: Flex column with gap
- **Flex**: 1 (expandable area)
- **Gap**: 0.5rem between name and position
- **Overflow**: Hidden for long content

#### Speaker Bio Lines
```css
.nzgdc-speaker-biolines-big
```
- **Purpose**: Speaker name and position wrapper
- **Layout**: Flex column, vertically centered
- **Min-height**: 36px for consistent spacing
- **Justification**: Center alignment for content

#### Speaker Name
```css
.nzgdc-speaker-bioName-big
```
- **Typography**: 14px, 500 weight, italic style
- **Color**: White text
- **Font**: Futura PT Demi
- **Line Height**: 18px for readability
- **Style**: Italic for name emphasis

#### Speaker Position
```css
.nzgdc-speaker-bioPosition-big
```
- **Typography**: 14px, 400 weight, normal style
- **Color**: Light gray (#cccccc)
- **Font**: Futura PT Medium
- **Line Height**: 18px for consistency
- **Content**: Job title, company information

### Timeframe Section
```css
.nzgdc-timeframe-big
```
- **Purpose**: Event timing display area
- **Layout**: Flex column container
- **Min-height**: 21px for consistent sizing
- **Flex-shrink**: 0 (maintains size)

#### Timeframe Text
```css
.nzgdc-timeframe-text-big
```
- **Typography**: 16px, 600 weight, left aligned
- **Color**: Red (#f53e3e) for emphasis
- **Font**: Futura PT Heavy
- **Line Height**: 21px for single-line content
- **Content**: "10:00 - 11:30 AM" format

## Square Event Panels (300×300)

### Main Container
```css
.nzgdc-event-panel-main
```
- **Purpose**: Primary container for square event panels
- **Dimensions**: 300px width × 300px height
- **Layout**: Flex column structure
- **Background**: White background
- **Structure**: Three-section layout (category, title, thumbnail)
- **Usage**: Compact event presentations, session summaries

### Event Category (Top Section)
```css
.nzgdc-event-category-main
```
- **Purpose**: Category identification badge
- **Dimensions**: Full width × 30px height
- **Background**: Color-coded by category
- **Padding**: 4px 10px for text spacing
- **Position**: Top of panel, flex-shrink: 0

#### Category Text
```css
.nzgdc-category-text-main
```
- **Typography**: 16px, 500 weight, uppercase
- **Color**: White or black (category-dependent)
- **Font**: Futura PT Demi
- **Overflow**: Ellipsis for long names
- **Layout**: Full width with text-overflow management

### Event Title (Middle Section)
```css
.nzgdc-event-panel-title-main
```
- **Purpose**: Event title display area
- **Background**: White background
- **Padding**: 8px 10px for reading comfort
- **Layout**: Flex container, left-aligned
- **Flex-shrink**: 0 (maintains height)

#### Title Text
```css
.nzgdc-title-text-main
```
- **Typography**: 18px, 600 weight, left aligned
- **Color**: Black text
- **Font**: Futura PT Demi
- **Line Height**: 26px for multi-line support
- **Line Clamp**: 3 lines maximum (-webkit-line-clamp)
- **Overflow**: Hidden with ellipsis

### Event Thumbnail (Bottom Section)
```css
.nzgdc-event-panel-thumbnail-main
```
- **Purpose**: Image display area with overlay
- **Flex**: 1 (fills remaining space)
- **Position**: Relative for absolute children
- **Background**: Cover image with center positioning
- **Content**: Speaker details and call-to-action

#### Session Thumbnail
```css
.nzgdc-session-thumbnail-main
```
- **Purpose**: Background image container
- **Position**: Absolute, full coverage
- **Z-index**: -1 (behind overlay)
- **Background**: Cover sizing, center positioning

#### Event Panel Overlay
```css
.nzgdc-event-panel-overlay-main
```
- **Purpose**: Semi-transparent content overlay
- **Background**: rgba(0, 0, 0, 0.75) dark overlay
- **Layout**: Flex column, space-between justification
- **Padding**: 15px all sides
- **Position**: Absolute, full coverage

### Speaker Details (Within Overlay)
```css
.nzgdc-speaker-details-main
```
- **Purpose**: Speaker information container
- **Layout**: Flex column with gap
- **Gap**: 5px between elements
- **Content**: Speaker name and position

#### Speaker Name
```css
.nzgdc-speaker-name-main
```
- **Typography**: 18px, 500 weight, italic style
- **Color**: White text
- **Font**: Futura PT Demi
- **Line Height**: 23px for readability

#### Speaker Position/Company
```css
.nzgdc-speaker-position-company-main
```
- **Typography**: 18px, 400 weight, normal style
- **Color**: Light gray (#cccccc)
- **Font**: Futura PT Medium
- **Line Height**: 23px for consistency

### Call-to-Action (Bottom of Overlay)
```css
.nzgdc-call-to-action-main
```
- **Purpose**: Interactive engagement element
- **Layout**: Flex column, centered alignment
- **Gap**: 8px between elements
- **Cursor**: Pointer for interaction

#### Open Marker
```css
.nzgdc-open-marker-main
```
- **Purpose**: Visual arrow indicator
- **Dimensions**: 20px width × 16px height
- **Shape**: Triangle using clip-path polygon
- **Color**: White background
- **Style**: Upward-pointing triangle

#### CTA Text
```css
.nzgdc-cta-text-main
```
- **Typography**: 16px, 600 weight, center aligned
- **Color**: White text
- **Font**: Futura PT Heavy
- **Line Height**: 21px for single-line content

## Loading and Error States

### Loading Placeholder
```css
.nzgdc-loading-placeholder
```
- **Purpose**: Display during content loading
- **Background**: Light gray (#f0f0f0)
- **Layout**: Flex centered alignment
- **Typography**: 16px, medium font, gray text
- **Border**: 1px solid gray (#ddd)
- **Content**: Loading message or spinner
- **Dimensions**: Full container size

### Error Placeholder
```css
.nzgdc-error-placeholder
```
- **Purpose**: Display error messages
- **Background**: Light red (#ffe6e6)
- **Layout**: Flex column, centered alignment
- **Typography**: 14px, medium font, red text
- **Border**: 1px solid light red (#ffcccc)
- **Content**: Error message and retry options
- **Dimensions**: Full container size

## Event Category System

### Category Color Implementation
The unified system supports 11 distinct event categories with specific color schemes:

### Game Design
```css
[data-category="GAME_DESIGN"]
```
- **Background**: #9ee6ab (light green)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

### Art
```css
[data-category="ART"]
```
- **Background**: #ffc999 (light orange)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

### Programming
```css
[data-category="PROGRAMMING"]
```
- **Background**: #ccf2f1 (light cyan)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

### Audio
```css
[data-category="AUDIO"]
```
- **Background**: #197bff (blue)
- **Text Color**: #ffffff (white)
- **Theme**: Dark background, light text

### Story & Narrative
```css
[data-category="STORY_NARRATIVE"]
```
- **Background**: #fff47f (light yellow)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

### Business & Marketing
```css
[data-category="BUSINESS_MARKETING"]
```
- **Background**: #e7f1ff (very light blue)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

### Culture
```css
[data-category="CULTURE"]
```
- **Background**: #fac7d5 (light pink)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

### Production & QA
```css
[data-category="PRODUCTION_QA"]
```
- **Background**: #512340 (dark purple)
- **Text Color**: #ffffff (white)
- **Theme**: Dark background, light text

### Realities (VR, AR, MR)
```css
[data-category="REALITIES_VR_AR_MR"]
```
- **Background**: #d1afff (light purple)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

### Data, Testing or Research
```css
[data-category="DATA_TESTING_RESEARCH"]
```
- **Background**: #917b89 (muted purple-gray)
- **Text Color**: #ffffff (white)
- **Theme**: Dark background, light text

### Serious & Educational Games
```css
[data-category="SERIOUS_EDUCATIONAL"]
```
- **Background**: #ffafaf (light red/pink)
- **Text Color**: #000000 (black)
- **Theme**: Light background, dark text

## Responsive Design

### Tablet and Mobile (≤768px)
#### Big Panels
- **Layout**: Changes to column layout (stacked sections)
- **Thumbnail**: Reduces to 200px height
- **Width**: Full width adaptation
- **Content**: Maintains readability

#### Square Panels
- **Dimensions**: Maintains square aspect ratio
- **Content**: Scales typography appropriately
- **Layout**: Preserves three-section structure

#### Typography Scaling
- **Title Text**: Scales to 16px for better mobile readability
- **Category Text**: Reduces to 14px
- **Line Heights**: Adjusted to 22px for titles

### Mobile (≤480px)
#### Layout Adaptations
- **Margins**: 10px margins for both panel types
- **Padding**: Reduced internal padding
- **Typography**: Further scaling for small screens

#### Touch Optimization
- **Speaker Text**: Scales to 16px for touch readability
- **Interactive Areas**: Maintained size for touch targets
- **Line Heights**: Optimized for mobile reading

## Panel Isolation System

### Non-Category Panel Fallbacks
```css
.nzgdc-event-panel-big:not([data-category])
.nzgdc-event-panel-main:not([data-category])
```
- **Purpose**: Maintain original design for panels without category data
- **Category Element**: Falls back to default red background
- **Overlay Elements**: Preserves original overlay styling
- **Call-to-Action**: Maintains white text/background
- **Priority**: !important declarations ensure fallback priority

### Design Preservation
- **Overlay Compatibility**: Category system only affects category elements
- **Original Design**: Non-category panels remain unchanged
- **Graceful Degradation**: Works without category data
- **Backward Compatibility**: Supports legacy event data

## JavaScript Integration Points

### Data Attributes Used
- **data-category**: Category identification for color system
- **Dynamic Application**: Applied by JavaScript during panel creation
- **Category Mapping**: Maps event data to CSS category classes

### Dynamic Content Loading
- **Background Images**: Loaded via CSS background-image property
- **Text Content**: Populated via innerHTML or textContent
- **Category Classes**: Applied dynamically based on event data
- **State Management**: Loading/error states managed via CSS classes

### Interactive Elements
- **Click Handlers**: Applied to .nzgdc-call-to-action-* elements
- **Hover States**: CSS-only hover effects for better performance
- **Focus Management**: Keyboard navigation support ready
- **Touch Events**: Optimized for mobile interaction

## Performance Considerations

### Optimization Features
- **CSS Variables**: Efficient color and typography management
- **Centralized Styles**: Reduces CSS redundancy across widgets
- **Hardware Acceleration**: Transforms optimized for GPU rendering
- **Efficient Selectors**: Optimal specificity hierarchy

### Loading Performance
- **Critical CSS**: Essential styles loaded first
- **Lazy Loading**: Compatible with image lazy loading
- **Minimal Reflow**: Layout patterns minimize browser reflow
- **Font Loading**: Optimized font fallback cascade

### Memory Efficiency
- **Shared Styles**: Single CSS file serves multiple widgets
- **Variable Reuse**: Color and typography variables prevent duplication
- **Selector Efficiency**: Minimal redundancy in style declarations

## Cross-Widget Compatibility

### Morning Schedule Widget
- **Integration**: Full compatibility with yellow theme
- **Panel Types**: Supports both big and square panels
- **Category System**: Works with morning-specific interactions

### Afternoon Schedule Widget
- **Integration**: Full compatibility with blue theme
- **Panel Types**: Supports both big and square panels
- **Category System**: Works with afternoon-specific interactions

### Thursday Schedule Widget
- **Integration**: Full compatibility with mixed theme
- **Panel Types**: Primarily uses big panels for workshops
- **Category System**: Includes special color variations

## Maintenance Guidelines

### Adding New Categories
1. **Add data-category selector**: Follow existing pattern
2. **Define background color**: Choose appropriate color
3. **Set text color**: Ensure adequate contrast
4. **Test across widgets**: Verify appearance in all three widgets
5. **Update documentation**: Document new category

### Modifying Panel Layouts
1. **Test both formats**: Changes must work for big and square panels
2. **Check responsive behavior**: Verify mobile adaptations
3. **Validate cross-widget**: Test in all three widget types
4. **Performance impact**: Ensure changes don't affect rendering performance

### Debugging Tips
1. **Use browser dev tools**: Inspect CSS variable inheritance
2. **Test category isolation**: Verify non-category panels still work
3. **Check responsive breakpoints**: Test layout at different screen sizes
4. **Validate color contrast**: Ensure accessibility standards are met