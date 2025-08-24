# EVENTS SCHEDULE API ARCHITECTURE PLAN

## Centralized Data Management System for NZGDC Widget

---

## 🎯 EXECUTIVE SUMMARY

This comprehensive architecture plan details the integration of a centralized Events Schedule API system into the existing NZGDC widget codebase. The plan transforms the current dispersed data architecture into a unified, scalable API-driven system while maintaining backward compatibility and minimizing disruption to existing functionality.

The integration will create dedicated API layers for different data domains (Events, Schedules, Speakers, Categories, Rooms, Streams, Session Types) that will abstract and centralize all event and schedule information from the actual API structure, providing consistent data access patterns and reducing redundancy in data handling.

---

## 1. CURRENT ARCHITECTURE ANALYSIS

### 1.1 Actual API Structure

**Current State Based on Actual API:**

- **Hierarchical Data Structure**: Data organized in a hierarchical structure with Schedule Days containing Sessions, which in turn contain Speakers, Categories, Rooms, Streams, and Session Types
- **Speaker Duplication**: Speakers exist both as a top-level array and as embedded objects within sessions, creating potential for data inconsistency
- **Embedded Entities**: Categories, Rooms, Streams, and Session Types are embedded within Session objects rather than being separate top-level entities
- **Numeric IDs**: All entities use numeric IDs rather than the planned standardized string IDs
- **Rich Content**: Sessions contain rich HTML content in the "copy" field for detailed descriptions
- **Multiple Categorization**: Sessions are categorized through multiple dimensions (Categories, Streams, Session Types, Rooms)

### 1.2 Key Integration Points Identified

1. **UnifiedEventLoader**: Central panel creation with category validation
2. **Schedule Generators**: `ScheduleGenerator`, `MorningScheduleGenerator`, `AfternoonScheduleGenerator`
3. **ExpandedEventDetailsManager**: Event data adaptation and display
4. **Category System**: Existing category definitions in `UnifiedEventLoader`
5. **Filtering Logic**: Event filtering in all generators
6. **Data Transformation Layer**: Required to normalize speaker data and extract/standardize category information
7. **Extended Entity Support**: Need to handle Room, Stream, and Session Type entities that weren't explicitly mentioned in the original plan
8. **Enhanced Filtering**: Support for filtering by multiple dimensions (Rooms, Streams, Session Types) in addition to Categories
9. **Extended Entity Integration**: Integration of RoomAPI, StreamAPI, and SessionTypeAPI into Schedule Generators and ExpandedEventDetailsManager

---

## 2. API MODULE STRUCTURE AND DATA FLOW DESIGN

### 2.1 Core API Architecture

```mermaid
graph TB
    subgraph "Data Sources Layer"
        API[n8n-entegyapi.json]
    end

    subgraph "Data Transformation Layer"
        DT[DataTransformer]
    end

    subgraph "API Layer"
        EA[EventAPI]
        SA[ScheduleAPI]
        SpA[SpeakerAPI]
        CA[CategoryAPI]
        RA[RoomAPI]
        StA[StreamAPI]
        SeTA[SessionTypeAPI]
        DM[DataManager]
    end

    subgraph "Component Layer"
        UEL[UnifiedEventLoader]
        SG[ScheduleGenerator]
        MSG[MorningScheduleGenerator]
        ASG[AfternoonScheduleGenerator]
        EEDM[ExpandedEventDetailsManager]
    end

    subgraph "Widget Layer"
        TW[Thursday Widget]
        FSW[Friday/Saturday Widget]
    end

    API --> DT
    DT --> DM

    DM --> EA
    DM --> SA
    DM --> SpA
    DM --> CA
    DM --> RA
    DM --> StA
    DM --> SeTA

    EA --> UEL
    SA --> SG
    SA --> MSG
    SA --> ASG
    SpA --> EEDM
    CA --> UEL
    RA --> SG
    StA --> SG
    SeTA --> SG

    UEL --> TW
    SG --> TW
    MSG --> FSW
    ASG --> FSW
    EEDM --> TW
    EEDM --> FSW
```

### 2.2 API Module Specifications

#### 2.2.1 DataManager (Core Orchestrator)

**File**: `js/data-manager.js`
**Purpose**: Central data loading, validation, and transformation coordinator

```javascript
class DataManager {
  constructor() {
    this.rawData = {
      events: new Map(),
      schedules: new Map(),
      speakers: new Map(),
      categories: new Map(),
      rooms: new Map(),
      streams: new Map(),
      sessionTypes: new Map(),
    };
    this.isInitialized = false;
  }

  async initialize() {
    // Load and consolidate all raw data sources
    // Transform into standardized formats
    // Populate internal data stores
    // Validate data integrity
  }

  getEventData() {
    return this.rawData.events;
  }
  getScheduleData() {
    return this.rawData.schedules;
  }
  getSpeakerData() {
    return this.rawData.speakers;
  }
  getCategoryData() {
    return this.rawData.categories;
  }
  getRoomData() {
    return this.rawData.rooms;
  }
  getStreamData() {
    return this.rawData.streams;
  }
  getSessionTypeData() {
    return this.rawData.sessionTypes;
  }
}
```

#### 2.2.2 EventAPI

**File**: `js/event-api.js`
**Integration Points**:

- `ScheduleGenerator.loadSingleWorkshop()`
- `MorningScheduleGenerator.loadSingleEvent()`
- `AfternoonScheduleGenerator.loadSingleEvent()`

```javascript
class EventAPI {
  static getEvent(eventId) {
    // Replace: window.WORKSHOP_EVENTS[eventId]
    // Replace: window.MORNING_EVENTS[eventId]
    // Replace: window.AFTERNOON_EVENTS[eventId]
  }

  static getAllEvents() {
    // Consolidate all event sources
  }

  static getEventsByCategory(categoryKey) {
    // Replace filtering logic in generators
  }

  static searchEvents(query) {
    // Search events by title or description
  }

  static getFeaturedEvents() {
    // Get featured events for special highlighting
  }

  static getEventsBySpeaker(speakerId) {
    // Get events associated with a specific speaker ID
  }
}
```

#### 2.2.3 ScheduleAPI

**File**: `js/schedule-api.js`
**Integration Points**:

- `ScheduleGenerator.renderSchedule()`
- `MorningScheduleGenerator.renderSchedule()`
- `AfternoonScheduleGenerator.renderSchedule()`

```javascript
class ScheduleAPI {
  static getSchedule(scheduleId) {
    // Replace: window.SCHEDULE_DATA
    // Replace: window.MORNING_SCHEDULE_DATA
    // Replace: window.AFTERNOON_SCHEDULE_DATA
  }

  static getScheduleWithFullEvents(scheduleId) {
    // Populate EventReference objects with full Event data
  }

  static getAllSchedules() {
    // Get all schedules
  }

  static getTimeSlots(scheduleId) {
    // Get time slots for a specific schedule
  }

  static getEventsForTimeSlot(scheduleId, timeSlotId) {
    // Get event references for a specific time slot
  }
}
```

