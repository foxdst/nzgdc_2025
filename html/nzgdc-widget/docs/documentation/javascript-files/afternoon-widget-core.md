# Afternoon Widget Core Documentation

## Overview

The `afternoon-widget-core.js` file contains the main widget class `NZGDCAfternoonScheduleWidget` responsible for rendering and managing NZGDC (New Zealand Game Developers Conference) afternoon session schedule widgets. It provides a complete interactive afternoon schedule interface with category filtering, time navigation, responsive design, and comprehensive resource management.

## Purpose

This widget system provides:
- Interactive afternoon schedule display with event panels
- Category-based filtering with dropdown interface for afternoon events
- Time navigation between morning and afternoon sessions
- Resource cleanup and lifecycle management for afternoon widgets
- Error handling and debugging capabilities for afternoon-specific issues
- Modular integration with other NZGDC afternoon components

## Classes

### NZGDCAfternoonScheduleWidget

The primary widget class that manages the complete afternoon schedule interface.

#### Constructor

```javascript
constructor(elementId, options = {})
```

**Parameters:**
- `elementId` (String|Element) - DOM element ID or element reference to mount the afternoon widget
- `options` (Object) - Configuration options

**Options Object:**
```javascript
{
  showFilters: true,         // Enable/disable category filters
  showFooter: true,          // Enable/disable footer section
  showTimeNavigation: true,  // Enable/disable time navigation buttons
  theme: "default"           // Widget theme (currently only "default")
}
```

**Properties Initialized:**
- `element` - DOM element where afternoon widget is mounted
- `options` - Merged configuration options
- `uniqueId` - Generated unique identifier for DOM elements (afternoon-specific)
- `initialized` - Initialization state flag
- `eventListeners` - Map for tracking event handlers
- `observers` - Set for tracking DOM observers
- `abortController` - AbortController for cleanup management
- `scheduleGenerator` - Reference to AfternoonScheduleGenerator instance
- `dropdownController` - Reference to AfternoonCategoryDropdownController instance
- `currentFilterCategory` - Active filter category
- `currentCategoryKey` - Active category key
- `originalScheduleData` - Cached original afternoon schedule data

#### Core Methods

##### `generateUniqueId()`
Generates a unique identifier for afternoon widget instances to prevent DOM conflicts.

**Returns:** `String` - Unique ID with "nzgdc-afternoon-" prefix combining timestamp and random string

##### `debug(...args)`
Conditional debug logging that respects global debug configuration.

**Prefix:** `[NZGDC Afternoon Widget Core]` for identification
**Condition:** Only logs when `window.NZGDC_DEBUG === true`

##### `init()`
Primary initialization method that orchestrates afternoon widget setup.

**Process:**
1. Validates all required afternoon dependencies
2. Renders initial DOM structure
3. Initializes afternoon schedule generator
4. Marks widget as initialized

**Error Handling:** Catches initialization failures and displays afternoon-specific error interface

##### `validateDependencies()`
Validates presence of all required global dependencies before initialization.

**Required Dependencies:**
- `window.AFTERNOON_SCHEDULE_DATA` - Afternoon schedule configuration data
- `window.AFTERNOON_EVENTS` - Afternoon event data collection
- `window.UnifiedEventLoader` - Event panel creation class
- `window.AfternoonScheduleGenerator` - Afternoon schedule rendering class

**Returns:** `Boolean` - True if all afternoon dependencies are available

#### Rendering Methods

##### `render()`
Generates the main afternoon widget HTML structure with conditional sections.

**Generated Structure:**
- Optional navigation section (time navigation + filters)
- Afternoon schedule content container with unique ID
- Optional footer section (if `showFooter` enabled)

##### `renderNavigation()`
Creates the navigation section combining time navigation and filters.

**Components:**
- Time navigation buttons (if `showTimeNavigation` enabled)
- Inline filters section (if `showFilters` enabled)

##### `renderTimeNavigationButtons()`
Creates navigation buttons for switching between morning and afternoon sessions.

**Components:**
- Morning Events button (dispatches custom navigation event)
- Afternoon Events button (dispatches custom navigation event)

##### `renderFiltersInline()`
Creates the inline filter interface with afternoon-specific category dropdown.

**Components:**
- Afternoon filters label section
- Afternoon filter value display with trigger
- Afternoon category dropdown overlay
- Backdrop for modal behavior

