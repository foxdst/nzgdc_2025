# ScheduleGenerator Documentation

## Overview

The `ScheduleGenerator` class is responsible for rendering and managing the NZGDC (New Zealand Game Developers Conference) schedule interface. It handles the generation of time slots, workshop rows, event panels, and provides comprehensive filtering capabilities for category-based event display.

## Purpose

This class serves as:
- Schedule layout generator and renderer
- Workshop content loader and manager
- Category-based filtering system
- Error handling and recovery system
- Resource cleanup and lifecycle management

## Class Structure

### Constructor

```javascript
constructor(container)
```

**Parameters:**
- `container` (Element) - DOM container where schedule will be rendered

**Properties Initialized:**
- `container` - Target DOM container element
- `eventLoader` - UnifiedEventLoader instance for panel creation
- `loadedWorkshops` - Set tracking successfully loaded workshops
- `isDestroyed` - Destruction state flag
- `currentFilterCategory` - Active filter category
- `originalData` - Cached original schedule data for filtering

## Core Methods

### Rendering System

#### `generateTimeSlot(timeSlot)`
Creates a complete time slot section with workshops.

**Parameters:**
- `timeSlot` (Object) - Time slot configuration object

**TimeSlot Object Structure:**
```javascript
{
  id: "morning",
  timeRange: "9.00am - 12.00pm", 
  title: "Morning Workshops",
  theme: "a", // Controls CSS styling theme
  workshops: [/* workshop objects */]
}
```

**Returns:** `Element` - Generated time slot DOM element

**Generated Structure:**
- Event times container with theme-based styling
- Session schedule information (time range and title)
- Underline separator
- Scheduled workshops container

#### `generateWorkshopRows(workshops)`
Organizes workshops into rows for grid layout display.

**Parameters:**
- `workshops` (Array) - Collection of workshop objects

**Configuration:**
- `workshopsPerRow` - Set to 2 workshops per row
- Automatic row calculation and organization

**Returns:** `String` - HTML for all workshop rows

#### `generateWorkshopEvent(workshop)`
Creates placeholder container for individual workshop events.

**Parameters:**
- `workshop` (Object) - Workshop configuration object

**Returns:** `String` - HTML for workshop event container

**Features:**
- Loading placeholder during content load
- Data attributes for identification and filtering
- Event ID, category, and title attribution

#### `async renderSchedule(data)`
Main rendering method that generates the complete schedule interface.

**Parameters:**
- `data` (Object) - Complete schedule data object

**Process:**
1. Validates generator is not destroyed
2. Stores original data for filtering
3. Clears existing content and tracking
4. Creates document fragment for performance
5. Generates all time slots
6. Single DOM update operation
7. Initiates asynchronous workshop content loading

**Error Handling:** Catches rendering failures and displays error interface

### Content Loading System

#### `async loadWorkshopContent()`
Loads actual workshop content into placeholder containers.

**Process:**
1. Loads UnifiedEventLoader template once
2. Finds all workshop containers
3. Creates batch loading promises
4. Tracks successful loads for cleanup
5. Handles individual workshop failures gracefully

**Performance Features:**
- Single template load for all workshops
- Batch DOM operations
- Promise.allSettled for parallel loading
- Individual failure isolation

#### `async loadSingleWorkshop(container)`
Loads content for a single workshop container.

**Parameters:**
- `container` (Element) - Workshop container DOM element

**Process:**
1. Extracts event ID from container
2. Retrieves workshop data from WORKSHOP_EVENTS
3. Creates event panel using UnifiedEventLoader
4. Updates container with generated content
5. Handles errors with fallback error panels

**Data Validation:**
- Checks WORKSHOP_EVENTS global availability
- Validates specific workshop data existence
- Comprehensive error logging for debugging

### Error Handling

#### `showScheduleError(error)`
Displays user-friendly error interface for schedule rendering failures.

**Parameters:**
- `error` (Error) - Error object with failure details

**Features:**
- Styled error placeholder
- Error message display
- Console debugging reference

#### `showWorkshopLoadError(error)`
Handles workshop loading failures by updating placeholder containers.

**Parameters:**
- `error` (Error) - Error object with failure details

**Behavior:** Converts loading placeholders to error displays with failure message

### Filtering System

#### `filterEventsByCategory(categoryKey)`
Applies category-based filtering to schedule display.

**Parameters:**
- `categoryKey` (String) - Category identifier to filter by

**Process:**
1. Validates original data availability
2. Stores current filter category
3. Applies visual filtering to event panels
4. Uses grey-out approach for non-matching events

**Visual Effects:**
- Matching events: Highlighted with "filtered-in" class
- Non-matching events: Greyed out with "filtered-out" class

#### `resetFilter()`
Removes active filtering and displays all events normally.

**Process:**
1. Clears current filter category
2. Removes all filtering classes
3. Restores normal event visibility

#### `applyEventFiltering(categoryKey)`
Internal method that applies visual filtering to event panels.

**Parameters:**
- `categoryKey` (String) - Category to filter by

**Logic:**
1. Finds all event panels in schedule
2. Retrieves workshop data for each panel
3. Compares event category with filter category
4. Applies appropriate CSS classes for visual feedback

