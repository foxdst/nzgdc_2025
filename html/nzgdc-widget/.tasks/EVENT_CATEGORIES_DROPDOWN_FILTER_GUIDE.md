# NZGDC Event Categories Dropdown Filter Implementation Guide

## ⚠️ CRITICAL: READ ARCHITECTURE WARNINGS FIRST

**BEFORE IMPLEMENTING:** Read `JS Embed/html/nzgdc-widget/.tasks/CSS_REDUNDANCY_WARNING.md` for critical architectural constraints that WILL cause system failure if ignored.

**ARCHITECTURE STATUS:** This guide reflects the UNIFIED ARCHITECTURE (v1.9) implemented in the NZGDC widget system. All event panels use a single UnifiedEventLoader, unified template, and unified CSS system.

**CRITICAL DISCOVERY:** Current system has NO existing filter system. This implementation will ADD filtering capability to Morning and Afternoon widgets.

**PREREQUISITE:** Event Categories system must be implemented first (see `Event-Categories-Implementation-Guide.md`).

---

## Overview

This document provides **step-by-step, expert-level instructions** for implementing an Event Categories dropdown filter overlay for the Morning and Afternoon schedule widgets. The dropdown will allow users to filter events by category while maintaining the unified architecture principles.

**INTEGRATION TARGET:** Morning and Afternoon widgets only (Thursday widget has no filters)  
**IMPLEMENTATION TIME:** 16-20 hours (7 phases)  
**COMPLEXITY LEVEL:** HIGH (requires deep understanding of unified architecture)  
**ROLLBACK SUPPORT:** Full rollback capability maintained

## Dropdown Design Specification

### Visual Design Requirements

**Dropdown Structure:**
- **Default State:** "NONE ▼" label with white background
- **Expanded State:** Vertical list of all 11 categories with colored backgrounds
- **Category Items:** Category name with corresponding background color from Event Categories system
- **Positioning:** Overlay positioned relative to existing "Filters:" label area
- **Interaction:** Click to expand/collapse, click category to filter, click outside to close

### Event Categories Specification (from Event-Categories-Implementation-Guide.md)

**The 11 Fixed Categories with Correct Properties:**
1. **STORY_NARRATIVE** - "Story & Narrative" - #fff47f (light yellow), black text
2. **PRODUCTION_QA** - "Production & QA" - #ffffff (white), black text  
3. **CULTURE** - "Culture" - #fac7d5 (light pink), black text
4. **BUSINESS_MARKETING** - "Business & Marketing" - #e7f1ff (light blue), black text
5. **ART** - "Art" - #ffc999 (light orange), black text
6. **AUDIO** - "Audio" - #fff1e5 (cream), black text
7. **PROGRAMMING** - "Programming" - #ccf2f1 (light cyan), black text
8. **DATA_TESTING_RESEARCH** - "Data, Testing or Research" - #917B89 (purple-grey), **white text** (dark category)
9. **REALITIES_VR_AR_MR** - "Realities (VR, AR, MR)" - #d1afff (light purple), black text
10. **GAME_DESIGN** - "Game Design" - #9ee6ab (light green), black text
11. **SERIOUS_EDUCATIONAL** - "Serious & Educational Games" - #ffafaf (light red), black text

**NOTE:** Only DATA_TESTING_RESEARCH uses white text due to dark background. All others use black text.

### Functional Requirements

**Core Functionality:**
- Filter events by selected category using existing `categoryKey` field
- Show all events when "NONE" selected
- Smooth expand/collapse animation
- Click outside to close dropdown
- Maintain filter state during widget usage
- Reset filter when switching between Morning/Afternoon widgets

**Technical Requirements:**
- Must use unified architecture (separate CSS file for dropdown only)
- Must work with both Morning and Afternoon widgets
- Must not interfere with existing schedule functionality
- Must be accessible (keyboard navigation, screen readers)
- Must be responsive (mobile and desktop)

---

## Current System Analysis

### Current Filter System Status

**CRITICAL DISCOVERY:** Existing filter structure found in widget cores.

