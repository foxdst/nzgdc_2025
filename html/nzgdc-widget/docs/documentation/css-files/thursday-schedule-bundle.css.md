# NZGDC Thursday Schedule Widget CSS Documentation

## Overview

The `thursday-schedule-bundle.css` file provides comprehensive styling for the NZGDC Thursday Schedule Widget. This CSS bundle is specifically designed for the Thursday workshop events display with a mixed white/yellow/blue theme and contains all necessary styles for layout, typography, colors, and responsive behavior.

## File Usage

This CSS file is loaded by:
- `nzgdc-schedule-widget-modular.js` - Thursday widget loader
- Used in conjunction with `unified-event-panel.css` and `category-filter-overlay.css`

## CSS Custom Properties (Variables)

### Color Variables
```css
--color-yellow: rgba(255, 236, 81, 1)        /* Yellow theme sections */
--color-blue: rgba(23, 75, 235, 1)           /* Blue theme sections */
--color-blue-hover: rgba(20, 65, 200, 1)     /* Blue hover state */
--color-white: rgba(255, 255, 255, 1)        /* Primary background */
--color-black: rgba(0, 0, 0, 1)              /* Text color */
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

### `.nzgdc-schedule-widget`
- **Purpose**: Root container for the entire Thursday schedule widget
- **Theme**: White background theme (neutral, multi-color sections)
- **Layout**: Flexbox container with overflow hidden
- **Dimensions**: Full width, max-width 1630px, auto height
- **Unique Aspect**: Only widget with mixed theme sections

## Navigation Components

### Sub Navigation Bar
```css
.nzgdc-schedule-sub-navigation
```
- **Purpose**: Contains filter controls (no time navigation buttons)
- **Layout**: Flex container with flex-end justification
- **Background**: White (consistent with main theme)
- **Positioning**: Right-aligned filter section only
- **Difference**: Unlike morning/afternoon, no time navigation buttons

### Filter Section

#### `.nzgdc-filters-section`
- **Purpose**: Container for category filter controls
- **Layout**: Flex container aligned to stretch
- **Position**: Right side of navigation bar
- **Min-height**: 60px for consistency with other widgets

#### `.nzgdc-filters-label`
- **Purpose**: Filter label display area
- **Background**: Yellow theme (--color-yellow)
- **Typography**: 28px, 600 weight, black text
- **Alignment**: Centered flex column
- **Content**: "FILTER BY" label text

#### `.nzgdc-filters-value`
- **Purpose**: Current filter value display and interaction area
- **Background**: White (readable contrast)
- **Typography**: 28px, 600 weight, black text, uppercase
- **Interaction**: Clickable for dropdown trigger
- **Position**: Relative for dropdown positioning
- **Enhanced**: Cursor pointer, hover states

## Time Category Sections

### Mixed Theme Categories
```css
.nzgdc-time-category-a    /* Yellow theme section */
.nzgdc-time-category-b    /* Blue theme section */
```
- **Purpose**: Group workshops by time periods with different themes
- **Category A**: Yellow background (morning-style)
- **Category B**: Blue background (afternoon-style)
- **Layout**: Full width containers
- **Unique Feature**: Mixed themes within single widget

### Session Schedule Headers
```css
.nzgdc-session-schedule
```
- **Purpose**: Display session time and title information
- **Layout**: Flex container with space-between alignment
- **Dimensions**: Height 46px, margin 17px 0 10px 0
- **Padding**: 0 25px horizontal
- **Theme Variation**: Text color changes per time category

### Session Text Styling

#### Category A (Yellow Theme)
```css
.nzgdc-time-category-a .nzgdc-session-times
.nzgdc-time-category-a .nzgdc-session-title
```
- **Typography**: 36px, 800 weight, center aligned
- **Color**: Black text on yellow background
- **Theme**: Consistent with morning widget styling

#### Category B (Blue Theme)
```css
.nzgdc-time-category-b .nzgdc-session-times
.nzgdc-time-category-b .nzgdc-session-title
```
- **Typography**: 36px, 800 weight, center aligned
- **Color**: White text on blue background
- **Theme**: Consistent with afternoon widget styling

### Underline Elements
```css
.nzgdc-underline
```
- **Purpose**: Visual separator under session headers
- **Dimensions**: calc(100% - 50px) width, 5px height
- **Layout**: Centered block element with auto margins

#### Theme-Specific Underlines
```css
.nzgdc-event-times-a .nzgdc-underline    /* Black underline */
.nzgdc-event-times-b .nzgdc-underline    /* White underline */
```
- **Category A**: Black background (yellow theme)
- **Category B**: White background (blue theme)

## Event Time Containers

### Time Display Sections
```css
.nzgdc-event-times-a    /* Yellow theme time container */
.nzgdc-event-times-b    /* Blue theme time container */
```
- **Purpose**: Display time information for each session period
- **Layout**: Flex column, centered alignment
- **Dimensions**: Full width, 81px height
- **Gap**: 5px between child elements
- **Background**: Matches respective theme colors

## Workshop Layout Structure

### Workshop Container
```css
.nzgdc-scheduled-workshops
```
- **Purpose**: Main container for all Thursday workshops
- **Padding**: 40px all sides
- **Background**: Inherits from parent (white)
- **Layout**: Block container for workshop rows
- **Naming**: Uses "workshops" instead of "events" for Thursday

### Workshop Rows
```css
.nzgdc-workshop-row
```
- **Purpose**: Horizontal layout for workshop event panels
- **Layout**: Flex container, centered alignment
- **Gap**: 20px between panels
- **Margin**: 0 0 40px 0 (bottom spacing between rows)
- **Min-height**: 300px (matches event panel height)
- **Content**: Contains workshop events instead of sessions

### Workshop Event Containers
```css
.nzgdc-workshop-event
```
- **Purpose**: Container for workshop event panels
- **Dimensions**: Variable width (flex: 1), 300px height
- **Layout**: Flexible sizing unlike fixed morning/afternoon panels
- **Max-width**: 620px (event panel width)
- **Flexibility**: Adapts to content and screen size

### Event Panel Container
```css
.nzgdc-event-panel-container
```
- **Purpose**: Contain workshop event panel content
- **Dimensions**: 620px × 300px
- **Overflow**: Hidden to prevent content spillover
- **Position**: Relative for absolute child positioning
- **Integration**: Works with unified-event-panel.css

## Footer Navigation

### Footer Container
```css
.nzgdc-schedule-footer-navigation
```
- **Purpose**: Bottom navigation area
- **Layout**: Flex start alignment
- **Background**: White (consistent with main theme)
- **Width**: Full width

### Back to Top Button
```css
.nzgdc-back-to-top
```
- **Purpose**: Navigation button to return to top of page
- **Theme**: Blue background with white text
- **Typography**: 28px, 600 weight, uppercase
- **Padding**: 8px 15px
- **Hover**: Blue-hover background
- **Transition**: 0.3s background-color ease
- **Layout**: Flex column, centered content

## Responsive Design

### Breakpoint: ≤1680px
- **Change**: Remove padding from main container
- **Purpose**: Optimize space usage on large screens

### Breakpoint: ≤1300px
- **Changes**:
  - Workshop rows change to column layout
  - Height becomes auto
  - Gap maintained at 20px
- **Impact**: Stacked workshop panels instead of horizontal

### Breakpoint: ≤768px
- **Session Schedules**:
  - Change to column layout
  - Typography scales down to 24px
  - Center text alignment
  - Auto height with 10px gap
- **Container Changes**:
  - Scheduled workshops padding reduced to 20px
  - Workshop row margins reduced to 20px
- **Button Changes**:
  - Back to top button scales to 24px font size
  - Full width on mobile

### Breakpoint: ≤480px
- **Space Optimization**:
  - All padding reduced to 10px minimum
  - Scheduled workshops padding: 10px
  - Filter section padding: 10px 15px
- **Typography Scaling**:
  - Filter label: 24px (down from 28px)
  - Filter value: 22px (down from 28px)
- **Container**: Remove all padding

## Theme Integration

### Mixed Theme Approach
- **Section A**: Yellow theme (morning-style)
- **Section B**: Blue theme (afternoon-style)
- **Navigation**: White theme (neutral)
- **Footer**: White theme with blue accent button

### Theme Logic
```css
/* Yellow Section (A) */
.nzgdc-time-category-a
- Background: Yellow
- Text: Black
- Underlines: Black

