# NZGDC Widget: Event Data API Connections Documentation

This document provides a comprehensive overview of how event data is sourced, processed, and utilized within the NZGDC widget's JavaScript files. It details the connections between the raw API data (as exemplified by `n8n-entegyapi.json`) and the various JavaScript modules responsible for handling this data.

## 1. Data Source: `n8n-entegyapi.json` (Simulated API Response)

The `n8n-entegyapi.json` file represents the structure of the data received from the external Entgy API via an N8N webhook. This JSON contains the raw, untransformed data for speakers, schedules, sessions, categories, rooms, streams, and session types.

Key top-level properties in `n8n-entegyapi.json`:

- `data`: The main data container.
  - `speakers`: Array of raw speaker objects.
      - `displayName`: Speaker's full name (✅ ENHANCED: Primary field with consistent prioritization).
      - `name`: Speaker's name fallback (used when displayName unavailable).
      - `sortName`: Speaker's name for sorting.
      - `company`: Speaker's company.
      - `position`: Speaker's job position.
      - `speakerType`: Object describing the speaker's type.
      - `copy`: Speaker's biography (can contain HTML).
      - `speakerImage`: URL to the speaker's headshot (✅ ENHANCED: Used for thumbnail fallback).
      - `id`: Unique speaker ID.
      - `web`, `email`, `phoneNumber`, `facebook`, `twitterHandle`, `linkedIn`: Contact and social media information (✅ ENHANCED: Proper protocol handling for web links).
      - `speakerSponsor`, `tags`, `documents`, `associatedSessions`, `associatedAbstracts`: Related data.
  - `schedule`: Array of schedule day objects.
    - `title`: Title of the schedule day (e.g., "Friday", "Saturday").
    - `date`: Date of the schedule day (YYYY-MM-DD format).
    - `sessions`: Array of session objects for that day.
      - `title`: Session title.
      - `subtitle`: Session subtitle.
      - `startTime`, `endTime`: Session start and end times (HH:MM format).
      - `copy`: Session description (can contain HTML).
      - `room`: Object describing the session's room.
        - `title`: Room name.
        - `capacity`: Room capacity.
        - `id`: Unique room ID.
      - `stream`: Object describing the session's stream/track.
        - `title`: Stream name (e.g., "Game Design", "Art").
        - `streamColour`: Color associated with the stream.
        - `id`: Unique stream ID.
      - `type`: Object describing the session's type (e.g., "Panel", "Workshop").
        - `title`: Type name.
        - `colour`: Color associated with the type.
        - `cellStyle`, `icon`: Styling information.
        - `id`: Unique type ID.
      - `categories`: Array of category objects (e.g., "Student", "Mid Career").
        - `name`: Category name.
        - `id`: Unique category ID.
      - `speakers`: Array of speaker objects associated with the session (can be a subset of top-level speakers).
      - `sessionThumbnail`: URL to the session's thumbnail image.
      - `id`: Unique session ID.
      - `acceptingQuestions`, `votingAndDiscussion`, `liveStreamingProviderLink`: Interactive features.
  - `categories`: Array of top-level category objects.
  - `rooms`: Array of top-level room objects.
  - `streams`: Array of top-level stream objects.
  - `sessionTypes`: Array of top-level session type objects.

## 2. Data Flow and API Connections

The data flows through several JavaScript files, each responsible for a specific part of the data processing pipeline.

### 2.1. `js/data-manager.js`

- **Role**: Centralized data loading, validation, and transformation coordinator with enhanced error handling. It acts as the single source of truth for all event-related data within the widget.
- **Input**: Raw JSON data from the API (or local file).
- **Output**: Standardized data stored in internal `Map` objects with comprehensive validation (`rawData.events`, `rawData.speakers`, etc.).
- **Connections**:
    - **`loadApiData()`**: Fetches data.
        - **`this.config.webhookUrl`**: (Primary) Connects to the N8N webhook URL to fetch the `n8n-entegyapi.json` content.
        - **`this.config.localDataPath`**: (Fallback/Local Dev) Reads `n8n-entegyapi.json` from the local file system.
    - **`transformApiData(apiData)`**: Passes raw data to `DataTransformer`.
    - **`populateDataStores(transformedData)`**: Stores the standardized data in `Map` objects for efficient lookup.
    - **`getEventData()`, `getSpeakerData()`, etc.**: Provides getter methods for other modules to access standardized data.
    - **`initialize()`, `refreshData()`**: Public methods to control data loading and refreshing.