**Current Widget Structure (based on actual files):**
- **Morning Widget:** `js/morning-schedule-generator.js`, `js/morning-widget-core.js`
- **Afternoon Widget:** `js/afternoon-schedule-generator.js`, `js/afternoon-widget-core.js`  
- **EXISTING Filter HTML:** `.nzgdc-morning-filters-section`, `.nzgdc-morning-filters-label`, `.nzgdc-morning-filters-value` classes in `js/morning-widget-core.js` line 124-135
- **EXISTING Filter Text:** "Filters:" label with "NONE ▶" value display

**Current CSS Bundle Structure:**
- **Morning CSS:** `css/morning-schedule-bundle.css` - includes filter styling (`.nzgdc-morning-filters-section` etc.)
- **Afternoon CSS:** `css/afternoon-schedule-bundle.css` - includes filter styling (`.nzgdc-afternoon-filters-section` etc.)
- **Unified CSS:** `css/unified-event-panel.css` - event panel styling only

### Integration Points

**HTML Enhancement:** Convert existing `.nzgdc-morning-filters-value` (from `renderFiltersInline()` method) to dropdown trigger  
**CSS Addition:** Create new `css/category-filter-overlay.css` file  
**JavaScript Enhancement:** Add dropdown behavior to existing `renderFiltersInline()` method in widget cores  
**Event Filtering:** Integrate with existing `renderSchedule()` method in schedule generators

### 🚨 CRITICAL ARCHITECTURAL CONSTRAINTS

**ABSOLUTE RULES (VIOLATION = SYSTEM FAILURE):**
- ❌ **NEVER** add dropdown CSS to `css/unified-event-panel.css`
- ❌ **NEVER** add dropdown CSS to `css/morning-schedule-bundle.css` or `css/afternoon-schedule-bundle.css`  
- ❌ **NEVER** add dropdown CSS to `css/thursday-schedule-bundle.css`
- ❌ **NEVER** create widget-specific dropdown classes
- ❌ **NEVER** modify `nzgdc-schedule-widget-modular.js` (Thursday widget)
- ✅ **ONLY** create new `css/category-filter-overlay.css` file
- ✅ **ONLY** load new CSS in Morning and Afternoon entry points

---

## Implementation Phases

### Phase 1: CSS Implementation (3-4 hours) - HIGHEST PRIORITY

**FILE TO CREATE:** `css/category-filter-overlay.css`

**CSS ARCHITECTURE RULES:**
- Widget scoping: `.nzgdc-morning-schedule-widget` and `.nzgdc-afternoon-schedule-widget`
- Category colors: Use exact colors from Event Categories specification above
- Responsive design: Mobile breakpoints at 768px
- Accessibility: Focus states and high contrast support

**CSS STRUCTURE TO IMPLEMENT:**
- **Base Classes:** Follow patterns in existing `css/morning-schedule-bundle.css` and `css/afternoon-schedule-bundle.css`
- **Widget Scoping:** Use `.nzgdc-morning-schedule-widget` and `.nzgdc-afternoon-schedule-widget` prefixes
- **Category Colors:** Reference exact colors from `css/unified-event-panel.css` Event Categories implementation
- **Responsive Patterns:** Follow breakpoint patterns in existing CSS bundles

**CRITICAL:** All dropdown styling must be scoped to Morning/Afternoon widgets only. Reference Event Categories colors from `EVENT_DATA_EXAMPLES.md`.

### Phase 2: HTML Structure Enhancement (2-3 hours)

**FILES TO MODIFY:**
- `js/morning-widget-core.js` (contains existing `renderFiltersInline()` method)
- `js/afternoon-widget-core.js` (contains existing `renderFiltersInline()` method)

**EXISTING FILTER STRUCTURE TO ENHANCE:**
- **Reference:** Current `renderFiltersInline()` method in `js/morning-widget-core.js` lines 124-135
- **Current HTML:** `.nzgdc-morning-filters-section` with "Filters:" label and "NONE ▶" text
- **Enhancement:** Replace static "NONE ▶" text with interactive dropdown trigger

**HTML STRUCTURE TO IMPLEMENT:**