#### 2.2.4 SpeakerAPI

**File**: `js/speaker-api.js`
**Integration Points**:

- `ExpandedEventDetailsManager.adaptSpeakerData()`

```javascript
class SpeakerAPI {
  static getSpeaker(speakerId) {
    // Standardized speaker data access
  }

  static getSpeakersByEvent(eventId) {
    // Replace speaker extraction in ExpandedEventDetailsManager
  }

  static getAllSpeakers() {
    // Get all speakers
  }

  static getFeaturedSpeakers() {
    // Get featured speakers
  }

  static getSpeakersByExpertise(expertise) {
    // Get speakers with a specific area of expertise
  }
}
```

#### 2.2.5 CategoryAPI

**File**: `js/category-api.js`
**Integration Points**:

- `UnifiedEventLoader.validateCategoryData()`
- `UnifiedEventLoader.categoryDefinitions`

```javascript
class CategoryAPI {
  static getCategory(categoryKey) {
    // Replace UnifiedEventLoader.categoryDefinitions access
  }

  static getAllCategories() {
    // Centralized category management
  }

  static getCategoriesWithEventCounts() {
    // Get categories with event counts for filtering
  }
}
```

#### 2.2.6 RoomAPI

**File**: `js/room-api.js`
**Integration Points**:

- `ScheduleGenerator` for room information display

```javascript
class RoomAPI {
  static getRoom(roomId) {
    // Get room information by ID
  }

  static getAllRooms() {
    // Get all rooms
  }

  static getRoomsByEvent(eventId) {
    // Get rooms associated with a specific event
  }
}
```

#### 2.2.7 StreamAPI

**File**: `js/stream-api.js`
**Integration Points**:

- `ScheduleGenerator` for stream information display
- Filtering by stream

```javascript
class StreamAPI {
  static getStream(streamId) {
    // Get stream information by ID
  }

  static getAllStreams() {
    // Get all streams
  }

  static getStreamsWithEventCounts() {
    // Get streams with event counts for filtering
  }

  static getEventsByStream(streamId) {
    // Get events associated with a specific stream
  }
}
```

#### 2.2.8 SessionTypeAPI

**File**: `js/session-type-api.js`
**Integration Points**:

- `ScheduleGenerator` for session type information display
- Filtering by session type

```javascript
class SessionTypeAPI {
  static getSessionType(typeId) {
    // Get session type information by ID
  }

  static getAllSessionTypes() {
    // Get all session types
  }

  static getSessionTypesWithEventCounts() {
    // Get session types with event counts for filtering
  }

  static getEventsBySessionType(typeId) {
    // Get events associated with a specific session type
  }
}
```

---

## 3. IMPLEMENTATION PHASES AND DEPENDENCIES

### Phase 1: Foundation Layer (Week 1-2)

**Dependencies**: None
**Deliverables**:

1. **DataManager Implementation**

   - Create `js/data-manager.js`
   - Implement data loading and consolidation logic
   - Add data validation and transformation
   - Create initialization lifecycle

2. **API Module Scaffolding**

   - Create `js/event-api.js`, `js/schedule-api.js`, `js/speaker-api.js`, `js/category-api.js`, `js/room-api.js`, `js/stream-api.js`, `js/session-type-api.js`
   - Implement basic method signatures
   - Add comprehensive JSDoc documentation
   - Create TypeScript definitions (optional)

3. **Data Structure Standardization**
   - Define standardized Event, Schedule, Speaker, Category interfaces
   - Create data transformation utilities
   - Implement validation schemas
   - Define standardized Room, Stream, and Session Type interfaces

### Phase 2: Core API Implementation (Week 3-4)

**Dependencies**: Phase 1 complete
**Deliverables**:

1. **EventAPI Complete Implementation**

   - `getEvent()`, `getAllEvents()`, `getEventsByCategory()`
   - Data consolidation from all event sources
   - Category key normalization
   - Event reference resolution

2. **ScheduleAPI Complete Implementation**

   - `getSchedule()`, `getAllSchedules()`, `getTimeSlots()`
   - Schedule data consolidation
   - EventReference to Event resolution
   - Time slot management

3. **SpeakerAPI and CategoryAPI Implementation**
   - Speaker data aggregation and normalization
   - Category definition centralization
   - Cross-reference management

4. **RoomAPI, StreamAPI, and SessionTypeAPI Implementation**
   - Room data extraction and standardization from actual API
   - Stream data extraction and standardization from actual API
   - Session Type data extraction and standardization from actual API
   - Extended entity relationship mapping
   - Implementation of getRoom(), getAllRooms(), getRoomsByEvent() methods in RoomAPI
   - Implementation of getStream(), getAllStreams(), getStreamsWithEventCounts(), getEventsByStream() methods in StreamAPI
   - Implementation of getSessionType(), getAllSessionTypes(), getSessionTypesWithEventCounts(), getEventsBySessionType() methods in SessionTypeAPI

### Phase 3: Component Integration (Week 5-6)

**Dependencies**: Phase 2 complete
**Deliverables**:

1. **UnifiedEventLoader Integration**

   - Replace direct `categoryDefinitions` access with `CategoryAPI.getCategory()`
   - Update `validateCategoryData()` to use CategoryAPI
   - Maintain backward compatibility during transition

2. **Schedule Generator Updates**

   - Replace `window.WORKSHOP_EVENTS` access with `EventAPI.getEvent()`
   - Replace `window.SCHEDULE_DATA` access with `ScheduleAPI.getSchedule()`
   - Update filtering logic to use `EventAPI.getEventsByCategory()`
   - Maintain existing method signatures

3. **ExpandedEventDetailsManager Integration**
   - Replace `adaptEventData()` with standardized Event objects
   - Update `adaptSpeakerData()` to use SpeakerAPI
   - Simplify data adaptation logic
   - Integrate RoomAPI, StreamAPI, and SessionTypeAPI for extended entity display
   - Update Schedule Generators to use RoomAPI for room information display
   - Update Schedule Generators to use StreamAPI for stream information display
   - Update Schedule Generators to use SessionTypeAPI for session type information display

### Phase 4: Testing and Validation (Week 7)

**Dependencies**: Phase 3 complete
**Deliverables**:

1. **Unit Test Suite**

   - API method functionality tests
   - Data transformation validation
   - Error handling verification

2. **Integration Testing**

   - Widget functionality verification
   - Cross-browser compatibility
   - Performance benchmarking

