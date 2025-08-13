# Afternoon Schedule Data Documentation

## Overview

The `afternoon-schedule-data.js` file contains the configuration data that defines the structure and organization of NZGDC (New Zealand Game Developers Conference) afternoon session schedules. This module provides the foundational data structure used by the afternoon widget system to organize and display afternoon events in time-based slots with break periods.

## Purpose

This data module serves as:
- Configuration backbone for afternoon schedule layout and organization
- Time slot definition and afternoon event grouping system
- Theme-based styling control for different afternoon schedule sections
- Event-to-time-slot mapping and organization with break management
- Structural foundation for afternoon schedule rendering
- Break period scheduling and display configuration

## Data Structure

### Global Constant

```javascript
const AFTERNOON_SCHEDULE_DATA = {
  timeSlots: [
    {
      id: "unique-identifier",
      timeRange: "time-display-format", 
      title: "Section Title",
      theme: "styling-theme",
      type: "event-type", // Optional: "break" for break periods
      events: [/* event reference objects */] // Only for event slots
    }
  ]
}
```

### Time Slot Object Properties

Each time slot contains the following properties:

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `id` | String | Unique identifier for the time slot | Yes |
| `timeRange` | String | Human-readable time range display | Yes |
| `title` | String | Section title for the time slot | Yes |
| `theme` | String | CSS theme identifier for styling | Conditional* |
| `type` | String | Slot type ("break" for break periods) | No |
| `events` | Array | Collection of event reference objects | Conditional** |

*Required for event slots, not used for break slots
**Required for event slots, not used for break slots

### Event Reference Object Structure

```javascript
{
  id: "panel-identifier",
  category: "Display Category Name", 
  title: "Event Display Title",
  type: "panel-format" // "big" or "main"
}
```

### Break Slot Structure

```javascript
{
  id: "break-identifier",
  type: "break",
  title: "Break Title",
  timeRange: "break-duration-display"
}
```

## Available Time Slots

### Early Afternoon Panels (1:25 PM - 1:55 PM)

**Configuration:**
- **ID**: `early-afternoon`
- **Theme**: `early` (Blue theme styling)
- **Duration**: 30 minutes
- **Event Count**: 10 events
- **Panel Type**: All "main" format (300x300 square panels)

**Events Included:**
1. **panel-e1**: Advanced Storytelling in Games (Story & Narrative)
2. **panel-e2**: Character Development Workshop (Story & Narrative)
3. **panel-e3**: Interactive Narrative Design (Story & Narrative)
4. **panel-e4**: Branching Storylines (Story & Narrative)
5. **panel-e5**: Writing for Games (Story & Narrative)
6. **panel-e6**: Dialogue Systems (Story & Narrative)
7. **panel-e7**: Narrative in VR (Story & Narrative)
8. **panel-e8**: Player Choice Impact (Story & Narrative)
9. **panel-e9**: Emotional Storytelling (Story & Narrative)
10. **panel-e10**: Story Structure in Games (Story & Narrative)

**Note:** All events in this slot are categorized as "Story & Narrative" in the schedule data (category normalization occurs via event data)

### Afternoon Break (1:55 PM - 2:20 PM)

**Configuration:**
- **ID**: `afternoon-break`
- **Type**: `break`
- **Duration**: 25 minutes
- **Display**: "Afternoon Break"

### Mid Afternoon Sessions (2:20 PM - 3:10 PM)

**Configuration:**
- **ID**: `mid-afternoon`
- **Theme**: `mid` (Blue theme styling)
- **Duration**: 50 minutes
- **Event Count**: 7 events
- **Panel Types**: Mixed (2 "big", 5 "main")

**Events Included:**
1. **panel-b1**: Panel: The Future of Multiplayer Design (Game Design) - **Big Format**
2. **panel-b2**: Workshop: Monetization Strategies for Indies (Business) - **Big Format**
3. **panel-m1**: Game Audio Fundamentals (Audio & Music) - **Main Format**
4. **panel-m2**: Level Design Principles (Game Design) - **Main Format**
5. **panel-m3**: UI/UX for Indies (UI/UX) - **Main Format**
6. **panel-m4**: Procedural Generation (Technical) - **Main Format**
7. **panel-m5**: Community Management 101 (Community) - **Main Format**

