# NZGDC Schedule Widgets Documentation

A comprehensive, modular JavaScript widget system for displaying New Zealand Game Developers Conference (NZGDC) event schedules. Features unified event panel architecture, advanced category filtering, and seamless integration capabilities for Thursday workshops and Friday/Saturday morning/afternoon events.

## 📁 Project Structure

```
nzgdc-widget/
├── css/
│   ├── unified-event-panel.css                  # Core event panel styles (620x300px) - ALL WIDGETS
│   ├── category-filter-overlay.css              # Category dropdown/filter system styles
│   ├── thursday-schedule-bundle.css             # Thursday-specific schedule layout styles
│   └── friday-saturday-schedule-bundle.css     # Fri/Sat unified schedule layout styles
├── js/
│   ├── unified-event-loader.js                  # Event panel generator & category management
│   ├── widget-core.js                          # Thursday widget controller & logic
│   ├── friday-saturday-widget-core.js          # Fri/Sat unified widget controller
│   ├── schedule-generator.js                   # Thursday DOM structure generator
│   ├── morning-schedule-generator.js           # Morning events DOM generator
│   ├── afternoon-schedule-generator.js         # Afternoon events DOM generator
│   ├── schedule-data.js                        # Thursday workshop configuration
│   ├── morning-schedule-data.js                # Morning events configuration
│   ├── afternoon-schedule-data.js              # Afternoon events configuration
│   ├── workshop-events.js                      # Thursday workshop event details
│   ├── morning-events.js                       # Morning event details & speakers
│   ├── afternoon-events.js                     # Afternoon event details & speakers
│   ├── workshop-events-original.js             # Backup: Original Thursday events
│   ├── morning-events-original.js              # Backup: Original morning events
│   └── afternoon-events-original.js            # Backup: Original afternoon events
├── templates/
│   └── unified-event-panel.html                # Event panel HTML template (all widgets)
├── docs/
│   ├── audits/                                 # Performance & code quality audits
│   ├── documentation/                          # Technical documentation
│   ├── filter-changelogs/                     # Category filter system changes
│   ├── tasks/                                  # Active development tasks
│   ├── tasks-drafts/                          # Draft specifications
│   └── tasks-obsolete/                        # Completed/obsolete tasks
├── changelogs/
│   ├── 2025-08-13_consolidation_start.md      # Fri/Sat consolidation project start
│   ├── 2025-08-13_deployment_summary.md       # Complete deployment documentation
│   ├── 2025-08-13_validation_test_results.md  # Comprehensive testing results
│   ├── 2025-08-13_container_issue_resolved.md # Container initialization fixes
│   ├── 2025-08-13_critical_error_fix.md       # Production error resolutions
│   ├── 2025-08-13_debug_undefined_container.md # Debug logging implementations
│   ├── 2025-08-13_dropdown_design_fixes.md    # UI/UX dropdown improvements
│   └── 2025-08-13_thursday_clear_filter_implementation.md # Filter reset functionality
├── .widget-tests/
│   └── widget-demo.html                        # Comprehensive testing demo page
├── .deprecated/
│   ├── nzgdc-morning-schedule-widget-modular.js    # Legacy: Separate morning widget
│   ├── nzgdc-afternoon-schedule-widget-modular.js  # Legacy: Separate afternoon widget
│   ├── morning-schedule-bundle.css                 # Legacy: Morning-only CSS
│   ├── afternoon-schedule-bundle.css               # Legacy: Afternoon-only CSS
│   ├── morning-widget-core.js                      # Legacy: Morning-only controller
│   ├── afternoon-widget-core.js                    # Legacy: Afternoon-only controller
│   └── *.html                                      # Legacy: Individual test pages
├── nzgdc-schedule-widget-modular.js            # ENTRY POINT: Thursday workshop widget
├── nzgdc-friday-saturday-schedule-widget-modular.js # ENTRY POINT: Fri/Sat unified widget
└── README.md                                   # This documentation file
```

## 🚀 Quick Start

### Thursday Workshop Schedule Widget
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NZGDC Thursday Workshops</title>
</head>
<body>
    <!-- Thursday widget container -->
    <div data-nzgdc-schedule></div>
    
    <!-- Load Thursday widget (auto-initializes) -->
    <script src="nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
</body>
</html>
```

### Friday/Saturday Morning & Afternoon Events Widget
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NZGDC Friday/Saturday Events</title>
</head>
<body>
    <!-- Friday/Saturday widget container -->
    <div data-nzgdc-friday-saturday-schedule></div>
    
    <!-- Load Friday/Saturday unified widget (auto-initializes) -->
    <script src="nzgdc-widget/nzgdc-friday-saturday-schedule-widget-modular.js"></script>
</body>
</html>
```