3. **Regression Testing**
   - Existing feature preservation
   - UI consistency validation
   - Filter functionality verification

### Phase 5: Deployment and Optimization (Week 8)

**Dependencies**: Phase 4 complete
**Deliverables**:

1. **Production Deployment**

   - Gradual rollout strategy
   - Monitoring and alerting
   - Rollback procedures

2. **Performance Optimization**
   - Caching implementation
   - Memory usage optimization
   - Load time improvements

---

## 4.1 COMPREHENSIVE DATA SCHEMAS

### 4.1.1 Event Object (Standardized Format)

This comprehensive structure will be the output of `EventAPI.getEvent()`, mapped from the actual Session objects in the API.

```javascript
{
  id: number,                    // Unique event identifier (numeric ID from actual API)
  title: string,                 // Event title
  subtitle: string,              // Event subtitle
  description: string,           // Detailed event description (HTML content from "copy" field)
  startTime: string,             // Start time (HH:MM format)
  endTime: string,               // End time (HH:MM format)
  thumbnail: string | null,      // Session thumbnail image URL
  categories: Category[],        // Array of category objects
  room: Room,                    // Room object
  stream: Stream,                // Stream object
  type: SessionType,             // Session type object
  speakers: Speaker[],           // Array of speaker objects
  speakerRoles: object,          // Speaker roles mapping (JSON object)
  featuredSpeaker: object | null,// Featured speaker information
  capacity: number,              // Session capacity
  // Additional fields from actual API
  acceptingQuestions: boolean,
  votingAndDiscussion: boolean,
  liveStreamingProviderLink: string | null,
  liveStreamProviderType: string,
  // Future extensibility fields
  sessionId: number | null,      // Session identifier for grouping (using actual ID)
  location: string | null,       // Physical location (derived from room)
  startDate: Date | null,        // Event start datetime (derived from schedule day date + startTime)
  endDate: Date | null,          // Event end datetime (derived from schedule day date + endTime)
  prerequisites: string[],       // Required knowledge or materials (optional, for future use)
  materials: string[],           // Provided materials or resources (optional, for future use)
  registration: {                // Registration information (optional, for future use)
    required: boolean,
    link: string,
    deadline: Date | null
  } | null
}
```

### 4.1.2 Speaker Object Structure

This structure represents speakers from the actual API, handling both top-level speaker objects and embedded speaker objects within sessions.

```javascript
{
  id: number,                    // Unique speaker identifier (numeric ID from actual API)
  displayName: string,           // Full speaker name
  sortName: string,              // Sortable name
  position: string,              // Title and company
  company: string,               // Company name
  bio: string,                   // Detailed speaker biography (HTML content)
  headshot: string | null,       // Headshot image URL
  email: string,                 // Contact email
  website: string | null,        // Personal or company website
  phoneNumber: string | null,    // Phone number
  facebook: string | null,       // Facebook profile
  twitterHandle: string | null,  // Twitter handle
  linkedIn: string | null,       // LinkedIn profile
  // Additional fields from actual API
  parentModuleType: string,
  parentModuleId: number,
  externalReference: string,
  unmappedStrings: null,
  moduleType: string,
  templateName: null,
  isStatic: boolean,
  isSingleton: boolean,
  pageSettings: null,
  speakerType: object | null,
  speakerSponsor: null,
  tags: null,
  documents: null,
  associatedSessions: null,
  associatedAbstracts: null,
  // Extended fields for future use
  socialMedia: {                 // Social media links (derived from actual fields)
    twitter: string | null,
    linkedin: string | null,
    facebook: string | null
  } | null,
  expertise: string[],           // Areas of expertise (optional, for future use)
  events: EventReference[],      // Events this speaker participates in (populated by SpeakerAPI)
  featured: boolean,             // Featured speaker status (derived from featuredSpeaker in sessions)
  tags: string[]                 // Custom tags for filtering (optional, for future use)
}
```

### 4.1.3 Schedule Object (Standardized Format)

This structure will be the output of `ScheduleAPI.getSchedule()`, mapped from the actual Schedule Day objects in the API.

```javascript
{
  id: number,                    // Unique schedule identifier (numeric ID from actual API)
  title: string,                 // Schedule title
  date: string,                  // Schedule date (ISO date format from actual API)
  sessions: Event[],             // Array of session/event objects
  sessionGroups: array,          // Session groups from actual API
  meetingBlocks: array,          // Meeting blocks from actual API
  parentModuleType: string,
  parentModuleId: number,
  externalReference: string,
  unmappedStrings: null,
  moduleType: string,
  templateName: null,
  isStatic: boolean,
  isSingleton: boolean,
  pageSettings: null,
  // Extended fields for standardization
  timeSlots: TimeSlot[],         // Array of time slot objects (derived from sessions)
  venue: string | null,          // Venue information (optional, for future use)
  timezone: string | null,       // Timezone information (optional, for future use)
  notes: string[]                // General schedule notes (optional, for future use)
}
```

### 4.1.4 TimeSlot Structure

```javascript
{
  id: string,                    // Unique time slot identifier
  timeRange: string,             // Display time range (e.g., "10.00am - 10.30am")
  title: string,                 // Time slot title (e.g., "Early Morning Panels")
  theme: string,                 // Styling theme (e.g., "early", "mid", "a", "b")
  type: "event" | "break",       // Slot type
  events: EventReference[],      // Array of event references (for event slots)
  description: string | null,    // Description (for break slots) (optional, for future use)
  duration: number | null,       // Duration in minutes (optional, for future use)
  backgroundColor: string | null,// Custom background color (optional, for future use)
  textColor: string | null       // Custom text color (optional, for future use)
}
```

### 4.1.5 EventReference Structure

Used within `TimeSlot` to link to full `Event` objects.

```javascript
{
  id: string,                    // Event ID reference
  category: string,              // Event category for display (redundant, but useful for quick display)
  title: string,                 // Event title (redundant, but useful for quick display)
  type: "big" | "main"           // Panel type for styling
}
```

### 4.1.6 Category Object Structure

This structure represents categories from the actual API, which are embedded within session objects.

```javascript
{
  id: number,                    // Unique category identifier (numeric ID from actual API)
  name: string,                  // Display name
  parentModuleType: string,
  parentModuleId: number,
  externalReference: null,
  unmappedStrings: null,
  moduleType: string,
  templateName: null,
  isStatic: boolean,
  isSingleton: boolean,
  pageSettings: null,
  // Extended fields for standardization
  key: string,                   // Standardized key (derived from name)
  description: string | null,    // Category description (optional, for future use)
  color: string | null,          // Primary color for UI (optional, for future use)
  brightness: "light" | "dark",  // Text brightness for contrast (derived from existing data)
  icon: string | null,           // Category icon identifier (optional, for future use)
  tags: string[],                // Associated audience tags (optional, for future use)
  featured: boolean,             // Featured category status (optional, for future use)
  sortOrder: number | null       // Display order (optional, for future use)
}
```