##### `generateCategoryDropdownHTML()`
Creates the afternoon dropdown container and backdrop elements.

**Returns:** `String` - HTML for afternoon dropdown overlay system

##### `generateCategoryOptions()`
Generates all category option elements for the afternoon dropdown.

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
Creates the footer section with afternoon-specific navigation elements.

**Components:**
- Back to top button with smooth scrolling

#### Filter Management

##### `updateFilterValueText(categoryName)`
Updates the afternoon filter display text and applies category styling.

**Parameters:**
- `categoryName` (String) - Display name of selected category

**Features:**
- Dynamic text updates with directional arrows
- CSS class management for afternoon category styling
- Active category data attributes
- Style conflict prevention
- Comprehensive debug logging for CSS application

##### `applyFilter(categoryKey)`
Applies category-based filtering to the afternoon schedule display.

**Parameters:**
- `categoryKey` (String) - Category identifier to filter by

**Behavior:** Delegates to AfternoonScheduleGenerator's filtering methods

##### `clearFilter()`
Removes active category filter and displays all afternoon events.

**Behavior:** Resets AfternoonScheduleGenerator to show all afternoon events

#### Styling Utilities

##### `getCategoryColors(categoryName)`
Retrieves color scheme for afternoon category styling based on category display name.

**Returns:** Object with `background` and `text` color properties

**Afternoon Category Colors:**
| Category | Background | Text |
|----------|------------|------|
| Game Design | #9ee6ab | #000000 |
| Art | #ffc999 | #000000 |
| Programming | #ccf2f1 | #000000 |
| Audio | #197bff | #ffffff |
| Story & Narrative | #fff47f | #000000 |
| Business & Marketing | #e7f1ff | #000000 |
| Culture | #fac7d5 | #000000 |
| Production & QA | #512340 | #ffffff |
| Realities (VR, AR, MR) | #d1afff | #000000 |
| Data, Testing or Research | #917b89 | #ffffff |
| Serious & Educational Games | #ffafaf | #000000 |

##### `getCategoryClassFromKey(categoryKey)`
Maps category keys to corresponding CSS class names for afternoon widgets.

**Returns:** `String` - CSS class name for afternoon category styling

##### `updateTriangleState(isOpen)`
Updates dropdown arrow direction based on open/closed state.

**Parameters:**
- `isOpen` (Boolean) - Whether afternoon dropdown is currently open

**Behavior:** Changes ▶ to ▼ and vice versa

#### Lifecycle Management

##### `async initializeSchedule()`
Initializes the afternoon schedule generator and renders afternoon schedule content.

**Process:**
1. Locates afternoon schedule container element
2. Validates afternoon schedule data availability
3. Creates AfternoonScheduleGenerator instance
4. Renders schedule with afternoon data
5. Sets up event handlers
6. Initializes dropdown controller

##### `initializeDropdownController()`
Creates and initializes the dropdown controller for afternoon category filtering.

**Behavior:** Instantiates `AfternoonCategoryDropdownController` and passes references

##### `addEventHandlers()`
Attaches event handlers for afternoon widget interactions with cleanup tracking.

**Event Handlers:**
- Back to top button click (smooth scroll)
- Morning events button click (dispatches `afternoonNavigate` custom event)
- Afternoon events button click (dispatches `afternoonNavigate` custom event)

**Features:**
- AbortController integration for cleanup
- Event listener tracking for manual cleanup
- Custom event dispatch for navigation

#### Public API Methods

##### `scrollToTimeSlot(timeSlotId)`
Scrolls to a specific time slot in the afternoon schedule.

**Parameters:**
- `timeSlotId` (String) - ID of time slot to scroll to

**Returns:** `Boolean` - True if time slot found and scrolled to

##### `scrollToEvent(eventId)`
Scrolls to a specific afternoon event in the schedule.

**Parameters:**
- `eventId` (String) - ID of afternoon event to scroll to

**Returns:** `Boolean` - True if event found and scrolled to

##### `getEventData(eventId)`
Retrieves data for a specific afternoon event.

**Parameters:**
- `eventId` (String) - Afternoon event ID to retrieve

**Returns:** `Object|null` - Afternoon event data or null if not found

##### `getAllEvents()`
Retrieves all afternoon events data.

