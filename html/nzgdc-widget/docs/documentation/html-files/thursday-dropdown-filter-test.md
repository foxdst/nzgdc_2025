# Thursday Dropdown Filter Test Documentation

## Overview

The `thursday-dropdown-filter-test.html` file serves as a specialized testing environment for validating the newly integrated category dropdown filter functionality specifically within the Thursday Schedule Widget. This test focuses on the dropdown filter implementation, category filtering behavior, visual feedback mechanisms, and integration validation for the Thursday workshop schedule system.

## File Location

```
JS Embed/html/nzgdc-widget/.widget-tests/thursday-dropdown-filter-test.html
```

## Purpose

This test file provides comprehensive validation for:

1. **Thursday Widget Integration**: Testing dropdown filter integration with Thursday schedule
2. **Category Dropdown Functionality**: Validating dropdown appearance and behavior
3. **Workshop Filtering**: Testing event filtering against workshop data
4. **Visual State Management**: Verifying dynamic label and color changes
5. **Keyboard Accessibility**: Testing tab navigation and keyboard controls
6. **Performance Monitoring**: Measuring response times and widget initialization
7. **Debug Integration**: Comprehensive debugging and status monitoring

## HTML Structure

### Document Head Configuration

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thursday Schedule Widget - Dropdown Filter Test</title>
</head>
```

### Styling System

The test uses a minimal, functional styling approach focused on testing clarity:

```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.test-container {
    max-width: 1200px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
```

### Main Layout Structure

#### Test Header
```html
<div class="test-header">
    <h1>Thursday Schedule Widget - Dropdown Filter Integration Test</h1>
    <p>Testing the newly integrated category dropdown filter functionality</p>
</div>
```

#### Test Objectives Panel
```html
<div class="test-info">
    <h3>🎯 Test Objectives:</h3>
    <ul>
        <li>Verify dropdown filter appears and functions correctly</li>
        <li>Test all 11 category filter options</li>
        <li>Validate dynamic label background color changes</li>
        <li>Ensure big event panel filtering works (grey out non-matching)</li>
        <li>Verify keyboard navigation and accessibility</li>
        <li>Test mobile responsiveness</li>
    </ul>
</div>
```

#### Debug Information Panel
```html
<div class="debug-panel">
    <h4>Debug Information:</h4>
    <div id="debug-output">Loading debug information...</div>
</div>
```

#### Manual Test Controls
```html
<div class="feature-test">
    <h4>Manual Test Controls</h4>
    <button class="test-button" onclick="testAllCategories()">Test All Categories</button>
    <button class="test-button" onclick="resetFilter()">Reset Filter</button>
    <button class="test-button" onclick="toggleDebugMode()">Toggle Debug Mode</button>
    <button class="test-button" onclick="showWidgetInfo()">Widget Info</button>
    <div id="test-results" style="margin-top: 10px;"></div>
</div>
```

### Widget Container

#### Thursday Schedule Widget Container
```html
<div id="thursday-schedule-widget" data-nzgdc-schedule="thursday">
    <div class="status-indicator status-loading">Loading Thursday Schedule Widget...</div>
</div>
```

### Integration Status Monitoring

```html
<div class="feature-test">
    <h4>Integration Verification</h4>
    <div id="integration-status">
        <div id="css-loaded" class="status-indicator status-loading">CSS Loading...</div>
        <div id="js-loaded" class="status-indicator status-loading">JavaScript Loading...</div>
        <div id="widget-ready" class="status-indicator status-loading">Widget Initialization...</div>
        <div id="dropdown-ready" class="status-indicator status-loading">Dropdown Controller...</div>
    </div>
</div>
```

## JavaScript Testing Framework

### Global Configuration

```javascript
let thursdayWidget = null;
let debugMode = true; // Start with debug mode enabled for testing

// Enable debug mode
window.NZGDC_DEBUG = debugMode;
```

### Widget Initialization Process

```javascript
document.addEventListener('DOMContentLoaded', function() {
    updateDebugOutput();
    initializeWidget();
});

async function initializeWidget() {
    try {
        updateStatus('css-loaded', 'loading', 'Loading CSS modules...');
        updateStatus('js-loaded', 'loading', 'Loading JavaScript modules...');
        updateStatus('widget-ready', 'loading', 'Initializing widget...');
        updateStatus('dropdown-ready', 'loading', 'Setting up dropdown...');

        // Wait for widget to be ready
        NZGDCWidget.ready(async () => {
            try {
                // Create the Thursday widget
                thursdayWidget = await NZGDCWidget.create('thursday-schedule-widget', {
                    showFilters: true,
                    showFooter: true
                });

                updateStatus('css-loaded', 'success', 'CSS Loaded Successfully');
                updateStatus('js-loaded', 'success', 'JavaScript Loaded Successfully');
                updateStatus('widget-ready', 'success', 'Widget Initialized Successfully');

                // Check if dropdown controller exists
                setTimeout(() => {
                    if (thursdayWidget && thursdayWidget.dropdownController) {
                        updateStatus('dropdown-ready', 'success', 'Dropdown Controller Ready');
                    } else {
                        updateStatus('dropdown-ready', 'error', 'Dropdown Controller Not Found');
                    }
                    updateDebugOutput();
                }, 1000);

            } catch (error) {
                console.error('Widget creation failed:', error);
                updateStatus('widget-ready', 'error', `Widget Error: ${error.message}`);
                updateStatus('dropdown-ready', 'error', 'Dropdown Failed (Widget Error)');
            }
        });

    } catch (error) {
        console.error('Widget initialization failed:', error);
        updateStatus('css-loaded', 'error', 'CSS Loading Failed');
        updateStatus('js-loaded', 'error', 'JavaScript Loading Failed');
        updateStatus('widget-ready', 'error', `Init Error: ${error.message}`);
        updateStatus('dropdown-ready', 'error', 'Dropdown Failed (Init Error)');
    }
}
```

## Core Testing Functions

### Status Management

```javascript
function updateStatus(elementId, status, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.className = `status-indicator status-${status}`;
        element.textContent = message;
    }
}
```

### Debug Information Display

```javascript
function updateDebugOutput() {
    const debugOutput = document.getElementById('debug-output');
    const debugInfo = NZGDCWidget.getDebugInfo();

    debugOutput.innerHTML = `
        <strong>Widget Loader Status:</strong><br>
        • Ready: ${debugInfo.ready}<br>
        • Active Instances: ${debugInfo.instances.active}<br>
        • Debug Mode: ${window.NZGDC_DEBUG}<br>
        <br>
        <strong>Module Status:</strong><br>
        • Schedule Data: ${debugInfo.modules.scheduleData}<br>
        • Workshop Events: ${debugInfo.modules.workshopEvents}<br>
        • Schedule Generator: ${debugInfo.modules.scheduleGenerator}<br>
        • Widget Core: ${debugInfo.modules.widgetCore}<br>
        <br>
        <strong>Widget Instance:</strong><br>
        • Widget Object: ${thursdayWidget ? 'Available' : 'Not Created'}<br>
        • Dropdown Controller: ${thursdayWidget && thursdayWidget.dropdownController ? 'Available' : 'Not Found'}<br>
        • Current Filter: ${thursdayWidget && thursdayWidget.currentFilterCategory || 'None'}<br>
        <br>
        <strong>Configuration:</strong><br>
        • Base Path: ${debugInfo.config.basePath || './'}br>
        • Timeout: ${debugInfo.config.timeout}ms<br>
    `;
}
```

### Category Testing Functions

#### Test All Categories
```javascript
async function testAllCategories() {
    if (!thursdayWidget || !thursdayWidget.dropdownController) {
        alert('Widget or dropdown controller not available');
        return;
    }

    const categories = [
        'All Events',
        'Art',
        'Audio',
        'Business & Marketing',
        'Culture',
        'Data, Testing or Research',
        'Game Design',
        'Production & QA',
        'Programming',
        'Realities (VR, AR, MR)',
        'Serious & Educational Games',
        'Story & Narrative'
    ];

    const testResults = document.getElementById('test-results');
    testResults.innerHTML = '<strong>Testing Categories...</strong><br>';

    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];

        try {
            // Simulate category selection
            const categoryKey = getCategoryKeyFromName(category);
            thursdayWidget.currentCategoryKey = categoryKey;
            thursdayWidget.updateFilterValueText(category);

            if (categoryKey === 'ALL') {
                thursdayWidget.clearFilter();
            } else {
                thursdayWidget.applyFilter(categoryKey);
            }

            testResults.innerHTML += `✅ ${category}: Filter applied successfully<br>`;

            // Wait a bit between tests
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            testResults.innerHTML += `❌ ${category}: Error - ${error.message}<br>`;
        }
    }

    testResults.innerHTML += '<br><strong>Category Testing Complete!</strong>';
}
```

#### Reset Filter Function
```javascript
function resetFilter() {
    if (thursdayWidget) {
        thursdayWidget.currentCategoryKey = 'ALL';
        thursdayWidget.updateFilterValueText('All Events');
        thursdayWidget.clearFilter();
        document.getElementById('test-results').innerHTML = '✅ Filter reset to "All Events"';
    }
}
```

#### Category Name Mapping
```javascript
function getCategoryKeyFromName(categoryName) {
    const categoryMap = {
        'All Events': 'ALL',
        'Game Design': 'GAME_DESIGN',
        'Art': 'ART',
        'Programming': 'PROGRAMMING',
        'Audio': 'AUDIO',
        'Story & Narrative': 'STORY_NARRATIVE',
        'Business & Marketing': 'BUSINESS_MARKETING',
        'Culture': 'CULTURE',
        'Production & QA': 'PRODUCTION_QA',
        'Realities (VR, AR, MR)': 'REALITIES_VR_AR_MR',
        'Data, Testing or Research': 'DATA_TESTING_RESEARCH',
        'Serious & Educational Games': 'SERIOUS_EDUCATIONAL'
    };
    return categoryMap[categoryName] || 'ALL';
}
```

## Debug and Utility Functions

### Toggle Debug Mode
```javascript
function toggleDebugMode() {
    debugMode = !debugMode;
    window.NZGDC_DEBUG = debugMode;
    updateDebugOutput();
    alert(`Debug mode ${debugMode ? 'enabled' : 'disabled'}`);
}
```

### Show Widget Information
```javascript
function showWidgetInfo() {
    if (thursdayWidget) {
        const info = `
Thursday Widget Information:
• Widget ID: ${thursdayWidget.uniqueId}
• Initialized: ${thursdayWidget.initialized}
• Current Filter: ${thursdayWidget.currentFilterCategory || 'None'}
• Current Category Key: ${thursdayWidget.currentCategoryKey}
• Dropdown Controller: ${thursdayWidget.dropdownController ? 'Available' : 'Not Found'}
• Schedule Generator: ${thursdayWidget.scheduleGenerator ? 'Available' : 'Not Found'}
        `;
        alert(info);
    } else {
        alert('Thursday widget not available');
    }
}
```

## Keyboard Shortcuts

```javascript
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDebugMode();
    } else if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        resetFilter();
    } else if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        testAllCategories();
    }
});
```

Available shortcuts:
- `Ctrl+D`: Toggle debug mode
- `Ctrl+R`: Reset filter
- `Ctrl+T`: Test all categories

## Status Indicators

### CSS Classes
```css
.status-indicator {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 3px;
    margin: 5px;
    font-size: 12px;
}

