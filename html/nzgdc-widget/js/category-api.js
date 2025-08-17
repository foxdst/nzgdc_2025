// NZGDC Schedule Widget - Category API
// Centralized Category Data Access API

// Note: DataManager is expected to be loaded before this script

/**
 * Get the singleton DataManager instance
 * @returns {DataManager} DataManager instance
 */
function getDataManager() {
  if (!window.dataManagerInstance) {
    throw new Error(
      "[CategoryAPI] Global dataManagerInstance not available. Ensure DataManager is initialized before using CategoryAPI.",
    );
  }
  return window.dataManagerInstance;
}

/**
 * Centralized Category Data Access API
 * Replaces direct access to UnifiedEventLoader.categoryDefinitions
 */
const CategoryAPI = {
  /**
   * Get a single category by ID
   * @param {number} categoryId - Unique category identifier
   * @returns {Object|null} Standardized category object or null if not found
   */
  getCategory: function (categoryId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getCategory(categoryId);
    } catch (error) {
      console.error(
        `[CategoryAPI] Error getting category ${categoryId}:`,
        error,
      );
      return null;
    }
  },

  /**
   * Get all categories
   * @returns {Array} Array of all category objects
   */
  getAllCategories: function () {
    try {
      const dataManager = getDataManager();
      return Array.from(dataManager.getCategoryData().values());
    } catch (error) {
      console.error("[CategoryAPI] Error getting all categories:", error);
      return [];
    }
  },

  /**
   * Get categories with event counts for filtering
   * @returns {Array} Array of categories with event counts
   */
  getCategoriesWithEventCounts: function () {
    try {
      const dataManager = getDataManager();
      const categories = Array.from(dataManager.getCategoryData().values());
      const events = dataManager.getAllEvents();

      // Calculate event counts for each category
      const categoryEventCounts = {};
      events.forEach((event) => {
        if (event.categories && Array.isArray(event.categories)) {
          event.categories.forEach((category) => {
            const categoryId = category.id;
            categoryEventCounts[categoryId] =
              (categoryEventCounts[categoryId] || 0) + 1;
          });
        }
      });

      // Add event counts to categories
      return categories.map((category) => ({
        ...category,
        eventCount: categoryEventCounts[category.id] || 0,
      }));
    } catch (error) {
      console.error(
        "[CategoryAPI] Error getting categories with event counts:",
        error,
      );
      return [];
    }
  },
};

if (typeof window !== "undefined") {
  window.CategoryAPI = CategoryAPI;
}
