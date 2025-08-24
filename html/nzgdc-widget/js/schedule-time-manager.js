// NZGDC Schedule Time Manager
// Handles dynamic organization of events into chronological time blocks
// Implements proper separation of concerns with ID + Class targeting

// Prevent multiple declarations when loaded by multiple entry points
if (typeof window !== "undefined" && window.ScheduleTimeManager) {
  console.log(
    "[NZGDC Schedule Time Manager] ScheduleTimeManager already loaded, skipping redeclaration",
  );
} else {
  class ScheduleTimeManager {
    constructor() {
      this.timeBlockCounter = 0; // Counter for generating unique IDs
      this.debug = false;
    }

    /**
     * Enable debug logging
     * @param {boolean} enabled - Whether to enable debug logging
     */
    enableDebug(enabled = true) {
      this.debug = enabled;
    }

    /**
     * Log debug messages if debugging is enabled
     * @param {...any} args - Arguments to log
     */
    log(...args) {
      if (this.debug) {
        console.log("[NZGDC Schedule Time Manager]", ...args);
      }
    }

    /**
     * Generate unique ID for time block containers
     * @returns {string} Unique identifier
     */
    generateTimeBlockId() {
      return `${Date.now()}-${++this.timeBlockCounter}`;
    }

    /**
     * Parse time string to minutes for comparison
     * @param {string} timeStr - Time string (e.g., "09:00", "14:30")
     * @returns {number} Minutes since midnight
     */
    parseTimeToMinutes(timeString) {
      if (!timeString || typeof timeString !== "string") {
        console.warn("parseTimeToMinutes: invalid timeString:", timeString);
        return 0;
      }

      const parts = timeString.split(":");
      if (parts.length !== 2) {
        console.warn("parseTimeToMinutes: invalid time format:", timeString);
        return 0;
      }

      const [hours, minutes] = parts.map(Number);
      if (isNaN(hours) || isNaN(minutes)) {
        console.warn(
          "parseTimeToMinutes: non-numeric time components:",
          timeString,
        );
        return 0;
      }

      return hours * 60 + minutes;
    }

    /**
     * Format time string for display
     * @param {string} timeStr - Time string (e.g., "09:00")
     * @returns {string} Formatted time (e.g., "9.00am")
     */
    formatTimeForDisplay(timeStr) {
      if (!timeStr) return "TBA";

      const [hours, minutes] = timeStr.split(":").map(Number);
      const period = hours >= 12 ? "pm" : "am";
      const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
      const displayMinutes = minutes.toString().padStart(2, "0");

      return `${displayHours}.${displayMinutes}${period}`;
    }

    /**
     * Calculate event duration in minutes
     * @param {string} startTime - Start time (e.g., "09:00")
     * @param {string} endTime - End time (e.g., "10:00")
     * @returns {number} Duration in minutes
     */
    calculateDuration(startTime, endTime) {
      if (!startTime || !endTime) return 0;
      const startMinutes = this.parseTimeToMinutes(startTime);
      const endMinutes = this.parseTimeToMinutes(endTime);
      return Math.max(0, endMinutes - startMinutes);
    }

    /**
     * Group events by their start times into time blocks
     * @param {Array} events - Array of event objects with startTime and endTime
     * @returns {Array} Array of time block objects
     */
    groupEventsByTimeBlocks(events) {
      this.log("Grouping events into time blocks:", events.length, "events");

      // Filter events that have valid start times and log invalid ones
      const validEvents = events.filter((event) => {
        if (!event.startTime) {
          console.warn(
            "Event missing startTime:",
            event.id || "unknown",
            event.title || "untitled",
          );
          return false;
        }
        // Validate time format (HH:MM)
        if (!/^\d{1,2}:\d{2}$/.test(event.startTime)) {
          console.warn(
            "Event has invalid startTime format:",
            event.startTime,
            "for event:",
            event.id || "unknown",
          );
          return false;
        }
        return true;
      });
      this.log("Valid events with start times:", validEvents.length);

      // Group events by start time
      const timeGroups = new Map();

      validEvents.forEach((event) => {
        const startTime = event.startTime;
        if (!timeGroups.has(startTime)) {
          timeGroups.set(startTime, []);
        }
        timeGroups.get(startTime).push(event);
      });

      this.log("Time groups created:", timeGroups.size, "unique start times");

      // Convert to time blocks and sort chronologically
      const timeBlocks = Array.from(timeGroups.entries())
        .map(([startTime, blockEvents]) => {
          // Sort events within each time block
          const sortedEvents = this.sortEventsWithinTimeBlock(blockEvents);

          // Calculate the end time for this block (latest end time among all events)
          let endTime = null;
          sortedEvents.forEach((event) => {
            if (event.endTime) {
              if (
                !endTime ||
                this.parseTimeToMinutes(event.endTime) >
                  this.parseTimeToMinutes(endTime)
              ) {
                endTime = event.endTime;
              }
            }
          });

          // Fallback: if no endTime found, estimate based on startTime + 1 hour
          if (!endTime) {
            const startMinutes = this.parseTimeToMinutes(startTime);
            const endMinutes = startMinutes + 60; // Add 1 hour as default
            const endHour = Math.floor(endMinutes / 60);
            const endMin = endMinutes % 60;
            endTime = `${endHour.toString().padStart(2, "0")}:${endMin.toString().padStart(2, "0")}`;
          }

          // Determine the time range for this block
          const timeRange = this.calculateTimeBlockRange(sortedEvents);
          const theme = this.determineTimeBlockTheme(startTime);

          return {
            id: `time-block-${startTime.replace(":", "")}`,
            uniqueId: this.generateTimeBlockId(),
            startTime: startTime,
            endTime: endTime,
            timeRange: timeRange,
            title: this.generateTimeBlockTitle(startTime, timeRange),
            theme: theme,
            events: sortedEvents,
          };
        })
        .sort(
          (a, b) =>
            this.parseTimeToMinutes(a.startTime) -
            this.parseTimeToMinutes(b.startTime),
        );

      this.log("Created time blocks:", timeBlocks.length);
      timeBlocks.forEach((block) => {
        this.log(`  ${block.title}: ${block.events.length} events`);
      });

      return timeBlocks;
    }

    /**
     * Sort events within a time block by Panel Type > Duration > Alphabetical
     * @param {Array} events - Events in the same time block
     * @returns {Array} Sorted events
     */
    sortEventsWithinTimeBlock(events) {
      return events.sort((a, b) => {
        // Determine panel types based on speaker count
        const panelTypeA = this.determinePanelType(a);
        const panelTypeB = this.determinePanelType(b);

        // First, sort by panel type (Big panels first, then Main panels)
        if (panelTypeA !== panelTypeB) {
          return panelTypeA === "big" ? -1 : 1; // Big panels (-1) come before Main panels (1)
        }

        // Within the same panel type, sort by duration (longest first)
        const durationA = this.calculateDuration(a.startTime, a.endTime);
        const durationB = this.calculateDuration(b.startTime, b.endTime);

        if (durationA !== durationB) {
          return durationB - durationA;
        }

        // If same panel type and same duration, sort alphabetically by title
        const titleA = (a.title || "").toLowerCase();
        const titleB = (b.title || "").toLowerCase();
        return titleA.localeCompare(titleB);
      });
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
     * Calculate the time range for a time block
     * @param {Array} events - Events in the time block
     * @returns {string} Time range (e.g., "9.00am - 10.00am")
     */
    calculateTimeBlockRange(events) {
      if (events.length === 0) return "TBA";

      const startTime = events[0].startTime;
      if (!startTime) return "TBA";

      // Find the latest end time among all events in this block
      let latestEndTime = events[0].endTime;
      events.forEach((event) => {
        if (
          event.endTime &&
          latestEndTime &&
          this.parseTimeToMinutes(event.endTime) >
            this.parseTimeToMinutes(latestEndTime)
        ) {
          latestEndTime = event.endTime;
        } else if (event.endTime && !latestEndTime) {
          latestEndTime = event.endTime;
        }
      });

      const formattedStart = this.formatTimeForDisplay(startTime);
      const formattedEnd = latestEndTime
        ? this.formatTimeForDisplay(latestEndTime)
        : "TBA";

      return `${formattedStart} - ${formattedEnd}`;
    }

    /**
     * Generate a descriptive title for a time block
     * @param {string} startTime - Start time of the block
     * @param {string} timeRange - Formatted time range
     * @returns {string} Time block title
     */
    generateTimeBlockTitle(startTime, timeRange) {
      const hour = parseInt(startTime.split(":")[0], 10);

      let periodDescription = "";
      if (hour < 10) {
        periodDescription = "Early Morning";
      } else if (hour < 12) {
        periodDescription = "Late Morning";
      } else if (hour < 15) {
        periodDescription = "Early Afternoon";
      } else if (hour < 18) {
        periodDescription = "Late Afternoon";
      } else {
        periodDescription = "Evening";
      }

      return `${periodDescription} Sessions`;
    }

    /**
     * Determine theme for time block styling
     * @param {string} startTime - Start time of the block
     * @returns {string} Theme identifier for styling
     */
    determineTimeBlockTheme(startTime) {
      const hour = parseInt(startTime.split(":")[0], 10);

      // Alternate themes based on time periods for visual distinction
      if (hour < 12) {
        return hour < 10 ? "early-morning" : "late-morning";
      } else {
        return hour < 15 ? "early-afternoon" : "late-afternoon";
      }
    }

    /**
     * Generate dynamic theme class based on time data (SoC compliant)
     * Uses actual time data to create semantic, data-driven CSS classes
     * @param {string} startTime - Start time in HH:MM format
     * @param {string} endTime - End time in HH:MM format
     * @returns {string} Dynamic theme class for CSS targeting
     */
    generateDynamicThemeClass(startTime, endTime) {
      // Add comprehensive safety checks and debugging
      if (!startTime || !endTime) {
        console.error("generateDynamicThemeClass: missing time values", {
          startTime,
          endTime,
          stack: new Error().stack,
        });
        // Fallback to a default theme class
        return "default-short";
      }

      // Validate time format
      const timePattern = /^\d{1,2}:\d{2}$/;
      if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
        console.error("generateDynamicThemeClass: invalid time format", {
          startTime,
          endTime,
        });
        return "default-short";
      }

      let startHour, endHour;
      try {
        startHour = parseInt(startTime.split(":")[0], 10);
        endHour = parseInt(endTime.split(":")[0], 10);

        if (isNaN(startHour) || isNaN(endHour)) {
          throw new Error("Hours are not valid numbers");
        }
      } catch (error) {
        console.error("generateDynamicThemeClass: error parsing time", {
          startTime,
          endTime,
          error,
        });
        return "default-short";
      }

      // Generate semantic class based on actual time data
      let timeOfDay, timeRange;

      if (startHour < 10) {
        timeOfDay = "early-morning";
      } else if (startHour < 12) {
        timeOfDay = "late-morning";
      } else if (startHour < 15) {
        timeOfDay = "early-afternoon";
      } else if (startHour < 18) {
        timeOfDay = "late-afternoon";
      } else {
        timeOfDay = "evening";
      }

      // Create time range identifier for more specific targeting
      let startMinutes, endMinutes, durationMinutes;
      try {
        startMinutes = startHour * 60 + parseInt(startTime.split(":")[1], 10);
        endMinutes = endHour * 60 + parseInt(endTime.split(":")[1], 10);

        if (isNaN(startMinutes) || isNaN(endMinutes)) {
          throw new Error("Minutes calculation failed");
        }

        durationMinutes = endMinutes - startMinutes;

        // Handle overnight events or invalid durations
        if (durationMinutes <= 0) {
          console.warn(
            "generateDynamicThemeClass: invalid duration, defaulting to 60 minutes",
            { startTime, endTime, durationMinutes },
          );
          durationMinutes = 60; // Default to 1 hour
        }
      } catch (error) {
        console.error("generateDynamicThemeClass: error calculating duration", {
          startTime,
          endTime,
          error,
        });
        durationMinutes = 60; // Default to 1 hour
      }

      if (durationMinutes <= 30) {
        timeRange = "short";
      } else if (durationMinutes <= 90) {
        timeRange = "medium";
      } else {
        timeRange = "long";
      }

      const themeClass = `${timeOfDay}-${timeRange}`;

      this.log(
        `Generated theme class: ${themeClass} for ${startTime}-${endTime} (${durationMinutes}min)`,
      );

      return themeClass;
    }

    /**
     * Create HTML element for time block container with separation of concerns
     * @param {Object} timeBlock - Time block data
     * @param {string} widgetType - Widget type (schedule, morning, afternoon)
     * @returns {HTMLElement} Time block container element
     */
    createTimeBlockContainer(timeBlock, widgetType = "schedule") {
      const containerEl = document.createElement("div");

      // Validate timeBlock data before processing
      if (!timeBlock || !timeBlock.startTime || !timeBlock.endTime) {
        console.error("createTimeBlockContainer: Invalid timeBlock data", {
          timeBlock,
          widgetType,
          stack: new Error().stack,
        });
        // Create a fallback container to prevent complete failure
        containerEl.className =
          "nzgdc-time-category nzgdc-time-category-default-short";
        containerEl.innerHTML = `
          <div class="nzgdc-event-times nzgdc-event-times-default-short">
            <div class="nzgdc-session-schedule">
              <div class="nzgdc-session-times">TBA</div>
              <div class="nzgdc-session-title">Invalid Time Block</div>
            </div>
            <div class="nzgdc-underline"></div>
          </div>
          <div class="nzgdc-scheduled-events"></div>
        `;
        return {
          element: containerEl,
          uniqueId: "fallback",
          themeClass: "default-short",
        };
      }

      // Generate dynamic theme class based on actual time data (SoC compliant)
      const dynamicThemeClass = this.generateDynamicThemeClass(
        timeBlock.startTime,
        timeBlock.endTime,
      );

      // SoC: Use unique ID for JavaScript targeting, classes for CSS styling
      const uniqueId = timeBlock.uniqueId || this.generateTimeBlockId();
      containerEl.id = `time-category-container-${uniqueId}`;
      containerEl.className = `nzgdc-time-category nzgdc-time-category-${dynamicThemeClass}`;

      // Data attributes for additional targeting and debugging
      containerEl.setAttribute("data-time-slot", timeBlock.id);
      containerEl.setAttribute("data-start-time", timeBlock.startTime);
      containerEl.setAttribute("data-end-time", timeBlock.endTime);
      containerEl.setAttribute("data-theme", dynamicThemeClass);
      containerEl.setAttribute("data-widget-type", widgetType);

      // Determine CSS class prefix based on widget type
      let eventsContainerClass = "nzgdc-scheduled-events";
      let sessionScheduleClass = "nzgdc-session-schedule";
      let eventTimesClass = "nzgdc-event-times";

      if (widgetType === "morning") {
        sessionScheduleClass = "nzgdc-morning-session-schedule";
        eventTimesClass = "nzgdc-morning-event-times";
        eventsContainerClass = "nzgdc-scheduled-morning-events";
      } else if (widgetType === "afternoon") {
        sessionScheduleClass = "nzgdc-afternoon-session-schedule";
        eventTimesClass = "nzgdc-afternoon-event-times";
        eventsContainerClass = "nzgdc-scheduled-afternoon-events";
      } else if (widgetType === "schedule" || widgetType === "thursday") {
        sessionScheduleClass = "nzgdc-session-schedule";
        eventTimesClass = "nzgdc-event-times";
        eventsContainerClass = "nzgdc-scheduled-workshops"; // Legacy Thursday expects workshops
      }

      containerEl.innerHTML = `
        <!-- Event Times Container with SoC: ID for JS, classes for CSS -->
        <div class="${eventTimesClass} ${eventTimesClass}-${dynamicThemeClass}" id="time-block-inner-${uniqueId}">
          <div class="${sessionScheduleClass}" id="time-block-schedule-${uniqueId}">
            <div class="nzgdc-session-times" id="time-block-times-${uniqueId}">${timeBlock.timeRange}</div>
            <div class="nzgdc-session-title" id="time-block-title-${uniqueId}">${timeBlock.title}</div>
          </div>
          <div class="nzgdc-underline" id="time-block-underline-${uniqueId}"></div>
        </div>

        <!-- Events Container -->
        <div class="${eventsContainerClass}" id="time-block-events-${uniqueId}">
          <!-- Event panels will be inserted here by the schedule generator -->
        </div>
      `;

      // Store time block data on container for future reference (SoC compliant)
      containerEl.timeBlockData = timeBlock;

      this.log(
        `Created dynamic time block container: ${timeBlock.title} (${timeBlock.events.length} events) with theme: ${dynamicThemeClass}`,
      );

      return { element: containerEl, uniqueId, themeClass: dynamicThemeClass };
    }

    /**
     * Update time block container with new data
     * @param {HTMLElement} containerEl - Time block container element
     * @param {Object} timeBlock - Updated time block data
     * @returns {boolean} Success status
     */
    updateTimeBlockContainer(containerEl, timeBlock) {
      try {
        // Extract unique ID from existing container
        const uniqueId = this.extractUniqueIdFromTimeBlock(containerEl);

        if (!uniqueId) {
          this.log(
            "Warning: Could not extract unique ID from time block, falling back to class targeting",
          );
          return this.updateTimeBlockContainerLegacy(containerEl, timeBlock);
        }

        // ID-based targeting for precise updates
        const timesEl = containerEl.querySelector(
          `#time-block-times-${uniqueId}`,
        );
        const titleEl = containerEl.querySelector(
          `#time-block-title-${uniqueId}`,
        );

        if (timesEl) {
          timesEl.textContent = timeBlock.timeRange;
        }

        if (titleEl) {
          titleEl.textContent = timeBlock.title;
        }

        // Update data attributes
        containerEl.setAttribute("data-time-slot", timeBlock.id);
        containerEl.setAttribute("data-start-time", timeBlock.startTime);

        this.log(`Updated time block container: ${timeBlock.title}`);
        return true;
      } catch (error) {
        console.error(
          "[NZGDC Schedule Time Manager] Error updating time block container:",
          error,
        );
        return false;
      }
    }

    /**
     * Legacy fallback for updating time block containers without IDs
     * @param {HTMLElement} containerEl - Time block container element
     * @param {Object} timeBlock - Updated time block data
     * @returns {boolean} Success status
     */
    updateTimeBlockContainerLegacy(containerEl, timeBlock) {
      try {
        // Fallback to class-based targeting
        const timesEl = containerEl.querySelector(".nzgdc-session-times");
        const titleEl = containerEl.querySelector(".nzgdc-session-title");

        if (timesEl) {
          timesEl.textContent = timeBlock.timeRange;
        }

        if (titleEl) {
          titleEl.textContent = timeBlock.title;
        }

        // Update data attributes
        containerEl.setAttribute("data-time-slot", timeBlock.id);
        containerEl.setAttribute("data-start-time", timeBlock.startTime);

        this.log(`Updated time block container (legacy): ${timeBlock.title}`);
        return true;
      } catch (error) {
        console.error(
          "[NZGDC Schedule Time Manager] Error updating time block container (legacy):",
          error,
        );
        return false;
      }
    }

    /**
     * Extract unique ID from existing time block container
     * @param {HTMLElement} containerEl - Time block container element
     * @returns {string|null} Unique ID or null if not found
     */
    extractUniqueIdFromTimeBlock(containerEl) {
      // Try to find any element with an ID that contains our pattern
      const elementWithId = containerEl.querySelector('[id*="time-block-"]');
      if (elementWithId && elementWithId.id) {
        // Extract the unique ID from patterns like "time-block-container-{uniqueId}"
        const matches = elementWithId.id.match(
          /time-block-(?:container|schedule|times|title|underline|events)-(.+)$/,
        );
        return matches ? matches[1] : null;
      }
      return null;
    }

    /**
     * Get events container element from time block
     * @param {HTMLElement} timeBlockEl - Time block container element
     * @returns {HTMLElement|null} Events container element
     */
    getEventsContainer(timeBlockEl) {
      // SoC: Prefer ID-based targeting, fall back to class-based

      // First try to extract unique ID from container itself
      if (
        timeBlockEl.id &&
        timeBlockEl.id.startsWith("time-category-container-")
      ) {
        const uniqueId = timeBlockEl.id.replace("time-category-container-", "");
        return timeBlockEl.querySelector(`#time-block-events-${uniqueId}`);
      }

      // Legacy ID extraction for backward compatibility
      const uniqueId = this.extractUniqueIdFromTimeBlock(timeBlockEl);
      if (uniqueId) {
        return timeBlockEl.querySelector(`#time-block-events-${uniqueId}`);
      }

      // Fallback to class-based targeting for legacy containers
      return (
        timeBlockEl.querySelector(".nzgdc-scheduled-events") ||
        timeBlockEl.querySelector(".nzgdc-scheduled-workshops") ||
        timeBlockEl.querySelector(".nzgdc-scheduled-morning-events") ||
        timeBlockEl.querySelector(".nzgdc-scheduled-afternoon-events")
      );
    }

    /**
     * Process events for a specific widget type and organize into time blocks
     * @param {Array} events - Raw event data
     * @param {string} widgetType - Widget type (schedule, morning, afternoon)
     * @returns {Array} Array of time block container elements
     */
    processEventsIntoTimeBlocks(events, widgetType = "schedule") {
      this.log(
        `Processing ${events.length} events for ${widgetType} widget into time blocks`,
      );

      // Filter events based on widget type if needed
      let filteredEvents = events;

      if (widgetType === "morning") {
        filteredEvents = events.filter((event) => {
          if (!event.startTime) {
            console.warn(
              "Morning filter: Event missing startTime:",
              event.id || "unknown",
            );
            return false;
          }
          try {
            const hour = parseInt(event.startTime.split(":")[0], 10);
            if (isNaN(hour)) {
              console.warn(
                "Morning filter: Invalid hour in startTime:",
                event.startTime,
                "for event:",
                event.id || "unknown",
              );
              return false;
            }
            return hour < 12;
          } catch (error) {
            console.warn(
              "Morning filter: Error parsing startTime:",
              event.startTime,
              error,
            );
            return false;
          }
        });
      } else if (widgetType === "afternoon") {
        filteredEvents = events.filter((event) => {
          if (!event.startTime) {
            console.warn(
              "Afternoon filter: Event missing startTime:",
              event.id || "unknown",
            );
            return false;
          }
          try {
            const hour = parseInt(event.startTime.split(":")[0], 10);
            if (isNaN(hour)) {
              console.warn(
                "Afternoon filter: Invalid hour in startTime:",
                event.startTime,
                "for event:",
                event.id || "unknown",
              );
              return false;
            }
            return hour >= 12;
          } catch (error) {
            console.warn(
              "Afternoon filter: Error parsing startTime:",
              event.startTime,
              error,
            );
            return false;
          }
        });
      }

      this.log(
        `Filtered to ${filteredEvents.length} events for ${widgetType} widget`,
      );

      // Group events into time blocks
      const timeBlocks = this.groupEventsByTimeBlocks(filteredEvents);

      // Add index to time blocks for alternating theme pattern
      timeBlocks.forEach((timeBlock, index) => {
        timeBlock.index = index;
      });

      // Create container elements with proper SoC structure
      const containerElements = timeBlocks.map((timeBlock) => {
        const containerResult = this.createTimeBlockContainer(
          timeBlock,
          widgetType,
        );
        return containerResult.element;
      });

      this.log(`Created ${containerElements.length} time block containers`);

      // Store time block data on container elements for future reference
      containerElements.forEach((containerEl, index) => {
        containerEl._timeBlockData = timeBlocks[index];
      });

      return containerElements;
    }

    /**
     * Refresh time blocks when event data changes
     * @param {HTMLElement} scheduleContainer - Main schedule container
     * @param {Array} newEvents - Updated event data
     * @param {string} widgetType - Widget type
     * @returns {boolean} Success status
     */
    refreshTimeBlocks(scheduleContainer, newEvents, widgetType = "schedule") {
      try {
        this.log(`Refreshing time blocks with ${newEvents.length} events`);

        // Process new events into time blocks
        const newTimeBlocks = this.groupEventsByTimeBlocks(newEvents);

        // Find existing time block containers
        const existingContainers = scheduleContainer.querySelectorAll(
          ".nzgdc-time-category",
        );

        // Update existing containers or create new ones as needed
        const updatedContainers = [];

        newTimeBlocks.forEach((newTimeBlock) => {
          // Try to find existing container for this time slot
          let existingContainer = null;
          existingContainers.forEach((container) => {
            const existingStartTime = container.getAttribute("data-start-time");
            if (existingStartTime === newTimeBlock.startTime) {
              existingContainer = container;
            }
          });

          if (existingContainer) {
            // Update existing container
            this.updateTimeBlockContainer(existingContainer, newTimeBlock);
            existingContainer._timeBlockData = newTimeBlock;
            updatedContainers.push(existingContainer);
          } else {
            // Create new container
            const newContainer = this.createTimeBlockContainer(
              newTimeBlock,
              widgetType,
            );
            updatedContainers.push(newContainer);
          }
        });

        // Remove containers that are no longer needed
        existingContainers.forEach((container) => {
          const startTime = container.getAttribute("data-start-time");
          const stillNeeded = newTimeBlocks.some(
            (block) => block.startTime === startTime,
          );

          if (!stillNeeded) {
            container.remove();
            this.log(`Removed obsolete time block container for ${startTime}`);
          }
        });

        // Add new containers to schedule
        updatedContainers.forEach((container) => {
          if (!container.parentNode) {
            scheduleContainer.appendChild(container);
            this.log(`Added new time block container to schedule`);
          }
        });

        this.log(`Time block refresh completed successfully`);
        return true;
      } catch (error) {
        console.error(
          "[NZGDC Schedule Time Manager] Error refreshing time blocks:",
          error,
        );
        return false;
      }
    }

    /**
     * Get debug information about current time blocks including panel type distribution
     * @param {HTMLElement} scheduleContainer - Schedule container to analyze
     * @returns {Object} Debug information
     */
    getDebugInfo(scheduleContainer) {
      const timeBlocks = scheduleContainer.querySelectorAll(
        ".nzgdc-time-category",
      );
      const debugInfo = {
        totalTimeBlocks: timeBlocks.length,
        timeBlocks: [],
      };

      timeBlocks.forEach((container, index) => {
        const timeBlockData = container._timeBlockData;
        const startTime = container.getAttribute("data-start-time");
        const uniqueId = this.extractUniqueIdFromTimeBlock(container);

        let panelTypeBreakdown = { big: 0, main: 0 };
        if (timeBlockData && timeBlockData.events) {
          timeBlockData.events.forEach((event) => {
            const panelType = this.determinePanelType(event);
            panelTypeBreakdown[panelType]++;
          });
        }

        debugInfo.timeBlocks.push({
          index,
          startTime,
          uniqueId,
          hasTimeBlockData: !!timeBlockData,
          eventsCount: timeBlockData ? timeBlockData.events.length : "unknown",
          title: timeBlockData ? timeBlockData.title : "unknown",
          panelTypes: panelTypeBreakdown,
          eventDetails: timeBlockData
            ? timeBlockData.events.map((event) => ({
                title: event.title,
                panelType: this.determinePanelType(event),
                duration: this.calculateDuration(
                  event.startTime,
                  event.endTime,
                ),
                speakers: event.speakers ? event.speakers.length : 0,
              }))
            : [],
        });
      });

      return debugInfo;
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ScheduleTimeManager;
  } else if (typeof window !== "undefined") {
    window.ScheduleTimeManager = ScheduleTimeManager;
  }
}