.status-loading { background: #fff3cd; color: #856404; }
.status-success { background: #d1edff; color: #0c5460; }
.status-error { background: #f8d7da; color: #721c24; }
```

### Integration Verification States
- **CSS Loading**: Validates CSS module loading
- **JavaScript Loading**: Confirms JS module availability
- **Widget Initialization**: Tracks widget creation process
- **Dropdown Controller**: Verifies dropdown functionality is ready

## Automatic Debug Updates

```javascript
// Update debug output every 5 seconds
setInterval(updateDebugOutput, 5000);
```

Provides continuous monitoring of widget state and debug information.

## Widget Script Loading

```html
<!-- Load the Thursday Schedule Widget -->
<script src="../nzgdc-schedule-widget-modular.js"></script>
```

The test loads only the Thursday widget script, focusing testing on the specific integration.

## Testing Instructions

### Manual Testing Steps

The test provides comprehensive manual testing guidelines:

#### Basic Functionality
1. Click the filter dropdown (should show "ALL EVENTS ▶") to open category list
2. Select different categories and verify the label background changes color
3. Verify that non-matching events grey out when a category is selected
4. Select "All Events" to verify all panels return to normal

#### Keyboard Testing  
1. Use Tab to navigate through dropdown options
2. Use Enter to select categories
3. Use Escape to close dropdown

#### Automated Testing
1. Use "Test All Categories" button to cycle through all options automatically
2. Monitor test results panel for success/failure indicators
3. Use debug controls to inspect widget state

### Troubleshooting Guidelines

1. **Widget Load Failure**: Check browser console for errors
2. **Missing CSS/JS**: Ensure all files are accessible
3. **Data Issues**: Verify workshop events data is loaded correctly
4. **Debug Information**: Check debug output for module loading status

## Integration Dependencies

### Required Scripts
- `nzgdc-schedule-widget-modular.js`: Thursday widget implementation

### Expected Data Sources
- `WORKSHOP_EVENTS`: Thursday workshop event data
- `SCHEDULE_DATA`: Thursday schedule structure data

### Widget API Requirements
- `NZGDCWidget.ready()`: Widget initialization readiness
- `NZGDCWidget.create()`: Widget instance creation
- `NZGDCWidget.getDebugInfo()`: Debug information access

## Validation Criteria

### Success Indicators
1. **Widget Initialization**: Thursday widget loads without errors
2. **Dropdown Availability**: Filter dropdown appears and functions
3. **Category Filtering**: All 11 categories can be selected and applied
4. **Visual Feedback**: Label background colors change to match categories
5. **Event Filtering**: Workshop panels grey out appropriately based on selection
6. **Keyboard Navigation**: Tab, Enter, and Escape keys work properly
7. **Debug Integration**: Debug information displays correctly

### Performance Expectations
- **Widget Load Time**: Should initialize within 3 seconds
- **Dropdown Response**: Should open/close within 50ms
- **Filter Application**: Should grey out panels within 100ms
- **Category Selection**: Should update labels instantaneously

## Usage in Development Workflow

This test file is essential for:

1. **Integration Validation**: Ensuring dropdown filter integrates properly with Thursday widget
2. **Feature Testing**: Validating all dropdown functionality works as expected
3. **Regression Testing**: Detecting issues introduced by code changes
4. **Performance Monitoring**: Tracking response times and initialization speeds
5. **Accessibility Testing**: Ensuring keyboard navigation works properly
6. **Debug Verification**: Confirming debug systems provide adequate information

This specialized test ensures the Thursday Schedule Widget's dropdown filter integration is robust, performant, and provides an excellent user experience for filtering workshop events by category.