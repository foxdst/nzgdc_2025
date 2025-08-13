// NZGDC Morning Schedule Widget - Main Widget Class

class NZGDCMorningScheduleWidget {
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

    // Filter state management
    this.currentFilterCategory = null;
    this.currentCategoryKey = null;
    this.originalScheduleData = null;
    this.dropdownController = null;

    this.init();
  }

  generateUniqueId() {
    return (
      "nzgdc-morning-" +
      Date.now().toString(36) +
      Math.random().toString(36).substr(2)
    );
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Morning Widget Core]", ...args);
    }
  }

  init() {
    if (this.initialized) return;

    try {
      this.debug(
        "Initializing NZGDC Friday & Saturday Morning Schedule Widget...",
      );

      // Validate dependencies before initialization
      if (!this.validateDependencies()) {
        throw new Error("Required morning schedule dependencies not loaded");
      }

      this.render();
      this.initializeSchedule();

      this.initialized = true;
      this.debug("Morning widget initialization completed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Morning Widget] Failed to initialize widget:",
        error,
      );
      this.showInitializationError(error);
    }
  }

  validateDependencies() {
    const missing = [];

    if (typeof window.MORNING_SCHEDULE_DATA === "undefined") {
      missing.push("MORNING_SCHEDULE_DATA");
    }
    if (typeof window.MORNING_EVENTS === "undefined") {
      missing.push("MORNING_EVENTS");
    }
    if (typeof window.UnifiedEventLoader === "undefined") {
      missing.push("UnifiedEventLoader");
    }
    if (typeof window.MorningScheduleGenerator === "undefined") {
      missing.push("MorningScheduleGenerator");
    }

    if (missing.length > 0) {
      console.error("[NZGDC Morning Widget] Missing dependencies:", missing);
      return false;
    }

    this.debug("All morning widget dependencies validated successfully");
    return true;
  }

  render() {
    this.element.className = "nzgdc-morning-schedule-widget";
    this.element.innerHTML = `
      ${this.options.showTimeNavigation || this.options.showFilters ? this.renderNavigation() : ""}
      <div id="morning-schedule-content-${this.uniqueId}"></div>
      ${this.options.showFooter ? this.renderFooter() : ""}
    `;
  }

  renderNavigation() {
    return `
      <div class="nzgdc-morning-schedule-sub-navigation">
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
      <div class="nzgdc-morning-filters-section">
        <div class="nzgdc-morning-filters-label">
          <span class="nzgdc-morning-filters-label-text">Filters:</span>
        </div>
        <div class="nzgdc-morning-filters-value" data-dropdown-trigger="morning-category-dropdown">
          <span class="nzgdc-morning-filters-value-text">ALL EVENTS ▶</span>
        </div>
        ${this.generateCategoryDropdownHTML()}
      </div>
    `;
  }

  // Generate dropdown HTML with all 11 categories
  generateCategoryDropdownHTML() {
    return `
      <div class="category-dropdown-backdrop" id="morning-category-backdrop"></div>
      <div class="category-dropdown-overlay" id="morning-category-dropdown">
        ${this.generateCategoryOptions()}
      </div>
    `;
  }

  // Generate category options HTML
  // Generate category options based on available categories
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

    // Get categories that actually exist in the morning events data
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
      if (a.key === "ALL") return -1; // "All Events" always first
      if (b.key === "ALL") return 1;
      return a.name.localeCompare(b.name); // Alphabetical sort for the rest
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

  // Get categories that actually exist in the morning events data
  getAvailableCategories() {
    const availableCategories = new Set();

    if (window.MORNING_EVENTS) {
      Object.values(window.MORNING_EVENTS).forEach((event) => {
        if (event.categoryKey) {
          availableCategories.add(event.categoryKey);
        }
      });
    }

    this.debug(
      `Found ${availableCategories.size} available categories in morning events:`,
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
    const filterText = this.element.querySelector(
      ".nzgdc-morning-filters-value-text",
    );
    const filterValue = this.element.querySelector(
      ".nzgdc-morning-filters-value",
    );
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
          this.debug(
            "Applied CSS rules:",
            Array.from(document.styleSheets)
              .map((sheet) => {
                try {
                  return Array.from(sheet.cssRules)
                    .filter(
                      (rule) =>
                        rule.selectorText &&
                        rule.selectorText.includes(
                          "category-" + categoryClass.split("-").pop(),
                        ),
                    )
                    .map((rule) => rule.cssText);
                } catch (e) {
                  return [];
                }
              })
              .flat(),
          );
        }, 50);
      }
    } else {
      this.debug("ERROR: Filter elements not found!", {
        filterText,
        filterValue,
      });
    }
  }

  // Get category colors based on category name
  getCategoryColors(categoryName) {
    const categoryColorMap = {
      "Game Design": { background: "#9ee6ab", text: "#000000" },
      Art: { background: "#ffc999", text: "#000000" },
      Programming: { background: "#ccf2f1", text: "#000000" },
      Audio: { background: "#197bff", text: "#ffffff" },
      "Story & Narrative": { background: "#fff47f", text: "#000000" },
      "Business & Marketing": { background: "#e7f1ff", text: "#000000" },
      Culture: { background: "#fac7d5", text: "#000000" },
      "Production & QA": { background: "#512340", text: "#ffffff" },
      "Realities (VR, AR, MR)": { background: "#d1afff", text: "#000000" },
      "Data, Testing or Research": { background: "#917b89", text: "#ffffff" },
      "Serious & Educational Games": { background: "#ffafaf", text: "#000000" },
    };

    return (
      categoryColorMap[categoryName] || {
        background: "#ffffff",
        text: "#000000",
      }
    );
  }

  // Get category CSS class based on category key
  getCategoryClassFromKey(categoryKey) {
    const categoryClassMap = {
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

    return categoryClassMap[categoryKey] || "category-all-events";
  }

  // Update triangle state (▶ closed, ▼ open) while preserving colors
  updateTriangleState(isOpen) {
    const filterText = this.element.querySelector(
      ".nzgdc-morning-filters-value-text",
    );
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
      <div class="nzgdc-morning-schedule-footer-navigation">
        <button class="nzgdc-morning-back-to-top">
          BACK TO TOP
        </button>
      </div>
    `;
  }

  async initializeSchedule() {
    try {
      const scheduleContainer = document.getElementById(
        `morning-schedule-content-${this.uniqueId}`,
      );
      if (!scheduleContainer) {
        throw new Error("Morning schedule container not found");
      }

      // Ensure data is loaded
      if (!window.MORNING_SCHEDULE_DATA) {
        throw new Error("Morning schedule data not found");
      }

      this.scheduleGenerator = new MorningScheduleGenerator(scheduleContainer);
      await this.scheduleGenerator.renderSchedule(window.MORNING_SCHEDULE_DATA);

      // Add event handlers
      this.addEventHandlers();

      this.debug("Morning schedule initialization completed");

      // Initialize dropdown controller
      this.initializeDropdownController();
    } catch (error) {
      console.error(
        "[NZGDC Morning Widget] Failed to initialize schedule:",
        error,
      );
      this.showInitializationError(error);
    }
  }

  // Initialize category dropdown controller
  initializeDropdownController() {
    const dropdownElement = this.element.querySelector(
      "#morning-category-dropdown",
    );
    if (dropdownElement && this.options.showFilters) {
      this.dropdownController = new MorningCategoryDropdownController();
      this.dropdownController.init(this, dropdownElement);
      this.debug("Dropdown controller initialized");
    }
  }

  // Apply category filter to events
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

  addEventHandlers() {
    // Add back-to-top click handler
    const backToTopBtn = this.element.querySelector(
      ".nzgdc-morning-back-to-top",
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
          new CustomEvent("morningNavigate", {
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
          new CustomEvent("morningNavigate", {
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
    return window.MORNING_EVENTS ? window.MORNING_EVENTS[eventId] : null;
  }

  getAllEvents() {
    return window.MORNING_EVENTS || {};
  }

  getScheduleData() {
    return window.MORNING_SCHEDULE_DATA || {};
  }

  destroy() {
    this.debug("Destroying NZGDC Morning Schedule Widget...");

    try {
      // Cancel any pending requests
      this.abortController.abort();

      // Clean up event listeners (most should be auto-removed by AbortController)
      this.eventListeners.forEach((listenerInfo, element) => {
        try {
          element.removeEventListener(listenerInfo.type, listenerInfo.handler);
        } catch (error) {
          console.warn(
            "[NZGDC Morning Widget] Error removing event listener:",
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
            "[NZGDC Morning Widget] Error disconnecting observer:",
            error,
          );
        }
      });
      this.observers.clear();

      // Clean up dropdown controller
      if (this.dropdownController) {
        this.dropdownController.destroy();
        this.dropdownController = null;
      }

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

      this.debug("Morning widget destroyed successfully");
    } catch (error) {
      console.error(
        "[NZGDC Morning Widget] Error during widget destruction:",
        error,
      );
    }
  }

  isDestroyed() {
    return !this.initialized || this.abortController.signal.aborted;
  }

  showInitializationError(error) {
    this.element.innerHTML = `
      <div class="nzgdc-morning-error-placeholder" style="width: 100%; height: 300px; max-width: none;">
        <strong>Failed to initialize morning schedule widget</strong>
        <small>${error.message}</small>
        <small>Please check console for details</small>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">Refresh Page</button>
      </div>
    `;
  }
}

// Category Dropdown Controller Class
class MorningCategoryDropdownController {
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
    this.widget.debug("MorningCategoryDropdownController initialized");
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
    this.widget.debug("Dropdown opened");
  }

  hide() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.dropdown.classList.remove("visible");
    if (this.backdrop) {
      this.backdrop.classList.remove("visible");
    }
    this.widget.updateTriangleState(false); // Show ▶
    this.widget.debug("Dropdown closed");
  }

  selectCategory(categoryKey, categoryName) {
    this.widget.debug("Category selected:", categoryKey, categoryName);

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

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = NZGDCMorningScheduleWidget;
} else if (typeof window !== "undefined") {
  window.NZGDCMorningScheduleWidget = NZGDCMorningScheduleWidget;
  window.NZGDCMorningSchedule = NZGDCMorningScheduleWidget; // Alias for easier access
  window.MorningCategoryDropdownController = MorningCategoryDropdownController;
}