### 2.2. `js/data-transformer.js`

- **Role**: Converts raw API data into a standardized, consistent format used throughout the widget. Handles data cleaning, normalization, and resolving inconsistencies (e.g., duplicate speaker entries).
- **Input**: Raw API data (from `DataManager`).
- **Output**: Arrays and Maps of standardized data objects (e.g., `_standardizeSpeaker`, `_standardizeEvent`).
- **Connections**:
    - **`transformSpeakers(apiData)`**: Extracts and standardizes speaker data with enhanced field mapping from `apiData.data.speakers` and `apiData.data.schedule[].sessions[].speakers`.
        - **`_standardizeSpeaker(speaker)`**: Maps raw speaker fields to standardized properties with corrected field prioritization and validation:
            - `displayName` → `displayName` (✅ FIXED: Primary field consistently prioritized)
            - `displayName` → `name` (for widget compatibility, fallback to `name` field if displayName unavailable)
            - `position` + `company` → `position` (✅ ENHANCED: Combined as "Position at Company" with proper formatting)
            - `speakerImage` → `headshot` (✅ ENHANCED: Used for event thumbnail fallback when event.thumbnail unavailable)
            - `web` → `website` (✅ FIXED: Proper protocol handling for external links)
            - `email` → `email` (preserved with mailto link generation)
            - `copy` → `bio` (HTML stripped with enhanced cleaning)
    - **`transformCategories(apiData)`**: Extracts and standardizes category data from `apiData.data.categories`.
        - **`_standardizeCategory(category)`**: Maps `name` to `name` and generates a `key` (e.g., "Game Design" -> "GAME_DESIGN").
    - **`transformRooms(apiData)`**: Extracts and standardizes room data from `apiData.data.rooms` and `apiData.data.schedule[].sessions[].room`.
        - **`_standardizeRoom(room)`**: Maps `title` and `capacity`.
    - **`transformStreams(apiData)`**: Extracts and standardizes stream data from `apiData.data.streams` and `apiData.data.schedule[].sessions[].stream`.
        - **`_standardizeStream(stream)`**: Maps `title` and `streamColour`.
    - **`transformSessionTypes(apiData)`**: Extracts and standardizes session type data from `apiData.data.sessionTypes` and `apiData.data.schedule[].sessions[].type`.
        - **`_standardizeSessionType(sessionType)`**: Maps `title`, `colour`, `cellStyle`, `icon`.
    - **`transformEvents(apiData, speakerMap)`**: Processes `apiData.data.schedule` to create standardized event objects.
        - **`_standardizeEvent(session, speakerMap, scheduleDate)`**: Core transformation for sessions with enhanced error handling. It links speakers using the `speakerMap`, combines `scheduleDate` with `startTime`/`endTime` to create `Date` objects (✅ FIXED: Handles missing endTime gracefully), and cleans HTML from `copy` into `description`. It also maps `session.stream.title` to `category` and `categoryKey` for visual filtering with dynamic CSS class generation.
    - **`transformSchedules(apiData)`**: Processes `apiData.data.schedule` to create standardized schedule day objects.
        - **`_standardizeSchedule(scheduleDay)`**: Maps `title`, `date`, and includes raw `sessions` array.
    - **`_stripHtmlTags(htmlString)`**: Utility to remove HTML from text fields (e.g., `copy` in speakers/sessions).

### 2.3. `js/speaker-api.js`, `js/event-api.js`, `js/category-api.js`, `js/room-api.js`, `js/stream-api.js`, `js/session-type-api.js`, `js/schedule-api.js`

- **Role**: Provide a clean, centralized API for accessing specific types of data with enhanced error handling. These APIs abstract away the underlying `DataManager` implementation.
- **Input**: Requests for specific data entities (e.g., `getSpeaker(id)`, `getAllEvents()`).
- **Output**: Standardized data objects or arrays with validation and fallbacks.
- **Connections**:
    - All these API files directly call `getDataManager()` to retrieve the singleton `DataManager` instance.
    - They then use `DataManager`'s getter methods (e.g., `dataManager.getSpeaker(id)`, `dataManager.getAllEvents()`) to fulfill requests.
    - ✅ ENHANCED: This layer ensures consistent data structure and provides graceful error handling when data is unavailable.
    - ✅ NOTE: These API files exist for architectural completeness but are currently not loaded by the widget loaders - the widget cores access DataManager directly for improved performance.

