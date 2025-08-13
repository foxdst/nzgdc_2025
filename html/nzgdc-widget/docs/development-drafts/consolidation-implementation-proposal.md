# Morning/Afternoon Consolidation Implementation Proposal

## Overview

This document provides a detailed technical implementation plan for consolidating the Morning and Afternoon NZGDC widget systems into a unified, configuration-driven architecture. The proposal includes specific code examples, migration strategies, and implementation guidelines.

## Technical Architecture

### 1. Unified Data Layer

#### 1.1 Shared Events Data Structure

```javascript
// shared-events.js
const SHARED_EVENTS = {
  "panel-b1": {
    category: "Game Design",
    categoryKey: "GAME_DESIGN",
    title: "Panel: The Future of Multiplayer Design",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Riley Adams", position: "Network Engineer at NetPlay" },
      { name: "Morgan Yu", position: "Game Director at Massive Online" },
      { name: "Alex Thompson", position: "Multiplayer Specialist at ConnectGames" }
    ]
  },
  // ... all 24 events
};

// Export for backward compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = SHARED_EVENTS;
} else if (typeof window !== "undefined") {
  window.SHARED_EVENTS = SHARED_EVENTS;
  
  // Backward compatibility exports
  window.MORNING_EVENTS = SHARED_EVENTS;
  window.AFTERNOON_EVENTS = SHARED_EVENTS;
}
```

#### 1.2 Unified Schedule Configuration

```javascript
// time-periods-config.js
const TIME_PERIODS_CONFIG = {
  morning: {
    id: 'morning',
    displayName: 'Morning',
    cssPrefix: 'nzgdc-morning-',
    debugPrefix: '[NZGDC Morning]',
    widgetType: 'morning',
    themes: {
      early: 'early',
      mid: 'mid'
    },
    navigation: {
      eventName: 'morningNavigate',
      buttons: {
        current: 'Morning Events',
        other: 'Afternoon Events',
        otherTarget: 'afternoon'
      }
    },
    schedule: {
      timeSlots: [
        {
          id: 'early-morning',
          timeRange: '10.00am - 10.30am',
          title: 'Early Morning Panels',
          theme: 'early',
          events: [
            { id: 'panel-e1', category: 'Story & Narrative', title: 'Advanced Storytelling in Games', type: 'main' },
            // ... 9 more events
          ]
        },
        {
          id: 'morning-break',
          type: 'break',
          title: 'Morning Break',
          timeRange: '10.30am - 10.55am (25 mins)'
        },
        {
          id: 'mid-morning',
          timeRange: '10.55am - 11.45am',
          title: 'Mid Morning Sessions',
          theme: 'mid',
          events: [
            { id: 'panel-b1', category: 'Game Design', title: 'Panel: The Future of Multiplayer Design', type: 'big' },
            // ... 6 more events
          ]
        },
        {
          id: 'late-morning',
          timeRange: '11.55am - 12.25pm',
          title: 'Late Morning Sessions',
          theme: 'early',
          events: [
            { id: 'panel-l1', category: 'Programming', title: 'Advanced Programming Techniques', type: 'main' },
            // ... 6 more events
          ]
        },
        {
          id: 'lunch-break',
          type: 'break',
          title: 'Lunch Break',
          timeRange: '12.25pm - 1.25pm (1 hour)'
        }
      ]
    }
  },
  
  afternoon: {
    id: 'afternoon',
    displayName: 'Afternoon',
    cssPrefix: 'nzgdc-afternoon-',
    debugPrefix: '[NZGDC Afternoon]',
    widgetType: 'afternoon',
    themes: {
      early: 'early',
      mid: 'mid'
    },
    navigation: {
      eventName: 'afternoonNavigate',
      buttons: {
        current: 'Afternoon Events',
        other: 'Morning Events',
        otherTarget: 'morning'
      }
    },
    schedule: {
      timeSlots: [
        {
          id: 'early-afternoon',
          timeRange: '1.25pm - 1.55pm',
          title: 'Early Afternoon Panels',
          theme: 'early',
          events: [
            { id: 'panel-e1', category: 'Story & Narrative', title: 'Advanced Storytelling in Games', type: 'main' },
            // ... 9 more events
          ]
        },
        {
          id: 'afternoon-break',
          type: 'break',
          title: 'Afternoon Break',
          timeRange: '1.55pm - 2.20pm (25 mins)'
        },
        {
          id: 'mid-afternoon',
          timeRange: '2.20pm - 3.10pm',
          title: 'Mid Afternoon Sessions',
          theme: 'mid',
          events: [
            { id: 'panel-b1', category: 'Game Design', title: 'Panel: The Future of Multiplayer Design', type: 'big' },
            // ... 6 more events
          ]
        },
        {
          id: 'late-afternoon',
          timeRange: '3.20pm - 3.50pm',
          title: 'Late Afternoon Sessions',
          theme: 'early',
          events: [
            { id: 'panel-l1', category: 'Programming', title: 'Advanced Programming Techniques', type: 'main' },
            // ... 6 more events
          ]
        },
        {
          id: 'speaker-sponsor-party',
          type: 'break',
          title: 'Speaker & Sponsor Party',
          timeRange: '5.30pm - 7.30pm (2 hours)'
        }
      ]
    }
  }
};

// Export configuration
if (typeof module !== "undefined" && module.exports) {
  module.exports = TIME_PERIODS_CONFIG;
} else if (typeof window !== "undefined") {
  window.TIME_PERIODS_CONFIG = TIME_PERIODS_CONFIG;
  
  // Backward compatibility exports
  window.MORNING_SCHEDULE_DATA = TIME_PERIODS_CONFIG.morning.schedule;
  window.AFTERNOON_SCHEDULE_DATA = TIME_PERIODS_CONFIG.afternoon.schedule;
}
```

