# Dynamic Event Times Container Management Documentation

## Overview

The Dynamic Event Times Container system represents a major architectural enhancement to the NZGDC widget system. This functionality transforms the previously static "generate-and-forget" Event Times Containers into intelligent, dynamic organizers that automatically group and sort events based on their actual API time data.

---

## Problem Solved

### Previous Architecture Issues
- **Static Time Blocks**: Event Times Containers were hardcoded with fixed times and themes
- **No Real Schedule Organization**: Events weren't organized by their actual `startTime` and `endTime` from the API
- **Manual Time Management**: Developers had to manually define time slots in data files
- **Inconsistent Separation of Concerns**: Event Times Containers lacked ID-based targeting for dynamic updates

### New Dynamic Approach
- **✅ API-Driven Organization**: Events automatically grouped by real `startTime` data
- **✅ Intelligent Sorting**: Events sorted by duration (longest first) then alphabetically
- **✅ Dynamic Updates**: Time blocks refresh when event data changes
- **✅ Separation of Concerns**: ID + Class pattern for JavaScript targeting and CSS styling

---

## Core Architecture

### ScheduleTimeManager Class

The `ScheduleTimeManager` is the central orchestrator for dynamic time-based event organization:

```javascript
// Initialize the time manager
const timeManager = new ScheduleTimeManager();
timeManager.enableDebug(true);

// Process events into dynamic time blocks
const timeBlockElements = timeManager.processEventsIntoTimeBlocks(events, 'schedule');
```

#### Key Responsibilities:
1. **Time Block Generation**: Groups events by `startTime` into chronological blocks
2. **Event Sorting**: Sorts events within blocks by duration, then alphabetically
3. **HTML Generation**: Creates time block containers with ID + Class separation of concerns
4. **Dynamic Updates**: Refreshes time blocks when event data changes
5. **Theme Management**: Assigns appropriate themes based on time periods

---

## Event Processing Pipeline

### 1. Time Block Grouping
Events are automatically grouped by their `startTime`:

```javascript
// Events with same startTime are grouped together
const events = [
  { startTime: "09:00", endTime: "10:30", title: "Advanced Unity..." },  // 90 min
  { startTime: "09:00", endTime: "10:00", title: "Indie Marketing..." }, // 60 min
  { startTime: "10:30", endTime: "12:00", title: "Character Design..." } // 90 min
];

// Results in 2 time blocks:
// - Block 1: "09:00" (2 events)
// - Block 2: "10:30" (1 event)
```

### 2. Hierarchical Panel Type Sorting
Within each time block, events are sorted by a three-level hierarchy:
1. **Panel Type** (Big panels first, then Main panels)
2. **Duration** (longest first within each panel type)
3. **Title** (alphabetical for same panel type and duration)

```javascript
// Example: 09:00 time block with mixed panel types and durations
const events = [
  { title: "Game Design Workshop", panelType: "main", duration: 90 },    // Main, 90 min
  { title: "Advanced Unity Panel", panelType: "big", duration: 60 },     // Big, 60 min
  { title: "Art Direction Panel", panelType: "big", duration: 90 }       // Big, 90 min
];

// After hierarchical sorting:
// 1. "Art Direction Panel" (Big panel, 90 minutes) - Big + longest duration
// 2. "Advanced Unity Panel" (Big panel, 60 minutes) - Big + shorter duration  
// 3. "Game Design Workshop" (Main panel, 90 minutes) - Main panels come last
```

### 3. Time Range Calculation
Each time block calculates its display range from the contained events:

```javascript
// Time block with events 09:00-10:30 and 09:00-10:00
// Results in: "9.00am - 10.30am"
```

### 4. Theme Assignment
Themes are dynamically assigned based on time periods:

- **Early Morning** (before 10am): `early-morning`
- **Late Morning** (10am-12pm): `late-morning`  
- **Early Afternoon** (12pm-3pm): `early-afternoon`
- **Late Afternoon** (3pm+): `late-afternoon`

