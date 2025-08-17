// NZGDC Schedule Widget - Schedule Generator

class ScheduleGenerator {
  constructor(container) {
    this.container = container;
    this.eventLoader = new UnifiedEventLoader();
    this.loadedWorkshops = new Set(); // Track loaded workshops for cleanup
    this.isDestroyed = false;

    // Filter state
    this.currentFilterCategory = null;
    this.originalData = null;
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

  async renderSchedule(scheduleData, eventData) {
    try {
      if (this.isDestroyed) {
        console.warn("Cannot render schedule - generator is destroyed");
        return;
      }

      // Enhanced debugging to inspect received data
      this.debug("=== Schedule Generator Data Inspection ===");
      this.debug("Received scheduleData:", scheduleData);
      this.debug("Received eventData:", eventData);
      this.debug("scheduleData type:", typeof scheduleData);
      this.debug("eventData type:", typeof eventData);

      if (scheduleData) {
        this.debug("scheduleData has timeSlots?", "timeSlots" in scheduleData);
        this.debug("scheduleData.timeSlots:", scheduleData.timeSlots);
        if (scheduleData.timeSlots) {
          this.debug("timeSlots length:", scheduleData.timeSlots.length);
          if (scheduleData.timeSlots.length > 0) {
            this.debug("First timeSlot:", scheduleData.timeSlots[0]);
            if (scheduleData.timeSlots[0].workshops) {
              this.debug(
                "First timeSlot workshops:",
                scheduleData.timeSlots[0].workshops,
              );
            }
          }
        }
      }

      if (eventData) {
        this.debug("eventData keys:", Object.keys(eventData));
        this.debug("eventData length:", Object.keys(eventData).length);
        const firstKey = Object.keys(eventData)[0];
        if (firstKey) {
          this.debug("Sample event data:", eventData[firstKey]);
        }
      }

      this.debug(
        "Starting schedule rendering with",
        scheduleData.timeSlots.length,
        "time slots",
      );

      // Store original data for filtering
      this.originalData = scheduleData;
      this.eventData = eventData; // Store eventData as a class property
      this.scheduleData = scheduleData; // Store scheduleData as a class property

      // Clear existing content and tracking
      this.container.innerHTML = "";
      this.loadedWorkshops.clear();

      // Use document fragment for better performance
      const fragment = document.createDocumentFragment();

      // Generate time slots in fragment first
      this.scheduleData.timeSlots.forEach((timeSlot) => {
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
      await this.eventLoader.loadTemplate();

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

  /**
   * Refresh all workshop content with new data
   * @param {Object} newData - Optional new data to use for refresh
   */
  async refreshWorkshopContent(newData) {
    try {
      if (this.isDestroyed) {
        console.warn(
          "[NZGDC Widget] Cannot refresh workshop content - generator is destroyed",
        );
        return;
      }

      this.debug("Refreshing workshop content with new data");

      // If new data provided, update the global WORKSHOP_EVENTS
      if (newData) {
        this.eventData = newData;
        this.debug("Updated WORKSHOP_EVENTS with new data");
      }

      // Find all workshop containers
      const containers = this.container.querySelectorAll(
        ".nzgdc-event-panel-container[data-event-id]",
      );
      this.debug(
        "Refreshing content for",
        containers.length,
        "workshop containers",
      );

      // Batch DOM operations for better performance
      const refreshPromises = Array.from(containers).map((container) =>
        this.refreshSingleWorkshop(container),
      );

      const results = await Promise.allSettled(refreshPromises);

      // Track successful refreshes
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && !this.isDestroyed) {
          const container = containers[index];
          const eventId = container.dataset.eventId;
          if (eventId) {
            this.loadedWorkshops.add(eventId);
          }
        }
      });

      this.debug("All workshop content refreshed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Widget] Failed to refresh workshop content:",
        error,
      );
      this.showWorkshopLoadError(error);
    }
  }

  /**
   * Refresh a single workshop with new data
   * @param {HTMLElement} container - The container element for the workshop
   */
  async refreshSingleWorkshop(container) {
    if (this.isDestroyed) {
      return;
    }

    const eventId = container.dataset.eventId;
    this.debug("Refreshing workshop:", eventId);

    const eventData = this.eventData ? this.eventData[eventId] : null;

    // Verify workshop data availability - critical for debugging data issues
    if (!this.eventData) {
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

      this.debug("Updating event panel for workshop:", eventId);
      // Use the updateEventPanel method from UnifiedEventLoader
      const eventPanel =
        container.querySelector(".nzgdc-event-panel-big") ||
        container.querySelector(".nzgdc-event-panel-main");

      if (eventPanel) {
        // Update existing panel
        this.eventLoader.updateEventPanel(eventPanel, eventData, "thursday");
      } else {
        // Create new panel if none exists - Thursday workshops are always big panels
        console.log(
          `[Thursday] Creating BIG panel for workshop: ${eventId}`,
          eventData,
        );
        const newEventPanel = this.eventLoader.createEventPanel(
          eventData,
          "big",
          "thursday",
        );
        console.log(
          `[Thursday] Created panel type:`,
          newEventPanel.querySelector(".nzgdc-event-panel-big")
            ? "BIG"
            : "MAIN",
        );
        container.innerHTML = "";
        container.appendChild(newEventPanel);
      }

      this.debug("Successfully refreshed workshop:", eventId);
    } catch (error) {
      console.error(
        `[NZGDC Widget] Failed to refresh workshop ${eventId}:`,
        error,
      );

      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(this.eventLoader.createErrorPanel(error.message));
      }
    }
  }

  async loadSingleWorkshop(container) {
    if (this.isDestroyed) {
      return;
    }

    const eventId = container.dataset.eventId;
    this.debug("Loading workshop:", eventId);

    const eventData = this.eventData ? this.eventData[eventId] : null;

    // Verify workshop data availability - critical for debugging data issues
    if (!this.eventData) {
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
      const eventPanel = this.eventLoader.createEventPanel(
        eventData,
        "auto",
        "thursday",
      );

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
        container.appendChild(this.eventLoader.createErrorPanel(error.message));
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

      // Clear filter state
      this.currentFilterCategory = null;
      this.originalData = null;

      // Clear workshop tracking
      this.loadedWorkshops.clear();

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

      this.debug("ScheduleGenerator destroyed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Widget] Error destroying ScheduleGenerator:",
        error,
      );
    }
  }

  // Filter events by category key - grey out non-matching events
  filterEventsByCategory(categoryKey) {
    if (!this.originalData) {
      this.debug("No original data available for filtering");
      return;
    }

    this.debug("Filtering Thursday events by category:", categoryKey);
    this.currentFilterCategory = categoryKey;

    // Apply filtering to all event panels
    this.applyEventFiltering(categoryKey);
  }

  // Reset filter and show all events
  resetFilter() {
    this.debug("Resetting Thursday filter - showing all events");
    this.currentFilterCategory = null;

    // Clear all filtering from event panels
    this.clearEventFiltering();
  }

  // Apply filtering to event panels - grey out non-matching events
  applyEventFiltering(categoryKey) {
    // Get all big event panels in Thursday schedule
    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-event-panel-container[data-event-id], .nzgdc-event-panel-big",
    );

    this.debug(`Found ${eventPanels.length} Thursday event panels to filter`);

    eventPanels.forEach((panel) => {
      // Get event ID and data
      const eventId =
        panel.getAttribute("data-event-id") ||
        panel.closest("[data-event-id]")?.getAttribute("data-event-id");
      const eventData = this.eventData ? this.eventData[eventId] : null;

      if (!eventData) {
        this.debug(`No event data found for panel ${eventId}`);
        return;
      }

      // Remove any existing filter classes
      panel.classList.remove("filtered-out", "filtered-in");

      // Get event category (try both categoryKey and category properties)
      const eventCategoryKey =
        eventData.categoryKey || eventData.category || "";

      // Check if event matches filter
      if (eventCategoryKey === categoryKey) {
        // Event matches filter - highlight it
        panel.classList.add("filtered-in");
        this.debug(
          `✅ Thursday event ${eventId} matches filter ${categoryKey} - HIGHLIGHTED`,
        );
      } else {
        // Event doesn't match filter - grey it out
        panel.classList.add("filtered-out");
        this.debug(
          `❌ Thursday event ${eventId} filtered out (${eventCategoryKey} !== ${categoryKey}) - GREYED OUT`,
        );
      }
    });

    this.debug(`Thursday filtering applied: ${categoryKey}`);
  }

  // Clear all event filtering - show all events normally
  clearEventFiltering() {
    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-event-panel-container, .nzgdc-event-panel-big",
    );

    eventPanels.forEach((panel) => {
      panel.classList.remove("filtered-out", "filtered-in");
    });

    this.debug("Thursday filtering cleared - all events visible");
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = ScheduleGenerator;
} else if (typeof window !== "undefined") {
  window.ScheduleGenerator = ScheduleGenerator;
}