**Debugging:**
- Logs filtering decisions for each event
- Tracks match/non-match status
- Reports filtering application success

#### `clearEventFiltering()`
Internal method that removes all filtering classes from event panels.

**Behavior:** Removes "filtered-out" and "filtered-in" classes from all panels

### Lifecycle Management

#### `debug(...args)`
Conditional debug logging that respects global debug configuration.

**Condition:** Only logs when `window.NZGDC_DEBUG === true`

#### `destroy()`
Comprehensive cleanup method for proper generator disposal.

**Cleanup Process:**
1. Sets destruction flag to prevent further operations
2. Clears filter state and original data references
3. Clears workshop loading tracking
4. Destroys UnifiedEventLoader if cleanup method available
5. Clears container content if still in DOM
6. Nullifies all object references

**Error Handling:** Catches and logs cleanup failures without throwing

## Data Dependencies

### Required Global Objects

#### `window.WORKSHOP_EVENTS`
Workshop event data collection required for content loading.

**Validation:**
- Checked before attempting workshop content load
- Missing data triggers error logging and graceful degradation
- Individual workshop missing data handled with error panels

### Schedule Data Structure

The generator expects schedule data with this structure:

```javascript
{
  timeSlots: [
    {
      id: "morning",
      timeRange: "9.00am - 12.00pm",
      title: "Morning Workshops", 
      theme: "a",
      workshops: [
        {
          id: "workshop-a1",
          category: "Story & Narrative", 
          title: "Advanced Storytelling Techniques"
        }
      ]
    }
  ]
}
```

## Integration

### Global Availability
The class is available globally when loaded:
```javascript
window.ScheduleGenerator
```

### Module Support
Supports both CommonJS and browser global patterns:
```javascript
// CommonJS
const ScheduleGenerator = require('./schedule-generator.js');

// Browser Global  
const generator = new window.ScheduleGenerator(container);
```

### Widget System Integration
Used by:
- `NZGDCScheduleWidget` - Main widget class for schedule rendering
- Modular widget loaders for dependency management

## Usage Examples

### Basic Usage
```javascript
// Initialize generator
const container = document.getElementById('schedule-container');
const generator = new ScheduleGenerator(container);

// Render schedule
await generator.renderSchedule(SCHEDULE_DATA);

// Apply category filter
generator.filterEventsByCategory('PROGRAMMING');

// Reset filter
generator.resetFilter();

// Clean up when done
generator.destroy();
```

### Advanced Usage with Error Handling
```javascript
try {
  const generator = new ScheduleGenerator(container);
  
  // Enable debug mode
  window.NZGDC_DEBUG = true;
  
  // Render with data validation
  if (window.SCHEDULE_DATA && window.WORKSHOP_EVENTS) {
    await generator.renderSchedule(window.SCHEDULE_DATA);
    console.log('Schedule rendered successfully');
  } else {
    throw new Error('Required data not loaded');
  }
  
} catch (error) {
  console.error('Schedule generation failed:', error);
}
```

### Category Filtering
```javascript
// Filter by specific category
generator.filterEventsByCategory('ART');

// Check current filter
console.log('Current filter:', generator.currentFilterCategory);

// Clear filter and show all
generator.resetFilter();
```

## Performance Considerations

### Rendering Optimization
- **Document Fragment Usage**: Single DOM update for better performance
- **RequestAnimationFrame**: Async content loading after DOM stability  
- **Batch Operations**: Parallel workshop loading with Promise.allSettled
- **Template Reuse**: Single template load for all workshop panels

### Memory Management
- **Resource Tracking**: Set-based tracking of loaded workshops
- **Reference Cleanup**: Comprehensive nullification in destroy method
- **State Management**: Proper cleanup of filter state and original data
- **DOM Cleanup**: Container content clearing with existence checks

### Loading Strategy
- **Progressive Loading**: Layout first, content loading second
- **Failure Isolation**: Individual workshop failures don't affect others
- **Error Recovery**: Graceful degradation with error panels
- **Debug Integration**: Comprehensive logging for performance monitoring

## Error Handling Strategies

### Data Validation
- Global dependency checking before operations
- Individual workshop data validation
- Graceful handling of missing or invalid data

### Rendering Failures
- Schedule-level error handling with user-friendly messages
- Workshop-level error isolation with individual error panels
- Console error logging for developer debugging

### State Management
- Destruction flag prevents operations on destroyed instances
- Original data preservation for filtering operations
- Clean state reset in destroy method

## Debug Mode

Enable detailed logging:
```javascript
window.NZGDC_DEBUG = true;
```

Debug output includes:
- Schedule rendering progress and completion
- Workshop loading details and success/failure status
- Filtering application and event matching results
- Resource cleanup and destruction progress
- Performance timing information

## Browser Compatibility

- Modern browsers with ES6+ support
- Promise and async/await support required
- DOM manipulation and query selector APIs
- CSS class manipulation support
- DocumentFragment API for performance optimization

## Dependencies

**Required Classes:**
- `UnifiedEventLoader` - For event panel creation

**Required Global Data:**
- `window.WORKSHOP_EVENTS` - Workshop event data collection
- Schedule data object passed to renderSchedule method

**Optional Dependencies:**
- `window.NZGDC_DEBUG` - Debug mode configuration