// NZGDC Schedule Widget - Modular Entry Point
// This file loads all the modular components and initializes the widget

(function (window, document) {
  "use strict";

  // Configuration
  const WIDGET_BASE_PATH = "";
  const REQUEST_TIMEOUT = 10000; // 10 seconds timeout for all requests

  // Debug mode - enable with window.NZGDC_DEBUG = true or ?debug=true
  const DEBUG_MODE =
    (typeof window !== "undefined" && window.NZGDC_DEBUG === true) ||
    (typeof window !== "undefined" &&
      window.location.search.includes("debug=true"));

  function debugLog(message, ...args) {
    if (DEBUG_MODE) {
      console.log("[NZGDC Widget Loader]", message, ...args);
    }
  }

  // Module loading queue
  const moduleQueue = [];
  let modulesLoaded = 0;
  const totalModules = 5; // CSS bundle + JS + HTML files

  // Track loading state
  let widgetReady = false;
  const readyCallbacks = [];

  // Track widget instances for cleanup
  const activeWidgets = new Set();

  // Main widget loader class
  class NZGDCWidgetLoader {
    constructor() {
      this.cssLoaded = false;
      this.jsLoaded = false;
      this.templateLoaded = false;
    }

    async loadWidget() {
      try {
        debugLog("Starting widget module loading");
        debugLog("Configuration:", {
          basePath: WIDGET_BASE_PATH,
          timeout: REQUEST_TIMEOUT,
          debug: DEBUG_MODE,
        });

        // Load bundled CSS file
        await this.loadCSS("css/widget-bundle.css");
        this.cssLoaded = true;
        debugLog("CSS bundle loaded successfully");

        // Load data files
        await Promise.all([
          this.loadScript("js/schedule-data.js"),
          this.loadScript("js/workshop-events.js"),
        ]);
        debugLog("Data modules loaded successfully");

        // Load core JavaScript files
        await Promise.all([
          this.loadScript("js/workshop-loader.js"),
          this.loadScript("js/schedule-generator.js"),
          this.loadScript("js/widget-core.js"),
        ]);
        this.jsLoaded = true;
        debugLog("JavaScript modules loaded successfully");

        // Load HTML template
        await this.loadTemplate();
        this.templateLoaded = true;
        debugLog("Template loaded successfully");

        // Mark as ready
        widgetReady = true;
        debugLog(
          "NZGDC Schedule Widget ready - all modules loaded successfully",
        );

        // Auto-initialize any existing widgets on the page
        this.autoInitialize();

        // Execute ready callbacks
        readyCallbacks.forEach((callback) => {
          try {
            callback();
          } catch (error) {
            console.error("Ready callback error:", error);
          }
        });

        return true;
      } catch (error) {
        console.error("[NZGDC Widget] Failed to load widget modules:", error);
        this.showLoadError(error);
        return false;
      }
    }

    loadCSS(path) {
      return new Promise((resolve, reject) => {
        const fullPath = WIDGET_BASE_PATH + path;
        debugLog("Loading CSS:", fullPath);

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = fullPath;

        // Timeout handling
        const timeoutId = setTimeout(() => {
          debugLog("CSS loading timeout:", path);
          reject(
            new Error(`Timeout loading CSS: ${path} (${REQUEST_TIMEOUT}ms)`),
          );
        }, REQUEST_TIMEOUT);

        link.onload = () => {
          clearTimeout(timeoutId);
          debugLog("CSS loaded:", path);
          resolve();
        };
        link.onerror = () => {
          clearTimeout(timeoutId);
          console.error("[NZGDC Widget] CSS loading failed:", path);
          reject(new Error(`Failed to load CSS: ${path}`));
        };
        document.head.appendChild(link);
      });
    }

    loadScript(path) {
      return new Promise((resolve, reject) => {
        const fullPath = WIDGET_BASE_PATH + path;
        debugLog("Loading script:", fullPath);

        const script = document.createElement("script");
        script.src = fullPath;

        // Timeout handling
        const timeoutId = setTimeout(() => {
          debugLog("Script loading timeout:", path);
          reject(
            new Error(`Timeout loading script: ${path} (${REQUEST_TIMEOUT}ms)`),
          );
        }, REQUEST_TIMEOUT);

        script.onload = () => {
          clearTimeout(timeoutId);
          debugLog("Script loaded:", path);
          resolve();
        };
        script.onerror = () => {
          clearTimeout(timeoutId);
          console.error("[NZGDC Widget] Script loading failed:", path);
          reject(new Error(`Failed to load script: ${path}`));
        };
        document.head.appendChild(script);
      });
    }

    async loadTemplate() {
      try {
        const templatePath = WIDGET_BASE_PATH + "templates/event-panel.html";
        debugLog("Loading template:", templatePath);

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
        debugLog("External template loaded successfully");

        // Store template globally for the widget to access
        window.EVENT_PANEL_TEMPLATE = html;

        return true;
      } catch (error) {
        if (error.name === "AbortError") {
          debugLog("Template loading timeout, using fallback");
        } else {
          debugLog("Template loading failed, using fallback:", error.message);
        }

        // Embedded template fallback (minified for production)
        window.EVENT_PANEL_TEMPLATE =
          '<div class="nzgdc-event-panel-big"><div class="nzgdc-event-panel-big-thumbnail"><div class="nzgdc-session-thumbnail-big"></div><div class="nzgdc-event-detail-overlay-big"><div class="nzgdc-call-to-action-big"><div class="nzgdc-open-marker-big"></div><div class="nzgdc-cta-text-big">Click for More Event Details</div></div></div></div><div class="nzgdc-event-panel-big-details"><div class="nzgdc-event-category-big"><div class="nzgdc-category-text-big"></div></div><div class="nzgdc-event-title-big"><div class="nzgdc-title-text-big"></div></div><div class="nzgdc-event-speaker-details-big"><div class="nzgdc-introduction-text-big">NZGDC 2025 Workshop by</div><div class="nzgdc-speaker-details-big"><div class="nzgdc-speaker-biolines-big"><div class="nzgdc-speaker-bioName-big"></div><div class="nzgdc-speaker-bioPosition-big"></div></div><div class="nzgdc-speaker-biolines-big"><div class="nzgdc-speaker-bioName-big"></div><div class="nzgdc-speaker-bioPosition-big"></div></div><div class="nzgdc-speaker-biolines-big"><div class="nzgdc-speaker-bioName-big"></div><div class="nzgdc-speaker-bioPosition-big"></div></div></div><div class="nzgdc-timeframe-big"><div class="nzgdc-timeframe-text-big"></div></div></div></div></div>';
        return true;
      }
    }

    showLoadError(error) {
      const containers = document.querySelectorAll("[data-nzgdc-schedule]");
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
                        <h3>Widget Loading Error</h3>
                        <p>${error.message}</p>
                        <small>Please ensure all widget files are in the correct location</small>
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
      const autoElements = document.querySelectorAll("[data-nzgdc-schedule]");

      if (autoElements.length === 0) {
        debugLog("No auto-initialize elements found");
        return;
      }

      debugLog("Auto-initializing", autoElements.length, "widgets");

      autoElements.forEach((el, index) => {
        try {
          debugLog(`Auto-initializing widget ${index + 1}`);
          new window.NZGDCScheduleWidget(el, {
            showFilters: el.dataset.showFilters !== "false",
            showFooter: el.dataset.showFooter !== "false",
            theme: el.dataset.theme || "default",
          });
          debugLog(`Widget ${index + 1} auto-initialized successfully`);
        } catch (error) {
          console.error(
            `[NZGDC Widget] Failed to auto-initialize widget ${index + 1}:`,
            error,
          );
        }
      });
    }
  }

  // Public API
  const WidgetAPI = {
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
        debugLog("Creating widget for element:", elementId);

        // Add timeout for widget creation
        const timeoutId = setTimeout(() => {
          reject(
            new Error(`Widget creation timeout after ${REQUEST_TIMEOUT}ms`),
          );
        }, REQUEST_TIMEOUT);

        this.ready(() => {
          try {
            clearTimeout(timeoutId);

            if (!window.NZGDCScheduleWidget) {
              throw new Error(
                "NZGDCScheduleWidget class not found - widget core module failed to load",
              );
            }

            const widget = new window.NZGDCScheduleWidget(elementId, options);
            activeWidgets.add(widget);

            // Add destroy wrapper to track cleanup
            const originalDestroy = widget.destroy.bind(widget);
            widget.destroy = function () {
              activeWidgets.delete(this);
              return originalDestroy();
            };

            debugLog("Widget created successfully");
            resolve(widget);
          } catch (error) {
            clearTimeout(timeoutId);
            console.error("[NZGDC Widget] Widget creation failed:", error);
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
          active: activeWidgets.size,
          list: Array.from(activeWidgets).map((w) => w.uniqueId || "unknown"),
        },
        modules: {
          scheduleData: typeof window.SCHEDULE_DATA !== "undefined",
          workshopEvents: typeof window.WORKSHOP_EVENTS !== "undefined",
          workshopLoader: typeof window.WorkshopEventLoader !== "undefined",
          scheduleGenerator: typeof window.ScheduleGenerator !== "undefined",
          widgetCore: typeof window.NZGDCScheduleWidget !== "undefined",
        },
      };
    },

    destroyAll: function () {
      debugLog("Destroying", activeWidgets.size, "active widgets");
      const widgets = Array.from(activeWidgets);
      widgets.forEach((widget) => {
        try {
          if (typeof widget.destroy === "function") {
            widget.destroy();
          }
        } catch (error) {
          console.error("[NZGDC Widget] Error destroying widget:", error);
        }
      });
      activeWidgets.clear();
      debugLog("All widgets destroyed successfully");
    },

    getActiveWidgets: function () {
      return Array.from(activeWidgets);
    },
  };

  // Initialize loader
  const loader = new NZGDCWidgetLoader();

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
  window.NZGDCWidget = WidgetAPI;

  // Backward compatibility
  window.NZGDCSchedule = WidgetAPI;

  debugLog("NZGDC Schedule Widget loader initialized");
})(window, document);