### Complete Integration (All Three Views)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete NZGDC Schedule</title>
</head>
<body>
    <!-- Main toggle buttons (Thursday, Morning Events, Afternoon Events) -->
    <div class="nzgdc-schedule-toggles">
        <button id="thursday-toggle" class="active">Thursday Workshops</button>
        <button id="morning-toggle">Morning Events</button>
        <button id="afternoon-toggle">Afternoon Events</button>
    </div>

    <!-- Widget containers -->
    <div id="thursday-container" data-nzgdc-schedule></div>
    <div id="friday-saturday-container" data-nzgdc-friday-saturday-schedule style="display: none;"></div>
    
    <!-- Load both widgets -->
    <script src="nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
    <script src="nzgdc-widget/nzgdc-friday-saturday-schedule-widget-modular.js"></script>

    <!-- Toggle functionality -->
    <script>
        document.getElementById('thursday-toggle').onclick = () => {
            document.getElementById('thursday-container').style.display = 'block';
            document.getElementById('friday-saturday-container').style.display = 'none';
        };
        
        document.getElementById('morning-toggle').onclick = () => {
            document.getElementById('thursday-container').style.display = 'none';
            document.getElementById('friday-saturday-container').style.display = 'block';
            window.createFridaySaturdayWidget('friday-saturday-container', { defaultView: 'morning' });
        };
        
        document.getElementById('afternoon-toggle').onclick = () => {
            document.getElementById('thursday-container').style.display = 'none';
            document.getElementById('friday-saturday-container').style.display = 'block';
            window.createFridaySaturdayWidget('friday-saturday-container', { defaultView: 'afternoon' });
        };
    </script>
