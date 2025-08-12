// NZGDC Schedule Widget - Main Widget Class

class NZGDCScheduleWidget {
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

    if (typeof window.SCHEDULE_DATA === "undefined") {
      missing.push("SCHEDULE_DATA");
    }
    if (typeof window.WORKSHOP_EVENTS === "undefined") {
      missing.push("WORKSHOP_EVENTS");
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
            <div id="schedule-content-${this.uniqueId}"></div>
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
    const categories = [
      { key: "ALL", name: "All Events" },
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

    // Sort categories alphabetically by name, keeping "All Events" first
    const sortedCategories = categories.sort((a, b) => {
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
      if (!window.SCHEDULE_DATA) {
        throw new Error("Schedule data not found");
      }

      this.scheduleGenerator = new ScheduleGenerator(scheduleContainer);
      await this.scheduleGenerator.renderSchedule(window.SCHEDULE_DATA);

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

// Note: Auto-initialization is handled by the modular loader
// to ensure all dependencies are loaded before widget creation

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = NZGDCScheduleWidget;
} else if (typeof window !== "undefined") {
  window.NZGDCScheduleWidget = NZGDCScheduleWidget;
  window.NZGDCSchedule = NZGDCScheduleWidget; // Alias for easier access
}
