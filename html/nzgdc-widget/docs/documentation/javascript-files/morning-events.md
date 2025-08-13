# Morning Events Documentation

## Overview

The `morning-events.js` file contains the event data collection for NZGDC (New Zealand Game Developers Conference) morning session events. This module provides a structured dataset of morning panel and workshop information used by the morning widget system to display detailed event panels.

## Purpose

This data module serves as:
- Central repository for morning session event information
- Standardized data structure for morning event display
- Category-based organization system for morning events
- Speaker and session metadata storage for morning panels
- Duration and format specifications for various morning event types

## Data Structure

### Global Constant

```javascript
const MORNING_EVENTS = {
  "panel-id": {
    category: "Display Name",
    categoryKey: "NORMALIZED_KEY", 
    title: "Panel/Workshop Title",
    timeframe: "Duration",
    thumbnail: "image_url",
    speakers: [
      { name: "Speaker Name", position: "Title at Company" }
    ]
  }
}
```

### Event Object Properties

Each morning event contains the following properties:

| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `category` | String | Human-readable category name | Yes |
| `categoryKey` | String | Normalized category identifier for filtering | Yes |
| `title` | String | Panel/workshop title/name | Yes |
| `timeframe` | String | Event duration (30 or 50 minutes) | Yes |
| `thumbnail` | String | URL to event thumbnail image | No |
| `speakers` | Array | Collection of speaker objects | Yes |

### Speaker Object Structure

```javascript
{
  name: "Speaker Full Name",
  position: "Job Title at Company Name"
}
```

## Available Morning Events

### Panel Block B (Featured Sessions - 50 minutes)

#### panel-b1: The Future of Multiplayer Design
- **Category**: Game Design
- **Duration**: 50 minutes
- **Type**: Panel Discussion
- **Speakers**: 
  - Riley Adams (Network Engineer at NetPlay)
  - Morgan Yu (Game Director at Massive Online)
  - Alex Thompson (Multiplayer Specialist at ConnectGames)

#### panel-b2: Monetization Strategies for Indies
- **Category**: Business & Marketing
- **Duration**: 50 minutes
- **Type**: Workshop
- **Speakers**:
  - Dana Kim (Business Analyst at GameBiz)
  - Marcus Cole (Revenue Consultant at ProfitPlay)

### Panel Block E (Quick Sessions - 30 minutes)

#### panel-e1: Advanced Storytelling in Games
- **Category**: Story & Narrative
- **Duration**: 30 minutes
- **Speakers**:
  - Sarah Mitchell (Lead Writer at Narrative Studios)

#### panel-e2: Character Development Workshop
- **Category**: Programming
- **Duration**: 30 minutes
- **Speakers**:
  - Jessica Chen (Character Designer at GameCorp)

#### panel-e3: Interactive Narrative Design
- **Category**: Art
- **Duration**: 30 minutes
- **Speakers**:
  - Marcus Williams (Narrative Director at StoryGames)

#### panel-e4: Branching Storylines
- **Category**: Audio
- **Duration**: 30 minutes
- **Speakers**:
  - Emily Roberts (Senior Writer at Interactive Media)

#### panel-e5: Writing for Games
- **Category**: Culture
- **Duration**: 30 minutes
- **Speakers**:
  - Mike Johnson (Freelance Game Writer)

#### panel-e6: Dialogue Systems
- **Category**: Production & QA
- **Duration**: 30 minutes
- **Speakers**:
  - Anna Davis (Dialogue Writer at VoiceGames)

#### panel-e7: Narrative in VR
- **Category**: Realities (VR, AR, MR)
- **Duration**: 30 minutes
- **Speakers**:
  - Tom Wilson (VR Narrative Designer)

#### panel-e8: Player Choice Impact
- **Category**: Data, Testing or Research
- **Duration**: 30 minutes
- **Speakers**:
  - Lisa Park (Game Design Consultant)

#### panel-e9: Emotional Storytelling
- **Category**: Serious & Educational Games
- **Duration**: 30 minutes
- **Speakers**:
  - David Kim (Creative Director at FeelGames)

#### panel-e10: Story Structure in Games
- **Category**: Story & Narrative
- **Duration**: 30 minutes
- **Speakers**:
  - Rachel Green (Story Architect at PlotCraft)

### Panel Block M (Mid-Morning Sessions - 50 minutes)

#### panel-m1: Game Audio Fundamentals
- **Category**: Audio
- **Duration**: 50 minutes
- **Speakers**:
  - Jamie Lee (Audio Director at SoundWave Studios)

#### panel-m2: Level Design Principles
- **Category**: Game Design
- **Duration**: 50 minutes
- **Speakers**:
  - Alex Chen (Lead Level Designer at MapCraft)

#### panel-m3: UI/UX for Indies
- **Category**: Art
- **Duration**: 50 minutes
- **Speakers**:
  - Priya Patel (UI/UX Specialist at IndieSpark)

#### panel-m4: Procedural Generation
- **Category**: Programming
- **Duration**: 50 minutes
- **Speakers**:
  - Samira Khan (Technical Artist at GenArt Games)

