# Morning Widget Core Documentation

## Overview

The `morning-widget-core.js` file contains the main widget class `NZGDCMorningScheduleWidget` responsible for rendering and managing NZGDC (New Zealand Game Developers Conference) morning session schedule widgets. It provides a complete interactive morning schedule interface with category filtering, time navigation, responsive design, and comprehensive resource management.

## Purpose

This widget system provides:
- Interactive morning schedule display with event panels
- Category-based filtering with dropdown interface for morning events
- Time navigation between morning and afternoon sessions
- Resource cleanup and lifecycle management for morning widgets
- Error handling and debugging capabilities for morning-specific issues
- Modular integration with other NZGDC morning components

## Classes

### NZGDCMorningScheduleWidget

The primary widget class that manages the complete morning schedule interface.

#### Constructor

```javascript
constructor(elementId, options = {})
```

**Parameters:**
- `elementId` (String|Element) - DOM element ID or element reference to mount the morning widget
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
- `element` - DOM element where morning widget is mounted
- `options` - Merged configuration options
- `uniqueId` - Generated unique identifier for DOM elements (morning-specific)
- `initialized` - Initialization state flag
- `eventListeners` - Map for tracking event handlers
- `observers` - Set for tracking DOM observers
- `abortController` - AbortController for cleanup management
- `scheduleGenerator` - Reference to MorningScheduleGenerator instance
- `dropdownController` - Reference to MorningCategoryDropdownController instance
- `currentFilterCategory` - Active filter category
- `currentCategoryKey` - Active category key
- `originalScheduleData` - Cached original morning schedule data

#### Core Methods

##### `generateUniqueId()`
Generates a unique identifier for morning widget instances to prevent DOM conflicts.

**Returns:** `String` - Unique ID with "nzgdc-morning-" prefix combining timestamp and random string

##### `debug(...args)`
Conditional debug logging that respects global debug configuration.

**Prefix:** `[NZGDC Morning Widget Core]` for identification
**Condition:** Only logs when `window.NZGDC_DEBUG === true`

##### `init()`
Primary initialization method that orchestrates morning widget setup.

**Process:**
1. Validates all required morning dependencies
2. Renders initial DOM structure
3. Initializes morning schedule generator
4. Marks widget as initialized

**Error Handling:** Catches initialization failures and displays morning-specific error interface

##### `validateDependencies()`
Validates presence of all required global dependencies before initialization.

**Required Dependencies:**
- `window.MORNING_SCHEDULE_DATA` - Morning schedule configuration data
- `window.MORNING_EVENTS` - Morning event data collection
- `window.UnifiedEventLoader` - Event panel creation class
- `window.MorningScheduleGenerator` - Morning schedule rendering class

**Returns:** `Boolean` - True if all morning dependencies are available

#### Rendering Methods

##### `render()`
Generates the main morning widget HTML structure with conditional sections.

**Generated Structure:**
- Optional navigation section (time navigation + filters)
- Morning schedule content container with unique ID
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
Creates the inline filter interface with morning-specific category dropdown.

**Components:**
- Morning filters label section
- Morning filter value display with trigger
- Morning category dropdown overlay
- Backdrop for modal behavior

##### `generateCategoryDropdownHTML()`
Creates the morning dropdown container and backdrop elements.

**Returns:** `String` - HTML for morning dropdown overlay system

##### `generateCategoryOptions()`
Generates all category option elements for the morning dropdown.

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
Creates the footer section with morning-specific navigation elements.

**Components:**
- Back to top button with smooth scrolling

#### Filter Management

##### `updateFilterValueText(categoryName)`
Updates the morning filter display text and applies category styling.

**Parameters:**
- `categoryName` (String) - Display name of selected category

**Features:**
- Dynamic text updates with directional arrows
- CSS class management for morning category styling
- Active category data attributes
- Style conflict prevention
- Comprehensive debug logging for CSS application

##### `applyFilter(categoryKey)`
Applies category-based filtering to the morning schedule display.

**Parameters:**
- `categoryKey` (String) - Category identifier to filter by

**Behavior:** Delegates to MorningScheduleGenerator's filtering methods

##### `clearFilter()`
Removes active category filter and displays all morning events.

**Behavior:** Resets MorningScheduleGenerator to show all morning events

#### Styling Utilities

##### `getCategoryColors(categoryName)`
Retrieves color scheme for morning category styling based on category display name.

**Returns:** Object with `background` and `text` color properties

**Morning Category Colors:**
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
Maps category keys to corresponding CSS class names for morning widgets.

**Returns:** `String` - CSS class name for morning category styling

##### `updateTriangleState(isOpen)`
Updates dropdown arrow direction based on open/closed state.

**Parameters:**
- `isOpen` (Boolean) - Whether morning dropdown is currently open

