# NZGDC Schedule Views Consolidation Plan: Morning & Afternoon Unified Widget

## ⚠️ CRITICAL REQUIREMENTS & CONSTRAINTS

### PRIMARY OBJECTIVES
1. **Consolidate Morning and Afternoon schedule views into a single unified widget**
2. **Use existing "Morning Events" and "Afternoon Events" buttons for view switching**
3. **Default to Morning Events view on first load**
4. **Maintain ALL existing functionality, design, and UX exactly as is**
5. **Preserve Event Category filter dropdown positioning, design, and behavior**

### NON-NEGOTIABLE CONSTRAINTS
- **ZERO UI/UX design changes permitted**
- **ALL existing functionality must work identically**
- **widget-demo.html must function perfectly after consolidation**
- **Event Panel designs must load correctly**
- **Thursday and Full-Day Schedule Views must remain toggleable**
- **Event Category filter dropdown must work exactly as before**

## 📋 CURRENT ARCHITECTURE ANALYSIS

### Files to be Consolidated
**Morning Schedule Files:**
- `nzgdc-morning-schedule-widget-modular.js`
- `css/morning-schedule-bundle.css`
- `js/morning-widget-core.js`
- `js/morning-schedule-generator.js`
- `js/morning-schedule-data.js`
- `js/morning-events.js`

**Afternoon Schedule Files:**
- `nzgdc-afternoon-schedule-widget-modular.js`
- `css/afternoon-schedule-bundle.css`
- `js/afternoon-widget-core.js`
- `js/afternoon-schedule-generator.js`
- `js/afternoon-schedule-data.js`
- `js/afternoon-events.js`

### Files to be Preserved (CRITICAL - DO NOT MODIFY)
- `css/unified-event-panel.css` - **ABSOLUTE NO-TOUCH**
- `js/unified-event-loader.js` - **ABSOLUTE NO-TOUCH**
- `templates/unified-event-panel.html` - **ABSOLUTE NO-TOUCH**
- `css/category-filter-overlay.css` - **ABSOLUTE NO-TOUCH**
- All Thursday schedule files - **ABSOLUTE NO-TOUCH**

## 🏗️ CONSOLIDATION IMPLEMENTATION PLAN

### Phase 1: Create Unified Schedule Widget Architecture

#### 1.1 Create New Unified Entry Point
**File:** `nzgdc-friday-saturday-schedule-widget-modular.js`

**Requirements:**
- Combine functionality from both morning and afternoon entry points
- Implement tab switching logic
- Load both morning and afternoon CSS bundles
- Initialize with Morning Events view by default
- Maintain all existing debugging and error handling

**Key Features:**
```javascript
// Pseudo-code structure
class NZGDCFridaySaturdayWidget {
  constructor() {
    this.currentView = 'morning'; // Default to morning
    this.morningWidgetCore = null;
    this.afternoonWidgetCore = null;
  }
  
  async loadWidget() {
    // Load both CSS bundles
    // Load unified event panel CSS
    // Load category filter CSS
    // Initialize both widget cores
    // Render unified interface with both existing button sets
    // Show morning view by default
    // Wire up existing Morning/Afternoon Events buttons
  }
  
  switchToMorning() {
    // Hide afternoon content
    // Show morning content
    // Update existing button states
  }
  
  switchToAfternoon() {
    // Hide morning content
    // Show afternoon content
    // Update existing button states
  }
}
```

#### 1.2 Create Unified CSS Bundle
**File:** `css/friday-saturday-schedule-bundle.css`

**Requirements:**
- Combine morning-schedule-bundle.css and afternoon-schedule-bundle.css
- Implement view-specific CSS classes (.morning-view-active, .afternoon-view-active)
- Preserve ALL existing styling for both views
- Add tab styling for Morning/Afternoon Events buttons
- **CRITICAL: NO event panel CSS - use unified-event-panel.css**

**CSS Structure:**
```css
/* Base widget styles */
.nzgdc-friday-saturday-schedule-widget { }

/* Existing button navigation styles - NO NEW STYLES NEEDED */
/* Morning/Afternoon Events buttons already exist and are styled */

/* View-specific container styling */
.morning-view-container { }
.afternoon-view-container { }

/* Show/hide logic */
.nzgdc-friday-saturday-schedule-widget.morning-view .afternoon-view-container { display: none; }
.nzgdc-friday-saturday-schedule-widget.afternoon-view .morning-view-container { display: none; }

/* Import existing bundle styles with view-specific prefixes */
.nzgdc-friday-saturday-schedule-widget.morning-view .nzgdc-morning-schedule-widget { }
.nzgdc-friday-saturday-schedule-widget.afternoon-view .nzgdc-afternoon-schedule-widget { }
```

#### 1.3 Create Unified Widget Core
**File:** `js/friday-saturday-widget-core.js`

