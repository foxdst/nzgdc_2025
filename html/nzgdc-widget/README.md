# NZGDC Schedule Widgets Documentation

A comprehensive, modular JavaScript widget system for displaying New Zealand Game Developers Conference (NZGDC) event schedules. Features unified event panel architecture, advanced category filtering, and seamless integration capabilities for Thursday workshops and Friday/Saturday morning/afternoon events.

## 📁 Project Structure

```
nzgdc-widget/
├── css/
│   ├── unified-event-panel.css                  # ⭐ CRITICAL: Core event panel styles (all widgets)
│   ├── category-filter-overlay.css              # Category dropdown/filter system styles
│   ├── expanded-event-details-overlay.css       # Expanded event details overlay styles
│   ├── thursday-schedule-bundle.css             # Thursday-specific schedule layout styles
│   └── friday-saturday-schedule-bundle.css     # Fri/Sat unified schedule layout styles
├── js/
│   ├── unified-event-loader.js                  # ⭐ CRITICAL: Event panel generator & content
│   ├── expanded-event-details-manager.js       # Expanded event details overlay system
│   ├── data-manager.js                         # Centralized data loading and management
│   ├── data-transformer.js                      # Data transformation layer for API standardization
│   ├── event-api.js                             # Event data access API
│   ├── schedule-api.js                          # Schedule data access API
│   ├── speaker-api.js                           # Speaker data access API
│   ├── category-api.js                          # Category data access API
│   ├── room-api.js                              # Room data access API
│   ├── stream-api.js                            # Stream data access API
│   ├── session-type-api.js                      # Session type data access API
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
│   ├── data-transformer.js                      # Data transformation layer for API standardization
│   ├── data-transformer-usage-example.js       # Example usage of the DataTransformer
│   └── data-transformer.test.js                # Test file for the DataTransformer
├── templates/
│   ├── unified-event-panel.html                # Event panel HTML template (all widgets)
│   └── expanded-event-details-overlay.html     # Expanded event details overlay template
├── docs/
│   ├── audits/                                 # Performance & code quality audits
│   ├── documentation/                          # Technical documentation
│   ├── filter-changelogs/                     # Category filter system changes
│   ├── tasks/                                  # ⚠️ MANDATORY: LLM coding guidelines & warnings
│   ├── tasks-drafts/                          # Draft specifications
│   └── tasks-obsolete/                        # Completed/obsolete tasks
├── changelogs/                                 # Deployment & feature change history
├── .widget-tests/
│   └── widget-demo.html                        # ⭐ TESTING: Live demo page for all widgets
├── .deprecated/
│   ├── nzgdc-morning-schedule-widget-modular.js    # Legacy: Separate morning widget
│   ├── nzgdc-afternoon-schedule-widget-modular.js  # Legacy: Separate afternoon widget
│   ├── morning-schedule-bundle.css                 # Legacy: Morning-only CSS (MOVED)
│   ├── afternoon-schedule-bundle.css               # Legacy: Afternoon-only CSS (MOVED)
│   ├── morning-widget-core.js                      # Legacy: Morning-only controller
│   ├── afternoon-widget-core.js                    # Legacy: Afternoon-only controller
│   └── *.html                                      # Legacy: Individual test pages
├── nzgdc-schedule-widget-modular.js            # 🚀 ENTRY POINT: Thursday workshop widget
├── nzgdc-friday-saturday-schedule-widget-modular.js # 🚀 ENTRY POINT: Fri/Sat unified widget
└── README.md                                   # This documentation file
```

## ⚠️ CRITICAL LLM/AI CODING WARNINGS

**BEFORE making ANY changes to this codebase, read these mandatory warnings:**

### 🚨 DO NOT DUPLICATE EXISTING FUNCTIONALITY
- **Event panel overlays are ALREADY clickable buttons** - do not create new buttons
- **Expanded event details system ALREADY exists** - do not rebuild it
- **Category filtering ALREADY works** - extend existing system, don't replace it
- **All event panels have hover overlays** - they are the interactive elements

### 🚨 CRITICAL FILE BOUNDARIES
- **Event panel styles ONLY in `unified-event-panel.css`** - NEVER in bundle CSS files
- **Widget layout styles ONLY in bundle CSS files** - NEVER in unified-event-panel.css
- **All event creation logic ONLY in `unified-event-loader.js`** - NEVER duplicate

### 🚨 MANDATORY READING FOR AI ASSISTANTS
1. **`docs/tasks/CRITICAL_OVERLAY_BUTTON_WARNING.md`** - Existing clickable functionality
2. **`docs/tasks/AI_ASSISTANT_QUICK_REFERENCE_GUIDE.md`** - Complete development guide
3. **Test EXISTING functionality before assuming it doesn't work**

### 🚨 COMMON AI CODING MISTAKES TO AVOID
- Creating new event detail buttons (overlays ARE the buttons)
- Modifying CSS files outside their designated scope
- Rebuilding existing event panel creation logic
- Ignoring the unified event loader system
- Breaking the critical CSS loading order

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
   - `css/expanded-event-details-overlay.css` (expanded details overlay styles)
   - `css/thursday-schedule-bundle.css` (Thursday layout styles)