#### panel-m5: Community Management 101
- **Category**: Culture
- **Duration**: 50 minutes
- **Speakers**:
  - Ben Smith (Community Lead at PlayTogether)

### Panel Block L (Late Morning Sessions - 30 minutes)

#### panel-l1: Advanced Programming Techniques
- **Category**: Programming
- **Duration**: 30 minutes
- **Speakers**:
  - Robert Chen (Senior Developer at TechCorp)

#### panel-l2: Visual Design for Indie Games
- **Category**: Art
- **Duration**: 30 minutes
- **Speakers**:
  - Emma Wilson (Art Director at Creative Studios)

#### panel-l3: Social Media for Game Developers
- **Category**: Business & Marketing
- **Duration**: 30 minutes
- **Speakers**:
  - David Smith (Marketing Manager at Indie Games)

#### panel-l4: Funding Your Game Studio
- **Category**: Business & Marketing
- **Duration**: 30 minutes
- **Speakers**:
  - Sarah Lee (Investment Advisor at Game Fund)

#### panel-l5: Portfolio Building Workshop
- **Category**: Production & QA
- **Duration**: 30 minutes
- **Speakers**:
  - Jason Park (Portfolio Consultant)

#### panel-l6: Advanced Story Development (Panel)
- **Category**: Story & Narrative
- **Duration**: 30 minutes
- **Speakers**:
  - Maria Rodriguez (Lead Narrative Designer)
  - Tom Wilson (Story Consultant)
  - Lisa Park (Writing Director)

#### panel-l7: Character Design Mastery (Workshop)
- **Category**: Art
- **Duration**: 30 minutes
- **Speakers**:
  - Anna Davis (Character Development Lead)
  - Mike Johnson (Character Artist)

## Event Duration System

### Duration Categories

| Duration | Event Type | Panel Count | Usage |
|----------|------------|-------------|--------|
| 30 minutes | Quick Sessions | 17 events | Short focused topics |
| 50 minutes | Extended Sessions | 7 events | In-depth discussions/workshops |

### Time Block Organization

- **Block B**: Featured 50-minute sessions (2 events)
- **Block E**: Quick 30-minute sessions (10 events)
- **Block M**: Mid-morning 50-minute sessions (5 events)
- **Block L**: Late morning mixed sessions (7 events)

## Category System

### Category Keys and Display Names

| Category Key | Display Name | Event Count |
|--------------|--------------|-------------|
| STORY_NARRATIVE | Story & Narrative | 4 |
| PROGRAMMING | Programming | 3 |
| ART | Art | 3 |
| BUSINESS_MARKETING | Business & Marketing | 3 |
| GAME_DESIGN | Game Design | 2 |
| AUDIO | Audio | 2 |
| CULTURE | Culture | 2 |
| PRODUCTION_QA | Production & QA | 2 |
| REALITIES_VR_AR_MR | Realities (VR, AR, MR) | 1 |
| DATA_TESTING_RESEARCH | Data, Testing or Research | 1 |
| SERIOUS_EDUCATIONAL | Serious & Educational Games | 1 |

### Category Distribution Analysis

The morning events show a focus on:
- **Story & Narrative**: 4 events (16.7%) - Largest category
- **Technical Skills**: Programming (3), Audio (2) - 5 events (20.8%)
- **Creative Skills**: Art (3) - 3 events (12.5%)
- **Business Skills**: Business & Marketing (3) - 3 events (12.5%)
- **Design Skills**: Game Design (2) - 2 events (8.3%)
- **Industry Focus**: Culture (2), Production & QA (2) - 4 events (16.7%)
- **Specialized Areas**: VR/AR/MR (1), Data/Testing (1), Educational (1) - 3 events (12.5%)

## Event Format Types

### Panel Discussions
Events with multiple speakers for collaborative discussion:
- panel-b1: 3 speakers
- panel-b2: 2 speakers
- panel-l6: 3 speakers
- panel-l7: 2 speakers

### Solo Presentations
Events with single speakers for focused presentations:
- 20 events with individual expert speakers

### Workshop Format
Hands-on learning sessions identified by title:
- panel-b2: "Workshop: Monetization Strategies"
- panel-e2: "Character Development Workshop"
- panel-l5: "Portfolio Building Workshop"
- panel-l7: "Workshop: Character Design Mastery"

## Integration

### Global Availability
The morning events are available globally when the module is loaded:
```javascript
window.MORNING_EVENTS
```

### Module Support
Supports both CommonJS and browser global patterns:
```javascript
// CommonJS
const MORNING_EVENTS = require('./morning-events.js');

// Browser Global
const events = window.MORNING_EVENTS;
```

### Usage in Widget System
The morning events are consumed by:
- `MorningScheduleGenerator` - For rendering morning event content
- `UnifiedEventLoader` - For creating morning event panels
- `NZGDCMorningScheduleWidget` - For filtering and display
- Morning-specific schedule rendering components

## Usage Examples

