// NZGDC Morning Schedule Generator
// Handles dynamic morning event organization with panel type hierarchy

class MorningScheduleGenerator {
  constructor(container) {
    if (!container) {
      throw new Error(
        "Container element is required for MorningScheduleGenerator",
      );
    }

    this.container = container;
    this.isDestroyed = false;
    this.timeManager = null;
    this.debugEnabled = false; // Initialize debug flag
  }

  // Debug logging helper - checks debug flag
  debug(...args) {
    if (this.debugEnabled || window.NZGDC_DEBUG) {
      console.log("[NZGDC Morning Schedule Generator]", ...args);
    }
  }

  // Enable/disable debug logging
  enableDebug(enabled = true) {
    this.debugEnabled = enabled;
  }

  /**
   * Initialize ScheduleTimeManager if not already done
   */
  initializeTimeManager() {
    if (!this.timeManager && window.ScheduleTimeManager) {
      this.timeManager = new window.ScheduleTimeManager();
      this.timeManager.enableDebug(this.debugEnabled);
      this.debug("ScheduleTimeManager initialized");
    }
  }

  generateTimeSlot(timeSlot) {
    // Handle break blocks differently
    if (timeSlot.type === "break") {
      return this.generateBreakBlock(timeSlot);
    }

    console.warn(
      "[NZGDC Morning Schedule Generator] generateTimeSlot() is deprecated. Use dynamic time blocks instead.",
    );

    const timeSlotEl = document.createElement("div");
    timeSlotEl.className = `nzgdc-time-category nzgdc-time-category-${timeSlot.theme}`;
    timeSlotEl.setAttribute("data-time-slot", timeSlot.id);

    // Generate the innerHTML with event times container
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
      <div class="nzgdc-scheduled-events">
        ${this.generateEventRows(timeSlot.events)}
      </div>
    `;

    return timeSlotEl;
  }

  /**
   * Generate dynamic time blocks from actual event data
   * @param {Array} events - Array of event objects with startTime/endTime
   * @returns {Array} Array of time block container elements
   */
  generateDynamicTimeBlocks(events) {
    this.initializeTimeManager();

    if (!this.timeManager) {
      console.error(
        "[NZGDC Morning Schedule Generator] ScheduleTimeManager not available, falling back to legacy method",
      );
      return [];
    }

    this.debug(
      "Generating dynamic time blocks from",
      events.length,
      "morning events",
    );
    return this.timeManager.processEventsIntoTimeBlocks(events, "morning");
  }

  /**
   * Determine panel type based on speaker count
   * @param {Object} event - Event object with speakers array
   * @returns {string} Panel type ("big" or "main")
   */
  determinePanelType(event) {
    const speakerCount =
      event.speakers && Array.isArray(event.speakers)
        ? event.speakers.length
        : 0;
    return speakerCount >= 2 ? "big" : "main";
  }

  /**
   * Generate HTML for event panels with panel type hierarchy
   * @param {Array} events - Events already sorted by panel type
   * @returns {string} HTML for event panels
   */
  generateEventPanelsForTimeBlock(events) {
    this.debug(`Generating morning event panels for ${events.length} events`);

    // Separate events by panel type
    const bigEvents = events.filter(
      (event) => this.determinePanelType(event) === "big",
    );
    const mainEvents = events.filter(
      (event) => this.determinePanelType(event) === "main",
    );

    this.debug(
      `Morning panel breakdown: ${bigEvents.length} big panels, ${mainEvents.length} main panels`,
    );

    const rows = [];
    const bigEventsPerRow = 2;
    const mainEventsPerRow = 5;

    // Generate Big event panel rows first
    if (bigEvents.length > 0) {
      this.debug("Generating morning big event panel rows");
      for (let i = 0; i < bigEvents.length; i += bigEventsPerRow) {
        const rowEvents = bigEvents.slice(i, i + bigEventsPerRow);
        const rowHTML = `
          <div class="nzgdc-morning-event-row nzgdc-big-panel-row">
            ${rowEvents
              .map(
                (event) => `
              <div class="nzgdc-morning-event nzgdc-big-event" data-panel-type="big">
                <div class="nzgdc-loading-placeholder">Loading ${event.title}...</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `;
        rows.push(rowHTML);
      }
    }

    // Generate Main event panel rows after Big panels
    if (mainEvents.length > 0) {
      this.debug("Generating morning main event panel rows");
      for (let i = 0; i < mainEvents.length; i += mainEventsPerRow) {
        const rowEvents = mainEvents.slice(i, i + mainEventsPerRow);
        const rowHTML = `
          <div class="nzgdc-morning-event-row nzgdc-main-panel-row">
            ${rowEvents
              .map(
                (event) => `
              <div class="nzgdc-morning-event-main" data-panel-type="main">
                <div class="nzgdc-loading-placeholder">Loading ${event.title}...</div>
              </div>
            `,
              )
              .join("")}
          </div>
        `;
        rows.push(rowHTML);
      }
    }

    this.debug(
      `Generated ${rows.length} morning rows (big panels first, then main panels)`,
    );
    return rows.join("");
  }