**For Morning Widget:**
- **Reference Current Structure:** Examine existing `renderFiltersInline()` method in `js/morning-widget-core.js` lines 124-135
- **Keep Existing Classes:** Maintain `.nzgdc-morning-filters-section`, `.nzgdc-morning-filters-label`, `.nzgdc-morning-filters-label-text`
- **Replace Filter Value:** Convert `.nzgdc-morning-filters-value` div to dropdown structure
- **Add Dropdown Elements:** Create nested dropdown trigger, overlay, and category list elements

**For Afternoon Widget:**  
- **Reference Current Structure:** Examine existing `renderFiltersInline()` method in `js/afternoon-widget-core.js` lines 130-142
- **Keep Existing Classes:** Maintain `.nzgdc-afternoon-filters-section`, `.nzgdc-afternoon-filters-label`, `.nzgdc-afternoon-filters-label-text`
- **Replace Filter Value:** Convert `.nzgdc-afternoon-filters-value` div to dropdown structure
- **Add Dropdown Elements:** Create nested dropdown trigger, overlay, and category list elements

**METHODS TO ENHANCE:**
- `renderFiltersInline()` - Enhance existing method in both widget cores (MODIFY existing methods)
  - Morning: `js/morning-widget-core.js` lines 124-135 (current implementation)
  - Afternoon: `js/afternoon-widget-core.js` lines 130-142 (current implementation)
- `generateCategoryOptions()` - Create HTML for all 11 categories (NEW method to add to both cores)  
- `initializeDropdown()` - Initialize dropdown after widget render (NEW method to add to both cores)

**CRITICAL:** Both widget cores have identical filter structure patterns:
- Morning uses `.nzgdc-morning-filters-*` classes with `morning-category-dropdown` ID
- Afternoon uses `.nzgdc-afternoon-filters-*` classes with `afternoon-category-dropdown` ID

**IMPLEMENTATION LOCATION:**
- Modify existing `renderFiltersInline()` method in `js/morning-widget-core.js` and `js/afternoon-widget-core.js`
- Current location: Called from `renderNavigation()` method, already properly positioned

### Phase 3: JavaScript Dropdown Behavior (4-5 hours)

**FILES TO MODIFY:**
- `js/morning-widget-core.js` (primary location for dropdown integration)
- `js/afternoon-widget-core.js` (primary location for dropdown integration)
- `js/morning-schedule-generator.js` (for filtering logic)
- `js/afternoon-schedule-generator.js` (for filtering logic)

**EXISTING METHODS TO MODIFY:**
- **Widget Core Constructor:** Add dropdown controller initialization property  
- **`renderFiltersInline()` method:** Replace static HTML with dropdown HTML
- **`initializeSchedule()` method:** Add dropdown initialization after schedule loads
- **`destroy()` method:** Add dropdown cleanup

**NEW CLASSES TO IMPLEMENT:**
- `CategoryDropdownController` - Handle all dropdown behavior (NEW class)
- **Methods:** `init()`, `toggle()`, `selectCategory()`, `filterEvents()`, `destroy()`

**EXISTING EVENT SYSTEM INTEGRATION:**
- **Reference:** Current `renderSchedule()` method in `js/morning-schedule-generator.js` and `js/afternoon-schedule-generator.js`
- **Integration:** Modify schedule data before calling generator's `renderSchedule()` method
- **State:** Store original schedule data in widget core for filter reset
- **Flow:** Widget Core → Filter Data → Pass to Schedule Generator → Render

**REQUIRED FUNCTIONALITY:**
- Dropdown toggle on click
- Category selection handling  
- Outside click to close
- Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Event filtering by `categoryKey` field
- State management and cleanup

### Phase 4: Entry Point Integration (1-2 hours)

**FILES TO MODIFY:**
- `nzgdc-morning-schedule-widget-modular.js`
- `nzgdc-afternoon-schedule-widget-modular.js`

**EXISTING CSS LOADING TO ENHANCE:**
- **Reference:** Current CSS loading in `nzgdc-morning-schedule-widget-modular.js` (lines 40-43) and `nzgdc-afternoon-schedule-widget-modular.js`
- **Current Order:** `css/unified-event-panel.css`, then `css/morning-schedule-bundle.css` or `css/afternoon-schedule-bundle.css`
- **New Order:** Add `css/category-filter-overlay.css` third in the loading sequence

**CRITICAL:** Do NOT modify `nzgdc-schedule-widget-modular.js` (Thursday widget must remain unaffected)

