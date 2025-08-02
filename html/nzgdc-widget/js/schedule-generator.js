// NZGDC Schedule Widget - Schedule Generator

class ScheduleGenerator {
  constructor(container) {
    this.container = container;
    this.workshopLoader = new WorkshopEventLoader();
    this.loadedWorkshops = new Set(); // Track loaded workshops for cleanup
    this.isDestroyed = false;
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Schedule Generator]", ...args);
    }
  }

  generateTimeSlot(timeSlot) {
    const timeSlotEl = document.createElement("div");
    timeSlotEl.className = `nzgdc-time-category nzgdc-time-category-${timeSlot.theme}`;
    timeSlotEl.setAttribute("data-time-slot", timeSlot.id);

    timeSlotEl.innerHTML = `
            <!-- Event Times Container -->
            <div class="nzgdc-event-times-${timeSlot.theme}">
                <div class="nzgdc-session-schedule">
                    <div class="nzgdc-session-times">${timeSlot.timeRange}</div>
                    <div class="nzgdc-session-title">${timeSlot.title}</div>
                </div>
                <div class="nzgdc-underline"></div>
            </div>

            <!-- Scheduled Workshops -->
            <div class="nzgdc-scheduled-workshops">
                ${this.generateWorkshopRows(timeSlot.workshops)}
            </div>
        `;

    return timeSlotEl;
  }

  generateWorkshopRows(workshops) {
    const rows = [];
    const workshopsPerRow = 2;

    for (let i = 0; i < workshops.length; i += workshopsPerRow) {
      const workshopsInRow = workshops.slice(i, i + workshopsPerRow);
      const rowHtml = `
                <div class="nzgdc-workshop-row" data-row="${Math.floor(i / workshopsPerRow) + 1}">
                    ${workshopsInRow.map((workshop) => this.generateWorkshopEvent(workshop)).join("")}
                </div>
            `;
      rows.push(rowHtml);
    }

    return rows.join("");
  }

  generateWorkshopEvent(workshop) {
    return `
            <div class="nzgdc-workshop-event">
                <div class="nzgdc-event-panel-container"
                     data-event-id="${workshop.id}"
                     data-category="${workshop.category}"
                     data-title="${workshop.title}">
                    <div class="nzgdc-loading-placeholder">Loading ${workshop.title}...</div>
                </div>
            </div>
        `;
  }

  async renderSchedule(data) {
    try {
      if (this.isDestroyed) {
        console.warn("Cannot render schedule - generator is destroyed");
        return;
      }

      this.debug(
        "Starting schedule rendering with",
        data.timeSlots.length,
        "time slots",
      );

      // Clear existing content and tracking
      this.container.innerHTML = "";
      this.loadedWorkshops.clear();

      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();

      // Generate time slots in fragment first
      data.timeSlots.forEach((timeSlot) => {
        const timeSlotEl = this.generateTimeSlot(timeSlot);
        fragment.appendChild(timeSlotEl);
      });

      // Single DOM update
      this.container.appendChild(fragment);

      // Load workshop content after DOM is stable
      requestAnimationFrame(() => {
        if (!this.isDestroyed) {
          this.loadWorkshopContent();
        }
      });

      this.debug("Schedule rendering completed successfully");
    } catch (error) {
      console.error("[NZGDC Widget] Failed to render schedule:", error);
      this.showScheduleError(error);
    }
  }

  async loadWorkshopContent() {
    try {
      if (this.isDestroyed) {
        console.warn(
          "[NZGDC Widget] Cannot load workshop content - generator is destroyed",
        );
        return;
      }

      // Load the template once
      await this.workshopLoader.loadTemplate();

      // Find all workshop containers
      const containers = this.container.querySelectorAll(
        ".nzgdc-event-panel-container[data-event-id]",
      );
      this.debug(
        "Loading content for",
        containers.length,
        "workshop containers",
      );

      // Batch DOM operations for better performance
      const loadPromises = Array.from(containers).map((container) =>
        this.loadSingleWorkshop(container),
      );

      const results = await Promise.allSettled(loadPromises);

      // Track successful loads
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && !this.isDestroyed) {
          const container = containers[index];
          const eventId = container.dataset.eventId;
          if (eventId) {
            this.loadedWorkshops.add(eventId);
          }
        }
      });

      this.debug("All workshop content loaded successfully");
    } catch (error) {
      console.error("[NZGDC Widget] Failed to load workshop content:", error);
      this.showWorkshopLoadError(error);
    }
  }

  async loadSingleWorkshop(container) {
    if (this.isDestroyed) {
      return;
    }

    const eventId = container.dataset.eventId;
    this.debug("Loading workshop:", eventId);

    const eventData = window.WORKSHOP_EVENTS
      ? window.WORKSHOP_EVENTS[eventId]
      : null;

    // Verify workshop data availability - critical for debugging data issues
    if (!window.WORKSHOP_EVENTS) {
      console.error(
        "[NZGDC Widget] WORKSHOP_EVENTS not loaded - check data file loading",
      );
      return;
    }

    try {
      if (!eventData) {
        console.warn(
          `[NZGDC Widget] No data found for workshop: ${eventId} - check workshop-events.js`,
        );
        throw new Error(`No data found for workshop: ${eventId}`);
      }

      this.debug("Creating event panel for workshop:", eventId);
      const eventPanel = this.workshopLoader.createEventPanel(eventData);

      // Check if still valid before DOM update
      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(eventPanel);
        this.debug("Successfully loaded workshop:", eventId);
      }
    } catch (error) {
      console.error(
        `[NZGDC Widget] Failed to load workshop ${eventId}:`,
        error,
      );

      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(
          this.workshopLoader.createErrorPanel(error.message),
        );
      }
    }
  }

  showScheduleError(error) {
    this.container.innerHTML = `
            <div class="nzgdc-error-placeholder" style="width: 100%; height: 200px; max-width: none;">
                <strong>Failed to load schedule</strong>
                <small>${error.message}</small>
                <small>Please check console for details</small>
            </div>
        `;
  }

  showWorkshopLoadError(error) {
    const containers = this.container.querySelectorAll(
      ".nzgdc-loading-placeholder",
    );
    containers.forEach((container) => {
      container.className = "nzgdc-error-placeholder";
      container.innerHTML = `
                <strong>Failed to load workshops</strong>
                <small>${error.message}</small>
            `;
    });
  }

  destroy() {
    this.debug("Destroying ScheduleGenerator...");

    try {
      // Mark as destroyed to prevent further operations
      this.isDestroyed = true;

      // Clear workshop tracking
      this.loadedWorkshops.clear();

      // Destroy workshop loader if it has cleanup methods
      if (
        this.workshopLoader &&
        typeof this.workshopLoader.destroy === "function"
      ) {
        this.workshopLoader.destroy();
      }
      this.workshopLoader = null;

      // Clear container if still exists
      if (this.container && this.container.parentNode) {
        this.container.innerHTML = "";
      }
      this.container = null;

      this.debug("ScheduleGenerator destroyed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Widget] Error destroying ScheduleGenerator:",
        error,
      );
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ScheduleGenerator;
} else if (typeof window !== "undefined") {
  window.ScheduleGenerator = ScheduleGenerator;
}
