# NZGDCScheduleWidget Documentation

## Overview

The `NZGDCScheduleWidget` is the main widget class responsible for rendering and managing NZGDC (New Zealand Game Developers Conference) schedule widgets. It provides a complete interactive schedule interface with category filtering, responsive design, and comprehensive resource management.

## Purpose

This widget system provides:
- Interactive schedule display with event panels
- Category-based filtering with dropdown interface
- Resource cleanup and lifecycle management
- Error handling and debugging capabilities
- Modular integration with other NZGDC components

## Classes

### NZGDCScheduleWidget

The primary widget class that manages the complete schedule interface.

#### Constructor

```javascript
constructor(elementId, options = {})
```

**Parameters:**
- `elementId` (String|Element) - DOM element ID or element reference to mount the widget
- `options` (Object) - Configuration options

**Options Object:**
```javascript
{
  showFilters: true,    // Enable/disable category filters
  showFooter: true,     // Enable/disable footer section
  theme: "default"      // Widget theme (currently only "default")
}
```

**Properties Initialized:**
- `element` - DOM element where widget is mounted
- `options` - Merged configuration options
- `uniqueId` - Generated unique identifier for DOM elements
- `initialized` - Initialization state flag
- `eventListeners` - Map for tracking event handlers
- `observers` - Set for tracking DOM observers
- `abortController` - AbortController for cleanup management
- `scheduleGenerator` - Reference to ScheduleGenerator instance
- `dropdownController` - Reference to dropdown controller instance
- `currentFilterCategory` - Active filter category
- `currentCategoryKey` - Active category key

#### Core Methods

##### `generateUniqueId()`
Generates a unique identifier for widget instances to prevent DOM conflicts.

**Returns:** `String` - Unique ID combining timestamp and random string

##### `debug(...args)`
Conditional debug logging that respects global debug configuration.

**Condition:** Only logs when `window.NZGDC_DEBUG === true`

##### `init()`
Primary initialization method that orchestrates widget setup.

**Process:**
1. Validates all required dependencies
2. Renders initial DOM structure
3. Initializes schedule generator
4. Sets up dropdown controller
5. Marks widget as initialized

**Error Handling:** Catches initialization failures and displays error interface

##### `validateDependencies()`
Validates presence of all required global dependencies before initialization.

**Required Dependencies:**
- `window.SCHEDULE_DATA` - Schedule configuration data
- `window.WORKSHOP_EVENTS` - Event data collection
- `window.UnifiedEventLoader` - Event panel creation class
- `window.ScheduleGenerator` - Schedule rendering class

**Returns:** `Boolean` - True if all dependencies are available

#### Rendering Methods

##### `render()`
Generates the main widget HTML structure with conditional sections.

**Generated Structure:**
- Optional filters section (if `showFilters` enabled)
- Schedule content container with unique ID
- Optional footer section (if `showFooter` enabled)

##### `renderFiltersInline()`
Creates the inline filter interface with category dropdown.

**Components:**
- Filter label section
- Filter value display with trigger
- Category dropdown overlay
- Backdrop for modal behavior

##### `generateCategoryDropdownHTML()`
Creates the dropdown container and backdrop elements.

**Returns:** `String` - HTML for dropdown overlay system

##### `generateCategoryOptions()`
Generates all category option elements for the dropdown.

**Categories Available:**
- All Events (default)
- Game Design
- Art  
- Programming
- Audio
- Story & Narrative
- Business & Marketing
- Culture
- Production & QA
- Realities (VR, AR, MR)
- Data, Testing or Research
- Serious & Educational Games

**Sorting:** Alphabetical by name with "All Events" always first

##### `renderFooter()`
Creates the footer section with navigation elements.

**Components:**
- Back to top button with smooth scrolling

#### Filter Management

##### `updateFilterValueText(categoryName)`
Updates the filter display text and applies category styling.

**Features:**
- Dynamic text updates with directional arrows
- CSS class management for category styling
- Active category data attributes
- Style conflict prevention

##### `applyFilter(categoryKey)`
Applies category-based filtering to the schedule display.

**Parameters:**
- `categoryKey` (String) - Category identifier to filter by

**Behavior:** Delegates to ScheduleGenerator's filtering methods

##### `clearFilter()`
Removes active category filter and displays all events.

**Behavior:** Resets ScheduleGenerator to show all events

#### Styling Utilities

##### `getCategoryColors(categoryKey)`
Retrieves color scheme for category styling.

**Returns:** Object with `background` and `text` color properties

**Color Mappings:**
| Category | Background | Text |
|----------|------------|------|
| ALL | #ffffff | #000000 |
| GAME_DESIGN | #ff4444 | #ffffff |
| ART | #44ff44 | #000000 |
| PROGRAMMING | #4444ff | #ffffff |
| AUDIO | #ffaa00 | #000000 |
| STORY_NARRATIVE | #aa44ff | #ffffff |
| BUSINESS_MARKETING | #ff44aa | #ffffff |
| CULTURE | #44aaff | #000000 |
| PRODUCTION_QA | #aaff44 | #000000 |
| REALITIES_VR_AR_MR | #ff8844 | #000000 |
| DATA_TESTING_RESEARCH | #8844ff | #ffffff |
| SERIOUS_EDUCATIONAL | #44ff88 | #000000 |

##### `getCategoryClassFromKey(categoryKey)`
Maps category keys to corresponding CSS class names.

**Returns:** `String` - CSS class name for category styling

##### `updateTriangleState(isOpen)`
Updates dropdown arrow direction based on open/closed state.

**Parameters:**
- `isOpen` (Boolean) - Whether dropdown is currently open

**Behavior:** Changes ▶ to ▼ and vice versa

#### Lifecycle Management