### 2.4. `js/widget-core.js` (and `js/friday-saturday-widget-core.js`)

- **Role**: Main entry point for the Thursday (and Friday/Saturday) schedule widget with enhanced view switching and filter coordination. Orchestrates the rendering of the schedule and applies filters with support for both legacy and dynamic layouts.
- **Input**: DOM container ID, options, and optionally a `DataManager` instance.
- **Output**: Renders the HTML structure of the schedule with dynamic time organization and improved error handling.
- **Connections**:
    - **`initialize()`**:
        - Can receive a `dataManager` instance in its constructor. If not provided, it falls back to global `window.SCHEDULE_DATA` and `window.WORKSHOP_EVENTS` (which are static JSON files, now largely superseded by `DataManager`).
        - Instantiates `ScheduleGenerator` (or `MorningScheduleGenerator`/`AfternoonScheduleGenerator` for Friday/Saturday).
    - **`initializeSchedule()`**:
        - Retrieves `scheduleData` and `eventData` from `this.dataManager` (or fallback static data).
        - Passes this data to `scheduleGenerator.renderSchedule()`.
    - **`applyFilter(categoryKey)`**: ✅ ENHANCED: Calls `scheduleGenerator.filterEventsByCategory(categoryKey)` with support for both legacy and dynamic layouts.
    - **`clearFilter()`**: ✅ ENHANCED: Calls `scheduleGenerator.resetFilter()` with proper state restoration.
    - **`updateFilterValueText(categoryName)`**: Updates the UI based on the selected filter with improved accessibility.
    - **`getAvailableCategories()`**: Uses `this.dataManager.getEventData()` to determine which categories are present in the data.
    - **`switchToView(viewName)`** (Friday/Saturday): ✅ ENHANCED: Seamless view switching with filter state preservation and proper DOM management.

### 2.5. `js/schedule-generator.js` (and `js/morning-schedule-generator.js`, `js/afternoon-schedule-generator.js`)

- **Role**: Renders the schedule HTML with dynamic time organization and enhanced error handling. Manages event panel loading with improved speaker field mapping.
- **Input**: DOM container, `scheduleData` (time slots structure), and `eventData` (detailed event objects).
- **Output**: Populated HTML within its container with dynamic time blocks and proper spacing/layout.
- **Connections**:
    - **`renderSchedule(scheduleData, eventData)`**:
        - ✅ ENHANCED: Stores `scheduleData` and `eventData` internally with validation and error handling.
        - ✅ ENHANCED: Uses ScheduleTimeManager for dynamic time organization when available, falls back to static timeSlots.
        - ✅ ENHANCED: Generates semantic CSS classes for time categories based on actual event data.
        - Calls `generateWorkshopEvent(workshop)` (or `generateMorningEvent`/`generateAfternoonEvent`) with proper ID + Class separation.
        - Calls `loadWorkshopContent()` (or `loadEventContent`) with enhanced speaker field mapping.
    - **`loadWorkshopContent()` / `loadEventContent()`**:
        - Finds all event panel placeholders in the DOM.
        - Calls `loadSingleWorkshop(container)` / `loadSingleEvent(container)` for each.
    - **`loadSingleWorkshop(container)` / `loadSingleEvent(container)`**:
        - ✅ ENHANCED: Retrieves detailed event data using `this.eventData[eventId]` with validation and error handling.
        - ✅ ENHANCED: Instantiates `UnifiedEventLoader` and calls `createEventPanel()` with enhanced speaker mapping and thumbnail fallback behavior.
    - **`filterEventsByCategory(categoryKey)`**, **`resetFilter()`**: ✅ ENHANCED: Applies/resets visual filters with support for both legacy and dynamic layouts, using appropriate selectors for different time container structures.

### 2.6. `js/unified-event-loader.js`

