// NZGDC Schedule Widget - Stream API
// Centralized Stream Data Access API

// Note: DataManager is expected to be loaded before this script

/**
 * Get the singleton DataManager instance
 * @returns {DataManager} DataManager instance
 */
function getDataManager() {
  if (!window.dataManagerInstance) {
    throw new Error(
      "[StreamAPI] Global dataManagerInstance not available. Ensure DataManager is initialized before using StreamAPI.",
    );
  }
  return window.dataManagerInstance;
}

/**
 * Centralized Stream Data Access API
 * Handles stream information for events and schedules
 */
const StreamAPI = {
  /**
   * Get a single stream by ID
   * @param {number} streamId - Unique stream identifier
   * @returns {Object|null} Standardized stream object or null if not found
   */
  getStream: function (streamId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getStream(streamId);
    } catch (error) {
      console.error(`[StreamAPI] Error getting stream ${streamId}:`, error);
      return null;
    }
  },

  /**
   * Get all streams
   * @returns {Array} Array of all stream objects
   */
  getAllStreams: function () {
    try {
      const dataManager = getDataManager();
      return Array.from(dataManager.getStreamData().values());
    } catch (error) {
      console.error("[StreamAPI] Error getting all streams:", error);
      return [];
    }
  },

  /**
   * Get streams with event counts for filtering
   * @returns {Array} Array of streams with event counts
   */
  getStreamsWithEventCounts: function () {
    try {
      const dataManager = getDataManager();
      const streams = Array.from(dataManager.getStreamData().values());
      const events = dataManager.getAllEvents();

      // Calculate event counts for each stream
      const streamEventCounts = {};
      events.forEach((event) => {
        if (event.stream) {
          const streamId = event.stream.id;
          streamEventCounts[streamId] = (streamEventCounts[streamId] || 0) + 1;
        }
      });

      // Add event counts to streams
      return streams.map((stream) => ({
        ...stream,
        eventCount: streamEventCounts[stream.id] || 0,
      }));
    } catch (error) {
      console.error(
        "[StreamAPI] Error getting streams with event counts:",
        error,
      );
      return [];
    }
  },

  /**
   * Get events associated with a specific stream
   * @param {number} streamId - Stream ID
   * @returns {Array} Array of events for the stream
   */
  getEventsByStream: function (streamId) {
    try {
      if (!streamId) {
        console.warn("[StreamAPI] Invalid streamId provided");
        return [];
      }

      const dataManager = getDataManager();
      const allEvents = dataManager.getAllEvents();

      return allEvents.filter(
        (event) => event.stream && event.stream.id === streamId,
      );
    } catch (error) {
      console.error(
        `[StreamAPI] Error getting events by stream ${streamId}:`,
        error,
      );
      return [];
    }
  },
};

if (typeof window !== "undefined") {
  window.StreamAPI = StreamAPI;
}