##### `async initializeSchedule()`
Initializes the schedule generator and renders schedule content.

**Process:**
1. Locates schedule container element
2. Validates schedule data availability
3. Creates ScheduleGenerator instance
4. Renders schedule with data
5. Sets up back-to-top functionality

##### `addBackToTopHandler()`
Attaches smooth scroll handler to back-to-top button with cleanup tracking.

**Features:**
- Smooth scroll behavior
- AbortController integration for cleanup
- Event listener tracking

##### `initializeDropdownController()`
Creates and initializes the dropdown controller for category filtering.

**Behavior:** Instantiates `ThursdayCategoryDropdownController` and passes references

##### `destroy()`
Comprehensive cleanup method for proper widget disposal.

**Cleanup Process:**
1. Aborts any pending requests via AbortController
2. Removes all tracked event listeners
3. Disconnects all DOM observers
4. Destroys dropdown controller
5. Destroys schedule generator
6. Clears DOM content and classes
7. Marks widget as destroyed

##### `isDestroyed()`
Checks if widget has been destroyed or cleanup has been initiated.

**Returns:** `Boolean` - True if widget is destroyed

#### Error Handling

##### `showInitializationError(error)`
Displays user-friendly error interface when initialization fails.

**Features:**
- Error message display
- Console reference for debugging
- Page refresh button for recovery

### ThursdayCategoryDropdownController

Specialized controller class for managing the category filter dropdown interface.

#### Constructor

```javascript
constructor()
```

**Properties Initialized:**
- `widget` - Reference to parent widget instance
- `dropdown` - Dropdown DOM element
- `backdrop` - Modal backdrop element
- `isOpen` - Open/closed state flag
- `abortController` - Cleanup management

#### Methods

##### `init(widgetInstance, dropdownElement)`
Initializes dropdown controller with widget and DOM references.

**Parameters:**
- `widgetInstance` - Parent NZGDCScheduleWidget instance
- `dropdownElement` - Dropdown container DOM element

##### `attachEventHandlers()`
Sets up comprehensive event handling for dropdown interaction.

**Event Handlers:**
- Click trigger for dropdown toggle
- Category item selection clicks
- Keyboard navigation (Enter, Space, Escape)
- Outside click detection for closing
- Backdrop click handling
- Global escape key handling

**Features:**
- AbortController integration for cleanup
- Event propagation control
- Keyboard accessibility

##### `toggle()`
Toggles dropdown open/closed state.

##### `show()`
Opens the dropdown interface.

**Actions:**
- Sets open state flag
- Adds visibility CSS classes
- Updates arrow direction to ▼
- Logs debug information

##### `hide()`
Closes the dropdown interface.

**Actions:**
- Clears open state flag
- Removes visibility CSS classes
- Updates arrow direction to ▶
- Logs debug information

##### `selectCategory(categoryKey, categoryName)`
Handles category selection and applies filtering.

**Parameters:**
- `categoryKey` (String) - Category identifier
- `categoryName` (String) - Display name for category

**Process:**
1. Updates widget's current category key
2. Updates filter display text
3. Applies appropriate filter or clears filter for "ALL"
4. Closes dropdown

##### `destroy()`
Cleanup method for controller disposal.

**Actions:**
- Aborts all event listeners via AbortController
- Nullifies all references
- Resets state flags

## Integration

### Global Availability
Both classes are available globally when loaded:
```javascript
window.NZGDCScheduleWidget
window.NZGDCSchedule // Alias for easier access
```

### Module Support
Supports CommonJS and browser globals:
```javascript
// CommonJS
const NZGDCScheduleWidget = require('./widget-core.js');

// Browser Global
const widget = new window.NZGDCScheduleWidget('my-element');
```

### Dependency Requirements
The widget requires these global dependencies to be loaded first:
- `SCHEDULE_DATA` - Configuration and metadata
- `WORKSHOP_EVENTS` - Event data collection
- `UnifiedEventLoader` - Event panel creation
- `ScheduleGenerator` - Schedule rendering logic

## Usage Example

```javascript
// Basic widget initialization
const widget = new NZGDCScheduleWidget('schedule-container');

// Advanced initialization with options
const widget = new NZGDCScheduleWidget('schedule-container', {
  showFilters: true,
  showFooter: true,
  theme: 'default'
});

// Enable debug mode
window.NZGDC_DEBUG = true;

// Clean up when done
widget.destroy();
```

## Error Handling

The widget implements comprehensive error handling:

1. **Dependency Validation**: Checks all required globals before initialization
2. **DOM Element Validation**: Ensures target element exists
3. **Initialization Errors**: Displays user-friendly error interface
4. **Resource Cleanup**: Proper disposal of all resources on destruction
5. **Event Handler Errors**: Graceful handling of listener cleanup failures

## Debug Mode

Enable detailed logging:
```javascript
window.NZGDC_DEBUG = true;
```

Debug output includes:
- Initialization progress
- Dependency validation results
- Filter application details
- Dropdown state changes
- Resource cleanup operations

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for dropdown interaction
- **ARIA Attributes**: Proper tabindex and focus management
- **Screen Reader Support**: Semantic HTML structure
- **Focus Management**: Proper focus handling for modal interactions

## Browser Compatibility

- Modern browsers with ES6+ support
- AbortController API support required
- DOM manipulation API support
- CSS class manipulation support

## Performance Considerations

- **Unique ID Generation**: Prevents DOM conflicts in multiple widget instances
- **Resource Tracking**: Comprehensive cleanup prevents memory leaks  
- **Event Delegation**: Efficient event handling with AbortController
- **Lazy Initialization**: Components initialized only when needed
- **Proper Disposal**: Complete cleanup of all resources and references