/* Blue Section (B) */
.nzgdc-time-category-b
- Background: Blue
- Text: White
- Underlines: White
```

### Integration with Other CSS Files

#### unified-event-panel.css
- **Provides**: Workshop panel internal styling
- **Relationship**: Thursday bundle handles layout, unified handles content
- **Compatibility**: Works with both 620×300 and 300×300 panel formats

#### category-filter-overlay.css
- **Provides**: Dropdown filter functionality
- **Relationship**: Special Thursday-specific color variations
- **Scoping**: `.nzgdc-schedule-widget` specific interactions
- **Enhanced**: Thursday-specific category colors

## JavaScript Integration Points

### CSS Classes Applied by JavaScript

#### Category Filter Classes
- Dynamic category classes applied to filter values
- Format: `.category-{category-name}`
- Thursday-specific color variations
- Enhanced clickable areas

#### Loading and Error States
- Loading placeholder classes
- Error state classes
- Content availability indicators

### Data Attributes Used

#### Workshop Organization
- `data-category`: Workshop categorization for filtering
- `data-dropdown-trigger`: Marks clickable filter areas
- `data-active-category`: Indicates current active filter

#### Layout Control
- Row identification for workshop layouts
- Panel type identification for styling

### Filter System Integration

#### Dropdown Trigger Enhancement
```css
.nzgdc-filters-value[data-dropdown-trigger]
```
- **Purpose**: Enhanced clickable filter area
- **Cursor**: Pointer for interaction indication
- **Hover**: Light gray background for non-active categories
- **Focus**: Outline removal to prevent blue border issues
- **Active**: Color preservation for active categories

#### Category-Specific Styling
Thursday widget includes special handling for:
- Data, Testing or Research: Light pink (#ffb3ba) instead of muted purple
- Serious & Educational Games: Light blue (#bae1ff) instead of light red

## Workshop-Specific Features

### Workshop vs. Events Terminology
- **Container**: `.nzgdc-scheduled-workshops` (not events)
- **Rows**: `.nzgdc-workshop-row` (not event-row)
- **Items**: `.nzgdc-workshop-event` (not event)
- **Purpose**: Semantic distinction for Thursday workshops

### Flexible Layout System
- **Workshop Events**: Flexible width (flex: 1)
- **Adaptation**: Responsive to content and screen size
- **Contrast**: More flexible than morning/afternoon fixed layouts

## Performance Considerations

### Optimization Features
- **CSS Custom Properties**: Efficient theme management across mixed themes
- **Flexbox Layouts**: Responsive behavior without JavaScript
- **Scoped Selectors**: Prevent conflicts with morning/afternoon widgets
- **Theme Switching**: Efficient color theme transitions

### Rendering Efficiency
- **Mixed Theme Handling**: Optimized for multiple theme sections
- **Layout Calculations**: Minimal use of calc() functions
- **Color Transitions**: Smooth theme changes between sections

## Accessibility Considerations

### Color Contrast
- **Yellow/Black**: High contrast for category A
- **Blue/White**: High contrast for category B
- **White/Blue**: Good contrast for navigation elements
- **Interactive Elements**: Clear visual feedback

### Theme Transitions
- **Visual Continuity**: Smooth transitions between theme sections
- **Content Hierarchy**: Maintained across different themes
- **Focus Management**: Consistent across all theme sections

## Unique Characteristics

### Distinguishing Features
1. **Mixed Theme System**: Only widget with multiple theme sections
2. **Workshop Terminology**: Semantic distinction from other widgets
3. **Flexible Layout**: More adaptive than morning/afternoon widgets
4. **No Time Navigation**: Only filter controls, no morning/afternoon buttons
5. **Category Color Variations**: Special colors for some categories

### Integration Complexity
- **Theme Coordination**: Must work with category-filter-overlay.css variations
- **Layout Flexibility**: More complex responsive behavior
- **Color Management**: Multiple theme coordination
- **Semantic Structure**: Workshop-specific terminology throughout

## Maintenance Guidelines

### Adding New Styles
1. **Consider theme context**: Styles may need variations for both yellow and blue sections
2. **Use CSS variables**: Maintain consistency with color system
3. **Test mixed themes**: Verify appearance across different theme sections
4. **Workshop terminology**: Use appropriate semantic class names

### Modifying Existing Styles
1. **Check theme sections**: Verify changes work in both yellow and blue contexts
2. **Test category colors**: Ensure special Thursday category variations work
3. **Validate flexibility**: Confirm layout adaptations still function
4. **Integration testing**: Verify compatibility with other CSS files

### Debugging Tips
1. **Theme section isolation**: Debug yellow and blue sections separately
2. **Category color conflicts**: Check for override issues with special colors
3. **Layout flexibility**: Test various content lengths and screen sizes
4. **Filter integration**: Verify dropdown positioning and color applications