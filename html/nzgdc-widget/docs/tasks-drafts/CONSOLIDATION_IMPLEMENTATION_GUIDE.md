# CONSOLIDATION IMPLEMENTATION GUIDE
## Step-by-Step Technical Implementation with Code Examples

---

## 🚀 IMPLEMENTATION SEQUENCE

**CRITICAL: Follow steps in exact order. Do not skip or rearrange.**

---

## STEP 1: CREATE UNIFIED ENTRY POINT

### File: `nzgdc-friday-saturday-schedule-widget-modular.js`

```javascript
// NZGDC Friday/Saturday Schedule Widget - Unified Entry Point
// This file combines morning and afternoon schedule functionality with tab switching

(function (window, document) {
  "use strict";

  // Configuration - detect if we're in a subdirectory
  const currentPath = window.location.pathname;
  const WIDGET_BASE_PATH = currentPath.includes("/.widget-tests/") ? "../" : "";
  const REQUEST_TIMEOUT = 10000; // 10 seconds timeout for all requests

  // Debug mode - enable with window.NZGDC_DEBUG = true or ?debug=true
  const DEBUG_MODE =
    (typeof window !== "undefined" && window.NZGDC_DEBUG === true) ||
    (typeof window !== "undefined" &&
      window.location.search.includes("debug=true"));

  function debugLog(message, ...args) {
    if (DEBUG_MODE) {
      console.log("[NZGDC Friday/Saturday Widget Loader]", message, ...args);
    }
  }

  // Track loading state
  let widgetReady = false;
  const readyCallbacks = [];

  // Track widget instances for cleanup
  const activeFridaySaturdayWidgets = new Set();

  // Main Friday/Saturday widget loader class
  class NZGDCFridaySaturdayWidgetLoader {
    constructor() {
      this.cssLoaded = false;
      this.jsLoaded = false;
      this.templateLoaded = false;
    }

    async loadWidget() {
      try {
        debugLog("Starting Friday/Saturday widget module loading");
        debugLog("Configuration:", {
          basePath: WIDGET_BASE_PATH,
          timeout: REQUEST_TIMEOUT,
          debug: DEBUG_MODE,
        });

        // Load CSS files in correct order
        await Promise.all([
          this.loadCSS("css/unified-event-panel.css"),
          this.loadCSS("css/category-filter-overlay.css"),
          this.loadCSS("css/friday-saturday-schedule-bundle.css")
        ]);
        this.cssLoaded = true;

        // Load JavaScript modules
        await Promise.all([
          this.loadJS("js/unified-event-loader.js"),
          this.loadJS("js/friday-saturday-widget-core.js"),
          this.loadJS("js/morning-schedule-generator.js"),
          this.loadJS("js/afternoon-schedule-generator.js"),
          this.loadJS("js/morning-schedule-data.js"),
          this.loadJS("js/afternoon-schedule-data.js"),
          this.loadJS("js/morning-events.js"),
          this.loadJS("js/afternoon-events.js")
        ]);
        this.jsLoaded = true;

        // Load unified template
        await this.loadTemplate("templates/unified-event-panel.html");
        this.templateLoaded = true;

        debugLog("Friday/Saturday widget modules loaded successfully");
        widgetReady = true;

        // Execute ready callbacks
        readyCallbacks.forEach(callback => callback());
        readyCallbacks.length = 0;

        return true;
      } catch (error) {
        debugLog("Error loading Friday/Saturday widget modules:", error);
        throw error;
      }
    }

    async loadCSS(path) {
      return new Promise((resolve, reject) => {
        const fullPath = WIDGET_BASE_PATH + path;
        
        // Check if already loaded
        if (document.querySelector(`link[href="${fullPath}"]`)) {
          debugLog(`CSS already loaded: ${path}`);
          resolve();
          return;
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = fullPath;

        const timeout = setTimeout(() => {
          reject(new Error(`CSS load timeout: ${path}`));
        }, REQUEST_TIMEOUT);

        link.onload = () => {
          clearTimeout(timeout);
          debugLog(`CSS loaded: ${path}`);
          resolve();
        };

        link.onerror = () => {
          clearTimeout(timeout);
          reject(new Error(`Failed to load CSS: ${path}`));
        };

        document.head.appendChild(link);
      });
    }

    async loadJS(path) {
      return new Promise((resolve, reject) => {
        const fullPath = WIDGET_BASE_PATH + path;
        
        // Check if already loaded
        if (document.querySelector(`script[src="${fullPath}"]`)) {
          debugLog(`JS already loaded: ${path}`);
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = fullPath;
        script.type = "text/javascript";

        const timeout = setTimeout(() => {
          reject(new Error(`JS load timeout: ${path}`));
        }, REQUEST_TIMEOUT);

        script.onload = () => {
          clearTimeout(timeout);
          debugLog(`JS loaded: ${path}`);
          resolve();
        };

        script.onerror = () => {
          clearTimeout(timeout);
          reject(new Error(`Failed to load JS: ${path}`));
        };

        document.head.appendChild(script);
      });
    }

    async loadTemplate(path) {
      return new Promise((resolve, reject) => {
        const fullPath = WIDGET_BASE_PATH + path;
        
        const timeout = setTimeout(() => {
          reject(new Error(`Template load timeout: ${path}`));
        }, REQUEST_TIMEOUT);

        fetch(fullPath)
          .then(response => {
            clearTimeout(timeout);
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.text();
          })
          .then(templateHTML => {
            // Store template globally
            window.UNIFIED_EVENT_PANEL_TEMPLATE = templateHTML;
            debugLog(`Template loaded: ${path}`);
            resolve();
          })
          .catch(error => {
            clearTimeout(timeout);
            reject(new Error(`Failed to load template: ${path} - ${error.message}`));
          });
      });
    }
  }

  // Widget creation function
  async function createFridaySaturdayWidget(containerId, options = {}) {
    debugLog("Creating Friday/Saturday widget", { containerId, options });

    try {
      // Load modules if not already loaded
      if (!widgetReady) {
        const loader = new NZGDCFridaySaturdayWidgetLoader();
        await loader.loadWidget();
      }

      // Ensure core class is available
      if (!window.FridaySaturdayWidgetCore) {
        throw new Error("FridaySaturdayWidgetCore not available");
      }

      // Create widget instance
      const widget = new window.FridaySaturdayWidgetCore(containerId, options);
      await widget.initialize();

      // Track for cleanup
      activeFridaySaturdayWidgets.add(widget);

      debugLog("Friday/Saturday widget created successfully");
      return widget;
    } catch (error) {
      debugLog("Error creating Friday/Saturday widget:", error);
      throw error;
    }
  }

  // Cleanup function
  function destroyAllFridaySaturdayWidgets() {
    debugLog("Destroying all Friday/Saturday widgets");
    
    activeFridaySaturdayWidgets.forEach(widget => {
      if (widget && typeof widget.destroy === 'function') {
        widget.destroy();
      }
    });
    
    activeFridaySaturdayWidgets.clear();
    debugLog("All Friday/Saturday widgets destroyed");
  }

  // Ready callback function
  function onFridaySaturdayWidgetReady(callback) {
    if (widgetReady) {
      callback();
    } else {
      readyCallbacks.push(callback);
    }
  }

  // Export to global scope
  window.createFridaySaturdayWidget = createFridaySaturdayWidget;
  window.destroyAllFridaySaturdayWidgets = destroyAllFridaySaturdayWidgets;
  window.onFridaySaturdayWidgetReady = onFridaySaturdayWidgetReady;

  debugLog("Friday/Saturday Widget Loader initialized");

})(window, document);
```