### 2. Unified Schedule Generator

```javascript
// unified-time-periods-schedule-generator.js
class UnifiedTimePeriodsScheduleGenerator {
  constructor(container, config) {
    this.container = container;
    this.config = config;
    this.eventLoader = new UnifiedEventLoader();
    this.loadedEvents = new Set();
    this.isDestroyed = false;
    this.originalData = null;
    this.currentFilterCategory = null;
  }

  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log(`${this.config.debugPrefix} Schedule Generator`, ...args);
    }
  }

  generateTimeSlot(timeSlot) {
    if (timeSlot.type === "break") {
      return this.generateBreakBlock(timeSlot);
    }

    const timeSlotEl = document.createElement("div");
    timeSlotEl.className = `${this.config.cssPrefix}time-category ${this.config.cssPrefix}time-category-${timeSlot.theme}`;
    timeSlotEl.setAttribute("data-time-slot", timeSlot.id);

    timeSlotEl.innerHTML = `
      <!-- Event Times Container -->
      <div class="${this.config.cssPrefix}event-times-${timeSlot.theme}">
        <div class="${this.config.cssPrefix}session-schedule">
          <div class="${this.config.cssPrefix}session-times">${timeSlot.timeRange}</div>
          <div class="${this.config.cssPrefix}session-title">${timeSlot.title}</div>
        </div>
        <div class="${this.config.cssPrefix}underline"></div>
      </div>

      <!-- Scheduled Events -->
      <div class="nzgdc-scheduled-${this.config.id}-events">
        ${this.generateEventRows(timeSlot.events)}
      </div>
    `;

    return timeSlotEl;
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
    const allMainType = events.every((event) => event.type === "main");

    if (allMainType) {
      // All main panels - 5 per row
      for (let i = 0; i < events.length; i += 5) {
        const eventsInRow = events.slice(i, i + 5);
        const rowHtml = `
          <div class="${this.config.cssPrefix}event-row" data-row="${Math.floor(i / 5) + 1}">
            ${eventsInRow.map((event) => this.generateEvent(event)).join("")}
          </div>
        `;
        rows.push(rowHtml);
      }
    } else {
      // Mixed layout
      const bigEvents = events.filter((event) => event.type === "big");
      const mainEvents = events.filter((event) => event.type === "main");

      if (bigEvents.length > 0) {
        for (let i = 0; i < bigEvents.length; i += 2) {
          const eventsInRow = bigEvents.slice(i, i + 2);
          const rowHtml = `
            <div class="${this.config.cssPrefix}event-row" data-row="big-${Math.floor(i / 2) + 1}">
              ${eventsInRow.map((event) => this.generateEvent(event)).join("")}
            </div>
          `;
          rows.push(rowHtml);
        }
      }

      if (mainEvents.length > 0) {
        for (let i = 0; i < mainEvents.length; i += 5) {
          const eventsInRow = mainEvents.slice(i, i + 5);
          const rowHtml = `
            <div class="${this.config.cssPrefix}event-row" data-row="main-${Math.floor(i / 5) + 1}">
              ${eventsInRow.map((event) => this.generateEvent(event)).join("")}
            </div>
          `;
          rows.push(rowHtml);
        }
      }
    }

    return rows.join("");
  }

  generateEvent(event) {
    const eventType = event.type || "big";
    const containerClass = eventType === "main" 
      ? `${this.config.cssPrefix}event-main` 
      : `${this.config.cssPrefix}event`;
    const panelContainerClass = eventType === "main"
      ? `${this.config.cssPrefix}event-panel-main-container`
      : `${this.config.cssPrefix}event-panel-container`;

    return `
      <div class="${containerClass}">
        <div class="${panelContainerClass}"
             data-event-id="${event.id}"
             data-event-type="${eventType}"
             data-category="${event.category}"
             data-title="${event.title}">
          <div class="${this.config.cssPrefix}loading-placeholder">Loading ${event.title}...</div>
        </div>
      </div>
    `;
  }

  async renderSchedule(data) {
    try {
      if (this.isDestroyed) {
        console.warn(`Cannot render ${this.config.id} schedule - generator is destroyed`);
        return;
      }

      this.preserveOriginalData(data);
      this.debug(`Starting ${this.config.id} schedule rendering with`, data.timeSlots.length, "time slots");

      this.container.innerHTML = "";
      this.loadedEvents.clear();

      const fragment = document.createDocumentFragment();
      data.timeSlots.forEach((timeSlot) => {
        const timeSlotEl = this.generateTimeSlot(timeSlot);
        fragment.appendChild(timeSlotEl);
      });

      this.container.appendChild(fragment);

      requestAnimationFrame(() => {
        if (!this.isDestroyed) {
          this.loadEventContent();
        }
      });

      this.debug(`${this.config.displayName} schedule rendering completed successfully`);
    } catch (error) {
      console.error(`${this.config.debugPrefix} Failed to render schedule:`, error);
      this.showScheduleError(error);
    }
  }

  async loadEventContent() {
    try {
      if (this.isDestroyed) {
        console.warn(`${this.config.debugPrefix} Cannot load event content - generator is destroyed`);
        return;
      }

      await this.eventLoader.loadTemplate();

      const containers = this.container.querySelectorAll(
        `.${this.config.cssPrefix}event-panel-container[data-event-id], .${this.config.cssPrefix}event-panel-main-container[data-event-id]`
      );
      this.debug("Loading content for", containers.length, `${this.config.id} event containers`);

      const loadPromises = Array.from(containers).map((container) =>
        this.loadSingleEvent(container)
      );

      const results = await Promise.allSettled(loadPromises);
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && !this.isDestroyed) {
          const container = containers[index];
          const eventId = container.dataset.eventId;
          if (eventId) {
            this.loadedEvents.add(eventId);
          }
        }
      });

      this.debug(`All ${this.config.id} event content loaded successfully`);

      if (this.currentFilterCategory) {
        this.debug("Reapplying filter after content load:", this.currentFilterCategory);
        this.applyEventFiltering(this.currentFilterCategory);
      }
    } catch (error) {
      console.error(`${this.config.debugPrefix} Failed to load event content:`, error);
      this.showEventLoadError(error);
    }
  }

  async loadSingleEvent(container) {
    if (this.isDestroyed) return;

    const eventId = container.dataset.eventId;
    const eventType = container.dataset.eventType || "big";
    this.debug(`Loading ${this.config.id} event:`, eventId);

    const eventData = window.SHARED_EVENTS ? window.SHARED_EVENTS[eventId] : null;

    if (!window.SHARED_EVENTS) {
      console.error(`${this.config.debugPrefix} SHARED_EVENTS not loaded - check data file loading`);
      return;
    }

    try {
      if (!eventData) {
        console.warn(`${this.config.debugPrefix} No data found for event: ${eventId}`);
        throw new Error(`No data found for ${this.config.id} event: ${eventId}`);
      }

      this.debug(`Creating ${this.config.id} event panel for:`, eventId);
      const eventPanel = this.eventLoader.createEventPanel(eventData, eventType, this.config.widgetType);

      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(eventPanel);
        this.debug(`Successfully loaded ${this.config.id} event:`, eventId);
      }
    } catch (error) {
      console.error(`${this.config.debugPrefix} Failed to load event ${eventId}:`, error);

      if (!this.isDestroyed && container.parentNode) {
        container.innerHTML = "";
        container.appendChild(this.eventLoader.createErrorPanel(error.message));
      }
    }
  }

  preserveOriginalData(scheduleData) {
    if (!this.originalData) {
      this.originalData = JSON.parse(JSON.stringify(scheduleData));
      this.debug("Original schedule data preserved for filtering");
    }
  }

  filterEventsByCategory(categoryKey) {
    if (!this.originalData) {
      this.debug("No original data available for filtering");
      return;
    }

    this.debug("Filtering events by category:", categoryKey);
    this.currentFilterCategory = categoryKey;
    this.applyEventFiltering(categoryKey);
  }

  resetFilter() {
    this.debug("Resetting filter - showing all events");
    this.currentFilterCategory = null;
    this.clearEventFiltering();
  }

  applyEventFiltering(categoryKey) {
    this.debug("Starting event filtering with category:", categoryKey);

    const eventPanels = this.container.querySelectorAll(
      `.${this.config.cssPrefix}event-panel-container, .${this.config.cssPrefix}event-panel-main-container`
    );

    this.debug(`Found ${eventPanels.length} event panels to filter`);

    eventPanels.forEach((panel, index) => {
      const eventId = panel.dataset.eventId;
      
      if (!eventId) {
        this.debug("Panel missing data-event-id:", panel.outerHTML.substring(0, 200));
        return;
      }

      const eventData = window.SHARED_EVENTS && window.SHARED_EVENTS[eventId];
      if (!eventData) {
        this.debug(`No event data found for ${eventId} in SHARED_EVENTS`);
        return;
      }

      panel.classList.remove("filtered-out", "filtered-in");

      const eventCategoryKey = eventData.categoryKey || eventData.category;
      if (eventCategoryKey === categoryKey) {
        panel.classList.add("filtered-in");
        this.debug(`✅ Event ${eventId} matches filter ${categoryKey} - HIGHLIGHTED`);
      } else {
        panel.classList.add("filtered-out");
        this.debug(`❌ Event ${eventId} filtered out (${eventCategoryKey} !== ${categoryKey}) - GREYED OUT`);
      }
    });

    this.debug("Event filtering completed");
  }

  clearEventFiltering() {
    const eventPanels = this.container.querySelectorAll(
      `.${this.config.cssPrefix}event-panel-container, .${this.config.cssPrefix}event-panel-main-container`
    );

    eventPanels.forEach((panel) => {
      panel.classList.remove("filtered-out", "filtered-in");
    });

    this.debug("All event filtering cleared");
  }

  showScheduleError(error) {
    this.container.innerHTML = `
      <div class="${this.config.cssPrefix}error-placeholder" style="width: 100%; height: 200px; max-width: none;">
        <strong>Failed to load ${this.config.id} schedule</strong>
        <small>${error.message}</small>
        <small>Please check console for details</small>
      </div>
    `;
  }

  showEventLoadError(error) {
    const containers = this.container.querySelectorAll(`.${this.config.cssPrefix}loading-placeholder`);
    containers.forEach((container) => {
      container.className = `${this.config.cssPrefix}error-placeholder`;
      container.innerHTML = `
        <strong>Failed to load ${this.config.id} events</strong>
        <small>${error.message}</small>
      `;
    });
  }

  destroy() {
    this.debug(`Destroying ${this.config.displayName}ScheduleGenerator...`);

    try {
      this.isDestroyed = true;
      this.loadedEvents.clear();

      if (this.eventLoader && typeof this.eventLoader.destroy === "function") {
        this.eventLoader.destroy();
      }
      this.eventLoader = null;

      if (this.container && this.container.parentNode) {
        this.container.innerHTML = "";
      }
      this.container = null;

      this.debug(`${this.config.displayName}ScheduleGenerator destroyed successfully`);
    } catch (error) {
      console.error(`${this.config.debugPrefix} Error destroying ScheduleGenerator:`, error);
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = UnifiedTimePeriodsScheduleGenerator;
} else if (typeof window !== "undefined") {
  window.UnifiedTimePeriodsScheduleGenerator = UnifiedTimePeriodsScheduleGenerator;
  
  // Factory functions for backward compatibility
  window.MorningScheduleGenerator = class extends UnifiedTimePeriodsScheduleGenerator {
    constructor(container) {
      super(container, TIME_PERIODS_CONFIG.morning);
    }
  };
  
  window.AfternoonScheduleGenerator = class extends UnifiedTimePeriodsScheduleGenerator {
    constructor(container) {
      super(container, TIME_PERIODS_CONFIG.afternoon);
    }
  };
}
```