- **Role**: Creates and updates the actual HTML structure for individual event panels with enhanced speaker field mapping and thumbnail fallback behavior (both "big" and "main" types).
- **Input**: `eventData` (a single, detailed event object), `eventType` ("big" or "main"), `widgetType` (e.g., "schedule", "thursday", "morning").
- **Output**: An HTML `div` element representing an event panel with proper ID + Class separation of concerns.
- **Connections**:
    - **`loadTemplate()`**: Fetches `unified-event-panel.html` (or uses an embedded fallback) which contains the base HTML structure for panels.
    - **`createEventPanel(eventData, eventType, widgetType)`**:
        - Determines if it's a "big" or "main" panel.
        - Calls `createBigEventPanel()` or `createMainEventPanel()`.
        - **`validateCategoryData(eventData)`**: Maps `eventData.category` or `eventData.categoryKey` to a standardized category key and display name (e.g., "Game Design" -> "GAME_DESIGN"). This is crucial for applying category-specific styling and filtering.
    - **`updateBigEventContent(clone, eventData, widgetType)` / `updateMainEventContent(mainPanel, eventData, widgetType)`**: ✅ ENHANCED: Populates the panel's HTML elements with corrected speaker field mapping:
        - `displayName` → `.nzgdc-speaker-bioName-big` and `.nzgdc-speaker-name-main` (primary field)
        - `name` → fallback when displayName unavailable
        - `position` (combined) → `.nzgdc-speaker-bioPosition-big` and `.nzgdc-speaker-position-company-main`
        - `headshot` → Used as thumbnail fallback when `eventData.thumbnail` is unavailable
        - ✅ ENHANCED: Sets correct `data-category` attribute and implements ID + Class pattern for maintainability.
    - **`setupSpeakerDetailsHover(eventPanel, eventData)`**: Attaches event listeners to the panel to show expanded event details on click.
        - **`window.ExpandedEventDetailsManager.showEventDetails(eventData, source)`**: ✅ ENHANCED: This critical connection passes the detailed `eventData` with enhanced speaker mapping to the `ExpandedEventDetailsManager` for displaying the full event overlay with comprehensive contact information.

### 2.7. `js/expanded-event-details-manager.js`

- **Role**: Manages the lifecycle and content of the expanded event details overlay (modal) with enhanced speaker contact integration.
- **Input**: Detailed `eventData` (from `UnifiedEventLoader`) with standardized speaker field mapping.
- **Output**: Renders a full-screen modal with comprehensive event and speaker details including contact information.
- **Connections**:
    - **`showEventDetails(eventData, sourceWidget)`**:
        - Receives the `eventData` object (which is already in the standardized format from `DataTransformer`).
        - **`populateEventContent(eventData)`**: Populates various sections of the modal:
            - `populateTitle(eventData.title)`
            - `populateSpeakersList(eventData.speakers)`
            - `populateDescription(eventData.description)`
            - `populateAudienceTags(eventData.audienceTags)`: Uses `eventData.audienceTags` (or `eventData.categories`) to display audience information.
            - `populateSpeakerBios(eventData.speakers)`: ✅ ENHANCED: Iterates through `eventData.speakers` with corrected field mapping:
                - `displayName` → `.nzgdc-expanded-speaker-name` and `.nzgdc-speaker-name-item`
                - `position` → `.nzgdc-expanded-speaker-position`
                - `headshot` → `.nzgdc-speaker-headshot` (with placeholder fallback)
                - `email` → `.nzgdc-contact-email` (mailto links)
                - `website` → `.nzgdc-contact-website` (external links with protocol handling)
        - **`adaptEventData(eventData)`**: Ensures consistency, handling slight variations in `eventData` properties.
        - **`adaptSpeakerData(speakers)`**: ✅ ENHANCED: Ensures consistency for speaker sub-objects with corrected field prioritization, mapping various raw speaker properties to standardized ones with proper contact information integration.

## 3. Data Flow Summary

1. **Raw Data In**: `n8n-entegyapi.json` (via webhook or local file) contains all raw event, speaker, and schedule data.
2. **Centralized Management**: `js/data-manager.js` loads this raw data with enhanced validation and error handling.
3. **Standardization**: `js/data-transformer.js` processes the raw data into a consistent, standardized format with corrected speaker field mapping, resolving duplicates and cleaning text.
4. **~~API Access~~**: ✅ NOTE: `js/speaker-api.js`, `js/event-api.js`, etc., exist for architectural completeness but are not loaded by widget loaders - widgets directly access DataManager for performance.
5. **Widget Orchestration**: `js/widget-core.js` (and `js/friday-saturday-widget-core.js`) initializes the schedule rendering process with enhanced view switching and filter coordination. It retrieves `scheduleData` and `eventData` from the `DataManager`.
6. **Dynamic Time Organization**: ✅ NEW: `js/schedule-time-manager.js` intelligently groups events by actual API `startTime`/`endTime` and generates semantic CSS classes for time categories.
7. **Schedule Rendering**: `js/schedule-generator.js` (and `js/morning-schedule-generator.js`, `js/afternoon-schedule-generator.js`) uses dynamic time organization to build the overall HTML layout with proper ID + Class separation, then requests detailed `eventData` for each panel.
8. **Panel Creation**: `js/unified-event-loader.js` takes individual `eventData` objects and renders event panels with ✅ ENHANCED speaker field mapping:
   - `displayName` prioritized over `name` fallback
   - `headshot` used for thumbnail fallback when event thumbnails unavailable
   - `position` properly formatted and displayed
   - `email` and `website` with proper contact link generation
   - ID + Class pattern for maintainable architecture
