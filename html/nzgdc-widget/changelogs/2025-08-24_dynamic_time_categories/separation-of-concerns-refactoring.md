# Separation of Concerns Refactoring Documentation

## Overview

This document outlines the refactoring implemented to ensure consistent separation of concerns across all Event Panel Design codebases in the NZGDC widget system. The refactoring addresses the architectural inconsistency between the Expanded Event Details modal and the Main/Big event panels.

## Problem Statement

### Original Architecture Inconsistency

| Aspect | Expanded Event Details | Event Panels (Big/Main) |
|--------|----------------------|-------------------------|
| **JavaScript Targeting** | Uses **IDs** (`#expanded-event-title`) | Uses **Classes** (`.nzgdc-category-text-big`) |
| **Population Method** | **Dynamic Population** (empty containers filled by JS) | **Template Insertion** (content inserted during creation) |
| **Content Updates** | **Mutable** (can be updated with new data) | **Immutable** (recreated when data changes) |
| **Targeting Precision** | **Unique targeting** required | **Pattern-based targeting** acceptable |

### Issues This Created

1. **Maintenance Inconsistency**: Developers had to remember two different targeting patterns
2. **Future Scaling Issues**: Adding dynamic updates to event panels was harder without IDs
3. **Code Clarity**: Less predictable which pattern to use for new features

## Solution: Unified ID + Class Pattern

### New Architecture

All event panels now follow the **Expanded Event Details pattern**:

```html
<!-- Consistent ID + Class pattern -->
<div class="nzgdc-category-text-big" id="event-category-{uniqueId}"></div>
<div class="nzgdc-title-text-big" id="event-title-{uniqueId}"></div>
<div class="nzgdc-speaker-bioName-big" id="event-speaker-name-1-{uniqueId}"></div>
```

### Benefits

- ✅ **Unique JavaScript targeting** (IDs)
- ✅ **Consistent CSS styling** (classes)  
- ✅ **Future-proof updates** (can modify any panel by ID)
- ✅ **Architectural consistency** (same pattern everywhere)

## Implementation Details

### 1. Unique ID Generation

```javascript
// Generate unique ID for event panel elements
generateUniqueId() {
  return `${Date.now()}-${++this.eventCounter}`;
}
```

### 2. Template Processing

**Big Event Panels (Template-based)**:
```javascript
// Generate unique ID for this panel and process template
const uniqueId = this.generateUniqueId();
this.processTemplate(clone, uniqueId);
```

**Main Event Panels (Code-generated)**:
```javascript
// Generate unique ID for this panel
const uniqueId = this.generateUniqueId();

mainPanel.innerHTML = `
  <div class="nzgdc-category-text-main" id="event-category-main-${uniqueId}">
    ${categoryData ? categoryData.displayName : eventData.category || "Event"}
  </div>
`;
```

### 3. Element Targeting

**Before (Class-based)**:
```javascript
const categoryEl = clone.querySelector(".nzgdc-category-text-big");
const titleEl = clone.querySelector(".nzgdc-title-text-big");
```

**After (ID-based with Class fallback)**:
```javascript
if (uniqueId) {
  categoryEl = clone.querySelector(`#event-category-${uniqueId}`);
  titleEl = clone.querySelector(`#event-title-${uniqueId}`);
} else {
  // Fallback for legacy panels
  categoryEl = clone.querySelector(".nzgdc-category-text-big");
  titleEl = clone.querySelector(".nzgdc-title-text-big");
}
```

## ID Naming Conventions

### Big Event Panels

- `event-category-{uniqueId}` - Category text
- `event-title-{uniqueId}` - Event title
- `event-thumbnail-{uniqueId}` - Event thumbnail
- `event-intro-{uniqueId}` - Introduction text
- `event-speaker-name-{n}-{uniqueId}` - Speaker name (n = 1,2,3)
- `event-speaker-position-{n}-{uniqueId}` - Speaker position (n = 1,2,3)
- `event-timeframe-{uniqueId}` - Timeframe text
- `event-cta-text-{uniqueId}` - Call-to-action text

### Main Event Panels

- `event-category-main-{uniqueId}` - Category text
- `event-title-main-{uniqueId}` - Event title
- `event-thumbnail-main-{uniqueId}` - Event thumbnail
- `event-speaker-name-main-{uniqueId}` - Speaker name
- `event-speaker-position-main-{uniqueId}` - Speaker position
- `event-cta-text-main-{uniqueId}` - Call-to-action text

## Backward Compatibility

The refactoring maintains **full backward compatibility**:

1. **CSS Styling**: Classes are preserved, so existing CSS continues to work
2. **Legacy Panel Support**: Class-based fallback for panels without IDs
3. **Existing Widgets**: No breaking changes to deployed widgets

### Legacy Panel Detection

```javascript
// Extract uniqueId from existing panel elements
extractUniqueIdFromPanel(panel) {
  const elementWithId = panel.querySelector('[id*="event-"]');
  if (elementWithId && elementWithId.id) {
    const matches = elementWithId.id.match(
      /event-(?:category|title|thumbnail|speaker-name|cta-text)(?:-main)?-(.+)$/
    );
    return matches ? matches[1] : null;
  }
  return null;
}
```

## Files Modified

### 1. Templates
- `templates/unified-event-panel.html` - Added ID attributes to all target elements

### 2. JavaScript
- `js/unified-event-loader.js` - Major refactoring:
  - Added `generateUniqueId()` method
  - Added `processTemplate()` method
  - Added `extractUniqueIdFromPanel()` method
  - Updated `createBigEventPanel()` to use IDs
  - Updated `createMainEventPanel()` to include IDs in generated HTML
  - Updated `updateBigEventContent()` to use ID-based targeting with class fallback
  - Updated `updateMainEventContent()` to use ID-based targeting with class fallback

### 3. Documentation
- Created this documentation file
- Updated relevant API documentation (if needed)

## Testing Considerations

### 1. New Panel Creation
- Verify all new panels have unique IDs
- Confirm JavaScript can target elements by ID
- Ensure CSS styling remains unchanged

### 2. Legacy Panel Updates
- Test updating existing panels without IDs (should fall back to classes)
- Verify no breaking changes for deployed widgets

### 3. Performance
- Confirm ID-based queries perform as expected
- Test with multiple panels on same page

## Future Improvements

### 1. Complete Migration
Eventually, all legacy panels could be migrated to use IDs by:
1. Detecting class-only panels
2. Programmatically adding IDs
3. Removing class-based fallbacks

### 2. Enhanced Targeting
With consistent IDs, future features could include:
- Panel-specific animations
- Individual panel state management
- More precise event handling

## Code Quality Impact

### Before Refactoring
```javascript
// Inconsistent targeting patterns
// Expanded modal
this.overlayContainer.querySelector("#expanded-event-synopsis")

// Event panels  
clone.querySelector(".nzgdc-category-text-big")
```

### After Refactoring
```javascript
// Consistent ID-based targeting everywhere
// Expanded modal
this.overlayContainer.querySelector("#expanded-event-synopsis")

// Event panels (new)
clone.querySelector(`#event-category-${uniqueId}`)

// Event panels (legacy fallback)
clone.querySelector(".nzgdc-category-text-big")
```

The refactoring successfully addresses the technical debt while maintaining full backward compatibility and establishing a consistent architectural pattern for future development.