### 4.1.7 Room Object Structure

This structure represents rooms from the actual API, which are embedded within session objects.

```javascript
{
  id: number,                    // Unique room identifier (numeric ID from actual API)
  title: string,                 // Room name/title
  capacity: number,              // Room capacity
  parentModuleType: string,
  parentModuleId: number,
  externalReference: null,
  unmappedStrings: null,
  moduleType: string,
  templateName: null,
  isStatic: boolean,
  isSingleton: boolean,
  pageSettings: null,
  // Extended fields for standardization
  description: string | null,    // Room description (optional, for future use)
  location: string | null,       // Physical location details (optional, for future use)
  floor: string | null,          // Floor information (optional, for future use)
  mapCoordinates: {              // Map coordinates (optional, for future use)
    x: number | null,
    y: number | null
  } | null
}
```

### 4.1.8 Stream Object Structure

This structure represents streams from the actual API, which are embedded within session objects.

```javascript
{
  id: number,                    // Unique stream identifier (numeric ID from actual API)
  title: string,                 // Stream name/title
  streamColour: string,           // Stream color
  parentModuleType: string,
  parentModuleId: number,
  externalReference: null,
  unmappedStrings: null,
  moduleType: string,
  templateName: null,
  isStatic: boolean,
  isSingleton: boolean,
  pageSettings: null,
  // Extended fields for standardization
  description: string | null,    // Stream description (optional, for future use)
  icon: string | null,           // Stream icon identifier (optional, for future use)
  sortOrder: number | null,      // Display order (optional, for future use)
  featured: boolean              // Featured stream status (optional, for future use)
}
```

### 4.1.9 Session Type Object Structure

This structure represents session types from the actual API, which are embedded within session objects.

```javascript
{
  id: number,                    // Unique session type identifier (numeric ID from actual API)
  title: string,                 // Session type name/title
  colour: string,                // Session type color
  parentModuleType: string,
  parentModuleId: number,
  externalReference: null,
  unmappedStrings: null,
  moduleType: string,
  templateName: null,
  isStatic: boolean,
  isSingleton: boolean,
  pageSettings: null,
  cellStyle: null,
  icon: null,
  // Extended fields for standardization
  description: string | null,    // Session type description (optional, for future use)
  iconIdentifier: string | null, // Session type icon identifier (optional, for future use)
  sortOrder: number | null,      // Display order (optional, for future use)
  featured: boolean              // Featured session type status (optional, for future use)
}
```

---

## 4. DATA TRANSFORMATION AND MIGRATION STRATEGIES

### 4.1 Data Transformation Layer

The DataTransformer will handle the conversion of the actual API structure to the standardized formats used by the API modules.

**Key Transformation Tasks**:

1. **Speaker Normalization**: Resolve duplication between top-level speakers and embedded session speakers
2. **ID Standardization**: Convert numeric IDs to standardized identifiers where needed
3. **Category Extraction**: Extract and standardize category information from sessions
4. **Time Slot Derivation**: Create time slots from session start/end times
5. **Entity Relationship Mapping**: Establish proper relationships between entities

### 4.2 Speaker Duplication Resolution

**Problem**: Speakers exist both as a top-level array and as embedded objects within sessions.

**Solution**:

1. **Primary Source**: Use top-level speaker objects as the primary source of speaker data
2. **Embedded References**: Replace embedded speaker objects in sessions with references to primary speaker objects
3. **Data Synchronization**: Ensure embedded speaker data is synchronized with primary speaker data
4. **Conflict Resolution**: When conflicts exist, prioritize top-level speaker data

**Implementation**:

```javascript
// Pseudocode for speaker normalization
function normalizeSpeakers(apiData) {
  // Create a map of all speakers by ID
  const speakerMap = new Map();
  apiData.speakers.forEach(speaker => {
    speakerMap.set(speaker.id, speaker);
  });

  // Process sessions and replace embedded speakers with references
  apiData.schedule.forEach(scheduleDay => {
    scheduleDay.sessions.forEach(session => {
      session.speakers = session.speakers.map(embeddedSpeaker => {
        // Try to find matching speaker in top-level speakers
        const primarySpeaker = speakerMap.get(embeddedSpeaker.id);
        if (primarySpeaker) {
          // Use primary speaker data
          return primarySpeaker;
        } else {
          // Add embedded speaker to map if not found
          speakerMap.set(embeddedSpeaker.id, embeddedSpeaker);
          return embeddedSpeaker;
        }
      });
    });
  });

  return apiData;
}
```

### 4.3 ID Standardization

**Problem**: All entities in the actual API use numeric IDs, but the planned architecture assumed string IDs.

**Solution**:

1. **Maintain Numeric IDs**: Keep numeric IDs as the primary identifiers since they're already established in the API
2. **String ID Generation**: Generate string IDs for display purposes where needed
3. **ID Mapping**: Create mapping functions between numeric and string IDs

**Implementation**:

```javascript
// Pseudocode for ID standardization
function standardizeIds(entity, entityType) {
  // Keep numeric ID as primary
  const numericId = entity.id;
  
  // Generate string ID for display
  const stringId = `${entityType}-${numericId}`;
  
  return {
    ...entity,
    numericId,
    stringId
  };
}
```

### 4.4 Category Standardization

**Problem**: Categories in the actual API are embedded objects with limited properties.

**Solution**:

1. **Category Aggregation**: Extract all unique categories from sessions
2. **Property Enhancement**: Add missing properties to category objects
3. **Key Generation**: Generate standardized keys for categories

**Implementation**:

```javascript
// Pseudocode for category standardization
function standardizeCategories(apiData) {
  const categoryMap = new Map();
  
  // Extract categories from all sessions
  apiData.schedule.forEach(scheduleDay => {
    scheduleDay.sessions.forEach(session => {
      session.categories.forEach(category => {
        if (!categoryMap.has(category.id)) {
          // Enhance category with standardized properties
          const standardizedCategory = {
            ...category,
            key: generateCategoryKey(category.name),
            description: category.description || null,
            color: category.color || null,
            brightness: determineBrightness(category.color),
            icon: category.icon || null,
            tags: category.tags || [],
            featured: category.featured || false,
            sortOrder: category.sortOrder || null
          };
          categoryMap.set(category.id, standardizedCategory);
        }
      });
    });
  });
  
  return categoryMap;
}
```

### 4.5 Migration Strategy

