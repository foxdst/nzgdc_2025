// NZGDC Schedule Widget - Data Manager
// Centralized data loading, validation, and transformation coordinator

// Note: DataTransformer is expected to be loaded before this script

var DataManager = (function() {
  // Constructor function
  function DataManager(options = {}) {
    // Internal data stores for all entities
    this.rawData = {
      events: new Map(),
      schedules: new Map(),
      speakers: new Map(),
      categories: new Map(),
      rooms: new Map(),
      streams: new Map(),
      sessionTypes: new Map(),
    };
    
    // Configuration options
    this.config = {
      dataSource: options.dataSource || 'webhook', // 'webhook' or 'local'
      localDataPath: options.localDataPath || './n8n-entegyapi.json',
      webhookUrl: options.webhookUrl || "https://n8n.rascality.nz/webhook/9a4c6003-0874-45ba-9d06-a49375fb632b"
    };
    
    this.isInitialized = false;
    this.isLoading = false;
  }

  /**
   * Initialize the DataManager by loading and processing data from the API
   * @returns {Promise<boolean>} True if initialization was successful
   */
  DataManager.prototype.initialize = async function() {
    if (this.isInitialized || this.isLoading) {
      return this.isInitialized;
    }

    this.isLoading = true;
    
    try {
      // Load data from API endpoint
      const apiData = await this.loadApiData();
      
      // Transform API data to standardized formats
      const transformedData = this.transformApiData(apiData);
      
      // Populate internal data stores
      this.populateDataStores(transformedData);
      
      // Validate data integrity
      this.validateDataIntegrity();
      
      this.isInitialized = true;
      this.isLoading = false;
      
      console.log("[NZGDC DataManager] Data manager initialized successfully");
      return true;
    } catch (error) {
      this.isLoading = false;
      console.error("[NZGDC DataManager] Failed to initialize data manager:", error);
      throw error;
    }
  };

  /**
   * Load data from the API endpoint or local JSON file
   * @returns {Promise<Object>} Raw API data
   */
  DataManager.prototype.loadApiData = async function() {
    try {
      let data;
      
      if (this.config.dataSource === 'local') {
        // Load data from local JSON file
        data = await this.loadLocalData();
      } else {
        // Load data from webhook
        const response = await fetch(this.config.webhookUrl);
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        data = await response.json();
      }
      
      console.log(`[NZGDC DataManager] ${this.config.dataSource === 'local' ? 'Local' : 'API'} data loaded successfully`);
      return data;
    } catch (error) {
      console.error(`[NZGDC DataManager] Failed to load ${this.config.dataSource === 'local' ? 'local' : 'API'} data:`, error);
      throw error;
    }
  };
  
  /**
   * Load data from local JSON file
   * @returns {Promise<Object>} Raw data from local JSON file
   */
  DataManager.prototype.loadLocalData = async function() {
    try {
      // For browser environments, we need to fetch the local file
      // In Node.js environment, we could use fs.readFile
      const response = await fetch(this.config.localDataPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load local data file with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log("[NZGDC DataManager] Local data loaded successfully");
      return data;
    } catch (error) {
      console.error("[NZGDC DataManager] Failed to load local data:", error);
      throw error;
    }
  };

  /**
   * Transform raw API data to standardized formats
   * @param {Object} apiData - Raw API data
   * @returns {Object} Transformed data in standardized formats
   */
  DataManager.prototype.transformApiData = function(apiData) {
    console.log("[NZGDC DataManager] Transforming API data...");
    
    // Use DataTransformer to handle all transformations
    // DataTransformer should be available in the global scope
    const transformer = new DataTransformer();
    
    // Transform all entity types
    const speakerMap = transformer.transformSpeakers(apiData);
    const categoryMap = transformer.transformCategories(apiData);
    const roomMap = transformer.transformRooms(apiData);
    const streamMap = transformer.transformStreams(apiData);
    const sessionTypeMap = transformer.transformSessionTypes(apiData);
    const schedules = transformer.transformSchedules(apiData);
    const events = transformer.transformEvents(apiData, speakerMap);
    
    console.log(`[NZGDC DataManager] Transformation complete - ${events.length} events, ${schedules.length} schedules`);
    
    return {
      events,
      schedules,
      speakers: Array.from(speakerMap.values()),
      categories: Array.from(categoryMap.values()),
      rooms: Array.from(roomMap.values()),
      streams: Array.from(streamMap.values()),
      sessionTypes: Array.from(sessionTypeMap.values())
    };
  };

  /**
   * Populate internal data stores with transformed data
   * @param {Object} transformedData - Transformed data in standardized formats
   */
  DataManager.prototype.populateDataStores = function(transformedData) {
    console.log("[NZGDC DataManager] Populating data stores...");
    
    // Populate events
    this.rawData.events.clear();
    transformedData.events.forEach(event => {
      this.rawData.events.set(event.id, event);
    });
    
    // Populate schedules
    this.rawData.schedules.clear();
    transformedData.schedules.forEach(schedule => {
      this.rawData.schedules.set(schedule.id, schedule);
    });
    
    // Populate speakers
    this.rawData.speakers.clear();
    transformedData.speakers.forEach(speaker => {
      this.rawData.speakers.set(speaker.id, speaker);
    });
    
    // Populate categories
    this.rawData.categories.clear();
    transformedData.categories.forEach(category => {
      this.rawData.categories.set(category.id, category);
    });
    
    // Populate rooms
    this.rawData.rooms.clear();
    transformedData.rooms.forEach(room => {
      this.rawData.rooms.set(room.id, room);
    });
    
    // Populate streams
    this.rawData.streams.clear();
    transformedData.streams.forEach(stream => {
      this.rawData.streams.set(stream.id, stream);
    });
    
    // Populate session types
    this.rawData.sessionTypes.clear();
    transformedData.sessionTypes.forEach(sessionType => {
      this.rawData.sessionTypes.set(sessionType.id, sessionType);
    });
    
    console.log(`[NZGDC DataManager] Data stores populated - ${this.rawData.events.size} events, ${this.rawData.schedules.size} schedules`);
  };

  /**
   * Validate data integrity
   */
  DataManager.prototype.validateDataIntegrity = function() {
    console.log("[NZGDC DataManager] Validating data integrity...");
    
    // Basic validation - check that we have data in our stores
    if (this.rawData.events.size === 0) {
      console.warn("[NZGDC DataManager] Warning: No events found in data store");
    }
    
    if (this.rawData.schedules.size === 0) {
      console.warn("[NZGDC DataManager] Warning: No schedules found in data store");
    }
    
    if (this.rawData.speakers.size === 0) {
      console.warn("[NZGDC DataManager] Warning: No speakers found in data store");
    }
    
    // TODO: Add more comprehensive validation as needed
    
    console.log("[NZGDC DataManager] Data integrity validation completed");
  };

  // Getter methods for each data type
  
  /**
   * Get all events
   * @returns {Object} Plain object of all events keyed by ID
   */
  DataManager.prototype.getEventData = function() {
    return Object.fromEntries(this.rawData.events);
  };
  
  /**
   * Get event by ID
   * @param {number} eventId - Event ID
   * @returns {Object|null} Event object or null if not found
   */
  DataManager.prototype.getEvent = function(eventId) {
    return this.rawData.events.get(eventId) || null;
  };
  
  /**
   * Get all events as an array
   * @returns {Array} Array of all events
   */
  DataManager.prototype.getAllEvents = function() {
    return Array.from(this.rawData.events.values());
  };
  
  /**
   * Get events filtered by category
   * @param {string} categoryKey - Category key to filter by
   * @returns {Array} Array of events matching the category
   */
  DataManager.prototype.getEventsByCategory = function(categoryKey) {
    return Array.from(this.rawData.events.values()).filter(event => {
      if (!event.categories || !Array.isArray(event.categories)) return false;
      return event.categories.some(category =>
        category.id === categoryKey || category.name === categoryKey
      );
    });
  };

  /**
   * Get all schedules
   * @returns {Array} Array of all schedules
   */
  DataManager.prototype.getScheduleData = function() {
    return Array.from(this.rawData.schedules.values());
  };
  
  /**
   * Get schedule by ID
   * @param {number} scheduleId - Schedule ID
   * @returns {Object|null} Schedule object or null if not found
   */
  DataManager.prototype.getSchedule = function(scheduleId) {
    return this.rawData.schedules.get(scheduleId) || null;
  };

  /**
   * Get all speakers
   * @returns {Map} Map of all speakers
   */
  DataManager.prototype.getSpeakerData = function() {
    return this.rawData.speakers;
  };
  
  /**
   * Get speaker by ID
   * @param {number} speakerId - Speaker ID
   * @returns {Object|null} Speaker object or null if not found
   */
  DataManager.prototype.getSpeaker = function(speakerId) {
    return this.rawData.speakers.get(speakerId) || null;
  };
  
  /**
   * Get speakers by event ID
   * @param {number} eventId - Event ID
   * @returns {Array} Array of speakers for the event
   */
  DataManager.prototype.getSpeakersByEvent = function(eventId) {
    const event = this.getEvent(eventId);
    return event && event.speakers ? event.speakers : [];
  };

  /**
   * Get all categories
   * @returns {Map} Map of all categories
   */
  DataManager.prototype.getCategoryData = function() {
    return this.rawData.categories;
  };
  
  /**
   * Get category by ID
   * @param {number} categoryId - Category ID
   * @returns {Object|null} Category object or null if not found
   */
  DataManager.prototype.getCategory = function(categoryId) {
    return this.rawData.categories.get(categoryId) || null;
  };

  /**
   * Get all rooms
   * @returns {Map} Map of all rooms
   */
  DataManager.prototype.getRoomData = function() {
    return this.rawData.rooms;
  };
  
  /**
   * Get room by ID
   * @param {number} roomId - Room ID
   * @returns {Object|null} Room object or null if not found
   */
  DataManager.prototype.getRoom = function(roomId) {
    return this.rawData.rooms.get(roomId) || null;
  };

  /**
   * Get all streams
   * @returns {Map} Map of all streams
   */
  DataManager.prototype.getStreamData = function() {
    return this.rawData.streams;
  };
  
  /**
   * Get stream by ID
   * @param {number} streamId - Stream ID
   * @returns {Object|null} Stream object or null if not found
   */
  DataManager.prototype.getStream = function(streamId) {
    return this.rawData.streams.get(streamId) || null;
  };

  /**
   * Get all session types
   * @returns {Map} Map of all session types
   */
  DataManager.prototype.getSessionTypeData = function() {
    return this.rawData.sessionTypes;
  };
  
  /**
   * Get session type by ID
   * @param {number} sessionTypeId - Session type ID
   * @returns {Object|null} Session type object or null if not found
   */
  DataManager.prototype.getSessionType = function(sessionTypeId) {
    return this.rawData.sessionTypes.get(sessionTypeId) || null;
  };

  /**
   * Check if the DataManager is initialized
   * @returns {boolean} True if initialized, false otherwise
   */
  DataManager.prototype.isDataManagerInitialized = function() {
    return this.isInitialized;
  };
  
  /**
   * Ensure the DataManager is initialized
   * @returns {Promise<boolean>} True if initialization was successful
   */
  DataManager.prototype.ensureInitialized = async function() {
    if (!this.isInitialized) {
      return await this.initialize();
    }
    return true;
  };

  /**
   * Refresh data from the API endpoint
   * @returns {Promise<boolean>} True if refresh was successful
   */
  DataManager.prototype.refreshData = async function() {
    if (this.isLoading) {
      console.warn("[NZGDC DataManager] Data refresh already in progress");
      return false;
    }

    this.isLoading = true;
    
    try {
      console.log("[NZGDC DataManager] Refreshing data from API...");
      
      // Load data from API endpoint
      const apiData = await this.loadApiData();
      
      // Transform API data to standardized formats
      const transformedData = this.transformApiData(apiData);
      
      // Populate internal data stores
      this.populateDataStores(transformedData);
      
      // Validate data integrity
      this.validateDataIntegrity();
      
      this.isLoading = false;
      
      console.log("[NZGDC DataManager] Data refreshed successfully");
      return true;
    } catch (error) {
      this.isLoading = false;
      console.error("[NZGDC DataManager] Failed to refresh data:", error);
      throw error;
    }
  };

  return DataManager;
})();

// Make DataManager available globally
if (typeof window !== "undefined") {
  window.DataManager = DataManager;
}