**Validation Steps:**
1. Create the file and verify no syntax errors
2. Test basic loading by including in widget-demo.html
3. Verify all CSS/JS files load in correct order
4. Check debug logging works correctly

---

## STEP 2: CREATE UNIFIED CSS BUNDLE

### File: `css/friday-saturday-schedule-bundle.css`

```css
/* NZGDC Friday/Saturday Schedule Widget - Unified CSS Bundle
   CRITICAL: This file MUST NOT contain any event panel styles
   All event panel styles are in unified-event-panel.css */

/* =============================================================================
   WIDGET CONTAINER & BASE STYLING
   ============================================================================= */

.nzgdc-friday-saturday-schedule-widget {
    width: 100%;
    font-family: 'Arial', sans-serif;
    background-color: #ffffff;
    position: relative;
    box-sizing: border-box;
}

.nzgdc-friday-saturday-schedule-widget * {
    box-sizing: border-box;
}

/* =============================================================================
   EXISTING BUTTON NAVIGATION SYSTEM
   NOTE: Morning/Afternoon Events buttons already exist and are styled
   NO NEW STYLES NEEDED - JUST WIRE UP EXISTING BUTTONS FOR VIEW SWITCHING
   ============================================================================= */

/* Existing button styles are already in morning-schedule-bundle.css and afternoon-schedule-bundle.css:
   .nzgdc-morning-events-button
   .nzgdc-afternoon-events-button
   These styles will be preserved in the unified bundle below */

/* =============================================================================
   VIEW CONTAINERS
   ============================================================================= */

.morning-view-container,
.afternoon-view-container {
    width: 100%;
    position: relative;
}

/* Show/Hide Logic */
.nzgdc-friday-saturday-schedule-widget.morning-view .afternoon-view-container {
    display: none;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .morning-view-container {
    display: none;
}

/* =============================================================================
   MORNING VIEW STYLES (from morning-schedule-bundle.css)
   NOTE: Import ALL existing styles with view-specific prefixes
   ============================================================================= */

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-schedule-widget {
    width: 100%;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-header {
    text-align: center;
    margin-bottom: 30px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-title {
    font-size: 28px;
    font-weight: bold;
    color: #2a5f41;
    margin-bottom: 10px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-subtitle {
    font-size: 16px;
    color: #666;
}

/* Existing Morning Events Button Styles - PRESERVE EXACTLY */
.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-events-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    background-color: #2a5f41;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    min-width: 120px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-afternoon-events-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    background-color: #1a4d72;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    min-width: 120px;
}

/* Morning Filters Section */
.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-filters-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 15px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-filters-label {
    font-weight: bold;
    color: #2a5f41;
    font-size: 14px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-filters-value {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #2a5f41;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    min-width: 150px;
    justify-content: center;
}

/* Morning Schedule Content */
.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-schedule-content {
    background-color: white;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-time-slot {
    margin-bottom: 30px;
    border-left: 4px solid #2a5f41;
    padding-left: 20px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-time-header {
    margin-bottom: 15px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-time-label {
    font-size: 18px;
    font-weight: bold;
    color: #2a5f41;
    margin-bottom: 5px;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-session-title {
    font-size: 14px;
    color: #666;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-underline {
    height: 2px;
    background-color: #2a5f41;
    margin: 10px 0;
}

.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-scheduled-morning-events {
    display: grid;
    gap: 15px;
}

/* =============================================================================
   AFTERNOON VIEW STYLES (from afternoon-schedule-bundle.css)
   NOTE: Import ALL existing styles with view-specific prefixes
   ============================================================================= */

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-schedule-widget {
    width: 100%;
    padding: 20px;
    background-color: #f0f4f8;
    border-radius: 8px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-header {
    text-align: center;
    margin-bottom: 30px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-title {
    font-size: 28px;
    font-weight: bold;
    color: #1a4d72;
    margin-bottom: 10px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-subtitle {
    font-size: 16px;
    color: #666;
}

/* Existing Afternoon Events Button Styles - PRESERVE EXACTLY */
.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-morning-events-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    background-color: #2a5f41;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    min-width: 120px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-events-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    background-color: #1a4d72;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    min-width: 120px;
}

/* Afternoon Filters Section */
.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-filters-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 15px;
    background-color: white;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-filters-label {
    font-weight: bold;
    color: #1a4d72;
    font-size: 14px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-filters-value {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: #1a4d72;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    min-width: 150px;
    justify-content: center;
}

/* Afternoon Schedule Content */
.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-schedule-content {
    background-color: white;
    border-radius: 6px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-time-slot {
    margin-bottom: 30px;
    border-left: 4px solid #1a4d72;
    padding-left: 20px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-time-header {
    margin-bottom: 15px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-time-label {
    font-size: 18px;
    font-weight: bold;
    color: #1a4d72;
    margin-bottom: 5px;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-session-title {
    font-size: 14px;
    color: #666;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-underline {
    height: 2px;
    background-color: #1a4d72;
    margin: 10px 0;
}

.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-scheduled-afternoon-events {
    display: grid;
    gap: 15px;
}

/* =============================================================================
   RESPONSIVE DESIGN
   ============================================================================= */

@media (max-width: 768px) {
    .nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-schedule-time-navigation,
    .nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-schedule-time-navigation {
        flex-direction: column;
        gap: 10px;
    }
    
    .nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-events-button,
    .nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-afternoon-events-button,
    .nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-morning-events-button,
    .nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-events-button {
        width: 100%;
        max-width: 200px;
    }
    
    .nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-filters-section,
    .nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-filters-section {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
    
    .nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-filters-value,
    .nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-filters-value {
        width: 100%;
        max-width: 300px;
    }
}

/* =============================================================================
   LOADING STATES
   ============================================================================= */

.friday-saturday-widget-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px;
    font-size: 16px;
    color: #666;
}

.friday-saturday-widget-error {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px;
    font-size: 16px;
    color: #d32f2f;
    background-color: #ffebee;
    border-radius: 4px;
    border: 1px solid #ffcdd2;
}

/* =============================================================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================================================= */

.nzgdc-friday-saturday-schedule-widget .nzgdc-morning-events-button:focus,
.nzgdc-friday-saturday-schedule-widget .nzgdc-afternoon-events-button:focus {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
}

.nzgdc-friday-saturday-schedule-widget .nzgdc-morning-events-button:focus-visible,
.nzgdc-friday-saturday-schedule-widget .nzgdc-afternoon-events-button:focus-visible {
    outline: 2px solid #4CAF50;
    outline-offset: 2px;
}

/* Screen reader only text */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
```

