// NZGDC Morning Schedule Widget - Morning Schedule Generator

class MorningScheduleGenerator {
  constructor(container) {
    this.container = container;
    this.eventLoader = new UnifiedEventLoader();
    this.loadedEvents = new Set(); // Track loaded events for cleanup
    this.isDestroyed = false;
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Morning Schedule Generator]", ...args);
    }
  }

  generateTimeSlot(timeSlot) {
    // Handle break blocks differently
    if (timeSlot.type === "break") {
      return this.generateBreakBlock(timeSlot);
    }

    const timeSlotEl = document.createElement("div");
    timeSlotEl.className = `nzgdc-morning-time-category nzgdc-morning-time-category-${timeSlot.theme}`;
    timeSlotEl.setAttribute("data-time-slot", timeSlot.id);

    timeSlotEl.innerHTML = `
      <!-- Event Times Container -->
      <div class="nzgdc-morning-event-times-${timeSlot.theme}">
        <div class="nzgdc-morning-session-schedule">
          <div class="nzgdc-morning-session-times">${timeSlot.timeRange}</div>
          <div class="nzgdc-morning-session-title">${timeSlot.title}</div>
        </div>
        <div class="nzgdc-morning-underline"></div>
      </div>

      <!-- Scheduled Morning Events -->
      <div class="nzgdc-scheduled-morning-events">
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
          <div class="nzgdc-morning-event-row" data-row="${Math.floor(i / 5) + 1}">
            ${eventsInRow.map((event) => this.generateMorningEvent(event)).join("")}
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
            <div class="nzgdc-morning-event-row" data-row="big-${Math.floor(i / 2) + 1}">
              ${eventsInRow.map((event) => this.generateMorningEvent(event)).join("")}
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
            <div class="nzgdc-morning-event-row" data-row="main-${Math.floor(i / 5) + 1}">
              ${eventsInRow.map((event) => this.generateMorningEvent(event)).join("")}
            </div>
          `;
          rows.push(rowHtml);
        }
      }
    }

    return rows.join("");
  }

  generateMorningEvent(event) {
    const eventType = event.type || "big";
    const containerClass =
      eventType === "main" ? "nzgdc-morning-event-main" : "nzgdc-morning-event";
    const panelContainerClass =
      eventType === "main"
        ? "nzgdc-morning-event-panel-main-container"
        : "nzgdc-morning-event-panel-container";

    return `
      <div class="${containerClass}">
        <div class="${panelContainerClass}"
             data-event-id="${event.id}"
             data-event-type="${eventType}"
             data-category="${event.category}"
             data-title="${event.title}">
          <div class="nzgdc-morning-loading-placeholder">Loading ${event.title}...</div>
        </div>
      </div>
    `;
  }

  async renderSchedule(data) {
    try {
      if (this.isDestroyed) {
        console.warn("Cannot render morning schedule - generator is destroyed");
        return;
      }

      this.debug(
        "Starting morning schedule rendering with",
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

      this.debug("Morning schedule rendering completed successfully");
    } catch (error) {
      console.error("[NZGDC Morning Widget] Failed to render schedule:", error);
      this.showScheduleError(error);
    }
  }

  async loadEventContent() {
    try {
      if (this.isDestroyed) {
        console.warn(
          "[NZGDC Morning Widget] Cannot load event content - generator is destroyed",
        );
        return;
      }

      // Load the template once
      await this.eventLoader.loadTemplate();

      // Find all event containers
      const containers = this.container.querySelectorAll(
        ".nzgdc-morning-event-panel-container[data-event-id], .nzgdc-morning-event-panel-main-container[data-event-id]",
      );
      this.debug(
        "Loading content for",
        containers.length,
        "morning event containers",
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

      this.debug("All morning event content loaded successfully");
    } catch (error) {
      console.error(
        "[NZGDC Morning Widget] Failed to load event content:",
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
    this.debug("Loading morning event:", eventId);

    const eventData = window.MORNING_EVENTS
      ? window.MORNING_EVENTS[eventId]
      : null;

    // Verify event data availability - critical for debugging data issues
    if (!window.MORNING_EVENTS) {
      console.error(
        "[NZGDC Morning Widget] MORNING_EVENTS not loaded - check data file loading",
      );
      return;
    }

    try {
      if (!eventData) {
        console.warn(
          `[NZGDC Morning Widget] No data found for event: ${eventId} - check morning-events.js`,
        );
        throw new Error(`No data found for morning event: ${eventId}`);
      }

      this.debug("Creating morning event panel for:", eventId);
      const eventPanel = this.eventLoader.createEventPanel(
        eventData,
        eventType,
        "morning",
      );

      // Check if still valid before DOM update
      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(eventPanel);
        this.debug("Successfully loaded morning event:", eventId);
      }
    } catch (error) {
      console.error(
        `[NZGDC Morning Widget] Failed to load event ${eventId}:`,
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
      <div class="nzgdc-morning-error-placeholder" style="width: 100%; height: 200px; max-width: none;">
        <strong>Failed to load morning schedule</strong>
        <small>${error.message}</small>
        <small>Please check console for details</small>
      </div>
    `;
  }

  showEventLoadError(error) {
    const containers = this.container.querySelectorAll(
      ".nzgdc-morning-loading-placeholder",
    );
    containers.forEach((container) => {
      container.className = "nzgdc-morning-error-placeholder";
      container.innerHTML = `
        <strong>Failed to load morning events</strong>
        <small>${error.message}</small>
      `;
    });
  }

  destroy() {
    this.debug("Destroying MorningScheduleGenerator...");

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

      this.debug("MorningScheduleGenerator destroyed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Morning Widget] Error destroying MorningScheduleGenerator:",
        error,
      );
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = MorningScheduleGenerator;
} else if (typeof window !== "undefined") {
  window.MorningScheduleGenerator = MorningScheduleGenerator;
}
