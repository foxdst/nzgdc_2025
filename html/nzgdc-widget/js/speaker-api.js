// NZGDC Schedule Widget - Speaker API
// Centralized Speaker Data Access API

// Note: DataManager is expected to be loaded before this script

/**
 * Get the singleton DataManager instance
 * @returns {DataManager} DataManager instance
 */
function getDataManager() {
  if (!window.dataManagerInstance) {
    throw new Error(
      "[SpeakerAPI] Global dataManagerInstance not available. Ensure DataManager is initialized before using SpeakerAPI.",
    );
  }
  return window.dataManagerInstance;
}

/**
 * Centralized Speaker Data Access API
 * Replaces direct speaker data access in ExpandedEventDetailsManager
 */
const SpeakerAPI = {
  /**
   * Get a single speaker by ID
   * @param {number} speakerId - Unique speaker identifier
   * @returns {Object|null} Standardized speaker object or null if not found
   */
  getSpeaker: function (speakerId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getSpeaker(speakerId);
    } catch (error) {
      console.error(`[SpeakerAPI] Error getting speaker ${speakerId}:`, error);
      return null;
    }
  },

  /**
   * Get speakers associated with a specific event
   * @param {number} eventId - Event ID
   * @returns {Array} Array of speaker objects for the event
   */
  getSpeakersByEvent: function (eventId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getSpeakersByEvent(eventId);
    } catch (error) {
      console.error(
        `[SpeakerAPI] Error getting speakers by event ${eventId}:`,
        error,
      );
      return [];
    }
  },

  /**
   * Get all speakers
   * @returns {Array} Array of all speaker objects
   */
  getAllSpeakers: function () {
    try {
      const dataManager = getDataManager();
      return Array.from(dataManager.getSpeakerData().values());
    } catch (error) {
      console.error("[SpeakerAPI] Error getting all speakers:", error);
      return [];
    }
  },

  /**
   * Get featured speakers
   * @returns {Array} Array of featured speakers
   */
  getFeaturedSpeakers: function () {
    try {
      const dataManager = getDataManager();
      const allSpeakers = Array.from(dataManager.getSpeakerData().values());

      return allSpeakers.filter((speaker) => speaker.featured);
    } catch (error) {
      console.error("[SpeakerAPI] Error getting featured speakers:", error);
      return [];
    }
  },

  /**
   * Get speakers with a specific area of expertise
   * @param {string} expertise - Expertise area to filter by
   * @returns {Array} Array of speakers with the specified expertise
   */
  getSpeakersByExpertise: function (expertise) {
    try {
      if (!expertise || typeof expertise !== "string") {
        console.warn("[SpeakerAPI] Invalid expertise provided");
        return [];
      }

      const dataManager = getDataManager();
      const allSpeakers = Array.from(dataManager.getSpeakerData().values());
      const lowerCaseExpertise = expertise.toLowerCase();

      return allSpeakers.filter((speaker) => {
        // Check in expertise array if it exists
        if (speaker.expertise && Array.isArray(speaker.expertise)) {
          return speaker.expertise.some((exp) =>
            exp.toLowerCase().includes(lowerCaseExpertise),
          );
        }

        // Check in bio as fallback
        if (speaker.bio && typeof speaker.bio === "string") {
          return speaker.bio.toLowerCase().includes(lowerCaseExpertise);
        }

        return false;
      });
    } catch (error) {
      console.error(
        `[SpeakerAPI] Error getting speakers by expertise "${expertise}":`,
        error,
      );
      return [];
    }
  },
};

if (typeof window !== "undefined") {
  window.SpeakerAPI = SpeakerAPI;
}
