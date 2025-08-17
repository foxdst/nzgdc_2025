# EXPANDED EVENT DETAILS INTEGRATION PLAN
## Complete Integration Development Guide for NZGDC Widget System

---

## 🎯 **OBJECTIVE**

Integrate the existing Expanded Event Details overlay prototype (`expanded-event-details-overlay-prototype.html`) seamlessly into the NZGDC Widget system to work with both Big Panel (620x300) and Main Panel (300x300) event designs, utilizing their respective event data.

---

## 📋 **CURRENT STATE ANALYSIS**

### ✅ **What Already Exists**
- **Overlay Prototype**: Complete CSS and HTML structure in `expanded-event-details-overlay-prototype.html`
- **Clickable CTA System**: Both overlay types are already clickable buttons that trigger existing CTA handlers
- **Event Data Structure**: Complete event data with speakers, descriptions, categories, thumbnails
- **Widget Architecture**: Unified Event Loader system for consistent event panel creation

### 🚨 **What's Missing**
- **Integration Bridge**: No connection between CTA clicks and expanded overlay display
- **Event Data Mapping**: No system to pass widget event data to overlay content
- **Overlay Management**: No lifecycle management for overlay creation/destruction
- **CSS Integration**: Overlay styles not loaded in widget environment



---

## 🏗️ **INTEGRATION ARCHITECTURE**

### **Core Integration Components**
1. **Expanded Event Details Manager** (`js/expanded-event-details-manager.js`)
2. **Event Data Adapter** (extension to `js/unified-event-loader.js`)
3. **Overlay CSS Integration** (`css/expanded-event-details-overlay.css`)
4. **Template Integration** (`templates/expanded-event-details-overlay.html`)

### **Integration Flow**
```
User hovers event panel → Overlay appears (existing)
User clicks overlay → CTA click triggered (existing)
CTA click → New: Expanded Details Manager → Show overlay with event data
```

---

## 🔧 **IMPLEMENTATION PLAN**

### **PHASE 0: MANDATORY CSS Conflict Resolution** 🚨

#### **Step 0.1: Critical Class Name Conflicts**
**BLOCKING ISSUE**: Direct CSS class name collisions identified that WILL break existing widget functionality.

**Required Actions**:
```css
/* CRITICAL RENAMES REQUIRED */
.nzgdc-speaker-name → .nzgdc-expanded-speaker-name
.nzgdc-speaker-position → .nzgdc-expanded-speaker-position  
.nzgdc-event-description → .nzgdc-expanded-event-description
.nzgdc-speaker-description → .nzgdc-expanded-speaker-description
.nzgdc-speaker-contact → .nzgdc-expanded-speaker-contact
```

#### **Step 0.2: CSS Variable Namespace Isolation**
**BLOCKING ISSUE**: Shared CSS variable names will override widget theming system.

**Required Actions**:
```css
/* BEFORE (CONFLICTS) */
--font-family-demi → --expanded-font-family-demi
--font-family-bold → --expanded-font-family-bold
--color-primary → --expanded-color-primary
--color-bg → --expanded-color-bg
--color-title → --expanded-color-title
/* All CSS variables MUST be prefixed with 'expanded-' */
```

#### **Step 0.3: Global CSS Override Removal**
**BLOCKING ISSUE**: Body/HTML modifications will break parent site typography.

**Required Actions**:
```css
/* REMOVE THESE COMPLETELY */
body { font-family: Arial, sans-serif; } /* ❌ DELETE */
/* Any other global selectors must be removed */
```

#### **Step 0.4: CSS Specificity Protection**
**Required Pattern**:
```css
/* ALL overlay styles MUST follow this pattern */
.nzgdc-expanded-event-overlay .nzgdc-expanded-[component-name] {
    /* Styles here - properly scoped and isolated */
}
```

#### **Step 0.5: Conflict Testing**
- [ ] Load existing widget with modified overlay CSS
- [ ] Verify NO existing styles are affected
- [ ] Confirm overlay styles are properly isolated
- [ ] Test typography inheritance
- [ ] Validate z-index compatibility

**⚠️ IMPLEMENTATION BLOCKED until ALL Step 0 actions complete**

### **PHASE 1: File Preparation & CSS Integration**

#### **Step 1.1: Extract and Integrate CSS**
**File**: `css/expanded-event-details-overlay.css`
```css
/* Extract all CSS from prototype HTML (lines 14-535) */
/* Apply all fixes from changelog 2025-08-14_expanded_event_details_overlay_fixes.md */
/* Ensure NZGDC design system compliance (no rounded corners) */
```