**Returns:** `Object` - Complete AFTERNOON_EVENTS object or empty object

##### `getScheduleData()`
Retrieves afternoon schedule configuration data.

**Returns:** `Object` - Complete AFTERNOON_SCHEDULE_DATA object or empty object

##### `destroy()`
Comprehensive cleanup method for proper afternoon widget disposal.

**Cleanup Process:**
1. Aborts any pending requests via AbortController
2. Removes all tracked event listeners
3. Disconnects all DOM observers
4. Destroys afternoon dropdown controller
5. Destroys afternoon schedule generator
6. Clears DOM content and classes
7. Marks widget as destroyed

##### `isDestroyed()`
Checks if afternoon widget has been destroyed or cleanup has been initiated.

**Returns:** `Boolean` - True if afternoon widget is destroyed

#### Error Handling

##### `showInitializationError(error)`
Displays user-friendly error interface when afternoon widget initialization fails.

**Features:**
- Afternoon-specific error styling
- Error message display
- Console reference for debugging
- Page refresh button for recovery

### AfternoonCategoryDropdownController

Specialized controller class for managing the afternoon category filter dropdown interface.

#### Constructor

```javascript
constructor()
```

**Properties Initialized:**
- `widget` - Reference to parent afternoon widget instance
- `dropdown` - Afternoon dropdown DOM element
- `backdrop` - Modal backdrop element
- `isOpen` - Open/closed state flag
- `abortController` - Cleanup management

#### Methods

##### `init(widgetInstance, dropdownElement)`
Initializes afternoon dropdown controller with widget and DOM references.

**Parameters:**
- `widgetInstance` - Parent NZGDCAfternoonScheduleWidget instance
- `dropdownElement` - Afternoon dropdown container DOM element

##### `attachEventHandlers()`
Sets up comprehensive event handling for afternoon dropdown interaction.

**Event Handlers:**
- Click trigger for afternoon dropdown toggle
- Afternoon category item selection clicks
- Keyboard navigation (Enter, Space, Escape)
- Outside click detection for closing
- Backdrop click handling
- Global escape key handling

**Features:**
- AbortController integration for cleanup
- Event propagation control
- Keyboard accessibility

##### `toggle()`
Toggles afternoon dropdown open/closed state.

##### `show()`
Opens the afternoon dropdown interface.

**Actions:**
- Sets open state flag
- Adds visibility CSS classes
- Updates arrow direction to ▼
- Logs debug information

##### `hide()`
Closes the afternoon dropdown interface.

**Actions:**
- Clears open state flag
- Removes visibility CSS classes
- Updates arrow direction to ▶
- Logs debug information

##### `selectCategory(categoryKey, categoryName)`
Handles afternoon category selection and applies filtering.

**Parameters:**
- `categoryKey` (String) - Category identifier
- `categoryName` (String) - Display name for category

**Process:**
1. Updates widget's current category key
2. Updates afternoon filter display text
3. Applies appropriate filter or clears filter for "ALL"
4. Closes dropdown

##### `destroy()`
Cleanup method for afternoon dropdown controller disposal.

**Actions:**
- Aborts all event listeners via AbortController
- Nullifies all references
- Resets state flags

## Integration

### Global Availability
All classes are available globally when loaded:
```javascript
window.NZGDCAfternoonScheduleWidget
window.NZGDCAfternoonSchedule // Alias for easier access
window.AfternoonCategoryDropdownController
```

### Module Support
Supports CommonJS and browser globals:
```javascript
// CommonJS
const NZGDCAfternoonScheduleWidget = require('./afternoon-widget-core.js');

// Browser Global
const widget = new window.NZGDCAfternoonScheduleWidget('my-element');
```

### Dependency Requirements
The afternoon widget requires these global dependencies to be loaded first:
- `AFTERNOON_SCHEDULE_DATA` - Afternoon schedule configuration and metadata
- `AFTERNOON_EVENTS` - Afternoon event data collection
- `UnifiedEventLoader` - Event panel creation
- `AfternoonScheduleGenerator` - Afternoon schedule rendering logic

## Usage Examples

