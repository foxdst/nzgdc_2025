# ACTUAL API STRUCTURE ANALYSIS

## Overview

This document provides a comprehensive analysis of the actual data structure in the `n8n-entegyapi.json` file, comparing it with the planned architecture in `EVENTS_SCHEDULE_API_ARCHITECTURE_PLAN.md`. This analysis will help identify where the architecture plan needs to be adapted to handle the actual API data structures.

## 1. Main Data Entities in the Actual API

Based on the analysis of the JSON structure, the actual API contains the following main data entities:

### 1.1 Speakers
- **Description**: Individuals who present at sessions/events
- **Location**: Top-level array in the data object
- **Count**: 141 speakers in the dataset

### 1.2 Schedule Days
- **Description**: Days in the conference schedule (appears to be 3 days based on array length)
- **Location**: Array within the schedule object
- **Count**: 3 schedule days

### 1.3 Sessions
- **Description**: Individual sessions/events within each schedule day
- **Location**: Array within each schedule day object
- **Nested within**: Schedule Days

### 1.4 Categories
- **Description**: Classification tags for sessions
- **Location**: Array within each session object
- **Nested within**: Sessions

### 1.5 Rooms
- **Description**: Physical locations where sessions take place
- **Location**: Object within each session object
- **Nested within**: Sessions

### 1.6 Streams
- **Description**: Thematic tracks or topics for sessions
- **Location**: Object within each session object
- **Nested within**: Sessions

### 1.7 Session Types
- **Description**: Classification of session formats (e.g., Presentation, Panel)
- **Location**: Object within each session object
- **Nested within**: Sessions

## 2. Properties of Each Entity Type

### 2.1 Speaker Entity Properties

```json
{
  "id": number,
  "displayName": string,
  "sortName": string,
  "company": string,
  "position": string,
  "copy": string (HTML content, biography),
  "phoneNumber": string/null,
  "email": string,
  "web": string/null,
  "address": string/null,
  "facebook": string/null,
  "twitterHandle": string/null,
  "linkedIn": string/null,
  "speakerImage": string (URL),
  "parentModuleType": string,
  "parentModuleId": number,
  "externalReference": string,
  "unmappedStrings": null,
  "moduleType": string,
  "templateName": null,
  "isStatic": boolean,
  "isSingleton": boolean,
  "pageSettings": null,
  "speakerType": object/null,
  "speakerSponsor": null,
  "tags": null,
  "documents": null,
  "associatedSessions": null,
  "associatedAbstracts": null
}
```

### 2.2 Schedule Day Entity Properties

```json
{
  "id": number,
  "title": string,
  "date": string (ISO date format),
  "sessions": array,
  "sessionGroups": array,
  "meetingBlocks": array,
  "parentModuleType": string,
  "parentModuleId": number,
  "externalReference": string,
  "unmappedStrings": null,
  "moduleType": string,
  "templateName": null,
  "isStatic": boolean,
  "isSingleton": boolean,
  "pageSettings": null
}
```

### 2.3 Session Entity Properties

```json
{
  "id": number,
  "title": string,
  "subtitle": string,
  "startTime": string (HH:MM format),
  "endTime": string (HH:MM format),
  "copy": string (HTML content, description),
  "room": object,
  "stream": object,
  "type": object,
  "categories": array,
  "speakers": array,
  "sessionThumbnail": string/null (URL),
  "parentModuleType": string,
  "parentModuleId": number,
  "externalReference": string,
  "unmappedStrings": null,
  "moduleType": string,
  "templateName": null,
  "isStatic": boolean,
  "isSingleton": boolean,
  "pageSettings": null,
  "submissionForm": null,
  "tags": null,
  "featuredSpeaker": null,
  "speakerRoles": string (JSON object as string),
  "documents": null,
  "liveStreamingProviderLink": null,
  "liveStreamProviderType": string,
  "useFeaturedSpeakerAsIcon": boolean,
  "sessionSponsor": null,
  "acceptingQuestions": boolean,
  "votingAndDiscussion": boolean,
  "capacity": number,
  "disableEditingInSpeakerPortal": boolean,
  "denyMultipleScans": boolean,
  "sessionSegments": array,
  "interactiveSessionQuestions": null
}
```

### 2.4 Category Entity Properties

```json
{
  "name": string,
  "parentModuleType": string,
  "id": number,
  "parentModuleId": number,
  "externalReference": null,
  "unmappedStrings": null,
  "moduleType": string,
  "templateName": null,
  "isStatic": boolean,
  "isSingleton": boolean,
  "pageSettings": null
}
```

### 2.5 Room Entity Properties

```json
{
  "title": string,
  "capacity": number,
  "parentModuleType": string,
  "id": number,
  "parentModuleId": number,
  "externalReference": null,
  "unmappedStrings": null,
  "moduleType": string,
  "templateName": null,
  "isStatic": boolean,
  "isSingleton": boolean,
  "pageSettings": null
}
```

### 2.6 Stream Entity Properties

```json
{
  "title": string,
  "streamColour": string,
  "parentModuleType": string,
  "id": number,
  "parentModuleId": number,
  "externalReference": null,
  "unmappedStrings": null,
  "moduleType": string,
  "templateName": null,
  "isStatic": boolean,
  "isSingleton": boolean,
  "pageSettings": null
}
```

