# Morning Schedule Generator Documentation

## Overview

The `MorningScheduleGenerator` class is responsible for rendering and managing the NZGDC (New Zealand Game Developers Conference) morning session schedule interface. It handles the generation of time slots, event rows, panel layouts, break periods, and provides comprehensive filtering capabilities for category-based event display in the morning widget system.

## Purpose

This class serves as:
- Morning schedule layout generator and renderer
- Morning event content loader and manager
- Category-based filtering system for morning events
- Break period rendering and management
- Error handling and recovery system for morning sessions
- Resource cleanup and lifecycle management

## Class Structure

### Constructor

```javascript
constructor(container)
```

**Parameters:**
- `container` (Element) - DOM container where morning schedule will be rendered

**Properties Initialized:**
- `container` - Target DOM container element
- `eventLoader` - UnifiedEventLoader instance for panel creation
- `loadedEvents` - Set tracking successfully loaded morning events
- `isDestroyed` - Destruction state flag
- `originalData` - Cached original schedule data for filtering
- `currentFilterCategory` - Active filter category

## Core Methods

### Rendering System

#### `generateTimeSlot(timeSlot)`
Creates a complete time slot section with morning events or break periods.

**Parameters:**
- `timeSlot` (Object) - Time slot configuration object

**TimeSlot Object Structure:**
```javascript
{
  id: "early-morning",
  timeRange: "10.00am - 10.30am",
  title: "Early Morning Panels",
  theme: "early", // CSS theme identifier
  events: [/* event reference objects */]
}
```

**Break Slot Structure:**
```javascript
{
  id: "morning-break",
  type: "break",
  title: "Morning Break",
  timeRange: "10.30am - 10.55am (25 mins)"
}
```

**Returns:** `Element` - Generated time slot DOM element

**Behavior:**
- Detects break slots via `type: "break"` and delegates to `generateBreakBlock()`
- Creates themed morning time slot containers
- Generates session schedule information
- Creates container for morning events

#### `generateBreakBlock(breakSlot)`
Creates break period display blocks for morning schedule.

**Parameters:**
- `breakSlot` (Object) - Break slot configuration object

**Returns:** `Element` - Generated break block DOM element

**Features:**
- Simple title and duration display
- Special CSS classes for break styling
- No event content or loading

#### `generateEventRows(events)`
Organizes morning events into rows with intelligent layout management.

**Parameters:**
- `events` (Array) - Collection of morning event objects

**Layout Logic:**
1. **All Main Type**: 5 panels per row (compact square layout)
2. **Mixed Format**: 
   - Big panels first: 2 per row (featured wide layout)
   - Main panels second: 5 per row (compact layout)

**Returns:** `String` - HTML for all event rows

**Layout Strategies:**
- **Early Morning**: 10 main panels → 2 rows of 5 panels each
- **Mid Morning**: 2 big + 5 main → 1 row big panels + 1 row main panels
- **Late Morning**: 2 big + 5 main → 1 row big panels + 1 row main panels

#### `generateMorningEvent(event)`
Creates placeholder container for individual morning events.

**Parameters:**
- `event` (Object) - Morning event configuration object

**Event Object Structure:**
```javascript
{
  id: "panel-b1",
  category: "Game Design",
  title: "Panel: The Future of Multiplayer Design",
  type: "big" // or "main"
}
```

**Returns:** `String` - HTML for morning event container

**Container Types:**
- **Big Format**: `.nzgdc-morning-event` with `.nzgdc-morning-event-panel-container`
- **Main Format**: `.nzgdc-morning-event-main` with `.nzgdc-morning-event-panel-main-container`

**Features:**
- Loading placeholder during content load
- Data attributes for identification and filtering
- Event ID, type, category, and title attribution

#### `async renderSchedule(data)`
Main rendering method that generates the complete morning schedule interface.

**Parameters:**
- `data` (Object) - Complete morning schedule data object

**Process:**
1. Validates generator is not destroyed
2. Preserves original data for filtering via `preserveOriginalData()`
3. Clears existing content and tracking
4. Creates document fragment for performance
5. Generates all time slots (including breaks)
6. Single DOM update operation
7. Initiates asynchronous event content loading

**Error Handling:** Catches rendering failures and displays morning-specific error interface

### Content Loading System

#### `async loadEventContent()`
Loads actual morning event content into placeholder containers.

**Process:**
1. Loads UnifiedEventLoader template once
2. Finds all morning event containers (both formats)
3. Creates batch loading promises for all events
4. Tracks successful loads for cleanup
5. Handles individual event failures gracefully
6. Reapplies active filter after content loading

**Performance Features:**
- Single template load for all morning events
- Batch DOM operations with Promise.allSettled
- Individual failure isolation
- Filter state preservation across content loading

#### `async loadSingleEvent(container)`
Loads content for a single morning event container.

**Parameters:**
- `container` (Element) - Morning event container DOM element

