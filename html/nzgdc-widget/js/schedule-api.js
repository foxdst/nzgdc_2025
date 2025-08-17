// NZGDC Schedule Widget - Schedule API
// Centralized Schedule Data Access API

// Note: DataManager is expected to be loaded before this script

/**
 * Get the singleton DataManager instance
 * @returns {DataManager} DataManager instance
 */
function getDataManager() {
  if (!window.dataManagerInstance) {
    throw new Error(
      "[ScheduleAPI] Global dataManagerInstance not available. Ensure DataManager is initialized before using ScheduleAPI.",
    );
  }
  return window.dataManagerInstance;
}

/**
 * Centralized Schedule Data Access API
 * Replaces direct access to SCHEDULE_DATA, MORNING_SCHEDULE_DATA, AFTERNOON_SCHEDULE_DATA
 */
const ScheduleAPI = {
  /**
   * Get a single schedule by ID
   * @param {number} scheduleId - Unique schedule identifier
   * @returns {Object|null} Standardized schedule object or null if not found
   */
  getSchedule: function (scheduleId) {
    try {
      const dataManager = getDataManager();
      return dataManager.getSchedule(scheduleId);
    } catch (error) {
      console.error(
        `[ScheduleAPI] Error getting schedule ${scheduleId}:`,
        error,
      );
      return null;
    }
  },

  /**
   * Get schedule with full event data populated
   * @param {number} scheduleId - Schedule ID
   * @returns {Object|null} Schedule object with full event data or null if not found
   */
  getScheduleWithFullEvents: function (scheduleId) {
    try {
      const dataManager = getDataManager();
      const schedule = dataManager.getSchedule(scheduleId);

      if (!schedule) {
        return null;
      }

      // Return the schedule with its events (already populated by DataManager)
      return schedule;
    } catch (error) {
      console.error(
        `[ScheduleAPI] Error getting schedule with full events ${scheduleId}:`,
        error,
      );
      return null;
    }
  },

  /**
   * Get all schedules
   * @returns {Array} Array of all schedule objects
   */
  getAllSchedules: function () {
    try {
      const dataManager = getDataManager();
      return Array.from(dataManager.getScheduleData().values());
    } catch (error) {
      console.error("[ScheduleAPI] Error getting all schedules:", error);
      return [];
    }
  },

  /**
   * Get time slots for a specific schedule
   * @param {number} scheduleId - Schedule ID
   * @returns {Array} Array of time slots for the schedule
   */
  getTimeSlots: function (scheduleId) {
    try {
      const dataManager = getDataManager();
      const schedule = dataManager.getSchedule(scheduleId);

      if (!schedule) {
        console.warn(`[ScheduleAPI] Schedule ${scheduleId} not found`);
        return [];
      }

      // Return time slots if they exist
      return schedule.timeSlots || [];
    } catch (error) {
      console.error(
        `[ScheduleAPI] Error getting time slots for schedule ${scheduleId}:`,
        error,
      );
      return [];
    }
  },

  /**
   * Get events for a specific time slot in a schedule
   * @param {number} scheduleId - Schedule ID
   * @param {string} timeSlotId - Time slot ID
   * @returns {Array} Array of events for the time slot
   */
  getEventsForTimeSlot: function (scheduleId, timeSlotId) {
    try {
      if (!scheduleId || !timeSlotId) {
        console.warn("[ScheduleAPI] Invalid scheduleId or timeSlotId provided");
        return [];
      }

      const dataManager = getDataManager();
      const schedule = dataManager.getSchedule(scheduleId);

      if (!schedule) {
        console.warn(`[ScheduleAPI] Schedule ${scheduleId} not found`);
        return [];
      }

      // Find the time slot
      if (schedule.timeSlots && Array.isArray(schedule.timeSlots)) {
        const timeSlot = schedule.timeSlots.find(
          (slot) => slot.id === timeSlotId,
        );
        if (timeSlot && timeSlot.events) {
          return timeSlot.events;
        }
      }

      return [];
    } catch (error) {
      console.error(
        `[ScheduleAPI] Error getting events for time slot ${timeSlotId} in schedule ${scheduleId}:`,
        error,
      );
      return [];
    }
  },
};

if (typeof window !== "undefined") {
  window.ScheduleAPI = ScheduleAPI;
}