</body>
</html>
```

## 📚 Critical File Dependencies & Loading Order

### Thursday Widget Dependencies (nzgdc-schedule-widget-modular.js)
**CRITICAL: Files MUST load in this exact order:**
1. **CSS Layer (Loaded First)**:
   - `css/unified-event-panel.css` (CRITICAL FIRST - event panel styles)
   - `css/category-filter-overlay.css` (filter dropdown styles)
   - `css/thursday-schedule-bundle.css` (Thursday layout styles)

2. **JavaScript Layer (Loaded Second)**:
   - `js/unified-event-loader.js` (CRITICAL - event panel generator)
   - `js/widget-core.js` (Thursday controller)
   - `js/schedule-generator.js` (Thursday DOM builder)
   - `js/schedule-data.js` (Thursday configuration)
   - `js/workshop-events.js` (Thursday event details)

3. **Template Layer (Loaded Third)**:
   - `templates/unified-event-panel.html` (event panel template)

### Friday/Saturday Widget Dependencies (nzgdc-friday-saturday-schedule-widget-modular.js)
**CRITICAL: Files MUST load in this exact order:**
1. **CSS Layer (Loaded First)**:
   - `css/unified-event-panel.css` (CRITICAL FIRST - event panel styles)
   - `css/category-filter-overlay.css` (filter dropdown styles)  
   - `css/friday-saturday-schedule-bundle.css` (Fri/Sat layout styles)

2. **JavaScript Layer (Loaded Second)**:
   - `js/unified-event-loader.js` (CRITICAL - event panel generator)
   - `js/friday-saturday-widget-core.js` (unified Fri/Sat controller)
   - `js/morning-schedule-generator.js` (morning DOM builder)
   - `js/afternoon-schedule-generator.js` (afternoon DOM builder)
   - `js/morning-schedule-data.js` (morning configuration)
   - `js/afternoon-schedule-data.js` (afternoon configuration)
   - `js/morning-events.js` (morning event details)
   - `js/afternoon-events.js` (afternoon event details)

3. **Template Layer (Loaded Third)**:
   - `templates/unified-event-panel.html` (event panel template)

## 🔧 Core Architecture

### Unified Event Panel System
The heart of all widgets is the **unified event panel architecture** that provides consistent 620x300px event panels across all widget types:

#### `UnifiedEventLoader` (js/unified-event-loader.js)
**Primary Responsibilities:**
- Event panel HTML generation from template
- Category management with predefined definitions
- Speaker information display and formatting
- Event thumbnail and background image handling
- Responsive event panel behavior
- Category color coding and brightness management

**Category Definitions:**
```javascript
categoryDefinitions = new Map([
    ["STORY_NARRATIVE", { name: "Story & Narrative", brightness: "light" }],
    ["PRODUCTION_QA", { name: "Production & QA", brightness: "dark" }],
    ["CULTURE", { name: "Culture", brightness: "light" }],
    ["BUSINESS_MARKETING", { name: "Business & Marketing", brightness: "light" }],
    ["ART", { name: "Art", brightness: "light" }],
    ["AUDIO", { name: "Audio", brightness: "dark" }],
    ["PROGRAMMING", { name: "Programming", brightness: "light" }],
    ["GAME_DESIGN", { name: "Game Design", brightness: "light" }],
    ["INDIE_DEVELOPMENT", { name: "Indie Development", brightness: "dark" }],
    ["VR_AR", { name: "VR/AR", brightness: "dark" }],
    ["PUBLISHING", { name: "Publishing", brightness: "light" }],
    ["COMMUNITY", { name: "Community", brightness: "light" }]
]);
```

### Thursday Widget Architecture

#### `NZGDCWidgetLoader` (Entry Point)
- Module loading orchestration
- CSS/JS dependency management  
- Widget initialization coordination
- Error handling and timeout management

#### `ScheduleGenerator` (DOM Builder)
- Workshop schedule HTML generation
- Time slot organization and display
- Workshop card creation and styling
- Responsive layout management

#### `NZGDCScheduleWidget` (Main Controller)  
- Widget lifecycle management
- Event listener attachment
- Category filter integration
- State management and cleanup
- Public API exposure

#### `ThursdayCategoryDropdownController` (Filter System)
- Dropdown filter UI management
- Category selection handling  
- Filter state persistence
- Clear filter functionality

### Friday/Saturday Widget Architecture

#### `NZGDCFridaySaturdayWidgetLoader` (Entry Point)
- Unified module loading for both morning and afternoon
- CSS bundle management
- Generator coordination
- Template loading orchestration

#### `FridaySaturdayWidgetCore` (Unified Controller)
- View switching logic (morning ↔ afternoon)
- Dual generator management
- Existing button integration and wiring
- State synchronization between views
- Memory management and cleanup

#### `MorningScheduleGenerator` & `AfternoonScheduleGenerator` (DOM Builders)  
- Time-specific event rendering
- Speaker assignment and display
- Category-specific styling application
- Responsive grid management

## 📊 Data Flow & Widget Lifecycle

### Thursday Widget Data Flow
1. **Entry Point**: `nzgdc-schedule-widget-modular.js` loads
2. **CSS Loading**: Unified event panel → category filter → Thursday bundle
3. **JS Loading**: Unified event loader → widget core → schedule generator → data/events
4. **Template Loading**: Unified event panel HTML template
5. **Initialization**: Widget core creates DOM structure using schedule generator
6. **Event Integration**: Unified event loader generates event panels from workshop-events.js
7. **Filter Integration**: Category dropdown controller manages workshop filtering
8. **Rendering**: Complete Thursday schedule with interactive event panels

### Friday/Saturday Widget Data Flow  
1. **Entry Point**: `nzgdc-friday-saturday-schedule-widget-modular.js` loads
2. **CSS Loading**: Unified event panel → category filter → Friday/Saturday bundle
3. **JS Loading**: Unified event loader → Friday/Saturday core → both generators → data/events
4. **Template Loading**: Unified event panel HTML template
5. **Initialization**: Unified core creates dual-view DOM structure
6. **Generator Coordination**: Both morning and afternoon generators initialize
7. **Event Integration**: Unified event loader generates panels for both morning/afternoon events
8. **View Management**: Default morning view loads, afternoon view prepared
9. **Button Wiring**: Existing Morning/Afternoon Events buttons connected for view switching
10. **Rendering**: Complete Friday/Saturday schedule with seamless view switching

### Critical Data Dependencies

#### Thursday Widget
- `js/schedule-data.js`: Workshop time slots, categories, and basic structure
- `js/workshop-events.js`: Complete workshop details, speakers, descriptions, thumbnails
- `templates/unified-event-panel.html`: Event panel HTML structure

#### Friday/Saturday Widget
- `js/morning-schedule-data.js`: Morning event time slots and structure
- `js/afternoon-schedule-data.js`: Afternoon event time slots and structure  
- `js/morning-events.js`: Complete morning event details and speakers
- `js/afternoon-events.js`: Complete afternoon event details and speakers
- `templates/unified-event-panel.html`: Event panel HTML structure

## 🎨 CSS Architecture & Styling System

### Critical CSS Loading Order
**VIOLATION OF THIS ORDER WILL BREAK THE WIDGETS:**

1. **`css/unified-event-panel.css`** (MUST BE FIRST)
   - Contains all event panel styles (620x300px panels)
   - CSS custom properties for theming
   - Event thumbnail and overlay systems
   - Speaker bio and category display styles

2. **`css/category-filter-overlay.css`** (MUST BE SECOND)  
   - Category dropdown positioning and styling
   - Filter button states and interactions
   - Overlay and modal behaviors

3. **Widget-Specific Bundle** (MUST BE THIRD)
   - `css/thursday-schedule-bundle.css` (Thursday layouts)
   - `css/friday-saturday-schedule-bundle.css` (Fri/Sat layouts)

### CSS Variable System

#### Event Panel Variables (unified-event-panel.css)
```css
.nzgdc-event-panel-big {
    --font-family-demi: "Futura PT Demi", "Futura", Arial, sans-serif;
    --font-family-bold: "Futura PT Bold", "Futura", Arial, sans-serif;
    --font-family-heavy: "Futura PT Heavy", "Futura", Arial, sans-serif;
    --font-family-medium: "Futura PT Medium", "Futura", Arial, sans-serif;
    --color-primary: #f53e3e;
    --color-bg: rgba(255, 255, 255, 1);
    --color-overlay: rgba(0, 0, 0, 0.75);
    --color-title: rgba(0, 0, 0, 1);
    --color-category-text: rgba(255, 255, 255, 1);
    --color-intro: rgba(245, 45, 49, 1);
    --color-speaker: rgba(255, 255, 255, 1);
    --color-speaker-secondary: rgba(204, 204, 204, 1);
}
```

#### Thursday Widget Variables
```css
.nzgdc-schedule-widget {
    --primary-color: #f53e3e;
    --background-color: #ffffff;
    --text-color: #000000;
    --border-color: #e0e0e0;
    --hover-color: #f0f0f0;
}
```

#### Friday/Saturday Widget Variables
```css
.nzgdc-friday-saturday-schedule-widget {
    /* Morning view theme - Yellow */
    --morning-primary: #F0DF56;
    --morning-secondary: #FFEC51;
    
    /* Afternoon view theme - Blue */
    --afternoon-primary: #174BEB;
    --afternoon-secondary: #1441C8;
}
```

### Critical CSS Architecture Rules

#### ❌ FORBIDDEN: Event Panel CSS in Bundle Files
**Bundle files (thursday-schedule-bundle.css, friday-saturday-schedule-bundle.css) MUST NEVER contain:**
- `.nzgdc-event-panel-*` styles
- `.nzgdc-event-category-*` styles  
- `.nzgdc-speaker-*` styles
- Event panel layout or positioning CSS

**These styles ONLY belong in `css/unified-event-panel.css`**

#### ✅ REQUIRED: Proper CSS Scoping
All widget-specific styles MUST use proper prefixes:
- Thursday: `.nzgdc-schedule-widget` prefix
- Friday/Saturday: `.nzgdc-friday-saturday-schedule-widget` prefix
- Morning view: `.morning-view` prefix
- Afternoon view: `.afternoon-view` prefix

## 🔧 Configuration & Customization

### Thursday Widget Configuration Options
```javascript
// Auto-initialization via data attribute (recommended)
<div data-nzgdc-schedule></div>