**Integration Points**:
- Load AFTER `unified-event-panel.css` in bundle files
- Load AFTER `category-filter-overlay.css` 
- Ensure proper CSS cascade order

#### **Step 1.2: Create HTML Template**
**File**: `templates/expanded-event-details-overlay.html`
```html
<!-- Extract HTML structure from prototype (lines 578-632) -->
<!-- Ensure template compatibility with dynamic content population -->
```

#### **Step 1.3: Update Bundle Files**
**Files to Update**:
- `nzgdc-schedule-widget-modular.js` (Thursday widget)
- `nzgdc-friday-saturday-schedule-widget-modular.js` (Friday/Saturday widget)

**Changes Required**:
```javascript
// Add CSS import for expanded details overlay
// Add template loading for overlay HTML structure
```

### **PHASE 2: Core Integration Manager**

#### **Step 2.1: Create Expanded Event Details Manager**
**File**: `js/expanded-event-details-manager.js`

**Core Responsibilities**:
```javascript
class ExpandedEventDetailsManager {
  constructor() {
    this.overlayContainer = null;
    this.currentEventData = null;
    this.isOverlayVisible = false;
    this.templateLoaded = false;
  }

  // Template loading and initialization
  async loadTemplate() {
    // Load overlay HTML template
    // Inject into DOM
    // Setup event listeners
  }

  // Main entry point for showing overlay
  showEventDetails(eventData, sourceWidget = 'unknown') {
    // Validate event data
    // Populate overlay content
    // Show overlay with animation
    // Setup close handlers
  }

  // Content population methods
  populateEventContent(eventData) {
    // Map widget event data to overlay structure
    // Handle single vs multiple speakers
    // Process audience tags
    // Setup speaker bio cards
  }

  // Lifecycle management
  hideEventDetails() {
    // Hide overlay with animation
    // Clean up dynamic content
    // Reset state
  }

  destroy() {
    // Remove overlay from DOM
    // Clean up event listeners
    // Reset manager state
  }
}
```

#### **Step 2.2: Extend Unified Event Loader**
**File**: `js/unified-event-loader.js`

**Changes Required**:
```javascript
// In setupBigPanelHover method (around line 598):
overlay.addEventListener("click", (e) => {
  const ctaElement = overlay.querySelector(".nzgdc-call-to-action-big");
  if (ctaElement) {
    // NEW: Trigger expanded event details instead of generic CTA
    if (window.ExpandedEventDetailsManager) {
      window.ExpandedEventDetailsManager.showEventDetails(eventData, 'big-panel');
    } else {
      // Fallback to existing behavior
      ctaElement.click();
    }
    this.debug("Big panel overlay clicked for:", eventData.title);
  }
});

// In setupMainPanelHover method (around line 638):
overlay.addEventListener("click", (e) => {
  const ctaElement = overlay.querySelector(".nzgdc-call-to-action-main");
  if (ctaElement) {
    // NEW: Trigger expanded event details instead of generic CTA
    if (window.ExpandedEventDetailsManager) {
      window.ExpandedEventDetailsManager.showEventDetails(eventData, 'main-panel');
    } else {
      // Fallback to existing behavior
      ctaElement.click();
    }
    this.debug("Main panel overlay clicked for:", eventData.title);
  }
});
```

### **PHASE 3: Event Data Mapping**

#### **Step 3.1: Data Structure Standardization**
**Target Structure**:
```javascript
// Standardized event data format for overlay
const standardEventData = {
  title: string,
  description: string,
  speakers: [
    {
      name: string,
      position: string,
      bio: string,
      email: string,
      website: string,
      headshot: string|null
    }
  ],
  audienceTags: [string], // Array of category keys
  category: string,
  timeframe: string,
  thumbnail: string
};
```

#### **Step 3.2: Data Adapters**
**Implementation in Expanded Event Details Manager**:
```javascript
// Convert Thursday workshop data to standard format
adaptThursdayEventData(eventData) {
  return {
    title: eventData.title,
    description: eventData.description || eventData.synopsis,
    speakers: this.adaptSpeakerData(eventData.speakers),
    audienceTags: this.extractAudienceTags(eventData),
    category: eventData.category,
    timeframe: eventData.timeframe,
    thumbnail: eventData.thumbnail
  };
}

// Convert Friday/Saturday event data to standard format
adaptFridaySaturdayEventData(eventData) {
  return {
    title: eventData.title,
    description: eventData.description || eventData.synopsis,
    speakers: this.adaptSpeakerData(eventData.speakers),
    audienceTags: this.extractAudienceTags(eventData),
    category: eventData.category,
    timeframe: eventData.timeframe,
    thumbnail: eventData.thumbnail
  };
}
```