**Validation Steps:**
1. Verify NO event panel CSS classes in bundle file
2. Test existing button styling is preserved exactly
3. Validate view switching CSS works correctly
4. Check responsive behavior on mobile devices
5. Confirm no CSS specificity conflicts
6. Ensure existing Morning/Afternoon Events buttons maintain exact appearance

---

## STEP 3: CREATE UNIFIED WIDGET CORE

### File: `js/friday-saturday-widget-core.js`

```javascript
// NZGDC Friday/Saturday Widget Core
// Unified core combining morning and afternoon widget functionality

(function (window, document) {
  "use strict";

  class FridaySaturdayWidgetCore {
    constructor(containerId, options = {}) {
      this.containerId = containerId;
      this.container = null;
      this.options = {
        defaultView: 'morning',
        enableDebug: false,
        ...options
      };

      // State management
      this.currentView = this.options.defaultView;
      this.initialized = false;
      this.morningGenerator = null;
      this.afternoonGenerator = null;
      this.morningContainer = null;
      this.afternoonContainer = null;

      // UI Elements
      this.tabContainer = null;
      this.morningTab = null;
      this.afternoonTab = null;

      // Debug logging
      this.debugLog = this.options.enableDebug 
        ? (msg, ...args) => console.log(`[FridaySaturdayWidget]`, msg, ...args)
        : () => {};
    }

    async initialize() {
      try {
        this.debugLog("Initializing Friday/Saturday widget");

        // Get container element
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
          throw new Error(`Container element not found: ${this.containerId}`);
        }

        // Set up widget structure
        this.setupWidgetStructure();

        // Initialize generators
        await this.initializeGenerators();

        // Load default view
        await this.loadView(this.currentView);

        // Set up event listeners
        this.setupEventListeners();

        this.initialized = true;
        this.debugLog("Friday/Saturday widget initialized successfully");

        return this;
      } catch (error) {
        this.debugLog("Error initializing widget:", error);
        this.showError(`Failed to initialize widget: ${error.message}`);
        throw error;
      }
    }

    setupWidgetStructure() {
      this.container.className = `nzgdc-friday-saturday-schedule-widget ${this.currentView}-view`;
      
      // Create unified container structure that will hold both morning and afternoon views
      this.container.innerHTML = `
        <div class="morning-view-container">
          <div class="friday-saturday-widget-loading">Loading Morning Events...</div>
        </div>
        
        <div class="afternoon-view-container">
          <div class="friday-saturday-widget-loading">Loading Afternoon Events...</div>
        </div>
      `;

      // Get references to view containers
      this.morningContainer = this.container.querySelector('.morning-view-container');
      this.afternoonContainer = this.container.querySelector('.afternoon-view-container');
      
      // Note: Morning/Afternoon Events buttons will be created by the generators
      // and will be wired up in the setupEventListeners() method after content loads
    }

    async initializeGenerators() {
      this.debugLog("Initializing schedule generators");

      // Initialize morning generator
      if (window.MorningScheduleGenerator) {
        this.morningGenerator = new window.MorningScheduleGenerator();
      } else {
        throw new Error("MorningScheduleGenerator not available");
      }

      // Initialize afternoon generator  
      if (window.AfternoonScheduleGenerator) {
        this.afternoonGenerator = new window.AfternoonScheduleGenerator();
      } else {
        throw new Error("AfternoonScheduleGenerator not available");
      }
    }

    setupEventListeners() {
      this.debugLog("Setting up event listeners for existing Morning/Afternoon buttons");
      
      // Note: Event listeners will be set up after content loads
      // This method will be called again after generators create the content
      this.wireUpExistingButtons();
    }
    
    wireUpExistingButtons() {
      // Find existing Morning Events buttons in both views and wire them up
      const morningButtons = this.container.querySelectorAll('.nzgdc-morning-events-button');
      const afternoonButtons = this.container.querySelectorAll('.nzgdc-afternoon-events-button');
      
      // Wire up Morning Events buttons
      morningButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchToView('morning');
        });
        
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.switchToView('morning');
          }
        });
      });
      
      // Wire up Afternoon Events buttons
      afternoonButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          this.switchToView('afternoon');
        });
        
        button.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.switchToView('afternoon');
          }
        });
      });
    }

    async switchToView(viewName) {
      if (viewName === this.currentView) {
        this.debugLog(`Already showing ${viewName} view`);
        return;
      }

      this.debugLog(`Switching to ${viewName} view`);

      try {
        // Update current view
        this.currentView = viewName;

        // Update widget CSS class
        this.container.className = `nzgdc-friday-saturday-schedule-widget ${viewName}-view`;

        // Update existing button states
        this.updateExistingButtonStates();

        // Load the requested view if not already loaded
        await this.loadView(viewName);

        this.debugLog(`Successfully switched to ${viewName} view`);
      } catch (error) {
        this.debugLog(`Error switching to ${viewName} view:`, error);
        this.showError(`Failed to switch to ${viewName} view: ${error.message}`);
      }
    }

    async loadView(viewName) {
      this.debugLog(`Loading ${viewName} view`);

      try {
        if (viewName === 'morning') {
          await this.loadMorningView();
        } else if (viewName === 'afternoon') {
          await this.loadAfternoonView();
        } else {
          throw new Error(`Unknown view: ${viewName}`);
        }
      } catch (error) {
        this.debugLog(`Error loading ${viewName} view:`, error);
        throw error;
      }
    }

    async loadMorningView() {
      if (!this.morningGenerator) {
        throw new Error("Morning generator not initialized");
      }

      try {
        // Generate morning schedule HTML
        const scheduleHTML = await this.morningGenerator.generateSchedule();
        
        // Insert into morning container
        this.morningContainer.innerHTML = scheduleHTML;
        
        // Wire up the existing Morning/Afternoon Events buttons in the generated content
        this.wireUpExistingButtons();
        
        // Initialize any additional functionality (like category filters)
        this.initializeMorningFeatures();
        
        this.debugLog("Morning view loaded successfully");
      } catch (error) {
        this.morningContainer.innerHTML = `
          <div class="friday-saturday-widget-error">
            Failed to load morning schedule: ${error.message}
          </div>
        `;
        throw error;
      }
    }

    async loadAfternoonView() {
      if (!this.afternoonGenerator) {
        throw new Error("Afternoon generator not initialized");
      }

      try {
        // Generate afternoon schedule HTML
        const scheduleHTML = await this.afternoonGenerator.generateSchedule();
        
        // Insert into afternoon container
        this.afternoonContainer.innerHTML = scheduleHTML;
        
        // Wire up the existing Morning/Afternoon Events buttons in the generated content
        this.wireUpExistingButtons();
        
        // Initialize any additional functionality (like category filters)
        this.initializeAfternoonFeatures();
        
        this.debugLog("Afternoon view loaded successfully");
      } catch (error) {
        this.afternoonContainer.innerHTML = `
          <div class="friday-saturday-widget-error">
            Failed to load afternoon schedule: ${error.message}
          </div>
        `;
        throw error;
      }
    }

    initializeMorningFeatures() {
      // Initialize category filter for morning view
      if (window.MorningCategoryDropdownController) {
        const filterController = new window.MorningCategoryDropdownController(this.morningContainer);
        filterController.initialize();
      }
    }

    initializeAfternoonFeatures() {
      // Initialize category filter for afternoon view
      if (window.AfternoonCategoryDropdownController) {
        const filterController = new window.AfternoonCategoryDropdownController(this.afternoonContainer);
        filterController.initialize();
      }
    }

    updateExistingButtonStates() {
      // Update existing Morning Events buttons to show active state
      const morningButtons = this.container.querySelectorAll('.nzgdc-morning-events-button');
      const afternoonButtons = this.container.querySelectorAll('.nzgdc-afternoon-events-button');
      
      morningButtons.forEach(button => {
        if (this.currentView === 'morning') {
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');
          // Add visual indicator for active state if needed
          button.style.opacity = '1';
        } else {
          button.classList.remove('active');
          button.setAttribute('aria-pressed', 'false');
          button.style.opacity = '0.7';
        }
      });

      afternoonButtons.forEach(button => {
        if (this.currentView === 'afternoon') {
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');
          // Add visual indicator for active state if needed
          button.style.opacity = '1';
        } else {
          button.classList.remove('active');
          button.setAttribute('aria-pressed', 'false');
          button.style.opacity = '0.7';
        }
      });
    }

    showError(message) {
      if (this.container) {
        this.container.innerHTML = `
          <div class="friday-saturday-widget-error">
            <strong>Error:</strong> ${message}
          </div>
        `;
      }
    }

    destroy() {
      this.debugLog("Destroying Friday/Saturday widget");

      // Remove event listeners from existing buttons
      const morningButtons = this.container.querySelectorAll('.nzgdc-morning-events-button');
      const afternoonButtons = this.container.querySelectorAll('.nzgdc-afternoon-events-button');
      
      morningButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
      });
      
      afternoonButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
      });

      // Clear container
      if (this.container) {
        this.container.innerHTML = '';
        this.container.className = '';
      }

      // Reset state
      this.initialized = false;
      this.currentView = this.options.defaultView;
      this.morningGenerator = null;
      this.afternoonGenerator = null;

      this.debugLog("Friday/Saturday widget destroyed");
    }

    // Public API methods
    getCurrentView() {
      return this.currentView;
    }

    async switchToMorning() {
      return this.switchToView('morning');
    }

    async switchToAfternoon() {
      return this.switchToView('afternoon');
    }

    isInitialized() {
      return this.initialized;
    }
  }

  // Export to global scope
  window.FridaySaturdayWidgetCore = FridaySaturdayWidgetCore;

})(window, document);
```

