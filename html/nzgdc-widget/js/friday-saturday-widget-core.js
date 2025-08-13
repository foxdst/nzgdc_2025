// NZGDC Friday/Saturday Widget Core
// Unified core combining morning and afternoon widget functionality

(function (window, document) {
  "use strict";

  class FridaySaturdayWidgetCore {
    constructor(containerId, options = {}) {
      // Generate unique ID for this widget instance first
      this.uniqueId = `friday-saturday-widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Validate containerId parameter
      if (!containerId || typeof containerId !== "string") {
        throw new Error(
          `Invalid containerId provided: ${containerId} (type: ${typeof containerId})`,
        );
      }

      this.containerId = containerId;
      this.container = null;
      this.options = {
        defaultView: "morning",
        enableDebug: false,
        showFilters: true,
        ...options,
      };

      // State management
      this.currentView = this.options.defaultView;
      this.initialized = false;
      this.morningGenerator = null;
      this.afternoonGenerator = null;
      this.morningContainer = null;
      this.afternoonContainer = null;

      // UI Elements
      this.morningButtons = [];
      this.afternoonButtons = [];

      // Filter controllers
      this.morningFilterController = null;
      this.afternoonFilterController = null;

      // Category tracking for filter state
      this.morningCategoryKey = "ALL";
      this.afternoonCategoryKey = "ALL";

      // Debug logging
      this.debugLog = this.options.enableDebug
        ? (msg, ...args) => console.log(`[FridaySaturdayWidget]`, msg, ...args)
        : () => {};
    }

    async initialize() {
      try {
        this.debugLog("Initializing Friday/Saturday widget");
        this.debugLog("Container ID:", this.containerId);

        // Get container element
        this.container = document.getElementById(this.containerId);
        this.debugLog("Container element found:", !!this.container);
        if (!this.container) {
          throw new Error(`Container element not found: ${this.containerId}`);
        }

        // Set up widget structure
        this.setupWidgetStructure();

        // Initialize generators
        await this.initializeGenerators();

        // Load default view
        await this.loadView(this.currentView);

        // Set up event listeners
        this.setupEventListeners();

        this.initialized = true;
        this.debugLog("Friday/Saturday widget initialized successfully");

        return this;
      } catch (error) {
        this.debugLog("Error initializing widget:", error);
        this.showError(`Failed to initialize widget: ${error.message}`);
        throw error;
      }
    }

    setupWidgetStructure() {
      this.container.className = `nzgdc-friday-saturday-schedule-widget ${this.currentView}-view`;

      // Create complete widget structure like the original separate widgets do
      this.container.innerHTML = `
        <div class="morning-view-container nzgdc-morning-schedule-widget" style="display: ${this.currentView === "morning" ? "block" : "none"};">
          <div class="nzgdc-morning-schedule-sub-navigation">
            <div class="nzgdc-schedule-time-navigation">
              <button class="nzgdc-morning-events-button" data-nav="morning">MORNING EVENTS</button>
              <button class="nzgdc-afternoon-events-button" data-nav="afternoon">AFTERNOON EVENTS</button>
            </div>
            <div class="nzgdc-morning-filters-section">
              <div class="nzgdc-morning-filters-label">
                <span class="nzgdc-morning-filters-label-text">Filters:</span>
              </div>
              <div class="nzgdc-morning-filters-value" data-dropdown-trigger="morning-category-dropdown">
                <span class="nzgdc-morning-filters-value-text">ALL EVENTS ▶</span>
              </div>
              ${this.generateCategoryDropdownHTML("morning")}
            </div>
          </div>
          <div id="morning-schedule-content-${this.uniqueId}" class="nzgdc-morning-schedule-container"></div>
          <div class="nzgdc-morning-schedule-footer-navigation">
            <button class="nzgdc-morning-back-to-top">BACK TO TOP</button>
          </div>
        </div>
        <div class="afternoon-view-container nzgdc-afternoon-schedule-widget" style="display: ${this.currentView === "afternoon" ? "block" : "none"};">
          <div class="nzgdc-afternoon-schedule-sub-navigation">
            <div class="nzgdc-schedule-time-navigation">
              <button class="nzgdc-morning-events-button" data-nav="morning">MORNING EVENTS</button>
              <button class="nzgdc-afternoon-events-button" data-nav="afternoon">AFTERNOON EVENTS</button>
            </div>
            <div class="nzgdc-afternoon-filters-section">
              <div class="nzgdc-afternoon-filters-label">
                <span class="nzgdc-afternoon-filters-label-text">Filters:</span>
              </div>
              <div class="nzgdc-afternoon-filters-value" data-dropdown-trigger="afternoon-category-dropdown">
                <span class="nzgdc-afternoon-filters-value-text">ALL EVENTS ▶</span>
              </div>
              ${this.generateCategoryDropdownHTML("afternoon")}
            </div>
          </div>
          <div id="afternoon-schedule-content-${this.uniqueId}" class="nzgdc-afternoon-schedule-container"></div>
          <div class="nzgdc-afternoon-schedule-footer-navigation">
            <button class="nzgdc-afternoon-back-to-top">BACK TO TOP</button>
          </div>
        </div>
      `;

      // Get references to schedule content containers for generators
      this.morningContainer = this.container.querySelector(
        `#morning-schedule-content-${this.uniqueId}`,
      );
      this.afternoonContainer = this.container.querySelector(
        `#afternoon-schedule-content-${this.uniqueId}`,
      );
    }

    generateCategoryDropdownHTML(viewType) {
      return `
        <div class="category-dropdown-backdrop" id="${viewType}-category-backdrop"></div>
        <div class="category-dropdown-overlay" id="${viewType}-category-dropdown">
          ${this.generateCategoryOptions(viewType)}
        </div>
      `;
    }

    generateCategoryOptions(viewType) {
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

      // Get available categories from the appropriate events data
      const availableCategories = this.getAvailableCategories(viewType);

      // Filter to only show categories that exist in the data
      const categories = allCategories.filter((category) =>
        availableCategories.has(category.key),
      );

      // If no categories found, show all as fallback
      if (categories.length === 0) {
        return this.generateAllCategoryOptions(allCategories);
      }

      // Always add "All Events" option at the beginning
      const finalCategories = [
        { key: "ALL", name: "All Events" },
        ...categories,
      ];

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

    getAvailableCategories(viewType) {
      const events =
        viewType === "morning"
          ? window.MORNING_EVENTS || {}
          : window.AFTERNOON_EVENTS || {};

      const categories = new Set();
      Object.values(events).forEach((event) => {
        if (event.categoryKey) {
          categories.add(event.categoryKey);
        }
      });
      return categories;
    }

    generateAllCategoryOptions(allCategories) {
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
    updateFilterValueText(categoryName, viewType) {
      const filterText = this.container.querySelector(
        viewType === "morning"
          ? ".nzgdc-morning-filters-value-text"
          : ".nzgdc-afternoon-filters-value-text",
      );
      const filterValue = this.container.querySelector(
        viewType === "morning"
          ? ".nzgdc-morning-filters-value"
          : ".nzgdc-afternoon-filters-value",
      );

      if (filterText && filterValue) {
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
          // Track current category for this view
          this[`${viewType}CategoryKey`] = "ALL";
          filterValue.removeAttribute("data-active-category");
        } else {
          filterText.textContent = `${categoryName.toUpperCase()} ▶`;
          const categoryClass = this.getCategoryClassFromKey(
            this[`${viewType}CategoryKey`],
          );
          filterValue.classList.add(categoryClass);
          filterValue.setAttribute("data-active-category", categoryName);
        }
      }
    }

    // Update triangle state (▶ closed, ▼ open) while preserving colors
    updateTriangleState(isOpen, viewType) {
      const filterText = this.container.querySelector(
        viewType === "morning"
          ? ".nzgdc-morning-filters-value-text"
          : ".nzgdc-afternoon-filters-value-text",
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

    async initializeGenerators() {
      this.debugLog("Initializing schedule generators");

      // Check UnifiedEventLoader first (required by generators)
      if (!window.UnifiedEventLoader) {
        throw new Error(
          "UnifiedEventLoader not available - required by schedule generators",
        );
      }

      // Initialize morning generator
      if (window.MorningScheduleGenerator) {
        try {
          this.morningGenerator = new window.MorningScheduleGenerator(
            this.morningContainer,
          );
          this.debugLog("MorningScheduleGenerator created successfully");
        } catch (morningError) {
          throw new Error(
            `Failed to create MorningScheduleGenerator: ${morningError.message}`,
          );
        }
      } else {
        throw new Error(
          "MorningScheduleGenerator class not available - check if js/morning-schedule-generator.js loaded correctly",
        );
      }

      // Initialize afternoon generator
      if (window.AfternoonScheduleGenerator) {
        try {
          this.afternoonGenerator = new window.AfternoonScheduleGenerator(
            this.afternoonContainer,
          );
          this.debugLog("AfternoonScheduleGenerator created successfully");
        } catch (afternoonError) {
          throw new Error(
            `Failed to create AfternoonScheduleGenerator: ${afternoonError.message}`,
          );
        }
      } else {
        throw new Error(
          "AfternoonScheduleGenerator class not available - check if js/afternoon-schedule-generator.js loaded correctly",
        );
      }

      this.debugLog("All generators initialized successfully");

      // Override generator filtering methods to inject clear filter buttons
      this.overrideGeneratorFiltering();
    }

    setupEventListeners() {
      this.debugLog("Setting up event listeners");

      // Wire up navigation buttons
      this.wireUpExistingButtons();

      // Wire up dropdowns after generators are ready
      this.wireUpCategoryDropdowns();

      // Wire up back to top buttons
      this.wireUpBackToTopButtons();
    }

    wireUpExistingButtons() {
      // Find morning/afternoon buttons after generators have rendered
      const morningButtons = this.container.querySelectorAll(
        ".nzgdc-morning-events-button",
      );
      const afternoonButtons = this.container.querySelectorAll(
        ".nzgdc-afternoon-events-button",
      );

      // Wire up Morning Events buttons for view switching only
      morningButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.switchToView("morning");
        });
      });

      // Wire up Afternoon Events buttons for view switching only
      afternoonButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.switchToView("afternoon");
        });
      });

      this.debugLog(
        `Wired up ${morningButtons.length} morning and ${afternoonButtons.length} afternoon buttons for view switching`,
      );
    }

    async switchToView(viewName) {
      if (viewName === this.currentView) {
        this.debugLog(`Already showing ${viewName} view`);
        return;
      }

      this.debugLog(`Switching to ${viewName} view`);

      try {
        // Update current view
        this.currentView = viewName;

        // Update widget CSS class
        this.container.className = `nzgdc-friday-saturday-schedule-widget ${viewName}-view`;

        // Show/hide view containers
        const morningViewContainer = this.container.querySelector(
          ".morning-view-container",
        );
        const afternoonViewContainer = this.container.querySelector(
          ".afternoon-view-container",
        );

        if (viewName === "morning") {
          morningViewContainer.style.display = "block";
          afternoonViewContainer.style.display = "none";
        } else if (viewName === "afternoon") {
          morningViewContainer.style.display = "none";
          afternoonViewContainer.style.display = "block";
        }

        // Clear any active filters when switching views
        this.clearFilter(viewName);

        // Load the requested view if not already loaded
        await this.loadView(viewName);

        this.debugLog(`Successfully switched to ${viewName} view`);
      } catch (error) {
        this.debugLog(`Error switching to ${viewName} view:`, error);
        this.showError(
          `Failed to switch to ${viewName} view: ${error.message}`,
        );
      }
    }

    async loadView(viewName) {
      this.debugLog(`Loading ${viewName} view`);

      try {
        if (viewName === "morning") {
          await this.loadMorningView();
        } else if (viewName === "afternoon") {
          await this.loadAfternoonView();
        } else {
          throw new Error(`Unknown view: ${viewName}`);
        }
      } catch (error) {
        this.debugLog(`Error loading ${viewName} view:`, error);
        throw error;
      }
    }

    async loadMorningView() {
      if (!this.morningGenerator) {
        throw new Error("Morning generator not initialized");
      }

      try {
        // Generate morning schedule directly into container
        await this.morningGenerator.renderSchedule(
          window.MORNING_SCHEDULE_DATA,
        );

        // Wire up the existing Morning/Afternoon Events buttons in the generated content
        this.wireUpExistingButtons();

        this.debugLog("Morning view loaded successfully");
      } catch (error) {
        this.morningContainer.innerHTML = `
          <div class="friday-saturday-widget-error">
            Failed to load morning schedule: ${error.message}
          </div>
        `;
        throw error;
      }
    }

    async loadAfternoonView() {
      if (!this.afternoonGenerator) {
        throw new Error("Afternoon generator not initialized");
      }

      try {
        // Generate afternoon schedule directly into container
        await this.afternoonGenerator.renderSchedule(
          window.AFTERNOON_SCHEDULE_DATA,
        );

        // Wire up the existing Morning/Afternoon Events buttons in the generated content
        this.wireUpExistingButtons();

        this.debugLog("Afternoon view loaded successfully");
      } catch (error) {
        this.afternoonContainer.innerHTML = `
          <div class="friday-saturday-widget-error">
            Failed to load afternoon schedule: ${error.message}
          </div>
        `;
        throw error;
      }
    }

    wireUpCategoryDropdowns() {
      // Morning dropdown
      const morningTrigger = this.container.querySelector(
        '[data-dropdown-trigger="morning-category-dropdown"]',
      );
      const morningDropdown = this.container.querySelector(
        "#morning-category-dropdown",
      );
      const morningBackdrop = this.container.querySelector(
        "#morning-category-backdrop",
      );

      if (morningTrigger && morningDropdown && morningBackdrop) {
        this.setupDropdownHandlers(
          morningTrigger,
          morningDropdown,
          morningBackdrop,
          "morning",
        );
      }

      // Afternoon dropdown
      const afternoonTrigger = this.container.querySelector(
        '[data-dropdown-trigger="afternoon-category-dropdown"]',
      );
      const afternoonDropdown = this.container.querySelector(
        "#afternoon-category-dropdown",
      );
      const afternoonBackdrop = this.container.querySelector(
        "#afternoon-category-backdrop",
      );

      if (afternoonTrigger && afternoonDropdown && afternoonBackdrop) {
        this.setupDropdownHandlers(
          afternoonTrigger,
          afternoonDropdown,
          afternoonBackdrop,
          "afternoon",
        );
      }
    }

    setupDropdownHandlers(trigger, dropdown, backdrop, viewType) {
      let isOpen = false;

      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        isOpen = !isOpen;

        if (isOpen) {
          dropdown.classList.add("visible");
          backdrop.classList.add("visible");
          this.updateTriangleState(true, viewType);
        } else {
          dropdown.classList.remove("visible");
          backdrop.classList.remove("visible");
          this.updateTriangleState(false, viewType);
        }
      });

      backdrop.addEventListener("click", () => {
        isOpen = false;
        dropdown.classList.remove("visible");
        backdrop.classList.remove("visible");
        this.updateTriangleState(false, viewType);
      });

      const options = dropdown.querySelectorAll(".category-dropdown-item");
      options.forEach((option) => {
        option.addEventListener("click", (e) => {
          e.preventDefault();
          const categoryKey = option.dataset.category;
          const categoryName = option.textContent.trim();

          // Store category key before updating filter text
          this[`${viewType}CategoryKey`] = categoryKey;

          // Update filter value text with category colors
          this.updateFilterValueText(categoryName, viewType);

          // Apply the filter
          this.applyFilter(categoryKey, categoryName, viewType);

          // Close dropdown
          isOpen = false;
          dropdown.classList.remove("visible");
          backdrop.classList.remove("visible");
          this.updateTriangleState(false, viewType);
        });
      });
    }

    applyFilter(categoryKey, categoryName, viewType) {
      // Apply filter to generator
      const generator =
        viewType === "morning"
          ? this.morningGenerator
          : this.afternoonGenerator;
      if (generator) {
        if (categoryKey === "ALL") {
          generator.resetFilter && generator.resetFilter();
        } else {
          generator.filterEventsByCategory &&
            generator.filterEventsByCategory(categoryKey);
        }
      }
    }

    clearFilter(viewType) {
      // Reset category key
      this[`${viewType}CategoryKey`] = "ALL";

      // Update filter text back to default
      this.updateFilterValueText("All Events", viewType);

      // Apply clear filter to generator
      const generator =
        viewType === "morning"
          ? this.morningGenerator
          : this.afternoonGenerator;
      if (generator && generator.resetFilter) {
        generator.resetFilter();
      }
    }

    wireUpBackToTopButtons() {
      const backToTopButtons = this.container.querySelectorAll(
        ".nzgdc-morning-back-to-top, .nzgdc-afternoon-back-to-top",
      );
      backToTopButtons.forEach((button) => {
        button.addEventListener("click", () => {
          this.container.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      });
    }

    overrideGeneratorFiltering() {
      // Override morning generator filtering methods
      if (this.morningGenerator) {
        const originalMorningFilter =
          this.morningGenerator.applyEventFiltering.bind(this.morningGenerator);
        const originalMorningClear =
          this.morningGenerator.clearEventFiltering.bind(this.morningGenerator);

        this.morningGenerator.applyEventFiltering = (categoryKey) => {
          originalMorningFilter(categoryKey);
          this.showClearFilterButtons("morning");
        };

        this.morningGenerator.clearEventFiltering = () => {
          originalMorningClear();
          this.hideClearFilterButtons("morning");
        };
      }

      // Override afternoon generator filtering methods
      if (this.afternoonGenerator) {
        const originalAfternoonFilter =
          this.afternoonGenerator.applyEventFiltering.bind(
            this.afternoonGenerator,
          );
        const originalAfternoonClear =
          this.afternoonGenerator.clearEventFiltering.bind(
            this.afternoonGenerator,
          );

        this.afternoonGenerator.applyEventFiltering = (categoryKey) => {
          originalAfternoonFilter(categoryKey);
          this.showClearFilterButtons("afternoon");
        };

        this.afternoonGenerator.clearEventFiltering = () => {
          originalAfternoonClear();
          this.hideClearFilterButtons("afternoon");
        };
      }
    }

    showClearFilterButtons(viewType) {
      // Remove any existing clear filter buttons first
      this.hideClearFilterButtons(viewType);

      const scheduleContainer = this.container.querySelector(
        viewType === "morning"
          ? `#morning-schedule-content-${this.uniqueId}`
          : `#afternoon-schedule-content-${this.uniqueId}`,
      );

      if (!scheduleContainer) return;

      // Find all event rows
      const eventRows = scheduleContainer.querySelectorAll(
        viewType === "morning"
          ? ".nzgdc-morning-event-row"
          : ".nzgdc-afternoon-event-row",
      );

      eventRows.forEach((eventRow) => {
        // Create dedicated clear filter button row
        const clearFilterRow = document.createElement("div");
        clearFilterRow.className = `nzgdc-${viewType}-clear-filter-row`;

        // Create the clear filter button
        const clearButton = document.createElement("button");
        clearButton.className = `nzgdc-${viewType}-clear-filter-button`;
        clearButton.textContent = "CLEAR FILTER";
        clearButton.setAttribute("data-view-type", viewType);

        // Add click handler
        clearButton.addEventListener("click", () => {
          this.clearFilter(viewType);
        });

        // Add button to the row
        clearFilterRow.appendChild(clearButton);

        // Insert the clear filter row after the event row
        eventRow.parentNode.insertBefore(clearFilterRow, eventRow.nextSibling);
      });
    }

    hideClearFilterButtons(viewType) {
      const clearFilterRows = this.container.querySelectorAll(
        `.nzgdc-${viewType}-clear-filter-row`,
      );

      clearFilterRows.forEach((row) => {
        row.remove();
      });
    }

    showError(message) {
      if (this.container) {
        this.container.innerHTML = `
          <div class="friday-saturday-widget-error">
            <strong>Error:</strong> ${message}
          </div>
        `;
      }
    }

    destroy() {
      this.debugLog("Destroying Friday/Saturday widget");

      try {
        // Destroy filter controllers
        if (
          this.morningFilterController &&
          typeof this.morningFilterController.destroy === "function"
        ) {
          this.morningFilterController.destroy();
          this.morningFilterController = null;
        }

        if (
          this.afternoonFilterController &&
          typeof this.afternoonFilterController.destroy === "function"
        ) {
          this.afternoonFilterController.destroy();
          this.afternoonFilterController = null;
        }

        // Destroy generators if they have destroy methods
        if (
          this.morningGenerator &&
          typeof this.morningGenerator.destroy === "function"
        ) {
          this.morningGenerator.destroy();
        }

        if (
          this.afternoonGenerator &&
          typeof this.afternoonGenerator.destroy === "function"
        ) {
          this.afternoonGenerator.destroy();
        }

        // Remove event listeners by clearing button arrays (cloned nodes will be garbage collected)
        this.morningButtons = [];
        this.afternoonButtons = [];

        // Clear container
        if (this.container) {
          this.container.innerHTML = "";
          this.container.className = "";
        }

        // Reset state
        this.initialized = false;
        this.currentView = this.options.defaultView;
        this.morningGenerator = null;
        this.afternoonGenerator = null;

        this.debugLog("Friday/Saturday widget destroyed");
      } catch (error) {
        this.debugLog("Error during widget destruction:", error);
      }
    }

    // Public API methods
    getCurrentView() {
      return this.currentView;
    }

    async switchToMorning() {
      return this.switchToView("morning");
    }

    async switchToAfternoon() {
      return this.switchToView("afternoon");
    }

    isInitialized() {
      return this.initialized;
    }

    getDebugInfo() {
      return {
        uniqueId: this.uniqueId,
        containerId: this.containerId,
        currentView: this.currentView,
        initialized: this.initialized,
        options: this.options,
        generators: {
          morning: !!this.morningGenerator,
          afternoon: !!this.afternoonGenerator,
        },
        buttons: {
          morning: this.morningButtons.length,
          afternoon: this.afternoonButtons.length,
        },
        filters: {
          morning: !!this.morningFilterController,
          afternoon: !!this.afternoonFilterController,
        },
      };
    }

    // Event API for external integration
    on(event, callback) {
      // Simple event system for external integrations
      if (!this._eventListeners) {
        this._eventListeners = {};
      }
      if (!this._eventListeners[event]) {
        this._eventListeners[event] = [];
      }
      this._eventListeners[event].push(callback);
    }

    off(event, callback) {
      if (!this._eventListeners || !this._eventListeners[event]) {
        return;
      }
      const index = this._eventListeners[event].indexOf(callback);
      if (index > -1) {
        this._eventListeners[event].splice(index, 1);
      }
    }

    _emit(event, data) {
      if (!this._eventListeners || !this._eventListeners[event]) {
        return;
      }
      this._eventListeners[event].forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          this.debugLog(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Export to global scope
  window.FridaySaturdayWidgetCore = FridaySaturdayWidgetCore;
})(window, document);