### **PHASE 4: UI/UX Integration**

#### **Step 4.1: Animation and Transitions**
**Integration with Existing System**:
- Use same transition duration as hover overlays (0.3s)
- Maintain accessibility compliance (respect `prefers-reduced-motion`)
- Ensure smooth overlay appearance/disappearance

#### **Step 4.2: Responsive Design**
**Breakpoint Integration**:
- Use existing widget breakpoints (768px, 480px)
- Ensure overlay scales properly on all devices
- Test with both widget types in various container sizes

#### **Step 4.3: Keyboard Accessibility**
**Requirements**:
- ESC key closes overlay
- Tab navigation within overlay
- Focus management (return focus to trigger element)
- Screen reader compatibility

### **PHASE 5: Testing & Quality Assurance**

#### **Step 5.1: Integration Testing**
**Test Matrix**:
```
Widget Type     | Panel Type | Event Type        | Expected Result
Thursday        | Big        | Single Speaker    | Overlay shows with 1 speaker
Thursday        | Big        | Multiple Speakers | Overlay shows with N speakers
Thursday        | Main       | Any               | Overlay shows correctly
Friday Morning  | Big        | Any               | Overlay shows correctly
Friday Morning  | Main       | Any               | Overlay shows correctly
Saturday Afternoon | Big     | Any               | Overlay shows correctly
Saturday Afternoon | Main    | Any               | Overlay shows correctly
```

#### **Step 5.2: Cross-Browser Testing**
**Browsers**:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

#### **Step 5.3: Performance Testing**
**Metrics**:
- Overlay show/hide animation performance (60fps target)
- Memory usage (no memory leaks on repeated open/close)
- Bundle size impact (minimize CSS/JS addition)

---

## 📁 **FILE IMPLEMENTATION ORDER**

### **Critical Loading Order**
**⚠️ PHASE 0 MUST COMPLETE FIRST - CSS conflicts resolved**

1. **CSS Conflict Resolution** (MANDATORY FIRST)
   - Rename all conflicting CSS classes in prototype
   - Prefix all CSS variables with 'expanded-'
   - Remove global CSS overrides (body, html styles)
   - Test isolation in controlled environment

2. **CSS Integration** (SECOND)
   - `css/expanded-event-details-overlay.css` (conflict-free version)
   - Update bundle CSS imports

3. **Template Creation** (THIRD)
   - `templates/expanded-event-details-overlay.html`

4. **Manager Implementation** (FOURTH)
   - `js/expanded-event-details-manager.js`

5. **Unified Event Loader Extension** (FIFTH)
   - Modify `js/unified-event-loader.js`

6. **Bundle Updates** (SIXTH)
   - Update entry point bundle files

### **Development Workflow**
```bash
# Step 1: Create overlay CSS file
# Step 2: Create overlay template file  
# Step 3: Create manager JavaScript file
# Step 4: Modify unified-event-loader.js
# Step 5: Update bundle files
# Step 6: Update demo page for testing
# Step 7: Test all widget combinations
```

---

## 🔒 **ARCHITECTURAL SAFETY REQUIREMENTS**

### **CSS Architecture Compliance**
```
✅ REQUIRED: Overlay styles in dedicated CSS file
❌ FORBIDDEN: Overlay styles in widget bundle CSS files

✅ REQUIRED: Proper CSS loading order (overlay CSS loads AFTER unified-event-panel.css)
❌ FORBIDDEN: CSS conflicts with existing event panel styles
```

### **JavaScript Architecture Compliance**
```
✅ REQUIRED: Extend existing CTA click behavior, don't replace it
❌ FORBIDDEN: Remove or duplicate existing overlay click functionality

✅ REQUIRED: Use unified-event-loader for consistent behavior
❌ FORBIDDEN: Create separate event handling systems
```

### **Loading Order Compliance**
```
CRITICAL ORDER:
1. unified-event-panel.css (existing event styles)
2. category-filter-overlay.css (existing filter styles)  
3. expanded-event-details-overlay.css (NEW overlay styles)
4. widget-bundle.css (existing layout styles)
5. JavaScript modules (any order, but manager must load before usage)
```

---

## 🧪 **TESTING REQUIREMENTS**