**Validation Steps:**
1. Test widget initialization with both morning and afternoon views
2. Verify existing button wiring works for view switching
3. Confirm event generators are properly integrated and buttons are wired after content loads
4. Test error handling for missing dependencies
5. Validate accessibility features (keyboard navigation, ARIA attributes on existing buttons)
6. Ensure existing Morning/Afternoon Events buttons function correctly for navigation

---

## STEP 4: UPDATE widget-demo.html INTEGRATION

### Modifications to: `.widget-tests/widget-demo.html`

**Replace the existing toggle functionality with unified widget logic:**

```javascript
// Replace existing widget creation functions
async function createFridaySaturdayWidget() {
    try {
        updateStatus("Creating Friday/Saturday Schedule Widget...");
        
        // Clear existing widgets first
        clearWidget();
        
        // Create unified Friday/Saturday widget
        currentFridaySaturdayWidget = await window.createFridaySaturdayWidget('friday-saturday-container', {
            enableDebug: debugEnabled,
            defaultView: 'morning'
        });
        
        fridaySaturdayWidgetLoaded = true;
        currentWidgetType = 'friday-saturday';
        
        updateStatus("Friday/Saturday Schedule Widget loaded successfully!", "success");
        updateButtonStates();
        updateBackgroundMessage();
        
        return currentFridaySaturdayWidget;
    } catch (error) {
        console.error("Error creating Friday/Saturday widget:", error);
        updateStatus(`Failed to create Friday/Saturday widget: ${error.message}`, "error");
        throw error;
    }
}

// Update toggle function
async function toggleWidget() {
    try {
        if (currentWidgetType === null || currentWidgetType === 'friday-saturday') {
            // Show Thursday widget
            await showThursdayWidget();
        } else if (currentWidgetType === 'thursday') {
            // Show Friday/Saturday widget (unified)
            await showFridaySaturdayWidget();
        }
    } catch (error) {
        console.error("Error toggling widget:", error);
        updateStatus(`Toggle error: ${error.message}`, "error");
    }
}

// Update show function
async function showFridaySaturdayWidget() {
    try {
        updateStatus("Loading Friday/Saturday Schedule Widget...");
        
        // Hide Thursday container
        document.getElementById('thursday-container').style.display = 'none';
        
        // Show Friday/Saturday container
        document.getElementById('friday-saturday-container').style.display = 'block';
        
        // Create widget if not already created
        if (!fridaySaturdayWidgetLoaded) {
            await createFridaySaturdayWidget();
        }
        
        currentWidgetType = 'friday-saturday';
        updateButtonStates();
        updateBackgroundMessage();
        
        updateStatus("Friday/Saturday Schedule Widget displayed successfully!", "success");
    } catch (error) {
        console.error("Error showing Friday/Saturday widget:", error);
        updateStatus(`Failed to show Friday/Saturday widget: ${error.message}`, "error");
    }
}
```

