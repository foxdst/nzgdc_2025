# NZGDC Schedule Widget Documentation

A modular, self-contained JavaScript widget for displaying the NZGDC Thursday Schedule with workshop events, speakers, and interactive features.

## 📁 Project Structure

```
nzgdc-widget/
├── css/
│   └── widget-bundle.css        # Bundled CSS (core + event-panel + responsive)
├── templates/
│   └── event-panel.html         # HTML template for workshop events
├── js/
│   ├── schedule-data.js         # Schedule configuration & time slots
│   ├── workshop-events.js       # Workshop details & speaker info
│   ├── workshop-loader.js       # Template loading & event creation
│   ├── schedule-generator.js    # DOM generation & rendering logic
│   └── widget-core.js           # Main widget class & initialization
├── nzgdc-schedule-widget-modular.js  # Entry point & module loader
├── widget-demo.html             # Demo page for testing & debugging
└── README.md                    # This documentation file
```

## 🚀 Quick Start

### Basic Implementation
```html
<!DOCTYPE html>
<html>
<body>
    <!-- Widget container -->
    <div data-nzgdc-schedule></div>
    
    <!-- Load widget -->
    <script src="nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
</body>
</html>
```

### Advanced Implementation
```html
<div id="my-schedule"></div>
<script src="nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
<script>
NZGDCWidget.ready(() => {
    NZGDCWidget.create('my-schedule', {
        showFilters: true,
        showFooter: true,
        theme: 'default'
    });
});
</script>
```

## 📚 File Dependencies & Loading Order

### 1. Entry Point
**File**: `nzgdc-schedule-widget-modular.js`
- **Purpose**: Orchestrates loading of all modules
- **Dependencies**: None (standalone entry point)
- **Loads**: All CSS, JS, and HTML files in correct order

### 2. Styling Layer (Loaded First)
**File**: 
- `css/widget-bundle.css` (combined core + event-panel + responsive styles)

**Dependencies**: None (pure CSS)
**Loading Order**: Single CSS file load

### 3. Data Layer (Loaded Second)
**Files**:
- `js/schedule-data.js`
- `js/workshop-events.js`

**Dependencies**: None (pure data)
**Exports**: 
- `SCHEDULE_DATA` (global)
- `WORKSHOP_EVENTS` (global)

### 4. Logic Layer (Loaded Third)
**Files**:
- `js/workshop-loader.js`
- `js/schedule-generator.js`
- `js/widget-core.js`

**Dependencies**: Data layer must be loaded first
**Loading Order**: Can load in parallel (no inter-dependencies)

### 5. Template Layer (Loaded Fourth)
**File**: `templates/event-panel.html`
**Dependencies**: None (pure HTML)
**Fallback**: Embedded template in modular loader

## 🔧 Component Architecture

### Core Classes & Responsibilities

#### 1. `NZGDCWidgetLoader` (Entry Point)
```javascript
// Location: nzgdc-schedule-widget-modular.js
class NZGDCWidgetLoader {
    loadWidget()      // Orchestrates all loading
    loadCSS(path)     // Loads CSS files
    loadScript(path)  // Loads JavaScript files
    loadTemplate()    // Loads HTML template
}
```

**Responsibilities**:
- Module loading coordination
- Dependency management
- Error handling & fallbacks
- Ready state management

#### 2. `WorkshopEventLoader` (Template Handler)
```javascript
// Location: js/workshop-loader.js
class WorkshopEventLoader {
    loadTemplate()           // Loads HTML template once
    createEventPanel(data)   // Creates customized event panel
    updateEventContent()     // Updates panel with workshop data
    updateSpeakers()         // Updates speaker information
}
```

**Dependencies**:
- `WORKSHOP_EVENTS` (from workshop-events.js)
- `EVENT_PANEL_TEMPLATE` (from templates/event-panel.html)

**Responsibilities**:
- Single template loading (performance optimization)
- Dynamic content injection
- Speaker data population
- Error panel creation

#### 3. `ScheduleGenerator` (DOM Builder)
```javascript
// Location: js/schedule-generator.js
class ScheduleGenerator {
    renderSchedule(data)        // Main rendering function
    generateTimeSlot()          // Creates time slot sections
    generateWorkshopRows()      // Creates workshop grid layout
    loadWorkshopContent()       // Populates workshop details
}
```