**Behavior:** Changes ▶ to ▼ and vice versa

#### Lifecycle Management

##### `async initializeSchedule()`
Initializes the morning schedule generator and renders morning schedule content.

**Process:**
1. Locates morning schedule container element
2. Validates morning schedule data availability
3. Creates MorningScheduleGenerator instance
4. Renders schedule with morning data
5. Sets up event handlers
6. Initializes dropdown controller

##### `initializeDropdownController()`
Creates and initializes the dropdown controller for morning category filtering.

**Behavior:** Instantiates `MorningCategoryDropdownController` and passes references

##### `addEventHandlers()`
Attaches event handlers for morning widget interactions with cleanup tracking.

**Event Handlers:**
- Back to top button click (smooth scroll)
- Morning events button click (dispatches `morningNavigate` custom event)
- Afternoon events button click (dispatches `morningNavigate` custom event)

**Features:**
- AbortController integration for cleanup
- Event listener tracking for manual cleanup
- Custom event dispatch for navigation

#### Public API Methods

##### `scrollToTimeSlot(timeSlotId)`
Scrolls to a specific time slot in the morning schedule.

**Parameters:**
- `timeSlotId` (String) - ID of time slot to scroll to

**Returns:** `Boolean` - True if time slot found and scrolled to

##### `scrollToEvent(eventId)`
Scrolls to a specific morning event in the schedule.

**Parameters:**
- `eventId` (String) - ID of morning event to scroll to

**Returns:** `Boolean` - True if event found and scrolled to

##### `getEventData(eventId)`
Retrieves data for a specific morning event.

**Parameters:**
- `eventId` (String) - Morning event ID to retrieve

**Returns:** `Object|null` - Morning event data or null if not found

##### `getAllEvents()`
Retrieves all morning events data.

**Returns:** `Object` - Complete MORNING_EVENTS object or empty object

##### `getScheduleData()`
Retrieves morning schedule configuration data.

**Returns:** `Object` - Complete MORNING_SCHEDULE_DATA object or empty object

##### `destroy()`
Comprehensive cleanup method for proper morning widget disposal.

**Cleanup Process:**
1. Aborts any pending requests via AbortController
2. Removes all tracked event listeners
3. Disconnects all DOM observers
4. Destroys morning dropdown controller
5. Destroys morning schedule generator
6. Clears DOM content and classes
7. Marks widget as destroyed

##### `isDestroyed()`
Checks if morning widget has been destroyed or cleanup has been initiated.

**Returns:** `Boolean` - True if morning widget is destroyed

#### Error Handling

##### `showInitializationError(error)`
Displays user-friendly error interface when morning widget initialization fails.

**Features:**
- Morning-specific error styling
- Error message display
- Console reference for debugging
- Page refresh button for recovery

### MorningCategoryDropdownController

Specialized controller class for managing the morning category filter dropdown interface.

#### Constructor

```javascript
constructor()
```

**Properties Initialized:**
- `widget` - Reference to parent morning widget instance
- `dropdown` - Morning dropdown DOM element
- `backdrop` - Modal backdrop element
- `isOpen` - Open/closed state flag
- `abortController` - Cleanup management

#### Methods

##### `init(widgetInstance, dropdownElement)`
Initializes morning dropdown controller with widget and DOM references.

**Parameters:**
- `widgetInstance` - Parent NZGDCMorningScheduleWidget instance
- `dropdownElement` - Morning dropdown container DOM element

##### `attachEventHandlers()`
Sets up comprehensive event handling for morning dropdown interaction.

**Event Handlers:**
- Click trigger for morning dropdown toggle
- Morning category item selection clicks
- Keyboard navigation (Enter, Space, Escape)
- Outside click detection for closing
- Backdrop click handling
- Global escape key handling

**Features:**
- AbortController integration for cleanup
- Event propagation control
- Keyboard accessibility

##### `toggle()`
Toggles morning dropdown open/closed state.

##### `show()`
Opens the morning dropdown interface.

**Actions:**
- Sets open state flag
- Adds visibility CSS classes
- Updates arrow direction to ▼
- Logs debug information

##### `hide()`
Closes the morning dropdown interface.

**Actions:**
- Clears open state flag
- Removes visibility CSS classes
- Updates arrow direction to ▶
- Logs debug information

##### `selectCategory(categoryKey, categoryName)`
Handles morning category selection and applies filtering.

**Parameters:**
- `categoryKey` (String) - Category identifier
- `categoryName` (String) - Display name for category

**Process:**
1. Updates widget's current category key
2. Updates morning filter display text
3. Applies appropriate filter or clears filter for "ALL"
4. Closes dropdown

##### `destroy()`
Cleanup method for morning dropdown controller disposal.

**Actions:**
- Aborts all event listeners via AbortController
- Nullifies all references
- Resets state flags

