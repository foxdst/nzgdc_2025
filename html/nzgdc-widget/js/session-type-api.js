// NZGDC Schedule Widget - Session Type API
// Centralized Session Type Data Access API

// Note: DataManager is expected to be loaded before this script

/**
 * Get the singleton DataManager instance
 * @returns {DataManager} DataManager instance
 */
function getDataManager() {
  if (!window.dataManagerInstance) {
    throw new Error(
      "[SessionTypeAPI] Global dataManagerInstance not available. Ensure DataManager is initialized before using SessionTypeAPI.",
    );
  }
  return window.dataManagerInstance;
}

/**
 * Centralized Session Type Data Access API
 * Handles session type information for events and schedules
 */
const SessionTypeAPI = {
  /**
   * Get a single session type by ID
   * @param {number} sessionTypeId - Unique session type identifier
   * @returns {Object|null} Standardized session type object or null if not found
   */
  getSessionType: function (sessionTypeId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getSessionType(sessionTypeId);
    } catch (error) {
      console.error(
        `[SessionTypeAPI] Error getting session type ${sessionTypeId}:`,
        error,
      );
      return null;
    }
  },

  /**
   * Get all session types
   * @returns {Array} Array of all session type objects
   */
  getAllSessionTypes: function () {
    try {
      const dataManager = getDataManager();
      return Array.from(dataManager.getSessionTypeData().values());
    } catch (error) {
      console.error("[SessionTypeAPI] Error getting all session types:", error);
      return [];
    }
  },

  /**
   * Get session types with event counts for filtering
   * @returns {Array} Array of session types with event counts
   */
  getSessionTypesWithEventCounts: function () {
    try {
      const dataManager = getDataManager();
      const sessionTypes = Array.from(
        dataManager.getSessionTypeData().values(),
      );
      const events = dataManager.getAllEvents();

      // Calculate event counts for each session type
      const sessionTypeEventCounts = {};
      events.forEach((event) => {
        if (event.sessionType) {
          const sessionTypeId = event.sessionType.id;
          sessionTypeEventCounts[sessionTypeId] =
            (sessionTypeEventCounts[sessionTypeId] || 0) + 1;
        }
      });

      // Add event counts to session types
      return sessionTypes.map((sessionType) => ({
        ...sessionType,
        eventCount: sessionTypeEventCounts[sessionType.id] || 0,
      }));
    } catch (error) {
      console.error(
        "[SessionTypeAPI] Error getting session types with event counts:",
        error,
      );
      return [];
    }
  },

  /**
   * Get events associated with a specific session type
   * @param {number} sessionTypeId - Session type ID
   * @returns {Array} Array of events for the session type
   */
  getEventsBySessionType: function (sessionTypeId) {
    try {
      if (!sessionTypeId) {
        console.warn("[SessionTypeAPI] Invalid sessionTypeId provided");
        return [];
      }

      const dataManager = getDataManager();
      const allEvents = dataManager.getAllEvents();

      return allEvents.filter(
        (event) => event.sessionType && event.sessionType.id === sessionTypeId,
      );
    } catch (error) {
      console.error(
        `[SessionTypeAPI] Error getting events by session type ${sessionTypeId}:`,
        error,
      );
      return [];
    }
  },
};

if (typeof window !== "undefined") {
  window.SessionTypeAPI = SessionTypeAPI;
}
