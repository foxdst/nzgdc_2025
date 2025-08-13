# Schedule Data Documentation

## Overview

The `schedule-data.js` file contains the configuration data that defines the structure and organization of NZGDC (New Zealand Game Developers Conference) workshop schedules. This module provides the foundational data structure used by the widget system to organize and display workshop events in time-based slots.

## Purpose

This data module serves as:
- Configuration backbone for schedule layout and organization
- Time slot definition and workshop grouping system
- Theme-based styling control for different schedule sections
- Workshop-to-time-slot mapping and organization
- Structural foundation for schedule rendering

## Data Structure

### Global Constant

```javascript
const SCHEDULE_DATA = {
  timeSlots: [
    {
      id: "unique-identifier",
      timeRange: "time-display-format", 
      title: "Section Title",
      theme: "styling-theme",
      workshops: [/* workshop reference objects */]
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
| `theme` | String | CSS theme identifier for styling | Yes |
| `workshops` | Array | Collection of workshop reference objects | Yes |

### Workshop Reference Object Structure

```javascript
{
  id: "workshop-identifier",
  category: "Display Category Name", 
  title: "Workshop Display Title"
}
```

**Note:** Workshop references contain basic display information. Full workshop details are stored in the `WORKSHOP_EVENTS` collection.

## Available Time Slots

### Morning Workshops (9:00 AM - 12:00 PM)

**Configuration:**
- **ID**: `morning`
- **Theme**: `a` (Yellow theme styling)
- **Workshop Count**: 4 workshops

**Workshops Included:**
1. **workshop-a1**: Advanced Storytelling Techniques (Story & Narrative)
2. **workshop-a2**: Unity Performance Optimization (Technical Skills)
3. **workshop-a3**: Player Psychology in Game Design (Game Design)
4. **workshop-a4**: Indie Game Marketing Strategies (Business)

### Afternoon Workshops (12:00 PM - 3:00 PM)

**Configuration:**
- **ID**: `afternoon`  
- **Theme**: `b` (Blue theme styling)
- **Workshop Count**: 6 workshops

**Workshops Included:**
1. **workshop-b1**: 3D Character Modeling Workshop (Art & Animation)
2. **workshop-b2**: Interactive Audio Design (Audio)
3. **workshop-b3**: Advanced Shader Techniques (Programming)
4. **workshop-b4**: Virtual Reality Game Development (VR/AR)
5. **workshop-b5**: Netcode for Indie Games (Multiplayer)
6. **workshop-b6**: Platform Publishing Guide (Publishing)

## Theme System

### Theme Styling Control

The `theme` property controls CSS styling for different schedule sections:

| Theme ID | Color Scheme | Usage | Visual Style |
|----------|--------------|-------|--------------|
| `a` | Yellow | Morning workshops | Warm, energetic styling |
| `b` | Blue | Afternoon workshops | Cool, professional styling |

### CSS Class Generation

Theme values generate corresponding CSS classes:
- Theme `a` → `.nzgdc-time-category-a`
- Theme `b` → `.nzgdc-time-category-b`

## Category Representation

### Workshop Categories by Time Slot

**Morning Block Categories:**
- Story & Narrative
- Technical Skills  
- Game Design
- Business

**Afternoon Block Categories:**
- Art & Animation
- Audio
- Programming
- VR/AR
- Multiplayer
- Publishing

### Category Normalization

Categories in schedule data use display names that may differ from normalized category keys in workshop events data:

| Schedule Data Category | Workshop Events CategoryKey |
|------------------------|----------------------------|
| Technical Skills | PROGRAMMING |
| Business | BUSINESS_MARKETING |
| Art & Animation | ART |
| VR/AR | REALITIES_VR_AR_MR |
| Multiplayer | DATA_TESTING_RESEARCH |
| Publishing | BUSINESS_MARKETING |

## Integration

### Global Availability
The schedule data is available globally when the module is loaded:
```javascript
window.SCHEDULE_DATA
```

### Module Support
Supports both CommonJS and browser global patterns:
```javascript
// CommonJS
const SCHEDULE_DATA = require('./schedule-data.js');

// Browser Global
const data = window.SCHEDULE_DATA;
```

### Usage in Widget System
The schedule data is consumed by:
- `ScheduleGenerator` - For rendering schedule layout and structure
- `NZGDCScheduleWidget` - For validation and initialization
- Event rendering system for time slot organization

## Usage Examples

### Accessing Schedule Structure
```javascript
// Get all time slots
const timeSlots = SCHEDULE_DATA.timeSlots;
console.log(`Total time slots: ${timeSlots.length}`);

// Access specific time slot
const morningSlot = SCHEDULE_DATA.timeSlots.find(slot => slot.id === 'morning');
console.log(`Morning workshops: ${morningSlot.workshops.length}`);

// Get workshop IDs for a time slot
const morningWorkshopIds = morningSlot.workshops.map(w => w.id);
console.log('Morning workshop IDs:', morningWorkshopIds);
```

### Schedule Analysis
```javascript
function analyzeSchedule() {
  const analysis = {
    totalTimeSlots: SCHEDULE_DATA.timeSlots.length,
    totalWorkshops: 0,
    themes: new Set(),
    categories: new Set()
  };
  
  SCHEDULE_DATA.timeSlots.forEach(slot => {
    analysis.totalWorkshops += slot.workshops.length;
    analysis.themes.add(slot.theme);
    
    slot.workshops.forEach(workshop => {
      analysis.categories.add(workshop.category);
    });
  });
  
  return {
    ...analysis,
    themes: Array.from(analysis.themes),
    categories: Array.from(analysis.categories)
  };
}