## Integration

### Global Availability
All classes are available globally when loaded:
```javascript
window.NZGDCMorningScheduleWidget
window.NZGDCMorningSchedule // Alias for easier access
window.MorningCategoryDropdownController
```

### Module Support
Supports CommonJS and browser globals:
```javascript
// CommonJS
const NZGDCMorningScheduleWidget = require('./morning-widget-core.js');

// Browser Global
const widget = new window.NZGDCMorningScheduleWidget('my-element');
```

### Dependency Requirements
The morning widget requires these global dependencies to be loaded first:
- `MORNING_SCHEDULE_DATA` - Morning schedule configuration and metadata
- `MORNING_EVENTS` - Morning event data collection
- `UnifiedEventLoader` - Event panel creation
- `MorningScheduleGenerator` - Morning schedule rendering logic

## Usage Examples

### Basic Morning Widget Initialization
```javascript
// Basic morning widget initialization
const morningWidget = new NZGDCMorningScheduleWidget('morning-schedule-container');

// Advanced initialization with options
const morningWidget = new NZGDCMorningScheduleWidget('morning-schedule-container', {
  showFilters: true,
  showFooter: true,
  showTimeNavigation: true,
  theme: 'default'
});

// Enable debug mode
window.NZGDC_DEBUG = true;

// Clean up when done
morningWidget.destroy();
```

### Navigation Event Handling
```javascript
// Listen for navigation events
morningWidget.element.addEventListener('morningNavigate', (event) => {
  const target = event.detail.target;
  console.log(`Navigation requested to: ${target}`);
  
  if (target === 'afternoon') {
    // Switch to afternoon widget
    switchToAfternoonSchedule();
  }
});
```

### Public API Usage
```javascript
// Scroll to specific time slot
morningWidget.scrollToTimeSlot('mid-morning');

// Get morning event data
const eventData = morningWidget.getEventData('panel-b1');

// Get all morning events
const allEvents = morningWidget.getAllEvents();

// Check if widget is destroyed
if (morningWidget.isDestroyed()) {
  console.log('Morning widget has been destroyed');
}
```

## Error Handling

The morning widget implements comprehensive error handling:

1. **Dependency Validation**: Checks all required morning globals before initialization
2. **DOM Element Validation**: Ensures target element exists
3. **Initialization Errors**: Displays user-friendly morning-specific error interface
4. **Resource Cleanup**: Proper disposal of all morning widget resources on destruction
5. **Event Handler Errors**: Graceful handling of listener cleanup failures

## Debug Mode

Enable detailed logging:
```javascript
window.NZGDC_DEBUG = true;
```

Debug output includes:
- Morning widget initialization progress
- Morning dependency validation results
- Morning filter application details
- Morning dropdown state changes
- Morning resource cleanup operations
- CSS application debugging for morning categories

## Accessibility Features

- **Keyboard Navigation**: Full keyboard support for morning dropdown interaction
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

- **Unique ID Generation**: Prevents DOM conflicts in multiple morning widget instances
- **Resource Tracking**: Comprehensive cleanup prevents memory leaks  
- **Event Delegation**: Efficient event handling with AbortController
- **Lazy Initialization**: Components initialized only when needed
- **Proper Disposal**: Complete cleanup of all resources and references

## Morning-Specific Features

### Time Navigation
- Morning/Afternoon navigation buttons with custom event dispatch
- Integration with broader NZGDC schedule navigation system
- Event-based communication for widget switching

### Morning Category Colors
- Custom color scheme optimized for morning session categories
- Light, energetic colors appropriate for morning themes
- High contrast ratios for accessibility

### Morning Schedule Integration
- Seamless integration with MorningScheduleGenerator
- Morning-specific error handling and messaging
- Morning event data validation and processing

### Break Period Support
- Integration with morning break periods (morning break, lunch break)
- Special handling for break slot rendering
- Timeline-appropriate morning schedule flow

## Dependencies

**Required Classes:**
- `MorningScheduleGenerator` - For morning schedule rendering
- `UnifiedEventLoader` - For morning event panel creation

**Required Global Data:**
- `window.MORNING_SCHEDULE_DATA` - Morning schedule configuration
- `window.MORNING_EVENTS` - Morning event data collection

**Optional Dependencies:**
- `window.NZGDC_DEBUG` - Debug mode configuration

## Morning Widget Statistics

- **Total Morning Events**: 24 events across 4 time slots
- **Break Periods**: 2 breaks (morning break + lunch break)
- **Category Coverage**: 11 different game development categories
- **Panel Formats**: Mixed big (620x300) and main (300x300) formats
- **Time Coverage**: ~2.5 hours of events + 1.4 hours of breaks
- **Navigation Integration**: Custom events for morning/afternoon switching