2. **JavaScript Layer (Loaded Second)**:
   - `js/expanded-event-details-manager.js` (expanded details system)
   - `js/unified-event-loader.js` (CRITICAL - event panel generator)
   - `js/widget-core.js` (Thursday controller)
   - `js/schedule-generator.js` (Thursday DOM builder)
   - `js/schedule-data.js` (Thursday configuration)
   - `js/workshop-events.js` (Thursday event details)

3. **Template Layer (Loaded Third)**:
   - `templates/unified-event-panel.html` (event panel template)
   - `templates/expanded-event-details-overlay.html` (expanded details template)

### Friday/Saturday Widget Dependencies (nzgdc-friday-saturday-schedule-widget-modular.js)
**CRITICAL: Files MUST load in this exact order:**
1. **CSS Layer (Loaded First)**:
   - `css/unified-event-panel.css` (CRITICAL FIRST - event panel styles)
   - `css/category-filter-overlay.css` (filter dropdown styles)
   - `css/expanded-event-details-overlay.css` (expanded details overlay styles)
   - `css/friday-saturday-schedule-bundle.css` (Fri/Sat layout styles)

2. **JavaScript Layer (Loaded Second)**:
   - `js/expanded-event-details-manager.js` (expanded details system)
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
   - `templates/expanded-event-details-overlay.html` (expanded details template)

## 🔧 Core Architecture

### Unified Event Panel System
The heart of all widgets is the **unified event panel architecture** that provides consistent 620x300px event panels across all widget types:
 
### Data Management Architecture
The widget system now includes a comprehensive data management layer that handles loading, transformation, and standardized access to all event data:

#### `DataManager` (js/data-manager.js)
**Primary Responsibilities:**
- Loading data from the Entegy API endpoint
- Coordinating data transformation through the DataTransformer
- Managing internal data stores for all entity types
- Providing getter methods for accessing standardized data
- Validating data integrity after loading

#### `DataTransformer` (js/data-transformer.js)
**Primary Responsibilities:**
- Transforming raw API data to standardized formats
- Handling speaker duplication resolution between top-level and embedded speakers
- Standardizing category information with enhanced properties
- Extracting and standardizing Room, Stream, and Session Type entities
- Converting schedule days to standardized Schedule objects
- Converting sessions to standardized Event objects
- Implementing comprehensive error handling and validation

#### API Modules (js/*-api.js)
**Primary Responsibilities:**
- Providing standardized access patterns to different data types
- Abstracting the underlying data storage implementation
- Enabling consistent data access across all components
- Supporting future extensibility and enhancements

The data management architecture provides several key benefits:
- **Centralized Data Access**: All data is loaded and managed through a single point
- **Standardized Formats**: All entities are transformed to consistent formats
- **Data Integrity**: Comprehensive validation ensures data quality
- **Extensibility**: API modules allow for easy addition of new features
- **Performance**: Efficient data loading and caching strategies with enhanced thumbnail fallback
- **Maintainability**: Clear separation of concerns between data and presentation
- **Data Consistency**: Corrected speaker field mapping ensures reliable data display

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
- `js/expanded-event-details-manager.js`: Expanded event details overlay system
- `templates/unified-event-panel.html`: Event panel HTML structure
- `templates/expanded-event-details-overlay.html`: Expanded details overlay template

#### Friday/Saturday Widget
- `js/morning-schedule-data.js`: Morning event time slots and structure
- `js/afternoon-schedule-data.js`: Afternoon event time slots and structure  
- `js/morning-events.js`: Complete morning event details and speakers
- `js/afternoon-events.js`: Complete afternoon event details and speakers
- `js/expanded-event-details-manager.js`: Expanded event details overlay system
- `templates/unified-event-panel.html`: Event panel HTML structure
- `templates/expanded-event-details-overlay.html`: Expanded details overlay template

## 🎨 CSS Architecture & Styling System

### Critical CSS Loading Order
**⚠️ VIOLATION OF THIS ORDER WILL BREAK THE WIDGETS:**

1. **`css/unified-event-panel.css`** (MUST BE FIRST)
   - Contains all event panel styles (620x300px big panels, 300x300px main panels)
   - CSS custom properties for theming
   - Event thumbnail and overlay systems
   - Speaker bio and category display styles

2. **`css/category-filter-overlay.css`** (MUST BE SECOND)  
   - Category dropdown positioning and styling
   - Filter button states and interactions
   - Overlay and modal behaviors

3. **`css/expanded-event-details-overlay.css`** (MUST BE THIRD)
   - Expanded event details modal styling
   - Overlay positioning and transitions
   - Content formatting and responsive behavior

4. **Widget-Specific Bundle** (MUST BE FOURTH)
   - `css/thursday-schedule-bundle.css` (Thursday layouts only)
   - `css/friday-saturday-schedule-bundle.css` (Fri/Sat unified layouts only)

