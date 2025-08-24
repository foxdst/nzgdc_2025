// NZGDC Afternoon Schedule Widget - Afternoon Schedule Generator

class AfternoonScheduleGenerator {
  constructor(container) {
    this.container = container;
    this.eventLoader = null; // Initialize as null, will be created when needed
    this.loadedEvents = new Set(); // Track loaded events for cleanup
    this.isDestroyed = false;
    this.debugEnabled = false; // Initialize debug flag
    this.originalData = null; // Store original unfiltered data
    this.currentFilterCategory = null;
  }

  // Debug logging helper - checks debug flag
  debug(...args) {
    if (this.debugEnabled || window.NZGDC_DEBUG) {
      console.log("[NZGDC Afternoon Schedule Generator]", ...args);
    }
  }

  // Enable/disable debug logging
  enableDebug(enabled = true) {
    this.debugEnabled = enabled;
  }

  /**
   * Initialize UnifiedEventLoader if not already done
   */
  initializeEventLoader() {
    if (!this.eventLoader && window.UnifiedEventLoader) {
      this.eventLoader = new window.UnifiedEventLoader();
      this.debug("UnifiedEventLoader initialized");
    }
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
    console.warn(
      "[NZGDC Afternoon Schedule Generator] generateTimeSlot() is deprecated. Use dynamic time blocks instead.",
    );

    // Special handling for breaks
    if (timeSlot.type === "break") {
      return this.generateBreakBlock(timeSlot);
    }

    const timeSlotEl = document.createElement("div");
    timeSlotEl.className = `nzgdc-time-category nzgdc-time-category-${timeSlot.theme}`;
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
        "[NZGDC Afternoon Schedule Generator] ScheduleTimeManager not available, falling back to legacy method",
      );
      return [];
    }

    this.debug(
      "Generating dynamic time blocks from",
      events.length,
      "afternoon events",
    );
    return this.timeManager.processEventsIntoTimeBlocks(events, "afternoon");
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
    this.debug(`Generating afternoon event panels for ${events.length} events`);

    // Separate events by panel type
    const bigEvents = events.filter(
      (event) => this.determinePanelType(event) === "big",
    );
    const mainEvents = events.filter(
      (event) => this.determinePanelType(event) === "main",
    );

    this.debug(
      `Afternoon panel breakdown: ${bigEvents.length} big panels, ${mainEvents.length} main panels`,
    );

    const rows = [];
    const bigEventsPerRow = 2;
    const mainEventsPerRow = 5;

    // Generate Big event panel rows first
    if (bigEvents.length > 0) {
      this.debug("Generating afternoon big event panel rows");
      for (let i = 0; i < bigEvents.length; i += bigEventsPerRow) {
        const rowEvents = bigEvents.slice(i, i + bigEventsPerRow);
        const rowHTML = `
          <div class="nzgdc-afternoon-event-row nzgdc-big-panel-row">
            ${rowEvents
              .map(
                (event) => `
              <div class="nzgdc-afternoon-event" data-panel-type="big">
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
      this.debug("Generating afternoon main event panel rows");
      for (let i = 0; i < mainEvents.length; i += mainEventsPerRow) {
        const rowEvents = mainEvents.slice(i, i + mainEventsPerRow);
        const rowHTML = `
          <div class="nzgdc-afternoon-event-row nzgdc-main-panel-row">
            ${rowEvents
              .map(
                (event) => `
              <div class="nzgdc-afternoon-event-main" data-panel-type="main">
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
      `Generated ${rows.length} afternoon rows (big panels first, then main panels)`,
    );
    return rows.join("");
  }

  /**
   * Load a single afternoon event in its container element
   * @param {HTMLElement} eventElement - Container element for the event
   * @param {Object} event - Event data
   * @param {string} expectedPanelType - Expected panel type for validation
   */
  async loadSingleAfternoonEvent(eventElement, event, expectedPanelType) {
    this.debug(
      `Loading single afternoon event: ${event.id} as ${expectedPanelType} panel`,
    );

    try {
      // Validate panel type matches expectation
      const actualPanelType = this.determinePanelType(event);
      if (actualPanelType !== expectedPanelType) {
        this.debug(
          `Afternoon panel type mismatch for ${event.id}: expected ${expectedPanelType}, got ${actualPanelType}`,
        );
      }

      // Initialize event loader if not already done
      this.initializeEventLoader();
      if (!this.eventLoader) {
        throw new Error("UnifiedEventLoader not available");
      }

      // Load template and create event panel
      await this.eventLoader.loadTemplate();

      const eventPanel = this.eventLoader.createEventPanel(
        event,
        expectedPanelType,
        "afternoon",
      );

      // Replace loading placeholder with actual event panel
      eventElement.innerHTML = "";
      eventElement.appendChild(eventPanel);

      this.debug(
        `Successfully loaded afternoon ${expectedPanelType} event: ${event.id}`,
      );
    } catch (error) {
      console.error(`Failed to load afternoon event ${event.id}:`, error);
      this.showAfternoonEventError(eventElement, event.title);
    }
  }

  /**
   * Show error state for individual afternoon event
   * @param {HTMLElement} eventElement - Event container element
   * @param {string} eventTitle - Event title for error message
   */
  showAfternoonEventError(eventElement, eventTitle) {
    eventElement.innerHTML = `
      <div class="nzgdc-afternoon-event-error">
        <div class="nzgdc-error-title">Unable to load afternoon event</div>
        <div class="nzgdc-error-subtitle">${eventTitle}</div>
        <div class="nzgdc-error-details">Please try refreshing the page</div>
      </div>
    `;
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
    this.debug("Generating event with data:", event);
    this.debug("Event ID:", event.id);
    this.debug("Event category:", event.category);

    const eventType = event.type || "big";
    const containerClass =
      eventType === "main"
        ? "nzgdc-afternoon-event-main"
        : "nzgdc-afternoon-event";
    const panelContainerClass =
      eventType === "main"
        ? "nzgdc-afternoon-event-panel-main-container"
        : "nzgdc-afternoon-event-panel-container";

    const generatedHtml = `
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

    this.debug("Generated HTML snippet:", generatedHtml.substring(0, 200));
    return generatedHtml;
  }

  // Store original data for filter reset
  preserveOriginalData(scheduleData) {
    if (!this.originalData) {
      this.originalData = JSON.parse(JSON.stringify(scheduleData));
      this.debug("Original schedule data preserved for filtering");
    }
  }

  // Filter events by category key - grey out non-matching events
  filterEventsByCategory(categoryKey) {
    if (!this.originalData) {
      this.debug("No original data available for filtering");
      return;
    }

    this.debug("Filtering events by category:", categoryKey);
    this.currentFilterCategory = categoryKey;

    // Apply grey-out CSS classes to non-matching events
    this.applyEventFiltering(categoryKey);
  }

  // Reset filter and show all events
  resetFilter() {
    this.debug("Resetting filter - showing all events");
    this.currentFilterCategory = null;

    // Remove all filtering CSS classes
    this.clearEventFiltering();
  }

  // Apply grey-out filtering to event panels
  applyEventFiltering(categoryKey) {
    this.debug("Starting event filtering with category:", categoryKey);

    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-afternoon-event-panel-container, .nzgdc-afternoon-event-panel-main-container",
    );

    this.debug(`Found ${eventPanels.length} event panels to filter`);

    if (eventPanels.length === 0) {
      this.debug("No event panels found - filtering aborted");
      return;
    }

    this.debug("eventData available:", !!this.eventData);
    if (this.eventData) {
      this.debug("eventData keys:", Object.keys(this.eventData));
    }

    eventPanels.forEach((panel, index) => {
      const eventId = panel.dataset.eventId;
      this.debug(
        `Panel ${index}: eventId="${eventId}", classes="${panel.className}"`,
      );

      if (!eventId) {
        this.debug(
          "Panel missing data-event-id:",
          panel.outerHTML.substring(0, 200),
        );
        return;
      }

      const eventData = this.eventData && this.eventData[eventId];
      if (!eventData) {
        this.debug(`No event data found for ${eventId} in this.eventData`);
        this.debug(
          "Available event IDs:",
          this.eventData
            ? Object.keys(this.eventData)
            : "eventData is null/undefined",
        );
        return;
      }

      this.debug(`Event ${eventId} data:`, {
        categoryKey: eventData.categoryKey,
        category: eventData.category,
        title: eventData.title,
      });

      // Remove any existing filter classes
      panel.classList.remove("filtered-out", "filtered-in");

      // Check if event matches filter - try both categoryKey and category
      const eventCategoryKey = eventData.categoryKey || eventData.category;
      this.debug(`Comparing "${eventCategoryKey}" === "${categoryKey}"`);

      if (eventCategoryKey === categoryKey) {
        // Event matches filter - highlight it
        panel.classList.add("filtered-in");
        this.debug(
          `✅ Event ${eventId} matches filter ${categoryKey} - HIGHLIGHTED`,
        );
      } else {
        // Event doesn't match filter - grey it out
        panel.classList.add("filtered-out");
        this.debug(
          `❌ Event ${eventId} filtered out (${eventCategoryKey} !== ${categoryKey}) - GREYED OUT`,
        );
      }
    });

    this.debug("Event filtering completed");
  }

  // Clear all event filtering
  clearEventFiltering() {
    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-afternoon-event-panel-container, .nzgdc-afternoon-event-panel-main-container",
    );

    eventPanels.forEach((panel) => {
      panel.classList.remove("filtered-out", "filtered-in");
    });

    this.debug("All event filtering cleared");
  }

  async renderSchedule(scheduleData, eventData) {
    try {
      if (this.isDestroyed) {
        console.warn(
          "Cannot render afternoon schedule - generator is destroyed",
        );
        return;
      }

      this.debug("=== Afternoon Schedule Rendering ===");
      this.debug("Received scheduleData:", scheduleData);
      this.debug("Received eventData:", eventData);

      // Store original data for filtering
      this.originalData = scheduleData;
      this.eventData = eventData;
      this.scheduleData = scheduleData;

      // Check if we have real-time event data (events with startTime/endTime)
      const hasRealTimeData =
        eventData &&
        Object.values(eventData).some(
          (event) => event.startTime && event.endTime,
        );

      if (hasRealTimeData) {
        this.debug("Using dynamic time-based rendering for afternoon events");
        await this.renderDynamicSchedule(eventData);
      } else {
        this.debug(
          "Falling back to legacy time slot rendering for afternoon events",
        );
        await this.renderLegacySchedule(scheduleData, eventData);
      }

      this.debug("Afternoon schedule rendering completed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Failed to render schedule:",
        error,
      );
    }
  }

  async renderDynamicSchedule(eventData) {
    this.debug("Starting dynamic afternoon schedule rendering");

    // Convert eventData object to array and filter for events with time data
    const allEvents = Object.values(eventData).filter(
      (event) => event.startTime && event.endTime,
    );

    // Filter events for Friday/Saturday schedules first, then by afternoon time
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

    const afternoonEvents = fridaySaturdayEvents.filter((event) => {
      const hour = parseInt(event.startTime.split(":")[0], 10);
      return hour >= 12; // Afternoon events (noon and later)
    });

    this.debug(
      `Processing ${afternoonEvents.length} afternoon events (filtered from ${allEvents.length} total events, ${fridaySaturdayEvents.length} Friday/Saturday events)`,
    );

    // Generate dynamic time blocks
    const timeBlockElements = this.generateDynamicTimeBlocks(afternoonEvents);

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

    // Load dynamic event content after DOM is stable
    requestAnimationFrame(() => {
      if (!this.isDestroyed) {
        this.loadDynamicEventContent();
      }
    });

    this.debug("Dynamic afternoon schedule rendering completed");
  }

  async renderLegacySchedule(scheduleData, eventData) {
    this.debug("Using legacy afternoon schedule rendering");

    if (!scheduleData.timeSlots || scheduleData.timeSlots.length === 0) {
      this.debug("No time slots available, creating default structure");
      return;
    }

    // Clear existing content and tracking
    this.container.innerHTML = "";
    this.loadedEvents.clear();

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Generate time slots in fragment first
    scheduleData.timeSlots.forEach((timeSlot) => {
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

    this.debug("Legacy afternoon schedule rendering completed");
  }

  generateDynamicTimeBlocks(events) {
    this.initializeTimeManager();

    if (!this.timeManager) {
      console.error(
        "[NZGDC Afternoon Schedule Generator] ScheduleTimeManager not available, falling back to legacy method",
      );
      return [];
    }

    this.debug(
      "Generating dynamic time blocks from",
      events.length,
      "afternoon events",
    );
    return this.timeManager.processEventsIntoTimeBlocks(events, "afternoon");
  }

  async loadDynamicEventContent() {
    const timeBlockElements = this.container.querySelectorAll(
      ".nzgdc-time-category",
    );

    try {
      this.debug(
        `Loading event content for ${timeBlockElements.length} afternoon time blocks`,
      );

      for (const timeBlockEl of timeBlockElements) {
        if (this.isDestroyed) {
          this.debug("Generator destroyed during loading, stopping");
          return;
        }

        const timeBlockData =
          timeBlockEl.timeBlockData || timeBlockEl._timeBlockData;
        if (!timeBlockData || !timeBlockData.events) {
          this.debug("No time block data or events, skipping");
          continue;
        }

        this.debug(
          `Loading content for afternoon time block: ${timeBlockData.title} (${timeBlockData.events.length} events)`,
        );

        // Get events container within this time block
        const eventsContainer =
          this.timeManager.getEventsContainer(timeBlockEl);
        if (eventsContainer) {
          // Generate event panels for this time block
          const eventPanelsHTML = await this.generateEventPanelsForTimeBlock(
            timeBlockData.events,
          );
          eventsContainer.innerHTML = eventPanelsHTML;

          // Load individual event content
          await this.loadEventsInTimeBlock(
            eventsContainer,
            timeBlockData.events,
          );
        }
      }

      this.debug("Dynamic afternoon event content loading completed");
    } catch (error) {
      console.error(
        "[NZGDC Afternoon Widget] Failed to load dynamic event content:",
        error,
      );
    }
  }

  async loadEventsInTimeBlock(eventsContainer, events) {
    // Separate events by panel type
    const bigEvents = events.filter(
      (event) => this.determinePanelType(event) === "big",
    );
    const mainEvents = events.filter(
      (event) => this.determinePanelType(event) === "main",
    );

    this.debug(
      `Loading afternoon events: ${bigEvents.length} big events, ${mainEvents.length} main events`,
    );

    // Find event elements in the container
    const bigEventElements = eventsContainer.querySelectorAll(
      ".nzgdc-afternoon-event",
    );
    const mainEventElements = eventsContainer.querySelectorAll(
      ".nzgdc-afternoon-event-main",
    );

    // Load big events
    for (
      let i = 0;
      i < Math.min(bigEvents.length, bigEventElements.length);
      i++
    ) {
      const eventElement = bigEventElements[i];
      const event = bigEvents[i];

      try {
        await this.loadSingleAfternoonEvent(eventElement, event, "big");
        this.debug(`Loaded afternoon big event: ${event.title}`);
      } catch (error) {
        console.error(`Error loading afternoon big event ${event.id}:`, error);
        this.showAfternoonEventError(eventElement, event.title);
      }
    }

    // Load main events
    for (
      let i = 0;
      i < Math.min(mainEvents.length, mainEventElements.length);
      i++
    ) {
      const eventElement = mainEventElements[i];
      const event = mainEvents[i];

      try {
        await this.loadSingleAfternoonEvent(eventElement, event, "main");
        this.debug(`Loaded afternoon main event: ${event.title}`);
      } catch (error) {
        console.error(`Error loading afternoon main event ${event.id}:`, error);
        this.showAfternoonEventError(eventElement, event.title);
      }
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

      // Initialize event loader if not already done
      this.initializeEventLoader();
      if (!this.eventLoader) {
        throw new Error("UnifiedEventLoader not available");
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

      // Reapply current filter if one is active
      if (this.currentFilterCategory) {
        this.debug(
          "Reapplying filter after content load:",
          this.currentFilterCategory,
        );
        this.applyEventFiltering(this.currentFilterCategory);
      }
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

    const eventData = this.eventData ? this.eventData[eventId] : null;

    try {
      if (!eventData) {
        console.warn(
          `[NZGDC Afternoon Widget] No data found for event: ${eventId} - check afternoon-events.js`,
        );
        throw new Error(`No data found for afternoon event: ${eventId}`);
      }

      this.debug("Creating afternoon event panel for:", eventId);

      // Initialize event loader if not already done
      this.initializeEventLoader();
      if (!this.eventLoader) {
        throw new Error("UnifiedEventLoader not available");
      }

      const eventPanel = this.eventLoader.createEventPanel(
        eventData,
        "auto",
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
        // Initialize event loader for error panel
        this.initializeEventLoader();
        if (this.eventLoader) {
          container.appendChild(
            this.eventLoader.createErrorPanel(error.message),
          );
        } else {
          container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
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
