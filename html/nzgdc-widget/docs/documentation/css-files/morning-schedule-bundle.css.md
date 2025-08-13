# NZGDC Morning Schedule Widget CSS Documentation

## Overview

The `morning-schedule-bundle.css` file provides comprehensive styling for the NZGDC Morning Schedule Widget. This CSS bundle is specifically designed for the morning events display with a yellow theme and contains all necessary styles for layout, typography, colors, and responsive behavior.

## File Usage

This CSS file is loaded by:
- `nzgdc-morning-schedule-widget-modular.js` - Main widget loader
- Used in conjunction with `unified-event-panel.css` and `category-filter-overlay.css`

## CSS Custom Properties (Variables)

### Color Variables
```css
--color-yellow: rgba(255, 236, 81, 1)        /* Primary yellow background */
--color-yellow-bright: rgba(240, 223, 86, 1) /* Active button state */
--color-yellow-hover: rgba(255, 226, 61, 1)  /* Hover state for buttons */
--color-blue: rgba(23, 75, 235, 1)           /* Afternoon events button */
--color-blue-hover: rgba(20, 65, 200, 1)     /* Blue hover state */
--color-white: rgba(255, 255, 255, 1)        /* Text and backgrounds */
--color-black: rgba(0, 0, 0, 1)              /* Text and break backgrounds */
--color-gray-light: #f0f0f0                  /* Loading states */
--color-gray-medium: #666                    /* Loading text */
--color-gray-border: #ddd                    /* Borders */
```

### Typography Variables
```css
--font-primary: "Futura PT Heavy", "Futura", Arial, sans-serif
--font-medium: "Futura PT Medium", "Futura", Arial, sans-serif
```

### Layout Variables
```css
--container-max-width: 1630px               /* Maximum widget width */
--event-panel-width: 620px                  /* Wide event panel width */
--event-panel-height: 300px                 /* Event panel height */
```

## Main Container Classes

### `.nzgdc-morning-schedule-widget`
- **Purpose**: Root container for the entire morning schedule widget
- **Theme**: Yellow background theme (distinct from afternoon blue)
- **Layout**: Flexbox container with overflow hidden
- **Dimensions**: Full width, max-width 1630px, auto height
- **Box Model**: Border-box with margin/padding reset

## Navigation Components

### Top Navigation Bar
```css
.nzgdc-morning-schedule-sub-navigation
```
- **Purpose**: Contains time navigation buttons and filter controls
- **Layout**: Flex container with space-between alignment
- **Background**: White (neutral background)
- **Height**: Minimum 60px for consistent button sizing
- **Positioning**: Top of widget, full width

### Time Navigation Buttons

#### `.nzgdc-morning-events-button`
- **Purpose**: Navigation button for morning events (active state)
- **Theme**: Yellow-bright background (active action)
- **State**: Active/selected state indicating current view
- **Typography**: 28px, 800 weight, uppercase, black text
- **Hover**: Yellow-hover background (255, 226, 61)
- **Layout**: Flex column, centered alignment
- **Padding**: 10px 15px
- **Transition**: 0.3s background-color ease

#### `.nzgdc-afternoon-events-button`
- **Purpose**: Navigation button to switch to afternoon events
- **Theme**: Blue background (secondary action)
- **State**: Normal state button
- **Typography**: 28px, 800 weight, uppercase, white text
- **Hover**: Blue-hover background
- **Layout**: Flex column, centered alignment
- **Interaction**: Switches to afternoon widget view

### Filter Section

#### `.nzgdc-morning-filters-section`
- **Purpose**: Container for category filter controls
- **Layout**: Flex container aligned to stretch
- **Position**: Top right of navigation bar
- **Min-height**: 60px to match navigation buttons

#### `.nzgdc-morning-filters-label`
- **Purpose**: Filter label display area
- **Background**: Yellow-bright theme (consistent with morning button)
- **Typography**: 28px, 600 weight, black text
- **Alignment**: Centered flex column
- **Padding**: 5px 15px
- **Content**: "FILTER BY" or similar label text

