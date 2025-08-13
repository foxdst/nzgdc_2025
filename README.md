# NZGDC Event Schedule Widget System

A comprehensive, modular JavaScript widget system for displaying New Zealand Game Developers Conference (NZGDC) event schedules. Features unified event panel architecture, advanced category filtering, and seamless integration capabilities for Thursday workshops and Friday/Saturday morning/afternoon events.

## 🏗️ Project Overview

This project provides a production-ready, embeddable widget system that displays NZGDC conference schedules with the following key features:

- **Unified Event Panel Architecture**: Consistent 620x300px event panels across all widget types
- **Advanced Category Filtering**: 12 predefined event categories with visual indicators
- **Consolidated Friday/Saturday Widget**: Seamless view switching between morning and afternoon events
- **Real-time Data Integration**: API connectivity for live schedule updates
- **Responsive Design**: Mobile-first approach with comprehensive breakpoint system
- **Production-Grade Architecture**: Comprehensive error handling, debugging, and cleanup systems

## 📁 Project Structure

```
JS Embed/
├── application.js                                        # Legacy API integration & core classes
├── html/
│   ├── nzgdc-widget/                                    # MAIN WIDGET SYSTEM
│   │   ├── css/
│   │   │   ├── unified-event-panel.css                 # CRITICAL: Event panel styles (MUST LOAD FIRST)
│   │   │   ├── category-filter-overlay.css             # Category dropdown/filter system
│   │   │   ├── thursday-schedule-bundle.css            # Thursday-specific layout styles
│   │   │   └── friday-saturday-schedule-bundle.css     # Fri/Sat unified layout styles
│   │   ├── js/
│   │   │   ├── unified-event-loader.js                 # CRITICAL: Event panel generator
│   │   │   ├── widget-core.js                          # Thursday widget controller
│   │   │   ├── friday-saturday-widget-core.js          # Fri/Sat unified controller
│   │   │   ├── schedule-generator.js                   # Thursday DOM generator
│   │   │   ├── morning-schedule-generator.js           # Morning events DOM generator
│   │   │   ├── afternoon-schedule-generator.js         # Afternoon events DOM generator
│   │   │   ├── schedule-data.js                        # Thursday configuration
│   │   │   ├── morning-schedule-data.js                # Morning events configuration
│   │   │   ├── afternoon-schedule-data.js              # Afternoon events configuration
│   │   │   ├── workshop-events.js                      # Thursday event details & speakers
│   │   │   ├── morning-events.js                       # Morning event details & speakers
│   │   │   ├── afternoon-events.js                     # Afternoon event details & speakers
│   │   │   └── *-original.js                           # Backup: Original event files
│   │   ├── templates/
│   │   │   └── unified-event-panel.html                # Event panel HTML template
│   │   ├── docs/
│   │   │   ├── audits/                                 # Performance & code quality audits
│   │   │   ├── documentation/                          # Technical specifications
│   │   │   ├── filter-changelogs/                     # Category system evolution
│   │   │   ├── tasks/                                  # Active development tasks
│   │   │   ├── tasks-drafts/                          # Draft specifications
│   │   │   └── tasks-obsolete/                        # Completed tasks
│   │   ├── changelogs/
│   │   │   ├── 2025-08-13_consolidation_start.md      # Fri/Sat consolidation project
│   │   │   ├── 2025-08-13_deployment_summary.md       # Complete deployment docs
│   │   │   ├── 2025-08-13_validation_test_results.md  # Comprehensive testing results
│   │   │   └── 2025-08-13_*.md                        # Additional 2025 changelogs
│   │   ├── .widget-tests/
│   │   │   └── widget-demo.html                        # Comprehensive testing demo
│   │   ├── .deprecated/
│   │   │   ├── nzgdc-morning-schedule-widget-modular.js    # Legacy: Separate morning widget
│   │   │   ├── nzgdc-afternoon-schedule-widget-modular.js  # Legacy: Separate afternoon widget
│   │   │   ├── morning-schedule-bundle.css                 # Legacy: Morning-only CSS
│   │   │   ├── afternoon-schedule-bundle.css               # Legacy: Afternoon-only CSS
│   │   │   └── *-widget-core.js                           # Legacy: Separate controllers
│   │   ├── nzgdc-schedule-widget-modular.js            # ENTRY POINT: Thursday workshops
│   │   ├── nzgdc-friday-saturday-schedule-widget-modular.js # ENTRY POINT: Fri/Sat unified
│   │   └── README.md                                   # Comprehensive widget documentation
│   └── development/                                    # Development & testing environment
│       ├── thursdaySchedule.html                      # Thursday schedule testing
│       ├── fri_sat-morningSchedule.html               # Morning events testing
│       ├── fri_sat-afternoon-schedule.html            # Afternoon events testing
│       ├── eventPanel_*.html                          # Event panel testing
│       ├── eventCategories.js                         # Category management testing
│       └── instructions-to-do/                        # Development notes
├── .gitignore                                         # Git ignore rules (.idea, .DS_store)
└── README.md                                          # This file
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
    <!-- Thursday widget container (auto-initializes) -->
    <div data-nzgdc-schedule></div>
    
    <!-- Load Thursday widget -->
    <script src="nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
</body>
</html>
```