console.log(analyzeSchedule());
```

### Workshop Distribution
```javascript
function getWorkshopDistribution() {
  const distribution = {};
  
  SCHEDULE_DATA.timeSlots.forEach(slot => {
    distribution[slot.id] = {
      title: slot.title,
      timeRange: slot.timeRange,
      theme: slot.theme,
      workshopCount: slot.workshops.length,
      workshops: slot.workshops.map(w => w.title)
    };
  });
  
  return distribution;
}
```

### Time Slot Validation
```javascript
function validateScheduleData() {
  const errors = [];
  
  if (!SCHEDULE_DATA.timeSlots || !Array.isArray(SCHEDULE_DATA.timeSlots)) {
    errors.push('timeSlots must be an array');
    return errors;
  }
  
  SCHEDULE_DATA.timeSlots.forEach((slot, index) => {
    const required = ['id', 'timeRange', 'title', 'theme', 'workshops'];
    const missing = required.filter(prop => !slot[prop]);
    
    if (missing.length > 0) {
      errors.push(`Time slot ${index}: missing ${missing.join(', ')}`);
    }
    
    if (!Array.isArray(slot.workshops)) {
      errors.push(`Time slot ${index}: workshops must be an array`);
    } else {
      slot.workshops.forEach((workshop, wIndex) => {
        const wRequired = ['id', 'category', 'title'];
        const wMissing = wRequired.filter(prop => !workshop[prop]);
        
        if (wMissing.length > 0) {
          errors.push(`Time slot ${index}, workshop ${wIndex}: missing ${wMissing.join(', ')}`);
        }
      });
    }
  });
  
  return errors;
}
```

## Data Relationship

### Connection to Workshop Events
Schedule data references workshops that must exist in the `WORKSHOP_EVENTS` collection:

```javascript
// Schedule data references
const scheduleWorkshopIds = SCHEDULE_DATA.timeSlots
  .flatMap(slot => slot.workshops.map(w => w.id));

// Must exist in WORKSHOP_EVENTS
scheduleWorkshopIds.forEach(id => {
  if (!WORKSHOP_EVENTS[id]) {
    console.error(`Missing workshop data for: ${id}`);
  }
});
```

### Data Consistency Requirements
- All workshop IDs in schedule data must have corresponding entries in WORKSHOP_EVENTS
- Category names should align with workshop event categories (may require normalization)
- Time slot IDs should be unique within the schedule
- Workshop IDs should be unique across all time slots

## Configuration Guidelines

### Time Slot Configuration
- **Unique IDs**: Each time slot must have a unique identifier
- **Clear Time Ranges**: Use consistent time format (e.g., "9.00am - 12.00pm")  
- **Descriptive Titles**: Clear section titles for user understanding
- **Theme Consistency**: Use established theme identifiers for styling

### Workshop Organization
- **Balanced Distribution**: Consider workshop count per time slot for layout
- **Category Diversity**: Mix different categories within time slots
- **Logical Grouping**: Group related workshops when appropriate
- **Layout Considerations**: Current system displays 2 workshops per row

### Theme Management
- **Consistent Naming**: Use single-character theme identifiers
- **CSS Coordination**: Ensure corresponding CSS classes exist
- **Visual Distinction**: Themes should provide clear visual differentiation
- **Accessibility**: Consider color contrast and visual accessibility

## Maintenance

### Adding Time Slots
1. Create unique time slot ID
2. Define appropriate time range and title  
3. Select or create theme identifier
4. Populate workshops array with references
5. Ensure corresponding CSS theme classes exist

### Modifying Workshop References
1. Update workshop ID references to match WORKSHOP_EVENTS keys
2. Ensure category names align with actual workshop categories
3. Update display titles if workshop titles change
4. Maintain consistency across all references

### Theme Updates
1. Update theme identifiers in schedule data
2. Create or update corresponding CSS classes
3. Test visual styling across all time slots
4. Ensure accessibility compliance

## Performance Considerations

- **Static Configuration**: No dynamic loading or API dependencies
- **Minimal Data Structure**: Lightweight references to detailed workshop data
- **Fast Access**: Simple object structure for efficient parsing
- **Memory Efficient**: Small footprint with essential configuration only

## Browser Compatibility

- Pure JavaScript object structure
- Compatible with all browsers (no ES6+ features required)
- No external dependencies or complex operations
- Standard JSON-compatible data format

## Dependencies

### Required by Schedule Data
- No direct dependencies (standalone configuration)

### Required for Schedule Data
This module is a dependency for:
- `ScheduleGenerator` - Uses data for schedule structure and rendering  
- `NZGDCScheduleWidget` - Validates data availability during initialization
- Workshop rendering system - Uses time slot organization for display

### Related Data Modules
- **WORKSHOP_EVENTS** - Contains detailed workshop information referenced by IDs
- **Category mapping systems** - May require category name normalization
- **Theme CSS files** - Must include corresponding theme styling classes