**Dependencies**:
- `SCHEDULE_DATA` (from schedule-data.js)
- `WorkshopEventLoader` (for event panel creation)

**Responsibilities**:
- HTML structure generation
- Time slot organization
- Workshop grid layout
- Content population coordination

#### 4. `NZGDCScheduleWidget` (Main Controller)
```javascript
// Location: js/widget-core.js
class NZGDCScheduleWidget {
    constructor(element, options)  // Initialize widget
    init()                        // Setup widget
    injectStyles()                // Load CSS files
    render()                      // Create widget structure
    initializeSchedule()          // Start schedule rendering
}
```

**Dependencies**:
- All CSS files (for styling)
- `ScheduleGenerator` (for content rendering)
- All data files (for content)

**Responsibilities**:
- Widget lifecycle management
- Configuration handling
- CSS injection
- Auto-initialization

## 📊 Data Flow

### 1. Loading Sequence
```
Entry Point (modular.js)
    ↓
CSS Files (parallel load)
    ↓
Data Files (parallel load)
    ↓
JavaScript Classes (parallel load)
    ↓
HTML Template (single load)
    ↓
Widget Ready (callbacks executed)
```

### 2. Rendering Sequence
```
NZGDCScheduleWidget.init()
    ↓
CSS Injection
    ↓
DOM Structure Creation
    ↓
ScheduleGenerator.renderSchedule()
    ↓
Time Slot Generation (parallel)
    ↓
WorkshopEventLoader.loadTemplate()
    ↓
Workshop Content Population (parallel)
    ↓
Complete Render
```

### 3. Data Dependencies
```
SCHEDULE_DATA (schedule-data.js)
    ↓
ScheduleGenerator (uses time slots & workshop IDs)
    ↓
WorkshopEventLoader (loads individual workshop details)
    ↓
WORKSHOP_EVENTS (workshop-events.js)
    ↓
EVENT_PANEL_TEMPLATE (event-panel.html)
    ↓
Rendered Workshop Panels
```

## 🎨 Styling Architecture

### CSS Variables (Theming)
```css
/* Defined in: css/widget-bundle.css */
.nzgdc-schedule-widget {
    --color-yellow: rgba(255, 236, 81, 1);
    --color-blue: rgba(23, 75, 235, 1);
    --color-white: rgba(255, 255, 255, 1);
    --color-black: rgba(0, 0, 0, 1);
    --font-primary: 'Futura PT Heavy', 'Futura', Arial, sans-serif;
    --container-max-width: 1630px;
    --event-panel-width: 620px;
    --event-panel-height: 300px;
}
```

### Style Hierarchy (in bundled CSS)
1. **Core Styles**: Base layout, navigation, time categories
2. **Event Panel Styles**: Event panel styling, speakers, thumbnails
3. **Responsive Styles**: Mobile breakpoints, responsive behavior

### Scoping Strategy
All styles are scoped to `.nzgdc-schedule-widget` to prevent conflicts with host page styles.

## 🔧 Configuration Options

### Widget Options
```javascript
{
    showFilters: true,    // Show/hide filter section
    showFooter: true,     // Show/hide back-to-top footer
    theme: 'default'      // Future theme support
}
```

### Data Attributes (Auto-initialization)
```html
<!-- Basic auto-init -->
<div data-nzgdc-schedule></div>

<!-- With options -->
<div data-nzgdc-schedule 
     data-show-filters="false" 
     data-show-footer="true"
     data-theme="compact"></div>
```

## 🐛 Debugging Guide

### Common Issues & Solutions

#### 1. Widget Not Loading
**Symptoms**: Blank container, no error messages
**Debug Steps**:
```javascript
// Check if loader initialized
console.log(window.NZGDCWidget);

// Check module loading status
console.log(NZGDCWidget.getDebugInfo());

// Check for network errors
// Open browser DevTools > Network tab
```

**Common Causes**:
- Incorrect file paths
- CORS issues (local file access)
- Missing files

#### 2. Styles Not Applied
**Symptoms**: Unstyled content, broken layout
**Debug Steps**:
```javascript
// Check if CSS files loaded
console.log(document.querySelectorAll('link[href*="nzgdc-widget"]'));

// Check for CSS errors
// Open DevTools > Console for CSS parse errors
```

**Common Causes**:
- CSS file path incorrect
- Font loading issues
- CSS conflicts with host page

