// NZGDC Schedule Widget - Room API
// Centralized Room Data Access API

// Note: DataManager is expected to be loaded before this script

/**
 * Get the singleton DataManager instance
 * @returns {DataManager} DataManager instance
 */
function getDataManager() {
  if (!window.dataManagerInstance) {
    throw new Error(
      "[RoomAPI] Global dataManagerInstance not available. Ensure DataManager is initialized before using RoomAPI.",
    );
  }
  return window.dataManagerInstance;
}

/**
 * Centralized Room Data Access API
 * Handles room information for events and schedules
 */
const RoomAPI = {
  /**
   * Get a single room by ID
   * @param {number} roomId - Unique room identifier
   * @returns {Object|null} Standardized room object or null if not found
   */
  getRoom: function (roomId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getRoom(roomId);
    } catch (error) {
      console.error(`[RoomAPI] Error getting room ${roomId}:`, error);
      return null;
    }
  },

  /**
   * Get all rooms
   * @returns {Array} Array of all room objects
   */
  getAllRooms: function () {
    try {
      const dataManager = getDataManager();
      return Array.from(dataManager.getRoomData().values());
    } catch (error) {
      console.error("[RoomAPI] Error getting all rooms:", error);
      return [];
    }
  },

  /**
   * Get rooms associated with a specific event
   * @param {number} eventId - Event ID
   * @returns {Array} Array of rooms for the event
   */
  getRoomsByEvent: function (eventId) {
    try {
      if (!eventId) {
        console.warn("[RoomAPI] Invalid eventId provided");
        return [];
      }

      const dataManager = getDataManager();
      const event = dataManager.getEvent(eventId);

      if (!event) {
        console.warn(`[RoomAPI] Event ${eventId} not found`);
        return [];
      }

      // Return room if it exists on the event
      if (event.room) {
        return [event.room];
      }

      return [];
    } catch (error) {
      console.error(
        `[RoomAPI] Error getting rooms by event ${eventId}:`,
        error,
      );
      return [];
    }
  },
};

if (typeof window !== "undefined") {
  window.RoomAPI = RoomAPI;
}