### Basic Afternoon Widget Initialization
```javascript
// Basic afternoon widget initialization
const afternoonWidget = new NZGDCAfternoonScheduleWidget('afternoon-schedule-container');

// Advanced initialization with options
const afternoonWidget = new NZGDCAfternoonScheduleWidget('afternoon-schedule-container', {
  showFilters: true,
  showFooter: true,
  showTimeNavigation: true,
  theme: 'default'
});

// Enable debug mode
window.NZGDC_DEBUG = true;

// Clean up when done
afternoonWidget.destroy();
```

### Navigation Event Handling
```javascript
// Listen for navigation events
afternoonWidget.element.addEventListener('afternoonNavigate', (event) => {
  const target = event.detail.target;
  console.log(`Navigation requested to: ${target}`);
  
  if (target === 'morning') {
    // Switch to morning widget
    switchToMorningSchedule();
  }
});
```

### Public API Usage
```javascript
// Scroll to specific time slot
afternoonWidget.scrollToTimeSlot('mid-afternoon');

// Get afternoon event data
const eventData = afternoonWidget.getEventData('panel-b1');

// Get all afternoon events
const allEvents = afternoonWidget.getAllEvents();

// Check if widget is destroyed
if (afternoonWidget.isDestroyed()) {
  console.log('Afternoon widget has been destroyed');
}
```

## Error Handling

The afternoon widget implements comprehensive error handling:

1. **Dependency Validation**: Checks all required afternoon globals before initialization
2. **DOM Element Validation**: Ensures target element exists
3. **Initialization Errors**: Displays user-friendly afternoon-specific error interface
4. **Resource Cleanup**: Proper disposal of all afternoon widget resources on destruction
5. **Event Handler Errors**: Graceful handling of listener cleanup failures

## Debug Mode

Enable detailed logging:
```javascript
window.NZGDC_DEBUG = true;
```

Debug output includes:
- Afternoon widget initialization progress
- Afternoon dependency validation results
- Afternoon filter application details
- Afternoon dropdown state changes
- Afternoon resource cleanup operations
- CSS application debugging for afternoon categories

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for afternoon dropdown interaction
- **ARIA Attributes**: Proper tabindex and focus management
- **Screen Reader Support**: Semantic HTML structure
- **Focus Management**: Proper focus handling for modal interactions
- **Custom Events**: Navigation events for external accessibility tools

## Browser Compatibility

- Modern browsers with ES6+ support
- AbortController API support required
- DOM manipulation API support
- CSS class manipulation support
- Custom events support

## Performance Considerations

- **Unique ID Generation**: Prevents DOM conflicts in multiple afternoon widget instances
- **Resource Tracking**: Comprehensive cleanup prevents memory leaks  
- **Event Delegation**: Efficient event handling with AbortController
- **Lazy Initialization**: Components initialized only when needed
- **Proper Disposal**: Complete cleanup of all resources and references

## Afternoon-Specific Features

### Time Navigation
- Morning/Afternoon navigation buttons with custom event dispatch
- Integration with broader NZGDC schedule navigation system
- Event-based communication for widget switching

### Afternoon Category Colors
- Custom color scheme optimized for afternoon session categories
- Cool, professional colors appropriate for afternoon themes
- High contrast ratios for accessibility

### Afternoon Schedule Integration
- Seamless integration with AfternoonScheduleGenerator
- Afternoon-specific error handling and messaging
- Afternoon event data validation and processing

### Break Period Support
- Integration with afternoon break periods (afternoon break, sponsor party)
- Special handling for break slot rendering
- Timeline-appropriate afternoon schedule flow

## Dependencies

**Required Classes:**
- `AfternoonScheduleGenerator` - For afternoon schedule rendering
- `UnifiedEventLoader` - For afternoon event panel creation

**Required Global Data:**
- `window.AFTERNOON_SCHEDULE_DATA` - Afternoon schedule configuration
- `window.AFTERNOON_EVENTS` - Afternoon event data collection

**Optional Dependencies:**
- `window.NZGDC_DEBUG` - Debug mode configuration

## Afternoon Widget Statistics

- **Total Afternoon Events**: 24 events across 3 time slots
- **Break Periods**: 2 breaks (afternoon break + sponsor party)
- **Category Coverage**: 11 different game development categories
- **Panel Formats**: Mixed big (620x300) and main (300x300) formats
- **Time Coverage**: ~1.75 hours of events + 2.4 hours of breaks
- **Navigation Integration**: Custom events for morning/afternoon switching