  /**
   * Load individual morning event content with hierarchical organization
   * @param {HTMLElement} eventsContainer - Container for events
   * @param {Array} events - Events to load (already sorted by panel type)
   */
  async loadEventsInTimeBlock(eventsContainer, events) {
    // Separate events by panel type
    const bigEvents = events.filter(
      (event) => this.determinePanelType(event) === "big",
    );
    const mainEvents = events.filter(
      (event) => this.determinePanelType(event) === "main",
    );

    this.debug(
      `Loading morning events: ${bigEvents.length} big events, ${mainEvents.length} main events`,
    );

    // Load Big event panels first
    const bigEventElements = eventsContainer.querySelectorAll(
      ".nzgdc-morning-event",
    );

    for (
      let i = 0;
      i < Math.min(bigEvents.length, bigEventElements.length);
      i++
    ) {
      const event = bigEvents[i];
      const eventElement = bigEventElements[i];

      try {
        await this.loadSingleMorningEvent(eventElement, event, "big");
        this.debug(`Loaded morning big event: ${event.title}`);
      } catch (error) {
        console.error(`Error loading morning big event ${event.id}:`, error);
        this.showMorningEventError(eventElement, event.title);
      }
    }

    // Load Main event panels after Big panels
    const mainEventElements = eventsContainer.querySelectorAll(
      ".nzgdc-morning-event-main",
    );

    for (
      let i = 0;
      i < Math.min(mainEvents.length, mainEventElements.length);
      i++
    ) {
      const event = mainEvents[i];
      const eventElement = mainEventElements[i];

      try {
        await this.loadSingleMorningEvent(eventElement, event, "main");
        this.debug(`Loaded morning main event: ${event.title}`);
      } catch (error) {
        console.error(`Error loading morning main event ${event.id}:`, error);
        this.showMorningEventError(eventElement, event.title);
      }
    }
  }

  /**
   * Load a single morning event in its container element
   * @param {HTMLElement} eventElement - Container element for the event
   * @param {Object} event - Event data
   * @param {string} expectedPanelType - Expected panel type for validation
   */
  async loadSingleMorningEvent(eventElement, event, expectedPanelType) {
    this.debug(
      `Loading single morning event: ${event.id} as ${expectedPanelType} panel`,
    );

    try {
      // Validate panel type matches expectation
      const actualPanelType = this.determinePanelType(event);
      if (actualPanelType !== expectedPanelType) {
        this.debug(
          `Morning panel type mismatch for ${event.id}: expected ${expectedPanelType}, got ${actualPanelType}`,
        );
      }

      // Create event panel using UnifiedEventLoader
      if (window.UnifiedEventLoader) {
        const unifiedLoader = new window.UnifiedEventLoader();
        await unifiedLoader.loadTemplate();

        const eventPanel = unifiedLoader.createEventPanel(
          event,
          expectedPanelType,
          "morning",
        );

        // Replace loading placeholder with actual event panel
        eventElement.innerHTML = "";
        eventElement.appendChild(eventPanel);

        this.debug(
          `Successfully loaded morning ${expectedPanelType} event: ${event.id}`,
        );
      } else {
        throw new Error("UnifiedEventLoader not available");
      }
    } catch (error) {
      console.error(`Failed to load morning event ${event.id}:`, error);
      this.showMorningEventError(eventElement, event.title);
    }
  }