**Process:**
1. Extracts event ID and format type from container
2. Retrieves event data from MORNING_EVENTS global
3. Creates event panel using UnifiedEventLoader with "morning" widget type
4. Updates container with generated content
5. Handles errors with fallback error panels

**Data Validation:**
- Checks MORNING_EVENTS global availability
- Validates specific morning event data existence
- Comprehensive error logging for debugging

### Filtering System

#### `preserveOriginalData(scheduleData)`
Stores original schedule data for filter reset functionality.

**Parameters:**
- `scheduleData` (Object) - Original morning schedule data

**Behavior:**
- Deep clones data on first call only
- Prevents multiple data preservation
- Enables filter reset functionality

#### `filterEventsByCategory(categoryKey)`
Applies category-based filtering to morning schedule display.

**Parameters:**
- `categoryKey` (String) - Category identifier to filter by

**Process:**
1. Validates original data availability
2. Stores current filter category
3. Applies visual filtering via `applyEventFiltering()`
4. Uses grey-out approach for non-matching events

**Visual Effects:**
- Matching events: Highlighted with "filtered-in" class
- Non-matching events: Greyed out with "filtered-out" class

#### `resetFilter()`
Removes active filtering and displays all morning events normally.

**Process:**
1. Clears current filter category
2. Removes all filtering classes via `clearEventFiltering()`
3. Restores normal event visibility

#### `applyEventFiltering(categoryKey)`
Internal method that applies visual filtering to morning event panels.

**Parameters:**
- `categoryKey` (String) - Category to filter by

**Logic:**
1. Finds all morning event panels (both container types)
2. Retrieves MORNING_EVENTS data for each panel
3. Compares event category with filter category
4. Applies appropriate CSS classes for visual feedback

**Container Types Handled:**
- `.nzgdc-morning-event-panel-container` (big format)
- `.nzgdc-morning-event-panel-main-container` (main format)

**Debugging:**
- Comprehensive logging of filtering decisions
- Event data availability validation
- Category comparison logging
- Filter application success reporting

#### `clearEventFiltering()`
Internal method that removes all filtering classes from morning event panels.

**Behavior:** Removes "filtered-out" and "filtered-in" classes from all morning event containers

### Error Handling

#### `showScheduleError(error)`
Displays user-friendly error interface for morning schedule rendering failures.

**Parameters:**
- `error` (Error) - Error object with failure details

**Features:**
- Morning-specific error styling
- Error message display
- Console debugging reference

#### `showEventLoadError(error)`
Handles morning event loading failures by updating placeholder containers.

**Parameters:**
- `error` (Error) - Error object with failure details

**Behavior:** Converts loading placeholders to error displays with morning-specific styling

### Lifecycle Management

#### `debug(...args)`
Conditional debug logging that respects global debug configuration.

**Condition:** Only logs when `window.NZGDC_DEBUG === true`

**Prefix:** `[NZGDC Morning Schedule Generator]` for identification

#### `destroy()`
Comprehensive cleanup method for proper generator disposal.

**Cleanup Process:**
1. Sets destruction flag to prevent further operations
2. Clears morning event loading tracking
3. Destroys UnifiedEventLoader if cleanup method available
4. Clears container content if still in DOM
5. Nullifies all object references

**Error Handling:** Catches and logs cleanup failures without throwing

## Data Dependencies

### Required Global Objects

#### `window.MORNING_EVENTS`
Morning event data collection required for content loading.

**Validation:**
- Checked before attempting morning event content load
- Missing data triggers error logging and graceful degradation
- Individual morning event missing data handled with error panels

### Morning Schedule Data Structure

The generator expects morning schedule data with this structure:

```javascript
{
  timeSlots: [
    {
      id: "early-morning",
      timeRange: "10.00am - 10.30am",
      title: "Early Morning Panels",
      theme: "early",
      events: [
        {
          id: "panel-e1",
          category: "Story & Narrative",
          title: "Advanced Storytelling in Games",
          type: "main"
        }
      ]
    },
    {
      id: "morning-break",
      type: "break", 
      title: "Morning Break",
      timeRange: "10.30am - 10.55am (25 mins)"
    }
  ]
}
```

## Integration

### Global Availability
The class is available globally when loaded:
```javascript
window.MorningScheduleGenerator
```

### Module Support
Supports both CommonJS and browser global patterns:
```javascript
// CommonJS
const MorningScheduleGenerator = require('./morning-schedule-generator.js');

// Browser Global  
const generator = new window.MorningScheduleGenerator(container);
```

### Widget System Integration
Used by:
- `NZGDCMorningScheduleWidget` - Main morning widget class for schedule rendering
- Morning-specific modular widget loaders for dependency management

## Usage Examples

### Basic Usage
```javascript
// Initialize morning generator
const container = document.getElementById('morning-schedule-container');
const generator = new MorningScheduleGenerator(container);

// Render morning schedule
await generator.renderSchedule(MORNING_SCHEDULE_DATA);

// Apply category filter
generator.filterEventsByCategory('STORY_NARRATIVE');

// Reset filter
generator.resetFilter();

// Clean up when done
generator.destroy();
```

