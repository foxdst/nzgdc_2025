# Dropdown Filter Test Documentation

## Overview

The `dropdown-filter-test.html` file serves as a specialized testing environment for validating the Event Categories Dropdown Filter implementation across Morning and Afternoon schedule widgets. This test focuses specifically on dropdown functionality, category filtering behavior, visual feedback, and user interaction patterns.

## File Location

```
JS Embed/html/nzgdc-widget/.widget-tests/dropdown-filter-test.html
```

## Purpose

This test file provides comprehensive validation for:

1. **Dropdown Activation**: Testing filter dropdown trigger mechanisms
2. **Category Selection**: Validating all 11 event category options
3. **Visual Feedback**: Verifying dynamic background color changes
4. **Event Filtering**: Testing real-time event filtering logic
5. **Accessibility**: Keyboard navigation and ARIA compliance
6. **Mobile Responsiveness**: Touch interaction and responsive behavior

## HTML Structure

### Document Head Configuration

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NZGDC Dropdown Filter Test Demo</title>
    <!-- CSS Loading Order -->
    <link rel="stylesheet" href="../css/unified-event-panel.css">
    <link rel="stylesheet" href="../css/morning-schedule-bundle.css">
    <link rel="stylesheet" href="../css/afternoon-schedule-bundle.css">
    <link rel="stylesheet" href="../css/category-filter-overlay.css">
</head>
```

### CSS Variable System

The test defines a unique visual theme for enhanced visibility:

```css
:root {
    --color-dropdown-primary: rgba(139, 69, 19, 1); /* Saddle Brown */
    --color-dropdown-secondary: rgba(255, 165, 0, 1); /* Orange */
    --color-dropdown-accent: rgba(255, 215, 0, 1); /* Gold */
    --color-dropdown-dark: rgba(101, 67, 33, 1); /* Dark Brown */
    --color-dropdown-light: rgba(255, 248, 220, 1); /* Cornsilk */
    --font-primary: 'Futura PT Heavy', 'Futura', Arial, sans-serif;
}
```

### Visual Design Elements

#### Header Section
```html
<header class="demo-header">
    <h1>🔽 Event Categories Dropdown Filter Test Demo</h1>
    <p>Comprehensive testing environment for dropdown filter functionality across Morning and Afternoon schedule widgets</p>
</header>
```

The header includes:
- Gradient background with brown/gold theme
- Grain texture overlay for visual depth
- Responsive typography scaling

#### Test Instructions Panel
```html
<div class="test-instructions">
    <h3>🔬 Comprehensive Test Protocol</h3>
    <h4>🎯 Primary Test Objectives:</h4>
    <ul>
        <li><strong>Dropdown Activation:</strong> Click the highlighted "ALL EVENTS ▶" filter area</li>
        <li><strong>Category Filtering:</strong> Select any of the 11 event categories</li>
        <li><strong>Filter Reset Mechanism:</strong> Use "All Events" option</li>
        <li><strong>Visual State Indicators:</strong> Observe triangle transformation (▶ ↔ ▼)</li>
        <li><strong>Dynamic Text Updates:</strong> Monitor filter label changes</li>
        <li><strong>Dynamic Background Colors:</strong> Observe category color matching</li>
    </ul>
</div>
```

### Widget Testing Sections

#### Morning Widget Section
```html
<div class="demo-section">
    <h2>🌅 Morning Schedule Widget - Advanced Dropdown Filter Testing Environment</h2>
    <div class="widget-container">
        <div id="morning-test-widget" data-nzgdc-morning-schedule></div>
    </div>
</div>
```

#### Afternoon Widget Section
```html
<div class="demo-section">
    <h2>🌇 Afternoon Schedule Widget - Advanced Dropdown Filter Testing Environment</h2>
    <div class="widget-container">
        <div id="afternoon-test-widget" data-nzgdc-afternoon-schedule></div>
    </div>
</div>
```

### Debug Controls

```html
<div class="debug-toggle">
    <button onclick="toggleDebug()">Toggle Debug Mode</button>
    <button onclick="getDebugInfo()">Show Debug Info</button>
</div>

<div class="debug-info" id="debug-info" style="display: none;">
    <strong>Debug Information:</strong><br>
    <div id="debug-content">Click "Show Debug Info" to see widget status</div>