**Update HTML structure:**

```html
<!-- Replace morning and afternoon containers with unified container -->
<div class="widget-section friday-saturday-section" id="friday-saturday-container">
    <h2>Friday & Saturday Schedule</h2>
    <!-- Unified widget content will be inserted here -->
</div>
```

**Update button labels and instructions:**

```html
<!-- Update toggle button text logic -->
<button id="toggleBtn" onclick="toggleWidget()">Show Thursday Schedule</button>

<!-- Update instructions -->
<p>This demo allows you to toggle between two schedule designs:</p>
<ul>
    <li><strong>Thursday Schedule:</strong> Workshop schedule with 10 events across morning and afternoon time slots</li>
    <li><strong>Friday/Saturday Schedule:</strong> Unified event schedule with Morning Events and Afternoon Events tabs</li>
</ul>

<div class="instructions">
    <p><strong>How to use:</strong></p>
    <ul>
        <li>Use the <strong>toggle button</strong> to switch between Thursday and Friday/Saturday schedules</li>
        <li>In Friday/Saturday view, use the <strong>Morning Events</strong> and <strong>Afternoon Events</strong> tabs to switch views</li>
        <li>Only one schedule is visible at a time</li>
        <li>Use the other controls to test, clear, or destroy the current schedule widget</li>
    </ul>
</div>
```

