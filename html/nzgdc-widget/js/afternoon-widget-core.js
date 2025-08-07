// NZGDC Afternoon Schedule Widget - Main Widget Class

class NZGDCAfternoonScheduleWidget {
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
      showTimeNavigation: true,
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

    this.init();
  }

  generateUniqueId() {
    return (
      "nzgdc-afternoon-" +
      Date.now().toString(36) +
      Math.random().toString(36).substr(2)
    );
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Afternoon Widget Core]", ...args);
    }
  }

  init() {
    if (this.initialized) return;

    try {
      this.debug(
        "Initializing NZGDC Friday & Saturday Afternoon Schedule Widget...",
      );

      // Validate dependencies before initialization
      if (!this.validateDependencies()) {
        throw new Error("Required afternoon schedule dependencies not loaded");
      }

      this.render();
      this.initializeSchedule();

      this.initialized = true;
      this.debug("Afternoon widget initialization completed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Failed to initialize widget:",
        error,
      );
      this.showInitializationError(error);
    }
  }

  validateDependencies() {
    const missing = [];

    if (typeof window.AFTERNOON_SCHEDULE_DATA === "undefined") {
      missing.push("AFTERNOON_SCHEDULE_DATA");
    }
    if (typeof window.AFTERNOON_EVENTS === "undefined") {
      missing.push("AFTERNOON_EVENTS");
    }
    if (typeof window.UnifiedEventLoader === "undefined") {
      missing.push("UnifiedEventLoader");
    }
    if (typeof window.AfternoonScheduleGenerator === "undefined") {
      missing.push("AfternoonScheduleGenerator");
    }

    if (missing.length > 0) {
      console.error("[NZGDC Afternoon Widget] Missing dependencies:", missing);
      return false;
    }

    this.debug("All afternoon widget dependencies validated successfully");
    return true;
  }

  render() {
    this.element.className = "nzgdc-afternoon-schedule-widget";
    this.element.innerHTML = `
      ${this.options.showTimeNavigation || this.options.showFilters ? this.renderNavigation() : ""}
      <div id="afternoon-schedule-content-${this.uniqueId}"></div>
      ${this.options.showFooter ? this.renderFooter() : ""}
    `;
  }

  renderNavigation() {
    return `
      <div class="nzgdc-afternoon-schedule-sub-navigation">
        ${this.options.showTimeNavigation ? this.renderTimeNavigationButtons() : ""}
        ${this.options.showFilters ? this.renderFiltersInline() : ""}
      </div>
    `;
  }

  renderTimeNavigationButtons() {
    return `
      <div class="nzgdc-schedule-time-navigation">
        <button class="nzgdc-morning-events-button" data-nav="morning">
          Morning Events
        </button>
        <button class="nzgdc-afternoon-events-button" data-nav="afternoon">
          Afternoon Events
        </button>
      </div>
    `;
  }

  renderFiltersInline() {
    return `
      <div class="nzgdc-afternoon-filters-section">
        <div class="nzgdc-afternoon-filters-label">
          <span class="nzgdc-afternoon-filters-label-text">Filters:</span>
        </div>
        <div class="nzgdc-afternoon-filters-value">
          <span class="nzgdc-afternoon-filters-value-text">NONE ▶</span>
        </div>
      </div>
    `;
  }

  renderFooter() {
    return `
      <div class="nzgdc-afternoon-schedule-footer-navigation">
        <button class="nzgdc-afternoon-back-to-top">
          BACK TO TOP
        </button>
      </div>
    `;
  }

  async initializeSchedule() {
    try {
      const scheduleContainer = document.getElementById(
        `afternoon-schedule-content-${this.uniqueId}`,
      );
      if (!scheduleContainer) {
        throw new Error("Afternoon schedule container not found");
      }

      // Ensure data is loaded
      if (!window.AFTERNOON_SCHEDULE_DATA) {
        throw new Error("Afternoon schedule data not found");
      }

      this.scheduleGenerator = new AfternoonScheduleGenerator(
        scheduleContainer,
      );
      await this.scheduleGenerator.renderSchedule(
        window.AFTERNOON_SCHEDULE_DATA,
      );

      // Add event handlers
      this.addEventHandlers();

      this.debug("Afternoon schedule initialization completed");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Failed to initialize schedule:",
        error,
      );
      this.showInitializationError(error);
    }
  }

  addEventHandlers() {
    // Add back-to-top click handler
    const backToTopBtn = this.element.querySelector(
      ".nzgdc-afternoon-back-to-top",
    );
    if (backToTopBtn) {
      const handler = (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      backToTopBtn.addEventListener("click", handler, {
        signal: this.abortController.signal,
      });

      this.eventListeners.set(backToTopBtn, {
        type: "click",
        handler: handler,
      });
    }

    // Add navigation button handlers
    const morningBtn = this.element.querySelector(
      ".nzgdc-morning-events-button",
    );
    const afternoonBtn = this.element.querySelector(
      ".nzgdc-afternoon-events-button",
    );

    if (morningBtn) {
      const handler = (event) => {
        event.preventDefault();
        this.debug("Morning events button clicked");
        // Could emit custom event for navigation
        this.element.dispatchEvent(
          new CustomEvent("afternoonNavigate", {
            detail: { target: "morning" },
          }),
        );
      };

      morningBtn.addEventListener("click", handler, {
        signal: this.abortController.signal,
      });

      this.eventListeners.set(morningBtn, {
        type: "click",
        handler: handler,
      });
    }

    if (afternoonBtn) {
      const handler = (event) => {
        event.preventDefault();
        this.debug("Afternoon events button clicked");
        // Could emit custom event for navigation
        this.element.dispatchEvent(
          new CustomEvent("afternoonNavigate", {
            detail: { target: "afternoon" },
          }),
        );
      };

      afternoonBtn.addEventListener("click", handler, {
        signal: this.abortController.signal,
      });

      this.eventListeners.set(afternoonBtn, {
        type: "click",
        handler: handler,
      });
    }
  }

  // Public API methods
  scrollToTimeSlot(timeSlotId) {
    const timeSlot = this.element.querySelector(
      `[data-time-slot="${timeSlotId}"]`,
    );
    if (timeSlot) {
      timeSlot.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    return false;
  }

  scrollToEvent(eventId) {
    const event = this.element.querySelector(`[data-event-id="${eventId}"]`);
    if (event) {
      event.scrollIntoView({ behavior: "smooth", block: "center" });
      return true;
    }
    return false;
  }

  getEventData(eventId) {
    return window.AFTERNOON_EVENTS ? window.AFTERNOON_EVENTS[eventId] : null;
  }

  getAllEvents() {
    return window.AFTERNOON_EVENTS || {};
  }

  getScheduleData() {
    return window.AFTERNOON_SCHEDULE_DATA || {};
  }

  destroy() {
    this.debug("Destroying NZGDC Afternoon Schedule Widget...");

    try {
      // Cancel any pending requests
      this.abortController.abort();

      // Clean up event listeners (most should be auto-removed by AbortController)
      this.eventListeners.forEach((listenerInfo, element) => {
        try {
          element.removeEventListener(listenerInfo.type, listenerInfo.handler);
        } catch (error) {
          console.warn(
            "[NZGDC Afternoon Widget] Error removing event listener:",
            error,
          );
        }
      });
      this.eventListeners.clear();

      // Disconnect any observers
      this.observers.forEach((observer) => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn(
            "[NZGDC Afternoon Widget] Error disconnecting observer:",
            error,
          );
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

      this.debug("Afternoon widget destroyed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Error during widget destruction:",
        error,
      );
    }
  }

  isDestroyed() {
    return !this.initialized || this.abortController.signal.aborted;
  }

  showInitializationError(error) {
    this.element.innerHTML = `
      <div class="nzgdc-afternoon-error-placeholder" style="width: 100%; height: 300px; max-width: none;">
        <strong>Failed to initialize afternoon schedule widget</strong>
        <small>${error.message}</small>
        <small>Please check console for details</small>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">Refresh Page</button>
      </div>
    `;
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = NZGDCAfternoonScheduleWidget;
} else if (typeof window !== "undefined") {
  window.NZGDCAfternoonScheduleWidget = NZGDCAfternoonScheduleWidget;
  window.NZGDCAfternoonSchedule = NZGDCAfternoonScheduleWidget; // Alias for easier access
}