**CSS LOADING ORDER:**
1. `css/unified-event-panel.css` (existing)
2. `css/morning-schedule-bundle.css` or `css/afternoon-schedule-bundle.css` (existing)
3. `css/category-filter-overlay.css` (NEW)

### Phase 5: Event Filtering Integration (2-3 hours)

**FILES TO MODIFY:**
- `js/morning-schedule-generator.js`
- `js/afternoon-schedule-generator.js`

**EXISTING EVENT DATA STRUCTURE:**
- **Reference:** Examine `js/morning-events.js`, `js/afternoon-events.js`, and `js/workshop-events.js`
- **Required Fields:** Events must have `categoryKey` and `category` fields (already implemented)
- **Example:** `{ categoryKey: 'GAME_DESIGN', category: 'Game Design', ... }`

**EXISTING EVENT RENDERING TO ENHANCE:**
- **Reference:** Current event rendering methods in schedule generators
- **Enhancement:** Support showing/hiding events based on selected category

**NEW METHODS TO IMPLEMENT:**
- `filterByCategory(categoryKey)` - Filter events by category
- `resetFilter()` - Show all events
- `updateFilterState()` - Manage filter state
- `preserveOriginalEvents()` - Store unfiltered events

**EVENT FILTERING LOGIC:**
- Store original events on first filter
- Create filtered copy for rendering
- Preserve original data for filter reset
- Re-render schedule with filtered events

### Phase 6: Testing & Validation (2-3 hours)

**PRIMARY TESTING INTERFACE:** `.widget-tests/widget-demo.html` (located in .widget-tests directory)

**TESTING CHECKLIST:**

**Dropdown Functionality:**
- [ ] Dropdown opens/closes correctly in Morning widget
- [ ] Dropdown opens/closes correctly in Afternoon widget  
- [ ] All 11 categories display with correct colors
- [ ] Category selection updates trigger text
- [ ] "None" selection shows all events

**Event Filtering:**
- [ ] Each category filters events correctly
- [ ] Events with matching `categoryKey` remain visible
- [ ] Events without matching `categoryKey` are hidden
- [ ] Filter reset shows all events

**Widget Integration:**
- [ ] Morning widget dropdown works independently
- [ ] Afternoon widget dropdown works independently
- [ ] Thursday widget completely unaffected
- [ ] Widget switching resets filters appropriately

**Accessibility:**
- [ ] Keyboard navigation works (Tab, Enter, Escape, arrows)
- [ ] ARIA attributes function properly
- [ ] Screen reader compatibility
- [ ] Focus management correct

**Performance:**
- [ ] CSS file size increase acceptable (<15%)
- [ ] Filtering performance smooth
- [ ] No memory leaks during filter operations
- [ ] Widget initialization time not significantly impacted

**TESTING APPROACH:**
- **Debug Mode:** Set `window.NZGDC_DEBUG = true` (pattern used in all entry points)
- **Testing Functions:** Reference existing testing patterns in `.widget-tests/widget-demo.html`
- **Console Functions:** Follow patterns from existing `testUnifiedSystem()` and `testMainEventPanelCSS()` functions
- **Widget Testing:** Use widget switcher in demo interface to test dropdown functionality

### Phase 7: Documentation & Deployment (1 hour)

**DOCUMENTATION UPDATES:**
- Update `README.md` with dropdown usage instructions
- Document new CSS file in architecture documentation
- Add troubleshooting guide for dropdown issues
- Update `.tasks/CURRENT_ARCHITECTURE_STATUS.md`

**DEPLOYMENT CHECKLIST:**
- [ ] All functionality tested and working
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] Performance metrics acceptable
- [ ] No architectural violations introduced
- [ ] Rollback plan tested

---

## 🚨 CRITICAL WARNINGS & COMMON MISTAKES

### CSS Architecture Violations (SYSTEM KILLERS)

**❌ MISTAKE #1: Wrong CSS File Location**
**FORBIDDEN LOCATIONS:**
- `css/unified-event-panel.css` - Reserved for event panels only
- `css/morning-schedule-bundle.css` - Schedule layout only
- `css/afternoon-schedule-bundle.css` - Schedule layout only
- `css/thursday-schedule-bundle.css` - Thursday layout only

