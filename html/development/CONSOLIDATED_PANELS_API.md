# Simplified Event Panels API Documentation

## Overview

The event panel system has been simplified to eliminate unnecessary complexity while maintaining full functionality. There are now only two panel types with clear purposes:

1. **Main Panel** (`eventPanel_Main.html`) - 300x300 square panels with no variants
2. **Big Panel** (`eventPanel_Big.html`) - 620x300 rectangular panels with two event types

## Panel Types

### Main Panel (300x300)
- **File**: `eventPanel_Main.html`
- **Usage**: Generic event panels for all schedules
- **Size**: 300x300 pixels
- **Variants**: None - single universal design
- **Speaker Text**: "Presented by [Speaker Name]"

### Big Panel (620x300)
- **File**: `eventPanel_Big.html`  
- **Usage**: Larger event panels with two distinct types
- **Size**: 620x300 pixels
- **Event Types**:
  - `panel` - For Friday/Saturday morning and afternoon events
  - `workshop` - For Thursday workshop events

## Event Type Differences (Big Panel Only)

| Event Type | Introduction Text | Usage |
|------------|-------------------|-------|
| `panel` | "NZGDC 2025 Panel by" | Friday & Saturday events |
| `workshop` | "NZGDC 2025 Workshop by" | Thursday workshops |

## Usage Methods

### 1. URL Parameter Method
```html
<!-- Big panel as workshop -->
<iframe src="eventPanel_Big.html?type=workshop"></iframe>

<!-- Big panel as panel (default) -->
<iframe src="eventPanel_Big.html?type=panel"></iframe>
<iframe src="eventPanel_Big.html"></iframe>

<!-- Main panel (no parameters needed) -->
<iframe src="eventPanel_Main.html"></iframe>
```

### 2. PostMessage API
```javascript
// Set event type for big panels
iframe.contentWindow.postMessage({
    type: 'setEventType',
    eventType: 'workshop'  // or 'panel'
}, '*');

// Update category with event type
iframe.contentWindow.postMessage({
    type: 'updateCategory',
    category: 'CODING_DEVELOPMENT',
    panelType: 'big',
    eventType: 'workshop'
}, '*');

// Update content with event type
iframe.contentWindow.postMessage({
    type: 'updateContent',
    eventData: {
        category: 'Story & Narrative',
        title: 'Advanced Storytelling',
        speakers: [{name: 'Jane Doe', position: 'Lead Writer'}],
        timeframe: '50 minutes'
    },
    eventType: 'panel'
}, '*');
```

### 3. Direct JavaScript API
```javascript
// For Big panels only
setEventPanelType('workshop');  // or 'panel'
updateEventPanelContent(eventData, 'workshop');
const currentType = getEventPanelType();

// For both Main and Big panels
updateEventCategoryMain('CODING_DEVELOPMENT');
updateEventCategoryBig('SOUND_MUSIC');
updateEventPanelContent(eventData);
```

## Schedule Integration

### Thursday Schedule (Workshops)
- Uses **Big panels** with `workshop` event type
- Introduction text: "NZGDC 2025 Workshop by"
- URL: `eventPanel_Big.html?type=workshop`

### Friday/Saturday Morning & Afternoon (Panels)
- Uses **Big panels** with `panel` event type (default)
- Uses **Main panels** for smaller events
- Introduction text: "NZGDC 2025 Panel by" (Big) / "Presented by" (Main)
- URL: `eventPanel_Big.html?type=panel` or `eventPanel_Big.html`

## Migration Guide

### From Old Variant System
```html
<!-- OLD (complex variants) -->
<iframe src="eventPanel_Big.html?variant=morning"></iframe>
<iframe src="eventPanel_Big.html?variant=afternoon"></iframe>
<iframe src="eventPanel_Big.html?variant=thursday"></iframe>

<!-- NEW (simplified types) -->
<iframe src="eventPanel_Big.html?type=panel"></iframe>
<iframe src="eventPanel_Big.html?type=panel"></iframe>
<iframe src="eventPanel_Big.html?type=workshop"></iframe>
```

### PostMessage Changes
```javascript
// OLD
iframe.contentWindow.postMessage({
    type: 'setVariant',
    variant: 'morning'
}, '*');

// NEW
iframe.contentWindow.postMessage({
    type: 'setEventType',
    eventType: 'panel'
}, '*');
```

## API Reference

### Big Panel Methods
- `setEventPanelType(eventType)` - Set 'panel' or 'workshop'
- `getEventPanelType()` - Get current event type
- `updateEventPanelContent(eventData, eventType?)` - Update content

### Universal Methods (Both Panels)
- `updateEventCategoryMain(categoryKey)` - Update main panel category
- `updateEventCategoryBig(categoryKey)` - Update big panel category
- `updateEventCategoryFromAPI(config)` - EventCategories system integration

### PostMessage Events
- `updateCategory` - Update panel category
- `updateContent` - Update panel content
- `setEventType` - Set event type (big panels only)

## HTML Structure

### Main Panel Structure
```html
<div class="nzgdc-event-panel-main">
  <div class="nzgdc-event-category-main">...</div>
  <div class="nzgdc-event-panel-title-main">...</div>
  <div class="nzgdc-event-panel-thumbnail-main">...</div>
</div>
```

### Big Panel Structure
```html
<div class="nzgdc-event-panel-big" data-event-type="panel|workshop">
  <div class="nzgdc-event-panel-big-thumbnail">...</div>
  <div class="nzgdc-event-panel-big-details">...</div>
</div>
```

## Benefits of Simplification

1. **Clearer Purpose**: Only two distinct panel types with obvious use cases
2. **Reduced Complexity**: No confusing "morning/afternoon" variants that were identical
3. **Easier Maintenance**: Single source of truth for each panel type
4. **Better Performance**: Less conditional logic and simpler APIs
5. **Intuitive Usage**: Event types match actual event types (panels vs workshops)

## Error Handling

- Unknown event types default to 'panel'
- Missing EventCategories system is handled gracefully
- Console warnings for invalid configurations
- Fallback content for missing data

## Browser Support

- Modern browsers with ES6+ support
- IE11+ (with polyfills for URLSearchParams if needed)
- All mobile browsers
- Works in iframe and standalone contexts