### Friday/Saturday Unified Schedule Widget
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NZGDC Friday/Saturday Events</title>
</head>
<body>
    <!-- Friday/Saturday widget container (auto-initializes to morning view) -->
    <div data-nzgdc-friday-saturday-schedule></div>
    
    <!-- Load unified Friday/Saturday widget -->
    <script src="nzgdc-widget/nzgdc-friday-saturday-schedule-widget-modular.js"></script>
</body>
</html>
```

### Complete Integration (All Views)
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete NZGDC Schedule</title>
</head>
<body>
    <!-- Toggle buttons -->
    <div class="nzgdc-schedule-toggles">
        <button onclick="showThursday()">Thursday Workshops</button>
        <button onclick="showMorning()">Morning Events</button>
        <button onclick="showAfternoon()">Afternoon Events</button>
    </div>

    <!-- Widget containers -->
    <div id="thursday-container" data-nzgdc-schedule></div>
    <div id="friday-saturday-container" data-nzgdc-friday-saturday-schedule style="display: none;"></div>
    
    <!-- Load both widgets -->
    <script src="nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
    <script src="nzgdc-widget/nzgdc-friday-saturday-schedule-widget-modular.js"></script>

    <script>
        function showThursday() {
            document.getElementById('thursday-container').style.display = 'block';
            document.getElementById('friday-saturday-container').style.display = 'none';
        }
        
        function showMorning() {
            document.getElementById('thursday-container').style.display = 'none';
            document.getElementById('friday-saturday-container').style.display = 'block';
            window.createFridaySaturdayWidget('friday-saturday-container', { defaultView: 'morning' });
        }
        
        function showAfternoon() {
            document.getElementById('thursday-container').style.display = 'none';
            document.getElementById('friday-saturday-container').style.display = 'block';
            window.createFridaySaturdayWidget('friday-saturday-container', { defaultView: 'afternoon' });
        }
    </script>
</body>
</html>
```

## 🔧 Core Architecture & Features

### Unified Event Panel System
**The foundation of all widgets**: Consistent 620x300px event panels with:
- Unified template system (`templates/unified-event-panel.html`)
- Centralized styling (`css/unified-event-panel.css`)
- Context-aware content generation
- Speaker information and thumbnails
- Category color coding and brightness management

### Critical Category System
**12 Predefined Event Categories** with visual indicators:
```
STORY_NARRATIVE     | Story & Narrative      | Light theme
PRODUCTION_QA       | Production & QA        | Dark theme
CULTURE             | Culture                | Light theme
BUSINESS_MARKETING  | Business & Marketing   | Light theme
ART                 | Art                    | Light theme
AUDIO               | Audio                  | Dark theme
PROGRAMMING         | Programming            | Light theme
GAME_DESIGN         | Game Design            | Light theme
INDIE_DEVELOPMENT   | Indie Development      | Dark theme
VR_AR               | VR/AR                  | Dark theme
PUBLISHING          | Publishing             | Light theme
COMMUNITY           | Community              | Light theme
```

### Advanced Widget Architecture

#### Thursday Workshop Widget
- **Entry Point**: `nzgdc-schedule-widget-modular.js`
- **Controller**: `NZGDCScheduleWidget` (js/widget-core.js)
- **Generator**: `ScheduleGenerator` (js/schedule-generator.js)
- **Features**: Workshop time slots, category dropdown filtering, responsive grid layout

#### Friday/Saturday Unified Widget  
- **Entry Point**: `nzgdc-friday-saturday-schedule-widget-modular.js`
- **Controller**: `FridaySaturdayWidgetCore` (js/friday-saturday-widget-core.js)
- **Generators**: Morning & Afternoon generators with dual-view management
- **Features**: Seamless view switching, existing button auto-wiring, preserved themes

### Critical File Loading Order
**⚠️ VIOLATION WILL BREAK WIDGETS**
1. **`css/unified-event-panel.css`** (MUST BE FIRST)
2. **`css/category-filter-overlay.css`** (MUST BE SECOND)
3. **Widget-specific CSS bundle** (MUST BE THIRD)
4. **JavaScript modules** (unified-event-loader.js, then others)
5. **Template file** (unified-event-panel.html)

## 🎯 Production Architecture Benefits

