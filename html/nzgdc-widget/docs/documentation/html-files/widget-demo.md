# Widget Demo Documentation

## Overview

The `widget-demo.html` file serves as the primary demonstration and testing environment for all three NZGDC schedule widgets: Thursday Schedule Widget, Friday/Saturday Morning Schedule Widget, and Friday/Saturday Afternoon Schedule Widget. This comprehensive demo provides a unified interface for testing, comparing, and validating the complete widget ecosystem.

## File Location

```
JS Embed/html/nzgdc-widget/.widget-tests/widget-demo.html
```

## Purpose

This demo file provides comprehensive functionality for:

1. **Widget Toggle System**: Seamless switching between all three schedule widgets
2. **Integration Testing**: Validating widget APIs and initialization processes
3. **Performance Monitoring**: Tracking widget load times and resource usage
4. **Data Validation**: Ensuring proper data loading and event population
5. **Unified System Testing**: Validating the UnifiedEventLoader and template system
6. **Cross-Widget Comparison**: Testing consistency across all widget implementations
7. **Development Workflow**: Providing a central testing hub for widget development

## HTML Structure

### Document Head Configuration

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NZGDC Schedule Widgets Demo</title>
    <!-- CSS Loading Order - Critical for Proper Rendering -->
    <link rel="stylesheet" href="../css/unified-event-panel.css">
    <link rel="stylesheet" href="../css/thursday-schedule-bundle.css">
    <link rel="stylesheet" href="../css/morning-schedule-bundle.css">
    <link rel="stylesheet" href="../css/afternoon-schedule-bundle.css">
</head>
```

### CSS Variable System

The demo uses NZGDC brand colors for consistent theming:

```css
:root {
    --color-yellow: rgba(255, 236, 81, 1);
    --color-blue: rgba(23, 75, 235, 1);
    --color-blue-hover: rgba(20, 65, 200, 1);
    --color-white: rgba(255, 255, 255, 1);
    --color-black: rgba(0, 0, 0, 1);
    --color-yellow-bright: rgba(240, 223, 86, 1);
    --font-primary: 'Futura PT Heavy', 'Futura', Arial, sans-serif;
}
```

### Header and Controls

#### Demo Header
```html
<header class="demo-header">
    <h1>NZGDC Schedule Widgets Demo</h1>
    <div class="demo-controls">
        <button id="toggleBtn" onclick="toggleWidget()">Show Thursday Schedule</button>
        <button id="testBtn" onclick="testWidget()">Test Widgets</button>
        <button id="testUnifiedBtn" onclick="testUnifiedSystem()">Test Unified System</button>
        <button id="clearBtn" onclick="clearWidget()">Clear All</button>
        <button id="destroyBtn" onclick="destroyWidget()">Destroy All</button>
        <button id="verifyBtn" onclick="verifyData()">Verify Data</button>
        <button id="debugBtn" onclick="toggleDebug()">Enable Debug</button>
    </div>
</header>
```

#### Status Display
```html
<div class="status" id="status">Ready to load NZGDC Schedule Widgets...</div>
```

### Widget Display Sections

#### Background Message (No Widgets Loaded)
```html
<div class="no-widgets-message" id="no-widgets-message">
    <h3>🎮 NZGDC Schedule Widgets</h3>
    <p>This demo allows you to toggle between three schedule designs, one at a time:</p>
    <ul>
        <li><strong>Thursday Schedule:</strong> Workshop schedule with 10 events across morning and afternoon time slots</li>
        <li><strong>Friday/Saturday Morning Schedule:</strong> Event schedule with 17 panels across multiple morning time slots and break periods</li>
        <li><strong>Friday/Saturday Afternoon Schedule:</strong> Afternoon event schedule with blue background theme and similar layout to morning events</li>
    </ul>
</div>
```

#### Widget Container Sections
```html
<!-- Thursday Schedule Widget -->
<div class="widget-section thursday-section" id="thursday-container">
    <h2>Thursday Workshop Schedule</h2>
    <!-- Widget content will be inserted here -->
</div>