### **Pre-Integration Testing**
- [ ] Verify existing overlay click functionality works
- [ ] Confirm CTA elements exist and are clickable
- [ ] Test existing event data structure across all widgets

### **Post-Integration Testing**
- [ ] All existing functionality remains intact
- [ ] Overlay shows correctly for both panel types
- [ ] Event data maps correctly to overlay content
- [ ] Animations work smoothly across browsers
- [ ] Accessibility requirements met
- [ ] No console errors or warnings
- [ ] Performance impact acceptable

### **User Acceptance Testing**
- [ ] Hover → Click → Overlay workflow intuitive
- [ ] Event details display completely and correctly
- [ ] Mobile experience equivalent to desktop
- [ ] Loading times acceptable
- [ ] Visual design matches NZGDC standards

---

## 📊 **PERFORMANCE TARGETS**

### **Loading Performance**
- CSS addition: < 15KB
- JavaScript addition: < 25KB
- Template loading: < 100ms
- First overlay show: < 200ms

### **Runtime Performance**
- Overlay show animation: 60fps
- Overlay hide animation: 60fps
- Memory usage: No leaks on repeated open/close
- Event data processing: < 50ms per event

---

## 🚨 **CRITICAL WARNINGS**

### **🔴 IMPLEMENTATION CURRENTLY BLOCKED**
**CSS CONFLICTS IDENTIFIED**: Direct class name collisions and CSS variable conflicts WILL break existing widget functionality. Phase 0 resolution is MANDATORY before any implementation can proceed.

### **DO NOT BREAK EXISTING FUNCTIONALITY**
The overlay click system is already implemented and working. The expanded event details system must **EXTEND** this functionality, not replace it.

### **RESOLVE CSS CONFLICTS FIRST**
- **Class Name Collisions**: `.nzgdc-speaker-name`, `.nzgdc-speaker-position`, `.nzgdc-event-description` MUST be renamed
- **CSS Variable Conflicts**: All `--font-*` and `--color-*` variables MUST be prefixed with `expanded-`
- **Global Overrides**: Body/HTML styles MUST be removed completely
- **Specificity Protection**: ALL overlay styles MUST be properly scoped

### **PRESERVE ARCHITECTURAL BOUNDARIES**
- Event panel styles belong in `unified-event-panel.css`
- Overlay styles belong in `expanded-event-details-overlay.css` (conflict-free)
- Widget layout styles belong in bundle CSS files
- **DO NOT MIX THESE CONCERNS**

### **MAINTAIN LOADING ORDER**
The CSS loading order is critical for proper style cascade. Loading overlay CSS before unified event panel CSS will break existing styling.

---



---

## 🔄 **ROLLBACK PROCEDURES**

### **If Integration Fails**
1. **Remove CSS import** from bundle files
2. **Revert unified-event-loader.js** to previous version
3. **Remove manager JavaScript file**
4. **Remove template file**
5. **Test existing overlay click functionality**

### **Rollback Files**
- `js/unified-event-loader.js` (revert click handler changes)
- Bundle files (remove CSS imports)
- Remove new files: manager, template, CSS

---

## 🎯 **SUCCESS CRITERIA**

### **Functionality Success**
- [ ] Clicking Big Panel overlays opens expanded event details
- [ ] Clicking Main Panel overlays opens expanded event details  
- [ ] Event data displays correctly in overlay
- [ ] All speaker information shows properly
- [ ] Overlay closes correctly (ESC, click outside, close button)

### **Performance Success**
- [ ] No performance degradation in existing widgets
- [ ] Smooth animations (60fps)
- [ ] Fast overlay loading (< 200ms)
- [ ] No memory leaks

### **Architecture Success**
- [ ] No breaking changes to existing system
- [ ] CSS boundaries maintained
- [ ] Loading order preserved
- [ ] Code follows existing patterns

---

## 📞 **IMPLEMENTATION SUPPORT**

### **🚨 PRE-IMPLEMENTATION CSS CONFLICT TESTING**
```javascript
// Test for CSS conflicts before implementation
function testCSSConflicts() {
    const existingSpeakerName = document.querySelector('.nzgdc-speaker-name-main');
    const existingSpeakerPosition = document.querySelector('.nzgdc-speaker-position-company-main');
    
    console.log('Existing speaker name styles:', window.getComputedStyle(existingSpeakerName));
    console.log('Existing speaker position styles:', window.getComputedStyle(existingSpeakerPosition));
    
    // After overlay CSS is loaded, check if these styles changed
    // They should remain EXACTLY the same
}
```