### 3. Unified Widget Core

```javascript
// unified-time-periods-widget-core.js
class UnifiedTimePeriodsScheduleWidget {
  constructor(elementId, options = {}) {
    this.element = typeof elementId === "string" 
      ? document.getElementById(elementId) 
      : elementId;

    if (!this.element) {
      throw new Error(`Element ${elementId} not found`);
    }

    // Determine time period from options or element data
    this.timePeriod = options.timePeriod || 
      this.element.getAttribute('data-time-period') || 
      'morning';
    
    this.config = TIME_PERIODS_CONFIG[this.timePeriod];
    if (!this.config) {
      throw new Error(`Invalid time period: ${this.timePeriod}`);
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
    this.dropdownController = null;

    // Filter state management
    this.currentFilterCategory = null;
    this.currentCategoryKey = null;
    this.originalScheduleData = null;

    this.init();
  }

  generateUniqueId() {
    return `${this.config.cssPrefix.replace(/[^a-z]/g, '')}-${Date.now().toString(36)}${Math.random().toString(36).substr(2)}`;
  }

  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log(`${this.config.debugPrefix} Widget Core`, ...args);
    }
  }

  init() {
    if (this.initialized) return;

    try {
      this.debug(`Initializing NZGDC ${this.config.displayName} Schedule Widget...`);

      if (!this.validateDependencies()) {
        throw new Error(`Required ${this.config.id} schedule dependencies not loaded`);
      }

      this.render();
      this.initializeSchedule();

      this.initialized = true;
      this.debug(`${this.config.displayName} widget initialization completed successfully`);
    } catch (error) {
      console.error(`${this.config.debugPrefix} Failed to initialize widget:`, error);
      this.showInitializationError(error);
    }
  }

  validateDependencies() {
    const missing = [];

    if (!window.TIME_PERIODS_CONFIG) {
      missing.push("TIME_PERIODS_CONFIG");
    }
    if (!window.SHARED_EVENTS) {
      missing.push("SHARED_EVENTS");
    }
    if (typeof window.UnifiedEventLoader === "undefined") {
      missing.push("UnifiedEventLoader");
    }
    if (typeof window.UnifiedTimePeriodsScheduleGenerator === "undefined") {
      missing.push("UnifiedTimePeriodsScheduleGenerator");
    }

    if (missing.length > 0) {
      console.error(`${this.config.debugPrefix} Missing dependencies:`, missing);
      return false;
    }

    this.debug(`All ${this.config.id} widget dependencies validated successfully`);
    return true;
  }

  render() {
    this.element.className = `${this.config.cssPrefix}schedule-widget`;
    this.element.innerHTML = `
      ${this.options.showTimeNavigation || this.options.showFilters ? this.renderNavigation() : ""}
      <div id="${this.config.id}-schedule-content-${this.uniqueId}"></div>
      ${this.options.showFooter ? this.renderFooter() : ""}
    `;
  }

  renderNavigation() {
    return `
      <div class="${this.config.cssPrefix}schedule-sub-navigation">
        ${this.options.showTimeNavigation ? this.renderTimeNavigationButtons() : ""}
        ${this.options.showFilters ? this.renderFiltersInline() : ""}
      </div>
    `;
  }

  renderTimeNavigationButtons() {
    return `
      <div class="nzgdc-schedule-time-navigation">
        <button class="nzgdc-morning-events-button" data-nav="morning">
          ${this.config.navigation.buttons.other}
        </button>
        <button class="nzgdc-afternoon-events-button" data-nav="afternoon">
          ${this.config.navigation.buttons.current}
        </button>
      </div>
    `;
  }

  renderFiltersInline() {
    return `
      <div class="${this.config.cssPrefix}filters-section">
        <div class="${this.config.cssPrefix}filters-label">
          <span class="${this.config.cssPrefix}filters-label-text">Filters:</span>
        </div>
        <div class="${this.config.cssPrefix}filters-value" data-dropdown-trigger="${this.config.id}-category-dropdown">
          <span class="${this.config.cssPrefix}filters-value-text">ALL EVENTS ▶</span>
        </div>
        ${this.generateCategoryDropdownHTML()}
      </div>
    `;
  }

  generateCategoryDropdownHTML() {
    return `
      <div class="category-dropdown-backdrop" id="${this.config.id}-category-backdrop"></div>
      <div class="category-dropdown-overlay" id="${this.config.id}-category-dropdown">
        ${this.generateCategoryOptions()}
      </div>
    `;
  }

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

    const sortedCategories = categories.sort((a, b) => {
      if (a.key === "ALL") return -1;
      if (b.key === "ALL") return 1;
      return a.name.localeCompare(b.name);
    });

    return sortedCategories
      .map(category => 
        `<div class="category-dropdown-item" data-category="${category.key}" tabindex="0">
          ${category.name.toUpperCase()}
        </div>`
      )
      .join("");
  }

  updateFilterValueText(categoryName) {
    const filterText = this.element.querySelector(`.${this.config.cssPrefix}filters-value-text`);
    const filterValue = this.element.querySelector(`.${this.config.cssPrefix}filters-value`);
    
    if (filterText && filterValue) {
      this.debug("Updating filter value text and background for:", categoryName);

      filterValue.removeAttribute("style");
      filterValue.classList.remove(
        "category-all-events", "category-game-design", "category-art",
        "category-programming", "category-audio", "category-story-narrative",
        "category-business-marketing", "category-culture", "category-production-qa",
        "category-realities-vr-ar-mr", "category-data-testing-research",
        "category-serious-educational"
      );

      if (categoryName === "All Events" || !categoryName) {
        filterText.textContent = "ALL EVENTS ▶";
        filterValue.classList.add("category-all-events");
        this.currentCategoryKey = "ALL";
        filterValue.removeAttribute("data-active-category");
      } else {
        filterText.textContent = `${categoryName.toUpperCase()} ▶`;
        const categoryClass = this.getCategoryClassFromKey(this.currentCategoryKey);
        filterValue.classList.add(categoryClass);
        filterValue.setAttribute("data-active-category", categoryName);
      }
    }
  }

  getCategoryColors(categoryName) {
    const categoryColorMap = {
      "Game Design": { background: "#9ee6ab", text: "#000000" },
      "Art": { background: "#ffc999", text: "#000000" },
      "Programming": { background: "#ccf2f1", text: "#000000" },
      "Audio": { background: "#197bff", text: "#ffffff" },
      "Story & Narrative": { background: "#fff47f", text: "#000000" },
      "Business & Marketing": { background: "#e7f1ff", text: "#000000" },
      "Culture": { background: "#fac7d5", text: "#000000" },
      "Production & QA": { background: "#512340", text: "#ffffff" },
      "Realities (VR, AR, MR)": { background: "#d1afff", text: "#000000" },
      "Data, Testing or Research": { background: "#917b89", text: "#ffffff" },
      "Serious & Educational Games": { background: "#ffafaf", text: "#000000" },
    };

    return categoryColorMap[categoryName] || { background: "#ffffff", text: "#000000" };
  }

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

  updateTriangleState(isOpen) {
    const filterText = this.element.querySelector(`.${this.config.cssPrefix}filters-value-text`);
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
      <div class="${this.config.cssPrefix}schedule-footer-navigation">
        <button class="${this.config.cssPrefix}back-to-top">
          BACK TO TOP
        </button>
      </div>
    `;
  }

  async initializeSchedule() {
    try {
      const scheduleContainer = document.getElementById(`${this.config.id}-schedule-content-${this.uniqueId}`);
      if (!scheduleContainer) {
        throw new Error(`${this.config.displayName} schedule container not found`);
      }

      if (!this.config.schedule) {
        throw new Error(`${this.config.displayName} schedule data not found`);
      }

      this.scheduleGenerator = new UnifiedTimePeriodsScheduleGenerator(scheduleContainer, this.config);
      await this.scheduleGenerator.renderSchedule(this.config.schedule);

      this.addEventHandlers();
      this.initializeDropdownController();

      this.debug(`${this.config.displayName} schedule initialization completed`);
    } catch (error) {
      console.error(`${this.config.debugPrefix} Failed to initialize schedule:`, error);
      this.showInitializationError(error);
    }
  }

  initializeDropdownController() {
    const dropdownElement = this.element.querySelector(`#${this.config.id}-category-dropdown`);
    if (dropdownElement && this.options.showFilters) {
      this.dropdownController = new UnifiedCategoryDropdownController();
      this.dropdownController.init(this, dropdownElement);
      this.debug("Dropdown controller initialized");
    }
  }

  applyFilter(categoryKey) {
    this.debug("Applying filter:", categoryKey);
    this.currentFilterCategory = categoryKey;

    if (this.scheduleGenerator && this.scheduleGenerator.filterEventsByCategory) {
      this.scheduleGenerator.filterEventsByCategory(categoryKey);
      this.debug("Filter applied successfully");
    }
  }

  clearFilter() {
    this.debug("Clearing filter");
    this.currentFilterCategory = null;

    if (this.scheduleGenerator && this.scheduleGenerator.resetFilter) {
      this.scheduleGenerator.resetFilter();
      this.debug("Filter cleared successfully");
    }
  }

  addEventHandlers() {
    // Back to top button
    const backToTopBtn = this.element.querySelector(`.${this.config.cssPrefix}back-to-top`);
    if (backToTopBtn) {
      const handler = (event) => {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      backToTopBtn.addEventListener("click", handler, {
        signal: this.abortController.signal,
      });

      this.eventListeners.set(backToTopBtn, { type: "click", handler: handler });
    }

    // Navigation buttons
    const morningBtn = this.element.querySelector(".nzgdc-morning-events-button");
    const afternoonBtn = this.element.querySelector(".nzgdc-afternoon-events-button");

    if (morningBtn) {
      const handler = (event) => {
        event.preventDefault();
        this.debug("Morning events button clicked");
        this.element.dispatchEvent(new CustomEvent(this.config.navigation.eventName, {
          detail: { target: "morning" }
        }));
      };

      morningBtn.addEventListener("click", handler, {
        signal: this.abortController.signal,
      });

      this.eventListeners.set(morningBtn, { type: "click", handler: handler });
    }

    if (afternoonBtn) {
      const handler = (event) => {
        event.preventDefault();
        this.debug("Afternoon events button clicked");
        this.element.dispatchEvent(new CustomEvent(this.config.navigation.eventName, {
          detail: { target: "afternoon" }
        }));
      };

      afternoonBtn.addEventListener("click", handler, {
        signal: this.abortController.signal,
      });

      this.eventListeners.set(afternoonBtn, { type: "click", handler: handler });
    }
  }

  // Public API methods
  scrollToTimeSlot(timeSlotId) {
    const timeSlot = this.element.querySelector(`[data-time-slot="${timeSlotId}"]`);
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
    return window.SHARED_EVENTS ? window.SHARED_EVENTS[eventId] : null;
  }

  getAllEvents() {
    return window.SHARED_EVENTS || {};
  }

  getScheduleData() {
    return this.config.schedule || {};
  }

  destroy() {
    this.debug(`Destroying NZGDC ${this.config.displayName} Schedule Widget...`);

    try {
      this.abortController.abort();

      this.eventListeners.forEach((listenerInfo, element) => {
        try {
          element.removeEventListener(listenerInfo.type, listenerInfo.handler);
        } catch (error) {
          console.warn(`${this.config.debugPrefix} Error removing event listener:`, error);
        }
      });
      this.eventListeners.clear();

      this.observers.forEach((observer) => {
        try {
          observer.disconnect();
        } catch (error) {
          console.warn(`${this.config.debugPrefix} Error disconnecting observer:`, error);
        }
      });
      this.observers.clear();

      if (this.dropdownController) {
        this.dropdownController.destroy();
        this.dropdownController = null;
      }

      if (this.scheduleGenerator && typeof this.scheduleGenerator.destroy === "function") {
        this.scheduleGenerator.destroy();
      }
      this.scheduleGenerator = null;

      if (this.element) {
        this.element.innerHTML = "";
        this.element.className = "";
      }

      this.initialized = false;
      this.debug(`${this.config.displayName} widget destroyed successfully`);
    } catch (error) {
      console.error(`${this.config.debugPrefix} Error during widget destruction:`, error);
    }
  }

  isDestroyed() {
    return !this.initialized || this.abortController.signal.aborted;
  }

  showInitializationError(error) {
    this.element.innerHTML = `
      <div class="${this.config.cssPrefix}error-placeholder" style="width: 100%; height: 300px; max-width: none;">
        <strong>Failed to initialize ${this.config.id} schedule widget</strong>
        <small>${error.message}</small>
        <small>Please check console for details</small>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">Refresh Page</button>
      </div>
    `;
  }
}