#### `.nzgdc-morning-filters-value`
- **Purpose**: Current filter value display and interaction area
- **Background**: White (readable contrast)
- **Typography**: 28px, 600 weight, black text, uppercase
- **Interaction**: Clickable for dropdown trigger
- **Gap**: 10px between text and potential icons
- **Box Model**: 5px 15px padding

## Time Category Sections

### Time Category Containers
```css
.nzgdc-morning-time-category-early   /* Early morning sessions */
.nzgdc-morning-time-category-mid     /* Mid morning sessions */
```
- **Purpose**: Group events by time periods (e.g., 9:00-10:30, 11:00-12:30)
- **Background**: Yellow theme for both categories
- **Layout**: Full width containers
- **Theme Consistency**: Both use same yellow background

### Session Schedule Headers
```css
.nzgdc-morning-session-schedule
```
- **Purpose**: Display session time and title information
- **Layout**: Flex container with space-between alignment
- **Dimensions**: Height 46px, margin 17px 0 10px 0
- **Typography**: 36px, 800 weight, black text (yellow theme)
- **Padding**: 0 25px horizontal
- **Overflow**: Hidden to prevent layout breaks

### Session Text Elements
```css
.nzgdc-morning-session-times     /* Time display (e.g., "09:00 - 10:30") */
.nzgdc-morning-session-title     /* Session title (e.g., "MORNING SESSIONS") */
```
- **Typography**: 36px, 800 weight, center aligned
- **Color**: Black text on yellow background (high contrast)
- **Theme**: Consistent across both time categories
- **Layout**: Auto width, 43px height containers

### Session Text Container
```css
.nzgdc-morning-session-text
```
- **Purpose**: Wrapper for session text elements
- **Layout**: Flex container for vertical centering
- **Dimensions**: Auto width, 43px height
- **Alignment**: Center-aligned flex items

### Underline Elements
```css
.nzgdc-morning-underline
```
- **Purpose**: Visual separator under session headers
- **Dimensions**: calc(100% - 50px) width, 5px height
- **Color**: Black background (consistent with text color)
- **Layout**: Centered block element with auto margins
- **Visual Effect**: Creates separation between header and events

## Event Time Containers

### Time Display Sections
```css
.nzgdc-morning-event-times-early
.nzgdc-morning-event-times-mid
```
- **Purpose**: Display time information for each session period
- **Layout**: Flex column, centered alignment
- **Dimensions**: Full width, 81px height
- **Background**: Yellow theme (consistent with category)
- **Gap**: 5px between child elements
- **Content**: Contains time text and underline elements

## Event Layout Structure

### Event Container
```css
.nzgdc-scheduled-morning-events
```
- **Purpose**: Main container for all morning events
- **Padding**: 40px all sides (generous spacing)
- **Background**: Inherits from parent (yellow)
- **Layout**: Block container for event rows
- **Box Model**: Border-box sizing

### Event Rows
```css
.nzgdc-morning-event-row
```
- **Purpose**: Horizontal layout for event panels
- **Layout**: Flex container, centered alignment
- **Gap**: 20px between panels
- **Margin**: 0 0 40px 0 (bottom spacing between rows)
- **Min-height**: 300px (matches event panel height)
- **Responsive**: Changes to column layout on smaller screens

#### Big Panel Alignment
```css
.nzgdc-morning-event-row[data-row^="big"]
```
- **Purpose**: Special alignment for larger event panels (620px wide)
- **Layout**: Left-aligned instead of centered
- **Calculation**: Uses calc() to align with main panel grid
- **Margin**: Calculated left margin to maintain visual alignment

### Event Panel Containers

#### Standard Event Container
```css
.nzgdc-morning-event
```
- **Purpose**: Container for standard wide event panels
- **Dimensions**: 620px × 300px (wide format)
- **Layout**: Flex 0 0 auto (no grow/shrink)
- **Max-width**: Matches event panel width variable

#### Square Event Container
```css
.nzgdc-morning-event-main
```
- **Purpose**: Container for square event panels
- **Dimensions**: 300px × 300px (square format)
- **Layout**: Flex 0 0 auto (no grow/shrink)
- **Use Case**: For events that need different aspect ratio

