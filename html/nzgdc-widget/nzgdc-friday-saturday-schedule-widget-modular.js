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

        // Load CSS files in correct order (CRITICAL: unified-event-panel.css FIRST)
        await Promise.all([
          this.loadCSS("css/unified-event-panel.css"),
          this.loadCSS("css/category-filter-overlay.css"),
          this.loadCSS("css/expanded-event-details-overlay.css"),
          this.loadCSS("css/friday-saturday-schedule-bundle.css"),
        ]);
        this.cssLoaded = true;

        // Load JavaScript modules
        await Promise.all([
          this.loadJS("js/expanded-event-details-manager.js"),
          this.loadJS("js/unified-event-loader.js"),
          this.loadJS("js/friday-saturday-widget-core.js"),
          this.loadJS("js/morning-schedule-generator.js"),
          this.loadJS("js/afternoon-schedule-generator.js"),
          this.loadJS("js/morning-schedule-data.js"),
          this.loadJS("js/afternoon-schedule-data.js"),
          this.loadJS("js/morning-events.js"),
          this.loadJS("js/afternoon-events.js"),
        ]);
        this.jsLoaded = true;

        // Load unified template
        await this.loadTemplate("templates/unified-event-panel.html");
        this.templateLoaded = true;

        debugLog("Friday/Saturday widget modules loaded successfully");
        widgetReady = true;

        // Execute ready callbacks
        readyCallbacks.forEach((callback) => callback());
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
      try {
        const fullPath = WIDGET_BASE_PATH + path;
        debugLog("Loading unified template:", fullPath);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, REQUEST_TIMEOUT);

        const response = await fetch(fullPath, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const html = await response.text();
        debugLog("External unified template loaded successfully");

        // Store template globally for the unified widget system
        window.UNIFIED_EVENT_PANEL_TEMPLATE = html;

        return true;
      } catch (error) {
        if (error.name === "AbortError") {
          debugLog("Unified template loading timeout, using fallback");
        } else {
          debugLog(
            "Unified template loading failed, using fallback:",
            error.message,
          );
        }

        // Embedded unified template fallback (minified for production)
        window.UNIFIED_EVENT_PANEL_TEMPLATE =
          '<div class="nzgdc-event-panel-big"><div class="nzgdc-event-panel-big-thumbnail"><div class="nzgdc-session-thumbnail-big"></div><div class="nzgdc-event-detail-overlay-big"><div class="nzgdc-call-to-action-big"><div class="nzgdc-open-marker-big"></div><div class="nzgdc-cta-text-big">Click for More Event Details</div></div></div></div><div class="nzgdc-event-panel-big-details"><div class="nzgdc-event-category-big"><div class="nzgdc-category-text-big"></div></div><div class="nzgdc-event-title-big"><div class="nzgdc-title-text-big"></div></div><div class="nzgdc-event-speaker-details-big"><div class="nzgdc-introduction-text-big">NZGDC 2025 Event by</div><div class="nzgdc-speaker-details-big"><div class="nzgdc-speaker-biolines-big"><div class="nzgdc-speaker-bioName-big"></div><div class="nzgdc-speaker-bioPosition-big"></div></div><div class="nzgdc-speaker-biolines-big"><div class="nzgdc-speaker-bioName-big"></div><div class="nzgdc-speaker-bioPosition-big"></div></div><div class="nzgdc-speaker-biolines-big"><div class="nzgdc-speaker-bioName-big"></div><div class="nzgdc-speaker-bioPosition-big"></div></div></div><div class="nzgdc-timeframe-big"><div class="nzgdc-timeframe-text-big"></div></div></div></div></div>';
        return true;
      }
    }
  }

  // Widget creation function
  async function createFridaySaturdayWidget(containerId, options = {}) {
    // Validate parameters
    if (!containerId || typeof containerId !== "string") {
      throw new Error(
        `Invalid containerId: "${containerId}" (expected non-empty string)`,
      );
    }

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

    activeFridaySaturdayWidgets.forEach((widget) => {
      if (widget && typeof widget.destroy === "function") {
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

  // Public API for unified widget
  const FridaySaturdayWidgetAPI = {
    ready: function (callback) {
      if (widgetReady) {
        callback();
      } else {
        readyCallbacks.push(callback);
      }
    },

    isReady: function () {
      return widgetReady;
    },

    create: function (elementId, options = {}) {
      return createFridaySaturdayWidget(elementId, options);
    },

    getDebugInfo: function () {
      return {
        ready: widgetReady,
        config: {
          basePath: WIDGET_BASE_PATH,
          timeout: REQUEST_TIMEOUT,
          debug: DEBUG_MODE,
        },
        instances: {
          active: activeFridaySaturdayWidgets.size,
          list: Array.from(activeFridaySaturdayWidgets).map(
            (w) => w.uniqueId || "unknown",
          ),
        },
        modules: {
          morningScheduleData:
            typeof window.MORNING_SCHEDULE_DATA !== "undefined",
          afternoonScheduleData:
            typeof window.AFTERNOON_SCHEDULE_DATA !== "undefined",
          morningEvents: typeof window.MORNING_EVENTS !== "undefined",
          afternoonEvents: typeof window.AFTERNOON_EVENTS !== "undefined",
          unifiedEventLoader: typeof window.UnifiedEventLoader !== "undefined",
          morningScheduleGenerator:
            typeof window.MorningScheduleGenerator !== "undefined",
          afternoonScheduleGenerator:
            typeof window.AfternoonScheduleGenerator !== "undefined",
          fridaySaturdayWidgetCore:
            typeof window.FridaySaturdayWidgetCore !== "undefined",
        },
      };
    },

    destroyAll: function () {
      destroyAllFridaySaturdayWidgets();
    },

    getActiveWidgets: function () {
      return Array.from(activeFridaySaturdayWidgets);
    },
  };

  // Initialize loader
  const loader = new NZGDCFridaySaturdayWidgetLoader();

  // Auto-load when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loader.loadWidget();
    });
  } else {
    // DOM already ready, load immediately
    setTimeout(() => loader.loadWidget(), 0);
  }

  // Export to global scope
  window.createFridaySaturdayWidget = createFridaySaturdayWidget;
  window.destroyAllFridaySaturdayWidgets = destroyAllFridaySaturdayWidgets;
  window.onFridaySaturdayWidgetReady = onFridaySaturdayWidgetReady;
  window.NZGDCFridaySaturdayWidget = FridaySaturdayWidgetAPI;

  // Backward compatibility
  window.NZGDCFridaySaturdaySchedule = FridaySaturdayWidgetAPI;

  debugLog("Friday/Saturday Widget Loader initialized");
})(window, document);