### Major Consolidation (August 2025)
- **50% File Reduction**: Consolidated separate morning/afternoon widgets into unified Friday/Saturday widget
- **Enhanced UX**: Seamless view switching using existing "Morning Events" and "Afternoon Events" buttons
- **Zero Visual Changes**: Perfect preservation of existing design and functionality
- **Improved Maintainability**: Single codebase for Friday/Saturday functionality
- **Backward Compatibility**: Legacy widgets preserved in `.deprecated/` folder

### Performance Optimizations
- **Shared Resources**: 60% code reuse through unified event panel system
- **Asynchronous Loading**: All files loaded with timeout handling and fallbacks
- **Memory Management**: Comprehensive cleanup and destroy functionality
- **Browser Caching**: Optimized file sizes and caching headers

## 🐛 Debugging & Production Support

### Debug Mode Activation
```javascript
// Enable debug mode
window.NZGDC_DEBUG = true;
// Or via URL: https://yoursite.com/page?debug=true

// System status check
console.log('Thursday Widget:', !!window.NZGDCScheduleWidget);
console.log('Fri/Sat Widget:', !!window.createFridaySaturdayWidget);
console.log('Unified Event Loader:', !!window.UnifiedEventLoader);
```

### Testing Environment
- **Demo Page**: `.widget-tests/widget-demo.html` - Comprehensive testing environment
- **Individual Testing**: `development/*.html` - Component isolation testing
- **Production Validation**: Complete cross-browser and mobile testing suite

## 📦 Production Deployment

### Critical Pre-Deployment Checklist
- [ ] CSS files uploaded in correct order (unified-event-panel.css FIRST)
- [ ] All JavaScript modules accessible without CORS issues
- [ ] Template file accessible from widget entry points
- [ ] Container elements have correct data attributes
- [ ] Debug mode disabled in production
- [ ] CDN caching configured (if applicable)

### Integration Examples

#### WordPress
```php
function nzgdc_widget_scripts() {
    wp_enqueue_script('nzgdc-thursday', 
        get_template_directory_uri() . '/js/nzgdc-schedule-widget-modular.js', [], '1.3', true);
    wp_enqueue_script('nzgdc-friday-saturday', 
        get_template_directory_uri() . '/js/nzgdc-friday-saturday-schedule-widget-modular.js', [], '1.3', true);
}
add_action('wp_enqueue_scripts', 'nzgdc_widget_scripts');
```

#### React/Vue/Angular
```javascript
useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/nzgdc-schedule-widget-modular.js';
    script.onload = () => window.NZGDCScheduleWidget?.create(containerRef.current.id);
    document.head.appendChild(script);
    
    return () => {
        window.NZGDCScheduleWidget?.destroyAll();
        document.head.removeChild(script);
    };
}, []);
```

## 🚨 Emergency Procedures

### Quick Rollback (if needed)
If the unified Friday/Saturday widget experiences issues:
```html
<!-- Emergency: Use deprecated separate widgets -->
<script src="nzgdc-widget/.deprecated/nzgdc-morning-schedule-widget-modular.js"></script>
<script src="nzgdc-widget/.deprecated/nzgdc-afternoon-schedule-widget-modular.js"></script>
```

### Production Support
- **Enable Emergency Debug**: `window.NZGDC_DEBUG = true; location.reload();`
- **System Status API**: Available debug methods for comprehensive system analysis
- **Comprehensive Changelogs**: Complete change history in `changelogs/2025-08-13_*.md`

## 📞 Documentation & Support

### Complete Documentation
- **Comprehensive Guide**: `html/nzgdc-widget/README.md` - 950+ lines of detailed documentation
- **Technical Specifications**: `docs/documentation/` - Architecture and implementation details
- **Change History**: `changelogs/` - Complete development and deployment history
- **Performance Analysis**: `docs/audits/` - Performance and quality assessments

### Getting Help
1. **Check Comprehensive README**: `html/nzgdc-widget/README.md` for complete documentation
2. **Enable Debug Mode**: Add `?debug=true` and check browser console
3. **Review Recent Changes**: Check `changelogs/2025-08-13_deployment_summary.md`
4. **Test in Demo Environment**: Use `.widget-tests/widget-demo.html`

## 🔄 Version History

### Current: v1.3 (August 2025) - Production Deployed ✅
**Major Achievement**: Friday/Saturday Schedule Consolidation
- Unified Friday/Saturday widget replacing separate morning/afternoon widgets
- 50% reduction in duplicate files while preserving 100% functionality
- Enhanced button integration with existing "Morning Events"/"Afternoon Events" buttons
- Perfect backward compatibility with emergency rollback procedures

### Previous Versions
- **v1.2**: Unified Event Panel Architecture implementation
- **v1.1**: Performance optimizations and production readiness  
- **v1.0**: Initial modular architecture with separate widget types

---

**Architecture**: Unified Event Panel System with Modular Widget Architecture  
**Production Status**: Deployed and Validated ✅  
**Maintainer**: Fox Studios NZ  
**Version**: 1.3.0 (August 2025)  
**License**: Apache 2.0