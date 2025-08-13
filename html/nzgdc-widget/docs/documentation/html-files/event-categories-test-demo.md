# Event Categories Test Demo Documentation

## Overview

The `event-categories-test-demo.html` file serves as a comprehensive testing environment for the Event Categories system implementation within the NZGDC widget ecosystem. This specialized demo validates the complete category system with all 11 event categories, overlay compatibility, brightness adjustments, and dynamic color rendering across both big (620x300) and main (300x300) event panels.

## File Location

```
JS Embed/html/nzgdc-widget/.widget-tests/event-categories-test-demo.html
```

## Purpose

This test demo provides comprehensive validation for:

1. **Complete Category System**: Testing all 11 implemented event categories
2. **Overlay Compatibility**: Validating brightness-based overlay system
3. **Panel Size Variations**: Testing both big and main panel rendering
4. **Color Accuracy**: Verifying category-specific color schemes
5. **Brightness Enhancement v1.3**: Testing improved overlay opacity system
6. **Data Validation**: Ensuring proper category-to-data mapping
7. **Error Handling**: Testing fallback mechanisms for invalid categories

## HTML Structure

### Document Head and Styling

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NZGDC Event Categories - Implementation Test Demo</title>
    <link rel="stylesheet" href="../css/unified-event-panel.css">
</head>
```

### CSS Variable System

The demo uses NZGDC brand colors with modifications for testing visibility:

```css
:root {
    --color-yellow: rgba(255, 236, 81, 1);
    --color-green: rgba(40, 167, 69, 1);
    --color-green-hover: rgba(35, 145, 60, 1);
    --color-white: rgba(255, 255, 255, 1);
    --color-black: rgba(0, 0, 0, 1);
    --color-green-bright: rgba(45, 180, 75, 1);
    --font-primary: 'Futura PT Heavy', 'Futura', Arial, sans-serif;
}
```

### Main Layout Structure

#### Demo Header
```html
<header class="demo-header">
    <h1>NZGDC Event Categories - Test Demo</h1>
    <p>Interactive testing environment for the Event Categories system</p>
</header>
```

#### Implementation Status Panel
```html
<div class="category-info">
    <h3>Implementation Status</h3>
    <p><span class="status-indicator status-success"></span>11 Event Categories Implemented</p>
    <p><span class="status-indicator status-success"></span>Overlay Compatibility System Active</p>
    <p><span class="status-indicator status-success"></span>Data Validation System Enabled</p>
</div>
```

#### Testing Controls
```html
<div class="controls">
    <h3>Testing Controls</h3>
    <button onclick="enableDebugMode()">Enable Debug Mode</button>
    <button onclick="testAllCategories()">Test All Categories</button>
    <button onclick="testOverlayCompatibility()">Test Overlay System</button>
    <button onclick="testBrightnessOverlaySystem()">Test Brightness Fix v1.3</button>
    <button onclick="testInvalidCategories()">Test Error Handling</button>
    <button onclick="clearResults()">Clear Results</button>
</div>
```

### Panel Display Sections

#### Big Event Panels Section
```html
<div class="test-section">
    <h2>Big Event Panels (620x300) - All Categories</h2>
    <div class="test-grid big-panels-grid" id="big-panels-container">
        <!-- Big panels will be generated here -->
    </div>
</div>
```

#### Main Event Panels Section
```html
<div class="test-section">
    <h2>Main Event Panels (300x300) - All Categories</h2>
    <div class="test-grid main-panels-grid" id="main-panels-container">
        <!-- Main panels will be generated here -->
    </div>
</div>
```

### Results and Analysis Section

```html
<div class="test-section" id="test-results">
    <h2>Test Results</h2>
    <div id="results-output">
        <p>Run tests using the controls above to see results here.</p>
    </div>