### **Debug Tools Available**
```javascript
// Enable expanded details debug mode
localStorage.setItem('nzgdc-expanded-details-debug', 'true');

// Check manager status
console.log(window.ExpandedEventDetailsManager?.getStatus());

// Check template loading
console.log(window.ExpandedEventDetailsManager?.templateLoaded);

// Test CSS isolation
function validateCSSIsolation() {
    const widgetStyles = document.querySelector('.nzgdc-event-panel-big');
    const overlayStyles = document.querySelector('.nzgdc-expanded-event-overlay');
    return {
        widgetUnaffected: /* validation logic */,
        overlayIsolated: /* validation logic */
    };
}
```

### **Common Issues Prevention**
1. **🔴 CSS Conflicts**: MOST CRITICAL - Use Phase 0 conflict resolution checklist
2. **Overlay Not Showing**: Check CSS loading order AFTER conflict resolution
3. **Event Data Missing**: Verify data adapter implementation
4. **Click Not Working**: Confirm unified-event-loader integration
5. **Styling Broken**: Check CSS boundary compliance and isolation
6. **Typography Issues**: Verify CSS variables are properly scoped

---

## 📝 **IMPLEMENTATION SUMMARY**

### **Integration Overview**
This plan provides a complete roadmap for integrating the existing Expanded Event Details overlay prototype with the NZGDC Widget system. The integration leverages the existing clickable overlay system and extends it to show comprehensive event information.

### **Key Integration Points**
1. **CSS Integration**: Extract prototype styles into dedicated CSS file with proper loading order
2. **Template System**: Convert prototype HTML into reusable template structure  
3. **Manager Implementation**: Create dedicated overlay lifecycle management system
4. **Data Mapping**: Bridge widget event data with overlay content requirements
5. **Click Handler Extension**: Enhance existing CTA clicks to trigger expanded details

### **Architectural Preservation**
- **Existing Functionality**: All current overlay click behavior remains intact
- **CSS Boundaries**: Maintains separation between event panel styles and overlay styles
- **Loading Order**: Preserves critical CSS cascade dependencies
- **Performance**: Minimal impact on existing widget performance

---

## 🚀 **NEXT STEPS FOR IMPLEMENTATION**

### **Immediate Actions Required**
1. **Extract CSS**: Copy overlay styles from prototype into `css/expanded-event-details-overlay.css`
2. **Create Template**: Extract HTML structure into `templates/expanded-event-details-overlay.html`
3. **Implement Manager**: Build `js/expanded-event-details-manager.js` with lifecycle management
4. **Extend Unified Loader**: Modify click handlers in `js/unified-event-loader.js`
5. **Update Bundles**: Include new CSS in both Thursday and Friday/Saturday bundle files

### **Testing Priority Order**
1. **CSS Loading**: Verify overlay styles load without breaking existing styles
2. **Template Integration**: Confirm HTML template renders correctly
3. **Manager Functionality**: Test overlay show/hide behavior
4. **Event Data Flow**: Validate data mapping from widgets to overlay
5. **Cross-Widget Testing**: Test with all three widget types
6. **Cross-Browser Validation**: Ensure compatibility across target browsers

### **Quality Assurance Checklist**
- [ ] No breaking changes to existing widget functionality
- [ ] Overlay displays correctly for both Big and Main panel types
- [ ] Event data populates accurately in overlay content
- [ ] Responsive design works on mobile and desktop
- [ ] Accessibility requirements met (keyboard navigation, screen readers)
- [ ] Performance impact within acceptable limits
- [ ] Console shows no errors or warnings

---

## 🔗 **RELATED DOCUMENTATION**

### **Implementation Dependencies**
- **Prototype Reference**: `JS Embed/html/development/expanded-event-details-overlay-prototype.html`
- **Design Fixes**: `changelogs/2025-08-14_expanded_event_details_overlay_fixes.md`
- **Critical Warnings**: `docs/tasks/CRITICAL_OVERLAY_BUTTON_WARNING.md`
- **Architecture Guide**: `docs/tasks/AI_ASSISTANT_QUICK_REFERENCE_GUIDE.md`

### **Testing Resources**
- **Demo Environment**: `.widget-tests/widget-demo.html`
- **Event Data Sources**: `js/workshop-events.js`, `js/morning-events.js`, `js/afternoon-events.js`
- **CSS References**: `css/unified-event-panel.css` for existing styles

---

**This integration plan preserves all existing functionality while seamlessly adding expanded event details capability. Follow the phases in order, test thoroughly at each step, and maintain architectural boundaries throughout implementation.**