### 5. Panel Type Organization
Events are organized within each time block by panel type:
- **Big Panels** (2+ speakers): Displayed first within each time block
- **Main Panels** (0-1 speakers): Displayed after Big panels within each time block

### 6. Complete Hierarchical Organization Example

```javascript
// Example: 09:00 AM time block with mixed events
const timeBlockEvents = [
  {
    title: "Unity Performance Workshop",
    startTime: "09:00", endTime: "10:30",
    speakers: [{ name: "Sarah" }, { name: "Mike" }] // 2 speakers = BIG panel
  },
  {
    title: "Indie Marketing Strategies", 
    startTime: "09:00", endTime: "10:00",
    speakers: [{ name: "Alex" }] // 1 speaker = MAIN panel
  },
  {
    title: "Advanced Shader Techniques",
    startTime: "09:00", endTime: "09:45", 
    speakers: [{ name: "Jordan" }] // 1 speaker = MAIN panel
  },
  {
    title: "Game Design Panel Discussion",
    startTime: "09:00", endTime: "10:15",
    speakers: [{ name: "Emma" }, { name: "David" }, { name: "Lisa" }] // 3 speakers = BIG panel
  }
];

// After hierarchical sorting, display order becomes:
// 🟦 BIG PANELS (displayed first):
//   1. "Game Design Panel Discussion" (90 min) - Big panel, longest duration
//   2. "Unity Performance Workshop" (90 min) - Big panel, same duration, alphabetical
//
// 🟩 MAIN PANELS (displayed after Big panels):  
//   3. "Indie Marketing Strategies" (60 min) - Main panel, longest duration among mains
//   4. "Advanced Shader Techniques" (45 min) - Main panel, shorter duration

// Visual Layout:
// ┌─── 9.00am - 10.30am (Early Morning Sessions) ───┐
// │  🟦 BIG PANEL ROW                               │
// │    ┌─ Game Design Panel ─┐ ┌─ Unity Workshop ─┐ │
// │    │   (3 speakers)      │ │   (2 speakers)   │ │  
// │    └────────────────────┘ └──────────────────┘ │
// │  🟩 MAIN PANEL ROW                              │
// │    ┌─ Indie Marketing ──┐ ┌─ Shader Tech ─────┐ │
// │    │   (1 speaker)     │ │   (1 speaker)     │ │
// │    └───────────────────┘ └───────────────────┘ │
// └─────────────────────────────────────────────────┘
```

This ensures that major multi-speaker events (Big panels) get visual priority at the top of each time block, followed by individual speaker events (Main panels), with intelligent duration and alphabetical sorting within each panel type.

---

## HTML Structure with Separation of Concerns

### Generated Time Block Container

```html
<!-- Time block with both ID and Class for separation of concerns -->
<div class="nzgdc-time-category nzgdc-time-category-early-morning" 
     data-time-slot="time-block-0900" 
     data-start-time="09:00">
  
  <!-- Event Times Container -->
  <div class="nzgdc-event-times-early-morning" 
       id="time-block-container-1704123456789-1">
          
    <div class="nzgdc-session-schedule" 
         id="time-block-schedule-1704123456789-1">
      <div class="nzgdc-session-times" 
           id="time-block-times-1704123456789-1">9.00am - 10.30am</div>
      <div class="nzgdc-session-title" 
           id="time-block-title-1704123456789-1">Early Morning Sessions</div>
    </div>
          
    <div class="nzgdc-underline" 
         id="time-block-underline-1704123456789-1"></div>
  </div>

  <!-- Events Container with Panel Type Hierarchy -->
  <div class="nzgdc-scheduled-events" 
       id="time-block-events-1704123456789-1">
          
    <!-- Big Panel Rows (displayed first) -->
    <div class="nzgdc-workshop-row nzgdc-big-panel-row">
      <div class="nzgdc-workshop-event nzgdc-big-event" data-panel-type="big">
        <!-- Big panel content -->
      </div>
    </div>
          
    <!-- Main Panel Rows (displayed after Big panels) -->
    <div class="nzgdc-workshop-row nzgdc-main-panel-row">
      <div class="nzgdc-workshop-event nzgdc-main-event" data-panel-type="main">
        <!-- Main panel content -->
      </div>
    </div>
  </div>
</div>
```