1. **Data Transformation Layer**: Implement the DataTransformer to handle conversion from actual API structure to standardized formats
2. **Dual-Mode Operation**: APIs initially proxy to the actual API data through the DataTransformer
3. **Gradual Replacement**: Components updated one at a time to use the new API modules
4. **Validation Layer**: Ensure API responses match expected formats through comprehensive validation
5. **Rollback Capability**: Maintain ability to revert to direct API access through feature flags

### 4.6 Data Enrichment Plan

**Phase 1**: Basic API functionality with actual API data
**Phase 2**: Enhance data with additional fields from the rich content in the actual API (descriptions, bios, etc.)
**Phase 3**: Implement advanced features using the multiple categorization dimensions (categories, streams, session types, rooms)
**Phase 4**: Add future extensibility features (audienceTags, sessionId, location, etc.)

**Enhanced Data Enrichment for Extended Entities**:

**Phase 2b**: Enhance Room, Stream, and Session Type data with additional fields from the actual API
  - Extract and standardize room descriptions, capacity, and location information
  - Extract and standardize stream descriptions, colors, and icon information
  - Extract and standardize session type descriptions, colors, and icon information

**Phase 3b**: Implement advanced filtering and display features using extended entities
  - Add room-based filtering and display
  - Add stream-based filtering and display
  - Add session type-based filtering and display
  - Implement multi-dimensional filtering (e.g., filter by category AND stream)

**Enhanced Data Enrichment for Extended Entities**:

**Phase 2b**: Enhance Room, Stream, and Session Type data with additional fields from the actual API
  - Extract and standardize room descriptions, capacity, and location information
  - Extract and standardize stream descriptions, colors, and icon information
  - Extract and standardize session type descriptions, colors, and icon information

**Phase 3b**: Implement advanced filtering and display features using extended entities
  - Add room-based filtering and display
  - Add stream-based filtering and display
  - Add session type-based filtering and display
  - Implement multi-dimensional filtering (e.g., filter by category AND stream)

---

## 4.2 SECURITY CONSIDERATIONS

### 4.2.1 Data Integrity

- **Validation**: All data inputs (from raw JS files) should be validated against the defined schemas during API initialization to catch malformed data early.
- **Immutability**: Treat the data returned by the API methods as immutable where possible, to prevent accidental modification by consuming components. If modifications are needed, ensure they are explicit and localized.
- **Sanitization**: While this API primarily serves internal components, if any data originates from external, untrusted sources (e.g., user input), ensure proper sanitization to prevent XSS or injection vulnerabilities.

### 4.2.2 Access Control

- **Read-Only Access**: The API should primarily provide read-only access to the event and schedule data. No methods for modifying or deleting data should be exposed.
- **No Sensitive Data**: Ensure no sensitive user data or API keys are hardcoded or exposed through this client-side API.

### 4.2.3 Error Handling

- **Graceful Degradation**: Implement robust error handling within the API modules to gracefully manage cases where data is missing or malformed, preventing crashes in consuming widgets.
- **Information Leakage**: Ensure error messages do not expose sensitive implementation details or system information that could be exploited.

---

## 4.3 DEPLOYMENT CONSIDERATIONS

### 4.3.1 Build Process

1.  **Data Bundling**: The raw event and schedule data files, along with the new API modules, should be bundled together into the final widget JavaScript assets.
2.  **Minification**: All JavaScript files should be minified to reduce file size.
3.  **Dependency Management**: Ensure the correct loading order of the API modules and their dependencies. The API modules must initialize before any components attempt to use them.

### 4.3.2 Runtime Configuration

- **Environment Detection**: Consider if any API behavior needs to differ between development and production environments (e.g., debug logging).
- **Error Handling**: Implement robust error handling within the API modules to gracefully manage cases where data is missing or malformed, preventing crashes in consuming widgets.
- **Fallbacks**: Provide sensible fallback values or error messages if critical data cannot be loaded or found.

### 4.3.3 Performance Optimization

- **Caching Strategy**: Implement appropriate caching mechanisms to reduce repeated data processing.
- **Lazy Loading**: For extremely large datasets, consider lazy-loading of specific event details or speaker bios only when requested.
- **Memory Management**: Monitor memory usage to ensure it remains within acceptable limits for the target environments.

---

## 5. COMPONENT INTEGRATION AND REFACTORING APPROACH

### 5.1 UnifiedEventLoader Refactoring

**Current Integration Points**:

- `createEventPanel()`: Receives event data from generators
- `validateCategoryData()`: Validates category information
- `categoryDefinitions`: Hardcoded category mapping

**Refactoring Strategy**:

```javascript
// Before
validateCategoryData(eventData) {
  const categoryKey = eventData.categoryKey || this.mapCategoryToKey(eventData.category);
  const definition = this.categoryDefinitions.get(categoryKey);
  // ...
}

// After
validateCategoryData(eventData) {
  const categoryKey = eventData.categoryKey || this.mapCategoryToKey(eventData.category);
  const definition = CategoryAPI.getCategory(categoryKey);
  // ...
}
```

### 5.2 Schedule Generator Integration

**Enhanced Data Access Pattern**:

```javascript
// Before - Direct global access
const eventData = window.MORNING_EVENTS ? window.MORNING_EVENTS[eventId] : null;

// After - API access with extended entity support
const eventData = EventAPI.getEvent(eventId);
const roomData = RoomAPI.getRoom(eventData.room.id);
const streamData = StreamAPI.getStream(eventData.stream.id);
const sessionTypeData = SessionTypeAPI.getSessionType(eventData.type.id);
```

**Enhanced Filtering Integration**:

```javascript
// Before - Manual filtering
eventPanels.forEach((panel) => {
  const eventData = window.MORNING_EVENTS && window.MORNING_EVENTS[eventId];
  const eventCategoryKey = eventData.categoryKey || eventData.category;
  // Manual comparison logic
});

// After - API-driven filtering with multiple dimensions
const filteredEvents = EventAPI.getEventsByCategory(categoryKey);
const filteredByStream = StreamAPI.getEventsByStream(streamId);
const filteredBySessionType = SessionTypeAPI.getEventsBySessionType(typeId);
// Apply filtering classes based on API results
```

### 5.3 ExpandedEventDetailsManager Simplification

**Enhanced Data Access**:

```javascript
// Before - Complex adaptation
const standardData = this.adaptEventData(eventData);

// After - Direct API usage with extended entities
const eventData = EventAPI.getEvent(eventId); // Already standardized
const speakers = SpeakerAPI.getSpeakersByEvent(eventId); // Already normalized
const room = RoomAPI.getRoom(eventData.room.id); // Room information
const stream = StreamAPI.getStream(eventData.stream.id); // Stream information
const sessionType = SessionTypeAPI.getSessionType(eventData.type.id); // Session type information
```

