# Consolidated Panels API Documentation

This document provides comprehensive documentation for the Consolidated Panels API, which centralizes data access for events, schedules, speakers, categories, rooms, streams, and session types in the NZGDC widget system.

## Table of Contents

1. [Overview](#overview)
2. [API Modules](#api-modules)
   - [EventAPI](#eventapi)
   - [ScheduleAPI](#scheduleapi)
   - [SpeakerAPI](#speakerapi)
   - [CategoryAPI](#categoryapi)
   - [RoomAPI](#roomapi)
   - [StreamAPI](#streamapi)
   - [SessionTypeAPI](#sessiontypeapi)
3. [Data Manager](#data-manager)
4. [Data Transformer](#data-transformer)
5. [Usage Examples](#usage-examples)
6. [Error Handling](#error-handling)
7. [Testing](#testing)

## Overview

The Consolidated Panels API provides a unified interface for accessing all event-related data in the NZGDC widget system. It replaces direct access to global data objects with a structured, standardized approach that ensures data consistency and simplifies maintenance.

The API consists of several modules, each responsible for a specific data domain:

- **EventAPI**: Access to event/session data
- **ScheduleAPI**: Access to schedule data
- **SpeakerAPI**: Access to speaker data
- **CategoryAPI**: Access to category data
- **RoomAPI**: Access to room data
- **StreamAPI**: Access to stream data
- **SessionTypeAPI**: Access to session type data

All modules delegate to a central **DataManager** that handles data loading, transformation, and caching.

## API Modules

### EventAPI

The EventAPI provides access to event/session data, which represents individual sessions in the schedule.

#### Methods

##### `getEvent(eventId)`
Retrieves a single event by its ID.

**Parameters:**
- `eventId` (number): Unique event identifier

**Returns:**
- `Object|null`: Standardized event object or null if not found

**Example:**
```javascript
const event = EventAPI.getEvent(123);
if (event) {
  console.log(`Event: ${event.title}`);
}
```

##### `getAllEvents()`
Retrieves all events across all sources.

**Returns:**
- `Array`: Array of all standardized event objects

**Example:**
```javascript
const allEvents = EventAPI.getAllEvents();
console.log(`Total events: ${allEvents.length}`);
```

##### `getEventsByCategory(categoryKey)`
Retrieves events filtered by category.

**Parameters:**
- `categoryKey` (string): Category key to filter by

**Returns:**
- `Array`: Array of matching events

**Example:**
```javascript
const gameDesignEvents = EventAPI.getEventsByCategory("GAME_DESIGN");
console.log(`Game Design events: ${gameDesignEvents.length}`);
```

##### `searchEvents(query)`
Searches events by title or description.

**Parameters:**
- `query` (string): Search query

**Returns:**
- `Array`: Array of matching events

**Example:**
```javascript
const searchResults = EventAPI.searchEvents("Unity");
console.log(`Unity-related events: ${searchResults.length}`);
```

##### `getFeaturedEvents()`
Retrieves featured events.

**Returns:**
- `Array`: Array of featured events

**Example:**
```javascript
const featuredEvents = EventAPI.getFeaturedEvents();
console.log(`Featured events: ${featuredEvents.length}`);
```

##### `getEventsBySpeaker(speakerId)`
Retrieves events associated with a specific speaker.

**Parameters:**
- `speakerId` (number): Speaker ID

**Returns:**
- `Array`: Array of events for the speaker

**Example:**
```javascript
const speakerEvents = EventAPI.getEventsBySpeaker(456);
console.log(`Events by speaker: ${speakerEvents.length}`);
```

### ScheduleAPI

The ScheduleAPI provides access to schedule data, which represents the overall schedule structure.

#### Methods

##### `getSchedule(scheduleId)`
Retrieves a single schedule by its ID.

**Parameters:**
- `scheduleId` (number): Unique schedule identifier

**Returns:**
- `Object|null`: Standardized schedule object or null if not found

**Example:**
```javascript
const schedule = ScheduleAPI.getSchedule(1);
if (schedule) {
  console.log(`Schedule: ${schedule.title}`);
}
```

##### `getScheduleWithFullEvents(scheduleId)`
Retrieves a schedule with full event data populated.

**Parameters:**
- `scheduleId` (number): Schedule ID

**Returns:**
- `Object|null`: Schedule object with full event data or null if not found

**Example:**
```javascript
const scheduleWithEvents = ScheduleAPI.getScheduleWithFullEvents(1);
if (scheduleWithEvents) {
  console.log(`Schedule events: ${scheduleWithEvents.sessions.length}`);
}
```

##### `getAllSchedules()`
Retrieves all schedules.

**Returns:**
- `Array`: Array of all schedule objects

**Example:**
```javascript
const allSchedules = ScheduleAPI.getAllSchedules();
console.log(`Total schedules: ${allSchedules.length}`);
```

##### `getTimeSlots(scheduleId)`
Retrieves time slots for a specific schedule.

**Parameters:**
- `scheduleId` (number): Schedule ID

**Returns:**
- `Array`: Array of time slots for the schedule

**Example:**
```javascript
const timeSlots = ScheduleAPI.getTimeSlots(1);
console.log(`Time slots: ${timeSlots.length}`);
```

##### `getEventsForTimeSlot(scheduleId, timeSlotId)`
Retrieves events for a specific time slot in a schedule.

**Parameters:**
- `scheduleId` (number): Schedule ID
- `timeSlotId` (string): Time slot ID

**Returns:**
- `Array`: Array of events for the time slot

**Example:**
```javascript
const events = ScheduleAPI.getEventsForTimeSlot(1, "slot-10-00");
console.log(`Events in time slot: ${events.length}`);
```

### SpeakerAPI

The SpeakerAPI provides access to speaker data.

#### Methods

##### `getSpeaker(speakerId)`
Retrieves a single speaker by its ID.

**Parameters:**
- `speakerId` (number): Unique speaker identifier

**Returns:**
- `Object|null`: Standardized speaker object or null if not found

**Example:**
```javascript
const speaker = SpeakerAPI.getSpeaker(123);
if (speaker) {
  console.log(`Speaker: ${speaker.displayName}`);
}
```

##### `getSpeakersByEvent(eventId)`
Retrieves speakers associated with a specific event.

**Parameters:**
- `eventId` (number): Event ID

**Returns:**
- `Array`: Array of speaker objects for the event

**Example:**
```javascript
const eventSpeakers = SpeakerAPI.getSpeakersByEvent(456);
console.log(`Speakers for event: ${eventSpeakers.length}`);
```

##### `getAllSpeakers()`
Retrieves all speakers.

**Returns:**
- `Array`: Array of all speaker objects

**Example:**
```javascript
const allSpeakers = SpeakerAPI.getAllSpeakers();
console.log(`Total speakers: ${allSpeakers.length}`);
```

##### `getFeaturedSpeakers()`
Retrieves featured speakers.

**Returns:**
- `Array`: Array of featured speakers

**Example:**
```javascript
const featuredSpeakers = SpeakerAPI.getFeaturedSpeakers();
console.log(`Featured speakers: ${featuredSpeakers.length}`);
```

##### `getSpeakersByExpertise(expertise)`
Retrieves speakers with a specific area of expertise.

**Parameters:**
- `expertise` (string): Expertise area to filter by

**Returns:**
- `Array`: Array of speakers with the specified expertise

**Example:**
```javascript
const unitySpeakers = SpeakerAPI.getSpeakersByExpertise("Unity");
console.log(`Unity experts: ${unitySpeakers.length}`);
```

### CategoryAPI

The CategoryAPI provides access to category data.

#### Methods

##### `getCategory(categoryId)`
Retrieves a single category by its ID.

**Parameters:**
- `categoryId` (number): Unique category identifier

**Returns:**
- `Object|null`: Standardized category object or null if not found

**Example:**
```javascript
const category = CategoryAPI.getCategory(123);
if (category) {
  console.log(`Category: ${category.name}`);
}
```

##### `getAllCategories()`
Retrieves all categories.

**Returns:**
- `Array`: Array of all category objects

**Example:**
```javascript
const allCategories = CategoryAPI.getAllCategories();
console.log(`Total categories: ${allCategories.length}`);
```

##### `getCategoriesWithEventCounts()`
Retrieves categories with event counts for filtering.

**Returns:**
- `Array`: Array of categories with event counts

**Example:**
```javascript
const categoriesWithCounts = CategoryAPI.getCategoriesWithEventCounts();
categoriesWithCounts.forEach(category => {
  console.log(`${category.name}: ${category.eventCount} events`);
});
```

### RoomAPI

The RoomAPI provides access to room data.

#### Methods

##### `getRoom(roomId)`
Retrieves a single room by its ID.

**Parameters:**
- `roomId` (number): Unique room identifier

**Returns:**
- `Object|null`: Standardized room object or null if not found

**Example:**
```javascript
const room = RoomAPI.getRoom(123);
if (room) {
  console.log(`Room: ${room.title}`);
}
```

##### `getAllRooms()`
Retrieves all rooms.

**Returns:**
- `Array`: Array of all room objects

**Example:**
```javascript
const allRooms = RoomAPI.getAllRooms();
console.log(`Total rooms: ${allRooms.length}`);
```

##### `getRoomsByEvent(eventId)`
Retrieves rooms associated with a specific event.

**Parameters:**
- `eventId` (number): Event ID

**Returns:**
- `Array`: Array of rooms for the event

**Example:**
```javascript
const eventRooms = RoomAPI.getRoomsByEvent(456);
console.log(`Rooms for event: ${eventRooms.length}`);
```

### StreamAPI

The StreamAPI provides access to stream data.

#### Methods

##### `getStream(streamId)`
Retrieves a single stream by its ID.

**Parameters:**
- `streamId` (number): Unique stream identifier

**Returns:**
- `Object|null`: Standardized stream object or null if not found

**Example:**
```javascript
const stream = StreamAPI.getStream(123);
if (stream) {
  console.log(`Stream: ${stream.title}`);
}
```

##### `getAllStreams()`
Retrieves all streams.

**Returns:**
- `Array`: Array of all stream objects

**Example:**
```javascript
const allStreams = StreamAPI.getAllStreams();
console.log(`Total streams: ${allStreams.length}`);
```

##### `getStreamsWithEventCounts()`
Retrieves streams with event counts for filtering.

**Returns:**
- `Array`: Array of streams with event counts

**Example:**
```javascript
const streamsWithCounts = StreamAPI.getStreamsWithEventCounts();
streamsWithCounts.forEach(stream => {
  console.log(`${stream.title}: ${stream.eventCount} events`);
});
```

##### `getEventsByStream(streamId)`
Retrieves events associated with a specific stream.

**Parameters:**
- `streamId` (number): Stream ID

**Returns:**
- `Array`: Array of events for the stream

**Example:**
```javascript
const streamEvents = StreamAPI.getEventsByStream(123);
console.log(`Events in stream: ${streamEvents.length}`);
```

### SessionTypeAPI

The SessionTypeAPI provides access to session type data.

#### Methods

##### `getSessionType(typeId)`
Retrieves a single session type by its ID.

**Parameters:**
- `typeId` (number): Unique session type identifier

**Returns:**
- `Object|null`: Standardized session type object or null if not found

**Example:**
```javascript
const sessionType = SessionTypeAPI.getSessionType(123);
if (sessionType) {
  console.log(`Session Type: ${sessionType.title}`);
}
```

##### `getAllSessionTypes()`
Retrieves all session types.

**Returns:**
- `Array`: Array of all session type objects

**Example:**
```javascript
const allSessionTypes = SessionTypeAPI.getAllSessionTypes();
console.log(`Total session types: ${allSessionTypes.length}`);
```

##### `getSessionTypesWithEventCounts()`
Retrieves session types with event counts for filtering.

**Returns:**
- `Array`: Array of session types with event counts

**Example:**
```javascript
const sessionTypesWithCounts = SessionTypeAPI.getSessionTypesWithEventCounts();
sessionTypesWithCounts.forEach(type => {
  console.log(`${type.title}: ${type.eventCount} events`);
});
```

##### `getEventsBySessionType(typeId)`
Retrieves events associated with a specific session type.

**Parameters:**
- `typeId` (number): Session type ID

**Returns:**
- `Array`: Array of events for the session type

**Example:**
```javascript
const sessionTypeEvents = SessionTypeAPI.getEventsBySessionType(123);
console.log(`Events of session type: ${sessionTypeEvents.length}`);
```

## Data Manager

The DataManager is the central coordinator for data loading, validation, and transformation. It handles:

1. Loading data from the API endpoint
2. Transforming raw API data to standardized formats
3. Populating internal data stores
4. Validating data integrity
5. Providing data to API modules

### Methods

##### `async initialize()`
Initializes the DataManager by loading and processing data from the API.

**Returns:**
- `Promise<boolean>`: True if initialization was successful

##### `isDataManagerInitialized()`
Checks if the DataManager is initialized.

**Returns:**
- `boolean`: True if initialized, false otherwise

##### `async ensureInitialized()`
Ensures the DataManager is initialized.

**Returns:**
- `Promise<boolean>`: True if initialization was successful

## Data Transformer

The DataTransformer handles conversion from the actual API structure to standardized formats. It ensures data consistency and resolves issues like speaker duplication.

### Methods

##### `transformSpeakers(apiData)`
Transforms speakers from API data, handling duplication resolution.

##### `transformCategories(apiData)`
Transforms categories from API data, standardizing them.

##### `transformRooms(apiData)`
Transforms rooms from API data, standardizing them.

##### `transformStreams(apiData)`
Transforms streams from API data, standardizing them.

##### `transformSessionTypes(apiData)`
Transforms session types from API data, standardizing them.

##### `transformEvents(apiData, speakerMap)`
Transforms sessions to standardized Event objects.

##### `transformSchedules(apiData)`
Transforms schedule days to standardized Schedule objects.

## Usage Examples

### Basic Usage

```javascript
// Get all events
const events = EventAPI.getAllEvents();
console.log(`Total events: ${events.length}`);

// Get a specific event
const event = EventAPI.getEvent(123);
if (event) {
  console.log(`Event title: ${event.title}`);
  console.log(`Event description: ${event.description}`);
}

// Get events by category
const gameDesignEvents = EventAPI.getEventsByCategory("GAME_DESIGN");
console.log(`Game Design events: ${gameDesignEvents.length}`);

// Search for events
const searchResults = EventAPI.searchEvents("Unity");
console.log(`Unity-related events: ${searchResults.length}`);
```

### Advanced Usage

```javascript
// Get all schedules with their events
const schedules = ScheduleAPI.getAllSchedules();
schedules.forEach(schedule => {
  console.log(`Schedule: ${schedule.title}`);
  console.log(`Date: ${schedule.date}`);
  
  // Get time slots for the schedule
  const timeSlots = ScheduleAPI.getTimeSlots(schedule.id);
  timeSlots.forEach(slot => {
    console.log(`  Time slot: ${slot.timeRange}`);
    
    // Get events for the time slot
    const events = ScheduleAPI.getEventsForTimeSlot(schedule.id, slot.id);
    events.forEach(event => {
      console.log(`    Event: ${event.title}`);
    });
  });
});
```

### Working with Speakers

```javascript
// Get all speakers
const speakers = SpeakerAPI.getAllSpeakers();
console.log(`Total speakers: ${speakers.length}`);

// Get a specific speaker
const speaker = SpeakerAPI.getSpeaker(123);
if (speaker) {
  console.log(`Speaker: ${speaker.displayName}`);
  console.log(`Position: ${speaker.position}`);
  console.log(`Company: ${speaker.company}`);
}

// Get speakers for an event
const eventSpeakers = SpeakerAPI.getSpeakersByEvent(456);
eventSpeakers.forEach(speaker => {
  console.log(`Speaker: ${speaker.displayName}`);
});
```

## Error Handling

All API methods include error handling to gracefully manage cases where data is missing or malformed. Methods will return appropriate default values (null for single items, empty arrays for collections) and log errors to the console.

For example:
```javascript
try {
  const event = EventAPI.getEvent(999); // Non-existent event
  if (!event) {
    console.log("Event not found");
  }
} catch (error) {
  console.error("Error retrieving event:", error);
}
```

## Testing

The API modules include comprehensive test suites to verify functionality:

1. **Unit Tests**: Test individual methods for correct behavior
2. **Integration Tests**: Verify modules work together correctly
3. **Data Validation Tests**: Ensure data integrity and consistency

To run tests, open the `api-modules-test.html` file in a browser or run the test functions directly in a JavaScript environment.

### Test Coverage

- All API methods return expected data types
- Error conditions are handled gracefully
- Data transformation produces standardized formats
- Cross-API consistency is maintained
- Performance benchmarks meet requirements

## Conclusion

The Consolidated Panels API provides a robust, standardized interface for accessing event-related data in the NZGDC widget system. By centralizing data access and transformation, it simplifies maintenance and ensures data consistency across all components.