### Event Panel Wrappers

#### Standard Wrapper
```css
.nzgdc-morning-event-panel-container
```
- **Purpose**: Contain standard event panel content
- **Dimensions**: 620px × 300px
- **Overflow**: Hidden to prevent content spillover
- **Position**: Relative for absolute child positioning

#### Square Wrapper
```css
.nzgdc-morning-event-panel-main-container
```
- **Purpose**: Contain square event panel content
- **Dimensions**: 300px × 300px
- **Overflow**: Hidden to prevent content spillover
- **Position**: Relative for absolute child positioning

## Break Schedule Styling

### `.nzgdc-break-schedule`
- **Purpose**: Display break/intermission information
- **Layout**: Flex column, centered alignment
- **Dimensions**: Full width, 233px height
- **Background**: Black (high contrast with yellow theme)
- **Gap**: 10px between elements
- **Positioning**: Centered with auto margins

#### Break Schedule Elements
```css
.nzgdc-break-schedule h2    /* Break title */
.nzgdc-break-schedule p     /* Break description */
```
- **H2 Styling**: 
  - 48px font size, 800 weight
  - Uppercase transformation
  - White text on black background
  - Zero margins/padding
- **P Styling**:
  - 24px font size, 400 weight
  - White text on black background
  - Medium font family
  - Zero margins/padding

## Footer Navigation

### Footer Container
```css
.nzgdc-morning-schedule-footer-navigation
```
- **Purpose**: Bottom navigation area
- **Layout**: Flex start alignment
- **Background**: White (neutral)
- **Width**: Full width
- **Position**: Bottom of widget

### Back to Top Button
```css
.nzgdc-morning-back-to-top
```
- **Purpose**: Navigation button to return to top of page
- **Theme**: Yellow background with black text (morning theme)
- **Typography**: 28px, 600 weight, uppercase
- **Padding**: 8px 15px
- **Hover**: Yellow-bright background
- **Transition**: 0.3s background-color ease
- **Layout**: Flex column, centered content
- **Cursor**: Pointer for interaction

## Loading and Error States