<!-- Morning Schedule Widget -->
<div class="widget-section morning-section" id="morning-container">
    <h2>Friday & Saturday Morning Schedule</h2>
    <!-- Widget content will be inserted here -->
</div>

<!-- Afternoon Schedule Widget -->
<div class="widget-section afternoon-section" id="afternoon-container">
    <h2>Friday & Saturday Afternoon Schedule</h2>
    <!-- Widget content will be inserted here -->
</div>
```

### Footer Status and Controls

```html
<footer class="demo-footer">
    <span>Widgets Status: <span id="widget-status">Not loaded</span></span>
    <button onclick="showInfo()">Show Info</button>
    <button onclick="showConsole()">Console</button>
    <button onclick="location.reload()">Refresh</button>
</footer>
```

## JavaScript Framework

### Global State Management

```javascript
let widgetLoaded = false;           // Thursday widget status
let morningWidgetLoaded = false;    // Morning widget status
let afternoonWidgetLoaded = false;  // Afternoon widget status
let currentWidget = null;          // Thursday widget instance
let currentMorningWidget = null;    // Morning widget instance
let currentAfternoonWidget = null;  // Afternoon widget instance
let debugEnabled = false;          // Debug mode status
let currentWidgetType = "thursday"; // Current widget type tracking
```

### Widget Toggle System

The demo implements a three-way toggle system: Thursday → Morning → Afternoon → Thursday

#### Toggle Logic
```javascript
async function toggleWidget() {
    // Three-way cycle: Thursday → Morning → Afternoon → Thursday
    // If none loaded, show Thursday first
    if (!widgetLoaded && !morningWidgetLoaded && !afternoonWidgetLoaded) {
        await showThursdayWidget();
        return;
    }
    // If Thursday is loaded, switch to Morning
    if (widgetLoaded) {
        await showMorningWidget();
        return;
    }
    // If Morning is loaded, switch to Afternoon
    if (morningWidgetLoaded) {
        await showAfternoonWidget();
        return;
    }
    // If Afternoon is loaded, switch to Thursday
    if (afternoonWidgetLoaded) {
        await showThursdayWidget();
        return;
    }
}
```

#### Dynamic Button Labels
```javascript
function updateButtonStates() {
    const toggleBtn = document.getElementById('toggleBtn');
    
    if (widgetLoaded) {
        toggleBtn.textContent = "Show Friday/Saturday Morning Schedule";
    } else if (morningWidgetLoaded) {
        toggleBtn.textContent = "Show Friday/Saturday Afternoon Schedule";
    } else if (afternoonWidgetLoaded) {
        toggleBtn.textContent = "Show Thursday Schedule";
    } else {
        // Default to Thursday first
        toggleBtn.textContent = "Show Thursday Schedule";
    }
}
```

## Widget Creation Functions

### Thursday Widget Creation
```javascript
async function showThursdayWidget() {
    // Destroy other widgets if loaded
    if (currentMorningWidget && typeof currentMorningWidget.destroy === 'function') {
        try {
            currentMorningWidget.destroy();
        } catch (e) {}
        currentMorningWidget = null;
        morningWidgetLoaded = false;
    }
    
    // Show Thursday widget
    if (typeof window.NZGDCWidget !== 'undefined') {
        updateStatus('Creating Thursday widget...', 'info');
        window.NZGDCWidget.ready(async () => {
            currentWidget = await createWidget();
            if (currentWidget) {
                widgetLoaded = true;
                currentWidgetType = "thursday";
                updateStatus('Thursday widget loaded successfully!', 'success');
                updateButtonStates();
            }
        });
    }
}
```

### Morning Widget Creation
```javascript
async function showMorningWidget() {
    // Destroy other widgets and hide containers
    // ... cleanup logic ...
    
    // Show morning widget using morning API
    if (typeof window.NZGDCMorningWidget !== 'undefined') {
        updateStatus('Creating morning widget...', 'info');
        window.NZGDCMorningWidget.ready(async () => {
            currentMorningWidget = await createMorningWidget();
            if (currentMorningWidget) {
                morningWidgetLoaded = true;
                currentWidgetType = "morning";
                updateStatus('Morning widget loaded successfully!', 'success');
            }
        });
    }
}
```

### Afternoon Widget Creation
```javascript
async function showAfternoonWidget() {
    // Destroy other widgets and hide containers
    // ... cleanup logic ...
    
    // Show afternoon widget using afternoon API
    if (typeof window.NZGDCAfternoonWidget !== 'undefined') {
        updateStatus('Creating afternoon widget...', 'info');
        window.NZGDCAfternoonWidget.ready(async () => {
            currentAfternoonWidget = await createAfternoonWidget();
            if (currentAfternoonWidget) {
                afternoonWidgetLoaded = true;
                currentWidgetType = "afternoon";
                updateStatus('Afternoon widget loaded successfully!', 'success');
            }
        });
    }
}
```

## Core Widget Creation Functions

### Create Thursday Widget
```javascript
async function createWidget() {
    if (window.NZGDCWidget && window.NZGDCWidget.isReady()) {
        const container = document.getElementById('thursday-container');
        
        try {
            // Clear any existing content except the header
            const header = container.querySelector('h2');
            container.innerHTML = '';
            if (header) {
                container.appendChild(header);
            } else {
                container.innerHTML = '<h2>Thursday Workshop Schedule</h2>';
            }
            
            // Create new widget instance using the modular API
            const widget = await NZGDCWidget.create(container, {
                showFilters: true,
                showFooter: true
            });
            container.style.display = 'block';
            return widget;
        } catch (error) {
            console.error('Thursday widget creation failed:', error);
            return null;
        }
    }
    return null;
}
```

### Create Morning Widget
```javascript
async function createMorningWidget() {
    if (window.NZGDCMorningWidget && window.NZGDCMorningWidget.isReady()) {
        const container = document.getElementById('morning-container');
        
        try {
            // Clear and setup container
            const header = container.querySelector('h2');
            container.innerHTML = '';
            if (header) {
                container.appendChild(header);
            } else {
                container.innerHTML = '<h2>Friday & Saturday Morning Schedule</h2>';
            }
            
            // Create new widget instance using the morning API
            const widget = await NZGDCMorningWidget.create(container, {
                showFilters: true,
                showFooter: true,
                showTimeNavigation: true
            });
            container.style.display = 'block';
            return widget;
        } catch (error) {
            console.error('Morning widget creation failed:', error);
            return null;
        }
    }
    return null;
}
```

### Create Afternoon Widget
```javascript
async function createAfternoonWidget() {
    if (window.NZGDCAfternoonWidget && window.NZGDCAfternoonWidget.isReady()) {
        const container = document.getElementById('afternoon-container');
        
        try {
            // Clear and setup container
            const header = container.querySelector('h2');
            container.innerHTML = '';
            if (header) {
                container.appendChild(header);
            } else {
                container.innerHTML = '<h2>Friday & Saturday Afternoon Schedule</h2>';
            }
            
            // Create new widget instance using the afternoon API
            const widget = await NZGDCAfternoonWidget.create(container, {
                showFilters: true,
                showFooter: true,
                showTimeNavigation: true
            });
            container.style.display = 'block';
            return widget;
        } catch (error) {
            console.error('Afternoon widget creation failed:', error);
            return null;
        }
    }
    return null;
}
```

## Testing and Validation Functions

### Test Widget Function
```javascript
function testWidget() {
    if (!widgetLoaded && !morningWidgetLoaded && !afternoonWidgetLoaded) {
        updateStatus('Load at least one widget first', 'error');
        return;
    }

    const thursdayWidgets = document.querySelectorAll('.nzgdc-schedule-widget');
    const morningWidgets = document.querySelectorAll('.nzgdc-morning-schedule-widget');
    const afternoonWidgets = document.querySelectorAll('.nzgdc-afternoon-schedule-widget');
    const workshops = document.querySelectorAll('.nzgdc-event-panel-big');
    const morningPanels = document.querySelectorAll('.nzgdc-morning-event-panel-big, .nzgdc-event-panel-main');
    const afternoonPanels = document.querySelectorAll('.nzgdc-afternoon-event-panel-big, .nzgdc-afternoon-event-panel-main');

    console.log('Widget test results:', {
        'Thursday widget instances': thursdayWidgets.length,
        'Morning widget instances': morningWidgets.length,
        'Afternoon widget instances': afternoonWidgets.length,
        'Thursday workshop panels': workshops.length,
        'Morning event panels': morningPanels.length,
        'Afternoon event panels': afternoonPanels.length,
        'Thursday API available': typeof window.NZGDCWidget !== 'undefined',
        'Morning API available': typeof window.NZGDCMorningWidget !== 'undefined',
        'Afternoon API available': typeof window.NZGDCAfternoonWidget !== 'undefined'
    });

    const totalWidgets = thursdayWidgets.length + morningWidgets.length + afternoonWidgets.length;
    const totalPanels = workshops.length + morningPanels.length + afternoonPanels.length;
    updateStatus(`Test complete: ${totalWidgets} widgets, ${totalPanels} events`, 'success');
}
```

### Test Unified System
```javascript
function testUnifiedSystem() {
    console.log('🧪 Testing NZGDC Unified Widget System...\n');

    // Test UnifiedEventLoader availability
    console.log('1. UnifiedEventLoader availability:', typeof window.UnifiedEventLoader);

    if (window.UnifiedEventLoader) {
        try {
            const loader = new UnifiedEventLoader();
            console.log('2. UnifiedEventLoader instantiation: ✅ Success');

            // Test template loading
            loader.loadTemplate().then(() => {
                console.log('3. Template loading: ✅ Success');
                
                // Test event panel creation with sample data
                const sampleEventData = {
                    category: 'Test Category',
                    title: 'Test Event Title',
                    timeframe: '30 minutes',
                    speakers: [
                        { name: 'Test Speaker', position: 'Test Position at Test Company' }
                    ]
                };

                try {
                    // Test big panel creation for each widget type
                    const thursdayPanel = loader.createEventPanel(sampleEventData, 'big', 'thursday');
                    const morningPanel = loader.createEventPanel(sampleEventData, 'big', 'morning');
                    const afternoonPanel = loader.createEventPanel(sampleEventData, 'big', 'afternoon');
                    const mainPanel = loader.createEventPanel(sampleEventData, 'main', 'morning');

                    console.log('4. Event panel creation:');
                    console.log('   Thursday big panel: ✅ Success');
                    console.log('   Morning big panel: ✅ Success');
                    console.log('   Afternoon big panel: ✅ Success');
                    console.log('   Main panel: ✅ Success');

                } catch (panelError) {
                    console.error('4. Event panel creation: ❌ Failed', panelError);
                }

            }).catch(templateError => {
                console.error('3. Template loading: ❌ Failed', templateError);
            });

        } catch (loaderError) {
            console.error('2. UnifiedEventLoader instantiation: ❌ Failed', loaderError);
        }
    }

    // Test widget APIs, data availability, and template availability
    console.log('\n5. Widget API availability:', {
        'NZGDCWidget (Thursday)': typeof window.NZGDCWidget,
        'NZGDCMorningWidget': typeof window.NZGDCMorningWidget,
        'NZGDCAfternoonWidget': typeof window.NZGDCAfternoonWidget
    });

    console.log('\n🧪 Unified system test complete - check results above');
}
```

### Data Verification Function
```javascript
function verifyData() {
    console.log('%c=== NZGDC WIDGET DATA VERIFICATION ===', 'color: blue; font-weight: bold; font-size: 14px;');

    // System status check
    const systemStatus = {
        thursdayScheduleData: typeof window.SCHEDULE_DATA !== 'undefined',
        thursdayWorkshopEvents: typeof window.WORKSHOP_EVENTS !== 'undefined',
        morningScheduleData: typeof window.MORNING_SCHEDULE_DATA !== 'undefined',
        morningEvents: typeof window.MORNING_EVENTS !== 'undefined',
        afternoonScheduleData: typeof window.AFTERNOON_SCHEDULE_DATA !== 'undefined',
        afternoonEvents: typeof window.AFTERNOON_EVENTS !== 'undefined',
        thursdayWidgetAPI: typeof window.NZGDCWidget !== 'undefined',
        morningWidgetAPI: typeof window.NZGDCMorningWidget !== 'undefined',
        afternoonWidgetAPI: typeof window.NZGDCAfternoonWidget !== 'undefined'
    };

    console.log('System Status:', systemStatus);

    // Detailed data integrity checks for each widget type
    // Thursday data verification
    if (window.SCHEDULE_DATA && window.WORKSHOP_EVENTS) {
        let totalWorkshops = 0;
        let workshopsWithData = 0;
        let missingWorkshops = [];

        console.log('\n=== THURSDAY WIDGET DATA VERIFICATION ===');
        window.SCHEDULE_DATA.timeSlots.forEach(timeSlot => {
            console.log(`\n--- ${timeSlot.title} (${timeSlot.workshops.length} workshops) ---`);
            timeSlot.workshops.forEach(workshop => {
                totalWorkshops++;
                const hasData = window.WORKSHOP_EVENTS[workshop.id];

                if (hasData) {
                    workshopsWithData++;
                    console.log(`✅ ${workshop.id}: ${hasData.title}`);
                } else {
                    missingWorkshops.push(workshop.id);
                    console.log(`❌ ${workshop.id}: NO DATA FOUND`);
                }
            });
        });

        console.log(`\n📊 Thursday Summary: ${workshopsWithData}/${totalWorkshops} workshops have data`);
    }

    // Similar verification for Morning and Afternoon widgets...

    updateStatus(`Data verification complete - check console for details`, 'success');
}
```

## Widget Management Functions

### Clear Widget Function
```javascript
function clearWidget() {
    const thursdayContainer = document.getElementById('thursday-container');
    const morningContainer = document.getElementById('morning-container');
    const afternoonContainer = document.getElementById('afternoon-container');

    // Destroy all widget instances
    if (currentWidget && typeof currentWidget.destroy === 'function') {
        try { currentWidget.destroy(); } catch (e) {}
        currentWidget = null;
    }
    if (currentMorningWidget && typeof currentMorningWidget.destroy === 'function') {
        try { currentMorningWidget.destroy(); } catch (e) {}
        currentMorningWidget = null;
    }
    if (currentAfternoonWidget && typeof currentAfternoonWidget.destroy === 'function') {
        try { currentAfternoonWidget.destroy(); } catch (e) {}
        currentAfternoonWidget = null;
    }

    // Clear containers
    thursdayContainer.style.display = 'none';
    thursdayContainer.innerHTML = '<h2>Thursday Workshop Schedule</h2>';

    morningContainer.style.display = 'none';
    morningContainer.innerHTML = '<h2>Friday & Saturday Morning Schedule</h2>';

    afternoonContainer.style.display = 'none';
    afternoonContainer.innerHTML = '<h2>Friday & Saturday Afternoon Schedule</h2>';

    // Reset state
    widgetLoaded = false;
    morningWidgetLoaded = false;
    afternoonWidgetLoaded = false;
    currentWidgetType = "thursday";
    
    updateStatus('All widgets cleared - click toggle button to show a schedule', 'info');
    updateBackgroundMessage();
    updateButtonStates();
}
```

### Destroy Widget Function
```javascript
function destroyWidget() {
    let destroyedCount = 0;
    let errors = [];

    // Destroy each widget with error handling
    if (currentWidget && typeof currentWidget.destroy === 'function') {
        try {
            currentWidget.destroy();
            destroyedCount++;
            widgetLoaded = false;
            currentWidget = null;
        } catch (error) {
            errors.push('Thursday: ' + error.message);
        }
    }

    // Similar destruction for morning and afternoon widgets...

    if (destroyedCount > 0) {
        updateStatus(`${destroyedCount} widget(s) destroyed and resources cleaned up`, 'info');
    } else {
        updateStatus('No widgets to destroy or destroy method not available', 'error');
    }
}
```

## Debug and Information Functions

### Show Info Function
```javascript
function showInfo() {
    let hasInfo = false;

    // Thursday widget debug info
    if (window.NZGDCWidget) {
        const debugInfo = window.NZGDCWidget.getDebugInfo();
        console.log('=== THURSDAY WIDGET DEBUG INFO ===');
        console.table({
            'Thursday ready': debugInfo.ready,
            'Thursday schedule data': debugInfo.modules.scheduleData,
            'Thursday workshop events': debugInfo.modules.workshopEvents,
            'Thursday generator': debugInfo.modules.scheduleGenerator,
            'Thursday widget core': debugInfo.modules.widgetCore
        });
        hasInfo = true;
    }

    // Similar debug info for Morning and Afternoon widgets...

    if (hasInfo) {
        alert('Widget info logged to console (F12)');
    } else {
        alert('No widgets loaded');
    }
}
```

### Toggle Debug Function
```javascript
function toggleDebug() {
    debugEnabled = !debugEnabled;
    window.NZGDC_DEBUG = debugEnabled;

    updateButtonStates();

    if (debugEnabled) {
        updateStatus('Debug mode enabled - check console for detailed logs', 'info');
        console.log('%c[NZGDC Debug] Debug mode enabled', 'color: green; font-weight: bold;');
    } else {
        updateStatus('Debug mode disabled', 'info');
        console.log('%c[NZGDC Debug] Debug mode disabled', 'color: orange; font-weight: bold;');
    }
}
```

## CSS Styling Features

### Widget Section Themes
```css
.thursday-section h2 {
    background: #174BEB;
    color: white;
}