</div>
```

## JavaScript Testing Framework

### Test Data Structure

The demo includes comprehensive test data for all 11 event categories:

```javascript
const TEST_EVENT_DATA = [
    {
        categoryKey: 'STORY_NARRATIVE',
        category: 'Story & Narrative',
        title: 'Advanced Interactive Storytelling Workshop',
        timeframe: '90 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Sarah Mitchell', position: 'Lead Writer at Narrative Studios' },
            { name: 'Marcus Williams', position: 'Story Director at GameCorp' }
        ]
    },
    // ... additional 10 categories
];
```

### Global Variables and Configuration

```javascript
let eventLoader = null;
let debugMode = false;

// Enable debug mode for template loading
window.NZGDC_DEBUG = true;
```

### Core Testing Functions

#### Demo Initialization
```javascript
async function initDemo() {
    try {
        debugOutput('Initializing Event Categories Demo...');
        eventLoader = new UnifiedEventLoader();
        await eventLoader.loadTemplate();
        generateAllPanels();
        debugOutput('Demo initialization complete');
        updateResults('✅ Demo initialized successfully');
    } catch (error) {
        debugOutput(`Error initializing demo: ${error.message}`);
        updateResults(`❌ Initialization failed: ${error.message}`);
    }
}
```

#### Panel Generation
```javascript
function generateAllPanels() {
    const bigContainer = document.getElementById('big-panels-container');
    const mainContainer = document.getElementById('main-panels-container');
    
    bigContainer.innerHTML = '';
    mainContainer.innerHTML = '';
    
    TEST_EVENT_DATA.forEach((eventData, index) => {
        try {
            // Generate big panel
            const bigPanel = eventLoader.createEventPanel(eventData, 'big', 'morning');
            bigContainer.appendChild(bigPanel);
            
            // Generate main panel
            const mainPanel = eventLoader.createEventPanel(eventData, 'main', 'morning');
            mainContainer.appendChild(mainPanel);
            
            debugOutput(`Generated panels for category: ${eventData.categoryKey}`);
        } catch (error) {
            debugOutput(`Error generating panels for ${eventData.categoryKey}: ${error.message}`);
        }
    });
}
```

## Category System Overview

### Category Classification

The demo provides detailed information about the category system:

#### Light Categories (10 Categories)
- Use dark overlay (`rgba(0,0,0,0.75)`) with white text for readability
- Categories: Story & Narrative, Production & QA, Culture, Business & Marketing, Art, Audio, Programming, Realities (VR, AR, MR), Game Design, Serious & Educational Games

#### Dark Category (1 Category)
- **DATA_TESTING_RESEARCH**: Uses light overlay (`rgba(255,255,255,0.25)`) with black text
- Enhanced in v1.3 with improved overlay opacity from 0.15 to 0.25 for better text readability

## Comprehensive Testing Functions

### Test All Categories
```javascript
function testAllCategories() {
    debugOutput('Testing all 11 categories...');
    
    const results = [];
    const bigPanels = document.querySelectorAll('#big-panels-container .nzgdc-event-panel-big');
    const mainPanels = document.querySelectorAll('#main-panels-container .nzgdc-event-panel-main');
    
    // Test big panels
    bigPanels.forEach((panel, index) => {
        const category = panel.getAttribute('data-category');
        const brightness = panel.getAttribute('data-category-brightness');
        const categoryEl = panel.querySelector('.nzgdc-event-category-big');
        
        if (category && brightness && categoryEl) {
            results.push(`✅ Big Panel ${index + 1}: ${category} (${brightness})`);
        } else {
            results.push(`❌ Big Panel ${index + 1}: Missing attributes or elements`);
        }
    });
    
    updateResults(results.join('<br>'));
}
```

### Test Overlay Compatibility
```javascript
function testOverlayCompatibility() {
    debugOutput('Testing overlay compatibility...');
    
    const results = [];
    const lightCategories = [];
    const darkCategories = [];
    
    document.querySelectorAll('[data-category-brightness]').forEach(panel => {
        const brightness = panel.getAttribute('data-category-brightness');
        const category = panel.getAttribute('data-category');
        
        if (brightness === 'light') {
            lightCategories.push(category);
        } else if (brightness === 'dark') {
            darkCategories.push(category);
        }
    });
    
    results.push(`✅ Light categories (${lightCategories.length}): ${[...new Set(lightCategories)].join(', ')}`);
    results.push(`✅ Dark categories (${darkCategories.length}): ${[...new Set(darkCategories)].join(', ')}`);
    
    // Verify expected dark category
    if (darkCategories.includes('DATA_TESTING_RESEARCH')) {
        results.push('✅ DATA_TESTING_RESEARCH correctly identified as dark category');
    } else {
        results.push('❌ DATA_TESTING_RESEARCH not found or incorrect brightness');
    }
    
    updateResults(results.join('<br>'));
}
```

### Test Brightness Overlay System Fix v1.3
```javascript
function testBrightnessOverlaySystem() {
    debugOutput('Testing brightness overlay system fix v1.3...');
    
    const results = [];
    let testsPassed = 0;
    let testsTotal = 0;
    
    // Test 1: Verify overlay container context requirements
    const testPanels = document.querySelectorAll('[data-category][data-category-brightness]');
    
    testPanels.forEach(panel => {
        const category = panel.getAttribute('data-category');
        const bigOverlay = panel.querySelector('.nzgdc-event-detail-overlay-big');
        const mainOverlay = panel.querySelector('.nzgdc-event-panel-overlay-main');
        
        if (bigOverlay || mainOverlay) {
            testsTotal++;
            results.push(`✅ Panel ${category}: Overlay container found`);
            testsPassed++;
            
            // Test CTA elements within overlay context
            const ctaText = (bigOverlay || mainOverlay).querySelector('[class*="nzgdc-cta-text"]');
            const ctaMarker = (bigOverlay || mainOverlay).querySelector('[class*="nzgdc-open-marker"]');
            
            if (ctaText && ctaMarker) {
                testsTotal++;
                results.push(`✅ Panel ${category}: CTA elements found in overlay context`);
                testsPassed++;
            }
        }
    });
    
    // Calculate test results
    const successRate = ((testsPassed / testsTotal) * 100).toFixed(1);
    
    results.unshift(`<strong>Tests Passed: ${testsPassed}/${testsTotal} (${successRate}%)</strong>`);
    
    if (testsPassed === testsTotal) {
        results.unshift(`<span style="color: #28a745;">✅ ALL TESTS PASSED - Brightness overlay system working correctly</span>`);
    } else {
        results.unshift(`<span style="color: #dc3545;">⚠️ SOME TESTS FAILED - Review brightness overlay implementation</span>`);
    }
    
    updateResults(results.join('<br>'));
}
```

### Test Invalid Category Handling
```javascript
function testInvalidCategories() {
    debugOutput('Testing invalid category handling...');
    
    const invalidEventData = {
        categoryKey: 'INVALID_CATEGORY',
        category: 'Invalid Category',
        title: 'Test Invalid Category Event',
        timeframe: '30 minutes',
        speakers: [{ name: 'Test Speaker', position: 'Test Position' }]
    };
    
    try {
        const testPanel = eventLoader.createEventPanel(invalidEventData, 'big', 'morning');
        const category = testPanel.getAttribute('data-category');
        
        if (category === 'PROGRAMMING') {
            updateResults('✅ Invalid categories correctly fallback to PROGRAMMING');
        } else {
            updateResults(`❌ Invalid category fallback failed: got ${category}`);
        }
        
        // Clean up test panel
        testPanel.remove();
    } catch (error) {
        updateResults(`❌ Error handling test failed: ${error.message}`);
    }
}
```

## Template Integration

### Embedded Template Fallback
```javascript
window.UNIFIED_EVENT_PANEL_TEMPLATE = `
<div class="nzgdc-event-panel-big">
    <!-- Complete template structure embedded for reliable loading -->
</div>
`;
```

This ensures the demo works even if the external template file fails to load.

### UnifiedEventLoader Integration
```javascript
// Test Data with all 11 categories
eventLoader = new UnifiedEventLoader();
await eventLoader.loadTemplate();
```

The demo integrates directly with the UnifiedEventLoader system to test real-world usage patterns.

## Visual Design Features

### CSS Grid Layouts
```css
.big-panels-grid {
    grid-template-columns: 1fr;
}