**🚨 DEPRECATED FILES (DO NOT REFERENCE):**
- `morning-schedule-bundle.css` (moved to `.deprecated/`)
- `afternoon-schedule-bundle.css` (moved to `.deprecated/`)

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
**🚨 COMMON LLM MISTAKE: Adding event panel styles to widget bundle files**

**Bundle files (thursday-schedule-bundle.css, friday-saturday-schedule-bundle.css) MUST NEVER contain:**
- `.nzgdc-event-panel-*` styles (ALL event panel styling belongs in unified-event-panel.css)
- `.nzgdc-event-category-*` styles (category badges are part of event panels)
- `.nzgdc-speaker-*` styles (speaker info is part of event panels)
- `.nzgdc-event-detail-overlay-*` styles (overlays are part of event panels)
- Event panel layout, positioning, or hover behavior CSS
- Event thumbnail or image styling
- ANY CSS that affects the 620x300px or 300x300px event panel areas

**WHY THIS MATTERS:**
- Event panels are shared across ALL widget types
- Duplicating styles breaks the unified design system
- Changes must apply consistently across Thursday, Friday, and Saturday widgets
- CSS conflicts will break event panel functionality

#### ❌ FORBIDDEN: Widget Layout CSS in Event Panel Files  
**🚨 COMMON LLM MISTAKE: Adding widget-specific layouts to unified files**

**unified-event-panel.css MUST NEVER contain:**
- Widget container layouts (`.nzgdc-schedule-widget`, `.nzgdc-friday-saturday-schedule-widget`)
- Grid or flexbox layouts for widget structure
- Widget-specific responsive breakpoints
- Widget header, footer, or navigation styling
- View switching or tab styling (these are widget behaviors, not event panel behaviors)

#### ✅ REQUIRED: Proper CSS Scoping
**CORRECT approach for styling modifications:**

```css
/* ✅ CORRECT: Event panel styling in unified-event-panel.css */
.nzgdc-event-panel-big {
    /* Event panel specific styles */
}

/* ✅ CORRECT: Widget layout in respective bundle files */
.nzgdc-schedule-widget .widget-grid {
    /* Widget layout styles */
}
```

```css
/* ❌ WRONG: Event panel styles in bundle files */
.nzgdc-schedule-widget .nzgdc-event-panel-big {
    /* This violates architecture boundaries */
}

/* ❌ WRONG: Widget layout in unified files */
.nzgdc-event-panel-big .widget-container {
    /* Event panels don't control widget layouts */
}
```

#### 🚨 CRITICAL: Loading Order Enforcement
**If CSS files are loaded in wrong order, the widgets WILL break:**

1. **unified-event-panel.css** - Defines all event panel base styles
2. **category-filter-overlay.css** - Defines filter system styles  
3. **expanded-event-details-overlay.css** - Defines modal overlay styles
4. **Widget bundle CSS** - Defines widget-specific layouts only