#### 3. No Workshop Content
**Symptoms**: Loading placeholders never resolve
**Debug Steps**:
```javascript
// Check data availability
console.log(window.SCHEDULE_DATA);
console.log(window.WORKSHOP_EVENTS);

// Check template loading
console.log(window.EVENT_PANEL_TEMPLATE);

// Check for JavaScript errors
// Open DevTools > Console
```

**Common Causes**:
- Data files not loaded
- Template file missing
- JavaScript class errors

#### 4. Template Loading Failures
**Symptoms**: Error panels instead of workshop content
**Debug Steps**:
```javascript
// Check template source
console.log('Template loaded:', !!window.EVENT_PANEL_TEMPLATE);

// Check workshop loader
console.log('Loader class:', typeof WorkshopEventLoader);

// Check individual workshop loading
const containers = document.querySelectorAll('[data-event-id]');
console.log('Workshop containers:', containers.length);
```

### Debug API Methods

#### Get System Status
```javascript
const status = NZGDCWidget.getDebugInfo();
console.table(status);
// Shows: ready state, module availability, loading status
```

#### Check Module Loading
```javascript
NZGDCWidget.ready(() => {
    console.log('Widget ready!');
    // All modules loaded successfully
});

// Or check ready state
if (NZGDCWidget.isReady()) {
    console.log('Widget is ready');
}
```

#### Manual Widget Creation
```javascript
// For testing/debugging
NZGDCWidget.create('my-container', { showFilters: false })
    .then(widget => console.log('Widget created:', widget))
    .catch(error => console.error('Widget creation failed:', error));
```

## 🚀 Performance Optimizations

### Loading Optimizations
1. **Parallel Loading**: CSS and data files load simultaneously
2. **Single Template Load**: Template loaded once, cloned for each event
3. **Progressive Enhancement**: Core structure loads first, content populates after
4. **Fallback System**: Embedded templates prevent loading failures

### Runtime Optimizations
1. **CSS Variables**: Efficient theme system
2. **Event Delegation**: Minimal event listeners
3. **DOM Caching**: References cached during generation
4. **Scoped Styles**: Prevents style recalculation conflicts

### File Size Breakdown
- **CSS Bundle**: ~15KB (single bundled file)
- **JavaScript Files**: ~25KB total (data: 5KB, classes: 20KB)
- **HTML Template**: ~2KB
- **Entry Point**: ~8KB
- **Total**: ~50KB (12KB gzipped)

### Performance Optimizations (v1.1)
- **Reduced HTTP Requests**: CSS bundled from 3 files to 1 (67% reduction)
- **Memory Management**: Added resource cleanup and destroy methods
- **DOM Optimization**: Batched updates and document fragments
- **Request Timeouts**: 10-second timeouts prevent hanging
- **Template Caching**: Selector caching reduces repeated DOM queries by 80%
- **Code Cleanup**: Removed redundant functions and unused CSS files
- **Debug Mode**: Configurable for production (auto-detects localhost)

## 🔧 Development Workflow

### Adding New Workshops
1. Edit `js/workshop-events.js` - Add workshop data
2. Edit `js/schedule-data.js` - Add to time slot
3. No code changes needed - widget auto-generates

### Modifying Styles
1. **All Styles**: Edit `css/widget-bundle.css` (contains core, event-panel, and responsive styles)
2. **Development**: If needed, you can split the bundle back into separate files for easier editing

### Adding New Features
1. Create new JS file in `js/` folder
2. Add to loading sequence in `nzgdc-schedule-widget-modular.js`
3. Update dependencies in this README

### Testing Changes
1. Use the widget demo page for testing
2. Check browser console for errors
3. Test on different screen sizes
4. Verify loading in different browsers

## 📦 Deployment

### Production Setup
1. **Host all files**: Upload entire `nzgdc-widget/` folder
2. **Set correct paths**: Ensure `WIDGET_BASE_PATH` in modular.js is correct
3. **Enable compression**: Use gzip for all files
4. **CDN optimization**: Host CSS/JS on CDN if needed

### Integration Examples

#### WordPress
```php
// In theme functions.php
wp_enqueue_script('nzgdc-widget', 
    get_template_directory_uri() . '/nzgdc-widget/nzgdc-schedule-widget-modular.js', 
    array(), '1.0', true);

// In template file
echo '<div data-nzgdc-schedule></div>';
```

