// NZGDC Schedule Widget - Main Widget Class

class NZGDCScheduleWidget {
  constructor(elementId, options = {}) {
    this.element =
      typeof elementId === "string"
        ? document.getElementById(elementId)
        : elementId;

    if (!this.element) {
      throw new Error(`Element ${elementId} not found`);
    }

    this.options = {
      showFilters: true,
      showFooter: true,
      theme: "default",
      ...options,
    };

    this.uniqueId = this.generateUniqueId();
    this.initialized = false;

    // Resource tracking for cleanup
    this.eventListeners = new Map();
    this.observers = new Set();
    this.abortController = new AbortController();
    this.scheduleGenerator = null;

    // Debug mode controlled by global NZGDC_DEBUG flag

    this.init();
  }

  generateUniqueId() {
    return (
      "nzgdc-" + Date.now().toString(36) + Math.random().toString(36).substr(2)
    );
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Widget Core]", ...args);
    }
  }

  init() {
    if (this.initialized) return;

    try {
      this.debug("Initializing NZGDC Thursday Schedule Widget...");

      // Validate dependencies before initialization
      if (!this.validateDependencies()) {
        throw new Error("Required dependencies not loaded");
      }

      // CSS is loaded by modular loader, no need to inject here
      this.render();
      this.initializeSchedule();

      this.initialized = true;
      this.debug("Widget initialization completed successfully");
    } catch (error) {
      console.error("[NZGDC Widget] Failed to initialize widget:", error);
      this.showInitializationError(error);
    }
  }

  validateDependencies() {
    const missing = [];

    if (typeof window.SCHEDULE_DATA === "undefined") {
      missing.push("SCHEDULE_DATA");
    }
    if (typeof window.WORKSHOP_EVENTS === "undefined") {
      missing.push("WORKSHOP_EVENTS");
    }
    if (typeof window.UnifiedEventLoader === "undefined") {
      missing.push("UnifiedEventLoader");
    }
    if (typeof window.ScheduleGenerator === "undefined") {
      missing.push("ScheduleGenerator");
    }
    // EVENT_PANEL_TEMPLATE is always available via fallback, no need to validate

    if (missing.length > 0) {
      console.error("[NZGDC Widget] Missing dependencies:", missing);
      return false;
    }

    this.debug("All dependencies validated successfully");
    return true;
  }

  // CSS loading is handled by the modular loader
  // No need for redundant CSS injection here

  render() {
    this.element.className = "nzgdc-schedule-widget";
    this.element.innerHTML = `
            ${this.options.showFilters ? this.renderFilters() : ""}
            <div id="schedule-content-${this.uniqueId}"></div>
            ${this.options.showFooter ? this.renderFooter() : ""}
        `;
  }

  renderFilters() {
    return `
            <div class="nzgdc-schedule-sub-navigation">
                <div class="nzgdc-filters-section">
                    <div class="nzgdc-filters-label">
                        <span class="nzgdc-filters-label-text">Filters:</span>
                    </div>
                    <div class="nzgdc-filters-value">
                        <span class="nzgdc-filters-value-text">NONE ▶</span>
                    </div>
                </div>
            </div>
        `;
  }

  renderFooter() {
    return `
            <div class="nzgdc-schedule-footer-navigation">
                <button class="nzgdc-back-to-top">
                    BACK TO TOP
                </button>
            </div>
        `;
  }

  async initializeSchedule() {
    try {
      const scheduleContainer = document.getElementById(
        `schedule-content-${this.uniqueId}`,
      );
      if (!scheduleContainer) {
        throw new Error("Schedule container not found");
      }

      // Ensure data is loaded
      if (!window.SCHEDULE_DATA) {
        throw new Error("Schedule data not found");
      }

      this.scheduleGenerator = new ScheduleGenerator(scheduleContainer);
      await this.scheduleGenerator.renderSchedule(window.SCHEDULE_DATA);

      // Add back-to-top click handler with cleanup tracking
      this.addBackToTopHandler();

      this.debug("Schedule initialization completed");
    } catch (error) {
      console.error("[NZGDC Widget] Failed to initialize schedule:", error);
      this.showInitializationError(error);
    }
  }

  addBackToTopHandler() {
    const backToTopBtn = this.element.querySelector(".nzgdc-back-to-top");
    if (backToTopBtn) {
      const handler = (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      backToTopBtn.addEventListener("click", handler, {
        signal: this.abortController.signal,
      });

      // Track for manual cleanup if needed
      this.eventListeners.set(backToTopBtn, {
        type: "click",
        handler: handler,
      });
    }
  }

  destroy() {
    this.debug("Destroying NZGDC Schedule Widget...");

    try {
      // Cancel any pending requests
      this.abortController.abort();

      // Clean up event listeners (most should be auto-removed by AbortController)
      this.eventListeners.forEach((listenerInfo, element) => {
        try {
          element.removeEventListener(listenerInfo.type, listenerInfo.handler);
        } catch (error) {
          console.warn("[NZGDC Widget] Error removing event listener:", error);
        }
      });
      this.eventListeners.clear();

      // Disconnect any observers
      this.observers.forEach((observer) => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn("[NZGDC Widget] Error disconnecting observer:", error);
        }
      });
      this.observers.clear();

      // Clean up schedule generator
      if (
        this.scheduleGenerator &&
        typeof this.scheduleGenerator.destroy === "function"
      ) {
        this.scheduleGenerator.destroy();
      }
      this.scheduleGenerator = null;

      // Clear DOM content
      if (this.element) {
        this.element.innerHTML = "";
        this.element.className = "";
      }

      // Mark as destroyed
      this.initialized = false;

      this.debug("Widget destroyed successfully");
    } catch (error) {
      console.error("[NZGDC Widget] Error during widget destruction:", error);
    }
  }

  isDestroyed() {
    return !this.initialized || this.abortController.signal.aborted;
  }

  showInitializationError(error) {
    this.element.innerHTML = `
            <div class="nzgdc-error-placeholder" style="width: 100%; height: 300px; max-width: none;">
                <strong>Failed to initialize schedule widget</strong>
                <small>${error.message}</small>
                <small>Please check console for details</small>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">Refresh Page</button>
            </div>
        `;
  }
}

// Note: Auto-initialization is handled by the modular loader
// to ensure all dependencies are loaded before widget creation

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = NZGDCScheduleWidget;
} else if (typeof window !== "undefined") {
  window.NZGDCScheduleWidget = NZGDCScheduleWidget;
  window.NZGDCSchedule = NZGDCScheduleWidget; // Alias for easier access
}