### 5.2 Schedule Generator Integration

**Current Data Access Pattern**:

```javascript
// Before - Direct global access
const eventData = window.MORNING_EVENTS ? window.MORNING_EVENTS[eventId] : null;

// After - API access
const eventData = EventAPI.getEvent(eventId);
```

**Filtering Integration**:

```javascript
// Before - Manual filtering
eventPanels.forEach((panel) => {
  const eventData = window.MORNING_EVENTS && window.MORNING_EVENTS[eventId];
  const eventCategoryKey = eventData.categoryKey || eventData.category;
  // Manual comparison logic
});

// After - API-driven filtering
const filteredEvents = EventAPI.getEventsByCategory(categoryKey);
// Apply filtering classes based on API results
```

### 5.3 ExpandedEventDetailsManager Simplification

**Current Complexity**:

- `adaptEventData()`: Complex data transformation
- `adaptSpeakerData()`: Speaker data normalization
- `extractAudienceTags()`: Tag extraction logic

**Simplified Approach**:

```javascript
// Before - Complex adaptation
const standardData = this.adaptEventData(eventData);

// After - Direct API usage
const eventData = EventAPI.getEvent(eventId); // Already standardized
const speakers = SpeakerAPI.getSpeakersByEvent(eventId); // Already normalized
```

---

## 6. TESTING AND VALIDATION FRAMEWORK

### 6.1 Unit Testing Strategy

**API Module Tests**:

```javascript
describe("EventAPI", () => {
  test("getEvent returns standardized event object", () => {
    const event = EventAPI.getEvent(123);
    expect(event).toMatchSchema(EventSchema);
    expect(event.id).toBe(123);
  });

  test("getEventsByCategory filters correctly", () => {
    const events = EventAPI.getEventsByCategory("STORY_NARRATIVE");
    events.forEach((event) => {
      expect(event.categoryKey).toBe("STORY_NARRATIVE");
    });
  });

  test("getAllEvents returns all events", () => {
    const events = EventAPI.getAllEvents();
    expect(events.length).toBeGreaterThan(0);
    // Verify all events have required fields
    events.forEach((event) => {
      expect(event.id).toBeDefined();
      expect(event.title).toBeDefined();
      expect(event.category).toBeDefined();
    });
  });

  test("searchEvents finds matching events", () => {
    const events = EventAPI.searchEvents("Story");
    expect(events.length).toBeGreaterThan(0);
    // Verify all results contain the search term
    events.forEach((event) => {
      expect(event.title.toLowerCase()).toContain("story");
    });
  });
});


describe("RoomAPI", () => {
  test("getRoom returns room object", () => {
    const room = RoomAPI.getRoom(456);
    expect(room).toMatchSchema(RoomSchema);
    expect(room.id).toBe(456);
  });

  test("getAllRooms returns all rooms", () => {
    const rooms = RoomAPI.getAllRooms();
    expect(rooms.length).toBeGreaterThan(0);
    rooms.forEach((room) => {
      expect(room.id).toBeDefined();
      expect(room.title).toBeDefined();
    });
  });
});


describe("StreamAPI", () => {
  test("getStream returns stream object", () => {
    const stream = StreamAPI.getStream(789);
    expect(stream).toMatchSchema(StreamSchema);
    expect(stream.id).toBe(789);
  });

  test("getEventsByStream filters correctly", () => {
    const events = StreamAPI.getEventsByStream(789);
    expect(events.length).toBeGreaterThanOrEqual(0);
  });
});


describe("SessionTypeAPI", () => {
  test("getSessionType returns session type object", () => {
    const sessionType = SessionTypeAPI.getSessionType(101);
    expect(sessionType).toMatchSchema(SessionTypeSchema);
    expect(sessionType.id).toBe(101);
  });

  test("getEventsBySessionType filters correctly", () => {
    const events = SessionTypeAPI.getEventsBySessionType(101);
    expect(events.length).toBeGreaterThanOrEqual(0);
  });
});
```

**API Module Initialization Tests**:

```javascript
describe("API Module Initialization", () => {
  test("DataManager loads all raw data sources correctly", () => {
    const dataManager = new DataManager();
    // Verify data loading from all sources
    expect(dataManager.getEventData().size).toBeGreaterThan(0);
    expect(dataManager.getScheduleData().size).toBeGreaterThan(0);
  });

  test("Data transformation produces standardized formats", () => {
    const dataManager = new DataManager();
    const events = dataManager.getAllEvents();
    // Verify all events conform to Event schema
    events.forEach((event) => {
      expect(event).toMatchSchema(EventSchema);
    });
  });
});
```

**Integration Tests**:

```javascript
describe("Schedule Generator Integration", () => {
  test("renders schedule with API data", async () => {
    const generator = new MorningScheduleGenerator(container);
    const scheduleData = ScheduleAPI.getSchedule("friday-morning");
    await generator.renderSchedule(scheduleData);

    expect(
      container.querySelectorAll(".nzgdc-morning-event-panel-container")
    ).toHaveLength(expectedCount);
  });

  test("UnifiedEventLoader creates panels with API data", () => {
    const event = EventAPI.getEvent("workshop-a1");
    const panel = UnifiedEventLoader.createEventPanel(event, "big", "thursday");
    expect(panel).toBeDefined();
    expect(panel.querySelector(".nzgdc-title-text-big").textContent).toBe(
      event.title
    );
  });

  test("ExpandedEventDetailsManager shows details with API data", () => {
    const event = EventAPI.getEvent("workshop-a1");
    const manager = new ExpandedEventDetailsManager();
    // Mock template loading
    manager.templateLoaded = true;
    manager.overlayContainer = document.createElement("div");
    manager.showEventDetails(event);
    // Verify content was populated
    expect(manager.currentEventData).toBe(event);
  });
});


describe("Cross-API Consistency with Extended Entities", () => {
  test("Event data includes consistent room information", () => {
    const eventId = 123;
    const eventFromEventAPI = EventAPI.getEvent(eventId);
    const roomFromRoomAPI = RoomAPI.getRoom(eventFromEventAPI.room.id);
    
    expect(eventFromEventAPI.room.id).toBe(roomFromRoomAPI.id);
    expect(eventFromEventAPI.room.title).toBe(roomFromRoomAPI.title);
  });

  test("Event data includes consistent stream information", () => {
    const eventId = 123;
    const eventFromEventAPI = EventAPI.getEvent(eventId);
    const streamFromStreamAPI = StreamAPI.getStream(eventFromEventAPI.stream.id);
    
    expect(eventFromEventAPI.stream.id).toBe(streamFromStreamAPI.id);
    expect(eventFromEventAPI.stream.title).toBe(streamFromStreamAPI.title);
  });

  test("Event data includes consistent session type information", () => {
    const eventId = 123;
    const eventFromEventAPI = EventAPI.getEvent(eventId);
    const sessionTypeFromSessionTypeAPI = SessionTypeAPI.getSessionType(eventFromEventAPI.type.id);
    
    expect(eventFromEventAPI.type.id).toBe(sessionTypeFromSessionTypeAPI.id);
    expect(eventFromEventAPI.type.title).toBe(sessionTypeFromSessionTypeAPI.title);
  });
});
```

