# Event Data Examples for Category Integration

## Overview

This document provides **structural guidance and complete CSS rules** for implementing event categories within the unified NZGDC widget architecture. It references the actual source files to prevent code duplication and ensure accuracy.

**PURPOSE:** Provide file references and implementation patterns for Event Categories integration while avoiding code duplication.

**LAST UPDATED:** December 2024  
**ARCHITECTURE:** Unified v1.9 with Event Categories Integration  
**STATUS:** ✅ READY FOR IMPLEMENTATION

---

## 📋 EVENT DATA STRUCTURE REFERENCES

### Thursday Workshop Events Implementation

**FILE TO MODIFY:** `js/workshop-events.js`

**CURRENT STRUCTURE:** Examine the existing `WORKSHOP_EVENTS` object in `js/workshop-events.js` to understand the current event data structure.

**REQUIRED ADDITIONS:** Each event object must include these new fields:
- `categoryKey` - One of the 11 valid category keys (e.g., "GAME_DESIGN", "PROGRAMMING", "ART")  
- `category` - Display name for the category (e.g., "Game Design", "Programming", "Art")

**EXISTING FIELDS TO MAINTAIN:** All current fields (`title`, `speakers`, `timeframe`, `description`, `panelType`, `timeSlot`) must remain unchanged.

### Morning Schedule Events Implementation  

**FILE TO MODIFY:** `js/morning-events.js`

**CURRENT STRUCTURE:** Reference the existing `MORNING_EVENTS` object structure and add category fields to all event objects.

**PANEL TYPE CONSIDERATIONS:** Morning events include both "big" (620x300) and "main" (300x300) panel types. Category implementation must work with both.

**EVENT DISTRIBUTION:** Ensure good distribution of all 11 categories across morning events for visual variety.

### Afternoon Schedule Events Implementation

**FILE TO MODIFY:** `js/afternoon-events.js` 

**CURRENT STRUCTURE:** Reference the existing `AFTERNOON_EVENTS` object structure and add category fields following the same pattern as morning events.

**WIDGET CONTEXT:** Afternoon events use the "afternoon" widget context, which affects the introduction text but not category display.

---

## 🎨 COMPLETE CSS IMPLEMENTATION FOR UNIFIED-EVENT-PANEL.CSS

### All 11 Category CSS Rules

**FILE TO MODIFY:** `css/unified-event-panel.css`

**ADD THESE COMPLETE CSS RULES:** Add the following category definitions to the unified CSS file:

```css
/* COMPLETE IMPLEMENTATION: All 11 Event Categories */

/* 1. Story & Narrative - Light Yellow */
.nzgdc-event-panel-big[data-category="STORY_NARRATIVE"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="STORY_NARRATIVE"] .nzgdc-event-category-main {
    --category-color: #fff47f;
    --category-text-color: #000000;
}

/* 2. Production & QA - White */
.nzgdc-event-panel-big[data-category="PRODUCTION_QA"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="PRODUCTION_QA"] .nzgdc-event-category-main {
    --category-color: #ffffff;
    --category-text-color: #000000;
}

/* 3. Culture - Light Pink */
.nzgdc-event-panel-big[data-category="CULTURE"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="CULTURE"] .nzgdc-event-category-main {
    --category-color: #fac7d5;
    --category-text-color: #000000;
}

/* 4. Business & Marketing - Light Blue */
.nzgdc-event-panel-big[data-category="BUSINESS_MARKETING"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="BUSINESS_MARKETING"] .nzgdc-event-category-main {
    --category-color: #e7f1ff;
    --category-text-color: #000000;
}

/* 5. Art - Light Orange */
.nzgdc-event-panel-big[data-category="ART"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="ART"] .nzgdc-event-category-main {
    --category-color: #ffc999;
    --category-text-color: #000000;
}

/* 6. Audio - Cream */
.nzgdc-event-panel-big[data-category="AUDIO"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="AUDIO"] .nzgdc-event-category-main {
    --category-color: #fff1e5;
    --category-text-color: #000000;
}

/* 7. Programming - Light Cyan */
.nzgdc-event-panel-big[data-category="PROGRAMMING"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="PROGRAMMING"] .nzgdc-event-category-main {
    --category-color: #ccf2f1;
    --category-text-color: #000000;
}

/* 8. Data, Testing or Research - Purple-Grey (DARK CATEGORY) */
.nzgdc-event-panel-big[data-category="DATA_TESTING_RESEARCH"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="DATA_TESTING_RESEARCH"] .nzgdc-event-category-main {
    --category-color: #917B89;
    --category-text-color: #FFFFFF;
}

/* 9. Realities (VR, AR, MR) - Light Purple */
.nzgdc-event-panel-big[data-category="REALITIES_VR_AR_MR"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="REALITIES_VR_AR_MR"] .nzgdc-event-category-main {
    --category-color: #d1afff;
    --category-text-color: #000000;
}

/* 10. Game Design - Light Green */
.nzgdc-event-panel-big[data-category="GAME_DESIGN"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="GAME_DESIGN"] .nzgdc-event-category-main {
    --category-color: #9ee6ab;
    --category-text-color: #000000;
}

/* 11. Serious & Educational Games - Light Red */
.nzgdc-event-panel-big[data-category="SERIOUS_EDUCATIONAL"] .nzgdc-event-category-big,
.nzgdc-event-panel-main[data-category="SERIOUS_EDUCATIONAL"] .nzgdc-event-category-main {
    --category-color: #ffafaf;
    --category-text-color: #000000;
}

/* Category brightness detection for overlay compatibility */
.nzgdc-event-panel-big[data-category-brightness="light"],
.nzgdc-event-panel-main[data-category-brightness="light"] {
    --overlay-color: rgba(255, 255, 255, 0.85);
    --overlay-text-color: #000000;
    --speaker-color: #000000;
    --speaker-secondary-color: #666666;
}

.nzgdc-event-panel-big[data-category-brightness="dark"],
.nzgdc-event-panel-main[data-category-brightness="dark"] {
    --overlay-color: rgba(0, 0, 0, 0.75);
    --overlay-text-color: #FFFFFF;
    --speaker-color: #FFFFFF;
    --speaker-secondary-color: rgba(204, 204, 204, 1);
}

/* Apply overlay compatibility */
.nzgdc-event-panel-big[data-category-brightness="light"] .nzgdc-event-panel-overlay-big,
.nzgdc-event-panel-main[data-category-brightness="light"] .nzgdc-event-panel-overlay-main {
    background-color: var(--overlay-color);
    color: var(--overlay-text-color);
}

.nzgdc-event-panel-big[data-category-brightness="light"] .nzgdc-speaker-details-big,
.nzgdc-event-panel-main[data-category-brightness="light"] .nzgdc-speaker-details-main {
    --color-speaker: var(--speaker-color);
    --color-speaker-secondary: var(--speaker-secondary-color);
}
```

