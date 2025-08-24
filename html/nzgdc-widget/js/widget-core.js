// NZGDC Schedule Widget - Main Widget Class

class NZGDCScheduleWidget {
  constructor(elementId, options = {}, dataManager = null) {
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

    this.dataManager = dataManager; // Store DataManager instance
    this.uniqueId = this.generateUniqueId();
    this.initialized = false;

    // Resource tracking for cleanup
    this.eventListeners = new Map();
    this.observers = new Set();
    this.abortController = new AbortController();
    this.scheduleGenerator = null;
    this.dropdownController = null;

    // Filter state
    this.currentFilterCategory = null;
    this.currentCategoryKey = "ALL";

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
      this.initializeDropdownController();

      this.initialized = true;
      this.debug("Widget initialization completed successfully");
    } catch (error) {
      console.error("[NZGDC Widget] Failed to initialize widget:", error);
      this.showInitializationError(error);
    }
  }

  validateDependencies() {
    const missing = [];

    if (!this.dataManager) {
      if (typeof window.SCHEDULE_DATA === "undefined") {
        missing.push("SCHEDULE_DATA");
      }
      if (typeof window.WORKSHOP_EVENTS === "undefined") {
        missing.push("WORKSHOP_EVENTS");
      }
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
            ${this.options.showFilters ? this.renderFiltersInline() : ""}
            <div id="schedule-content-${this.uniqueId}" class="nzgdc-thursday-schedule-widget"></div>
            ${this.options.showFooter ? this.renderFooter() : ""}
        `;
  }

  renderFiltersInline() {
    return `
      <div class="nzgdc-schedule-sub-navigation">
        <div class="nzgdc-filters-section">
          <div class="nzgdc-filters-label">
            <span class="nzgdc-filters-label-text">Filters:</span>
          </div>
          <div class="nzgdc-filters-value" data-dropdown-trigger="thursday-category-dropdown">
            <span class="nzgdc-filters-value-text">ALL EVENTS ▶</span>
          </div>
          ${this.generateCategoryDropdownHTML()}
        </div>
      </div>
    `;
  }

  // Generate dropdown HTML with all 11 categories
  generateCategoryDropdownHTML() {
    return `
      <div class="category-dropdown-backdrop" id="thursday-category-backdrop"></div>
      <div class="category-dropdown-overlay" id="thursday-category-dropdown">
        ${this.generateCategoryOptions()}
      </div>
    `;
  }

  // Generate category options HTML
  generateCategoryOptions() {
    const allCategories = [
      { key: "GAME_DESIGN", name: "Game Design" },
      { key: "ART", name: "Art" },
      { key: "PROGRAMMING", name: "Programming" },
      { key: "AUDIO", name: "Audio" },
      { key: "STORY_NARRATIVE", name: "Story & Narrative" },
      { key: "BUSINESS_MARKETING", name: "Business & Marketing" },
      { key: "CULTURE", name: "Culture" },
      { key: "PRODUCTION_QA", name: "Production & QA" },
      { key: "REALITIES_VR_AR_MR", name: "Realities (VR, AR, MR)" },
      { key: "DATA_TESTING_RESEARCH", name: "Data, Testing or Research" },
      { key: "SERIOUS_EDUCATIONAL", name: "Serious & Educational Games" },
    ];

    // Get categories that actually exist in the workshop events data
    const availableCategories = this.getAvailableCategories();

    // Filter to only show categories that exist in the data
    const categories = allCategories.filter((category) =>
      availableCategories.has(category.key),
    );

    this.debug(
      `Showing ${categories.length} available categories in dropdown:`,
      categories.map((c) => c.name),
    );

    // If no categories found, show all as fallback
    if (categories.length === 0) {
      this.debug(
        "No categories found in data, showing all categories as fallback",
      );
      return this.generateAllCategoryOptions(allCategories);
    }

    // Always add "All Events" option at the beginning
    const finalCategories = [{ key: "ALL", name: "All Events" }, ...categories];

    // Sort categories alphabetically by name, keeping "All Events" first
    const sortedCategories = finalCategories.sort((a, b) => {
      if (a.key === "ALL") return -1;
      if (b.key === "ALL") return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedCategories
      .map(
        (category) =>
          `<div class="category-dropdown-item" data-category="${category.key}" tabindex="0">
        ${category.name.toUpperCase()}
      </div>`,
      )
      .join("");
  }

  // Get categories that actually exist in the workshop events data
  getAvailableCategories() {
    const availableCategories = new Set();

    const workshopEvents = this.dataManager
      ? this.dataManager.getEventData()
      : window.WORKSHOP_EVENTS;

    if (workshopEvents) {
      Object.values(workshopEvents).forEach((event) => {
        if (event.categoryKey) {
          availableCategories.add(event.categoryKey);
        }
      });
    }

    this.debug(
      `Found ${availableCategories.size} available categories in workshop events:`,
      Array.from(availableCategories),
    );

    return availableCategories;
  }

  // Generate all category options as fallback
  generateAllCategoryOptions(allCategories) {
    this.debug("Using fallback: showing all categories");

    const finalCategories = [
      { key: "ALL", name: "All Events" },
      ...allCategories,
    ];

    return finalCategories
      .map(
        (category) =>
          `<div class="category-dropdown-item" data-category="${category.key}" tabindex="0">
        ${category.name.toUpperCase()}
      </div>`,
      )
      .join("");
  }

  // Update filter value text and background color when category is selected
  updateFilterValueText(categoryName) {
    const filterText = this.element.querySelector(".nzgdc-filters-value-text");
    const filterValue = this.element.querySelector(".nzgdc-filters-value");
    if (filterText && filterValue) {
      this.debug(
        "Updating filter value text and background for:",
        categoryName,
      );
      this.debug("Filter element found:", filterValue);

      // Remove all existing inline styles first
      filterValue.removeAttribute("style");

      // Remove all existing category classes
      filterValue.classList.remove(
        "category-all-events",
        "category-game-design",
        "category-art",
        "category-programming",
        "category-audio",
        "category-story-narrative",
        "category-business-marketing",
        "category-culture",
        "category-production-qa",
        "category-realities-vr-ar-mr",
        "category-data-testing-research",
        "category-serious-educational",
      );

      if (categoryName === "All Events" || !categoryName) {
        filterText.textContent = "ALL EVENTS ▶";
        filterValue.classList.add("category-all-events");
        this.currentCategoryKey = "ALL";
        // Remove active category data attribute for default state
        filterValue.removeAttribute("data-active-category");
        this.debug("Applied default white background via CSS class");
      } else {
        filterText.textContent = `${categoryName.toUpperCase()} ▶`;
        const categoryClass = this.getCategoryClassFromKey(
          this.currentCategoryKey,
        );
        filterValue.classList.add(categoryClass);
        // Set active category data attribute to prevent hover conflicts
        filterValue.setAttribute("data-active-category", categoryName);
        this.debug("Applied category class:", categoryClass);
        this.debug("Category key used:", this.currentCategoryKey);
        this.debug(
          "Element classes after update:",
          filterValue.classList.toString(),
        );
        this.debug(
          "Element has inline styles:",
          filterValue.hasAttribute("style"),
        );

        // Add a small delay to ensure CSS is applied
        setTimeout(() => {
          const computedStyle = window.getComputedStyle(filterValue);
          this.debug(
            "Computed background color:",
            computedStyle.backgroundColor,
          );
          this.debug("Computed color:", computedStyle.color);
        }, 50);
      }
    } else {
      this.debug("ERROR: Filter elements not found!", {
        filterText,
        filterValue,
      });
    }
  }

  initializeDropdownController() {
    const dropdown = this.element.querySelector("#thursday-category-dropdown");
    if (dropdown) {
      this.dropdownController = new ThursdayCategoryDropdownController();
      this.dropdownController.init(this, dropdown);
      this.debug("Thursday category dropdown controller initialized");
    }
  }

  applyFilter(categoryKey) {
    this.debug("Applying filter:", categoryKey);
    this.currentFilterCategory = categoryKey;

    if (
      this.scheduleGenerator &&
      this.scheduleGenerator.filterEventsByCategory
    ) {
      this.scheduleGenerator.filterEventsByCategory(categoryKey);
      this.debug("Filter applied successfully");
    }
  }

  // Clear category filter and show all events
  clearFilter() {
    this.debug("Clearing filter");
    this.currentFilterCategory = null;

    if (this.scheduleGenerator && this.scheduleGenerator.resetFilter) {
      this.scheduleGenerator.resetFilter();
      this.debug("Filter cleared successfully");
    }
  }

  // Get category colors for styling
  getCategoryColors(categoryKey) {
    const colors = {
      ALL: { background: "#ffffff", text: "#000000" },
      GAME_DESIGN: { background: "#ff4444", text: "#ffffff" },
      ART: { background: "#44ff44", text: "#000000" },
      PROGRAMMING: { background: "#4444ff", text: "#ffffff" },
      AUDIO: { background: "#ffaa00", text: "#000000" },
      STORY_NARRATIVE: { background: "#aa44ff", text: "#ffffff" },
      BUSINESS_MARKETING: { background: "#ff44aa", text: "#ffffff" },
      CULTURE: { background: "#44aaff", text: "#000000" },
      PRODUCTION_QA: { background: "#aaff44", text: "#000000" },
      REALITIES_VR_AR_MR: { background: "#ff8844", text: "#000000" },
      DATA_TESTING_RESEARCH: { background: "#8844ff", text: "#ffffff" },
      SERIOUS_EDUCATIONAL: { background: "#44ff88", text: "#000000" },
    };
    return colors[categoryKey] || colors.ALL;
  }

  // Get CSS class name from category key
  getCategoryClassFromKey(categoryKey) {
    const classMap = {
      ALL: "category-all-events",
      GAME_DESIGN: "category-game-design",
      ART: "category-art",
      PROGRAMMING: "category-programming",
      AUDIO: "category-audio",
      STORY_NARRATIVE: "category-story-narrative",
      BUSINESS_MARKETING: "category-business-marketing",
      CULTURE: "category-culture",
      PRODUCTION_QA: "category-production-qa",
      REALITIES_VR_AR_MR: "category-realities-vr-ar-mr",
      DATA_TESTING_RESEARCH: "category-data-testing-research",
      SERIOUS_EDUCATIONAL: "category-serious-educational",
    };
    return classMap[categoryKey] || "category-all-events";
  }

  // Update triangle state for dropdown
  updateTriangleState(isOpen) {
    const filterText = this.element.querySelector(".nzgdc-filters-value-text");
    if (filterText) {
      const currentText = filterText.textContent;
      if (isOpen) {
        filterText.textContent = currentText.replace("▶", "▼");
      } else {
        filterText.textContent = currentText.replace("▼", "▶");
      }
    }
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
      let scheduleData;
      let eventData;

      if (this.dataManager) {
        this.debug("Using DataManager for schedule initialization");

        // Get data from DataManager and create compatible structure
        const schedules = this.dataManager.getScheduleData();
        eventData = this.dataManager.getEventData();

        this.debug("Raw schedules from DataManager:", schedules);
        this.debug("Raw eventData from DataManager:", eventData);

        if (!schedules || schedules.length === 0) {
          throw new Error("No schedule data found in DataManager");
        }

        this.debug(`Found ${schedules.length} schedules in DataManager`);

        // Thursday widget should ONLY use Thursday schedule data
        const thursdaySchedule = schedules.find((schedule) => {
          if (schedule.date) {
            const scheduleDate = new Date(schedule.date);
            return (
              !isNaN(scheduleDate.getTime()) && scheduleDate.getDay() === 4
            );
          }
          return (
            schedule.title && schedule.title.toLowerCase().includes("thursday")
          );
        });

        if (thursdaySchedule) {
          this.debug("Found Thursday schedule, creating compatible structure");
          scheduleData = this.createCompatibleScheduleStructure(
            thursdaySchedule,
            eventData,
          );
        } else if (schedules.length === 1) {
          this.debug("Only one schedule available, assuming it's Thursday");
          scheduleData = this.createCompatibleScheduleStructure(
            schedules[0],
            eventData,
          );
        } else {
          throw new Error("No Thursday schedule found in DataManager");
        }

        this.debug("Compatible schedule structure created:", scheduleData);
      } else {
        this.debug("Using fallback static data");
        // Fallback to original static data
        scheduleData = window.SCHEDULE_DATA;
        eventData = window.WORKSHOP_EVENTS;

        if (!scheduleData) {
          throw new Error("Schedule data not found");
        }

        // Validate that static data has the expected timeSlots structure
        if (!scheduleData.timeSlots || !Array.isArray(scheduleData.timeSlots)) {
          this.debug(
            "Static scheduleData missing timeSlots, attempting to fix",
          );
          // If static data is malformed, try to create a compatible structure
          scheduleData = {
            id: "static-schedule",
            title: "Static Schedule",
            timeSlots: scheduleData.timeSlots || [],
          };
        }

        this.debug("Using static scheduleData:", scheduleData);
      }

      this.scheduleGenerator = new ScheduleGenerator(scheduleContainer);
      await this.scheduleGenerator.renderSchedule(scheduleData, eventData);

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

      // Clean up dropdown controller
      if (
        this.dropdownController &&
        typeof this.dropdownController.destroy === "function"
      ) {
        this.dropdownController.destroy();
      }
      this.dropdownController = null;

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

  /**
   * Refresh widget data and update display
   * @param {Object} newData - Optional new data to use for refresh
   */
  async refreshData(newData) {
    try {
      this.debug("Refreshing widget data...");

      // Prioritize the instance's DataManager first
      if (this.dataManager) {
        this.debug("Refreshing data via instance DataManager...");
        await this.dataManager.refreshData();
      } else if (
        window.dataManager &&
        typeof window.dataManager.refreshData === "function"
      ) {
        // Fallback to global DataManager if instance DataManager is not provided
        this.debug("Refreshing data via global DataManager...");
        await window.dataManager.refreshData();
      } else if (newData) {
        this.debug("Updating data with provided newData parameter...");
        if (newData.workshopEvents) {
          window.WORKSHOP_EVENTS = newData.workshopEvents;
        }
        if (newData.scheduleData) {
          window.SCHEDULE_DATA = newData.scheduleData;
        }
      } else {
        this.debug(
          "No DataManager (instance or global) or newData provided to refresh.",
        );
        return; // Nothing to refresh
      }

      // Determine which event data to use for refresh
      const currentEvents = this.dataManager
        ? this.dataManager.getEventData()
        : window.WORKSHOP_EVENTS;

      // Refresh schedule content if schedule generator is available
      if (
        this.scheduleGenerator &&
        typeof this.scheduleGenerator.refreshWorkshopContent === "function"
      ) {
        this.debug("Refreshing schedule generator content...");
        await this.scheduleGenerator.refreshWorkshopContent(currentEvents);
      } else {
        // Fallback: reinitialize schedule if no refresh method available
        this.debug("Reinitializing schedule...");
        await this.initializeSchedule();
      }

      // Update dropdown with new categories if they exist
      if (this.dropdownController) {
        this.debug("Updating dropdown with new categories...");
        // Re-render the dropdown with new data
        const filtersSection = this.element.querySelector(
          ".nzgdc-filters-section",
        );
        if (filtersSection) {
          const dropdownHTML = this.generateCategoryDropdownHTML();
          // Re-render the dropdown with new data
          const existingDropdown = filtersSection.querySelector(
            ".category-dropdown-overlay",
          );
          const existingBackdrop = filtersSection.querySelector(
            ".category-dropdown-backdrop",
          );

          if (existingDropdown) {
            existingDropdown.innerHTML = this.generateCategoryOptions();
            // Re-attach event handlers for newly rendered dropdown items
            this.initializeDropdownController();
          }
        }
      }

      this.debug("Widget data refresh completed successfully");
    } catch (error) {
      console.error("[NZGDC Widget] Failed to refresh widget data:", error);
      this.showInitializationError(error);
    }
  }
}

class ThursdayCategoryDropdownController {
  constructor() {
    this.widget = null;
    this.dropdown = null;
    this.backdrop = null;
    this.isOpen = false;
    this.abortController = new AbortController();
  }

  init(widgetInstance, dropdownElement) {
    this.widget = widgetInstance;
    this.dropdown = dropdownElement;
    this.backdrop = this.widget.element.querySelector(
      ".category-dropdown-backdrop",
    );

    this.attachEventHandlers();
    this.widget.debug("ThursdayCategoryDropdownController initialized");
  }

  attachEventHandlers() {
    // Click handler for filter trigger
    const filterTrigger = this.widget.element.querySelector(
      "[data-dropdown-trigger]",
    );
    if (filterTrigger) {
      filterTrigger.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggle();
        },
        { signal: this.abortController.signal },
      );
    }

    // Category item click handlers
    const categoryItems = this.dropdown.querySelectorAll(
      ".category-dropdown-item",
    );
    categoryItems.forEach((item) => {
      item.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();
          const categoryKey = item.dataset.category;
          const categoryName = item.textContent.trim();
          this.selectCategory(categoryKey, categoryName);
        },
        { signal: this.abortController.signal },
      );

      // Keyboard navigation
      item.addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const categoryKey = item.dataset.category;
            const categoryName = item.textContent.trim();
            this.selectCategory(categoryKey, categoryName);
          } else if (e.key === "Escape") {
            this.hide();
          }
        },
        { signal: this.abortController.signal },
      );
    });

    // Outside click to close
    document.addEventListener(
      "click",
      (e) => {
        if (
          this.isOpen &&
          !this.dropdown.contains(e.target) &&
          !e.target.closest("[data-dropdown-trigger]")
        ) {
          this.hide();
        }
      },
      { signal: this.abortController.signal },
    );

    // Backdrop click to close
    if (this.backdrop) {
      this.backdrop.addEventListener(
        "click",
        () => {
          this.hide();
        },
        { signal: this.abortController.signal },
      );
    }

    // Escape key to close
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.hide();
        }
      },
      { signal: this.abortController.signal },
    );
  }

  toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  show() {
    if (this.isOpen) return;

    this.isOpen = true;
    this.dropdown.classList.add("visible");
    if (this.backdrop) {
      this.backdrop.classList.add("visible");
    }
    this.widget.updateTriangleState(true); // Show ▼
    this.widget.debug("Thursday dropdown opened");
  }

  hide() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.dropdown.classList.remove("visible");
    if (this.backdrop) {
      this.backdrop.classList.remove("visible");
    }
    this.widget.updateTriangleState(false); // Show ▶
    this.widget.debug("Thursday dropdown closed");
  }

  selectCategory(categoryKey, categoryName) {
    this.widget.debug("Thursday category selected:", categoryKey, categoryName);

    // Store category key before updating filter text
    this.widget.currentCategoryKey = categoryKey;

    // Update filter value text
    this.widget.updateFilterValueText(categoryName);

    // Apply filter
    if (categoryKey === "ALL") {
      this.widget.clearFilter();
    } else {
      this.widget.applyFilter(categoryKey);
    }

    // Close dropdown
    this.hide();
  }

  destroy() {
    this.abortController.abort();
    this.widget = null;
    this.dropdown = null;
    this.backdrop = null;
    this.isOpen = false;
  }
}

/**
 * Create compatible schedule structure from DataManager data
 * @param {Object} schedule - Schedule object from DataManager
 * @param {Object} eventData - Event data from DataManager
 * @returns {Object} Compatible schedule structure with timeSlots
 */
NZGDCScheduleWidget.prototype.createCompatibleScheduleStructure = function (
  schedule,
  eventData,
) {
  this.debug("Creating compatible schedule structure from DataManager data");
  this.debug("Input schedule:", schedule);
  this.debug("Input eventData:", eventData);

  // Convert sessions to timeSlots format
  const timeSlots = [];

  if (schedule.sessions && Array.isArray(schedule.sessions)) {
    // Group sessions by time or create generic time slots
    const sessionGroups = this.groupSessionsByTime(schedule.sessions);

    Object.keys(sessionGroups).forEach((timeKey, index) => {
      const sessions = sessionGroups[timeKey];
      const timeSlot = {
        id: timeKey.toLowerCase().replace(/\s+/g, "-"),
        timeRange: timeKey,
        title: `${timeKey} Sessions`,
        theme: index % 2 === 0 ? "a" : "b", // Alternate themes
        workshops: sessions.map((session) => ({
          id: session.id, // Use actual session ID for event lookup
          category:
            session.categories && session.categories[0]
              ? session.categories[0].name
              : "General",
          title: session.title || session.name,
        })),
      };
      timeSlots.push(timeSlot);
    });
  }

  // If no sessions, create default structure from events
  if (timeSlots.length === 0 && eventData) {
    const events = Object.values(eventData);
    this.debug(`Processing ${events.length} events for timeSlot creation`);

    // Debug: Show sample events and their time information
    if (events.length > 0) {
      this.debug("Sample events for day detection:");
      events.slice(0, 3).forEach((event, index) => {
        // Create proper date object by combining schedule date with event time
        const fullDateTime = this.createFullDateTime(
          schedule.date,
          event.startTime,
        );
        this.debug(`  Event ${index + 1}: "${event.title}"`);
        this.debug(`    - scheduleDate: ${schedule.date}`);
        this.debug(`    - startTime: ${event.startTime}`);
        this.debug(`    - fullDateTime: ${fullDateTime}`);
        this.debug(
          `    - day of week: ${fullDateTime ? fullDateTime.getDay() : "N/A"} (4=Thursday)`,
        );
      });
    }

    // Since we now only get Thursday schedule data, we can use all events from it
    // But still filter to be safe in case of mixed data
    const thursdayEvents = events.filter((event) => {
      // Create proper date object by combining schedule date with event time
      const fullDateTime = this.createFullDateTime(
        schedule.date,
        event.startTime,
      );

      // Primary filter: Use actual date if available
      if (fullDateTime && !isNaN(fullDateTime.getTime())) {
        // 4 = Thursday (0=Sunday, 1=Monday, ..., 6=Saturday)
        return fullDateTime.getDay() === 4;
      }

      // Fallback: Check schedule date directly (YYYY-MM-DD format)
      if (schedule.date) {
        const scheduleDate = new Date(schedule.date);
        if (!isNaN(scheduleDate.getTime())) {
          return scheduleDate.getDay() === 4;
        }
      }

      // If we got this far and schedule.date suggests Thursday, include the event
      // This is much safer than the previous text-based fallback
      return true;
    });

    this.debug(
      `Filtered to ${thursdayEvents.length} Thursday events from ${events.length} total events`,
    );

    // Try more flexible time-based filtering on Thursday events
    const morning = thursdayEvents.filter((event) => {
      const timeStr = (event.startTime || event.time || "").toLowerCase();
      const dateObj = event.startTime ? new Date(event.startTime) : null;

      // Check various time formats and patterns
      return (
        timeStr.includes("morning") ||
        timeStr.includes("9") ||
        timeStr.includes("10") ||
        timeStr.includes("11") ||
        timeStr.includes("9:") ||
        timeStr.includes("10:") ||
        timeStr.includes("11:") ||
        (dateObj && dateObj.getHours() >= 9 && dateObj.getHours() < 12)
      );
    });

    const afternoon = thursdayEvents.filter((event) => {
      const timeStr = (event.startTime || event.time || "").toLowerCase();
      const dateObj = event.startTime ? new Date(event.startTime) : null;

      // Check various time formats and patterns
      return (
        timeStr.includes("afternoon") ||
        timeStr.includes("12") ||
        timeStr.includes("1") ||
        timeStr.includes("2") ||
        timeStr.includes("3") ||
        timeStr.includes("12:") ||
        timeStr.includes("13:") ||
        timeStr.includes("14:") ||
        timeStr.includes("15:") ||
        (dateObj && dateObj.getHours() >= 12 && dateObj.getHours() < 17)
      );
    });

    // If time-based filtering didn't work well, split Thursday events roughly
    if (
      morning.length === 0 &&
      afternoon.length === 0 &&
      thursdayEvents.length > 0
    ) {
      this.debug(
        "Time-based filtering failed, splitting Thursday events evenly",
      );
      const midpoint = Math.ceil(thursdayEvents.length / 2);
      morning.push(...thursdayEvents.slice(0, midpoint));
      afternoon.push(...thursdayEvents.slice(midpoint));
    }

    if (morning.length > 0) {
      this.debug(`Found ${morning.length} morning events`);
      timeSlots.push({
        id: "morning",
        timeRange: "9.00am - 12.00pm",
        title: "Morning Workshops",
        theme: "a",
        workshops: morning.map((event) => ({
          id: event.id, // Use actual event ID for event lookup
          category:
            event.categories && event.categories[0]
              ? event.categories[0].name
              : "General",
          title: event.title,
        })),
      });
    }

    if (afternoon.length > 0) {
      this.debug(`Found ${afternoon.length} afternoon events`);
      timeSlots.push({
        id: "afternoon",
        timeRange: "12.00pm - 3.00pm",
        title: "Afternoon Workshops",
        theme: "b",
        workshops: afternoon.map((event) => ({
          id: event.id, // Use actual event ID for event lookup
          category:
            event.categories && event.categories[0]
              ? event.categories[0].name
              : "General",
          title: event.title,
        })),
      });
    }

    // If we still have no workshops in our timeSlots, create one timeSlot with all Thursday events
    if (
      timeSlots.every((slot) => slot.workshops.length === 0) &&
      thursdayEvents.length > 0
    ) {
      this.debug("Creating single timeSlot with all Thursday events");
      timeSlots.push({
        id: "all-thursday-events",
        timeRange: "All Day",
        title: "Thursday Events",
        theme: "a",
        workshops: thursdayEvents.map((event) => ({
          id: event.id,
          category:
            event.categories && event.categories[0]
              ? event.categories[0].name
              : "General",
          title: event.title,
        })),
      });
    }
  }

  // Ensure we always have at least one timeSlot, even if no data found
  if (timeSlots.length === 0) {
    this.debug("No timeSlots created, adding default fallback");
    timeSlots.push({
      id: "default",
      timeRange: "All Day",
      title: "Schedule Events",
      theme: "a",
      workshops: [],
    });
  }

  this.debug(`Created ${timeSlots.length} timeSlots for schedule`);

  const result = {
    id: schedule.id,
    title: schedule.title || "Schedule",
    timeSlots: timeSlots,
  };

  this.debug("Final compatible schedule structure:", result);
  return result;
};

/**
 * Group sessions by time for timeSlot creation
 * @param {Array} sessions - Array of session objects
 * @returns {Object} Sessions grouped by time key
 */
NZGDCScheduleWidget.prototype.groupSessionsByTime = function (sessions) {
  const groups = {};

  sessions.forEach((session) => {
    // Extract time information from session
    let timeKey = "General";

    if (session.startTime) {
      const startTime = new Date(session.startTime);
      const hour = startTime.getHours();

      if (hour < 12) {
        timeKey = "Morning";
      } else if (hour < 17) {
        timeKey = "Afternoon";
      } else {
        timeKey = "Evening";
      }
    } else if (session.time) {
      timeKey = session.time;
    }

    if (!groups[timeKey]) {
      groups[timeKey] = [];
    }
    groups[timeKey].push(session);
  });

  return groups;
};

// Helper method to create full datetime from schedule date and session time
NZGDCScheduleWidget.prototype.createFullDateTime = function (
  scheduleDate,
  sessionTime,
) {
  if (!scheduleDate || !sessionTime) {
    return null;
  }

  try {
    // scheduleDate is in YYYY-MM-DD format
    // sessionTime is in HH:MM format
    const fullDateTimeString = `${scheduleDate}T${sessionTime}:00`;
    const dateObj = new Date(fullDateTimeString);

    if (isNaN(dateObj.getTime())) {
      return null;
    }

    return dateObj;
  } catch (error) {
    this.debug("Error creating full datetime:", error);
    return null;
  }
};

NZGDCScheduleWidget.prototype.mergeSchedulesForWidget = function (
  schedules,
  eventData,
) {
  this.debug("Merging multiple schedules into compatible structure");

  const allTimeSlots = [];

  schedules.forEach((schedule, index) => {
    const compatibleSchedule = this.createCompatibleScheduleStructure(
      schedule,
      eventData,
    );

    // Add time slots with unique IDs
    compatibleSchedule.timeSlots.forEach((timeSlot) => {
      timeSlot.id = `${schedule.id}-${timeSlot.id}`;
      timeSlot.title = `${schedule.title || "Schedule"} - ${timeSlot.title}`;
      allTimeSlots.push(timeSlot);
    });
  });

  return {
    id: "merged-schedules",
    title: "Merged Schedule",
    timeSlots: allTimeSlots,
  };
};

// Note: Auto-initialization is handled by the modular loader
// to ensure all dependencies are loaded before widget creation

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = NZGDCScheduleWidget;
} else if (typeof window !== "undefined") {
  window.NZGDCScheduleWidget = NZGDCScheduleWidget;
  window.NZGDCSchedule = NZGDCScheduleWidget; // Alias for easier access
}