**Validation Steps:**
1. Test widget-demo.html loads without errors
2. Verify toggle button switches between Thursday and Friday/Saturday
3. Confirm tab switching works within Friday/Saturday widget
4. Test all existing functionality (clear, destroy, test buttons)
5. Validate debug mode works correctly

---

## STEP 5: COMPREHENSIVE TESTING PROTOCOL

### Pre-Implementation Testing
```bash
# 1. Document current behavior
npm run test:current-state

# 2. Take UI screenshots
npm run screenshot:baseline

# 3. Performance baseline
npm run perf:baseline
```

### During Implementation Testing
```bash
# After each step, run:
npm run test:step-validation

# CSS validation
npm run css:validate

# JavaScript lint check
npm run js:lint
```

### Post-Implementation Validation
```bash
# Full regression test
npm run test:regression

# UI comparison test
npm run test:ui-comparison

# Performance comparison
npm run test:performance

# Cross-browser test
npm run test:browsers
```

### Manual Testing Checklist
- [ ] **Visual Verification**: All UI elements appear identical to original
- [ ] **Tab Functionality**: Morning/Afternoon tabs switch correctly
- [ ] **Default State**: Widget loads with Morning Events visible by default
- [ ] **Category Filter**: Dropdown works in both Morning and Afternoon views
- [ ] **Thursday Toggle**: Thursday schedule integration unchanged
- [ ] **Responsive Design**: Mobile layout works correctly
- [ ] **Accessibility**: Keyboard navigation and screen readers work
- [ ] **Error Handling**: Graceful error messages display correctly
- [ ] **Debug Mode**: All debugging features function correctly
- [ ] **Performance**: No noticeable loading delays