### Accessing Morning Event Data
```javascript
// Get specific morning event
const event = MORNING_EVENTS['panel-b1'];
console.log(event.title); // "Panel: The Future of Multiplayer Design"

// Get all morning events
const allEvents = Object.entries(MORNING_EVENTS);
console.log(`Total morning events: ${allEvents.length}`);

// Filter by duration
const quickSessions = Object.entries(MORNING_EVENTS)
  .filter(([id, event]) => event.timeframe === '30 minutes');
console.log(`Quick sessions: ${quickSessions.length}`);
```

### Category Analysis for Morning Events
```javascript
function getMorningCategoryStats() {
  const categories = {};
  
  Object.values(MORNING_EVENTS).forEach(event => {
    const key = event.categoryKey;
    categories[key] = (categories[key] || 0) + 1;
  });
  
  return Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ category: key, count }));
}

console.log(getMorningCategoryStats());
// Shows category distribution sorted by event count
```

### Duration Distribution Analysis
```javascript
function getDurationStats() {
  const durations = {};
  
  Object.values(MORNING_EVENTS).forEach(event => {
    const duration = event.timeframe;
    durations[duration] = (durations[duration] || 0) + 1;
  });
  
  return durations;
}

console.log(getDurationStats());
// Output: { "30 minutes": 17, "50 minutes": 7 }
```

### Speaker Analysis
```javascript
function getSpeakerStats() {
  let totalSpeakers = 0;
  let panelSessions = 0; // Multiple speakers
  let soloSessions = 0;  // Single speaker
  
  Object.values(MORNING_EVENTS).forEach(event => {
    totalSpeakers += event.speakers.length;
    if (event.speakers.length > 1) {
      panelSessions++;
    } else {
      soloSessions++;
    }
  });
  
  return {
    totalSpeakers,
    totalEvents: Object.keys(MORNING_EVENTS).length,
    panelSessions,
    soloSessions,
    avgSpeakersPerEvent: (totalSpeakers / Object.keys(MORNING_EVENTS).length).toFixed(2)
  };
}
```

## Data Quality Guidelines

### Required Fields
All morning event entries must include:
- Unique panel ID as object key following format "panel-[block][number]"
- Category display name and normalized categoryKey
- Descriptive event title indicating format (Panel/Workshop)
- Duration specification (30 or 50 minutes)
- At least one speaker with name and position

### Optional Fields
- Thumbnail images (currently empty strings, ready for future implementation)
- Additional event metadata

### Naming Conventions
- **Panel IDs**: Format "panel-[block][number]" (e.g., "panel-b1", "panel-e10")
- **Block Identifiers**: 
  - 'b' = Featured sessions (50 min)
  - 'e' = Early quick sessions (30 min) 
  - 'm' = Mid-morning sessions (50 min)
  - 'l' = Late morning sessions (mixed duration)
- **Category Keys**: UPPERCASE_SNAKE_CASE format matching UnifiedEventLoader
- **Titles**: Include format indicators ("Panel:", "Workshop:") where appropriate
- **Speaker Positions**: "Title at Company" format

## Maintenance

### Adding New Morning Events
1. Choose appropriate panel ID following block-based naming convention
2. Assign to correct category with valid categoryKey
3. Include complete speaker information with positions
4. Specify accurate timeframe (30 or 50 minutes)
5. Use descriptive title with format indicator if applicable
6. Leave thumbnail empty string for future implementation

### Modifying Event Categories
1. Update categoryKey to match UnifiedEventLoader definitions
2. Ensure category display names are consistent across morning events
3. Update any dependent filtering logic in morning widget components
4. Test category-based filtering functionality

### Block Organization
- **Block B**: Reserved for featured 50-minute sessions
- **Block E**: Early quick 30-minute sessions (up to 10 events)
- **Block M**: Mid-morning 50-minute sessions
- **Block L**: Late morning mixed sessions (both 30 and 50 minute formats)

### Data Validation
- All panel IDs should be unique within MORNING_EVENTS
- Category keys must match those defined in UnifiedEventLoader
- Speaker arrays should not be empty
- Timeframe should be either "30 minutes" or "50 minutes"
- Block identifiers should align with schedule organization

## Dependencies

This module is a dependency for:
- `MorningScheduleGenerator` - Consumes morning event data for rendering
- `UnifiedEventLoader` - Uses data for morning event panel creation
- `NZGDCMorningScheduleWidget` - Validates data availability
- Morning schedule rendering components

## Performance Considerations

- Static data structure with no dynamic loading
- Lightweight object structure optimized for fast lookup
- Fast access by panel ID using object key access
- No external dependencies or API calls required
- Memory efficient with 24 total events

## Browser Compatibility

- Pure JavaScript object - compatible with all browsers
- No ES6+ features required for data access
- Module export pattern supports both modern and legacy environments
- Standard JSON-compatible data format

## Event Statistics Summary

- **Total Events**: 24 morning sessions
- **Duration Split**: 17 quick sessions (30 min), 7 extended sessions (50 min)
- **Format Mix**: 20 solo presentations, 4 multi-speaker panels
- **Category Coverage**: 11 different game development categories
- **Speaker Count**: 28 total speakers across all sessions
- **Time Blocks**: 4 different scheduling blocks (B, E, M, L)