// Manual initialization with options
const thursdayWidget = window.NZGDCScheduleWidget.create('container-id', {
    showFilters: true,           // Enable category dropdown filtering
    showFooter: true,           // Display widget footer
    theme: 'default',           // Theme option
    enableDebug: false,         // Debug logging
    categories: [...],          // Custom category list
    customCSS: 'path/to/custom.css' // Additional CSS
});
```

### Friday/Saturday Widget Configuration Options  
```javascript
// Auto-initialization via data attribute (recommended)
<div data-nzgdc-friday-saturday-schedule></div>

// Manual initialization with options
const fridaySaturdayWidget = window.createFridaySaturdayWidget('container-id', {
    defaultView: 'morning',     // 'morning' or 'afternoon'
    showFilters: true,          // Enable category filtering
    enableViewSwitching: true,  // Allow morning/afternoon switching
    enableDebug: false,         // Debug logging
    autoWireButtons: true,      // Auto-connect Morning/Afternoon Events buttons
    customCSS: 'path/to/custom.css' // Additional CSS
});
```

### Data Attribute Configuration

#### Thursday Widget Auto-Initialization
```html
<!-- Basic initialization -->
<div data-nzgdc-schedule></div>

<!-- With configuration -->
<div data-nzgdc-schedule 
     data-show-filters="true"
     data-show-footer="true"
     data-theme="custom"
     data-debug="false"></div>
```

#### Friday/Saturday Widget Auto-Initialization
```html
<!-- Basic initialization (defaults to morning view) -->
<div data-nzgdc-friday-saturday-schedule></div>

<!-- With configuration -->  
<div data-nzgdc-friday-saturday-schedule
     data-default-view="afternoon"
     data-show-filters="true"
     data-enable-view-switching="true"
     data-auto-wire-buttons="true"
     data-debug="false"></div>