9. **Expanded Details**: When event panels are clicked, `js/expanded-event-details-manager.js` displays comprehensive modals with ✅ ENHANCED speaker contact integration including mailto links and website links with protocol handling.

This enhanced systemic approach ensures data consistency, improved error handling, dynamic time organization, and comprehensive speaker field mapping across the NZGDC widget.

---
---

# Understanding the Widget's Data Functions

The NZGDC widget processes a lot of event data, and it uses many specialized functions to handle everything from fetching raw information to displaying it beautifully. Think of these functions as little workers, each with a specific job in the data factory.

### 1. Functions in `js/data-manager.js` (The Data Coordinator)

This file is like the central hub for all event data. It's responsible for getting the data, making sure it's in the right format, and storing it so other parts of the widget can use it.

*   **`initialize()`**
    *   **What it does:** This is the "startup" button for the data system. When you call it, it kicks off the entire process of loading and preparing all the event information.
    *   **Why it's important:** Nothing else can happen with the data until this function successfully completes its job.
    *   **Input:** None (it uses internal configuration).
    *   **Output:** A confirmation that the data system is ready.

*   **`loadApiData()`**
    *   **What it does:** This function goes out and fetches the raw event data. It can either grab it from a live online source (like the N8N webhook) or load it from a local file (like your `n8n-entegyapi.json` for testing).
    *   **Why it's important:** It's the first step in getting any data into the system.
    *   **Input:** None (it uses internal configuration for the data source).
    *   **Output:** The raw, unprocessed event data, straight from the source.

*   **`transformApiData(apiData)`**
    *   **What it does:** Once `loadApiData()` brings in the raw data, this function hands it over to a specialized "transformer" (from `data-transformer.js`). Its job is to make sure the raw data is cleaned up and put into a consistent, easy-to-use format for the rest of the widget.
    *   **Why it's important:** Raw data can be messy! This function ensures everything is standardized, so all parts of the widget understand it.
    *   **Input:** The raw event data.
    *   **Output:** The same event data, but now neatly organized and standardized.

*   **`populateDataStores(transformedData)`**
    *   **What it does:** After the data is transformed, this function takes that clean data and carefully stores it in various internal "storage bins" (called `Map` objects). There are separate bins for speakers, events, schedules, etc.
    *   **Why it's important:** It makes sure all the data is easily accessible and quickly retrievable by other functions.
    *   **Input:** The cleaned and transformed event data.
    *   **Output:** None (it updates the internal storage).

*   **`getEventData()`, `getSpeakerData()`, `getScheduleData()`, etc.**
    *   **What they do:** These are "getter" functions. They simply provide other parts of the widget with access to specific types of data that have been stored. For example, `getSpeakerData()` gives you all the speaker information.
    *   **Why they're important:** They are the public interface for accessing the data, keeping the internal storage details hidden.
    *   **Input:** None.
    *   **Output:** The requested set of standardized data (e.g., all events, all speakers).

*   **`refreshData()`**
    *   **What it does:** This is like hitting the "reset and reload" button. It tells the data manager to go fetch the latest data again, process it, and update all its internal storage.
    *   **Why it's important:** If the source data changes, this function ensures the widget displays the most up-to-date information.
    *   **Input:** None.
    *   **Output:** A confirmation that the data has been refreshed.

### 2. Functions in `js/data-transformer.js` (The Data Cleaner & Standardizer)

This file is the "data processing plant." It takes the raw, sometimes inconsistent, data from the source and transforms it into a uniform format that the rest of the widget expects.

*   **`transformSpeakers(apiData)`**
    *   **What it does:** ✅ ENHANCED: This function specifically focuses on speaker information with corrected field prioritization. It extracts speaker details from different places in the raw data, cleans them up, and combines relevant fields with proper `displayName` → `name` fallback logic and enhanced contact field mapping.
    *   **Why it's important:** Ensures all speaker profiles are consistent with reliable field mapping, no matter where they appeared in the raw data.
    *   **Input:** The raw event data.
    *   **Output:** A standardized list of speaker objects with corrected field prioritization.