### Late Afternoon Sessions (3:20 PM - 3:50 PM)

**Configuration:**
- **ID**: `late-afternoon`
- **Theme**: `early` (Blue theme styling - reused)
- **Duration**: 30 minutes
- **Event Count**: 7 events
- **Panel Types**: Mixed (2 "big", 5 "main")

**Events Included:**
1. **panel-l1**: Advanced Programming Techniques (Programming) - **Main Format**
2. **panel-l2**: Visual Design for Indie Games (Art & Design) - **Main Format**
3. **panel-l3**: Social Media for Game Developers (Marketing) - **Main Format**
4. **panel-l4**: Funding Your Game Studio (Business) - **Main Format**
5. **panel-l5**: Portfolio Building Workshop (Career) - **Main Format**
6. **panel-l6**: Panel: Advanced Story Development (Story & Narrative) - **Big Format**
7. **panel-l7**: Workshop: Character Design Mastery (Art & Design) - **Big Format**

### Speaker & Sponsor Party (5:30 PM - 7:30 PM)

**Configuration:**
- **ID**: `speaker-sponsor-party`
- **Type**: `break`
- **Duration**: 2 hours
- **Display**: "Speaker & Sponsor Party"

## Theme System

### Theme Styling Control

The `theme` property controls CSS styling for different afternoon schedule sections:

| Theme ID | Color Scheme | Usage | Visual Style |
|----------|--------------|-------|--------------|
| `early` | Blue | Early afternoon & late afternoon panels | Cool, professional afternoon energy |
| `mid` | Blue | Mid-afternoon sessions | High activity, peak afternoon focus |

### CSS Class Generation

Theme values generate corresponding CSS classes:
- Theme `early` → `.nzgdc-afternoon-time-category-early`
- Theme `mid` → `.nzgdc-afternoon-time-category-mid`

## Panel Format System

### Panel Types and Layout

| Format | Dimensions | Usage | Layout Strategy |
|--------|------------|--------|-----------------|
| `main` | 300x300 square | Quick sessions, compact display | 5 panels per row |
| `big` | 620x300 wide | Featured panels, detailed content | 2 panels per row |

### Format Distribution

- **Total Events**: 24 afternoon events
- **Main Format**: 20 events (83.3%) - Compact square panels
- **Big Format**: 4 events (16.7%) - Featured wide panels

### Layout Behavior

**All Main Type Slots:**
- Early Afternoon: 10 main panels → 2 rows (5 panels each)

**Mixed Format Slots:**
- Mid Afternoon: 2 big + 5 main → Big panels in first row, main panels in second row
- Late Afternoon: 2 big + 5 main → Big panels in first row, main panels in second row

## Category Representation in Schedule Data

### Schedule Categories vs. Event Categories

The schedule data uses simplified category names that may differ from the normalized category keys in afternoon events data:

| Schedule Data Category | Afternoon Events CategoryKey | Event Count |
|------------------------|----------------------------|-------------|
| Story & Narrative | STORY_NARRATIVE | 12 events |
| Game Design | GAME_DESIGN | 2 events |
| Business | BUSINESS_MARKETING | 2 events |
| Audio & Music | AUDIO | 1 event |
| UI/UX | ART | 1 event |
| Technical | PROGRAMMING | 1 event |
| Community | CULTURE | 1 event |
| Programming | PROGRAMMING | 1 event |
| Art & Design | ART | 2 events |
| Marketing | BUSINESS_MARKETING | 1 event |
| Career | PRODUCTION_QA | 1 event |

### Category Normalization Requirements

The schedule data serves as a display layer, while actual filtering and categorization rely on the `AFTERNOON_EVENTS` data with normalized category keys.

## Break Management System

### Break Types

1. **Afternoon Break** - Short 25-minute break between early and mid-afternoon sessions
2. **Speaker & Sponsor Party** - Extended 2-hour networking event after afternoon activities