  /**
   * Show error state for individual morning event
   * @param {HTMLElement} eventElement - Event container element
   * @param {string} eventTitle - Event title for error message
   */
  showMorningEventError(eventElement, eventTitle) {
    eventElement.innerHTML = `
      <div class="nzgdc-morning-event-error">
        <div class="nzgdc-error-title">Unable to load morning event</div>
        <div class="nzgdc-error-subtitle">${eventTitle}</div>
        <div class="nzgdc-error-details">Please try refreshing the page</div>
      </div>
    `;
  }

  generateBreakBlock(breakSlot) {
    const breakEl = document.createElement("div");
    breakEl.className = "nzgdc-break-schedule";
    breakEl.innerHTML = `
      <div class="nzgdc-morning-break-container">
        <div class="nzgdc-morning-break-content">
          <div class="nzgdc-break-title">${breakSlot.title}</div>
          <div class="nzgdc-break-timeframe">${breakSlot.timeRange}</div>
        </div>
      </div>
    `;
    return breakEl;
  }

  generateEventRows(events) {
    const rows = [];
    const eventsPerRow = 2;

    for (let i = 0; i < events.length; i += eventsPerRow) {
      const rowEvents = events.slice(i, i + eventsPerRow);
      const rowHTML = `
        <div class="nzgdc-morning-event-row">
          ${rowEvents
            .map(
              (event) => `
            <div class="nzgdc-morning-event">
              <div class="nzgdc-loading-placeholder">Loading ${event.title}...</div>
            </div>
          `,
            )
            .join("")}
        </div>
      `;
      rows.push(rowHTML);
    }

    return rows.join("");
  }

  async renderSchedule(scheduleData, eventData) {
    try {
      if (this.isDestroyed) {
        console.warn("Cannot render schedule - generator is destroyed");
        return;
      }

      this.debug("=== Morning Schedule Rendering ===");
      this.debug("Received scheduleData:", scheduleData);
      this.debug("Received eventData:", eventData);

      // Store original data for filtering

      this.eventData = eventData;
      this.originalData = scheduleData;
      this.eventData = eventData;
      this.scheduleData = scheduleData;

      // Check if we have real event data with time information
      const hasRealTimeData =
        eventData &&
        Object.values(eventData).some(
          (event) => event.startTime && event.endTime,
        );

      if (hasRealTimeData) {
        this.debug("Using dynamic time-based rendering for morning events");
        await this.renderDynamicSchedule(eventData);
      } else {
        this.debug(
          "Falling back to legacy time slot rendering for morning events",
        );
        await this.renderLegacySchedule(scheduleData, eventData);
      }

      this.debug("Morning schedule rendering completed successfully");
    } catch (error) {
      console.error("[NZGDC Morning Widget] Failed to render schedule:", error);
      this.showScheduleError(error);
    }
  }

