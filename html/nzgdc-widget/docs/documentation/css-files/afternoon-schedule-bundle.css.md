# NZGDC Afternoon Schedule Widget CSS Documentation

## Overview

The `afternoon-schedule-bundle.css` file provides comprehensive styling for the NZGDC Afternoon Schedule Widget. This CSS bundle is specifically designed for the afternoon events display with a blue theme and contains all necessary styles for layout, typography, colors, and responsive behavior.

## File Usage

This CSS file is loaded by:
- `nzgdc-afternoon-schedule-widget-modular.js` - Main widget loader
- Used in conjunction with `unified-event-panel.css` and `category-filter-overlay.css`

## CSS Custom Properties (Variables)

### Color Variables
```css
--color-blue: rgba(23, 75, 235, 1)          /* Primary blue background */
--color-blue-bright: rgba(20, 65, 200, 1)   /* Active button state */
--color-blue-hover: rgba(15, 55, 180, 1)    /* Hover state for buttons */
--color-yellow: rgba(255, 236, 81, 1)       /* Morning events button */
--color-white: rgba(255, 255, 255, 1)       /* Text and backgrounds */
--color-black: rgba(0, 0, 0, 1)             /* Text and break backgrounds */
--color-gray-light: #f0f0f0                 /* Loading states */
--color-gray-medium: #666                   /* Loading text */
--color-gray-border: #ddd                   /* Borders */
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

### `.nzgdc-afternoon-schedule-widget`
- **Purpose**: Root container for the entire afternoon schedule widget
- **Theme**: Blue background theme
- **Layout**: Flexbox container with overflow hidden
- **Dimensions**: Full width, max-width 1630px, auto height

## Navigation Components

### Top Navigation Bar
```css
.nzgdc-afternoon-schedule-sub-navigation
```
- **Purpose**: Contains time navigation buttons and filter controls
- **Layout**: Flex container with space-between alignment
- **Background**: White
- **Height**: Minimum 60px

### Time Navigation Buttons

#### `.nzgdc-morning-events-button`
- **Purpose**: Navigation button to switch to morning events
- **Theme**: Yellow background (secondary action)
- **State**: Normal state button
- **Typography**: 28px, 800 weight, uppercase
- **Hover**: Darker yellow background

#### `.nzgdc-afternoon-events-button`
- **Purpose**: Navigation button for afternoon events (active state)
- **Theme**: Blue-bright background (active action)
- **State**: Active/selected state
- **Typography**: 28px, 800 weight, uppercase, white text
- **Hover**: Darker blue background

### Filter Section

#### `.nzgdc-afternoon-filters-section`
- **Purpose**: Container for category filter controls
- **Layout**: Flex container aligned to stretch
- **Position**: Top right of navigation bar

#### `.nzgdc-afternoon-filters-label`
- **Purpose**: Filter label display area
- **Background**: Blue-bright theme
- **Typography**: 28px, 600 weight, white text
- **Alignment**: Centered flex column

#### `.nzgdc-afternoon-filters-value`
- **Purpose**: Current filter value display
- **Background**: White
- **Typography**: 28px, 600 weight, black text, uppercase
- **Interaction**: Clickable for dropdown trigger

## Time Category Sections

### Time Category Containers
```css
.nzgdc-afternoon-time-category-early   /* Early afternoon sessions */
.nzgdc-afternoon-time-category-mid     /* Mid afternoon sessions */
```
- **Purpose**: Group events by time periods
- **Background**: Blue theme for both categories
- **Layout**: Full width containers

### Session Schedule Headers
```css
.nzgdc-afternoon-session-schedule
```
- **Purpose**: Display session time and title information
- **Layout**: Flex container with space-between alignment
- **Dimensions**: Height 46px, margin 17px 0 10px 0
- **Typography**: 36px, 800 weight, white text
- **Padding**: 0 25px horizontal

### Session Text Elements
```css
.nzgdc-afternoon-session-times     /* Time display */
.nzgdc-afternoon-session-title     /* Session title */
```
- **Typography**: 36px, 800 weight, center aligned
- **Color**: White text on blue background
- **Theme**: Consistent across both time categories

### Underline Elements
```css
.nzgdc-afternoon-underline
```
- **Purpose**: Visual separator under session headers
- **Dimensions**: calc(100% - 50px) width, 5px height
- **Color**: White background
- **Layout**: Centered block element

## Event Time Containers

### Time Display Sections
```css
.nzgdc-afternoon-event-times-early
.nzgdc-afternoon-event-times-mid
```
- **Purpose**: Display time information for each session period
- **Layout**: Flex column, centered alignment
- **Dimensions**: Full width, 81px height
- **Background**: Blue theme
- **Gap**: 5px between elements

## Event Layout Structure

### Event Container
```css
.nzgdc-scheduled-afternoon-events
```
- **Purpose**: Main container for all afternoon events
- **Padding**: 40px all sides
- **Background**: Inherits from parent (blue)
- **Layout**: Block container

### Event Rows
```css
.nzgdc-afternoon-event-row
```
- **Purpose**: Horizontal layout for event panels
- **Layout**: Flex container, centered alignment
- **Gap**: 20px between panels
- **Margin**: 0 0 40px 0 (bottom spacing)
- **Min-height**: 300px (event panel height)

#### Big Panel Alignment
```css
.nzgdc-afternoon-event-row[data-row^="big"]
```
- **Purpose**: Special alignment for larger event panels
- **Layout**: Left-aligned instead of centered
- **Calculation**: Margin-left calculated to align with main panels

### Event Panel Containers
```css
.nzgdc-afternoon-event              /* Standard event container */
.nzgdc-afternoon-event-main         /* Square event container */
```
- **Standard**: 620px × 300px dimensions
- **Square**: 300px × 300px dimensions
- **Layout**: Flex 0 0 auto (no grow/shrink)

### Event Panel Wrappers
```css
.nzgdc-afternoon-event-panel-container      /* Standard wrapper */
.nzgdc-afternoon-event-panel-main-container /* Square wrapper */
```
- **Purpose**: Contain event panel content with overflow hidden
- **Position**: Relative for absolute child positioning
- **Overflow**: Hidden to prevent content spillover

## Break Schedule Styling

### `.nzgdc-break-schedule`
- **Purpose**: Display break/intermission information
- **Layout**: Flex column, centered alignment
- **Dimensions**: Full width, 233px height
- **Background**: Black (contrast with blue theme)
- **Gap**: 10px between elements

#### Break Schedule Elements
```css
.nzgdc-break-schedule h2    /* Break title */
.nzgdc-break-schedule p     /* Break description */
```
- **H2**: 48px, 800 weight, uppercase, white text
- **P**: 24px, 400 weight, white text
- **Margins**: Reset to 0

## Footer Navigation

### Footer Container
```css
.nzgdc-afternoon-schedule-footer-navigation
```
- **Purpose**: Bottom navigation area
- **Layout**: Flex start alignment
- **Background**: White
- **Width**: Full width

### Back to Top Button
```css
.nzgdc-afternoon-back-to-top
```
- **Purpose**: Navigation button to return to top of page
- **Theme**: Blue background with white text
- **Typography**: 28px, 600 weight, uppercase
- **Padding**: 8px 15px
- **Hover**: Blue-bright background
- **Transition**: 0.3s background-color ease

## Loading and Error States

### Loading Placeholder
```css
.nzgdc-afternoon-loading-placeholder
```
- **Purpose**: Display during content loading
- **Background**: Light gray (#f0f0f0)
- **Layout**: Flex centered alignment
- **Typography**: 16px, medium font, gray text
- **Border**: 1px solid gray border

### Error Placeholder
```css
.nzgdc-afternoon-error-placeholder
```
- **Purpose**: Display error messages
- **Background**: Light red (#ffe6e6)
- **Layout**: Flex column, centered alignment
- **Typography**: 14px, medium font, red text
- **Border**: 1px solid light red border

## Responsive Design

### Breakpoint: ≤1680px
- Remove padding from main container

### Breakpoint: ≤1300px
- Event rows change to column layout
- Height becomes auto
- Gap maintained at 20px

### Breakpoint: ≤768px
- Session schedules become column layout
- Typography scales down to 24px
- Container padding reduced to 20px
- Event row margins reduced to 20px

### Breakpoint: ≤480px
- All padding reduced to 10px minimum
- Filter typography scales down (24px, 22px)
- Maximum space optimization

## Theme Integration

### Blue Theme Characteristics
- **Primary**: Blue background for main areas
- **Secondary**: White backgrounds for content areas
- **Accent**: Yellow for morning events button
- **Text**: White on blue, black on white
- **Interactive**: Blue-bright for active states

### Integration with Other CSS Files
- **unified-event-panel.css**: Provides event panel internal styling
- **category-filter-overlay.css**: Provides dropdown filter functionality
- **Scoping**: All styles scoped to `.nzgdc-afternoon-schedule-widget`

## JavaScript Integration Points

### CSS Classes Applied by JavaScript
- Dynamic category classes for filtering
- Active state management for navigation buttons
- Loading/error state classes
- Panel visibility control classes

### Data Attributes Used
- `data-row`: Row identification for layout
- `data-category`: Event categorization
- `data-dropdown-trigger`: Filter interaction
- `data-active-category`: Active filter state

## Performance Considerations

- CSS custom properties for efficient theme management
- Flexbox layouts for responsive behavior
- Scoped selectors to prevent style conflicts
- Optimized responsive breakpoints
- Minimal use of complex calculations