### Break Slot Properties

- **No Theme**: Break slots don't use theme styling
- **No Events**: Break slots don't contain event arrays
- **Special Type**: `type: "break"` identifies break slots
- **Time Display**: Shows both break name and duration

### Break Rendering

Break slots are handled differently by the schedule generator:
- Generate special break block HTML structure
- No event loading or filtering applied
- Simple title and time range display
- Different CSS classes for break-specific styling

## Integration

### Global Availability
The afternoon schedule data is available globally when the module is loaded:
```javascript
window.AFTERNOON_SCHEDULE_DATA
```

### Module Support
Supports both CommonJS and browser global patterns:
```javascript
// CommonJS
const AFTERNOON_SCHEDULE_DATA = require('./afternoon-schedule-data.js');

// Browser Global
const data = window.AFTERNOON_SCHEDULE_DATA;
```

### Usage in Widget System
The afternoon schedule data is consumed by:
- `AfternoonScheduleGenerator` - For rendering afternoon schedule layout and structure
- `NZGDCAfternoonScheduleWidget` - For validation and initialization
- Afternoon event rendering system for time slot organization
- Break period rendering and management

## Usage Examples

### Accessing Afternoon Schedule Structure
```javascript
// Get all time slots (including breaks)
const timeSlots = AFTERNOON_SCHEDULE_DATA.timeSlots;
console.log(`Total time slots: ${timeSlots.length}`);

// Filter event slots only
const eventSlots = timeSlots.filter(slot => slot.type !== 'break');
console.log(`Event slots: ${eventSlots.length}`);

// Filter break slots only
const breakSlots = timeSlots.filter(slot => slot.type === 'break');
console.log(`Break slots: ${breakSlots.length}`);
```

### Event Format Analysis
```javascript
function analyzePanelFormats() {
  const analysis = {
    totalEvents: 0,
    bigPanels: 0,
    mainPanels: 0,
    byTimeSlot: {}
  };
  
  AFTERNOON_SCHEDULE_DATA.timeSlots.forEach(slot => {
    if (slot.events) {
      analysis.byTimeSlot[slot.id] = {
        total: slot.events.length,
        big: slot.events.filter(e => e.type === 'big').length,
        main: slot.events.filter(e => e.type === 'main').length
      };
      
      analysis.totalEvents += slot.events.length;
      analysis.bigPanels += slot.events.filter(e => e.type === 'big').length;
      analysis.mainPanels += slot.events.filter(e => e.type === 'main').length;
    }
  });
  
  return analysis;
}
```

### Schedule Timeline Analysis
```javascript
function getScheduleTimeline() {
  return AFTERNOON_SCHEDULE_DATA.timeSlots.map(slot => ({
    id: slot.id,
    title: slot.title,
    timeRange: slot.timeRange,
    type: slot.type || 'event',
    theme: slot.theme || 'none',
    eventCount: slot.events ? slot.events.length : 0,
    duration: calculateSlotDuration(slot.timeRange)
  }));
}

function calculateSlotDuration(timeRange) {
  // Parse time range and calculate duration
  const match = timeRange.match(/\(([^)]+)\)/);
  return match ? match[1] : 'variable';
}
```

### Category Distribution in Schedule
```javascript
function getScheduleCategoryDistribution() {
  const distribution = {};
  
  AFTERNOON_SCHEDULE_DATA.timeSlots.forEach(slot => {
    if (slot.events) {
      slot.events.forEach(event => {
        const category = event.category;
        distribution[category] = (distribution[category] || 0) + 1;
      });
    }
  });
  
  return Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
}
```

## Data Relationship

### Connection to Afternoon Events
Schedule data references events that must exist in the `AFTERNOON_EVENTS` collection:

```javascript
// Schedule data references
const scheduleEventIds = AFTERNOON_SCHEDULE_DATA.timeSlots
  .filter(slot => slot.events)
  .flatMap(slot => slot.events.map(e => e.id));

// Must exist in AFTERNOON_EVENTS
scheduleEventIds.forEach(id => {
  if (!AFTERNOON_EVENTS[id]) {
    console.error(`Missing afternoon event data for: ${id}`);
  }
});
```