  async renderDynamicSchedule(eventData) {
    this.debug("Starting dynamic morning schedule rendering");

    // Convert eventData object to array and filter for events with time data
    const allEvents = Object.values(eventData).filter(
      (event) => event.startTime && event.endTime,
    );

    // Filter events for Friday/Saturday schedules first, then by morning time
    const fridaySaturdayEvents = allEvents.filter((event) => {
      if (event.scheduleTitle) {
        const scheduleTitle = event.scheduleTitle.toLowerCase();
        return scheduleTitle === "friday" || scheduleTitle === "saturday";
      }
      // Fallback: if no scheduleTitle, check if it's not Thursday
      return (
        !event.scheduleTitle || event.scheduleTitle.toLowerCase() !== "thursday"
      );
    });

    const morningEvents = fridaySaturdayEvents.filter((event) => {
      const hour = parseInt(event.startTime.split(":")[0], 10);
      return hour < 12; // Morning events (before noon)
    });

    this.debug(
      `Processing ${morningEvents.length} morning events (filtered from ${allEvents.length} total events, ${fridaySaturdayEvents.length} Friday/Saturday events)`,
    );

    // Generate dynamic time blocks
    const timeBlockElements = this.generateDynamicTimeBlocks(morningEvents);

    // Clear existing content
    this.container.innerHTML = "";

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Add time blocks to fragment
    timeBlockElements.forEach((timeBlockEl) => {
      fragment.appendChild(timeBlockEl);
    });

    // Single DOM update
    this.container.appendChild(fragment);

    // Load event content for each time block
    await this.loadDynamicEventContent(timeBlockElements);
  }

  async renderLegacySchedule(scheduleData, eventData) {
    this.debug("Using legacy morning schedule rendering");

    if (!scheduleData.timeSlots || scheduleData.timeSlots.length === 0) {
      this.debug("No time slots available, creating default structure");
      return;
    }

    // Clear existing content
    this.container.innerHTML = "";

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Generate legacy time slots
    scheduleData.timeSlots.forEach((timeSlot) => {
      const timeSlotEl = this.generateTimeSlot(timeSlot);
      fragment.appendChild(timeSlotEl);
    });

    // Single DOM update
    this.container.appendChild(fragment);

    // Load event content after DOM is stable
    requestAnimationFrame(() => {
      if (!this.isDestroyed) {
        this.loadLegacyEventContent();
      }
    });
  }

  async loadDynamicEventContent(timeBlockElements) {
    try {
      this.debug(
        `Loading event content for ${timeBlockElements.length} morning time blocks`,
      );

      for (const timeBlockEl of timeBlockElements) {
        if (this.isDestroyed) {
          this.debug("Generator destroyed during loading, stopping");
          return;
        }

        const timeBlockData = timeBlockEl._timeBlockData;
        if (!timeBlockData || !timeBlockData.events) {
          this.debug("No time block data or events, skipping");
          continue;
        }

        this.debug(
          `Loading content for morning time block: ${timeBlockData.title} (${timeBlockData.events.length} events)`,
        );

        // Get the events container for this time block
        const eventsContainer =
          this.timeManager.getEventsContainer(timeBlockEl);
        if (!eventsContainer) {
          console.warn("Events container not found in morning time block");
          continue;
        }

        // Generate event panels for this time block
        const eventPanelsHTML = await this.generateEventPanelsForTimeBlock(
          timeBlockData.events,
        );
        eventsContainer.innerHTML = eventPanelsHTML;

        // Load individual event content
        await this.loadEventsInTimeBlock(eventsContainer, timeBlockData.events);
      }

      this.debug("Dynamic morning event content loading completed");
    } catch (error) {
      console.error(
        "[NZGDC Morning Schedule Generator] Error loading dynamic event content:",
        error,
      );
    }
  }

