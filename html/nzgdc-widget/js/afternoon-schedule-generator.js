// NZGDC Afternoon Schedule Widget - Afternoon Schedule Generator

class AfternoonScheduleGenerator {
  constructor(container) {
    this.container = container;
    this.eventLoader = new UnifiedEventLoader();
    this.loadedEvents = new Set(); // Track loaded events for cleanup
    this.isDestroyed = false;
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Afternoon Schedule Generator]", ...args);
    }
  }

  generateTimeSlot(timeSlot) {
    // Handle break blocks differently
    if (timeSlot.type === "break") {
      return this.generateBreakBlock(timeSlot);
    }

    const timeSlotEl = document.createElement("div");
    timeSlotEl.className = `nzgdc-afternoon-time-category nzgdc-afternoon-time-category-${timeSlot.theme}`;
    timeSlotEl.setAttribute("data-time-slot", timeSlot.id);

    timeSlotEl.innerHTML = `
      <!-- Event Times Container -->
      <div class="nzgdc-afternoon-event-times-${timeSlot.theme}">
        <div class="nzgdc-afternoon-session-schedule">
          <div class="nzgdc-afternoon-session-times">${timeSlot.timeRange}</div>
          <div class="nzgdc-afternoon-session-title">${timeSlot.title}</div>
        </div>
        <div class="nzgdc-afternoon-underline"></div>
      </div>

      <!-- Scheduled Afternoon Events -->
      <div class="nzgdc-scheduled-afternoon-events">
        ${this.generateEventRows(timeSlot.events)}
      </div>
    `;

    return timeSlotEl;
  }

  generateBreakBlock(breakSlot) {
    const breakEl = document.createElement("div");
    breakEl.className = "nzgdc-break-schedule";
    breakEl.setAttribute("data-break-slot", breakSlot.id);

    breakEl.innerHTML = `
      <h2>${breakSlot.title}</h2>
      <p>${breakSlot.timeRange}</p>
    `;

    return breakEl;
  }

  generateEventRows(events) {
    const rows = [];

    // Check if all events are main type for special layout
    const allMainType = events.every((event) => event.type === "main");

    if (allMainType) {
      // All main panels - 5 per row
      for (let i = 0; i < events.length; i += 5) {
        const eventsInRow = events.slice(i, i + 5);
        const rowHtml = `
          <div class="nzgdc-afternoon-event-row" data-row="${Math.floor(i / 5) + 1}">
            ${eventsInRow.map((event) => this.generateAfternoonEvent(event)).join("")}
          </div>
        `;
        rows.push(rowHtml);
      }
    } else {
      // Mixed layout or all big panels
      // First, handle big panels (2 per row, left-aligned)
      const bigEvents = events.filter((event) => event.type === "big");
      const mainEvents = events.filter((event) => event.type === "main");

      if (bigEvents.length > 0) {
        for (let i = 0; i < bigEvents.length; i += 2) {
          const eventsInRow = bigEvents.slice(i, i + 2);
          const rowHtml = `
            <div class="nzgdc-afternoon-event-row" data-row="big-${Math.floor(i / 2) + 1}">
              ${eventsInRow.map((event) => this.generateAfternoonEvent(event)).join("")}
            </div>
          `;
          rows.push(rowHtml);
        }
      }

      // Then handle main panels (5 per row)
      if (mainEvents.length > 0) {
        for (let i = 0; i < mainEvents.length; i += 5) {
          const eventsInRow = mainEvents.slice(i, i + 5);
          const rowHtml = `
            <div class="nzgdc-afternoon-event-row" data-row="main-${Math.floor(i / 5) + 1}">
              ${eventsInRow.map((event) => this.generateAfternoonEvent(event)).join("")}
            </div>
          `;
          rows.push(rowHtml);
        }
      }
    }

    return rows.join("");
  }

  generateAfternoonEvent(event) {
    const eventType = event.type || "big";
    const containerClass =
      eventType === "main"
        ? "nzgdc-afternoon-event-main"
        : "nzgdc-afternoon-event";
    const panelContainerClass =
      eventType === "main"
        ? "nzgdc-afternoon-event-panel-main-container"
        : "nzgdc-afternoon-event-panel-container";

    return `
      <div class="${containerClass}">
        <div class="${panelContainerClass}"
             data-event-id="${event.id}"
             data-event-type="${eventType}"
             data-category="${event.category}"
             data-title="${event.title}">
          <div class="nzgdc-afternoon-loading-placeholder">Loading ${event.title}...</div>
        </div>
      </div>
    `;
  }

  async renderSchedule(data) {
    try {
      if (this.isDestroyed) {
        console.warn(
          "Cannot render afternoon schedule - generator is destroyed",
        );
        return;
      }

      this.debug(
        "Starting afternoon schedule rendering with",
        data.timeSlots.length,
        "time slots",
      );

      // Clear existing content and tracking
      this.container.innerHTML = "";
      this.loadedEvents.clear();

      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();

      // Generate time slots in fragment first
      data.timeSlots.forEach((timeSlot) => {
        const timeSlotEl = this.generateTimeSlot(timeSlot);
        fragment.appendChild(timeSlotEl);
      });

      // Single DOM update
      this.container.appendChild(fragment);

      // Load event content after DOM is stable
      requestAnimationFrame(() => {
        if (!this.isDestroyed) {
          this.loadEventContent();
        }
      });

      this.debug("Afternoon schedule rendering completed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Failed to render schedule:",
        error,
      );
      this.showScheduleError(error);
    }
  }

  async loadEventContent() {
    try {
      if (this.isDestroyed) {
        console.warn(
          "[NZGDC Afternoon Widget] Cannot load event content - generator is destroyed",
        );
        return;
      }

      // Load the template once
      await this.eventLoader.loadTemplate();

      // Find all event containers
      const containers = this.container.querySelectorAll(
        ".nzgdc-afternoon-event-panel-container[data-event-id], .nzgdc-afternoon-event-panel-main-container[data-event-id]",
      );
      this.debug(
        "Loading content for",
        containers.length,
        "afternoon event containers",
      );

      // Batch DOM operations for better performance
      const loadPromises = Array.from(containers).map((container) =>
        this.loadSingleEvent(container),
      );

      const results = await Promise.allSettled(loadPromises);

      // Track successful loads
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && !this.isDestroyed) {
          const container = containers[index];
          const eventId = container.dataset.eventId;
          if (eventId) {
            this.loadedEvents.add(eventId);
          }
        }
      });

      this.debug("All afternoon event content loaded successfully");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Failed to load event content:",
        error,
      );
      this.showEventLoadError(error);
    }
  }

  async loadSingleEvent(container) {
    if (this.isDestroyed) {
      return;
    }

    const eventId = container.dataset.eventId;
    const eventType = container.dataset.eventType || "big";
    this.debug("Loading afternoon event:", eventId);

    const eventData = window.AFTERNOON_EVENTS
      ? window.AFTERNOON_EVENTS[eventId]
      : null;

    // Verify event data availability - critical for debugging data issues
    if (!window.AFTERNOON_EVENTS) {
      console.error(
        "[NZGDC Afternoon Widget] AFTERNOON_EVENTS not loaded - check data file loading",
      );
      return;
    }

    try {
      if (!eventData) {
        console.warn(
          `[NZGDC Afternoon Widget] No data found for event: ${eventId} - check afternoon-events.js`,
        );
        throw new Error(`No data found for afternoon event: ${eventId}`);
      }

      this.debug("Creating afternoon event panel for:", eventId);
      const eventPanel = this.eventLoader.createEventPanel(
        eventData,
        eventType,
        "afternoon",
      );

      // Check if still valid before DOM update
      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(eventPanel);
        this.debug("Successfully loaded afternoon event:", eventId);
      }
    } catch (error) {
      console.error(
        `[NZGDC Afternoon Widget] Failed to load event ${eventId}:`,
        error,
      );

      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(this.eventLoader.createErrorPanel(error.message));
      }
    }
  }

  showScheduleError(error) {
    this.container.innerHTML = `
      <div class="nzgdc-afternoon-error-placeholder" style="width: 100%; height: 200px; max-width: none;">
        <strong>Failed to load afternoon schedule</strong>
        <small>${error.message}</small>
        <small>Please check console for details</small>
      </div>
    `;
  }

  showEventLoadError(error) {
    const containers = this.container.querySelectorAll(
      ".nzgdc-afternoon-loading-placeholder",
    );
    containers.forEach((container) => {
      container.className = "nzgdc-afternoon-error-placeholder";
      container.innerHTML = `
        <strong>Failed to load afternoon events</strong>
        <small>${error.message}</small>
      `;
    });
  }

  destroy() {
    this.debug("Destroying AfternoonScheduleGenerator...");

    try {
      // Mark as destroyed to prevent further operations
      this.isDestroyed = true;

      // Clear event tracking
      this.loadedEvents.clear();

      // Destroy event loader if it has cleanup methods
      if (this.eventLoader && typeof this.eventLoader.destroy === "function") {
        this.eventLoader.destroy();
      }
      this.eventLoader = null;

      // Clear container if still exists
      if (this.container && this.container.parentNode) {
        this.container.innerHTML = "";
      }
      this.container = null;

      this.debug("AfternoonScheduleGenerator destroyed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Error destroying AfternoonScheduleGenerator:",
        error,
      );
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AfternoonScheduleGenerator;
} else if (typeof window !== "undefined") {
  window.AfternoonScheduleGenerator = AfternoonScheduleGenerator;
}