// Unified Category Dropdown Controller
class UnifiedCategoryDropdownController {
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
    this.backdrop = this.widget.element.querySelector(".category-dropdown-backdrop");

    this.attachEventHandlers();
    this.widget.debug("UnifiedCategoryDropdownController initialized");
  }

  attachEventHandlers() {
    const filterTrigger = this.widget.element.querySelector("[data-dropdown-trigger]");
    if (filterTrigger) {
      filterTrigger.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      }, { signal: this.abortController.signal });
    }

    const categoryItems = this.dropdown.querySelectorAll(".category-dropdown-item");
    categoryItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const categoryKey = item.dataset.category;
        const categoryName = item.textContent.trim();
        this.selectCategory(categoryKey, categoryName);
      }, { signal: this.abortController.signal });

      item.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const categoryKey = item.dataset.category;
          const categoryName = item.textContent.trim();
          this.selectCategory(categoryKey, categoryName);
        } else if (e.key === "Escape") {
          this.hide();
        }
      }, { signal: this.abortController.signal });
    });

    document.addEventListener("click", (e) => {
      if (this.isOpen && !this.dropdown.contains(e.target) && !e.target.closest("[data-dropdown-trigger]")) {
        this.hide();
      }
    }, { signal: this.abortController.signal });

    if (this.backdrop) {
      this.backdrop.addEventListener("click", () => {
        this.hide();
      }, { signal: this.abortController.signal });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.hide();
      }
    }, { signal: this.abortController.signal });
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
    this.widget.updateTriangleState(true);
    this.widget.debug("Dropdown opened");
  }

  hide() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.dropdown.classList.remove("visible");
    if (this.backdrop) {
      this.backdrop.classList.remove("visible");
    }
    this.widget.updateTriangleState(false);
    this.widget.debug("Dropdown closed");
  }

  selectCategory(categoryKey, categoryName) {
    this.widget.debug("Category selected:", categoryKey, categoryName);

    this.widget.currentCategoryKey = categoryKey;
    this.widget.updateFilterValueText(categoryName);

    if (categoryKey === "ALL") {
      this.widget.clearFilter();
    } else {
      this.widget.applyFilter(categoryKey);
    }

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
  module.exports = UnifiedTimePeriodsScheduleWidget;
} else if (typeof window !== "undefined") {
  window.UnifiedTimePeriodsScheduleWidget = UnifiedTimePeriodsScheduleWidget;
  window.UnifiedCategoryDropdownController = UnifiedCategoryDropdownController;
  
  // Factory functions and backward compatibility aliases
  window.NZGDCMorningScheduleWidget = class extends UnifiedTimePeriodsScheduleWidget {
    constructor(elementId, options = {}) {
      super(elementId, { ...options, timePeriod: 'morning' });
    }
  };
  
  window.NZGDCAfternoonScheduleWidget = class extends UnifiedTimePeriodsScheduleWidget {
    constructor(elementId, options = {}) {
      super(elementId, { ...options, timePeriod: 'afternoon' });
    }
  };
  
  // Aliases for easier access
  window.NZGDCMorningSchedule = window.NZGDCMorningScheduleWidget;
  window.NZGDCAfternoonSchedule = window.NZGDCAfternoonScheduleWidget;
  
  // Legacy dropdown controller aliases
  window.MorningCategoryDropdownController = UnifiedCategoryDropdownController;
  window.AfternoonCategoryDropdownController = UnifiedCategoryDropdownController;
}
```

## Migration Implementation Plan

### Phase 1: Data Consolidation (Weeks 1-2)

**Step 1.1: Create Shared Data Files**
```bash
# Create new consolidated data files
touch shared-events.js
touch time-periods-config.js
```

**Step 1.2: Implement Backward Compatibility**
```javascript
// Update morning-events.js to use shared data
const SHARED_EVENTS = require('./shared-events.js');
module.exports = SHARED_EVENTS;
if (typeof window !== "undefined") {
  window.MORNING_EVENTS = SHARED_EVENTS;
}