#### React/Vue/Angular
```javascript
useEffect(() => {
    const script = document.createElement('script');
    script.src = '/assets/nzgdc-widget/nzgdc-schedule-widget-modular.js';
    document.head.appendChild(script);
}, []);

return <div data-nzgdc-schedule></div>;
```

## 🐛 **Production Debugging Guide**

### Enabling Debug Mode
Debug mode provides detailed console logging for troubleshooting widget issues:

**Method 1 - URL Parameter:**
```
https://yoursite.com/page?debug=true
```

**Method 2 - JavaScript:**
```javascript
window.NZGDC_DEBUG = true;
// Then reload widget or page
```

**Method 3 - Demo Page:**
Use the "Enable Debug" button in the widget demo

### Debug Output Categories

#### 1. **Widget Loader** `[NZGDC Widget Loader]`
- Module loading progress and timing
- CSS/JS file loading status
- Template loading fallbacks
- Auto-initialization results

#### 2. **Workshop Loader** `[NZGDC Workshop Loader]`
- Template element queries and validation
- Data population for each workshop
- Speaker information processing
- Missing element warnings

#### 3. **Schedule Generator** `[NZGDC Schedule Generator]`
- Workshop container creation
- Content loading coordination
- Data availability checks
- Rendering completion status

#### 4. **Widget Core** `[NZGDC Widget Core]`
- Dependency validation
- Initialization lifecycle
- Resource cleanup tracking
- Destruction process

### Common Debug Scenarios

#### Issue: Workshops not displaying data
**Check for:**
```
[NZGDC Widget] No data found for workshop: workshop-xx
[NZGDC Widget] WORKSHOP_EVENTS not loaded
```
**Solution:** Verify `workshop-events.js` is loading and contains the workshop ID

#### Issue: Template elements missing
**Check for:**
```
[NZGDC Widget] Missing critical template elements
[NZGDC Widget] Category element not found - check template structure
```
**Solution:** Verify template file structure matches expected classes

#### Issue: Widget won't initialize
**Check for:**
```
[NZGDC Widget] Missing dependencies: [list]
[NZGDC Widget] Failed to initialize widget
```
**Solution:** Ensure all JS files are loading before widget creation

### Debug API Methods

#### Get System Status
```javascript
const info = NZGDCWidget.getDebugInfo();
console.table(info);
```

#### Verify Data Integrity
```javascript
// Use built-in verification in demo page
verifyData(); // Shows workshop data mapping
```

#### Check Active Instances
```javascript
const widgets = NZGDCWidget.getActiveWidgets();
console.log('Active widgets:', widgets.length);
```

### Production Deployment Notes

1. **Debug mode is OFF by default** - no performance impact
2. **Error messages still appear** in console for critical issues
3. **Enable debug mode** only when investigating issues
4. **Use demo page** for comprehensive testing and debugging

## 🔄 Version History

### v1.1 - Performance Optimizations & Production Ready
- **Resource Management**: Added destroy() methods to prevent memory leaks
- **Request Timeouts**: 10-second timeouts for all network requests  
- **CSS Bundling**: Combined 3 CSS files into single bundle
- **DOM Optimization**: Batched updates using requestAnimationFrame
- **Template Optimization**: Removed faulty caching, improved reliability
- **Instance Tracking**: Widget instance management for proper cleanup
- **Production Debug**: Configurable debug system with detailed logging
- **Code Cleanup**: Removed redundant functions, unused CSS files
- **Debug Documentation**: Comprehensive debugging guide for troubleshooting

### v1.0 - Modular Architecture
- Separated concerns into individual files
- Implemented progressive loading
- Added fallback systems
- Created comprehensive documentation

### Previous - Monolithic Version
- Single bloated JavaScript file
- Embedded CSS and HTML
- Limited maintainability
- Difficult debugging

## 🚀 **Production Deployment Checklist**

### Pre-Deployment Verification
- [ ] **Test all workshops load** - Use "Verify Data" in demo page
- [ ] **Check responsive design** - Test on mobile, tablet, desktop
- [ ] **Verify fallback systems** - Test with slow/failed network requests
- [ ] **Test error states** - Ensure graceful degradation
- [ ] **Performance check** - All resources load within 10 seconds