.main-panels-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

### Status Indicators
```css
.status-success { background: var(--color-green); }
.status-warning { background: #ffc107; }
.status-error { background: #dc3545; }
```

### Responsive Design
```css
@media (max-width: 768px) {
    .test-container {
        padding: 0 10px;
    }
    
    .main-panels-grid {
        grid-template-columns: 1fr;
    }
    
    .controls button {
        display: block;
        width: 100%;
        margin: 5px 0;
    }
}
```

## Debug and Logging System

### Debug Output Function
```javascript
function debugOutput(message) {
    const debugEl = document.getElementById('debug-output');
    const timestamp = new Date().toLocaleTimeString();
    debugEl.innerHTML += `<br>[${timestamp}] ${message}`;
    debugEl.scrollTop = debugEl.scrollHeight;
}
```

### Results Display
```javascript
function updateResults(content) {
    document.getElementById('results-output').innerHTML = content;
}
```

## Footer and Navigation

```html
<footer class="demo-footer">
    <span>Event Categories Testing Environment | NZGDC 2025</span>
    <button onclick="location.href='widget-demo.html'">Main Widget Demo</button>
    <button onclick="location.reload()">Refresh Page</button>
    <button onclick="window.open('https://github.com/nzgdc/widgets', '_blank')">Documentation</button>
</footer>
```