```

## 🎯 Advanced Category Filter System

### Complete Category Management
The unified category filter system provides sophisticated event filtering across all widgets:

#### Available Event Categories
```javascript
// Categories with display names and brightness settings
const categories = [
    "STORY_NARRATIVE",      // Story & Narrative (light theme)
    "PRODUCTION_QA",        // Production & QA (dark theme)  
    "CULTURE",              // Culture (light theme)
    "BUSINESS_MARKETING",   // Business & Marketing (light theme)
    "ART",                  // Art (light theme)
    "AUDIO",                // Audio (dark theme)
    "PROGRAMMING",          // Programming (light theme)
    "GAME_DESIGN",          // Game Design (light theme)
    "INDIE_DEVELOPMENT",    // Indie Development (dark theme)
    "VR_AR",                // VR/AR (dark theme)
    "PUBLISHING",           // Publishing (light theme)
    "COMMUNITY"             // Community (light theme)
];
```

#### Filter System Features
- **Dynamic Dropdown**: Category selection via styled dropdown
- **Visual Indicators**: Color-coded categories with brightness-based text contrast
- **Clear Functionality**: "Clear Filter" option to show all events
- **State Persistence**: Filter state maintained during view switching
- **Responsive Design**: Mobile-optimized dropdown behavior
- **Accessibility**: Keyboard navigation and screen reader support

#### Filter Implementation
- **Thursday Widget**: Dropdown filter for workshop categories
- **Friday/Saturday Widget**: Unified filter system works across both morning and afternoon views
- **Category Mapping**: Automatic category detection from event data
- **Visual Feedback**: Filtered events highlighted, non-matching events dimmed

## 🐛 Debugging & Troubleshooting

### Debug Mode Activation
```javascript
// Enable debug mode globally
window.NZGDC_DEBUG = true;

// Or via URL parameter
// https://yoursite.com/page?debug=true

// Or via widget options
const widget = window.NZGDCScheduleWidget.create('container', { enableDebug: true });
```

### Common Issues & Solutions

#### 1. Widget Not Loading/Initializing
**Symptoms**: Blank container, no content appears
**Debugging Steps**:
```javascript
// Check if widgets are loaded
console.log('Thursday Widget:', window.NZGDCScheduleWidget);
console.log('Fri/Sat Widget:', window.createFridaySaturdayWidget);

// Check for container
console.log('Container:', document.querySelector('[data-nzgdc-schedule]'));

// Check for CSS loading
console.log('CSS loaded:', !!document.querySelector('link[href*="unified-event-panel"]'));
```

**Common Causes & Solutions**:
- **Missing container element**: Add `data-nzgdc-schedule` or `data-nzgdc-friday-saturday-schedule`
- **JavaScript errors**: Check browser console for errors
- **CSS loading failure**: Verify CSS files are accessible
- **CORS issues**: Ensure all files served from same domain

#### 2. Event Panels Not Displaying Correctly
**Symptoms**: Broken layout, missing content, styling issues
**Debugging Steps**:
```javascript
// Check template loading
console.log('Template loaded:', window.UnifiedEventLoader?.template);

// Check event data
console.log('Thursday events:', window.WORKSHOP_EVENTS);
console.log('Morning events:', window.MORNING_EVENTS);  
console.log('Afternoon events:', window.AFTERNOON_EVENTS);
```

**Common Causes & Solutions**:
- **CSS loading order violation**: Ensure `unified-event-panel.css` loads FIRST
- **Template loading failure**: Verify `templates/unified-event-panel.html` is accessible
- **Event data corruption**: Check event data files for syntax errors
- **Missing event properties**: Verify event objects have required fields

#### 3. Category Filters Not Working
**Symptoms**: Dropdown not appearing, filtering not working, categories missing
**Debugging Steps**:
```javascript
// Check category definitions
console.log('Categories:', window.UnifiedEventLoader?.categoryDefinitions);

// Check filter UI
console.log('Filter container:', document.querySelector('.category-filter-container'));

// Check event categories
console.log('Event categories:', events.map(e => e.category));
```

**Common Causes & Solutions**:
- **Missing category-filter-overlay.css**: Verify CSS file is loaded second
- **Event category mismatches**: Ensure event categories match defined categories
- **JavaScript initialization failure**: Check for widget initialization errors

#### 4. Friday/Saturday View Switching Issues  
**Symptoms**: Views not switching, buttons not working, state not persisting
**Debugging Steps**:
```javascript
// Check widget instance
const widget = document.querySelector('[data-nzgdc-friday-saturday-schedule]').__fridaySaturdayWidget;
console.log('Widget state:', widget?.currentView, widget?.initialized);

// Check button wiring
console.log('Morning button:', document.querySelector('.nzgdc-morning-events-button'));
console.log('Afternoon button:', document.querySelector('.nzgdc-afternoon-events-button'));

