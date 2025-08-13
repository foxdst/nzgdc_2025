# UnifiedEventLoader Documentation

## Overview

The `UnifiedEventLoader` is a comprehensive JavaScript class designed to manage and render event panels for the NZGDC (New Zealand Game Developers Conference) widget system. It serves as a unified solution that replaces multiple separate event loaders, handling both "big" (620x300) and "main" (300x300) event panel formats across all widget types.

## Purpose

This class centralizes event panel creation logic, providing:
- Consistent event panel rendering across different widget types
- Dynamic template loading with fallback mechanisms
- Category-based styling and validation
- Support for multiple panel formats
- Robust error handling and debugging capabilities

## Class Structure

### Constructor

```javascript
constructor()
```

Initializes the UnifiedEventLoader instance with default configuration.

#### Properties Initialized:
- `template` - Cached DOM template element
- `isLoading` - Loading state flag
- `loadError` - Error state tracking
- `REQUEST_TIMEOUT` - HTTP request timeout (10 seconds)
- `isDestroyed` - Destruction state flag
- `categoryDefinitions` - Map of event category configurations

### Category Definitions

The loader includes predefined event categories with display names and brightness settings:

| Category Key | Display Name | Brightness |
|--------------|--------------|------------|
| STORY_NARRATIVE | Story & Narrative | light |
| PRODUCTION_QA | Production & QA | dark |
| CULTURE | Culture | light |
| BUSINESS_MARKETING | Business & Marketing | light |
| ART | Art | light |
| AUDIO | Audio | dark |
| PROGRAMMING | Programming | light |
| DATA_TESTING_RESEARCH | Data, Testing or Research | dark |
| REALITIES_VR_AR_MR | Realities (VR, AR, MR) | light |
| GAME_DESIGN | Game Design | light |
| SERIOUS_EDUCATIONAL | Serious & Educational Games | light |

## Methods

### Template Management

#### `async loadTemplate()`
Loads the HTML template for event panels with intelligent fallback mechanisms.

**Returns:** `Promise<Element>` - The loaded template element

**Behavior:**
1. Returns cached template if already loaded
2. Prevents concurrent loading attempts
3. Attempts to load external template file from `templates/unified-event-panel.html`
4. Handles different path contexts (subdirectory detection)
5. Falls back to embedded template (`window.UNIFIED_EVENT_PANEL_TEMPLATE`)
6. Supports file:// protocol by skipping external fetch

**Error Handling:**
- Timeout protection (10 seconds)
- Graceful degradation to embedded templates
- Comprehensive error logging

### Event Panel Creation

#### `createEventPanel(eventData, eventType = "big", widgetType = "schedule")`
Main entry point for creating event panels.

**Parameters:**
- `eventData` (Object) - Event information object
- `eventType` (String) - Panel type: "big" (620x300) or "main" (300x300)
- `widgetType` (String) - Widget context: "schedule", "morning", "afternoon", etc.

**Returns:** `Element` - Generated event panel DOM element

#### `createBigEventPanel(eventData, widgetType = "schedule")`
Creates large format event panels (620x300) for detailed event display.

**Features:**
- Uses template-based rendering
- Applies category data attributes
- Comprehensive content population
- Error fallback handling

#### `createMainEventPanel(eventData, widgetType = "schedule")`
Creates compact square format event panels (300x300) for grid layouts.

**Features:**
- Programmatic HTML generation
- Context-aware introduction text
- Responsive speaker information
- Thumbnail background support

### Content Management

#### `updateBigEventContent(clone, eventData, widgetType = "schedule")`
Populates big event panel template with actual event data.

**Content Areas Updated:**
- Event category display
- Event title
- Session thumbnail
- Timeframe information
- Introduction text (widget-specific)
- Speaker biographical information

**Validation:**
- Verifies template element presence
- Warns about missing critical elements
- Handles multiple speakers gracefully
- Hides unused speaker containers

### Category Utilities

#### `validateCategoryData(eventData)`
Validates and normalizes event category information.

**Returns:** Object with:
- `categoryKey` - Normalized category identifier
- `displayName` - Human-readable category name
- `brightness` - Category brightness setting
- `isValid` - Validation success flag