### 6.2 Validation Framework

**Data Integrity Checks**:

1. **Schema Validation**: Ensure all API responses match defined schemas
2. **Cross-Reference Validation**: Verify event-speaker-category relationships
3. **Completeness Checks**: Ensure no data loss during transformation
4. **Consistency Checks**: Verify data consistency across different API modules

**Performance Benchmarks**:

1. **Load Time**: API initialization < 100ms
2. **Memory Usage**: < 10MB for complete dataset
3. **Query Performance**: Individual lookups < 1ms
4. **Rendering Performance**: Panel creation < 50ms per panel

### 6.3 Regression Testing

**Functional Tests**:

- All existing widget functionality preserved
- Event panel rendering identical
- Filtering behavior unchanged
- Expanded details display consistent
- Speaker hover details work correctly
- Category color mapping preserved

**Visual Regression Tests**:

- Screenshot comparison for all widget states
- Cross-browser rendering verification
- Mobile responsiveness validation
- Color scheme consistency across components

### 6.4 Cross-API Consistency Testing

```javascript
describe("Cross-API Consistency", () => {
  test("Event data consistency across APIs", () => {
    const eventId = "workshop-a1";
    const eventFromEventAPI = EventAPI.getEvent(eventId);
    const scheduleWithEvents =
      ScheduleAPI.getScheduleWithFullEvents("thursday");
    // Find the same event in schedule data
    let eventFromScheduleAPI = null;
    scheduleWithEvents.timeSlots.forEach((slot) => {
      if (slot.events) {
        const found = slot.events.find((e) => e.id === eventId);
        if (found) eventFromScheduleAPI = found;
      }
    });

    expect(eventFromEventAPI.title).toBe(eventFromScheduleAPI.title);
    expect(eventFromEventAPI.category).toBe(eventFromScheduleAPI.category);
  });

  test("Speaker data consistency", () => {
    const eventId = "workshop-a1";
    const event = EventAPI.getEvent(eventId);
    const speakersFromEvent = event.speakers;
    const speakersFromSpeakerAPI = SpeakerAPI.getSpeakersByEvent(eventId);

    expect(speakersFromEvent.length).toBe(speakersFromSpeakerAPI.length);
    speakersFromEvent.forEach((speaker, index) => {
      expect(speaker.name).toBe(speakersFromSpeakerAPI[index].name);
      expect(speaker.position).toBe(speakersFromSpeakerAPI[index].position);
    });
  });
});
```

### 6.5 End-to-End Tests

**Widget Integration Tests**:

- Load a widget (e.g., Thursday, Friday/Saturday)
- Verify that `ScheduleGenerator`, `UnifiedEventLoader`, and `ExpandedEventDetailsManager` successfully retrieve and display data from the new API modules
- Confirm that all existing functionalities (e.g., panel rendering, hover effects, expanded details, filtering) work as expected using the new API

**Cross-Browser Compatibility**:

- Ensure the API and consuming widgets work correctly across all target browsers
- Test on Chrome, Firefox, Safari, and Edge
- Verify mobile responsiveness on various devices

**Performance Benchmarks**:

- Measure initial load times and data retrieval speeds to ensure they meet targets
- Monitor memory usage during extended widget usage
- Test filtering performance with large datasets

---

## 7. DEPLOYMENT AND ROLLBACK STRATEGIES

### 7.1 Gradual Rollout Plan

**Stage 1: API Foundation (Week 1-2)**

- Deploy API modules alongside existing code
- No functional changes to widgets
- Monitoring and logging implementation

**Stage 2: Component Integration (Week 3-5)**

- Update one generator at a time
- Feature flags for API vs. direct access
- A/B testing for performance comparison

**Stage 3: Full Migration (Week 6-7)**

- Complete transition to API access
- Remove legacy data access patterns
- Performance optimization

**Stage 4: Enhancement (Week 8+)**

- Add new API features
- Data enrichment
- Advanced functionality

### 7.2 Rollback Procedures

**Immediate Rollback** (< 5 minutes):

- Feature flag toggle to disable API access
- Revert to direct data source access
- Automated monitoring triggers

**Component-Level Rollback** (< 15 minutes):

- Revert individual generator changes
- Maintain API infrastructure
- Selective functionality restoration

**Full System Rollback** (< 30 minutes):

- Complete reversion to pre-API state
- Database/cache cleanup
- Comprehensive system validation

### 7.3 Monitoring and Alerting

**Performance Metrics**:

- API response times
- Memory usage patterns
- Error rates and types
- User interaction success rates

**Business Metrics**:

- Widget load success rate
- Event detail view engagement
- Filter usage patterns
- Cross-browser compatibility

---

## 8. API INTERFACES AND USAGE PATTERNS

### 8.1 EventAPI Interface

```javascript
/**
 * Centralized Event Data Access API
 * Replaces direct access to WORKSHOP_EVENTS, MORNING_EVENTS, AFTERNOON_EVENTS
 */
class EventAPI {
  /**
   * Get a single event by ID
   * @param {string} eventId - Unique event identifier
   * @returns {Event|null} Standardized event object or null if not found
   */
  static getEvent(eventId) {
    return DataManager.getInstance().getEvent(eventId);
  }

  /**
   * Get all events across all sources
   * @returns {Event[]} Array of all standardized event objects
   */
  static getAllEvents() {
    return DataManager.getInstance().getAllEvents();
  }

  /**
   * Get events filtered by category
   * @param {string} categoryKey - Category key (e.g., 'STORY_NARRATIVE')
   * @returns {Event[]} Array of matching events
   */
  static getEventsByCategory(categoryKey) {
    return DataManager.getInstance().getEventsByCategory(categoryKey);
  }

  /**
   * Search events by title or description
   * @param {string} query - Search query
   * @returns {Event[]} Array of matching events
   */
  static searchEvents(query) {
    return DataManager.getInstance().searchEvents(query);
  }

  /**
   * Get featured events
   * @returns {Event[]} Array of featured events
   */
  static getFeaturedEvents() {
    return DataManager.getInstance().getFeaturedEvents();
  }
}
```

### 8.2 Usage Pattern Examples

**Schedule Generator Integration**:

