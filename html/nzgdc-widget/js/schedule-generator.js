// NZGDC Schedule Widget - Schedule Generator

class ScheduleGenerator {
  constructor(container) {
    this.container = container;
    this.eventLoader = null; // Initialize as null, will be created when needed
    this.loadedWorkshops = new Set(); // Track loaded workshops for cleanup
    this.isDestroyed = false;
    this.debugEnabled = false; // Initialize debug flag

    // Filter state
    this.currentFilterCategory = null;
    this.originalData = null;
  }

  // Debug logging helper - checks debug flag
  debug(...args) {
    if (this.debugEnabled || window.NZGDC_DEBUG) {
      console.log("[NZGDC Schedule Generator]", ...args);
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
      this.timeManager.enableDebug(this.debug);
      this.debug("ScheduleTimeManager initialized");
    }
  }

  /**
   * Generate time slot using dynamic time management (DEPRECATED - kept for backward compatibility)
   * @param {Object} timeSlot - Legacy time slot data
   * @returns {HTMLElement} Time slot element
   */
  generateTimeSlot(timeSlot) {
    console.warn(
      "[NZGDC Schedule Generator] generateTimeSlot() is deprecated. Use dynamic time blocks instead.",
    );

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

  /**
   * Generate dynamic time blocks from actual event data
   * @param {Array} events - Array of event objects with startTime/endTime
   * @returns {Array} Array of time block container elements
   */
  generateDynamicTimeBlocks(events) {
    this.initializeTimeManager();

    if (!this.timeManager) {
      console.error(
        "[NZGDC Schedule Generator] ScheduleTimeManager not available, falling back to legacy method",
      );
      return [];
    }

    this.debug("Generating dynamic time blocks from", events.length, "events");
    return this.timeManager.processEventsIntoTimeBlocks(events, "schedule");
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

      this.debug("=== Dynamic Schedule Rendering ===");
      this.debug("Received scheduleData:", scheduleData);
      this.debug("Received eventData:", eventData);

      // Store original data for filtering
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
        this.debug("Using dynamic time-based rendering");
        await this.renderDynamicSchedule(eventData);
      } else {
        this.debug("Falling back to legacy time slot rendering");
        await this.renderLegacySchedule(scheduleData, eventData);
      }

      this.debug("Schedule rendering completed successfully");
    } catch (error) {
      console.error("[NZGDC Widget] Failed to render schedule:", error);
      this.showScheduleError(error);
    }
  }

  /**
   * New dynamic schedule rendering using actual event times
   * @param {Object} eventData - Event data with startTime/endTime
   */
  async renderDynamicSchedule(eventData) {
    this.debug("Starting dynamic Thursday schedule rendering");

    // Convert eventData object to array and filter for Thursday events only
    const allEvents = Object.values(eventData).filter(
      (event) => event.startTime && event.endTime,
    );

    // Filter events specifically for Thursday schedule
    const events = allEvents.filter((event) => {
      // Check if event belongs to Thursday schedule
      if (event.scheduleTitle) {
        return event.scheduleTitle.toLowerCase() === "thursday";
      }
      // Fallback: if no scheduleTitle, assume it's Thursday if it's the only day
      // This maintains backward compatibility with older data formats
      return true;
    });

    this.debug(
      `Processing ${events.length} Thursday events (filtered from ${allEvents.length} total events)`,
    );

    // Generate dynamic time blocks
    const timeBlockElements = this.generateDynamicTimeBlocks(events);

    // Clear existing content
    this.container.innerHTML = "";
    this.loadedWorkshops.clear();

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Add time blocks to fragment
    timeBlockElements.forEach((timeBlockEl) => {
      fragment.appendChild(timeBlockEl);
    });

    // Single DOM update
    this.container.appendChild(fragment);

    // Load workshop content for each time block
    await this.loadDynamicWorkshopContent(timeBlockElements);
  }

  /**
   * Legacy schedule rendering for backward compatibility
   * @param {Object} scheduleData - Legacy schedule data structure
   * @param {Object} eventData - Event data
   */
  async renderLegacySchedule(scheduleData, eventData) {
    this.debug("Using legacy schedule rendering");

    if (!scheduleData.timeSlots || scheduleData.timeSlots.length === 0) {
      this.debug("No time slots available, creating default structure");
      return;
    }

    // Clear existing content and tracking
    this.container.innerHTML = "";
    this.loadedWorkshops.clear();

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Generate legacy time slots
    scheduleData.timeSlots.forEach((timeSlot) => {
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
  }

  /**
   * Load workshop content for dynamic time blocks
   * @param {Array} timeBlockElements - Array of time block container elements
   */
  async loadDynamicWorkshopContent(timeBlockElements) {
    try {
      this.debug(
        `Loading workshop content for ${timeBlockElements.length} time blocks`,
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
          `Loading content for time block: ${timeBlockData.title} (${timeBlockData.events.length} events)`,
        );

        // Get the events container for this time block
        const eventsContainer =
          this.timeManager.getEventsContainer(timeBlockEl);
        if (!eventsContainer) {
          console.warn("Events container not found in time block");
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

      this.debug("Dynamic workshop content loading completed");
    } catch (error) {
      console.error(
        "[NZGDC Schedule Generator] Error loading dynamic workshop content:",
        error,
      );
    }
  }

  /**
   * Generate HTML for event panels within a time block with panel type hierarchy
   * @param {Array} events - Events in the time block (already sorted by panel type)
   * @returns {string} HTML for event panels
   */
  async generateEventPanelsForTimeBlock(events) {
    this.debug(`Generating event panels for ${events.length} events`);

    // Separate events by panel type (events are already sorted, but we separate for row organization)
    const bigEvents = events.filter(
      (event) => this.determinePanelType(event) === "big",
    );
    const mainEvents = events.filter(
      (event) => this.determinePanelType(event) === "main",
    );

    this.debug(
      `Panel breakdown: ${bigEvents.length} big panels, ${mainEvents.length} main panels`,
    );

    const rows = [];
    const bigEventsPerRow = 2;
    const mainEventsPerRow = 5;

    // Generate Big event panel rows first
    if (bigEvents.length > 0) {
      this.debug("Generating big event panel rows");
      for (let i = 0; i < bigEvents.length; i += bigEventsPerRow) {
        const rowEvents = bigEvents.slice(i, i + bigEventsPerRow);
        const rowHTML = `
          <div class="nzgdc-workshop-row nzgdc-big-panel-row">
            ${rowEvents
              .map(
                (event) => `
              <div class="nzgdc-workshop-event nzgdc-big-event" data-panel-type="big">
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
      this.debug("Generating main event panel rows");
      for (let i = 0; i < mainEvents.length; i += mainEventsPerRow) {
        const rowEvents = mainEvents.slice(i, i + mainEventsPerRow);
        const rowHTML = `
          <div class="nzgdc-workshop-row nzgdc-main-panel-row">
            ${rowEvents
              .map(
                (event) => `
              <div class="nzgdc-workshop-event nzgdc-main-event" data-panel-type="main">
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
      `Generated ${rows.length} total rows (big panels first, then main panels)`,
    );
    return rows.join("");
  }

  /**
   * Determine panel type for Thursday schedule events
   * All Thursday events are workshops and should use big panels
   * @param {Object} event - Event object with speakers array
   * @returns {string} Panel type ("big" or "main")
   */
  determinePanelType(event) {
    // Thursday schedule: all events are workshops, use big panels
    return "big";
  }

  /**
   * Load individual event content within a time block with hierarchical organization
   * @param {HTMLElement} eventsContainer - Container for events
   * @param {Array} events - Events to load (already sorted by panel type)
   */
  async loadEventsInTimeBlock(eventsContainer, events) {
    // Separate events by panel type to match the HTML structure
    const bigEvents = events.filter(
      (event) => this.determinePanelType(event) === "big",
    );
    const mainEvents = events.filter(
      (event) => this.determinePanelType(event) === "main",
    );

    this.debug(
      `Loading events: ${bigEvents.length} big events, ${mainEvents.length} main events`,
    );

    // Load Big event panels first
    const bigEventElements = eventsContainer.querySelectorAll(
      '.nzgdc-workshop-event[data-panel-type="big"]',
    );

    for (
      let i = 0;
      i < Math.min(bigEvents.length, bigEventElements.length);
      i++
    ) {
      const event = bigEvents[i];
      const eventElement = bigEventElements[i];

      try {
        await this.loadSingleEventInContainer(eventElement, event, "big");
        this.debug(`Loaded big event: ${event.title}`);
      } catch (error) {
        console.error(`Error loading big event ${event.id}:`, error);
        this.showEventLoadError(eventElement, event.title);
      }
    }

    // Load Main event panels after Big panels
    const mainEventElements = eventsContainer.querySelectorAll(
      '.nzgdc-workshop-event[data-panel-type="main"]',
    );

    for (
      let i = 0;
      i < Math.min(mainEvents.length, mainEventElements.length);
      i++
    ) {
      const event = mainEvents[i];
      const eventElement = mainEventElements[i];

      try {
        await this.loadSingleEventInContainer(eventElement, event, "main");
        this.debug(`Loaded main event: ${event.title}`);
      } catch (error) {
        console.error(`Error loading main event ${event.id}:`, error);
        this.showEventLoadError(eventElement, event.title);
      }
    }
  }

  /**
   * Load a single event in its container element
   * @param {HTMLElement} eventElement - Container element for the event
   * @param {Object} event - Event data
   * @param {string} expectedPanelType - Expected panel type for validation
   */
  async loadSingleEventInContainer(eventElement, event, expectedPanelType) {
    if (this.loadedWorkshops.has(event.id)) {
      this.debug(`Event ${event.id} already loaded, skipping`);
      return;
    }

    this.debug(
      `Loading single event: ${event.id} as ${expectedPanelType} panel`,
    );

    try {
      // Validate panel type matches expectation
      const actualPanelType = this.determinePanelType(event);
      if (actualPanelType !== expectedPanelType) {
        this.debug(
          `Panel type mismatch for ${event.id}: expected ${expectedPanelType}, got ${actualPanelType}`,
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
        expectedPanelType, // Use expected panel type instead of "auto"
        "schedule",
      );

      // Replace loading placeholder with actual event panel
      eventElement.innerHTML = "";
      eventElement.appendChild(eventPanel);

      this.loadedWorkshops.add(event.id);
      this.debug(`Successfully loaded ${expectedPanelType} event: ${event.id}`);
    } catch (error) {
      console.error(`Failed to load event ${event.id}:`, error);
      this.showEventLoadError(eventElement, event.title);
    }
  }

  /**
   * Show error state for individual event
   * @param {HTMLElement} eventElement - Event container element
   * @param {string} eventTitle - Event title for error message
   */
  showEventLoadError(eventElement, eventTitle) {
    eventElement.innerHTML = `
      <div class="nzgdc-event-error">
        <div class="nzgdc-error-title">Unable to load event</div>
        <div class="nzgdc-error-subtitle">${eventTitle}</div>
        <div class="nzgdc-error-details">Please try refreshing the page</div>
      </div>
    `;
  }

  async loadWorkshopContent() {
    try {
      if (this.isDestroyed) {
        console.warn(
          "[NZGDC Widget] Cannot load workshop content - generator is destroyed",
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
        // Initialize event loader if not already done
        this.initializeEventLoader();
        if (!this.eventLoader) {
          throw new Error("UnifiedEventLoader not available");
        }

        // Update existing panel
        this.eventLoader.updateEventPanel(eventPanel, eventData, "thursday");
      } else {
        // Create new panel if none exists - Thursday workshops are always big panels
        console.log(
          `[Thursday] Creating BIG panel for workshop: ${eventId}`,
          eventData,
        );
        // Initialize event loader if not already done
        this.initializeEventLoader();
        if (!this.eventLoader) {
          throw new Error("UnifiedEventLoader not available");
        }

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

      // Initialize event loader if not already done
      this.initializeEventLoader();
      if (!this.eventLoader) {
        throw new Error("UnifiedEventLoader not available");
      }

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

    // Check if we're using dynamic time blocks or legacy layout
    const timeBlocks = this.container.querySelectorAll(".nzgdc-time-category");
    if (timeBlocks.length > 0) {
      this.debug("Using dynamic filtering for time blocks");
      this.filterDynamicEventsByCategory(categoryKey);
    } else {
      this.debug("Using legacy filtering for event panels");
      this.applyEventFiltering(categoryKey);
    }
  }

  // Reset filter and show all events
  resetFilter() {
    this.debug("Resetting Thursday filter - showing all events");
    this.currentFilterCategory = null;

    // Check if we're using dynamic time blocks or legacy layout
    const timeBlocks = this.container.querySelectorAll(".nzgdc-time-category");
    if (timeBlocks.length > 0) {
      this.debug("Resetting dynamic filter for time blocks");
      this.resetDynamicFilter();
    } else {
      this.debug("Resetting legacy filter for event panels");
      this.clearEventFiltering();
    }
  }

  // Apply filtering to event panels - grey out non-matching events
  applyEventFiltering(categoryKey) {
    // Get all event panels in Thursday schedule (new dynamic system)
    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-workshop-event[data-category], .nzgdc-event-panel-container[data-event-id], .nzgdc-event-panel-big",
    );

    this.debug(`Found ${eventPanels.length} Thursday event panels to filter`);

    eventPanels.forEach((panel) => {
      // Remove any existing filter classes
      panel.classList.remove("filtered-out", "filtered-in");

      // Get event category from data-category attribute (new system)
      const eventCategoryKey = panel.getAttribute("data-category");

      if (!eventCategoryKey) {
        this.debug(`No category data found for panel, skipping filter`);
        return;
      }

      // Check if event matches filter
      if (eventCategoryKey === categoryKey) {
        // Event matches filter - highlight it
        panel.classList.add("filtered-in");
        this.debug(
          `✅ Thursday event with category ${eventCategoryKey} matches filter ${categoryKey} - HIGHLIGHTED`,
        );
      } else {
        // Event doesn't match filter - grey it out
        panel.classList.add("filtered-out");
        this.debug(
          `❌ Thursday event filtered out (${eventCategoryKey} !== ${categoryKey}) - GREYED OUT`,
        );
      }
    });

    this.debug(`Thursday filtering applied: ${categoryKey}`);
  }

  // Clear all event filtering - show all events normally
  /**
   * Filter events by category using dynamic time blocks with panel type hierarchy
   * @param {string} categoryKey - Category to filter by
   */
  filterDynamicEventsByCategory(categoryKey) {
    if (!categoryKey || categoryKey === "all") {
      this.resetDynamicFilter();
      return;
    }

    this.debug(`Filtering dynamic events by category: ${categoryKey}`);

    const timeBlocks = this.container.querySelectorAll(".nzgdc-time-category");

    timeBlocks.forEach((timeBlock) => {
      const timeBlockData = timeBlock._timeBlockData;
      if (!timeBlockData) return;

      // Filter events in this time block
      const filteredEvents = timeBlockData.events.filter(
        (event) =>
          event.categoryKey === categoryKey || event.category === categoryKey,
      );

      // Hide/show time block based on filtered results
      if (filteredEvents.length === 0) {
        timeBlock.style.display = "none";
      } else {
        timeBlock.style.display = "block";

        // Update events container with filtered events (maintaining panel type hierarchy)
        const eventsContainer = this.timeManager.getEventsContainer(timeBlock);
        if (eventsContainer) {
          // Note: filteredEvents are already sorted by panel type from timeBlockData.events
          this.generateEventPanelsForTimeBlock(filteredEvents)
            .then((html) => {
              eventsContainer.innerHTML = html;
              return this.loadEventsInTimeBlock(
                eventsContainer,
                filteredEvents,
              );
            })
            .catch((error) => {
              console.error("Error updating filtered events:", error);
            });
        }
      }
    });
  }

  /**
   * Reset dynamic event filtering with panel type hierarchy
   */
  resetDynamicFilter() {
    this.debug("Resetting dynamic event filter");

    const timeBlocks = this.container.querySelectorAll(".nzgdc-time-category");

    timeBlocks.forEach((timeBlock) => {
      timeBlock.style.display = "block";

      const timeBlockData = timeBlock._timeBlockData;
      if (!timeBlockData) return;

      // Restore all events in this time block (already sorted by panel type hierarchy)
      const eventsContainer = this.timeManager.getEventsContainer(timeBlock);
      if (eventsContainer) {
        this.generateEventPanelsForTimeBlock(timeBlockData.events)
          .then((html) => {
            eventsContainer.innerHTML = html;
            return this.loadEventsInTimeBlock(
              eventsContainer,
              timeBlockData.events,
            );
          })
          .catch((error) => {
            console.error("Error restoring events:", error);
          });
      }
    });
  }

  clearEventFiltering() {
    const eventPanels = this.container.querySelectorAll(
      ".nzgdc-workshop-event, .nzgdc-event-panel-container, .nzgdc-event-panel-big",
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