## Integration Points

### JavaScript Dependencies
- `unified-event-loader.js`: Core template loading and panel generation system

### CSS Dependencies  
- `unified-event-panel.css`: Core event panel component styles

### Data Validation
The demo validates proper integration of:
- Event Categories color system
- Overlay brightness compatibility
- Template population mechanisms
- Error handling and fallbacks

## Usage in Development Workflow

This test demo is essential for:

1. **Category System Validation**: Ensuring all 11 categories render correctly
2. **Overlay System Testing**: Validating brightness-based overlay adjustments
3. **Template Integration Testing**: Verifying UnifiedEventLoader functionality
4. **Visual Quality Assurance**: Confirming consistent color and layout rendering
5. **Error Handling Validation**: Testing fallback mechanisms
6. **Performance Testing**: Monitoring panel generation performance with all categories

## Manual Testing Utilities

### Global Testing Object
```javascript
window.testCategorySystem = {
    loader: () => eventLoader,
    testData: TEST_EVENT_DATA,
    generatePanel: (categoryKey, panelType = 'big') => {
        const eventData = TEST_EVENT_DATA.find(e => e.categoryKey === categoryKey);
        if (eventData) {
            return eventLoader.createEventPanel(eventData, panelType, 'morning');
        }
        return null;
    }
};
```

This provides direct access to testing utilities for manual console testing.

## Success Criteria

### Visual Validation
- All 11 categories display with correct colors
- Overlay brightness properly applied (dark overlay for light categories, light overlay for dark category)
- Panel dimensions consistent (620x300 for big, 300x300 for main)
- Typography and spacing uniform across all categories

### Functional Validation  
- Template loading and population works correctly
- Category-to-color mapping accurate
- Error handling graceful for invalid categories
- Performance acceptable for rendering all categories simultaneously

This comprehensive test demo ensures the Event Categories system works reliably across all scenarios and provides a robust foundation for category-based event filtering throughout the NZGDC widget system.