### 2.7 Session Type Entity Properties

```json
{
  "title": string,
  "colour": string,
  "parentModuleType": string,
  "id": number,
  "parentModuleId": number,
  "externalReference": null,
  "unmappedStrings": null,
  "moduleType": string,
  "templateName": null,
  "isStatic": boolean,
  "isSingleton": boolean,
  "pageSettings": null,
  "cellStyle": null,
  "icon": null
}
```

## 3. Entity Relationships

### 3.1 Direct Relationships

1. **Schedule Days → Sessions**: Each schedule day contains an array of sessions
2. **Sessions → Speakers**: Each session contains an array of speaker objects
3. **Sessions → Categories**: Each session contains an array of category objects
4. **Sessions → Room**: Each session contains a single room object
5. **Sessions → Stream**: Each session contains a single stream object
6. **Sessions → Session Type**: Each session contains a single session type object

### 3.2 Indirect Relationships

1. **Top-level Speakers → Sessions**: While speakers exist as a top-level array, they are also embedded within sessions, creating a potential for data duplication or inconsistency
2. **Categories across Sessions**: Categories are embedded within sessions rather than being a top-level entity, which may require aggregation for global category operations

## 4. Nested Structures and Complex Relationships

### 4.1 Speaker Duplication
Speakers exist both as a top-level array and as embedded objects within sessions. This creates a potential for data inconsistency if the embedded speaker objects and top-level speaker objects are not kept in sync.

### 4.2 Session Content Structure
Sessions contain rich HTML content in the "copy" field, which provides detailed descriptions of the sessions. This is more comprehensive than the limited descriptions mentioned in the architecture plan.

### 4.3 Speaker Roles
The "speakerRoles" field in sessions contains a JSON object as a string, mapping speaker IDs to role IDs. This provides additional context about the role each speaker plays in a session.

### 4.4 Time-based Organization
The schedule is organized by days, with each day containing sessions that have explicit start and end times. This provides a clear temporal structure for the event.

### 4.5 Categorization System
Sessions are categorized through multiple dimensions:
- Categories (audience-based tags)
- Streams (thematic tracks)
- Session Types (format-based classification)
- Rooms (location-based)

## 5. Comparison with Planned Architecture

### 5.1 Alignment with Planned Entities

| Actual Entity | Planned API Module | Alignment |
|---------------|-------------------|-----------|
| Speakers | SpeakerAPI | High - Both focus on speaker information |
| Sessions | EventAPI | High - Sessions map to events |
| Schedule Days | ScheduleAPI | High - Schedule days map to schedules |
| Categories | CategoryAPI | High - Both handle category information |

### 5.2 Differences from Planned Architecture

#### 5.2.1 Data Organization
- **Actual**: Data is organized hierarchically (Schedule Days → Sessions → Speakers/Categories)
- **Planned**: More modular approach with separate API modules for each entity type

#### 5.2.2 Speaker Data Duplication
- **Actual**: Speakers exist both as top-level entities and embedded within sessions
- **Planned**: Assumes a single source of truth for speaker data

#### 5.2.3 Category Structure
- **Actual**: Categories are embedded within sessions as objects with limited properties
- **Planned**: Categories are treated as first-class entities with richer properties

#### 5.2.4 Additional Entities
- **Actual**: Includes Room, Stream, and Session Type entities that are not explicitly mentioned in the planned architecture
- **Planned**: Focuses on core entities (Events, Schedules, Speakers, Categories)

#### 5.2.5 Time-based Structure
- **Actual**: Explicit time slots with startTime/endTime in each session
- **Planned**: Uses a more abstract TimeSlot structure

### 5.3 Missing Features in Actual Data

#### 5.3.1 Event ID Standardization
- **Actual**: Uses numeric IDs for all entities
- **Planned**: Suggests standardized string IDs (e.g., "workshop-a1")

#### 5.3.2 Category Keys
- **Actual**: Categories are objects with names but no explicit keys
- **Planned**: Emphasizes categoryKey for standardized access

#### 5.3.3 Audience Tags
- **Actual**: Uses category objects that may serve a similar purpose
- **Planned**: Explicitly mentions audienceTags field

## 6. Recommendations for Architecture Adaptation

### 6.1 Data Transformation Layer
Create a transformation layer that:
1. Normalizes speaker data to eliminate duplication
2. Extracts and standardizes category information
3. Maps actual entity relationships to the planned API structure

### 6.2 API Module Adaptations
Adapt the planned API modules to handle the actual data structure:
1. **EventAPI**: Map sessions to events
2. **ScheduleAPI**: Map schedule days to schedules
3. **SpeakerAPI**: Handle both top-level and embedded speaker data
4. **CategoryAPI**: Extract categories from sessions and standardize them

### 6.3 Extended Entity Support
Extend the planned architecture to include:
1. **RoomAPI**: Handle room information
2. **StreamAPI**: Handle stream information
3. **SessionTypeAPI**: Handle session type information

### 6.4 Data Enrichment
The actual data is richer than anticipated in some areas:
1. Detailed speaker biographies in the "copy" field
2. Session descriptions in the "copy" field
3. Explicit time information for all sessions
4. Multiple categorization dimensions (categories, streams, session types)

This suggests that the data enrichment plan in the architecture can begin with existing data rather than requiring additional data collection.