### ID Naming Convention

**Time Block Elements**:
- `time-block-container-{uniqueId}` - Main time container
- `time-block-schedule-{uniqueId}` - Schedule information container  
- `time-block-times-{uniqueId}` - Time range display
- `time-block-title-{uniqueId}` - Time block title
- `time-block-underline-{uniqueId}` - Visual separator
- `time-block-events-{uniqueId}` - Events container

**Unique ID Format**: `{timestamp}-{counter}` (e.g., `1704123456789-1`)

---

## API Integration

### Required Event Data Structure

```javascript
const eventData = {
  "event-001": {
    id: "event-001",
    title: "Event Title",
    startTime: "09:00",    // REQUIRED: HH:MM format
    endTime: "10:30",      // REQUIRED: HH:MM format
    category: "Programming",
    categoryKey: "PROGRAMMING",
    speakers: [...],
    description: "..."
  }
};
```

### Data Validation

The system validates event data and handles missing information:

```javascript
// Events without startTime are filtered out
const validEvents = events.filter(event => event.startTime);

// Missing endTime defaults to startTime (0 duration)
const duration = calculateDuration(event.startTime, event.endTime || event.startTime);
```

---

## Widget Integration

### Thursday Schedule Widget

```javascript
// In ScheduleGenerator class
async renderDynamicSchedule(eventData) {
  const events = Object.values(eventData).filter(event => 
    event.startTime && event.endTime
  );
  
  const timeBlockElements = this.generateDynamicTimeBlocks(events);
  
  // Clear and populate container
  this.container.innerHTML = "";
  timeBlockElements.forEach(element => {
    this.container.appendChild(element);
  });
}
```

### Morning/Afternoon Widgets

```javascript
// Automatic filtering by time period
const morningEvents = events.filter(event => {
  const hour = parseInt(event.startTime.split(':')[0], 10);
  return hour < 12; // Before noon
});

const morningTimeBlocks = timeManager.processEventsIntoTimeBlocks(
  morningEvents, 
  'morning'
);
```

---

## CSS Theme Support

### Dynamic Theme Classes

The system generates CSS classes based on time periods:

```css
/* Early Morning Events (before 10am) */
.nzgdc-schedule-widget .nzgdc-event-times-early-morning {
    background-color: var(--color-yellow);
    height: 81px;
}

/* Late Morning Events (10am-12pm) */  
.nzgdc-schedule-widget .nzgdc-event-times-late-morning {
    background-color: var(--color-yellow);
    opacity: 0.9;
}

/* Early Afternoon Events (12pm-3pm) */
.nzgdc-schedule-widget .nzgdc-event-times-early-afternoon {
    background-color: var(--color-blue);
}

/* Late Afternoon Events (3pm+) */
.nzgdc-schedule-widget .nzgdc-event-times-late-afternoon {
    background-color: var(--color-blue);
    opacity: 0.9;
}
```

### Widget-Specific Prefixes

- **Thursday**: `nzgdc-event-times-{theme}`
- **Morning**: `nzgdc-morning-event-times-{theme}`
- **Afternoon**: `nzgdc-afternoon-event-times-{theme}`

---

## Dynamic Updates

### Refreshing Time Blocks

```javascript
// When event data changes
const success = timeManager.refreshTimeBlocks(
  scheduleContainer,
  updatedEventData,
  'schedule'
);

if (success) {
  console.log('Time blocks updated successfully');
}
```

### Update Process:
1. **Reprocess Events**: Groups new events into time blocks with panel type hierarchy
2. **Match Existing**: Attempts to update existing time block containers
3. **Add New Blocks**: Creates containers for new time periods
4. **Remove Obsolete**: Removes containers for time periods no longer needed
5. **Maintain Order**: Ensures chronological order and panel type hierarchy is preserved

---

## Event Panel Loading