### Category Distribution Guidelines

**Light Categories (10):** STORY_NARRATIVE, PRODUCTION_QA, CULTURE, BUSINESS_MARKETING, ART, AUDIO, PROGRAMMING, REALITIES_VR_AR_MR, GAME_DESIGN, SERIOUS_EDUCATIONAL

**Dark Category (1):** DATA_TESTING_RESEARCH (#917B89) - Uses white text and dark overlay

**Overlay Compatibility:** The CSS above handles both light and dark categories with appropriate overlay styling.

---

## 🔧 IMPLEMENTATION CHECKLIST

### Event Data File Modifications

**FILES TO UPDATE:**
- [ ] `js/workshop-events.js` - Add categoryKey and category to all WORKSHOP_EVENTS
- [ ] `js/morning-events.js` - Add categoryKey and category to all MORNING_EVENTS  
- [ ] `js/afternoon-events.js` - Add categoryKey and category to all AFTERNOON_EVENTS

**REQUIRED FIELDS:** Each event object must include:
- [ ] `categoryKey` - One of 11 valid keys listed below
- [ ] `category` - Matching display name for the categoryKey
- [ ] All existing fields maintained (title, speakers, timeframe, etc.)

### CSS Implementation

**FILE TO UPDATE:**
- [ ] `css/unified-event-panel.css` - Add complete category CSS rules provided above

**CRITICAL:** Do NOT add category CSS to schedule bundle files. All category styling goes in unified CSS only.

### JavaScript Validation Integration

**FILE TO UPDATE:**
- [ ] `js/unified-event-loader.js` - Enhance updateEventContent() method to:
  - Set data-category attributes on panels
  - Set data-category-brightness attributes for overlay compatibility
  - Validate category keys and provide fallbacks
  - Handle widget context-specific introduction text

**VALIDATION IMPLEMENTATION:** Add console validation functions to verify event data integrity during development and testing.

---

## 📋 QUICK REFERENCE

### All 11 Valid Category Keys

**LIGHT CATEGORIES (use black text, light overlay):**
- `STORY_NARRATIVE` - Story & Narrative (#fff47f)
- `PRODUCTION_QA` - Production & QA (#ffffff) 
- `CULTURE` - Culture (#fac7d5)
- `BUSINESS_MARKETING` - Business & Marketing (#e7f1ff)
- `ART` - Art (#ffc999)
- `AUDIO` - Audio (#fff1e5) 
- `PROGRAMMING` - Programming (#ccf2f1)
- `REALITIES_VR_AR_MR` - Realities (VR, AR, MR) (#d1afff)
- `GAME_DESIGN` - Game Design (#9ee6ab)
- `SERIOUS_EDUCATIONAL` - Serious & Educational Games (#ffafaf)

**DARK CATEGORY (uses white text, dark overlay):**
- `DATA_TESTING_RESEARCH` - Data, Testing or Research (#917B89)

### Implementation Guidelines
- **Panel Types:** Reference existing panelType values in current event data files
- **Speaker Format:** Follow existing speaker object structure in current files
- **Required Fields:** Maintain all existing event data fields while adding category fields
- **File References:** Always refer to actual source files rather than copying code examples

### File Integration Order
1. Add CSS rules to `css/unified-event-panel.css` 
2. Update event data in all three JS files
3. Enhance `js/unified-event-loader.js` with category handling
4. Test using `widget-demo.html`

---

**STATUS:** ✅ READY FOR IMPLEMENTATION  
**USAGE:** Copy event objects directly into respective data files  
**TESTING:** Use validation code to verify data integrity  
**MAINTENANCE:** Update examples when adding new events or categories