# Workshop Events Documentation

## Overview

The `workshop-events.js` file contains the event data collection for NZGDC (New Zealand Game Developers Conference) workshop events. This module provides a structured dataset of workshop information used by the widget system to display detailed event panels.

## Purpose

This data module serves as:
- Central repository for workshop event information
- Standardized data structure for event display
- Category-based organization system
- Speaker and session metadata storage

## Data Structure

### Global Constant

```javascript
const WORKSHOP_EVENTS = {
  "workshop-id": {
    category: "Display Name",
    categoryKey: "NORMALIZED_KEY", 
    title: "Workshop Title",
    timeframe: "Duration",
    thumbnail: "image_url",
    speakers: [
      { name: "Speaker Name", position: "Title at Company" }
    ]
  }
}
```

### Event Object Properties

Each workshop event contains the following properties:

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `category` | String | Human-readable category name | Yes |
| `categoryKey` | String | Normalized category identifier for filtering | Yes |
| `title` | String | Workshop title/name | Yes |
| `timeframe` | String | Workshop duration (typically "3 hours") | Yes |
| `thumbnail` | String | URL to workshop thumbnail image | No |
| `speakers` | Array | Collection of speaker objects | Yes |

### Speaker Object Structure

```javascript
{
  name: "Speaker Full Name",
  position: "Job Title at Company Name"
}
```

## Available Workshop Events

### Workshop Block A (Morning Sessions)

#### workshop-a1: Advanced Storytelling Techniques
- **Category**: Story & Narrative
- **Duration**: 3 hours
- **Speakers**: 
  - Jane Doe (Lead Writer at GameStudio)
  - John Smith (Narrative Designer at IndieDev)

#### workshop-a2: Unity Performance Optimization
- **Category**: Programming
- **Duration**: 3 hours
- **Speakers**:
  - Sarah Johnson (Senior Developer at TechCorp)

#### workshop-a3: Player Psychology in Game Design
- **Category**: Game Design
- **Duration**: 3 hours
- **Speakers**:
  - Mike Chen (Game Designer at BigStudio)

#### workshop-a4: Indie Game Marketing Strategies
- **Category**: Business & Marketing
- **Duration**: 3 hours
- **Speakers**:
  - Emma Wilson (Marketing Director at IndiePublisher)

### Workshop Block B (Afternoon Sessions)

#### workshop-b1: 3D Character Modeling Workshop
- **Category**: Art
- **Duration**: 3 hours
- **Speakers**:
  - Alex Rodriguez (3D Artist at VisualStudio)

#### workshop-b2: Interactive Audio Design
- **Category**: Audio
- **Duration**: 3 hours
- **Speakers**:
  - Lisa Park (Audio Director at SoundDesign Co)

#### workshop-b3: Advanced Shader Techniques
- **Category**: Programming
- **Duration**: 3 hours
- **Speakers**:
  - David Kim (Graphics Programmer at TechEngine)

#### workshop-b4: Virtual Reality Game Development
- **Category**: Realities (VR, AR, MR)
- **Duration**: 3 hours
- **Speakers**:
  - Rachel Green (VR Developer at ImmersiveTech)

#### workshop-b5: Netcode for Indie Games
- **Category**: Data, Testing or Research
- **Duration**: 3 hours
- **Speakers**:
  - Tom Anderson (Network Engineer at MultiplayerSolutions)

#### workshop-b6: Platform Publishing Guide
- **Category**: Business & Marketing
- **Duration**: 3 hours
- **Speakers**:
  - Jennifer Lee (Platform Relations at GamePublisher)

### Workshop Block C (Extended Sessions)

#### workshop-c1: Inclusive Game Design Workshop
- **Category**: Culture
- **Duration**: 3 hours
- **Speakers**:
  - Maya Singh (Diversity Consultant at InclusiveGames)

#### workshop-c2: Quality Assurance Best Practices
- **Category**: Production & QA
- **Duration**: 3 hours
- **Speakers**:
  - Carlos Rodriguez (QA Lead at TestingStudio)

#### workshop-c3: Educational Game Development
- **Category**: Serious & Educational Games
- **Duration**: 3 hours
- **Speakers**:
  - Dr. Amanda Foster (EdTech Researcher at EduGames)

## Category System

### Category Keys and Display Names

| Category Key | Display Name | Workshop Count |
|--------------|--------------|----------------|
| STORY_NARRATIVE | Story & Narrative | 1 |
| PROGRAMMING | Programming | 2 |
| GAME_DESIGN | Game Design | 1 |
| BUSINESS_MARKETING | Business & Marketing | 2 |
| ART | Art | 1 |
| AUDIO | Audio | 1 |
| REALITIES_VR_AR_MR | Realities (VR, AR, MR) | 1 |
| DATA_TESTING_RESEARCH | Data, Testing or Research | 1 |
| CULTURE | Culture | 1 |
| PRODUCTION_QA | Production & QA | 1 |
| SERIOUS_EDUCATIONAL | Serious & Educational Games | 1 |

