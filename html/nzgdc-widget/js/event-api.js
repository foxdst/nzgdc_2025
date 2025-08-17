// NZGDC Schedule Widget - Event API
// Centralized Event Data Access API

// Note: DataManager is expected to be loaded before this script

/**
 * Get the singleton DataManager instance
 * @returns {DataManager} DataManager instance
 */
function getDataManager() {
  if (!window.dataManagerInstance) {
    throw new Error(
      "[EventAPI] Global dataManagerInstance not available. Ensure DataManager is initialized before using EventAPI.",
    );
  }
  return window.dataManagerInstance;
}

/**
 * Centralized Event Data Access API
 * Replaces direct access to WORKSHOP_EVENTS, MORNING_EVENTS, AFTERNOON_EVENTS
 */
const EventAPI = {
  /**
   * Get a single event by ID
   * @param {number} eventId - Unique event identifier
   * @returns {Object|null} Standardized event object or null if not found
   */
  getEvent: function (eventId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getEvent(eventId);
    } catch (error) {
      console.error(`[EventAPI] Error getting event ${eventId}:`, error);
      return null;
    }
  },

  /**
   * Get all events across all sources
   * @returns {Array} Array of all standardized event objects
   */
  getAllEvents: function () {
    try {
      const dataManager = getDataManager();
      return dataManager.getAllEvents();
    } catch (error) {
      console.error("[EventAPI] Error getting all events:", error);
      return [];
    }
  },

  /**
   * Get events filtered by category
   * @param {string} categoryKey - Category key to filter by
   * @returns {Array} Array of matching events
   */
  getEventsByCategory: function (categoryKey) {
    try {
      const dataManager = getDataManager();
      return dataManager.getEventsByCategory(categoryKey);
    } catch (error) {
      console.error(
        `[EventAPI] Error getting events by category ${categoryKey}:`,
        error,
      );
      return [];
    }
  },

  /**
   * Search events by title or description
   * @param {string} query - Search query
   * @returns {Array} Array of matching events
   */
  searchEvents: function (query) {
    try {
      if (!query || typeof query !== "string") {
        console.warn("[EventAPI] Invalid search query provided");
        return [];
      }

      const dataManager = getDataManager();
      const allEvents = dataManager.getAllEvents();
      const lowerCaseQuery = query.toLowerCase();

      return allEvents.filter((event) => {
        // Search in title
        if (event.title && event.title.toLowerCase().includes(lowerCaseQuery)) {
          return true;
        }

        // Search in description
        if (
          event.description &&
          event.description.toLowerCase().includes(lowerCaseQuery)
        ) {
          return true;
        }

        // Search in subtitle
        if (
          event.subtitle &&
          event.subtitle.toLowerCase().includes(lowerCaseQuery)
        ) {
          return true;
        }

        return false;
      });
    } catch (error) {
      console.error(
        `[EventAPI] Error searching events for query "${query}":`,
        error,
      );
      return [];
    }
  },

  /**
   * Get featured events
   * @returns {Array} Array of featured events
   */
  getFeaturedEvents: function () {
    try {
      const dataManager = getDataManager();
      const allEvents = dataManager.getAllEvents();

      // Filter for featured events (events with featured flag or special categories)
      return allEvents.filter((event) => {
        // Check if event is explicitly marked as featured
        if (event.featured) {
          return true;
        }

        // Check if any speaker is featured
        if (event.speakers && Array.isArray(event.speakers)) {
          return event.speakers.some((speaker) => speaker.featured);
        }

        return false;
      });
    } catch (error) {
      console.error("[EventAPI] Error getting featured events:", error);
      return [];
    }
  },

  /**
   * Get events associated with a specific speaker
   * @param {number} speakerId - Speaker ID
   * @returns {Array} Array of events for the speaker
   */
  getEventsBySpeaker: function (speakerId) {
    try {
      if (speakerId === undefined || speakerId === null) {
        console.warn("[EventAPI] Invalid speaker ID provided");
        return [];
      }

      const dataManager = getDataManager();
      const allEvents = dataManager.getAllEvents();

      return allEvents.filter((event) => {
        if (!event.speakers || !Array.isArray(event.speakers)) {
          return false;
        }
        return event.speakers.some((speaker) => speaker.id === speakerId);
      });
    } catch (error) {
      console.error(
        `[EventAPI] Error getting events by speaker ${speakerId}:`,
        error,
      );
      return [];
    }
  },
};

if (typeof window !== "undefined") {
  window.EventAPI = EventAPI;
}