// Update afternoon-events.js to use shared data  
const SHARED_EVENTS = require('./shared-events.js');
module.exports = SHARED_EVENTS;
if (typeof window !== "undefined") {
  window.AFTERNOON_EVENTS = SHARED_EVENTS;
}
```

**Step 1.3: Testing Strategy**
- Unit tests for data consistency
- Integration tests for existing widgets
- Visual regression testing
- Performance baseline measurements

### Phase 2: Generator Consolidation (Weeks 3-6)

**Step 2.1: Create Unified Generator**
- Implement `UnifiedTimePeriodsScheduleGenerator`
- Add configuration-based differentiation
- Create factory classes for backward compatibility

**Step 2.2: Gradual Migration**
```javascript
// Feature flag implementation
const USE_UNIFIED_GENERATOR = window.NZGDC_USE_UNIFIED_GENERATOR || false;

if (USE_UNIFIED_GENERATOR) {
  this.scheduleGenerator = new UnifiedTimePeriodsScheduleGenerator(container, config);
} else {
  this.scheduleGenerator = new MorningScheduleGenerator(container);
}
```

**Step 2.3: Testing and Validation**
- A/B testing with feature flags
- Performance comparison
- Functionality parity verification
- Browser compatibility testing

### Phase 3: Widget Core Consolidation (Weeks 7-12)

**Step 3.1: Create Unified Widget Core**
- Implement `UnifiedTimePeriodsScheduleWidget`
- Configuration-based differentiation
- Comprehensive backward compatibility

**Step 3.2: Progressive Migration**
```javascript
// Gradual rollout strategy
const WIDGET_ROLLOUT_PERCENTAGE = window.NZGDC_UNIFIED_WIDGET_ROLLOUT || 0;