### Data Consistency Requirements
- All event IDs in schedule data must have corresponding entries in AFTERNOON_EVENTS
- Category names serve as display layer (actual filtering uses AFTERNOON_EVENTS categoryKey)
- Time slot IDs should be unique within the afternoon schedule
- Event IDs should be unique across all time slots
- Panel format types must be "big" or "main"
- Break slots must have type: "break" and no events array

## Configuration Guidelines

### Time Slot Configuration
- **Unique IDs**: Each time slot must have a unique identifier
- **Clear Time Ranges**: Use consistent time format with duration indicators for breaks
- **Descriptive Titles**: Clear section titles for user understanding
- **Theme Consistency**: Use established theme identifiers for event slots
- **Break Identification**: Use type: "break" for break periods

### Event Organization
- **Format Balance**: Mix big and main formats appropriately for visual variety
- **Category Diversity**: Distribute different categories across time slots
- **Logical Grouping**: Group related events when appropriate
- **Layout Considerations**: Consider row layout (5 main panels, 2 big panels per row)

### Break Management
- **Realistic Duration**: Ensure break periods are appropriate length
- **Clear Identification**: Use descriptive titles and duration indicators
- **Consistent Formatting**: Maintain consistent break slot structure

## Maintenance

### Adding Time Slots
1. Create unique time slot ID
2. Define appropriate time range and title
3. Select theme identifier (for event slots) or set type: "break"
4. Populate events array with references (for event slots only)
5. Ensure corresponding CSS theme classes exist
6. Consider impact on overall schedule flow

### Modifying Event References
1. Update event ID references to match AFTERNOON_EVENTS keys
2. Ensure category names provide good display representation
3. Update display titles if event titles change
4. Maintain format type accuracy ("big" or "main")
5. Consider layout impact of format changes

### Break Period Updates
1. Adjust break duration based on schedule needs
2. Update time ranges to reflect actual schedule timing
3. Ensure break periods don't conflict with event slots
4. Consider impact on overall schedule flow

### Theme Updates
1. Update theme identifiers in schedule data
2. Create or update corresponding CSS classes
3. Test visual styling across all time slots
4. Ensure accessibility compliance
5. Maintain visual consistency across afternoon themes

## Performance Considerations

- **Static Configuration**: No dynamic loading or API dependencies
- **Lightweight Structure**: Essential configuration data only
- **Fast Access**: Simple object structure for efficient parsing
- **Memory Efficient**: Small footprint with 3 event slots + 2 breaks
- **Break Handling**: Efficient break slot identification and rendering

## Browser Compatibility

- Pure JavaScript object structure
- Compatible with all browsers (no ES6+ features required)
- No external dependencies or complex operations
- Standard JSON-compatible data format

## Dependencies

### Required by Afternoon Schedule Data
- No direct dependencies (standalone configuration)

### Required for Afternoon Schedule Data
This module is a dependency for:
- `AfternoonScheduleGenerator` - Uses data for afternoon schedule structure and rendering
- `NZGDCAfternoonScheduleWidget` - Validates data availability during initialization
- Afternoon event rendering system - Uses time slot organization for display
- Break period management system

### Related Data Modules
- **AFTERNOON_EVENTS** - Contains detailed afternoon event information referenced by IDs
- **Category mapping systems** - May require category name normalization for filtering
- **Theme CSS files** - Must include corresponding theme styling classes for afternoon themes

## Schedule Statistics Summary

- **Total Time Slots**: 5 (3 event slots + 2 break slots)
- **Total Events**: 24 afternoon events across all slots
- **Event Distribution**: 10 (early) + 7 (mid) + 7 (late) events
- **Break Periods**: 2 breaks (25 min afternoon break + 2 hour sponsor party)
- **Format Distribution**: 20 main panels (83.3%) + 4 big panels (16.7%)
- **Theme Usage**: 2 themes (early, mid) across 3 event slots
- **Time Coverage**: ~1.75 hours of events + 2.4 hours of breaks = ~4.15 hour afternoon schedule