.morning-section h2 {
    background: #F0DF56;
    color: black;
}

.afternoon-section h2 {
    background: #174BEB;
    color: white;
}
```

### Status Indicators
```css
.status.success {
    background: var(--color-yellow);
    color: var(--color-black);
}

.status.error {
    background: #F53E3E;
    color: var(--color-white);
}
```

### Responsive Design
```css
@media (max-width: 768px) {
    .demo-controls {
        flex-direction: column;
        align-items: center;
    }

    .demo-controls button {
        width: 90%;
        max-width: 300px;
        margin: 5px 0;
    }

    .no-widgets-message {
        margin: 20px;
        padding: 20px;
    }
}
```

## Script Loading Order

The demo loads all three widget scripts simultaneously:

```html
<!-- Load all three widget scripts -->
<script src="../nzgdc-schedule-widget-modular.js"></script>
<script src="../nzgdc-morning-schedule-widget-modular.js"></script>
<script src="../nzgdc-afternoon-schedule-widget-modular.js"></script>
```

This allows for dynamic switching between widgets without page reloads.

## Key Features

### Single Widget Display
- Only one widget is visible at a time
- Seamless switching between widget types
- Memory-efficient resource management

### Comprehensive Testing
- Widget initialization validation
- Data integrity checking
- Performance monitoring
- Error handling verification

### Debug Integration
- Real-time debug information
- Console logging with detailed metrics
- Widget state inspection
- Module loading verification

### Background Message System
- Informative display when no widgets are loaded
- Clear instructions for widget usage
- Responsive design for mobile devices

## Integration Points

### Widget APIs
- `NZGDCWidget`: Thursday schedule implementation
- `NZGDCMorningWidget`: Morning schedule implementation  
- `NZGDCAfternoonWidget`: Afternoon schedule implementation

### Data Sources
- `WORKSHOP_EVENTS`: Thursday workshop data
- `MORNING_EVENTS`: Morning event data
- `AFTERNOON_EVENTS`: Afternoon event data
- Schedule structure data for all widget types

### CSS Dependencies
- `unified-event-panel.css`: Core component styles
- Widget-specific CSS bundles for layout and theming

## Usage in Development Workflow

This demo is essential for:

1. **Widget Comparison**: Side-by-side functionality comparison (one at a time)
2. **Integration Testing**: Validating widget APIs and initialization
3. **Performance Testing**: Monitoring load times and resource usage
4. **Data Validation**: Ensuring proper event data loading
5. **Debug Verification**: Testing debug systems across all widgets
6. **Quality Assurance**: Pre-deployment validation of all widget types

The widget demo serves as the central hub for NZGDC widget development, testing, and demonstration, providing developers and stakeholders with a comprehensive interface to explore and validate the complete widget ecosystem.