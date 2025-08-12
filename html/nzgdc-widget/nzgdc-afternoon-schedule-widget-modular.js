// NZGDC Afternoon Schedule Widget - Modular Entry Point
// This file loads all the afternoon schedule modular components and initializes the widget

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
      console.log("[NZGDC Afternoon Widget Loader]", message, ...args);
    }
  }

  // Track loading state
  let widgetReady = false;
  const readyCallbacks = [];

  // Track widget instances for cleanup
  const activeAfternoonWidgets = new Set();

  // Main afternoon widget loader class
  class NZGDCAfternoonWidgetLoader {
    constructor() {
      this.cssLoaded = false;
      this.jsLoaded = false;
      this.templateLoaded = false;
    }

    async loadWidget() {
      try {
        debugLog("Starting afternoon widget module loading");
        debugLog("Configuration:", {
          basePath: WIDGET_BASE_PATH,
          timeout: REQUEST_TIMEOUT,
          debug: DEBUG_MODE,
        });

        // Load bundled CSS files
        await Promise.all([
          this.loadCSS("css/unified-event-panel.css"),
          this.loadCSS("css/afternoon-schedule-bundle.css"),
        ]);
        this.cssLoaded = true;
        debugLog("Afternoon CSS bundle loaded successfully");

        // Load data files
        await Promise.all([
          this.loadScript("js/afternoon-schedule-data.js"),
          this.loadScript("js/afternoon-events.js"),
        ]);
        debugLog("Afternoon data modules loaded successfully");

        // Load core JavaScript files
        await Promise.all([
          this.loadScript("js/unified-event-loader.js"),
          this.loadScript("js/afternoon-schedule-generator.js"),
          this.loadScript("js/afternoon-widget-core.js"),
        ]);
        this.jsLoaded = true;
        debugLog("Afternoon JavaScript modules loaded successfully");

        // Load unified HTML template
        await this.loadUnifiedTemplate();
        this.templateLoaded = true;
        debugLog("Afternoon template loaded successfully");

        // Mark as ready
        widgetReady = true;
        debugLog(
          "NZGDC Afternoon Schedule Widget ready - all modules loaded successfully",
        );

        // Auto-initialization is DISABLED - widgets load manually only
        debugLog(
          "Auto-initialization disabled - widgets must be created manually",
        );

        // Execute ready callbacks
        readyCallbacks.forEach((callback) => {
          try {
            callback();
          } catch (error) {
            console.error("Afternoon widget ready callback error:", error);
          }
        });

        return true;
      } catch (error) {
        console.error(
          "[NZGDC Afternoon Widget] Failed to load widget modules:",
          error,
        );
        this.showLoadError(error);
        return false;
      }
    }

    loadCSS(path) {
      return new Promise((resolve, reject) => {
        const fullPath = WIDGET_BASE_PATH + path;
        debugLog("Loading afternoon CSS:", fullPath);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = fullPath;

        // Timeout handling
        const timeoutId = setTimeout(() => {
          debugLog("Afternoon CSS loading timeout:", path);
          reject(
            new Error(
              `Timeout loading afternoon CSS: ${path} (${REQUEST_TIMEOUT}ms)`,
            ),
          );
        }, REQUEST_TIMEOUT);

        link.onload = () => {
          clearTimeout(timeoutId);
          debugLog("Afternoon CSS loaded:", path);
          resolve();
        };
        link.onerror = () => {
          clearTimeout(timeoutId);
          console.error("[NZGDC Afternoon Widget] CSS loading failed:", path);
          reject(new Error(`Failed to load afternoon CSS: ${path}`));
        };
        document.head.appendChild(link);
      });
    }

    loadScript(path) {
      return new Promise((resolve, reject) => {
        const fullPath = WIDGET_BASE_PATH + path;
        debugLog("Loading afternoon script:", fullPath);

        const script = document.createElement("script");
        script.src = fullPath;

        // Timeout handling
        const timeoutId = setTimeout(() => {
          debugLog("Afternoon script loading timeout:", path);
          reject(
            new Error(
              `Timeout loading afternoon script: ${path} (${REQUEST_TIMEOUT}ms)`,
            ),
          );
        }, REQUEST_TIMEOUT);

        script.onload = () => {
          clearTimeout(timeoutId);
          debugLog("Afternoon script loaded:", path);
          resolve();
        };
        script.onerror = () => {
          clearTimeout(timeoutId);
          console.error(
            "[NZGDC Afternoon Widget] Script loading failed:",
            path,
          );
          reject(new Error(`Failed to load afternoon script: ${path}`));
        };
        document.head.appendChild(script);
      });
    }

    async loadUnifiedTemplate() {
      try {
        const templatePath =
          WIDGET_BASE_PATH + "templates/unified-event-panel.html";
        debugLog("Loading unified template:", templatePath);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, REQUEST_TIMEOUT);

        const response = await fetch(templatePath, {
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

    showLoadError(error) {
      const containers = document.querySelectorAll(
        "[data-nzgdc-afternoon-schedule]",
      );
      containers.forEach((container) => {
        container.innerHTML = `
          <div style="
            padding: 40px 20px;
            text-align: center;
            background: #ffe6e6;
            border: 1px solid #ffcccc;
            color: #cc0000;
            font-family: Arial, sans-serif;
          ">
            <h3>Afternoon Widget Loading Error</h3>
            <p>${error.message}</p>
            <small>Please ensure all afternoon widget files are in the correct location</small>
            <br><br>
            <button onclick="location.reload()" style="
              padding: 8px 16px;
              background: #cc0000;
              color: white;
              border: none;
              cursor: pointer;
            ">Refresh Page</button>
          </div>
        `;
      });
    }

    autoInitialize() {
      // Auto-initialization is DISABLED for demo purposes
      // Widgets must be created manually using NZGDCAfternoonWidget.create()
      debugLog(
        "Auto-initialization disabled - use NZGDCAfternoonWidget.create() instead",
      );
    }
  }

  // Public API
  const AfternoonWidgetAPI = {
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
      return new Promise((resolve, reject) => {
        debugLog("Creating afternoon widget for element:", elementId);

        // Add timeout for widget creation
        const timeoutId = setTimeout(() => {
          reject(
            new Error(
              `Afternoon widget creation timeout after ${REQUEST_TIMEOUT}ms`,
            ),
          );
        }, REQUEST_TIMEOUT);

        this.ready(() => {
          try {
            clearTimeout(timeoutId);

            if (!window.NZGDCAfternoonScheduleWidget) {
              throw new Error(
                "NZGDCAfternoonScheduleWidget class not found - afternoon widget core module failed to load",
              );
            }

            const widget = new window.NZGDCAfternoonScheduleWidget(
              elementId,
              options,
            );
            activeAfternoonWidgets.add(widget);

            // Add destroy wrapper to track cleanup
            const originalDestroy = widget.destroy.bind(widget);
            widget.destroy = function () {
              activeAfternoonWidgets.delete(this);
              return originalDestroy();
            };

            debugLog("Afternoon widget created successfully");
            resolve(widget);
          } catch (error) {
            clearTimeout(timeoutId);
            console.error(
              "[NZGDC Afternoon Widget] Widget creation failed:",
              error,
            );
            reject(error);
          }
        });
      });
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
          active: activeAfternoonWidgets.size,
          list: Array.from(activeAfternoonWidgets).map(
            (w) => w.uniqueId || "unknown",
          ),
        },
        modules: {
          afternoonScheduleData:
            typeof window.AFTERNOON_SCHEDULE_DATA !== "undefined",
          afternoonEvents: typeof window.AFTERNOON_EVENTS !== "undefined",
          unifiedEventLoader: typeof window.UnifiedEventLoader !== "undefined",
          afternoonScheduleGenerator:
            typeof window.AfternoonScheduleGenerator !== "undefined",
          afternoonWidgetCore:
            typeof window.NZGDCAfternoonScheduleWidget !== "undefined",
        },
      };
    },

    destroyAll: function () {
      debugLog(
        "Destroying",
        activeAfternoonWidgets.size,
        "active afternoon widgets",
      );
      const widgets = Array.from(activeAfternoonWidgets);
      widgets.forEach((widget) => {
        try {
          if (typeof widget.destroy === "function") {
            widget.destroy();
          }
        } catch (error) {
          console.error(
            "[NZGDC Afternoon Widget] Error destroying widget:",
            error,
          );
        }
      });
      activeAfternoonWidgets.clear();
      debugLog("All afternoon widgets destroyed successfully");
    },

    getActiveWidgets: function () {
      return Array.from(activeAfternoonWidgets);
    },
  };

  // Initialize loader
  const loader = new NZGDCAfternoonWidgetLoader();

  // Auto-load when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loader.loadWidget();
    });
  } else {
    // DOM already ready, load immediately
    setTimeout(() => loader.loadWidget(), 0);
  }

  // Expose API globally
  window.NZGDCAfternoonWidget = AfternoonWidgetAPI;

  // Backward compatibility
  window.NZGDCAfternoonSchedule = AfternoonWidgetAPI;

  debugLog("NZGDC Afternoon Schedule Widget loader initialized");
})(window, document);