### Advanced Usage with Error Handling
```javascript
try {
  const generator = new MorningScheduleGenerator(container);
  
  // Enable debug mode
  window.NZGDC_DEBUG = true;
  
  // Render with data validation
  if (window.MORNING_SCHEDULE_DATA && window.MORNING_EVENTS) {
    await generator.renderSchedule(window.MORNING_SCHEDULE_DATA);
    console.log('Morning schedule rendered successfully');
  } else {
    throw new Error('Required morning data not loaded');
  }
  
} catch (error) {
  console.error('Morning schedule generation failed:', error);
}
```

### Category Filtering for Morning Events
```javascript
// Filter by specific morning category
generator.filterEventsByCategory('PROGRAMMING');

// Check current filter
console.log('Current morning filter:', generator.currentFilterCategory);

// Clear filter and show all morning events
generator.resetFilter();
```

## Layout Management

### Panel Format Handling

#### Main Format Panels (300x300)
- **Usage**: Quick 30-minute sessions
- **Layout**: 5 panels per row
- **Container**: `.nzgdc-morning-event-main`
- **Target**: Compact display for high event density

#### Big Format Panels (620x300)
- **Usage**: Featured 50-minute sessions
- **Layout**: 2 panels per row
- **Container**: `.nzgdc-morning-event`
- **Target**: Detailed display for important content

### Row Organization Strategies

#### All Main Layout (Early Morning)
```javascript
// 10 main panels → 2 rows of 5 panels each
Row 1: [panel-e1] [panel-e2] [panel-e3] [panel-e4] [panel-e5]
Row 2: [panel-e6] [panel-e7] [panel-e8] [panel-e9] [panel-e10]
```

#### Mixed Layout (Mid/Late Morning)
```javascript
// 2 big + 5 main → big panels first, then main panels
Big Row:  [panel-b1 (big)] [panel-b2 (big)]
Main Row: [panel-m1] [panel-m2] [panel-m3] [panel-m4] [panel-m5]
```

## Performance Considerations

### Rendering Optimization
- **Document Fragment Usage**: Single DOM update for better performance
- **RequestAnimationFrame**: Async content loading after DOM stability
- **Batch Operations**: Parallel morning event loading with Promise.allSettled
- **Template Reuse**: Single template load for all morning event panels
- **Break Handling**: Efficient break slot identification and rendering

### Memory Management
- **Resource Tracking**: Set-based tracking of loaded morning events
- **Reference Cleanup**: Comprehensive nullification in destroy method
- **State Management**: Proper cleanup of filter state and original data
- **DOM Cleanup**: Container content clearing with existence checks
- **Filter Preservation**: Maintains filter state across content reloads

### Loading Strategy
- **Progressive Loading**: Layout first, content loading second
- **Failure Isolation**: Individual morning event failures don't affect others
- **Error Recovery**: Graceful degradation with morning-specific error panels
- **Debug Integration**: Comprehensive logging for performance monitoring

## Error Handling Strategies

### Data Validation
- MORNING_EVENTS global dependency checking before operations
- Individual morning event data validation
- Break slot identification and special handling
- Graceful handling of missing or invalid morning event data

### Rendering Failures
- Morning schedule-level error handling with user-friendly messages
- Morning event-level error isolation with individual error panels
- Break period rendering error handling
- Console error logging for developer debugging

### State Management
- Destruction flag prevents operations on destroyed instances
- Original data preservation for filtering operations
- Clean state reset in destroy method
- Filter state management across content loading cycles

## Debug Mode

Enable detailed logging:
```javascript
window.NZGDC_DEBUG = true;
```

Debug output includes:
- Morning schedule rendering progress and completion
- Morning event loading details and success/failure status
- Break period rendering information
- Filtering application and morning event matching results
- Layout decision logging (main vs big format handling)
- Resource cleanup and destruction progress
- Performance timing information for morning-specific operations

## Browser Compatibility

- Modern browsers with ES6+ support
- Promise and async/await support required
- DOM manipulation and query selector APIs
- CSS class manipulation support
- DocumentFragment API for performance optimization

## Dependencies

**Required Classes:**
- `UnifiedEventLoader` - For morning event panel creation

**Required Global Data:**
- `window.MORNING_EVENTS` - Morning event data collection
- Morning schedule data object passed to renderSchedule method

**Optional Dependencies:**
- `window.NZGDC_DEBUG` - Debug mode configuration

## Specialized Features

### Break Period Management
- Automatic break slot detection via `type: "break"`
- Special break block rendering with different HTML structure
- No event loading or filtering applied to break periods
- Break-specific CSS classes for styling

### Morning-Specific Theming
- Theme `early` for yellow morning energy styling
- Theme `mid` for bright yellow peak activity styling
- Morning-specific CSS class generation
- Theme coordination with morning schedule data

### Category Filtering Integration
- Seamless integration with UnifiedEventLoader category system
- Morning event category validation and normalization
- Visual feedback with grey-out non-matching events
- Filter state preservation across content reloads