// Test manual switching
widget?.switchToView('morning');
widget?.switchToView('afternoon');
```

**Common Causes & Solutions**:
- **Button auto-wiring failure**: Ensure buttons exist with correct class names
- **View state corruption**: Reinitialize widget with `destroyAllFridaySaturdayWidgets()` then recreate
- **CSS bundle conflicts**: Verify Friday/Saturday CSS bundle loaded correctly
- **Generator initialization issues**: Check both morning/afternoon generators loaded

### Debug API Methods

#### System Status Verification
```javascript
// Get comprehensive system status
const status = {
    thursdayWidget: {
        loaded: !!window.NZGDCScheduleWidget,
        initialized: window.NZGDCScheduleWidget?.instances?.size || 0,
        containers: document.querySelectorAll('[data-nzgdc-schedule]').length
    },
    fridaySaturdayWidget: {
        loaded: !!window.createFridaySaturdayWidget,
        initialized: window.activeFridaySaturdayWidgets?.size || 0,
        containers: document.querySelectorAll('[data-nzgdc-friday-saturday-schedule]').length
    },
    unifiedSystem: {
        eventLoader: !!window.UnifiedEventLoader,
        template: !!window.UnifiedEventLoader?.template,
        categories: window.UnifiedEventLoader?.categoryDefinitions?.size || 0
    }
};
console.log('NZGDC Widget System Status:', status);
```

#### Manual Widget Management
```javascript
// Create widgets manually
const thursdayWidget = window.NZGDCScheduleWidget.create('thursday-container');
const fridaySatWidget = window.createFridaySaturdayWidget('fri-sat-container', { defaultView: 'morning' });

// Destroy all widgets for cleanup
window.NZGDCScheduleWidget.destroyAll();
window.destroyAllFridaySaturdayWidgets();