</div>
```

## JavaScript Testing Framework

### Global Configuration

```javascript
window.NZGDC_DEBUG = true; // Enable debug mode for testing
let morningWidget = null;
let afternoonWidget = null;
```

### Widget Initialization Process

The test initializes both Morning and Afternoon widgets:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Dropdown Filter Test Demo');
    
    // Validate data availability
    if (typeof window.MORNING_SCHEDULE_DATA === 'undefined' ||
        typeof window.MORNING_EVENTS === 'undefined') {
        console.error('❌ Morning widget data not available');
        return;
    }
    
    // Initialize Morning Widget
    try {
        morningWidget = new NZGDCMorningScheduleWidget('morning-test-widget', {
            showFilters: true,
            showTimeNavigation: true,
            showFooter: false
        });
    } catch (error) {
        console.error('❌ Failed to initialize morning widget:', error);
    }
    
    // Initialize Afternoon Widget
    try {
        afternoonWidget = new NZGDCAfternoonScheduleWidget('afternoon-test-widget', {
            showFilters: true,
            showTimeNavigation: true,
            showFooter: false
        });
    } catch (error) {
        console.error('❌ Failed to initialize afternoon widget:', error);
    }
});
```

## Debug Functions

### Toggle Debug Mode

```javascript
function toggleDebug() {
    window.NZGDC_DEBUG = !window.NZGDC_DEBUG;
    console.log('Debug mode:', window.NZGDC_DEBUG ? 'ENABLED' : 'DISABLED');
    
    // Update button text
    const button = event.target;
    button.textContent = window.NZGDC_DEBUG ? 'Disable Debug Mode' : 'Enable Debug Mode';
}
```

### Debug Information Display

```javascript
function getDebugInfo() {
    let debugInfo = '<strong>Widget Status:</strong><br>';
    
    // Morning widget debug info
    if (morningWidget) {
        debugInfo += `Morning Widget: ✅ Active (ID: ${morningWidget.uniqueId})<br>`;
        debugInfo += `- Filter State: ${morningWidget.currentFilterCategory || 'None'}<br>`;
        debugInfo += `- Dropdown Controller: ${morningWidget.dropdownController ? '✅' : '❌'}<br>`;
    } else {
        debugInfo += 'Morning Widget: ❌ Not initialized<br>';
    }
    
    // Afternoon widget debug info
    if (afternoonWidget) {
        debugInfo += `Afternoon Widget: ✅ Active (ID: ${afternoonWidget.uniqueId})<br>`;
        debugInfo += `- Filter State: ${afternoonWidget.currentFilterCategory || 'None'}<br>`;
        debugInfo += `- Dropdown Controller: ${afternoonWidget.dropdownController ? '✅' : '❌'}<br>`;
    } else {
        debugInfo += 'Afternoon Widget: ❌ Not initialized<br>';
    }
    
    // Global debug info
    debugInfo += '<br><strong>Global Status:</strong><br>';
    debugInfo += `Debug Mode: ${window.NZGDC_DEBUG ? '✅ Enabled' : '❌ Disabled'}<br>`;
    debugInfo += `Morning Events Data: ${typeof window.MORNING_EVENTS !== 'undefined' ? '✅' : '❌'}<br>`;
    debugInfo += `Afternoon Events Data: ${typeof window.AFTERNOON_EVENTS !== 'undefined' ? '✅' : '❌'}<br>`;
    debugInfo += `CSS Loaded: ${document.querySelector('link[href*="category-filter-overlay"]') ? '✅' : '❌'}<br>`;
}
```

## Visual Enhancement Features

### Filter Area Highlighting

```css
.nzgdc-morning-filters-section::after,
.nzgdc-afternoon-filters-section::after {
    content: '👆 Click Here to Test Dropdown';
    position: absolute;
    top: -25px;
    right: 0;
    background: var(--color-dropdown-secondary);
    color: var(--color-black);
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 700;
    animation: pulse 2s infinite;
    pointer-events: none;
}
```

This creates animated visual indicators pointing to the filter areas for clear testing guidance.

### Pulse Animation

```css
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}
```

## Required JavaScript Dependencies

```html
<!-- Data Sources -->
<script src="../js/morning-schedule-data.js"></script>
<script src="../js/morning-events.js"></script>
<script src="../js/afternoon-schedule-data.js"></script>
<script src="../js/afternoon-events.js"></script>

<!-- Core Functionality -->
<script src="../js/unified-event-loader.js"></script>
<script src="../js/morning-schedule-generator.js"></script>
<script src="../js/afternoon-schedule-generator.js"></script>

<!-- Widget Implementations -->
<script src="../js/morning-widget-core.js"></script>
<script src="../js/afternoon-widget-core.js"></script>
```

## Test Validation Criteria

### Primary Test Objectives

1. **Dropdown Activation Testing**:
   - Click "ALL EVENTS ▶" filter area to trigger dropdown
   - Verify dropdown appears with all category options
   - Confirm visual indicator changes (▶ → ▼)

