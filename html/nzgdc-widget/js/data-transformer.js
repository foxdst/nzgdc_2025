// NZGDC Schedule Widget - Data Transformer
// Handles conversion from actual API structure to standardized formats

var DataTransformer = (function () {
  // Constructor function
  function DataTransformer() {
    // No initialization needed
  }

  /**
   * Transform speakers from API data, handling duplication resolution
   * @param {Object} apiData - Raw API data
   * @returns {Map} Map of standardized speakers
   */
  DataTransformer.prototype.transformSpeakers = function (apiData) {
    try {
      const speakerMap = new Map();

      // Process top-level speakers first as primary source
      if (
        apiData.data &&
        apiData.data.speakers &&
        Array.isArray(apiData.data.speakers)
      ) {
        apiData.data.speakers.forEach((speaker) => {
          speakerMap.set(speaker.id, this._standardizeSpeaker(speaker));
        });
      }

      // Process embedded speakers in sessions to ensure all are captured
      if (
        apiData.data &&
        apiData.data.schedule &&
        Array.isArray(apiData.data.schedule)
      ) {
        apiData.data.schedule.forEach((scheduleDay) => {
          if (scheduleDay.sessions && Array.isArray(scheduleDay.sessions)) {
            scheduleDay.sessions.forEach((session) => {
              if (session.speakers && Array.isArray(session.speakers)) {
                session.speakers.forEach((embeddedSpeaker) => {
                  // Only add if not already in map (top-level takes precedence)
                  if (!speakerMap.has(embeddedSpeaker.id)) {
                    speakerMap.set(
                      embeddedSpeaker.id,
                      this._standardizeSpeaker(embeddedSpeaker),
                    );
                  }
                });
              }
            });
          }
        });
      }

      return speakerMap;
    } catch (error) {
      console.error("[DataTransformer] Error transforming speakers:", error);
      throw new Error(`Failed to transform speakers: ${error.message}`);
    }
  };

  /**
   * Transform categories from API data, standardizing them
   * @param {Object} apiData - Raw API data
   * @returns {Map} Map of standardized categories
   */
  DataTransformer.prototype.transformCategories = function (apiData) {
    try {
      const categoryMap = new Map();

      // Process top-level categories first as primary source
      if (
        apiData.data &&
        apiData.data.categories &&
        Array.isArray(apiData.data.categories)
      ) {
        apiData.data.categories.forEach((category) => {
          categoryMap.set(category.id, this._standardizeCategory(category));
        });
      }

      return categoryMap;
    } catch (error) {
      console.error("[DataTransformer] Error transforming categories:", error);
      throw new Error(`Failed to transform categories: ${error.message}`);
    }
  };

  /**
   * Transform rooms from API data, standardizing them
   * @param {Object} apiData - Raw API data
   * @returns {Map} Map of standardized rooms
   */
  DataTransformer.prototype.transformRooms = function (apiData) {
    try {
      const roomMap = new Map();

      // Process top-level rooms first as primary source
      if (
        apiData.data &&
        apiData.data.rooms &&
        Array.isArray(apiData.data.rooms)
      ) {
        apiData.data.rooms.forEach((room) => {
          roomMap.set(room.id, this._standardizeRoom(room));
        });
      }

      // Process embedded rooms in sessions for any not found at top-level
      if (
        apiData.data &&
        apiData.data.schedule &&
        Array.isArray(apiData.data.schedule)
      ) {
        apiData.data.schedule.forEach((scheduleDay) => {
          if (scheduleDay.sessions && Array.isArray(scheduleDay.sessions)) {
            scheduleDay.sessions.forEach((session) => {
              if (session.room) {
                if (!roomMap.has(session.room.id)) {
                  roomMap.set(
                    session.room.id,
                    this._standardizeRoom(session.room),
                  );
                }
              }
            });
          }
        });
      }

      return roomMap;
    } catch (error) {
      console.error("[DataTransformer] Error transforming rooms:", error);
      throw new Error(`Failed to transform rooms: ${error.message}`);
    }
  };

  /**
   * Transform streams from API data, standardizing them
   * @param {Object} apiData - Raw API data
   * @returns {Map} Map of standardized streams
   */
  DataTransformer.prototype.transformStreams = function (apiData) {
    try {
      const streamMap = new Map();

      // Process top-level streams first as primary source
      if (
        apiData.data &&
        apiData.data.streams &&
        Array.isArray(apiData.data.streams)
      ) {
        apiData.data.streams.forEach((stream) => {
          streamMap.set(stream.id, this._standardizeStream(stream));
        });
      }

      // Process embedded streams in sessions for any not found at top-level
      if (
        apiData.data &&
        apiData.data.schedule &&
        Array.isArray(apiData.data.schedule)
      ) {
        apiData.data.schedule.forEach((scheduleDay) => {
          if (scheduleDay.sessions && Array.isArray(scheduleDay.sessions)) {
            scheduleDay.sessions.forEach((session) => {
              if (session.stream) {
                if (!streamMap.has(session.stream.id)) {
                  streamMap.set(
                    session.stream.id,
                    this._standardizeStream(session.stream),
                  );
                }
              }
            });
          }
        });
      }

      return streamMap;
    } catch (error) {
      console.error("[DataTransformer] Error transforming streams:", error);
      throw new Error(`Failed to transform streams: ${error.message}`);
    }
  };

  /**
   * Transform session types from API data, standardizing them
   * @param {Object} apiData - Raw API data
   * @returns {Map} Map of standardized session types
   */
  DataTransformer.prototype.transformSessionTypes = function (apiData) {
    try {
      const sessionTypeMap = new Map();

      // Process top-level session types first as primary source
      if (
        apiData.data &&
        apiData.data.sessionTypes &&
        Array.isArray(apiData.data.sessionTypes)
      ) {
        apiData.data.sessionTypes.forEach((sessionType) => {
          sessionTypeMap.set(
            sessionType.id,
            this._standardizeSessionType(sessionType),
          );
        });
      }

      // Process embedded session types in sessions for any not found at top-level
      if (
        apiData.data &&
        apiData.data.schedule &&
        Array.isArray(apiData.data.schedule)
      ) {
        apiData.data.schedule.forEach((scheduleDay) => {
          if (scheduleDay.sessions && Array.isArray(scheduleDay.sessions)) {
            scheduleDay.sessions.forEach((session) => {
              if (session.type) {
                if (!sessionTypeMap.has(session.type.id)) {
                  sessionTypeMap.set(
                    session.type.id,
                    this._standardizeSessionType(session.type),
                  );
                }
              }
            });
          }
        });
      }

      return sessionTypeMap;
    } catch (error) {
      console.error(
        "[DataTransformer] Error transforming session types:",
        error,
      );
      throw new Error(`Failed to transform session types: ${error.message}`);
    }
  };

  /**
   * Transform sessions to standardized Event objects
   * @param {Object} apiData - Raw API data
   * @param {Map} speakerMap - Map of standardized speakers
   * @returns {Array} Array of standardized events
   */
  DataTransformer.prototype.transformEvents = function (apiData, speakerMap) {
    try {
      const events = [];

      // Process schedule days and sessions
      if (
        apiData.data &&
        apiData.data.schedule &&
        Array.isArray(apiData.data.schedule)
      ) {
        apiData.data.schedule.forEach((scheduleDay) => {
          if (scheduleDay.sessions && Array.isArray(scheduleDay.sessions)) {
            scheduleDay.sessions.forEach((session) => {
              const standardizedEvent = this._standardizeEvent(
                session,
                speakerMap,
                scheduleDay.date,
                scheduleDay.title,
              );
              events.push(standardizedEvent);
            });
          }
        });
      }

      return events;
    } catch (error) {
      console.error("[DataTransformer] Error transforming events:", error);
      throw new Error(`Failed to transform events: ${error.message}`);
    }
  };

  /**
   * Transform schedule days to standardized Schedule objects
   * @param {Object} apiData - Raw API data
   * @returns {Array} Array of standardized schedules
   */
  DataTransformer.prototype.transformSchedules = function (apiData) {
    try {
      const schedules = [];

      // Process schedule days
      if (
        apiData.data &&
        apiData.data.schedule &&
        Array.isArray(apiData.data.schedule)
      ) {
        apiData.data.schedule.forEach((scheduleDay) => {
          const standardizedSchedule = this._standardizeSchedule(scheduleDay);
          schedules.push(standardizedSchedule);
        });
      }

      return schedules;
    } catch (error) {
      console.error("[DataTransformer] Error transforming schedules:", error);
      throw new Error(`Failed to transform schedules: ${error.message}`);
    }
  };

  /**
   * Standardize speaker data
   * @param {Object} speaker - Raw speaker data
   * @returns {Object} Standardized speaker object
   */
  DataTransformer.prototype._standardizeSpeaker = function (speaker) {
    // Create combined position + company field for display
    let combinedPosition = speaker.position || "";
    if (speaker.company && speaker.position) {
      combinedPosition = `${speaker.position} at ${speaker.company}`;
    } else if (speaker.company && !speaker.position) {
      combinedPosition = speaker.company;
    }

    return {
      id: speaker.id,
      name: speaker.displayName, // Add name field for widget compatibility
      displayName: speaker.displayName,
      sortName: speaker.sortName,
      position: combinedPosition, // Combined position + company for display
      originalPosition: speaker.position, // Preserve original position
      company: speaker.company,
      bio: this._stripHtmlTags(speaker.copy) || "",
      headshot: speaker.speakerImage || "",
      email: speaker.email || "",
      website: speaker.web || "",
      phoneNumber: speaker.phoneNumber || "",
      facebook: speaker.facebook || "",
      twitterHandle: speaker.twitterHandle || "",
      linkedIn: speaker.linkedIn || "",
      parentModuleType: speaker.parentModuleType,
      parentModuleId: speaker.parentModuleId,
      externalReference: speaker.externalReference,
      unmappedStrings: speaker.unmappedStrings,
      moduleType: speaker.moduleType,
      templateName: speaker.templateName,
      isStatic: speaker.isStatic,
      isSingleton: speaker.isSingleton,
      pageSettings: speaker.pageSettings,
      speakerType: speaker.speakerType,
      speakerSponsor: speaker.speakerSponsor,
      tags: speaker.tags,
      documents: speaker.documents,
      associatedSessions: speaker.associatedSessions,
      associatedAbstracts: speaker.associatedAbstracts,
      // Extended fields for standardization
      socialMedia: {
        twitter: speaker.twitterHandle || "",
        linkedin: speaker.linkedIn || "",
        facebook: speaker.facebook || "",
      },
      expertise: [], // To be populated if needed
      events: [], // To be populated by API
      featured: false, // To be populated if needed
      tags: [], // To be populated if needed
    };
  };

  /**
   * Standardize schedule data
   * @param {Object} scheduleDay - Raw schedule day data
   * @returns {Object} Standardized schedule object
   */
  DataTransformer.prototype._standardizeSchedule = function (scheduleDay) {
    return {
      id: scheduleDay.id,
      title: scheduleDay.title,
      date: scheduleDay.date,
      sessions: scheduleDay.sessions || [],
      sessionGroups: scheduleDay.sessionGroups || [],
      meetingBlocks: scheduleDay.meetingBlocks || [],
      parentModuleType: scheduleDay.parentModuleType,
      parentModuleId: scheduleDay.parentModuleId,
      externalReference: scheduleDay.externalReference,
      unmappedStrings: scheduleDay.unmappedStrings,
      moduleType: scheduleDay.moduleType,
      templateName: scheduleDay.templateName,
      isStatic: scheduleDay.isStatic,
      isSingleton: scheduleDay.isSingleton,
      pageSettings: scheduleDay.pageSettings,
      // Extended fields for standardization
      timeSlots: [], // To be derived from sessions
      venue: null,
      timezone: null,
      notes: [],
    };
  };

  /**
   * Standardize event/session data
   * @param {Object} session - Raw session data
   * @param {Map} speakerMap - Map of speakers by ID
   * @param {string} scheduleDate - Date of the schedule day
   * @param {string} scheduleTitle - Title of the schedule day (e.g., "Thursday", "Friday", "Saturday")
   * @returns {Object} Standardized event object
   */
  DataTransformer.prototype._standardizeEvent = function (
    session,
    speakerMap,
    scheduleDate,
    scheduleTitle,
  ) {
    // Process speakers - resolve duplication between top-level and embedded
    const processedSpeakers = [];
    if (session.speakers && Array.isArray(session.speakers)) {
      session.speakers.forEach((embeddedSpeaker) => {
        // Try to find matching speaker in top-level speakers
        const primarySpeaker = speakerMap.get(embeddedSpeaker.id);
        if (primarySpeaker) {
          // Use primary speaker data
          processedSpeakers.push(primarySpeaker);
        } else {
          // Add embedded speaker to map if not found
          const standardizedSpeaker = this._standardizeSpeaker(embeddedSpeaker);
          speakerMap.set(embeddedSpeaker.id, standardizedSpeaker);
          processedSpeakers.push(standardizedSpeaker);
        }
      });
    }

    // Create start and end dates by combining schedule date with session times
    let startDate = null;
    let endDate = null;
    if (scheduleDate && session.startTime) {
      startDate = new Date(`${scheduleDate}T${session.startTime}:00`);
    }
    if (scheduleDate && session.endTime) {
      endDate = new Date(`${scheduleDate}T${session.endTime}:00`);
    }

    // Extract primary category for unified event loader compatibility
    // Use stream (subject area) instead of categories (audience level) for visual categorization
    const stream = session.stream || null;
    const categoryKey = stream ? this._mapStreamToKey(stream.title) : null;
    const categoryName = stream ? stream.title : null;

    // Keep original categories for audience targeting (Student, Mid Career, etc.)
    const categories = session.categories || [];

    return {
      id: session.id,
      title: session.title,
      subtitle: session.subtitle,
      description: this._stripHtmlTags(session.copy) || "",
      startTime: session.startTime,
      endTime: session.endTime,
      thumbnail:
        session.sessionThumbnail ||
        session.thumbnail ||
        session.image ||
        session.eventImage ||
        null,
      categories: categories, // Audience level (Student, Mid Career, etc.)
      audienceCategories: categories, // Explicit audience categorization
      category: categoryName, // Subject area for visual categorization
      categoryKey: categoryKey, // Subject area key for CSS/styling
      room: session.room || null,
      stream: session.stream || null,
      type: session.type || null,
      speakers: processedSpeakers,
      speakerRoles: session.speakerRoles
        ? JSON.parse(session.speakerRoles)
        : {},
      featuredSpeaker: session.featuredSpeaker || null,
      capacity: session.capacity || 0,
      // Schedule assignment for proper widget categorization
      scheduleTitle: scheduleTitle || null, // "Thursday", "Friday", "Saturday"
      scheduleDate: scheduleDate || null, // ISO date string
      // Additional fields from actual API
      acceptingQuestions: session.acceptingQuestions || false,
      votingAndDiscussion: session.votingAndDiscussion || false,
      liveStreamingProviderLink: session.liveStreamingProviderLink || null,
      liveStreamProviderType: session.liveStreamProviderType || "",
      // Future extensibility fields
      sessionId: session.id || null,
      location: session.room ? session.room.title : null,
      startDate: startDate,
      endDate: endDate,
      prerequisites: [],
      materials: [],
      registration: null,
    };
  };

  /**
   * Standardize category data
   * @param {Object} category - Raw category data
   * @returns {Object} Standardized category object
   */
  DataTransformer.prototype._standardizeCategory = function (category) {
    return {
      id: category.id,
      name: this._stripHtmlTags(category.name),
      parentModuleType: category.parentModuleType,
      parentModuleId: category.parentModuleId,
      externalReference: category.externalReference,
      unmappedStrings: category.unmappedStrings,
      moduleType: category.moduleType,
      templateName: category.templateName,
      isStatic: category.isStatic,
      isSingleton: category.isSingleton,
      pageSettings: category.pageSettings,
      // Extended fields for standardization
      key: this._generateCategoryKey(category.name),
      description: null, // To be populated if needed
      color: null, // To be populated if needed
      brightness: "light", // Default value, to be determined based on color if available
      icon: null,
      tags: [],
      featured: false,
      sortOrder: null,
    };
  };

  /**
   * Standardize room data
   * @param {Object} room - Raw room data
   * @returns {Object} Standardized room object
   */
  DataTransformer.prototype._standardizeRoom = function (room) {
    return {
      id: room.id,
      title: room.title,
      capacity: room.capacity || 0,
      parentModuleType: room.parentModuleType,
      parentModuleId: room.parentModuleId,
      externalReference: room.externalReference,
      unmappedStrings: room.unmappedStrings,
      moduleType: room.moduleType,
      templateName: room.templateName,
      isStatic: room.isStatic,
      isSingleton: room.isSingleton,
      pageSettings: room.pageSettings,
      // Extended fields for standardization
      description: null,
      location: null,
      floor: null,
      mapCoordinates: null,
    };
  };

  /**
   * Standardize stream data
   * @param {Object} stream - Raw stream data
   * @returns {Object} Standardized stream object
   */
  DataTransformer.prototype._standardizeStream = function (stream) {
    return {
      id: stream.id,
      title: stream.title,
      streamColour: stream.streamColour || "#000000",
      parentModuleType: stream.parentModuleType,
      parentModuleId: stream.parentModuleId,
      externalReference: stream.externalReference,
      unmappedStrings: stream.unmappedStrings,
      moduleType: stream.moduleType,
      templateName: stream.templateName,
      isStatic: stream.isStatic,
      isSingleton: stream.isSingleton,
      pageSettings: stream.pageSettings,
      // Extended fields for standardization
      description: null,
      icon: null,
      sortOrder: null,
      featured: false,
    };
  };

  /**
   * Standardize session type data
   * @param {Object} sessionType - Raw session type data
   * @returns {Object} Standardized session type object
   */
  DataTransformer.prototype._standardizeSessionType = function (sessionType) {
    return {
      id: sessionType.id,
      title: sessionType.title,
      colour: sessionType.colour || "#000000",
      parentModuleType: sessionType.parentModuleType,
      parentModuleId: sessionType.parentModuleId,
      externalReference: sessionType.externalReference,
      unmappedStrings: sessionType.unmappedStrings,
      moduleType: sessionType.moduleType,
      templateName: sessionType.templateName,
      isStatic: sessionType.isStatic,
      isSingleton: sessionType.isSingleton,
      pageSettings: sessionType.pageSettings,
      cellStyle: sessionType.cellStyle,
      icon: sessionType.icon,
      // Extended fields for standardization
      description: null,
      iconIdentifier: null,
      sortOrder: null,
      featured: false,
    };
  };

  /**
   * Map stream title to category key for visual categorization
   * @param {string} streamTitle - Stream title from API
   * @returns {string} Standardized category key
   */
  DataTransformer.prototype._mapStreamToKey = function (streamTitle) {
    if (!streamTitle) return "PROGRAMMING";

    const mapping = {
      "Story and Narrative": "STORY_NARRATIVE",
      "Story & Narrative": "STORY_NARRATIVE",
      "Production & QA": "PRODUCTION_QA",
      Culture: "CULTURE",
      "Business & Marketing": "BUSINESS_MARKETING",
      Business: "BUSINESS_MARKETING",
      Art: "ART",
      Audio: "AUDIO",
      Programming: "PROGRAMMING",
      "Data, Testing or Research": "DATA_TESTING_RESEARCH",
      "Realities (VR, AR, MR)": "REALITIES_VR_AR_MR",
      "Realities (AR, MR, VR)": "REALITIES_VR_AR_MR",
      "Game Design": "GAME_DESIGN",
      "Serious & Educational Games": "SERIOUS_EDUCATIONAL",
    };

    return mapping[streamTitle] || "PROGRAMMING";
  };

  /**
   * Generate a standardized category key from category name
   * @param {string} categoryName - Category name
   * @returns {string} Standardized category key
   */
  DataTransformer.prototype._generateCategoryKey = function (categoryName) {
    if (!categoryName) return "UNKNOWN";

    // Convert to uppercase, replace spaces and special characters with underscores
    return categoryName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "_")
      .replace(/_+/g, "_") // Replace multiple underscores with single underscore
      .replace(/^_|_$/g, ""); // Remove leading/trailing underscores
  };

  /**
   * Validate and clean data to ensure consistency
   * @param {Object} data - Data to validate
   * @param {string} type - Type of data being validated
   * @returns {Object} Cleaned and validated data
   */
  DataTransformer.prototype.validateAndCleanData = function (data, type) {
    try {
      // Basic validation to ensure data has required fields
      if (!data || typeof data !== "object") {
        console.warn(
          `[DataTransformer] Invalid data provided for ${type} validation`,
        );
        return {};
      }

      // Clone the data to avoid modifying the original
      const cleanedData = JSON.parse(JSON.stringify(data));

      // Ensure all data objects have an ID
      if (cleanedData.id === undefined) {
        console.warn(`[DataTransformer] Missing ID in ${type} data`);
      }

      // Ensure all data objects have a title or name
      if (!cleanedData.title && !cleanedData.name && !cleanedData.displayName) {
        console.warn(
          `[DataTransformer] Missing title/name in ${type} data (ID: ${cleanedData.id})`,
        );
      }

      return cleanedData;
    } catch (error) {
      console.error(`[DataTransformer] Error validating ${type} data:`, error);
      return data; // Return original data if validation fails
    }
  };

  /**
   * Helper function to strip HTML tags from a string.
   * @param {string} htmlString - The string possibly containing HTML.
   * @returns {string} The string with HTML tags removed.
   */
  DataTransformer.prototype._stripHtmlTags = function (htmlString) {
    if (
      typeof htmlString !== "string" ||
      htmlString === null ||
      htmlString === undefined
    ) {
      return htmlString;
    }
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  /**
   * Map category name to standardized category key (DEPRECATED - use _mapStreamToKey instead)
   * @deprecated Use _mapStreamToKey for stream-based categorization
   * @param {string} categoryName - Category name from API
   * @returns {string} Standardized category key
   */
  DataTransformer.prototype._mapCategoryNameToKey = function (categoryName) {
    console.warn(
      "[DataTransformer] _mapCategoryNameToKey is deprecated - use _mapStreamToKey instead",
    );
    return this._mapStreamToKey(categoryName);
  };

  return DataTransformer;
})();

// Make DataTransformer available globally
if (typeof window !== "undefined") {
  window.DataTransformer = DataTransformer;
}