if (Math.random() * 100 < WIDGET_ROLLOUT_PERCENTAGE) {
  // Use new unified widget
  return new UnifiedTimePeriodsScheduleWidget(elementId, options);
} else {
  // Use legacy widget
  return new NZGDCMorningScheduleWidget(elementId, options);
}
```

**Step 3.3: Integration Testing**
- End-to-end testing scenarios
- Cross-browser compatibility
- Mobile device testing
- Accessibility compliance verification

### Phase 4: CSS and Template Optimization (Weeks 13-15)

**Step 4.1: CSS Consolidation**
```scss
// CSS variables for theme differentiation
.nzgdc-schedule-widget {
  --primary-color: var(--time-period-primary, #4a90e2);
  --secondary-color: var(--time-period-secondary, #7bb3f0);
  --accent-color: var(--time-period-accent, #2c5aa0);
}

.nzgdc-schedule-widget[data-time-period="morning"] {
  --time-period-primary: #f39c12;
  --time-period-secondary: #f7dc6f;
  --time-period-accent: #d68910;
}

.nzgdc-schedule-widget[data-time-period="afternoon"] {
  --time-period-primary: #3498db;
  --time-period-secondary: #85c1e9;
  --time-period-accent: #2874a6;
}
```

## Quality Assurance Plan

### Testing Strategy

**Unit Tests**
```javascript
describe('UnifiedTimePeriodsScheduleWidget', () => {
  it('should initialize with morning configuration', () => {
    const widget = new UnifiedTimePeriodsScheduleWidget('test', { timePeriod: 'morning' });
    expect(widget.config.id).toBe('morning');
    expect(widget.config.cssPrefix).toBe('nzgdc-morning-');
  });

  it('should initialize with afternoon configuration', () => {
    const widget = new UnifiedTimePeriodsScheduleWidget('test', { timePeriod: 'afternoon' });
    expect(widget.config.id).toBe('afternoon');
    expect(widget.config.cssPrefix).toBe('nzgdc-afternoon-');
  });

  it('should maintain backward compatibility', () => {
    const morningWidget = new NZGDCMorningScheduleWidget('test');
    const afternoonWidget = new NZGDCAfternoonScheduleWidget('test');
    
    expect(morningWidget).toBeInstanceOf(UnifiedTimePeriodsScheduleWidget);
    expect(afternoonWidget).toBeInstanceOf(UnifiedTimePeriodsScheduleWidget);
  });
});
```

**Integration Tests**
```javascript
describe('Widget Integration', () => {
  it('should render morning schedule correctly', async () => {
    const widget = new UnifiedTimePeriodsScheduleWidget('morning-container', { timePeriod: 'morning' });
    await widget.initializeSchedule();
    
    expect(document.querySelector('.nzgdc-morning-time-category')).toBeTruthy();
    expect(document.querySelector('.nzgdc-morning-event-panel-container')).toBeTruthy();
  });

  it('should filter events correctly', () => {
    const widget = new UnifiedTimePeriodsScheduleWidget('test', { timePeriod: 'morning' });
    widget.applyFilter('PROGRAMMING');
    
    expect(widget.currentFilterCategory).toBe('PROGRAMMING');
  });
});
```

### Performance Benchmarks

```javascript
// Performance testing framework
const performanceBenchmark = {
  async testRenderingSpeed(implementation, iterations = 100) {
    const times = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await implementation.renderSchedule();
      const end = performance.now();
      times.push(end - start);
    }
    
    return {
      average: times.reduce((a, b) => a + b) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      standardDeviation: this.calculateStandardDeviation(times)
    };
  },

  async testMemoryUsage(implementation) {
    const initialMemory = performance.memory.usedJSHeapSize;
    await implementation.renderSchedule();
    const afterRenderMemory = performance.memory.usedJSHeapSize;
    
    implementation.destroy();
    
    // Force garbage collection if available
    if (window.gc) window.gc();
    
    const afterDestroyMemory = performance.memory.usedJSHeapSize;
    
    return {
      renderingMemoryIncrease: afterRenderMemory - initialMemory,
      memoryLeakage: afterDestroyMemory - initialMemory
    };
  }
};
```

## Rollback Strategy

### Emergency Rollback Plan

**Immediate Rollback (< 5 minutes)**
```javascript
// Feature flag emergency disable
window.NZGDC_USE_UNIFIED_WIDGETS = false;
window.NZGDC_UNIFIED_WIDGET_ROLLOUT = 0;

// Force refresh all widgets
document.querySelectorAll('[data-nzgdc-widget]').forEach(element => {
  element.dispatchEvent(new CustomEvent('nzgdc-force-refresh'));
});
```

**Staged Rollback (1-24 hours)**
1. Reduce rollout percentage incrementally
2. Monitor error rates and performance metrics
3. Revert to legacy implementation for affected users
4. Preserve data integrity during rollback

**Complete Rollback (1-7 days)**
1. Restore original file structure
2. Update all integration points
3. Revert CSS and template changes
4. Comprehensive regression testing

## Success Metrics

### Code Quality Metrics
- **Code Reduction**: Target 40-50% reduction in JavaScript codebase
- **Cyclomatic Complexity**: Maintain or improve complexity scores
- **Test Coverage**: Maintain minimum 80% test coverage
- **Bundle Size**: Reduce total bundle size by 35-45%

### Performance Metrics
- **Load Time**: No regression in initial page load time
- **Rendering Speed**: Maintain or improve widget rendering performance
- **Memory Usage**: Reduce memory footprint by 20-30%
- **Bundle Parsing**: Improve JavaScript parsing time

### Reliability Metrics
- **Error Rate**: Maintain error rate below 0.1%
- **Availability**: 99.9% widget availability target
- **User Experience**: No degradation in user interaction metrics
- **Cross-browser Compatibility**: 100% functionality across supported browsers

## Conclusion

This implementation proposal provides a comprehensive path to consolidating the Morning and Afternoon NZGDC widget systems while maintaining backward compatibility and minimizing risk. The phased approach allows for careful validation at each step, with clear rollback procedures and success metrics to ensure a smooth transition.

The unified architecture will result in significantly reduced code complexity, improved maintainability, and consistent behavior across time periods while providing a foundation for future enhancements to the NZGDC widget ecosystem.