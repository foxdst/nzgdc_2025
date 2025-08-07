/**
 * NZGDC Event Categories Configuration
 *
 * This module provides a centralized configuration for all event categories
 * used across the NZGDC event panels, including their colors and styling.
 *
 * Usage:
 * - Import this module in your HTML files or JavaScript applications
 * - Use EventCategories.setCategory() to dynamically change categories
 * - Use EventCategories.getCategory() to retrieve category information
 */

const EventCategories = {
  // Category definitions with colors matching the design system
  categories: {
    STORY_NARRATIVE: {
      name: "Story & Narrative",
      color: "#F53E3E",
      textColor: "#FFFFFF",
    },
    BUSINESS_MARKETING: {
      name: "Business & Marketing",
      color: "#FF8C42",
      textColor: "#FFFFFF",
    },
    CODING_DEVELOPMENT: {
      name: "Coding & Development",
      color: "#FFD93D",
      textColor: "#000000",
    },
    PRODUCTION_QA: {
      name: "Production & QA",
      color: "#6BCF7F",
      textColor: "#000000",
    },
    DATA_TESTING_RESEARCH: {
      name: "Data, Testing, Research",
      color: "#4ECDC4",
      textColor: "#000000",
    },
    GAME_DESIGN_CREATIVE_ARTS: {
      name: "Game Design & Creative Arts",
      color: "#4D79A4",
      textColor: "#FFFFFF",
    },
    REALITIES_VR_AR_MR_XR: {
      name: "Realities (VR, AR, MR, XR)",
      color: "#9B59B6",
      textColor: "#FFFFFF",
    },
    SERIOUS_EDUCATIONAL: {
      name: "Serious & Educational",
      color: "#8E44AD",
      textColor: "#FFFFFF",
    },
    SOUND_MUSIC: {
      name: "Sound & Music",
      color: "#E91E63",
      textColor: "#FFFFFF",
    },
    CULTURE: {
      name: "Culture",
      color: "#8D6E63",
      textColor: "#FFFFFF",
    },
    CODING_DEVELOPMENT_ALT: {
      name: "Coding & Development",
      color: "#000000",
      textColor: "#FFFFFF",
    },
    GAME_DESIGN_CREATIVE_ARTS_ALT: {
      name: "Game Design & Creative Arts",
      color: "#000000",
      textColor: "#FFFFFF",
    },
  },

  /**
   * Get category information by key
   * @param {string} categoryKey - The category key
   * @returns {object|null} Category object or null if not found
   */
  getCategory: function (categoryKey) {
    return this.categories[categoryKey] || null;
  },

  /**
   * Get all available categories
   * @returns {object} All categories
   */
  getAllCategories: function () {
    return this.categories;
  },

  /**
   * Set category for Main event panel
   * @param {string} categoryKey - The category key
   * @param {string} panelId - Optional panel ID, defaults to 'nzgdc-event-panel-main'
   */
  setCategoryMain: function (categoryKey, panelId = "nzgdc-event-panel-main") {
    const category = this.getCategory(categoryKey);
    if (!category) {
      console.warn(`Category "${categoryKey}" not found`);
      return false;
    }

    const panel = document.querySelector(`.${panelId}`);
    if (!panel) {
      console.warn(`Panel with class "${panelId}" not found`);
      return false;
    }

    // Update CSS custom properties
    panel.style.setProperty("--color-primary", category.color);

    // Update category text
    const categoryTextElement = panel.querySelector(
      ".nzgdc-category-text-main",
    );
    if (categoryTextElement) {
      categoryTextElement.textContent = category.name;
    }

    // Update category background and text color
    const categoryElement = panel.querySelector(".nzgdc-event-category-main");
    if (categoryElement) {
      categoryElement.style.backgroundColor = category.color;
      categoryElement.style.color = category.textColor;
    }

    return true;
  },

  /**
   * Set category for Big event panel
   * @param {string} categoryKey - The category key
   * @param {string} panelId - Optional panel ID, defaults to 'nzgdc-event-panel-big'
   */
  setCategoryBig: function (categoryKey, panelId = "nzgdc-event-panel-big") {
    const category = this.getCategory(categoryKey);
    if (!category) {
      console.warn(`Category "${categoryKey}" not found`);
      return false;
    }

    const panel = document.querySelector(`.${panelId}`);
    if (!panel) {
      console.warn(`Panel with class "${panelId}" not found`);
      return false;
    }

    // Update CSS custom properties
    panel.style.setProperty("--color-primary", category.color);

    // Update category text
    const categoryTextElement = panel.querySelector(".nzgdc-category-text-big");
    if (categoryTextElement) {
      categoryTextElement.textContent = category.name;
    }

    // Update category background and text color
    const categoryElement = panel.querySelector(".nzgdc-event-category-big");
    if (categoryElement) {
      categoryElement.style.backgroundColor = category.color;
      categoryElement.style.color = category.textColor;
    }

    return true;
  },

  /**
   * Set category for both Main and Big panels
   * @param {string} categoryKey - The category key
   */
  setCategory: function (categoryKey) {
    const mainResult = this.setCategoryMain(categoryKey);
    const bigResult = this.setCategoryBig(categoryKey);
    return mainResult || bigResult;
  },

  /**
   * Initialize event categories with default or specified category
   * Only initializes if panels are actually present in the DOM
   * @param {string} defaultCategory - Default category key to set
   * @param {boolean} force - Force initialization even if no panels found
   */
  init: function (defaultCategory = "STORY_NARRATIVE", force = false) {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        this.conditionalInit(defaultCategory, force);
      });
    } else {
      this.conditionalInit(defaultCategory, force);
    }
  },

  /**
   * Conditionally initialize only if event panels are present
   * @param {string} defaultCategory - Default category key to set
   * @param {boolean} force - Force initialization even if no panels found
   */
  conditionalInit: function (
    defaultCategory = "STORY_NARRATIVE",
    force = false,
  ) {
    // Check if any event panels exist in the current document
    const hasMainPanel =
      document.querySelector(".nzgdc-event-panel-main") !== null;
    const hasBigPanel =
      document.querySelector(".nzgdc-event-panel-big") !== null;
    const hasAnyPanel = hasMainPanel || hasBigPanel;

    if (hasAnyPanel || force) {
      // Only set category if panels exist or forced
      if (hasMainPanel || force) {
        this.setCategoryMain(defaultCategory);
      }
      if (hasBigPanel || force) {
        this.setCategoryBig(defaultCategory);
      }
    } else {
      // Panels not found - this is expected for iframe contexts or dynamic content
      console.log(
        "EventCategories: No panels found in current document - skipping auto-initialization",
      );
    }
  },

  /**
   * Create a category selector dropdown (for testing/admin purposes)
   * @param {string} containerId - ID of container to append selector to
   */
  createCategorySelector: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`Container with ID "${containerId}" not found`);
      return;
    }

    const select = document.createElement("select");
    select.id = "nzgdc-category-selector";
    select.style.cssText = `
            padding: 8px;
            margin: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-family: Arial, sans-serif;
        `;

    // Add default option
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a category...";
    select.appendChild(defaultOption);

    // Add category options
    Object.keys(this.categories).forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = this.categories[key].name;
      select.appendChild(option);
    });

    // Add change event listener
    select.addEventListener("change", (e) => {
      if (e.target.value) {
        this.setCategory(e.target.value);
      }
    });

    container.appendChild(select);
  },

  /**
   * API-friendly method to update event category
   * @param {object} config - Configuration object
   * @param {string} config.category - Category key
   * @param {string} config.panelType - 'main', 'big', or 'both'
   * @param {string} config.panelId - Optional custom panel ID
   */
  updateFromAPI: function (config) {
    const { category, panelType = "both", panelId } = config;

    if (!category) {
      console.error("Category is required");
      return { success: false, error: "Category is required" };
    }

    if (!this.getCategory(category)) {
      console.error(`Invalid category: ${category}`);
      return { success: false, error: `Invalid category: ${category}` };
    }

    try {
      let result = false;

      switch (panelType.toLowerCase()) {
        case "main":
          result = this.setCategoryMain(category, panelId);
          break;
        case "big":
          result = this.setCategoryBig(category, panelId);
          break;
        case "both":
        default:
          result = this.setCategory(category);
          break;
      }

      return {
        success: result,
        category: this.getCategory(category),
        panelType,
      };
    } catch (error) {
      console.error("Error updating category:", error);
      return { success: false, error: error.message };
    }
  },
};

// Auto-initialize if in browser environment
if (typeof window !== "undefined") {
  // Make globally available
  window.EventCategories = EventCategories;

  // Auto-initialize with default category only if panels exist
  // This prevents console warnings in iframe contexts or dynamic content scenarios
  EventCategories.init();
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = EventCategories;
}

// Export for ES6 modules
if (typeof exports !== "undefined") {
  exports.EventCategories = EventCategories;
}