// Check active instances
console.log('Active Thursday widgets:', window.NZGDCScheduleWidget.instances.size);
console.log('Active Fri/Sat widgets:', window.activeFridaySaturdayWidgets.size);
```

## 🚀 Performance & Optimization

### Loading Optimizations
- **Asynchronous Loading**: All external files loaded asynchronously with timeout handling
- **Resource Caching**: Browser caching enabled for CSS, JS, and template files
- **Lazy Initialization**: Widgets only initialize when containers are detected
- **Memory Management**: Comprehensive cleanup and destroy functionality
- **Error Recovery**: Graceful fallbacks for loading failures

### Runtime Optimizations
- **Event Delegation**: Efficient event handling using delegation patterns
- **DOM Reuse**: Template cloning instead of repeated DOM creation
- **State Caching**: Filter and view states cached to prevent recomputation
- **Throttled Interactions**: Debounced resize and interaction handlers
- **Minimal Repaints**: CSS-based view switching to minimize DOM manipulation

### File Size Analysis

#### Thursday Widget Bundle
- **Entry Point**: ~323 lines (`nzgdc-schedule-widget-modular.js`)
- **CSS Bundle**: ~800 lines (`thursday-schedule-bundle.css`)  
- **Core Logic**: ~400 lines (`widget-core.js`)
- **Total Compressed**: ~45KB (CSS + JS combined)

#### Friday/Saturday Widget Bundle
- **Entry Point**: ~280 lines (`nzgdc-friday-saturday-schedule-widget-modular.js`)
- **CSS Bundle**: ~1073 lines (`friday-saturday-schedule-bundle.css`)
- **Core Logic**: ~531 lines (`friday-saturday-widget-core.js`)
- **Total Compressed**: ~52KB (CSS + JS combined)

#### Shared Components (Used by Both)
- **Event Panel CSS**: ~600 lines (`unified-event-panel.css`)
- **Event Loader**: ~400 lines (`unified-event-loader.js`)
- **Category Filter CSS**: ~200 lines (`category-filter-overlay.css`)
- **Template**: ~50 lines (`unified-event-panel.html`)
- **Total Shared**: ~25KB (compressed)

## 📦 Production Deployment

### Pre-Deployment Checklist
- [ ] All CSS files accessible and served with correct MIME types
- [ ] All JavaScript files accessible without CORS restrictions  
- [ ] Template files accessible from widget entry points
- [ ] Event data files contain valid JSON/JavaScript
- [ ] Container elements exist with correct data attributes
- [ ] Debug mode disabled (`window.NZGDC_DEBUG = false`)
- [ ] CDN caching configured (if applicable)

### File Upload Order (Critical)
1. **Upload CSS files first** (prevents FOUC - Flash of Unstyled Content):
   - `css/unified-event-panel.css`
   - `css/category-filter-overlay.css` 
   - `css/thursday-schedule-bundle.css`
   - `css/friday-saturday-schedule-bundle.css`

2. **Upload JavaScript modules**:
   - `js/unified-event-loader.js`
   - `js/widget-core.js`
   - `js/friday-saturday-widget-core.js`
   - `js/*-generator.js` files
   - `js/*-data.js` files  
   - `js/*-events.js` files

3. **Upload templates**:
   - `templates/unified-event-panel.html`

4. **Upload entry points last**:
   - `nzgdc-schedule-widget-modular.js`
   - `nzgdc-friday-saturday-schedule-widget-modular.js`

### Integration Examples

#### WordPress Integration
```php
// functions.php
function nzgdc_widget_scripts() {
    wp_enqueue_script(
        'nzgdc-thursday-widget', 
        get_template_directory_uri() . '/js/nzgdc-schedule-widget-modular.js',
        [],
        '1.0',
        true
    );
    
    wp_enqueue_script(
        'nzgdc-friday-saturday-widget',
        get_template_directory_uri() . '/js/nzgdc-friday-saturday-schedule-widget-modular.js', 
        [],
        '1.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'nzgdc_widget_scripts');
```

```html
<!-- In your WordPress template -->
<div class="nzgdc-schedule-section">
    <div data-nzgdc-schedule></div>
</div>

<div class="nzgdc-friday-saturday-section"> 
    <div data-nzgdc-friday-saturday-schedule></div>
</div>
```

#### React/Vue/Angular Integration
```javascript
// React Component
import { useEffect, useRef } from 'react';

function NZGDCSchedule({ type = 'thursday' }) {
    const containerRef = useRef(null);
    
    useEffect(() => {
        // Load widget script dynamically
        const script = document.createElement('script');
        script.src = type === 'thursday' 
            ? '/js/nzgdc-schedule-widget-modular.js'
            : '/js/nzgdc-friday-saturday-schedule-widget-modular.js';
        script.onload = () => {
            if (type === 'thursday') {
                window.NZGDCScheduleWidget?.create(containerRef.current.id);
            } else {
                window.createFridaySaturdayWidget?.(containerRef.current.id);
            }
        };
        document.head.appendChild(script);
        
        return () => {
            // Cleanup on unmount
            if (type === 'thursday') {
                window.NZGDCScheduleWidget?.destroyAll();
            } else {
                window.destroyAllFridaySaturdayWidgets?.();
            }
            document.head.removeChild(script);
        };
    }, [type]);
    
    return (
        <div 
            ref={containerRef}
            id={`nzgdc-${type}-${Date.now()}`}
            data-nzgdc-schedule={type === 'thursday' ? '' : undefined}
            data-nzgdc-friday-saturday-schedule={type !== 'thursday' ? '' : undefined}
        />
    );
}
```

## 🧪 Testing & Quality Assurance

### Included Demo & Testing Suite
The widget system includes comprehensive testing capabilities:

#### Demo Page (.widget-tests/widget-demo.html)
- **Complete Integration**: Tests all three widget types (Thursday, Morning, Afternoon)
- **View Switching**: Validates seamless switching between morning and afternoon views  
- **Filter Testing**: Category filters and "Clear Filter" functionality
- **Responsive Testing**: Mobile and tablet layout validation
- **Error Scenarios**: Network failure and missing resource handling
- **Debug Information**: Real-time system status and diagnostic output

#### Using the Demo Page
```bash
# Serve the widget-demo.html file (required due to CORS restrictions)
cd nzgdc-widget/.widget-tests
python -m http.server 8000
# Navigate to: http://localhost:8000/widget-demo.html

# Or using Node.js
npx serve .
# Navigate to: http://localhost:5000/widget-demo.html
```

### Testing Workflow

#### Development Testing
1. **Unit Testing**: Individual widget component validation
2. **Integration Testing**: Cross-widget compatibility verification  
3. **UI/UX Testing**: Visual regression and usability testing
4. **Performance Testing**: Load time and memory usage validation
5. **Accessibility Testing**: Screen reader and keyboard navigation testing

#### Filter System Testing  
1. **Category Dropdown**: Verify all categories appear correctly
2. **Filter Functionality**: Test event filtering by category selection
3. **Clear Filter**: Validate "Clear Filter" restores all events
4. **State Persistence**: Ensure filter state maintained during view switching
5. **Mobile Behavior**: Test dropdown behavior on mobile devices

#### Production Readiness Checklist
- [ ] All widgets load successfully in demo environment
- [ ] Event panels display correctly with proper styling
- [ ] Category filters function properly in all widget types
- [ ] View switching works seamlessly in Friday/Saturday widget
- [ ] No JavaScript console errors
- [ ] Mobile responsiveness validated on multiple devices
- [ ] Cross-browser compatibility confirmed (Chrome, Firefox, Safari, Edge)
- [ ] Performance metrics within acceptable ranges
- [ ] Accessibility standards compliance validated

## 📋 Widget System Summary

### Thursday Workshop Schedule Widget
**Purpose**: Display NZGDC Thursday workshop schedule with category filtering
**Features**: 
- Workshop time slot organization (9.00am-12.00pm, 12.00pm-3.00pm)
- Category-based dropdown filtering system
- Interactive event panels with speaker information
- Responsive grid layout with mobile optimization

**Key Files**:
- Entry: `nzgdc-schedule-widget-modular.js`
- Controller: `js/widget-core.js`
- Generator: `js/schedule-generator.js`
- Data: `js/schedule-data.js`, `js/workshop-events.js`
- Styles: `css/thursday-schedule-bundle.css`

### Friday/Saturday Unified Schedule Widget  
**Purpose**: Display NZGDC Friday/Saturday events with seamless morning/afternoon view switching
**Features**:
- Unified widget supporting both morning and afternoon events
- Automatic button wiring for existing "Morning Events" and "Afternoon Events" buttons
- Default morning view with instant afternoon switching
- Category filtering across both views
- Preserved visual themes (morning=yellow, afternoon=blue)

**Key Files**:
- Entry: `nzgdc-friday-saturday-schedule-widget-modular.js`  
- Controller: `js/friday-saturday-widget-core.js`
- Generators: `js/morning-schedule-generator.js`, `js/afternoon-schedule-generator.js`
- Data: `js/morning-schedule-data.js`, `js/afternoon-schedule-data.js`, `js/morning-events.js`, `js/afternoon-events.js`
- Styles: `css/friday-saturday-schedule-bundle.css`

### Unified System Architecture Benefits
- **Code Reuse**: Shared event panel system across all widgets (60% code reuse)
- **Consistent UX**: Identical event panel behavior and styling
- **Simplified Maintenance**: Single template and styling system for event panels
- **Enhanced Performance**: Shared resource loading and caching
- **Future-Proof**: Modular architecture supports easy feature additions

## 🔄 Version History & Recent Changes

### Current Version: v1.3 (August 2025)
**Major Achievement: Friday/Saturday Schedule Consolidation**

#### Key Changes:
- **Consolidated Architecture**: Combined separate morning/afternoon widgets into unified Friday/Saturday widget
- **Enhanced Button Integration**: Automatic wiring of existing "Morning Events" and "Afternoon Events" buttons
- **Simplified File Structure**: 50% reduction in duplicate widget files
- **Preserved User Experience**: Zero visual or functional changes to end-user experience
- **Improved Maintainability**: Single codebase for Friday/Saturday functionality

#### Files Added:
- `nzgdc-friday-saturday-schedule-widget-modular.js` (unified entry point)
- `css/friday-saturday-schedule-bundle.css` (consolidated CSS)
- `js/friday-saturday-widget-core.js` (unified controller)

#### Files Deprecated:
- `nzgdc-morning-schedule-widget-modular.js` (moved to `.deprecated/`)
- `nzgdc-afternoon-schedule-widget-modular.js` (moved to `.deprecated/`)
- `css/morning-schedule-bundle.css` (moved to `.deprecated/`)
- `css/afternoon-schedule-bundle.css` (moved to `.deprecated/`)
- `js/morning-widget-core.js` (moved to `.deprecated/`)
- `js/afternoon-widget-core.js` (moved to `.deprecated/`)

### Previous Versions:
- **v1.2**: Unified Event Panel Architecture implementation
- **v1.1**: Performance optimizations and production readiness
- **v1.0**: Initial modular architecture with separate widget types

## 🚨 Critical Production Notes

### Emergency Debug Mode
If issues arise in production, enable emergency debugging:
```javascript
// Add to browser console or page JavaScript
window.NZGDC_DEBUG = true;
location.reload(); // Reload page with debug enabled

// Or via URL
// https://yoursite.com/page?debug=true
```

### Rollback Procedures  
If the unified Friday/Saturday widget causes issues, the deprecated separate widgets can be quickly restored:
```html
<!-- Emergency rollback: use deprecated separate widgets -->
<script src="nzgdc-widget/.deprecated/nzgdc-morning-schedule-widget-modular.js"></script>
<script src="nzgdc-widget/.deprecated/nzgdc-afternoon-schedule-widget-modular.js"></script>
```

## 📞 Support & Documentation

### Additional Documentation
- **Complete Changelogs**: See `changelogs/` directory for detailed change history
- **Technical Specifications**: See `docs/documentation/` for technical details  
- **Filter System Details**: See `docs/filter-changelogs/` for category system evolution
- **Performance Audits**: See `docs/audits/` for performance analysis

### Getting Help
1. **Enable Debug Mode**: Add `?debug=true` to URL and check browser console
2. **Check Demo Page**: Test functionality in `.widget-tests/widget-demo.html`
3. **Review Changelogs**: Check recent changes in `changelogs/` directory
4. **Validate File Structure**: Ensure all required files are present and accessible
5. **Test API Methods**: Use debug API methods to diagnose system status

### Reporting Issues
When reporting issues, include:
- **Browser and version**: Chrome 120, Firefox 119, etc.
- **Widget type**: Thursday, Friday/Saturday, or both
- **Error messages**: Complete JavaScript console output
- **Configuration**: Any custom options or data attributes used
- **Network information**: Any CORS, 404, or loading errors
- **Debug output**: Results from `window.NZGDC_DEBUG = true`

---

**Project Repository**: NZGDC Event Schedule Widget System  
**Maintainer**: Fox Studios NZ  
**Architecture**: Modular JavaScript with Unified Event Panel System  
**Production Status**: Deployed and Validated ✅  
**Version**: 1.3.0 (August 2025)  
**License**: Apache 2.0