2. **Category Selection Validation**:
   - Test all 11 event categories individually
   - Verify filter label text updates correctly
   - Confirm background color matches category color

3. **Event Filtering Logic**:
   - Verify events are properly shown/hidden based on selection
   - Test filter reset with "All Events" option
   - Confirm filter state synchronization

4. **Visual State Indicators**:
   - Monitor triangle transformation during dropdown state changes
   - Verify dynamic text updates reflect current selection
   - Confirm background color accuracy across all categories

5. **Accessibility Features**:
   - Test tab navigation through dropdown options
   - Verify enter key selection functionality
   - Test escape key dropdown dismissal

### Advanced Validation Criteria

1. **Color Accuracy**: All 11 categories display with correct Event Categories color scheme
2. **Event Filtering Logic**: Events properly shown/hidden based on category selection
3. **State Synchronization**: Filter text accurately reflects current selection state
4. **Visual Color Matching**: Filter label background matches dropdown category colors exactly
5. **Widget Parity**: Identical functionality across Morning and Afternoon widgets
6. **Layout Stability**: No visual disruption or CSS conflicts during operation
7. **Performance Impact**: Smooth animations and responsive interactions

## Error Handling and Logging

### Global Error Handler

```javascript
window.addEventListener('error', function(event) {
    console.error('🚨 Global Error:', event.error);
});
```

### CSS Loading Validation

```javascript
document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    link.addEventListener('load', function() {
        console.log(`✅ CSS loaded: ${this.href.split('/').pop()}`);
    });
    link.addEventListener('error', function() {
        console.error(`❌ CSS failed to load: ${this.href.split('/').pop()}`);
    });
});
```

### Widget Cleanup

```javascript
window.addEventListener('beforeunload', function() {
    if (morningWidget && typeof morningWidget.destroy === 'function') {
        morningWidget.destroy();
    }
    if (afternoonWidget && typeof afternoonWidget.destroy === 'function') {
        afternoonWidget.destroy();
    }
});
```

## Responsive Design Features

### Mobile Optimization

```css
@media (max-width: 768px) {
    .demo-header h1 {
        font-size: 28px;
    }
    
    .demo-section {
        margin: 15px;
    }
    
    .test-instructions {
        margin: 15px;
        padding: 20px;
    }
    
    .nzgdc-morning-filters-section::after,
    .nzgdc-afternoon-filters-section::after {
        display: none; /* Hide helper text on mobile */
    }
}
```

## Integration Points

### Widget APIs
- `NZGDCMorningScheduleWidget`: Morning widget implementation
- `NZGDCAfternoonScheduleWidget`: Afternoon widget implementation

### Data Sources
- `window.MORNING_EVENTS`: Morning event data
- `window.AFTERNOON_EVENTS`: Afternoon event data
- `window.MORNING_SCHEDULE_DATA`: Morning schedule structure
- `window.AFTERNOON_SCHEDULE_DATA`: Afternoon schedule structure

### CSS Dependencies
- `unified-event-panel.css`: Core event panel styles
- `morning-schedule-bundle.css`: Morning widget specific styles
- `afternoon-schedule-bundle.css`: Afternoon widget specific styles
- `category-filter-overlay.css`: Dropdown and category styling

## Usage in Development Workflow

This test file is essential for:

1. **Dropdown Feature Validation**: Ensuring dropdown filter works across both widgets
2. **Category System Testing**: Validating all 11 categories function correctly
3. **Visual Consistency Checking**: Confirming identical behavior between widgets
4. **Performance Testing**: Monitoring dropdown response times
5. **Accessibility Compliance**: Ensuring keyboard navigation works properly
6. **Mobile Compatibility**: Testing touch interactions and responsive behavior

## Key Testing Scenarios

### Manual Testing Steps
1. Load the test page and wait for both widgets to initialize
2. Click each "ALL EVENTS ▶" filter area to open dropdowns
3. Select each of the 11 categories and verify:
   - Label text updates correctly
   - Background color matches category
   - Events filter appropriately
   - Visual indicators change properly
4. Test "All Events" reset functionality
5. Verify keyboard navigation (Tab, Enter, Escape)
6. Test on mobile devices for touch responsiveness

### Automated Debug Features
- Toggle debug mode for detailed console logging
- Show debug info for widget status and configuration
- CSS loading validation with success/failure logging
- Global error handling with detailed error reporting

This comprehensive test ensures the dropdown filter functionality works reliably across both Morning and Afternoon schedule widgets, providing consistent user experience and robust filtering capabilities.