---

## STEP 6: DEPLOYMENT AND CLEANUP

### File Deprecation
```bash
# Move old files to deprecated folder
mkdir -p deprecated/
mv nzgdc-morning-schedule-widget-modular.js deprecated/
mv nzgdc-afternoon-schedule-widget-modular.js deprecated/
mv css/morning-schedule-bundle.css deprecated/
mv css/afternoon-schedule-bundle.css deprecated/
mv js/morning-widget-core.js deprecated/
mv js/afternoon-widget-core.js deprecated/
```

### Documentation Updates
1. Update README.md with new unified widget usage
2. Update API documentation
3. Create migration guide for existing implementations
4. Update deployment documentation

### Production Validation
1. Test in production-like environment
2. Validate CDN delivery works correctly
3. Test browser caching behavior
4. Confirm no broken references to old files

---

## 🚨 CRITICAL SUCCESS CRITERIA

### Must Pass All These Tests:
- [ ] **Pixel Perfect UI**: All visual elements match original exactly
- [ ] **Zero Functionality Loss**: Every existing feature works identically
- [ ] **Performance Maintained**: No regression in load times or responsiveness
- [ ] **Cross-browser Compatibility**: Works on all supported browsers
- [ ] **Accessibility Compliance**: Meets all accessibility requirements
- [ ] **Debug Mode Preservation**: All debugging capabilities intact
- [ ] **Error Handling**: Graceful handling of all error scenarios