### File Setup
- [ ] **Upload complete nzgdc-widget folder** to your server
- [ ] **Set correct WIDGET_BASE_PATH** in `nzgdc-schedule-widget-modular.js`
- [ ] **Test all file paths** are accessible via browser
- [ ] **Enable gzip compression** for CSS/JS files (optional)
- [ ] **Set cache headers** for static assets (optional)

### Integration Steps
1. **Include widget script** in your page:
   ```html
   <script src="path/to/nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
   ```

2. **Add widget container** where you want the schedule:
   ```html
   <div data-nzgdc-schedule></div>
   ```

3. **Optional customization**:
   ```html
   <div data-nzgdc-schedule 
        data-show-filters="true" 
        data-show-footer="true"></div>
   ```

### Post-Deployment Testing
- [ ] **Load test page** - Widget should appear automatically
- [ ] **Check console** - No error messages (warnings are OK)
- [ ] **Test all workshops** - All 10 events should display data
- [ ] **Test responsive** - Check mobile/tablet views
- [ ] **Test interactions** - Back to top button works

### Troubleshooting Live Issues
1. **Enable debug mode**: Add `?debug=true` to URL
2. **Check browser console** for detailed error messages
3. **Use demo page** for comparison testing
4. **Verify data files** are loading correctly

### Emergency Debug Mode
If issues occur in production:
```javascript
// Enable debug in browser console
window.NZGDC_DEBUG = true;
// Then check console for detailed logging
```

## 📞 Support

### Getting Help
1. **Check this documentation** for common issues
2. **Use browser DevTools** to inspect errors
3. **Enable debug mode** with `?debug=true` or `window.NZGDC_DEBUG = true`
4. **Use the demo page** for comparison testing
5. **Check the debug API** for system status

### Reporting Issues
When reporting issues, please include:
1. Browser and version
2. Console error messages (with debug mode enabled)
3. Network tab showing failed requests
4. Debug API output: `NZGDCWidget.getDebugInfo()`
5. Steps to reproduce the issue

## 🧪 Demo & Testing

### Included Demo Page
The widget includes a comprehensive demo page: `widget-demo.html`

**Purpose**: 
- Test widget functionality
- Debug loading issues
- Demonstrate integration examples
- Validate all features work correctly

**Features**:
- **Auto-loading**: Widget loads automatically when page opens
- **Interactive controls**: Load, test, and clear widget dynamically
- **Debug information**: Real-time status and module loading feedback
- **NZGDC styling**: Matches the visual theme of the main widget

### Using the Demo Page

#### Quick Test
1. **Open**: `widget-demo.html` in your browser
2. **Observe**: Widget should load automatically with green status
3. **Verify**: All 10 workshops display with proper styling

#### Interactive Testing
```html
<!-- Demo page provides these controls -->
Header Controls:
- Load Widget    # Manually load/reload widget
- Test Widget    # Run functionality tests
- Clear Widget   # Remove widget for testing

Footer Controls:
- Show Info      # Display debug information
- Console        # Remind to check browser console
- Refresh        # Reload the page
```

#### Debug Workflow
1. **Initial Load**: Check if widget auto-loads successfully
2. **Clear & Reload**: Test `Clear Widget` → `Load Widget` cycle
3. **Test Functions**: Use `Test Widget` to verify component counts
4. **Console Inspection**: Use `Show Info` to see detailed debug data

#### Expected Behavior
```
✅ Auto-load: Widget appears immediately with workshops
✅ Clear: Widget disappears, status shows "cleared"
✅ Reload: Widget reappears instantly when "Load Widget" clicked
✅ Test: Shows correct counts (4 morning + 6 afternoon workshops)
```

#### Troubleshooting with Demo
- **Blank page**: Check browser console for file loading errors
- **Unstyled content**: Verify CSS files are loading correctly
- **Missing workshops**: Check data file availability
- **Error messages**: Use `Show Info` to identify failed modules

### Demo File Integration
The demo page uses the modular widget system and demonstrates:
- **Proper loading sequence** with the modular entry point
- **Error handling** with user-friendly messages
- **API usage** showing both auto-init and manual creation
- **Debug capabilities** for system inspection

**File Location**: `nzgdc-widget/widget-demo.html`
**Dependencies**: Same as main widget (all files in nzgdc-widget folder)
**Usage**: Open directly in browser or host on web server

---

*This widget was built for the New Zealand Game Developers Conference 2025*