### Category Distribution

The workshop events are distributed across 11 different categories, providing comprehensive coverage of game development disciplines:

- **Technical Skills**: Programming (2 workshops)
- **Creative Skills**: Art (1), Audio (1), Story & Narrative (1)
- **Design Skills**: Game Design (1)
- **Business Skills**: Business & Marketing (2)
- **Specialized Areas**: VR/AR/MR (1), Data/Testing/Research (1)
- **Industry Focus**: Culture (1), Production & QA (1), Educational Games (1)

## Integration

### Global Availability
The workshop events are available globally when the module is loaded:
```javascript
window.WORKSHOP_EVENTS
```

### Module Support
Supports both CommonJS and browser global patterns:
```javascript
// CommonJS
const WORKSHOP_EVENTS = require('./workshop-events.js');

// Browser Global
const events = window.WORKSHOP_EVENTS;
```

### Usage in Widget System
The workshop events are consumed by:
- `ScheduleGenerator` - For rendering workshop content
- `UnifiedEventLoader` - For creating event panels
- `NZGDCScheduleWidget` - For filtering and display

## Usage Examples

### Accessing Workshop Data
```javascript
// Get specific workshop
const workshop = WORKSHOP_EVENTS['workshop-a1'];
console.log(workshop.title); // "Advanced Storytelling Techniques"

// Get all workshops
const allWorkshops = Object.entries(WORKSHOP_EVENTS);
console.log(`Total workshops: ${allWorkshops.length}`);

// Filter by category
const programmingWorkshops = Object.entries(WORKSHOP_EVENTS)
  .filter(([id, workshop]) => workshop.categoryKey === 'PROGRAMMING');
```

### Workshop Validation
```javascript
function validateWorkshop(workshopId) {
  const workshop = WORKSHOP_EVENTS[workshopId];
  if (!workshop) {
    console.error(`Workshop ${workshopId} not found`);
    return false;
  }
  
  const required = ['category', 'categoryKey', 'title', 'timeframe', 'speakers'];
  const missing = required.filter(prop => !workshop[prop]);
  
  if (missing.length > 0) {
    console.error(`Workshop ${workshopId} missing: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
}
```

### Category Analysis
```javascript
function getCategoryStats() {
  const categories = {};
  
  Object.values(WORKSHOP_EVENTS).forEach(workshop => {
    const key = workshop.categoryKey;
    categories[key] = (categories[key] || 0) + 1;
  });
  
  return categories;
}

console.log(getCategoryStats());
// Output: Category distribution across all workshops
```

## Data Quality Guidelines

### Required Fields
All workshop entries must include:
- Unique workshop ID as object key
- Category display name and normalized key
- Descriptive workshop title
- Duration timeframe
- At least one speaker with name and position

### Optional Fields
- Thumbnail images (currently empty strings, ready for future implementation)
- Additional workshop metadata

### Naming Conventions
- **Workshop IDs**: Format `workshop-[block][number]` (e.g., "workshop-a1")
- **Category Keys**: UPPERCASE_SNAKE_CASE format
- **Speaker Positions**: "Title at Company" format

## Maintenance

### Adding New Workshops
1. Choose appropriate workshop ID following naming convention
2. Assign to correct category with valid categoryKey
3. Include complete speaker information
4. Ensure timeframe consistency (currently all "3 hours")
5. Leave thumbnail empty string for future implementation

### Modifying Categories
1. Update categoryKey to match UnifiedEventLoader definitions
2. Ensure category display names are consistent
3. Update any dependent filtering logic
4. Test category-based filtering functionality

### Data Validation
- All workshop IDs should be unique
- Category keys must match those defined in UnifiedEventLoader
- Speaker arrays should not be empty
- Timeframe format should be consistent across workshops

## Dependencies

This module is a dependency for:
- `ScheduleGenerator` - Consumes workshop data for rendering
- `UnifiedEventLoader` - Uses data for panel creation
- `NZGDCScheduleWidget` - Validates data availability

## Performance Considerations

- Static data structure with no dynamic loading
- Minimal memory footprint with simple object structure
- Fast lookup by workshop ID using object key access
- No external dependencies or API calls required

## Browser Compatibility

- Pure JavaScript object - compatible with all browsers
- No ES6+ features required for data access
- Module export pattern supports both modern and legacy environments