### Dynamic Event Panel Creation

```javascript
// Load event panels for each time block with panel type hierarchy
async loadDynamicWorkshopContent(timeBlockElements) {
  for (const timeBlockEl of timeBlockElements) {
    const timeBlockData = timeBlockEl._timeBlockData;
    const eventsContainer = timeManager.getEventsContainer(timeBlockEl);
    
    // Generate event panels HTML with Big panels first, then Main panels
    const eventPanelsHTML = await this.generateEventPanelsForTimeBlock(
      timeBlockData.events  // Already sorted by panel type hierarchy
    );
    eventsContainer.innerHTML = eventPanelsHTML;
    
    // Load individual event content (Big panels loaded first, then Main panels)
    await this.loadEventsInTimeBlock(eventsContainer, timeBlockData.events);
  }
}
```

### Event Panel Integration

Uses the existing `UnifiedEventLoader` system:

```javascript
// Create event panel for each event
const unifiedLoader = new UnifiedEventLoader();
await unifiedLoader.loadTemplate();

const eventPanel = unifiedLoader.createEventPanel(
  event,
  expectedPanelType, // Use expected panel type instead of "auto" for consistency
  "schedule"         // Widget type
);
```

---

## Filtering Integration

### Category Filtering

```javascript
// Filter events by category within time blocks
filterDynamicEventsByCategory(categoryKey) {
  const timeBlocks = this.container.querySelectorAll('.nzgdc-time-category');
  
  timeBlocks.forEach(timeBlock => {
    const timeBlockData = timeBlock._timeBlockData;
    
    // Filter events in this time block
    const filteredEvents = timeBlockData.events.filter(event =>
      event.categoryKey === categoryKey || event.category === categoryKey
    );
    
    // Hide/show time block based on results
    if (filteredEvents.length === 0) {
      timeBlock.style.display = 'none';
    } else {
      // Update events container with filtered events
      this.updateTimeBlockEvents(timeBlock, filteredEvents);
    }
  });
}
```

### Time-Based Filtering

```javascript
// Filter by time periods (morning/afternoon) - panel type hierarchy preserved
const morningEvents = allEvents.filter(event => {
  const hour = parseInt(event.startTime.split(':')[0], 10);
  return hour < 12;
});

// Within each time period, events are still organized by panel type hierarchy
// Big panels appear first, then Main panels, with duration/alphabetical sorting within each type
```

---

## Debugging and Testing

### Debug Mode

```javascript
// Enable debug logging
timeManager.enableDebug(true);

// Get debug information
const debugInfo = timeManager.getDebugInfo(scheduleContainer);
console.log('Time blocks:', debugInfo);
```

### Test Page

A comprehensive test page is available at:
```
.widget-tests/dynamic-time-management-test.html
```

**Test Features**:
- Basic time block generation
- Event sorting validation  
- **Panel type hierarchy testing**
- Dynamic update testing
- Filter integration testing
- Real-time debug information

### Testing Sample Data

```javascript
const sampleEvents = {
  "event-001": {
    id: "event-001",
    title: "Advanced Unity Optimization",
    startTime: "09:00",
    endTime: "10:30",
    category: "Programming"
  },
  // ... more test events
};
```

---

## Backward Compatibility

### Legacy Fallback

The system maintains compatibility with existing static time slot data:

```javascript
// Check if events have real time data
const hasRealTimeData = eventData && Object.values(eventData).some(
  event => event.startTime && event.endTime
);

if (hasRealTimeData) {
  await this.renderDynamicSchedule(eventData);
} else {
  await this.renderLegacySchedule(scheduleData, eventData);
}
```

### Migration Strategy

1. **Phase 1**: Deploy dynamic system alongside legacy (current)
2. **Phase 2**: API provides `startTime`/`endTime` data
3. **Phase 3**: Remove legacy fallback code

---

## Performance Considerations

### Optimization Features

1. **Event Filtering**: Only processes events with valid time data
2. **Document Fragments**: Uses fragments for efficient DOM updates  
3. **Unique ID Extraction**: Caches unique IDs for repeated operations
4. **Lazy Loading**: Loads event content after DOM structure is created