### Loading Placeholder
```css
.nzgdc-morning-loading-placeholder
```
- **Purpose**: Display during content loading
- **Background**: Light gray (#f0f0f0)
- **Layout**: Flex centered alignment
- **Typography**: 16px, medium font, gray text
- **Border**: 1px solid gray border
- **Content**: Loading message and/or spinner
- **Size**: Full width/height of container

### Error Placeholder
```css
.nzgdc-morning-error-placeholder
```
- **Purpose**: Display error messages
- **Background**: Light red (#ffe6e6)
- **Layout**: Flex column, centered alignment
- **Typography**: 14px, medium font, red text
- **Border**: 1px solid light red border
- **Content**: Error message and potential retry options
- **Size**: Full width/height of container

## Responsive Design

### Breakpoint: ≤1680px
- **Change**: Remove padding from main container
- **Reason**: Optimize space on large screens

### Breakpoint: ≤1300px
- **Changes**: 
  - Event rows change to column layout
  - Height becomes auto
  - Gap maintained at 20px
- **Impact**: Stacked event panels instead of horizontal

### Breakpoint: ≤768px
- **Session Schedules**: 
  - Change to column layout
  - Typography scales down to 24px
  - Center text alignment
  - Auto height with 10px gap
- **Container Changes**:
  - Padding reduced to 20px
  - Event row margins reduced to 20px
- **Button Changes**:
  - Back to top button full width
  - Font size maintained at 28px

### Breakpoint: ≤480px
- **Extreme Space Optimization**:
  - All padding reduced to 10px minimum
  - Scheduled events padding: 10px
  - Filter section padding: 10px 15px
- **Typography Scaling**:
  - Filter label: 24px (down from 28px)
  - Filter value: 22px (down from 28px)
- **Container**: Remove all padding

## Theme Integration

### Yellow Theme Characteristics
- **Primary**: Yellow background for main areas
- **Secondary**: White backgrounds for content areas
- **Accent**: Blue for afternoon events button
- **Text Contrast**: Black on yellow, white on black
- **Interactive States**: Yellow-bright for active, yellow-hover for hover

### Color Psychology
- **Yellow**: Energy, optimism, morning freshness
- **Black Text**: High contrast, readability
- **White Sections**: Clean, organized content areas

### Integration with Other CSS Files

#### unified-event-panel.css
- **Provides**: Event panel internal styling
- **Relationship**: Morning bundle handles layout, unified handles content
- **Inheritance**: Event panels inherit container dimensions

#### category-filter-overlay.css
- **Provides**: Dropdown filter functionality
- **Relationship**: Overlay styles work with morning filter sections
- **Scoping**: All morning-specific interactions handled

#### Scoping Strategy
- **All styles scoped to**: `.nzgdc-morning-schedule-widget`
- **Prevents conflicts**: With afternoon and thursday widgets
- **Allows coexistence**: Multiple widgets on same page

## JavaScript Integration Points

### CSS Classes Applied by JavaScript

#### Dynamic Category Classes
- Applied to filter value elements
- Format: `.category-{category-name}`
- Purpose: Visual feedback for active filters

#### Navigation State Management
- Button active/inactive states
- Loading state classes during transitions
- Error state classes for failed loads

#### Panel Visibility Control
- Show/hide classes for filtered content
- Animation classes for smooth transitions
- Loading placeholders during data fetch

### Data Attributes Used

#### Layout Control
- `data-row`: Row identification for special layouts
- `data-row^="big"`: Special alignment for wide panels

#### Filtering System
- `data-category`: Event categorization for filtering
- `data-dropdown-trigger`: Marks clickable filter areas
- `data-active-category`: Indicates current active filter

#### State Management
- Loading states
- Error states
- Content availability states

### Event Handling Integration

#### Click Handlers
- Morning/afternoon navigation buttons
- Back to top functionality
- Filter dropdown interactions

#### Scroll Behavior
- Back to top smooth scrolling
- Section navigation
- Responsive layout adjustments

## Performance Considerations

### Optimization Features
- **CSS Custom Properties**: Efficient theme management
- **Flexbox Layouts**: Responsive behavior without JavaScript
- **Scoped Selectors**: Prevent style conflicts and improve performance
- **Minimal Calculations**: Only where necessary (e.g., alignment)

### Rendering Performance
- **Hardware Acceleration**: Transforms and transitions optimized
- **Reflow Minimization**: Efficient layout patterns
- **Paint Optimization**: Color and background optimizations

### Memory Efficiency
- **Variable Reuse**: Color and typography variables
- **Selector Efficiency**: Optimal specificity hierarchy
- **Minimal Redundancy**: Shared patterns across breakpoints

## Accessibility Considerations

### Color Contrast
- **Yellow/Black**: High contrast ratio for readability
- **White/Black**: Maximum contrast for break sections
- **Interactive Elements**: Clear visual feedback

### Focus Management
- **Button Focus**: Visible focus states
- **Keyboard Navigation**: Proper tab order
- **Screen Reader Support**: Semantic structure ready

### Responsive Text
- **Font Scaling**: Maintains readability across devices
- **Touch Targets**: Adequate size on mobile devices
- **Content Hierarchy**: Clear visual hierarchy maintained

## Maintenance Guidelines

### Adding New Styles
1. **Scope all selectors** to `.nzgdc-morning-schedule-widget`
2. **Use CSS variables** for colors and measurements
3. **Follow responsive pattern** with mobile-first approach
4. **Test cross-browser compatibility** especially with Futura fonts

### Modifying Existing Styles
1. **Check responsive breakpoints** for impacts
2. **Verify theme consistency** with yellow color scheme
3. **Test integration** with other CSS files
4. **Validate accessibility** after changes

### Debugging Tips
1. **Use browser dev tools** to inspect CSS variable values
2. **Check z-index stacking** for overlay issues
3. **Verify box-model calculations** for layout problems
4. **Test different font loading states** for typography issues