*   **`transformEvents(apiData, speakerMap)`**
    *   **What it does:** This is a big one! It goes through all the sessions listed in the raw schedule, extracts their details (like title, time, description), and links them up with the correct speaker information (using the `speakerMap` created earlier). It also cleans up HTML from descriptions.
    *   **Why it's important:** It creates the core "event" objects that represent each session, ready to be displayed.
    *   **Input:** The raw event data and the standardized speaker list.
    *   **Output:** A standardized list of event (session) objects.

*   **`_standardizeSpeaker(speaker)`, `_standardizeEvent(session, ...)`, `_standardizeCategory(...)`, etc.**
    *   **What they do:** These are helper functions (indicated by the underscore `_` at the beginning, meaning they're usually used internally). Each one takes a single raw data item (like a raw speaker object or a raw session object) and converts it into the widget's predefined, clean format. They map specific fields, combine data, and handle missing information.
    *   **Why they're important:** They enforce the strict data format that the widget relies on, ensuring consistency.
    *   **Input:** A single raw data object (e.g., one speaker's raw data).
    *   **Output:** A single, neatly formatted data object (e.g., one standardized speaker).

*   **`_stripHtmlTags(htmlString)`**
    *   **What it does:** This is a utility function that removes any HTML code (like `<p>` or `<span>` tags) from text strings. This is useful for cleaning up descriptions or bios that might come with formatting from the API.
    *   **Why it's important:** Ensures that text displays as plain text, preventing unexpected formatting issues.
    *   **Input:** A string that might contain HTML.
    *   **Output:** The same string, but with all HTML tags removed.

### 3. Functions in `js/speaker-api.js`, `js/event-api.js`, `js/category-api.js`, etc. (The Data Accessors)

These files provide simple, direct ways for other parts of the widget to ask for specific pieces of data without needing to know how that data is stored or processed internally.

*   **`getSpeaker(speakerId)`**
    *   **What it does:** If you know a speaker's unique ID, this function will fetch all the standardized details for that specific speaker.
    *   **Why it's important:** Allows quick access to individual speaker profiles.
    *   **Input:** A speaker's ID.
    *   **Output:** The standardized speaker object, or `null` if not found.

*   **`getAllEvents()`**
    *   **What it does:** This function gives you a complete list of all the standardized event (session) objects that the widget knows about.
    *   **Why it's important:** Provides a comprehensive list of all sessions.
    *   **Input:** None.
    *   **Output:** An array containing all standardized event objects.

*   **`getEventsByCategory(categoryKey)`**
    *   **What it does:** This function filters the list of all events and gives you only those that belong to a specific category (like "Game Design" or "Audio").
    *   **Why it's important:** Used for filtering the displayed schedule based on user selections.
    *   **Input:** A category key (e.g., "GAME_DESIGN").
    *   **Output:** An array of standardized event objects matching that category.

### 4. Functions in `js/widget-core.js` (The Main Conductor)

This is the main brain of the widget that brings everything together. It sets up the display, tells other parts what to do, and responds to user interactions.

*   **`initialize()`**
    *   **What it does:** This is the "master startup" for the entire widget. It finds where the widget should live on the webpage, sets up its basic structure, and then tells the `ScheduleGenerator` to start building the schedule display.
    *   **Why it's important:** It's the entry point that gets the whole widget up and running.
    *   **Input:** None.
    *   **Output:** The widget is rendered and ready.

*   **`initializeGenerators()`**
    *   **What it does:** This function creates the specific "generator" objects (`MorningScheduleGenerator`, `AfternoonScheduleGenerator`) that are responsible for building the visual layout of the morning and afternoon schedules.
    *   **Why it's important:** It prepares the tools needed to draw the schedule on the screen.
    *   **Input:** None.
    *   **Output:** Generator objects are ready.

*   **`loadView(viewName)`** (e.g., `loadMorningView()`, `loadAfternoonView()`)
    *   **What it does:** These functions are responsible for loading and displaying either the morning or afternoon part of the schedule. They get the relevant data and pass it to the correct generator to render.
    *   **Why it's important:** They manage which part of the schedule is currently visible to the user.
    *   **Input:** The name of the view to load (e.g., "morning").
    *   **Output:** The specified schedule view is rendered on the webpage.

*   **`switchToView(viewName)`**
    *   **What it does:** This function handles the actual visual change when a user clicks between "Morning Events" and "Afternoon Events." It hides one view and shows the other.
    *   **Why it's important:** Provides the interactive switching functionality.
    *   **Input:** The name of the view to switch to.
    *   **Output:** The widget's display changes to the requested view.

*   **`applyFilter(categoryKey, categoryName, viewType)`**
    *   **What it does:** When a user selects a filter (like "Game Design"), this function tells the active schedule generator to apply that filter, which visually highlights matching events and greys out others. It also updates the filter display text.
    *   **Why it's important:** Implements the interactive filtering of events.
    *   **Input:** The selected category's key and display name, and which view (morning/afternoon) it applies to.
    *   **Output:** The displayed schedule is filtered.

### 5. Functions in `js/schedule-generator.js` (The Schedule Builder)

This file (and its morning/afternoon specific versions) is the "layout artist." It takes the standardized event data and arranges it into the visual schedule that users see.

*   **`renderSchedule(scheduleData, eventData)`**
    *   **What it does:** This is the main function that builds the entire schedule display. It takes the structured `scheduleData` (which defines time slots) and the detailed `eventData` (for each individual session) and uses them to create all the HTML elements for the schedule.
    *   **Why it's important:** It's responsible for generating the entire visual layout of the schedule.
    *   **Input:** The structured schedule data and detailed event data.
    *   **Output:** The complete schedule HTML is added to the webpage.

*   **`generateTimeSlot(timeSlot)`**
    *   **What it does:** This function creates the HTML for a single time block in the schedule (e.g., "10.00am - 10.30am: Early Morning Panels"). It also calls other functions to fill that time slot with individual event panels.
    *   **Why it's important:** It structures the schedule into logical time segments.
    *   **Input:** Data for a single time slot.
    *   **Output:** HTML for a time slot block.

*   **`generateEventRows(events)`**
    *   **What it does:** Within a time slot, this function arranges the individual event panels into rows. It handles different layouts, like having two "big" panels or five "main" panels per row.
    *   **Why it's important:** It organizes the events neatly within each time slot.
    *   **Input:** A list of event objects for a specific time slot.
    *   **Output:** HTML for rows of event panels.

*   **`generateMorningEvent(event)` / `generateAfternoonEvent(event)` / `generateWorkshopEvent(event)`**
    *   **What they do:** These functions create the basic HTML placeholder for a single event panel. They include a unique ID so that the `UnifiedEventLoader` can later fill in the detailed content.
    *   **Why they're important:** They lay out the empty boxes for each event before the detailed content is loaded.
    *   **Input:** A single event object.
    *   **Output:** Basic HTML for an event panel placeholder.

*   **`loadEventContent()` / `loadWorkshopContent()`**
    *   **What they do:** After the basic schedule structure is on the page, these functions go back and fill in the detailed content for each event panel. They find all the placeholders and tell the `UnifiedEventLoader` to populate them.
    *   **Why they're important:** This is where the actual event details (titles, speakers, thumbnails) appear on the screen.
    *   **Input:** None (it scans the already rendered HTML).
    *   **Output:** The event panels are filled with content.

*   **`filterEventsByCategory(categoryKey)`**
    *   **What it does:** This function is called when a filter is applied. It goes through all the event panels and adds a special CSS class to those that *don't* match the selected category, making them appear greyed out.
    *   **Why it's important:** It visually applies the filtering effect.
    *   **Input:** The selected category's key.
    *   **Output:** Event panels are visually filtered.

*   **`resetFilter()`**
    *   **What it does:** This function removes any active filters, making all event panels visible again.
    *   **Why it's important:** It clears the filtering effect.
    *   **Input:** None.
    *   **Output:** All event panels are fully visible.

### 6. Functions in `js/unified-event-loader.js` (The Panel Renderer)

This file is the "detail painter." It's responsible for creating the actual visual appearance of each individual event panel, whether it's a large "big" panel or a smaller "main" panel.

*   **`loadTemplate()`**
    *   **What it does:** This function fetches the base HTML structure (a template) for event panels. It tries to load it from an external file first, but has a built-in backup if that fails.
    *   **Why it's important:** It ensures the widget has the blueprint for creating event panels.
    *   **Input:** None.
    *   **Output:** The HTML template for event panels is loaded.

*   **`createEventPanel(eventData, eventType, widgetType)`**
    *   **What it does:** This is the main function for creating an event panel. It takes all the detailed information for one event and uses the loaded template to build a complete HTML element for it. It can automatically decide if the panel should be "big" or "main" based on the event data.
    *   **Why it's important:** It's the factory for all individual event display boxes.
    *   **Input:** One standardized event object, the desired panel type, and the type of widget it's for.
    *   **Output:** A fully constructed HTML element for an event panel.

*   **`updateBigEventContent(...)` / `updateMainEventContent(...)`**
    *   **What they do:** ✅ ENHANCED: These functions take an existing event panel HTML element and fill it with the specific details using corrected speaker field mapping:
        - `displayName` → `.nzgdc-speaker-bioName-big` and `.nzgdc-speaker-name-main` (✅ FIXED: Primary field)
        - `name` → Fallback when displayName unavailable (✅ FIXED: Proper fallback logic)
        - `position` (combined) → `.nzgdc-speaker-bioPosition-big` and `.nzgdc-speaker-position-company-main`
        - `headshot` → ✅ ENHANCED: Used as thumbnail fallback when `eventData.thumbnail` is unavailable
        - ID + Class separation for maintainable architecture
    *   **Why they're important:** ✅ ENHANCED: They ensure consistent speaker data display with reliable field prioritization and provide comprehensive fallback behavior.
    *   **Input:** An HTML element representing an event panel, and the standardized event data.
    *   **Output:** The HTML element is updated with enhanced speaker field mappings and proper separation of concerns.

*   **`setupSpeakerDetailsHover(eventPanel, eventData)`**
    *   **What it does:** This function makes the event panels interactive. It adds special behaviors so that when you hover over a panel, an overlay appears, and when you click it, a larger "expanded details" modal pops up.
    *   **Why it's important:** It provides the user experience for exploring event details.
    *   **Input:** An event panel HTML element and its corresponding event data.
    *   **Output:** The event panel becomes interactive.

### 7. Functions in `js/expanded-event-details-manager.js` (The Modal Display)

This file is dedicated to handling the large pop-up window that shows all the detailed information about an event when you click on its panel.

*   **`showEventDetails(eventData, sourceWidget)`**
    *   **What it does:** This is the main function that opens the detailed event modal. It first makes sure the modal's HTML structure is loaded, then takes the detailed `eventData` and populates all the fields in the modal (like the full description, all speakers, and their bios).
    *   **Why it's important:** It provides the comprehensive view of an event.
    *   **Input:** The full standardized event object, and where the click came from.
    *   **Output:** A full-screen modal displaying event details.

*   **`populateEventContent(eventData)`**
    *   **What it does:** This function is responsible for filling all the different sections of the modal with the correct information from the `eventData` (e.g., setting the main title, listing speakers, showing the synopsis, and adding audience tags).
    *   **Why it's important:** It ensures all the detailed information is correctly displayed in the modal.
    *   **Input:** The standardized event data.
    *   **Output:** The modal's content is updated.

*   **`populateSpeakerBios(speakers)`**
    *   **What it does:** ✅ ENHANCED: This function creates detailed speaker bio cards in the expanded modal with corrected field mapping and comprehensive contact integration:
        - `displayName` → `.nzgdc-expanded-speaker-name` and `.nzgdc-speaker-name-item` (✅ FIXED: Primary field prioritized)
        - `name` → Fallback when displayName unavailable (✅ FIXED: Proper fallback logic)
        - `position` (combined) → `.nzgdc-expanded-speaker-position` (✅ ENHANCED: Proper formatting)
        - `headshot` → `.nzgdc-speaker-headshot` (✅ ENHANCED: Enhanced fallback behavior)
        - `email` → `.nzgdc-contact-email` (✅ ENHANCED: Mailto link generation)
        - `website` → `.nzgdc-contact-website` (✅ ENHANCED: External link with proper protocol handling)
    *   **Why it's important:** ✅ ENHANCED: It provides comprehensive speaker information with reliable field mapping and robust contact integration including proper link generation and protocol handling.
    *   **Input:** An array of standardized speaker objects with corrected field mapping.
    *   **Output:** Complete speaker bio cards with enhanced contact information and proper field prioritization are added to the modal.

*   **`hideEventDetails()`**
    *   **What it does:** This function closes the detailed event modal. It hides the modal and cleans up the webpage (like restoring scrolling).
    *   **Why it's important:** It allows users to close the modal and return to the main schedule view.
    *   **Input:** None.
    *   **Output:** The modal is closed.

---