### Memory Management

```javascript
// Clean up references when destroyed
destroy() {
  this.timeManager = null;
  this.container.innerHTML = '';
  this.loadedWorkshops.clear();
}
```

---

## Error Handling

### Event Data Validation

```javascript
// Handle missing or invalid time data
const validEvents = events.filter(event => {
  if (!event.startTime) {
    console.warn(`Event ${event.id} missing startTime, excluding from schedule`);
    return false;
  }
  return true;
});
```

### Graceful Degradation

```javascript
// Fallback if ScheduleTimeManager unavailable
if (!window.ScheduleTimeManager) {
  console.error('ScheduleTimeManager not available, using legacy method');
  return this.renderLegacySchedule(scheduleData, eventData);
}
```

### Error Display

```javascript
// Show user-friendly error messages
showEventLoadError(eventElement, eventTitle) {
  eventElement.innerHTML = `
    <div class="nzgdc-event-error">
      <div class="nzgdc-error-title">Unable to load event</div>
      <div class="nzgdc-error-subtitle">${eventTitle}</div>
      <div class="nzgdc-error-details">Please try refreshing the page</div>
    </div>
  `;
}
```

---

## File Loading Requirements

### Critical Loading Order

```html
<!-- Core time management (MUST load first) -->
<script src="js/schedule-time-manager.js"></script>

<!-- Event panel system -->
<script src="js/unified-event-loader.js"></script>

<!-- Schedule generators (depend on time manager) -->
<script src="js/schedule-generator.js"></script>
<script src="js/morning-schedule-generator.js"></script>  
<script src="js/afternoon-schedule-generator.js"></script>
```

**⚠️ Warning**: Loading `schedule-time-manager.js` after the schedule generators will break dynamic time management functionality.

---

## Future Enhancements

### Potential Improvements

1. **Time Zone Support**: Handle events across different time zones
2. **Conflict Detection**: Warn about overlapping events
3. **Capacity Management**: Show availability/waitlist status
4. **Real-time Updates**: Live updates from event management system
5. **Advanced Sorting**: Custom sorting criteria beyond duration + alphabetical

### API Enhancements

```javascript
// Potential future event data structure
const enhancedEventData = {
  startTime: "09:00",
  endTime: "10:30", 
  timeZone: "Pacific/Auckland",
  capacity: 50,
  currentAttendees: 35,
  conflictsWith: ["event-002"],
  lastUpdated: "2024-01-15T08:30:00Z"
};
```

---

## Troubleshooting

### Common Issues

#### 1. No Time Blocks Generated
```javascript
// Check if events have valid time data
console.log('Events with startTime:', events.filter(e => e.startTime));
```

#### 2. Events Not Sorted Correctly  
```javascript
// Verify duration calculation
events.forEach(event => {
  const duration = timeManager.calculateDuration(event.startTime, event.endTime);
  console.log(`${event.title}: ${duration} minutes`);
});
```

#### 3. Time Blocks Not Updating
```javascript
// Check if unique IDs can be extracted
const uniqueId = timeManager.extractUniqueIdFromTimeBlock(timeBlockEl);
console.log('Extracted unique ID:', uniqueId);
```

#### 4. CSS Themes Not Applied
```javascript
// Verify theme generation
const theme = timeManager.determineTimeBlockTheme("09:00");
console.log('Generated theme:', theme); // Should be "early-morning"
```

### Debug Commands

```javascript
// Enable debug mode
window.NZGDC_DEBUG = true;
timeManager.enableDebug(true);

// Get comprehensive debug info
const debugInfo = timeManager.getDebugInfo(document.querySelector('.nzgdc-schedule-widget'));
console.log('Debug info:', debugInfo);
```

---

This dynamic Event Times Container system represents a significant architectural improvement, providing intelligent, API-driven schedule organization while maintaining full backward compatibility and following consistent separation of concerns principles throughout the NZGDC widget ecosystem.