**CONSEQUENCE:** CSS conflicts, broken unified architecture  
**FIX:** Create separate `css/category-filter-overlay.css`

**❌ MISTAKE #2: Widget-Specific Classes**  
**SYMPTOM:** Creating `.nzgdc-morning-dropdown` vs `.nzgdc-afternoon-dropdown`  
**CONSEQUENCE:** Code duplication, maintenance nightmare  
**FIX:** Use widget-scoped classes in single CSS file

**❌ MISTAKE #3: Loading CSS in Wrong Entry Points**
**SYMPTOM:** Loading dropdown CSS in `nzgdc-schedule-widget-modular.js`  
**CONSEQUENCE:** Thursday widget shows broken filter elements  
**FIX:** Only load in Morning/Afternoon entry points

### JavaScript Implementation Violations

**❌ MISTAKE #4: Modifying Original Event Data**
**REFERENCE:** Event data in `js/morning-events.js` and `js/afternoon-events.js`
**VIOLATION:** `delete this.events['event-id']` or `this.events['event-id'].hidden = true`
**CONSEQUENCE:** Events disappear permanently  
**FIX:** Create filtered copy, preserve original data

**❌ MISTAKE #5: Global Event Handlers**
**VIOLATION:** `document.addEventListener('click', handler)` without cleanup  
**CONSEQUENCE:** Memory leaks, conflicts between widgets  
**FIX:** Widget-scoped handlers with proper cleanup

**❌ MISTAKE #6: Missing Category Data**
**REFERENCE:** Event Categories Implementation Guide  
**SYMPTOM:** Events missing `categoryKey` or `category` fields  
**CONSEQUENCE:** Filtering doesn't work  
**FIX:** Ensure all events have required category fields

### Integration Violations

**❌ MISTAKE #7: Breaking Thursday Widget**
**REFERENCE:** `nzgdc-schedule-widget-modular.js` and `js/widget-core.js`  
**VIOLATION:** Loading dropdown CSS or modifying Thursday files  
**CONSEQUENCE:** Thursday functionality compromised  
**FIX:** Keep Thursday widget completely isolated

**❌ MISTAKE #8: Incorrect Category Properties**
**REFERENCE:** Correct colors listed in Event Categories specification above  
**VIOLATION:** Using wrong background colors or text colors  
**CONSEQUENCE:** Visual inconsistency with Event Categories system  
**FIX:** Use exact colors from specification

---

## 🔧 TROUBLESHOOTING GUIDE

### Common Issues

**Issue: Dropdown CSS Not Loading**
**Files to Check:** 
- Entry point CSS loading: `nzgdc-morning-schedule-widget-modular.js` lines 47-50
- Entry point CSS loading: `nzgdc-afternoon-schedule-widget-modular.js` lines 47-50
- Browser Network tab for 404 errors

**Issue: Events Not Filtering**  
**Files to Check:** 
- Event data structure: `js/morning-events.js` (check for `categoryKey` and `category` fields)
- Event data structure: `js/afternoon-events.js` (check for `categoryKey` and `category` fields)
- Reference working structure: First few events in each file show correct format

**Issue: Widget Not Initializing**
**Files to Check:** 
- Dependency validation: `js/morning-widget-core.js` `validateDependencies()` method around line 72
- Dependency validation: `js/afternoon-widget-core.js` `validateDependencies()` method around line 72
- Global variables: Check if required data and classes are loaded

**Issue: Category Colors Wrong**
**Files to Reference:** 
- Current category colors: `css/unified-event-panel.css` Event Categories section
- Complete color specification: `EVENT_DATA_EXAMPLES.md` lines 50-150
- Color validation: Compare against existing Event Categories implementation

### Debugging Commands

**Reference Existing Debug Infrastructure:**
- **Testing Interface:** `.widget-tests/widget-demo.html` contains existing test functions
- **Debug Mode:** Follow pattern in entry points (search for `DEBUG_MODE` in `nzgdc-morning-schedule-widget-modular.js`)
- **Console Logging:** Follow `debugLog()` pattern used in entry points around line 20
- **Error Handling:** Reference existing error handling patterns in widget cores