  async loadLegacyEventContent() {
    try {
      if (this.isDestroyed) {
        console.warn(
          "[NZGDC Morning Widget] Cannot load event content - generator is destroyed",
        );
        return;
      }

      // Load the unified event loader template once
      if (window.UnifiedEventLoader) {
        const unifiedLoader = new window.UnifiedEventLoader();
        await unifiedLoader.loadTemplate();

        // Find all event containers
        const containers = this.container.querySelectorAll(
          ".nzgdc-morning-event",
        );
        this.debug(
          "Loading content for",
          containers.length,
          "morning event containers",
        );

        // Load each event
        for (const container of containers) {
          if (this.isDestroyed) break;
          await this.loadLegacySingleEvent(container);
        }

        this.debug("All morning event content loaded successfully");
      } else {
        throw new Error("UnifiedEventLoader not available");
      }
    } catch (error) {
      console.error(
        "[NZGDC Morning Widget] Failed to load event content:",
        error,
      );
      this.showEventLoadError(error);
    }
  }

  async loadLegacySingleEvent(container) {
    // Implementation for legacy single event loading
    // This would need to be implemented based on existing data structure
    this.debug("Loading legacy single morning event");

    // For now, show placeholder
    container.innerHTML = `
      <div class="nzgdc-morning-event-placeholder">
        <div class="nzgdc-placeholder-title">Morning Event</div>
        <div class="nzgdc-placeholder-details">Legacy event loading not implemented</div>
      </div>
    `;
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
      ".nzgdc-loading-placeholder",
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
    this.isDestroyed = true;
    this.timeManager = null;
    this.container = null;
  }

  /**
   * Filter events by category (for category filter overlay)
   * @param {string} categoryKey - Category key to filter by
   */
  filterEventsByCategory(categoryKey) {
    if (!this.originalData) {
      this.debug("No original data available for filtering");
      return;
    }

    this.debug("Filtering morning events by category:", categoryKey);
    this.currentFilterCategory = categoryKey;

    // Apply grey-out CSS classes to non-matching events
    this.applyEventFiltering(categoryKey);
  }

  /**
   * Reset category filter to show all events
   */
  resetFilter() {
    this.debug("Resetting morning filter - showing all events");
    this.currentFilterCategory = null;

    // Remove all filtering CSS classes
    this.clearEventFiltering();
  }

  // Apply grey-out filtering to morning event panels
  applyEventFiltering(categoryKey) {
    this.debug("Starting morning event filtering with category:", categoryKey);

    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-morning-event-panel-container, .nzgdc-morning-event-panel-main-container",
    );

    this.debug(`Found ${eventPanels.length} morning event panels to filter`);

    if (eventPanels.length === 0) {
      this.debug("No morning event panels found - filtering aborted");
      return;
    }

    eventPanels.forEach((panel) => {
      const eventId = panel.getAttribute("data-event-id");
      if (!eventId) {
        this.debug("No event ID found for panel, skipping");
        return;
      }

      const eventData = this.eventData ? this.eventData[eventId] : null;
      if (!eventData) {
        this.debug(`No event data found for ${eventId} in this.eventData`);
        return;
      }

      // Check if event matches filter - try both categoryKey and category
      const eventCategoryKey = eventData.categoryKey || eventData.category;
      this.debug(`Comparing "${eventCategoryKey}" === "${categoryKey}"`);

      if (eventCategoryKey === categoryKey) {
        // Show matching events (remove filtered class)
        panel.classList.remove("nzgdc-event-filtered");
        this.debug(`Morning event ${eventId} matches filter - showing`);
      } else {
        // Hide non-matching events (add filtered class)
        panel.classList.add("nzgdc-event-filtered");
        this.debug(`Morning event ${eventId} doesn't match filter - hiding`);
      }
    });

    this.debug("Morning event filtering completed");
  }

  // Clear all morning event filtering
  clearEventFiltering() {
    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-morning-event-panel-container, .nzgdc-morning-event-panel-main-container",
    );

    eventPanels.forEach((panel) => {
      panel.classList.remove("nzgdc-event-filtered");
    });

    this.debug("Cleared all morning event filtering");
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = MorningScheduleGenerator;
} else if (typeof window !== "undefined") {
  window.MorningScheduleGenerator = MorningScheduleGenerator;
}