**Common loading order mistakes:**
- Loading widget bundle before unified-event-panel.css (styles will be overridden)
- Missing category-filter-overlay.css (filter dropdowns won't display correctly)
- Loading expanded-event-details-overlay.css after widget bundles (modals won't overlay properly)

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

## 🔍 Expanded Event Details System

### Overview
The Expanded Event Details system provides comprehensive event information in a full-screen overlay when users click on event panel overlays. This system seamlessly integrates with both Big Panel (620x300) and Main Panel (300x300) designs.

### 🚨 CRITICAL WARNING FOR AI/LLM DEVELOPERS

**⚠️ THE OVERLAYS ARE ALREADY CLICKABLE BUTTONS - DO NOT DUPLICATE THIS FUNCTIONALITY**

**MANDATORY READING: `docs/tasks/CRITICAL_OVERLAY_BUTTON_WARNING.md`**

#### Existing Functionality (DO NOT REBUILD):
- **Big Panel (620x300)**: `.nzgdc-event-detail-overlay-big` is a fully clickable button
- **Main Panel (300x300)**: `.nzgdc-event-panel-overlay-main` is a fully clickable button  
- **Click Behavior**: Clicking anywhere on overlay opens Expanded Event Details
- **Interactive Area**: Entire overlay area (300x300px) is the click target

#### ❌ WHAT YOU MUST NOT DO:
```javascript
// WRONG - This functionality ALREADY EXISTS
const newButton = document.createElement('button');
newButton.textContent = 'Open Event Details';
eventPanel.appendChild(newButton);

// WRONG - This click handler ALREADY EXISTS  
eventPanel.addEventListener('click', () => {
    openEventDetails(); // This is ALREADY implemented
});
```

#### ✅ WHAT ALREADY WORKS:
1. Hover over any event panel thumbnail → overlay appears with speaker details
2. Click anywhere on the overlay → expanded event details modal opens
3. The overlays themselves ARE the interactive buttons
4. All accessibility features are already implemented

**Before implementing ANY event details functionality, test the existing system first!**

### Core Components
- **Event Details Manager** (`js/expanded-event-details-manager.js`): Overlay lifecycle management and content population
- **Overlay Styling** (`css/expanded-event-details-overlay.css`): Complete overlay visual design system
- **Template System** (`templates/expanded-event-details-overlay.html`): HTML structure for overlay content
- **Data Integration**: Automatic mapping of widget event data to overlay display format

### User Interaction Flow
1. **Hover Event Panel**: Overlay appears with speaker preview and CTA
2. **Click Overlay**: Entire overlay area is clickable (large accessibility target)
3. **Expanded Details**: Full-screen overlay shows complete event information
4. **Close Options**: ESC key, click outside, or close button

### Event Information Display
- **Event Title & Description**: Complete event synopsis and detailed information
- **Speaker Profiles**: Full speaker bios with headshots, positions, and contact information
- **Audience Targeting**: Visual tags showing intended audience categories
- **Event Context**: Category, timeframe, and event-specific details

### Technical Integration
- **Seamless Integration**: Works with existing overlay click system without breaking functionality
- **Data Compatibility**: Supports event data from all widget types (Thursday, Morning, Afternoon)
- **Responsive Design**: Mobile-optimized layout with touch-friendly interactions
- **Performance Optimized**: Lazy loading, efficient memory management, and smart thumbnail fallback

### Accessibility Features
- **Keyboard Navigation**: Full keyboard support including ESC to close
- **Screen Reader Support**: Proper ARIA labels and semantic structure
- **Focus Management**: Returns focus to trigger element when closed
- **Large Click Targets**: Entire overlay area clickable for easier interaction

## 🐛 Debugging & Troubleshooting

### 🚨 BEFORE YOU DEBUG: Test Existing Functionality First

**MANDATORY STEP**: Before assuming any functionality is broken or missing, thoroughly test what already exists:

#### Event Panel Interaction Testing
```javascript
// 1. Test overlay appearance on hover
// Hover over any event panel thumbnail - overlay should appear with speaker details

// 2. Test overlay click functionality  
// Click anywhere on the overlay - expanded event details should open

// 3. Test existing event details system
// Verify the modal opens, displays content, and can be closed

// 4. Check browser console for existing debug messages
console.log('Testing existing functionality...');
```

#### Filter System Testing
```javascript
// 1. Test Thursday filter dropdown
// Check if category filter dropdown appears and functions

// 2. Test Friday/Saturday filter coordination
// Verify filters work across both morning and afternoon views

// 3. Test filter state persistence
// Switch views and verify filter state is maintained
```

#### Common "Missing" Features That Actually Exist
- **"Event panels need click handlers"** → Overlays ARE clickable buttons
- **"Need to build expanded event details"** → System already exists in expanded-event-details-manager.js
- **"Category filtering doesn't work"** → Filter system is fully implemented
- **"Panels need hover effects"** → Hover overlays already implemented

**If something appears broken, debug the existing system before rebuilding it!**

**✅ Recent Improvements**: Speaker data field mapping has been corrected for consistent display across all widget components. Thumbnail fallback now uses speaker headshots when event thumbnails are unavailable.

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

#### 0. "Functionality Doesn't Exist" (Most Common AI/LLM Mistake)
**Symptoms**: Assuming features need to be built from scratch
**Reality Check Steps**:
```javascript
// Test existing overlay click functionality
console.log('Testing overlay clicks...');
// 1. Hover over event thumbnails
// 2. Click on the overlays that appear
// 3. Verify expanded event details open

// Check for existing systems
console.log('Expanded Event Details Manager:', window.ExpandedEventDetailsManager);
console.log('Unified Event Loader:', window.UnifiedEventLoader);

// Verify existing filter functionality
// 1. Look for category dropdown on Thursday widget
// 2. Test filter dropdown on Friday/Saturday widget
// 3. Verify filters actually work
```

**Solution**: **USE THE EXISTING FUNCTIONALITY** - extend it, don't rebuild it

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
- **Wrong CSS loading order**: CSS files must load in exact sequence (see above)
- **Missing container element**: Add `data-nzgdc-schedule` or `data-nzgdc-friday-saturday-schedule`
- **JavaScript errors**: Check browser console for errors
- **CSS loading failure**: Verify CSS files are accessible and in correct order
- **CORS issues**: Ensure all files served from same domain
- **Conflicting CSS**: Check for CSS conflicts with existing site styles

#### 2. Event Panels Not Displaying Correctly
**Symptoms**: Broken layout, missing content, styling issues

**⚠️ First Check**: Are you testing with the correct CSS loading order?
```html
<!-- REQUIRED ORDER - test this exact sequence -->
<link rel="stylesheet" href="css/unified-event-panel.css">
<link rel="stylesheet" href="css/category-filter-overlay.css">  
<link rel="stylesheet" href="css/expanded-event-details-overlay.css">
<link rel="stylesheet" href="css/thursday-schedule-bundle.css">
<!-- OR -->
<link rel="stylesheet" href="css/friday-saturday-schedule-bundle.css">
```

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

#### 5. Expanded Event Details Not Working
**Symptoms**: Clicking overlays doesn't show expanded details, overlay not appearing, content missing
**Debugging Steps**:
```javascript
// Check expanded details manager
console.log('Manager available:', typeof window.ExpandedEventDetailsManager);
console.log('Manager instance:', window.expandedEventDetailsManager);

// Check manager status
console.log('Manager status:', window.expandedEventDetailsManager?.getStatus());

// Enable debug mode
localStorage.setItem('nzgdc-expanded-details-debug', 'true');

// Test manual overlay
if (window.expandedEventDetailsManager) {
    const testData = {
        title: "Test Event",
        description: "Test description",
        speakers: [{ name: "Test Speaker", position: "Test Position", bio: "Test bio" }]
    };
    window.expandedEventDetailsManager.showEventDetails(testData, 'manual-test');
}
```

**Common Causes & Solutions**:
- **Manager not loaded**: Verify `expanded-event-details-manager.js` loaded correctly
- **CSS not loaded**: Ensure `expanded-event-details-overlay.css` loaded after unified-event-panel.css
- **Template loading failure**: Check `templates/expanded-event-details-overlay.html` is accessible
- **Click handler integration failure**: Verify unified-event-loader.js has manager integration
- **Event data validation failure**: Check event data has required fields (title, speakers array)

#### 6. Speaker Data Mapping Verification

**Symptoms**: Speaker names, positions, or contact info not displaying correctly, thumbnails missing
**Debugging Steps**:
```javascript
// Check speaker data transformation
const dataManager = window.dataManagerInstance;
if (dataManager) {
    const speakers = dataManager.getSpeakerData();
    console.log('Speaker data available:', speakers.size);
    
    // Check first speaker's field mapping
    const firstSpeaker = Array.from(speakers.values())[0];
    console.log('Sample speaker data mapping:', {
        displayName: firstSpeaker?.displayName,
        name: firstSpeaker?.name,
        position: firstSpeaker?.position,
        headshot: firstSpeaker?.headshot,
        email: firstSpeaker?.email,
        website: firstSpeaker?.website
    });
}

// Verify HTML element mapping
const speakerElements = {
    bioNameBig: document.querySelectorAll('.nzgdc-speaker-bioName-big'),
    nameMain: document.querySelectorAll('.nzgdc-speaker-name-main'),
    expandedName: document.querySelectorAll('.nzgdc-expanded-speaker-name'),
    nameItem: document.querySelectorAll('.nzgdc-speaker-name-item'),
    headshots: document.querySelectorAll('.nzgdc-speaker-headshot'),
    contactEmail: document.querySelectorAll('.nzgdc-contact-email'),
    contactWebsite: document.querySelectorAll('.nzgdc-contact-website')
};
console.log('Speaker HTML elements found:', speakerElements);

// Check thumbnail fallback behavior
const thumbnails = document.querySelectorAll('.nzgdc-session-thumbnail-big, .nzgdc-session-thumbnail-main');
thumbnails.forEach((thumb, i) => {
    const bgImage = window.getComputedStyle(thumb).backgroundImage;
    console.log(`Thumbnail ${i}:`, bgImage !== 'none' ? 'Has image' : 'No image');
});
```

**Common Issues & Solutions**:
- **Name field priority**: Ensure `displayName` is checked before `name` fallback
- **Missing headshots**: Verify `speakerImage` is properly mapped to `headshot` field
- **Contact links broken**: Check `web` field is properly mapped to `website` field
- **Position formatting**: Ensure `position` + `company` combination is properly formatted
- **Thumbnail fallback**: Verify speaker headshots are used when event thumbnails unavailable

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

### 🚨 CRITICAL: Deprecated Files Warning
**DO NOT upload these files to production (they are in `.deprecated/` folder):**
- `morning-schedule-bundle.css` ❌ DEPRECATED
- `afternoon-schedule-bundle.css` ❌ DEPRECATED  
- `nzgdc-morning-schedule-widget-modular.js` ❌ DEPRECATED
- `nzgdc-afternoon-schedule-widget-modular.js` ❌ DEPRECATED
- `morning-widget-core.js` ❌ DEPRECATED
- `afternoon-widget-core.js` ❌ DEPRECATED

**These have been consolidated into the unified Friday/Saturday widget system.**

### Pre-Deployment Checklist
- [ ] Verified no deprecated files are being uploaded
- [ ] All CSS files accessible and served with correct MIME types
- [ ] All JavaScript files accessible without CORS restrictions  
- [ ] Template files accessible from widget entry points
- [ ] Event data files contain valid JSON/JavaScript
- [ ] Container elements exist with correct data attributes
- [ ] CSS loading order tested and verified
- [ ] Event panel overlay click functionality tested
- [ ] Category filtering tested across all widget types
- [ ] Debug mode disabled for production builds
- [ ] Cross-browser compatibility verified (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsive behavior tested
- [ ] Performance benchmarks within acceptable range
- [ ] Debug mode disabled (`window.NZGDC_DEBUG = false`)
- [ ] CDN caching configured (if applicable)

### File Upload Order (Critical)

**🚨 UPLOAD ORDER MATTERS - WRONG ORDER WILL BREAK WIDGETS**

#### 1. **Upload CSS files FIRST** (exact order required to prevent FOUC):
   ```
   css/unified-event-panel.css                 # MUST BE FIRST - All event panel styles
   css/category-filter-overlay.css             # MUST BE SECOND - Filter dropdown styles  
   css/expanded-event-details-overlay.css      # MUST BE THIRD - Event details modal styles
   css/thursday-schedule-bundle.css            # Widget-specific layouts
   css/friday-saturday-schedule-bundle.css     # Widget-specific layouts
   ```

#### 2. **Upload Core JavaScript Modules**:
   ```
   js/unified-event-loader.js                  # CRITICAL: Event panel creation system
   js/expanded-event-details-manager.js        # CRITICAL: Event details overlay system
   js/widget-core.js                          # Thursday widget controller
   js/friday-saturday-widget-core.js          # Friday/Saturday widget controller
   js/schedule-generator.js                   # Thursday DOM generator
   js/morning-schedule-generator.js           # Morning DOM generator  
   js/afternoon-schedule-generator.js         # Afternoon DOM generator
   ```

#### 3. **Upload Data & Event Files**:
   ```
   js/schedule-data.js                        # Thursday workshop configuration
   js/morning-schedule-data.js               # Morning events configuration
   js/afternoon-schedule-data.js             # Afternoon events configuration
   js/workshop-events.js                     # Thursday event details
   js/morning-events.js                      # Morning event details
   js/afternoon-events.js                    # Afternoon event details
   ```

#### 4. **Upload Templates**:
   ```
   templates/unified-event-panel.html         # Event panel HTML structure
   templates/expanded-event-details-overlay.html  # Event details modal structure
   ```

#### 5. **Upload Entry Points LAST**:
   ```
   nzgdc-schedule-widget-modular.js           # Thursday widget entry point
   nzgdc-friday-saturday-schedule-widget-modular.js  # Friday/Saturday widget entry point
   ```

**⚠️ CRITICAL DEPLOYMENT NOTES:**
- CSS files MUST load in exact sequence or widgets will display incorrectly
- Entry points MUST be uploaded last as they depend on all other files
- Do NOT upload any files from `.deprecated/` folder
- Test widget functionality immediately after deployment

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

#### DataTransformer Testing
The DataTransformer can be tested independently using the provided test files:

```bash
# Test the DataTransformer with sample data
node js/data-transformer-usage-example.js

# Run the comprehensive test suite
node js/data-transformer.test.js
```

These test files demonstrate how to use the DataTransformer to convert raw API data
into standardized formats used by the widget system.

#### Integration Test Suite (new)
A comprehensive integration test suite has been created to validate all components work together correctly:

- **Integration Test Page**: `integration-test.html` - Complete integration test page that loads all API modules, initializes the DataManager, tests all API modules with real data, and displays results in a user-friendly format
- **Integration Test Script**: `js/integration-test.js` - JavaScript file that tests DataManager initialization, all API module methods, data transformation, error handling, and performance
- **Features**:
  - Tests all API modules with real data from the API endpoint
  - Validates data conformity to standardized formats
  - Handles errors gracefully
  - Displays results in a user-friendly format
  - Validates data transformation
  - Checks error handling
  - Verifies performance
  - Tests edge cases

#### Running the Integration Tests
```bash
# Serve the integration-test.html file (required due to CORS restrictions)
cd nzgdc-widget
python -m http.server 8000
# Navigate to: http://localhost:8000/integration-test.html

# Or using Node.js
npx serve .
# Navigate to: http://localhost:5000/integration-test.html
```


#### API Modules Testing
The API modules can be tested to verify they're working correctly with the data management system:

```bash
# Test all API modules
node js/api-modules-test.js
```

This test file demonstrates how to use all the API modules to access the transformed data.

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

## 🚨 COMPREHENSIVE LLM/AI ASSISTANT WARNING SUMMARY

**MANDATORY READING FOR ALL AI ASSISTANTS BEFORE MAKING ANY CODE CHANGES**

This section consolidates all critical warnings about existing functionality and common AI coding mistakes. Read this entirely before starting any development tasks.

### 🔴 EXISTING FUNCTIONALITY - DO NOT DUPLICATE

#### Event Panel Overlays ARE Clickable Buttons
- **Big Panel (620x300)**: `.nzgdc-event-detail-overlay-big` is ALREADY a clickable button
- **Main Panel (300x300)**: `.nzgdc-event-panel-overlay-main` is ALREADY a clickable button
- **Behavior**: Clicking anywhere on overlay opens Expanded Event Details
- **DO NOT**: Create new buttons, add click handlers, or build event details systems

#### Expanded Event Details System EXISTS
- **File**: `js/expanded-event-details-manager.js` - Complete overlay system
- **Template**: `templates/expanded-event-details-overlay.html` - Modal structure
- **CSS**: `css/expanded-event-details-overlay.css` - Complete styling
- **Integration**: Already integrated with event panel overlays
- **DO NOT**: Rebuild modal systems, duplicate overlay functionality

#### Category Filtering System EXISTS
- **Thursday**: Dropdown filter in `js/widget-core.js` (ThursdayCategoryDropdownController)
- **Friday/Saturday**: Unified filtering in `js/friday-saturday-widget-core.js`
- **CSS**: `css/category-filter-overlay.css` - Complete dropdown styling
- **Features**: Category selection, "Clear Filter", state persistence
- **DO NOT**: Rebuild filtering systems, create new category dropdowns

#### Event Panel Creation System EXISTS
- **File**: `js/unified-event-loader.js` - ALL event panel creation logic
- **Methods**: `createBigEventPanel()`, `createMainEventPanel()` - Complete event panel creation
- **Template**: `templates/unified-event-panel.html` - HTML structure
- **Usage**: Used by ALL widgets (Thursday, Friday, Saturday)
- **DO NOT**: Create separate event panel creation logic, duplicate template systems

### 🔴 CRITICAL ARCHITECTURAL BOUNDARIES

#### CSS File Boundaries (NEVER VIOLATE)
```
✅ CORRECT:
- Event panel styles → unified-event-panel.css ONLY
- Widget layouts → respective bundle CSS files ONLY
- Filter styles → category-filter-overlay.css ONLY

❌ WRONG:
- Event panel styles in bundle CSS files
- Widget layout styles in unified-event-panel.css
- Any CSS duplication across files
```

#### JavaScript File Boundaries (NEVER VIOLATE)
```
✅ CORRECT:
- Event panel creation → unified-event-loader.js ONLY
- Widget controllers → respective core.js files ONLY
- Event details → expanded-event-details-manager.js ONLY

❌ WRONG:
- Event panel logic in widget controllers
- Duplicate event creation methods
- Separate event details systems
```

#### Loading Order Requirements (CRITICAL)
```
MANDATORY CSS ORDER:
1. unified-event-panel.css (FIRST)
2. category-filter-overlay.css (SECOND)
3. expanded-event-details-overlay.css (THIRD)
4. Widget bundle CSS (LAST)

WRONG ORDER = BROKEN WIDGETS
```

### 🔴 DEPRECATED FILES - DO NOT USE

**These files have been moved to `.deprecated/` and MUST NOT be used:**
- `morning-schedule-bundle.css` ❌
- `afternoon-schedule-bundle.css` ❌
- `nzgdc-morning-schedule-widget-modular.js` ❌
- `nzgdc-afternoon-schedule-widget-modular.js` ❌
- `morning-widget-core.js` ❌
- `afternoon-widget-core.js` ❌

**Use instead:**
- `friday-saturday-schedule-bundle.css` ✅ (unified styling)
- `nzgdc-friday-saturday-schedule-widget-modular.js` ✅ (unified widget)
- `friday-saturday-widget-core.js` ✅ (unified controller)

### 🔴 COMMON AI MISTAKES TO AVOID

#### 1. "Event Panels Need Click Handlers"
**MISTAKE**: Adding click event listeners to event panels
**REALITY**: Overlays ARE the click handlers - they're already buttons
**SOLUTION**: Use existing overlay click functionality

#### 2. "Need to Build Event Details Modal"
**MISTAKE**: Creating new modal/overlay systems
**REALITY**: Complete system exists in expanded-event-details-manager.js
**SOLUTION**: Use existing `showEventDetails()` method

#### 3. "Category Filtering Doesn't Work"
**MISTAKE**: Rebuilding filter systems
**REALITY**: Full filtering exists in both widget types
**SOLUTION**: Test existing filters, extend if needed

#### 4. "Event Panels Don't Have Hover Effects"
**MISTAKE**: Adding new hover behaviors
**REALITY**: Sophisticated hover overlay system already exists
**SOLUTION**: Use existing overlay system in unified-event-loader.js

#### 5. "Need Separate Morning/Afternoon Widgets"
**MISTAKE**: Using deprecated separate widget files
**REALITY**: Unified Friday/Saturday widget handles both views
**SOLUTION**: Use unified widget with view switching

#### 6. "CSS Styles Not Working"
**MISTAKE**: Adding styles to wrong CSS files
**REALITY**: Strict architectural boundaries must be respected
**SOLUTION**: Follow CSS file boundary rules above

### 🚨 MANDATORY TESTING BEFORE DEVELOPMENT

**Before assuming ANY functionality is missing:**

1. **Test Overlay Clicks**: Hover over event thumbnails, click the overlays
2. **Test Event Details**: Verify expanded details modal opens and functions
3. **Test Category Filters**: Check dropdown filters in both widget types
4. **Test View Switching**: Verify Friday/Saturday view switching works
5. **Check Browser Console**: Look for existing debug messages and systems

### 🚨 EMERGENCY STOP CONDITIONS

**STOP DEVELOPMENT IMMEDIATELY IF:**
- You're creating new event panel click handlers
- You're building new modal/overlay systems  
- You're adding event panel styles to bundle CSS files
- You're using any deprecated files
- You're duplicating existing functionality
- You haven't tested existing systems first

### 🔧 CORRECT DEVELOPMENT APPROACH

**Instead of rebuilding, EXTEND existing systems:**
1. **Read the code** - Understand what exists
2. **Test thoroughly** - Verify current functionality  
3. **Extend methods** - Add to existing systems
4. **Follow boundaries** - Respect architectural rules
5. **Use unified systems** - Don't create parallel implementations

**Remember: This is a mature, well-architected system. Most functionality you think you need to build already exists. Your job is to work WITH the system, not replace it.**

## 🔄 Version History & Recent Changes

### Current Version: v1.4 (January 2025)
**Major Achievement: Separation of Concerns Architecture Refactoring**

#### Key Changes:
- **🏗️ Architectural Consistency**: Unified ID + Class pattern across all Event Panel designs (Big/Main)
- **🎯 Separation of Concerns**: IDs for JavaScript targeting, Classes for CSS styling throughout system
- **🔧 Enhanced Maintainability**: Consistent element targeting eliminates technical debt from mixed approaches
- **🔄 Backward Compatibility**: Full fallback support for legacy panels without breaking changes
- **📊 Future-Proof Updates**: Individual panel targeting enables advanced features and state management
- **🆔 Unique Element Targeting**: Dynamic ID generation ensures precise JavaScript control

#### Files Modified:
- `templates/unified-event-panel.html` (Added ID attributes)
- `js/unified-event-loader.js` (Major refactoring for ID-based targeting)
- `docs/separation-of-concerns-refactoring.md` (New documentation)

### Previous Version: v1.3 (August 2025)
**Major Achievement: Friday/Saturday Schedule Consolidation**

#### Key Changes:
- **Consolidated Architecture**: Combined separate morning/afternoon widgets into unified Friday/Saturday widget
- **Enhanced Button Integration**: Automatic wiring of existing "Morning Events" and "Afternoon Events" buttons
- **Simplified File Structure**: 50% reduction in duplicate widget files
- **Preserved User Experience**: Zero visual or functional changes to end-user experience
- **Improved Maintainability**: Single codebase for Friday/Saturday functionality
- **✅ Speaker Field Mapping Fixes**: Corrected consistent field prioritization and thumbnail fallback behavior

#### Files Added:
- `nzgdc-friday-saturday-schedule-widget-modular.js` (unified entry point)
- `css/friday-saturday-schedule-bundle.css` (consolidated CSS)
- `js/friday-saturday-widget-core.js` (unified controller)

#### Recent Fixes (Speaker Data Mapping):
- **Field Prioritization**: Fixed `displayName` field prioritization across all components
- **Thumbnail Fallback**: Enhanced thumbnail logic to use speaker headshots when event thumbnails unavailable
- **HTML Element Mapping**: Ensured consistent mapping of API fields to HTML elements:
  - `displayName` → `.nzgdc-speaker-bioName-big`, `.nzgdc-speaker-name-main`, `.nzgdc-expanded-speaker-name`, `.nzgdc-speaker-name-item`
  - `position` (combined) → `.nzgdc-speaker-bioPosition-big`, `.nzgdc-speaker-position-company-main`, `.nzgdc-expanded-speaker-position`
  - `headshot` → `.nzgdc-speaker-headshot` and thumbnail fallbacks
  - `email` → `.nzgdc-contact-email`
  - `website` → `.nzgdc-contact-website`

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

### 🤖 AI/LLM Assistant Resources (MANDATORY READING)
- **`docs/tasks/AI_ASSISTANT_QUICK_REFERENCE_GUIDE.md`** - Complete development guide for AI assistants
- **`docs/tasks/CRITICAL_OVERLAY_BUTTON_WARNING.md`** - Critical warning about existing clickable functionality
- **`docs/separation-of-concerns-refactoring.md`** - Architecture refactoring and ID + Class separation documentation
- **Architectural Safety Guidelines** - Prevent common AI coding mistakes and duplicated functionality

### Additional Documentation
- **Complete Changelogs**: See `changelogs/` directory for detailed change history
- **Technical Specifications**: See `docs/documentation/` for technical details  
- **Filter System Details**: See `docs/filter-changelogs/` for category system evolution
- **Performance Audits**: See `docs/audits/` for performance analysis

### Getting Help

#### For AI/LLM Assistants (READ FIRST):
1. **Read AI Assistant Quick Reference**: `docs/tasks/AI_ASSISTANT_QUICK_REFERENCE_GUIDE.md`
2. **Check Critical Warnings**: `docs/tasks/CRITICAL_OVERLAY_BUTTON_WARNING.md`
3. **Test Existing Functionality**: Before assuming anything is broken or missing
4. **Follow Architectural Boundaries**: Respect CSS and JavaScript file boundaries
5. **Don't Duplicate Existing Features**: Most functionality already exists

#### For General Development:
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
- **CSS loading order**: Verify CSS files are loaded in correct sequence
- **Existing functionality test results**: What happens when you test existing overlay clicks, filters, etc.
- **AI Assistant Context**: If you're an AI assistant, confirm you've read the mandatory warning documents
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