**Debug Functions to Create:**
- **Dropdown State Check:** Create function following pattern of existing test functions in demo interface
- **Filter Validation:** Create function to verify category filtering using console inspection
- **CSS Loading Check:** Create function following pattern in existing entry points around line 47

---

## 📋 IMPLEMENTATION CHECKLIST

### Pre-Implementation
- [ ] Read `CSS_REDUNDANCY_WARNING.md` thoroughly  
- [ ] Verify Event Categories system implemented (prerequisite from `Event-Categories-Implementation-Guide.md`)
- [ ] UNDERSTAND: Existing filter UI structure exists in widget cores - enhance existing `renderFiltersInline()` method
- [ ] Test current system using `.widget-tests/widget-demo.html` interface
- [ ] Examine existing filter structure in both widget cores:
  - Morning: `js/morning-widget-core.js` lines 124-135 (`renderFiltersInline()` method)
  - Afternoon: `js/afternoon-widget-core.js` lines 130-142 (`renderFiltersInline()` method)

### Phase Completion Checklist
- [ ] Phase 1: `css/category-filter-overlay.css` created with all category colors
- [ ] Phase 2: ENHANCED filter HTML structure in both widget cores (`renderFiltersInline()` method)
- [ ] Phase 3: NEW dropdown controller and behavior integrated with widget cores
- [ ] Phase 4: CSS loading added to Morning/Afternoon entry points only
- [ ] Phase 5: NEW event filtering system integrated with widget core → schedule generator flow
- [ ] Phase 6: All functionality tested across widgets and browsers
- [ ] Phase 7: Documentation updated and deployment ready

### Final Validation
- [ ] Morning widget dropdown fully functional
- [ ] Afternoon widget dropdown fully functional  
- [ ] Thursday widget completely unaffected
- [ ] All 11 categories filter correctly using exact colors from current Event Categories system
- [ ] No CSS architecture violations introduced (verified against `CSS_REDUNDANCY_WARNING.md`)
- [ ] Performance impact within acceptable ranges (<15% CSS file size increase)
- [ ] Accessibility requirements met (keyboard navigation, ARIA attributes)
- [ ] Mobile responsiveness confirmed on actual devices

---

## 📊 SUCCESS METRICS

### Technical Metrics
- ✅ NEW dropdown functionality works in Morning and Afternoon widgets
- ✅ All 11 categories filter events using existing `categoryKey` fields from event data
- ✅ CSS architecture maintained (dropdown CSS in new `css/category-filter-overlay.css` file only)
- ✅ Thursday widget completely preserved and unaffected (no filter system added)
- ✅ Performance impact <15% (additional CSS file size increase)

### User Experience Metrics  
- ✅ Intuitive dropdown interaction matching web standards
- ✅ Visual consistency with Event Categories color scheme
- ✅ Full accessibility compliance (keyboard and screen reader)
- ✅ Responsive behavior on desktop and mobile devices
- ✅ Smooth filter transitions and state management

**CRITICAL SUCCESS FACTORS:**
1. ENHANCE existing filter UI structure in widget cores (`renderFiltersInline()` method)
2. Strict adherence to unified architecture principles (separate CSS file)
3. Correct Event Categories colors from existing `css/unified-event-panel.css`
4. Proper CSS loading order in entry points (third file after schedule bundle)
5. Complete isolation from Thursday widget (no modifications to Thursday files)
6. Integration with existing widget core → schedule generator → event rendering flow

---

**DOCUMENT VERSION:** v1.0  
**ARCHITECTURE:** Unified v1.9 with Event Categories Integration  
**STATUS:** ✅ READY FOR IMPLEMENTATION  
**PREREQUISITE:** Event Categories system must be implemented first  
**FILES REFERENCED:** Current codebase structure analyzed - existing filter UI found in widget cores  
**TESTING LOCATION:** Use `.widget-tests/widget-demo.html` for all testing  
**KEY DISCOVERY:** Filter HTML exists in `renderFiltersInline()` method in BOTH widget cores - enhance existing methods rather than create from scratch  
**PATTERN CONSISTENCY:** Both Morning and Afternoon widgets use identical filter structure with widget-specific CSS class prefixes