**Requirements:**
- Combine functionality from morning-widget-core.js and afternoon-widget-core.js
- Implement view switching logic
- Maintain separate instances of morning and afternoon generators
- Preserve all event category filtering functionality
- Handle tab click events

### Phase 2: Update Schedule Generators

#### 2.1 Enhanced Morning Schedule Generator
**Modifications to:** `js/morning-schedule-generator.js`

**Requirements:**
- Add support for unified widget context
- Update CSS class prefixes to work within unified widget
- Maintain all existing functionality
- Add view-specific container wrapping

#### 2.2 Enhanced Afternoon Schedule Generator  
**Modifications to:** `js/afternoon-schedule-generator.js`

**Requirements:**
- Add support for unified widget context
- Update CSS class prefixes to work within unified widget
- Maintain all existing functionality
- Add view-specific container wrapping
- Wire up existing Morning/Afternoon Events buttons for view switching
- Wire up existing Morning/Afternoon Events buttons for view switching

### Phase 3: Update widget-demo.html Integration

#### 3.1 Modify Toggle Logic
**Updates to:** `.widget-tests/widget-demo.html`

**Requirements:**
- Replace separate morning/afternoon widget creation with unified widget
- Update toggle button logic: Thursday → Friday/Saturday → Thursday
- Maintain all existing test functions
- Update button labels appropriately
- Preserve all debugging functionality

**New Toggle Flow:**
1. **Thursday Schedule** → Show Thursday widget
2. **Friday/Saturday Schedule** → Show unified Friday/Saturday widget (defaults to Morning, existing buttons work)
3. **Back to Thursday** → Hide Friday/Saturday, show Thursday

#### 3.2 Update Status Messages
- Update "Friday/Saturday Morning Schedule" to "Friday/Saturday Schedule"
- Maintain all existing status indicators
- Preserve debug information display

### Phase 4: Event Category Filter Integration

#### 4.1 Unified Category Filtering
**Requirements:**
- Ensure category filter dropdown works in both Morning and Afternoon views
- Preserve existing dropdown positioning and design
- Maintain alphabetical ordering
- Preserve color-coded category system
- Handle view switching with active filters

#### 4.2 Filter State Management
- Separate filter states for Morning vs Afternoon views
- Reset filter when switching views (preserve current UX)
- Maintain all existing category color mappings

## 🚨 CRITICAL IMPLEMENTATION WARNINGS

### CSS Architecture Violations (SYSTEM KILLERS)
**NEVER add these to bundle files:**
```css
/* FORBIDDEN - Will break system */
.any-widget .nzgdc-event-panel-big { }
.any-widget .nzgdc-event-panel-main { }
.any-widget .nzgdc-event-category-big { }
.any-widget .nzgdc-event-category-main { }
.any-widget .nzgdc-speaker-* { }
```

### JavaScript Integration Rules
- **NEVER modify unified-event-loader.js**
- **NEVER duplicate event panel generation logic**
- **ALWAYS use existing unified event panel system**
- **PRESERVE all existing debugging capabilities**

### File Modification Restrictions
**ABSOLUTELY NO MODIFICATIONS to:**
- `css/unified-event-panel.css`
- `js/unified-event-loader.js`
- `templates/unified-event-panel.html`
- `css/category-filter-overlay.css`
- Any Thursday schedule files
- Any existing development files

## 📋 DETAILED IMPLEMENTATION STEPS

### Step 1: Create Unified Entry Point
1. Create `nzgdc-friday-saturday-schedule-widget-modular.js`
2. Combine loading logic from both morning and afternoon entry points
3. Wire up existing Morning/Afternoon Events buttons for view switching
4. Implement default Morning view loading
5. Test basic widget initialization

### Step 2: Create Unified CSS Bundle  
1. Create `css/friday-saturday-schedule-bundle.css`
2. Import and adapt morning-schedule-bundle.css styles
3. Import and adapt afternoon-schedule-bundle.css styles
4. Preserve existing button styling (no changes needed)
5. Implement view switching CSS logic
6. **CRITICAL: Validate no event panel CSS duplication**

### Step 3: Create Unified Widget Core
1. Create `js/friday-saturday-widget-core.js`
2. Combine core functionality from both widget cores
3. Implement view state management
4. Wire up existing Morning/Afternoon Events button event handlers
5. Preserve all event category filtering
6. Test view switching functionality

### Step 4: Update Schedule Generators
1. Modify `js/morning-schedule-generator.js` for unified context
2. Modify `js/afternoon-schedule-generator.js` for unified context
3. Ensure proper CSS class prefixing
4. Test both generators within unified widget
5. Validate event panel rendering

### Step 5: Update widget-demo.html
1. Replace separate widget creation with unified widget
2. Update toggle button logic and labels
3. Modify test functions for unified widget
4. Preserve all existing debug capabilities
5. Test complete integration