**Fallback:** Defaults to "PROGRAMMING" category for invalid data

#### `getCategoryBrightness(categoryKey)`
Retrieves brightness setting for a given category.

**Returns:** String - "light" or "dark"

#### `getCategoryDisplayName(categoryKey)`
Retrieves human-readable name for a category.

**Returns:** String - Category display name

#### `mapCategoryToKey(categoryString)`
Maps legacy category strings to standardized keys.

**Legacy Mapping Support:**
- Handles various string formats
- Maintains backward compatibility
- Provides consistent key normalization

### Utility Methods

#### `debug(...args)`
Conditional debug logging that respects global debug flag.

**Condition:** Only logs when `window.NZGDC_DEBUG === true`

#### `createErrorPanel(errorMessage)`
Generates error display panel for failure scenarios.

**Features:**
- User-friendly error messaging
- Development debugging information
- Template load status indication

#### `destroy()`
Cleanup method for proper instance disposal.

**Actions:**
- Sets destruction flag
- Clears cached template
- Resets loading state
- Nullifies error state

## Event Data Structure

The loader expects event data objects with the following structure:

```javascript
{
  title: "Event Title",
  category: "Programming", // Legacy string format
  categoryKey: "PROGRAMMING", // Preferred key format
  thumbnail: "path/to/image.jpg",
  timeframe: "10:00 AM - 11:00 AM",
  speakers: [
    {
      name: "Speaker Name",
      position: "Title at Company"
    }
  ]
}
```

## Widget Type Contexts

The loader adapts its behavior based on widget type:

| Widget Type | Introduction Text | Use Case |
|-------------|------------------|----------|
| schedule | "NZGDC 2025 Workshop by" | Main schedule widgets |
| thursday | "NZGDC 2025 Workshop by" | Thursday-specific events |
| morning | "NZGDC 2025 Morning Event by" | Morning session widgets |
| afternoon | "NZGDC 2025 Afternoon Event by" | Afternoon session widgets |
| default | "NZGDC 2025 Event by" | Generic events |

## Integration

### Global Availability
The class is available globally as `window.UnifiedEventLoader` when loaded in browser environments.

### Module Support
Supports both CommonJS and browser global patterns:
```javascript
// CommonJS
const UnifiedEventLoader = require('./unified-event-loader.js');

// Browser Global
const loader = new window.UnifiedEventLoader();
```

### Dependency Validation
Other widgets check for availability:
```javascript
if (typeof window.UnifiedEventLoader === "undefined") {
  console.error("UnifiedEventLoader dependency missing");
}
```

## Usage Example

```javascript
// Initialize loader
const loader = new UnifiedEventLoader();

// Load template (required before creating panels)
await loader.loadTemplate();

// Create event panel
const eventData = {
  title: "Game Development Workshop",
  categoryKey: "PROGRAMMING",
  thumbnail: "assets/workshop-thumb.jpg",
  timeframe: "2:00 PM - 3:30 PM",
  speakers: [{
    name: "John Developer",
    position: "Senior Engineer at GameStudio"
  }]
};

const bigPanel = loader.createEventPanel(eventData, "big", "schedule");
const mainPanel = loader.createEventPanel(eventData, "main", "afternoon");

// Add to DOM
document.getElementById('event-container').appendChild(bigPanel);
```

## Error Handling

The loader implements comprehensive error handling:

1. **Template Loading Failures**: Falls back to embedded templates
2. **Network Timeouts**: 10-second timeout with graceful degradation
3. **Missing Template Elements**: Warns and continues with available elements
4. **Invalid Category Data**: Falls back to default category
5. **Rendering Errors**: Creates error panels with diagnostic information

## Debug Mode

Enable debug logging by setting:
```javascript
window.NZGDC_DEBUG = true;
```

Debug output includes:
- Template loading progress
- Element query results
- Content population details
- Error conditions and fallbacks

## Browser Compatibility

- Modern browsers with ES6+ support
- Fetch API support required
- DOMParser API support required
- Template element cloning support

## Performance Considerations

- Template caching prevents redundant loads
- Single template instance shared across panels
- Efficient DOM cloning for panel creation
- Lazy loading with async template retrieval
- Destruction method for proper cleanup