### Automatic Failure Conditions:
- Any visible UI changes from original implementation
- Any missing or broken functionality
- Performance regression > 10%
- JavaScript errors in browser console
- CSS architecture violations
- Accessibility regression

---

## 🔧 ROLLBACK PROCEDURES

### If Critical Issues Found:
1. **Immediate Response**: Stop deployment, activate rollback
2. **File Restoration**: Restore all original files from deprecated/ folder
3. **Cache Clearing**: Clear all CDN and browser caches
4. **Validation**: Test original functionality works correctly
5. **Root Cause Analysis**: Identify and document failure cause
6. **Fix and Retest**: Address issues before retry

### Emergency Commands:
```bash
# Quick rollback
./scripts/emergency-rollback.sh

# Restore specific files
cp deprecated/nzgdc-morning-schedule-widget-modular.js ./
cp deprecated/nzgdc-afternoon-schedule-widget-modular.js ./

# Clear caches
./scripts/clear-all-caches.sh
```

---

## 🎉 COMPLETION VERIFICATION

### Final Checklist:
- [ ] All new files created and functional
- [ ] All old files properly deprecated
- [ ] widget-demo.html updated and tested
- [ ] No CSS architecture violations
- [ ] No JavaScript errors
- [ ] All UI elements verified identical
- [ ] All functionality verified working  
- [ ] Cross-browser testing passed
- [ ] Performance testing passed
- [ ] Documentation updated
- [ ] Rollback procedures tested

**Only mark complete when ALL criteria are met and verified by independent testing.**