### Step 6: Comprehensive Testing
1. **Visual Testing:** Verify all designs match exactly
2. **Functional Testing:** Test tab switching
3. **Filter Testing:** Verify category dropdown in both views
4. **Integration Testing:** Test with Thursday schedule toggling
5. **Performance Testing:** Ensure no regression in load times
6. **Browser Testing:** Test across all supported browsers

## 🔧 TESTING PROTOCOL

### Pre-Implementation Testing
- [ ] Document current widget-demo.html behavior completely
- [ ] Screenshot all UI states for comparison
- [ ] Test all existing functionality thoroughly
- [ ] Document current performance metrics

### During Implementation Testing
- [ ] Test each phase independently
- [ ] Validate CSS architecture compliance
- [ ] Test JavaScript functionality incrementally
- [ ] Verify no regressions in existing features

### Post-Implementation Validation
- [ ] Compare all UI elements with pre-implementation screenshots
- [ ] Test complete user workflow: load → toggle → filter → switch views
- [ ] Validate Thursday schedule integration still works
- [ ] Test all browser compatibility
- [ ] Performance regression testing
- [ ] Debug mode functionality testing

## 🎯 SUCCESS CRITERIA

### Functional Requirements
- [ ] Single unified Friday/Saturday widget loads successfully
- [ ] Existing "Morning Events" and "Afternoon Events" buttons function correctly for view switching
- [ ] Default view is Morning Events
- [ ] Button-based view switching preserves all functionality
- [ ] Event category filter dropdown works in both views
- [ ] Thursday schedule toggling works exactly as before
- [ ] All existing test functions work identically

### Visual Requirements  
- [ ] All UI elements appear identical to current implementation
- [ ] Existing button styling remains unchanged (no integration needed)
- [ ] Morning and Afternoon view designs preserved exactly
- [ ] Event panel layouts unchanged
- [ ] Category filter dropdown positioning unchanged
- [ ] No visual regressions anywhere

### Technical Requirements
- [ ] No CSS architecture violations
- [ ] No JavaScript errors or warnings
- [ ] No performance regressions
- [ ] All existing debugging capabilities preserved
- [ ] Clean code architecture maintained

## 🚨 ROLLBACK PLAN

### Emergency Rollback Steps
If any issues arise during implementation:

1. **Immediate Rollback:**
   - Restore original widget entry point files
   - Revert widget-demo.html changes
   - Remove new unified files

2. **File Restoration:**
   ```bash
   # Restore original files
   git checkout HEAD -- nzgdc-morning-schedule-widget-modular.js
   git checkout HEAD -- nzgdc-afternoon-schedule-widget-modular.js
   git checkout HEAD -- .widget-tests/widget-demo.html
   
   # Remove new unified files
   rm nzgdc-friday-saturday-schedule-widget-modular.js
   rm css/friday-saturday-schedule-bundle.css
   rm js/friday-saturday-widget-core.js
   ```

3. **Validation:**
   - Test widget-demo.html functionality
   - Verify all original behavior restored
   - Confirm no regressions

## 📁 FILE ORGANIZATION AFTER CONSOLIDATION

### New Files Created
- `nzgdc-friday-saturday-schedule-widget-modular.js` (main entry point)
- `css/friday-saturday-schedule-bundle.css` (unified styling)
- `js/friday-saturday-widget-core.js` (unified core logic)

### Files to be Deprecated (Keep for Rollback)
- `nzgdc-morning-schedule-widget-modular.js` (move to deprecated/)
- `nzgdc-afternoon-schedule-widget-modular.js` (move to deprecated/)
- `css/morning-schedule-bundle.css` (move to deprecated/)
- `css/afternoon-schedule-bundle.css` (move to deprecated/)
- `js/morning-widget-core.js` (move to deprecated/)
- `js/afternoon-widget-core.js` (move to deprecated/)

### Files Preserved Unchanged
- All unified-event-* files
- All Thursday schedule files  
- All category filter files
- All development files
- All documentation files

## 🎉 COMPLETION CHECKLIST

### Development Complete
- [ ] All new files created and functional
- [ ] All existing files properly deprecated
- [ ] widget-demo.html updated and tested
- [ ] No CSS architecture violations
- [ ] No JavaScript errors

### Testing Complete  
- [ ] All UI elements verified identical
- [ ] All functionality verified working
- [ ] Cross-browser testing passed
- [ ] Performance testing passed
- [ ] Integration testing passed

### Documentation Complete
- [ ] Implementation notes documented
- [ ] Architecture changes documented  
- [ ] Testing results documented
- [ ] Rollback procedures verified
- [ ] Future maintenance notes prepared

---

## ⚡ FINAL WARNING

**This consolidation MUST NOT change ANY aspect of the user interface, user experience, or existing functionality. The goal is architectural consolidation with identical end-user behavior.**

**ANY deviation from this requirement will be considered a failure of the implementation.**