```javascript
// Replace this pattern:
const eventData = window.MORNING_EVENTS ? window.MORNING_EVENTS[eventId] : null;
if (!eventData) {
  console.warn(`No data found for event: ${eventId}`);
  return;
}

// With this pattern:
const eventData = EventAPI.getEvent(eventId);
if (!eventData) {
  console.warn(`No data found for event: ${eventId}`);
  return;
}
```

**Filtering Integration**:

```javascript
// Replace this pattern:
eventPanels.forEach((panel) => {
  const eventId = panel.dataset.eventId;
  const eventData = window.MORNING_EVENTS && window.MORNING_EVENTS[eventId];
  if (eventData && eventData.categoryKey === categoryKey) {
    panel.classList.add("filtered-in");
  }
});

// With this pattern:
const matchingEvents = EventAPI.getEventsByCategory(categoryKey);
const matchingIds = new Set(matchingEvents.map((e) => e.id));
eventPanels.forEach((panel) => {
  const eventId = panel.dataset.eventId;
  if (matchingIds.has(eventId)) {
    panel.classList.add("filtered-in");
  }
});
```

### 8.3 Error Handling Patterns

```javascript
/**
 * Robust API usage with error handling
 */
function loadEventSafely(eventId) {
  try {
    const eventData = EventAPI.getEvent(eventId);
    if (!eventData) {
      throw new Error(`Event not found: ${eventId}`);
    }
    return eventData;
  } catch (error) {
    console.error(`Failed to load event ${eventId}:`, error);
    return null;
  }
}
```

---

## 9. SUCCESS CRITERIA AND VALIDATION

### 9.1 Functional Success Criteria

- [ ] All existing widget functionality preserved
- [ ] Event panels render identically to current implementation
- [ ] Filtering behavior unchanged from user perspective
- [ ] Expanded event details display consistently
- [ ] Cross-browser compatibility maintained
- [ ] Mobile responsiveness preserved
- [ ] Room, Stream, and Session Type information displayed correctly
- [ ] Multi-dimensional filtering works as expected (category, stream, session type, room)
- [ ] Extended entity data accessible through API modules

### 9.2 Performance Success Criteria

- [ ] Widget initialization time < 2 seconds (current baseline)
- [ ] API response time < 10ms for direct lookups
- [ ] Memory usage increase < 20% from current baseline
- [ ] No visible performance degradation in user interactions

### 9.3 Architecture Success Criteria

- [ ] Complete elimination of direct global data access
- [ ] Centralized data management through API layer
- [ ] Standardized data structures across all components
- [ ] Extensible architecture for future enhancements
- [ ] Comprehensive error handling and logging
- [ ] RoomAPI, StreamAPI, and SessionTypeAPI fully implemented and functional
- [ ] Data transformation layer successfully handles speaker duplication and ID standardization

### 9.4 Maintainability Success Criteria

- [ ] Reduced code duplication across generators
- [ ] Simplified data access patterns
- [ ] Clear separation of concerns between data and presentation
- [ ] Comprehensive documentation and examples
- [ ] Automated testing coverage > 80%
- [ ] API modules properly documented with JSDoc
- [ ] Code modularity and separation of concerns maintained with new API modules

---

## 10. RISK MITIGATION AND CONTINGENCY PLANNING

### 10.1 Technical Risks

**Risk**: Performance degradation due to API overhead
**Mitigation**: Implement caching layer, benchmark against current performance
**Contingency**: Feature flag rollback to direct access

**Risk**: Data inconsistency during migration
**Mitigation**: Comprehensive validation layer, gradual rollout
**Contingency**: Automated data integrity checks, immediate rollback capability

**Risk**: Breaking changes to existing functionality
**Mitigation**: Extensive regression testing, backward compatibility layer
**Contingency**: Component-level rollback procedures

### 10.2 Timeline Risks

**Risk**: Implementation complexity exceeds estimates
**Mitigation**: Phased approach, early prototype validation
**Contingency**: Scope reduction, focus on core functionality first

**Risk**: Integration challenges with existing components
**Mitigation**: Detailed component analysis, incremental integration
**Contingency**: Maintain dual-mode operation longer than planned

---

## CONCLUSION

This architecture plan provides a comprehensive roadmap for integrating the centralized Events Schedule API into the existing NZGDC widget system. The phased approach ensures minimal disruption while delivering significant architectural improvements in maintainability, scalability, and extensibility.

The plan prioritizes backward compatibility and includes robust rollback procedures to minimize risk during the transition. Upon completion, the system will have a clean, centralized data layer that supports future enhancements while maintaining all existing functionality.

**Next Steps**:

1. Review and approve this architecture plan
2. Begin Phase 1 implementation with DataManager and API scaffolding
3. Establish testing framework and validation procedures
4. Initiate gradual component integration following the defined timeline

## APPENDIX A: TESTING STRATEGIES FOR NEW API MODULES

### A.1 RoomAPI Testing

**Unit Tests**:
- `getRoom()` returns correct room object with all properties
- `getAllRooms()` returns all rooms in the system
- `getRoomsByEvent()` returns rooms associated with a specific event
- Error handling for non-existent room IDs

**Integration Tests**:
- Room information correctly displayed in Schedule Generators
- Room data consistency across EventAPI and RoomAPI

### A.2 StreamAPI Testing

**Unit Tests**:
- `getStream()` returns correct stream object with all properties
- `getAllStreams()` returns all streams in the system
- `getStreamsWithEventCounts()` returns streams with event counts for filtering
- `getEventsByStream()` returns events associated with a specific stream
- Error handling for non-existent stream IDs

**Integration Tests**:
- Stream information correctly displayed in Schedule Generators
- Stream-based filtering works as expected
- Stream data consistency across EventAPI and StreamAPI

### A.3 SessionTypeAPI Testing

**Unit Tests**:
- `getSessionType()` returns correct session type object with all properties
- `getAllSessionTypes()` returns all session types in the system
- `getSessionTypesWithEventCounts()` returns session types with event counts for filtering
- `getEventsBySessionType()` returns events associated with a specific session type
- Error handling for non-existent session type IDs

**Integration Tests**:
- Session type information correctly displayed in Schedule Generators
- Session type-based filtering works as expected
- Session type data consistency across EventAPI and SessionTypeAPI

### A.4 Multi-dimensional Filtering Testing

**Test Scenarios**:
- Filter by category AND stream
- Filter by category AND session type
- Filter by stream AND session type
- Filter by category AND stream AND session type
- Filter by room AND category
- Filter reset functionality with multiple dimensions

### A.5 Performance Testing for Extended Entities

**Test Scenarios**:
- Load time for pages with extended entity information
- Memory usage with extended entity data
- Filtering performance with multiple dimensions
- API response times for extended entity queries
