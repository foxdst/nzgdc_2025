# NZGDC Widget System: Integration Tasks & Guide for Friday/Saturday Afternoon Schedule View

## Overview

This document provides **step-by-step, expert-level instructions** for integrating a new "Afternoon" schedule view (for Friday/Saturday event days) into the modular `nzgdc-widget` system. The Afternoon view will closely resemble the existing Morning schedule widget, but with a **blue background** and corresponding color changes for text, buttons, and filters.

**This guide is designed to prevent common integration mistakes and ensure a seamless, maintainable addition to the codebase.**

**IMPORTANT:** This document specifically covers integrating the Friday/Saturday Afternoon Schedule widget. All references to "Afternoon" refer to this specific widget, not a general afternoon time period.

---

## 1. Folder & File Structure

**All new Afternoon schedule files must be placed in parallel to the existing Morning widget files.**

```
nzgdc-widget/
├── css/
│   ├── widget-bundle.css
│   ├── morning-schedule-bundle.css
│   └── afternoon-schedule-bundle.css      # ← NEW: Afternoon widget CSS
├── js/
│   ├── schedule-data.js
│   ├── workshop-events.js
│   ├── workshop-loader.js
│   ├── schedule-generator.js
│   ├── widget-core.js
│   ├── morning-schedule-data.js
│   ├── morning-events.js
│   ├── morning-event-loader.js
│   ├── morning-schedule-generator.js
│   ├── morning-widget-core.js
│   ├── afternoon-schedule-data.js         # ← NEW: Afternoon schedule config
│   ├── afternoon-events.js                # ← NEW: Afternoon event details
│   ├── afternoon-event-loader.js          # ← NEW: Afternoon template loader
│   ├── afternoon-schedule-generator.js    # ← NEW: Afternoon DOM generator
│   └── afternoon-widget-core.js           # ← NEW: Afternoon widget controller
├── templates/
│   ├── event-panel.html
│   ├── morning-event-panel.html
│   └── afternoon-event-panel.html         # ← NEW: Afternoon event template
├── nzgdc-schedule-widget-modular.js
├── nzgdc-morning-schedule-widget-modular.js
├── nzgdc-afternoon-schedule-widget-modular.js # ← NEW: Afternoon widget entry point
├── widget-demo.html
└── README.md
```

---

## 2. CSS Integration

### 2.1. Create a New CSS Bundle

- **File:** `css/afternoon-schedule-bundle.css`
- **Base:** Copy from `morning-schedule-bundle.css`
- **Key Changes:**
  - Change all main backgrounds to use `--color-blue` (e.g., `.nzgdc-afternoon-schedule-widget { background-color: var(--color-blue); }`)
  - Update text colors for contrast (e.g., white or yellow text on blue)
  - Update button backgrounds and hover states to use blue/yellow as appropriate
  - Update filter backgrounds to match the new color scheme
  - Use a new root class: `.nzgdc-afternoon-schedule-widget` for all scoping

**Tip:** Use CSS variables for all colors. Add new variables if needed (e.g., `--color-blue-bright`, `--color-blue-hover`).

**CSS Variable Naming:**  
All new CSS variables must use the `--color-` or `--font-` prefix and be documented in the CSS file header and in the README.md color variable summary section. Do not use ambiguous or widget-specific names for shared variables.

### 2.2. CSS Scoping

- **All Afternoon widget CSS must be scoped to `.nzgdc-afternoon-schedule-widget`**
- **Do NOT reuse `.nzgdc-morning-schedule-widget` or `.nzgdc-schedule-widget` classes**

---

**Utility Class Prefixes:**  
If a utility class or variable is needed across widgets, prefix it with `.nzgdc-util-` and document its usage in README.md. Otherwise, all classes must be widget-specific and use the `.nzgdc-afternoon-*` prefix.

## 3. HTML Template

### 3.1. Create a New Template

- **File:** `templates/afternoon-event-panel.html`
- **Base:** Copy from `morning-event-panel.html`
- **Adjust:** Ensure all class names use the `nzgdc-afternoon-` prefix where appropriate.
- **Colors:** Remove any inline styles; rely on CSS classes and variables.

**Break Block & Special Section Handling:**  
For any new non-event section (e.g., lunch, announcements), consult the reference design for unique styling. Do not assume all such sections use the break block style. Document any new section types and their styling in README.md.

---

## 4. JavaScript Integration

### 4.1. Data Files

- **Create:** `js/afternoon-schedule-data.js` and `js/afternoon-events.js`
- **Structure:** Mirror the structure of the morning equivalents.
- **Naming:** Use `AFTERNOON_SCHEDULE_DATA` and `AFTERNOON_EVENTS` as global variables.

**Global Namespace Rule:**  
All global variables and APIs for the Afternoon widget must use the `AFTERNOON_` prefix (e.g., `window.AFTERNOON_SCHEDULE_DATA`). Do not use generic or duplicate names. Avoid polluting the global namespace.

### 4.2. Loader & Generator Classes

- **Create:** 
  - `js/afternoon-event-loader.js`
  - `js/afternoon-schedule-generator.js`
  - `js/afternoon-widget-core.js`
- **Base:** Copy from morning widget JS files.
- **Class Names:** Use `AfternoonEventLoader`, `AfternoonScheduleGenerator`, `NZGDCAfternoonScheduleWidget`.
- **Scoping:** All DOM queries and class names must use `.nzgdc-afternoon-` prefixes.

 - **Template Loading:** Load `afternoon-event-panel.html` as the template.

### 4.3. Modular Entry Point

- **Create:** `nzgdc-afternoon-schedule-widget-modular.js`
- **Base:** Copy from `nzgdc-morning-schedule-widget-modular.js`
- **Update:** 
  - All references to "morning" → "afternoon"
  - CSS, JS, and template paths
  - Global API: `window.NZGDCAfternoonWidget` (and alias `window.NZGDCAfternoonSchedule`)

**Data Structure & Event Mapping:**  
If the Afternoon schedule requires a different data structure or new fields, document the changes in README.md and update all relevant JS modules and templates accordingly. Do not force-fit data into the morning structure.

 ---

## 5. Widget Demo Integration

### 5.1. Update Demo Page

- **File:** `widget-demo.html`
- **Add:** A new toggle state for the Afternoon schedule.
- **Controls:** Update the toggle button to cycle through Thursday, Friday/Saturday Morning, and Friday/Saturday Afternoon schedules.

**Demo Toggle Logic:**  
The demo toggle button must cycle in this order: Thursday → Friday/Saturday Morning → Friday/Saturday Afternoon → Thursday. The initial state is Thursday. If a widget fails to load, display an error and do not attempt to load the next widget automatically. Always ensure only one widget is visible at a time.
- **Containers:** Add a new container:
  ```html
  <div class="widget-section afternoon-section" id="afternoon-container">
      <h2>Friday & Saturday Afternoon Schedule</h2>
      <!-- Widget content will be inserted here -->
  </div>
  ```
- **Status:** Update the background message and status logic to include the Afternoon schedule.

---

**Documentation Updates:**  
Whenever a new widget, variable, or feature is added, update both `INTEGRATION_TASKS.md` and `README.md` with: file structure, API, configuration options, color variables, and any new data fields. Be explicit and thorough in documenting changes.

## 6. Best Practices, Warnings & Common Mistakes to Avoid

### 6.1. **Common Mistakes from Morning Schedule Widget Integration**

The following issues were encountered or narrowly avoided during the Morning Schedule Widget integration. **Avoid these mistakes when integrating the Afternoon view:**

---

#### **Critical Implementation Errors**

- **Incorrect event ordering and grouping:**  
  The original integration did not match the event order and grouping from the reference design, resulting in a layout that did not reflect the intended schedule.  
  **Always ensure the event data structure and rendering logic produce the exact same order and grouping as the original schedule view.**  
  *Poor thinking process:* Assuming that simply rendering all events in a flat list or using a generic loop would match the design, rather than analyzing the grouping and order in the reference file.

- **Panel dimension mismatches:**  
  Main event panels were sometimes not square (300x300px) or had incorrect thumbnail heights.  
  **Double-check all panel dimensions and thumbnail heights against the reference design. Do not assume the morning and afternoon layouts are identical.**  
  *Poor thinking process:* Copy-pasting panel markup or CSS from another widget without verifying the actual pixel dimensions and aspect ratios required by the design.

- **Break block styling mismatches:**  
  Break blocks must have the correct background and text color as in the reference.  
  **Always verify break block styling matches the original schedule view.**  
  *Poor thinking process:* Overlooking break sections as "just another div" and not checking their unique styling requirements.

---

- **Mixing or reusing CSS classes between widgets:**  
  The initial integration reused or overlapped class names, causing style conflicts.  
  **Always use unique `.nzgdc-afternoon-*` class prefixes and never reuse `.nzgdc-morning-*` or `.nzgdc-schedule-*` classes.**

- **Incorrect color assignments:**  
  There were inconsistencies in yellow shades and background colors, especially for time categories and buttons.  
  **Double-check all color variables and ensure backgrounds, buttons, and text use the correct blue/yellow/white as per design.**

- **Not updating all states for new color schemes:**  
  Some hover/focus/active states were missed or left with old colors.  
  **Update all button and filter states to match the new blue theme.**

- **Hardcoding colors instead of using variables:**  
  Some colors were hardcoded, making future changes difficult.  
  **Always use CSS variables for all colors.**

- **Forgetting to scope new CSS:**  
  Some styles leaked out of the widget due to missing scoping.  
  **Ensure all CSS is properly scoped to `.nzgdc-afternoon-schedule-widget`.**

- **Not updating template or JS class names:**  
  Some template and JS code used the wrong class or variable names, causing rendering bugs.  
  **Audit all template and JS code for correct `.nzgdc-afternoon-*` usage.**

- **Not cleaning up/destroying widgets properly:**  
  Old widgets sometimes remained in the DOM, causing double-rendering or event leaks.  
  **Always destroy/hide the previous widget before showing a new one.**

- **Not updating the demo toggle logic:**  
  The toggle button logic and labels were initially confusing or mismatched.  
  **Ensure the demo toggle button and state logic are clear and cycle through all three widgets correctly.**

- **Not updating documentation:**  
  Documentation was sometimes left outdated after changes.  
  **Update README and this integration guide with every new widget or architectural change.**

---

### 6.2. **Do NOT:**
- Do **not** mix CSS classes or variables between morning and afternoon widgets.
- Do **not** use the same root class for both widgets.
- Do **not** hardcode colors; always use CSS variables.
- Do **not** modify or break the Thursday or Morning widget code.

### 6.3. **DO:**
- Use **unique class prefixes**: `.nzgdc-afternoon-*`
- Use **separate CSS bundles** for each widget.
- Use **separate JS modules** and **global variables** for each widget.
- **Test** each widget independently and together in the demo page.
- **Document** any new variables or architectural changes in `README.md`.

---

## 7. Testing & Debugging

- Use the demo page to test all three widgets independently and in combination.
- Enable debug mode (`?debug=true` or `window.NZGDC_DEBUG = true`) to trace loading and rendering.
- Check for CSS conflicts by inspecting the DOM and computed styles.
- Verify that only one widget is visible at a time when toggling.
- Ensure all color and contrast requirements are met for accessibility.

---

## 8. Documentation

- **Update `README.md`** to include the Afternoon widget in all architecture, API, and integration sections.
- **Document** any new configuration options or data structures.
- **Add** a summary of color variables and their intended usage.

---

## 9. AI Integration Risks & General System-Level Concerns

**Before integrating a new schedule view (manually or via AI), you MUST review Section 6 ("Best Practices, Warnings & Common Mistakes to Avoid") for widget-specific guidance, naming conventions, and actionable lessons learned from previous integrations.**

The following are additional general or system-level risks and concerns for AI assistants or automated tools:

### 11.1. Polyfills & Browser Compatibility

- **Risk:** The widget system uses modern JS features (`Promise`, `fetch`, `AbortController`, `class`, `async/await`). On legacy browsers (IE11 or below), the widget will not work without polyfills.
- **Mitigation:** If legacy support is required, add appropriate polyfills and document their necessity.

### 11.2. Shadow DOM (Not Used)

- **Note:** The widgets do not use Shadow DOM. All styles are scoped via class selectors. Host page CSS with `!important` or overly broad selectors could still override widget styles.
- **Mitigation:** Use highly specific selectors and avoid relying on global styles.

### 11.3. Hardcoded Paths

- **Risk:** Hardcoding resource paths (CSS, JS, templates) can break the widget if the folder structure changes or if the widget is embedded from a different location.
- **Avoid:** Use the `WIDGET_BASE_PATH` variable for all resource loading, and document any required changes if the folder is moved.
- **Mitigation:** Test the widget in its intended deployment location.

### 11.4. Template Fallbacks

- **Risk:** If both the external template and the fallback template are missing or corrupted, the widget will fail to render events.
- **Avoid:** Always provide a valid fallback template string and test template loading under failure conditions.

### 11.5. Widget Coexistence & Independence

- **Risk:** If new widgets share state, variables, or CSS with existing widgets, conflicts will occur.
- **Avoid:** Ensure all new widgets are fully independent, with no shared state unless explicitly intended and documented.
- **Reference:** See Section 6 for widget-specific scoping, naming, and independence requirements.

### 11.6. Documentation Drift

- **Risk:** Failing to update documentation (`README.md`, `INTEGRATION_TASKS.md`) when adding new widgets, variables, or features leads to confusion and future integration errors.
- **Mitigation:** Document every new file, variable, API, and architectural change as you integrate. See Section 6 and Section 8 for documentation requirements.

---

**Summary for AI Integrators:**

- Review Section 6 for widget-specific best practices, naming, scoping, and lessons learned.
- For all new integrations, ensure:
  - Modern JS compatibility or polyfills as needed.
  - No reliance on Shadow DOM for style isolation.
  - All resource paths are configurable and tested.
  - Template fallbacks are robust.
  - Widgets remain fully independent.
  - Documentation is always updated and clear.
- Avoid assumptions—read all integration guides and code comments before making changes.

---


## 10. Example: Afternoon Widget CSS Variable Block

```css
.nzgdc-afternoon-schedule-widget {
    --color-blue: rgba(23, 75, 235, 1);
    --color-blue-bright: rgba(20, 65, 200, 1);
    --color-yellow: rgba(255, 236, 81, 1);
    --color-white: rgba(255, 255, 255, 1);
    --color-black: rgba(0, 0, 0, 1);
    --font-primary: 'Futura PT Heavy', 'Futura', Arial, sans-serif;
    --container-max-width: 1630px;
    --event-panel-width: 620px;
    --event-panel-height: 300px;
    --navigation-height: 70px;
}
```

---

## 11. Final Checklist

- [ ] All new files use the `.nzgdc-afternoon-` prefix.
- [ ] No CSS or JS is shared between morning and afternoon widgets except for utility variables.
- [ ] The Afternoon widget can be loaded, toggled, and destroyed independently.
- [ ] The demo page toggle cycles through Thursday, Morning, and Afternoon widgets.
- [ ] All color, layout, and accessibility requirements are met.
- [ ] Documentation is updated and clear.

---

## 12. Afternoon Event Data Schema Requirements

**CRITICAL:** This section applies specifically to the Friday/Saturday Afternoon Schedule widget integration.

**All afternoon event objects must strictly follow this data structure for proper rendering:**

### 12.1. Event Data Structure Reference
**For the exact data structure and field requirements, reference these existing files:**

- **Primary Reference:** `js/morning-events.js` - Contains complete event data structure with all required and optional fields
- **Secondary Reference:** `js/workshop-events.js` - Shows alternative event structure for comparison
- **Key Requirements:** All afternoon events must follow the same data schema as morning events but with `AFTERNOON_EVENTS` global variable name

### 12.2. Required Field Analysis
**Study `js/morning-events.js` for:**
- Event object structure (category, title, timeframe, speakers array)
- Speaker object format (name, position fields)
- Optional thumbnail field usage
- Consistent data formatting patterns

### 12.3. Data Validation Rules
- **Event IDs:** Must use format `panel-[timeSlot][number]` (e.g., `panel-a1`, `panel-b2`)
- **Categories:** Must match existing categories or define new ones consistently
- **Speakers:** Maximum 3 speakers per event (template supports up to 3)
- **Titles:** Keep under 60 characters for proper display in panels
- **Timeframes:** Use consistent format (e.g., "30 minutes", "50 minutes", "1 hour")

---

## 13. Afternoon Template Structure Requirements

**The afternoon template must follow this exact DOM structure with `.nzgdc-afternoon-` prefixes:**

### 13.1. Template Structure Reference
**For the exact DOM structure and class naming patterns, reference these existing template files:**

- **Primary Reference:** `templates/morning-event-panel.html` - Complete template structure with proper class hierarchy
- **Secondary Reference:** `templates/event-panel.html` - Alternative template structure for comparison
- **Key Requirement:** Copy the morning template structure exactly, but replace all `nzgdc-morning-` prefixes with `nzgdc-afternoon-` prefixes

### 13.2. Template Conversion Process
1. Copy `templates/morning-event-panel.html` to `templates/afternoon-event-panel.html`
2. Replace all instances of `nzgdc-morning-` with `nzgdc-afternoon-`
3. Update the introduction text from "Morning Event" to "Afternoon Event"
4. Ensure all element IDs and class names follow the afternoon naming convention

### 13.3. Critical Template Requirements
- **All class names** must use `nzgdc-afternoon-` prefix
- **Element structure** must match exactly for data population to work
- **Speaker containers** must be repeated 3 times (unused ones will be hidden)
- **No inline styles** - all styling through CSS classes

### 13.4. Main Panel Template (300x300)
For afternoon main panels, create a separate structure following the pattern in `morning-event-loader.js` `createMainEventPanel()` method, but with `nzgdc-afternoon-` prefixes.

---

## 14. Afternoon Widget Lifecycle Management

**Understanding the initialization sequence is critical for proper afternoon widget integration:**

### 14.1. Module Loading Reference
**For the exact loading sequence and dependency management, reference:**

- **Primary Reference:** `nzgdc-morning-schedule-widget-modular.js` - Shows complete module loading order in the `loadWidget()` method
- **Key Pattern:** CSS first, then data files in parallel, then JS classes in parallel, then template last

### 14.2. Widget Initialization Reference
**For initialization dependencies and validation, reference:**

- **Primary Reference:** `js/morning-widget-core.js` - See `validateDependencies()` method for required global variables
- **Pattern:** All afternoon files must follow the same dependency pattern but with `AFTERNOON_` prefixes

### 14.3. Widget Destruction Reference
**For proper cleanup and resource management, reference:**

- **Primary Reference:** `js/morning-widget-core.js` - See `destroy()` method for complete cleanup sequence
- **Secondary Reference:** `js/morning-schedule-generator.js` - See `destroy()` method for component cleanup patterns
- **Critical:** Follow the exact same cleanup order to prevent memory leaks

---

## 15. Afternoon Error Handling Standards

**Consistent error handling is essential for debugging and maintenance:**

### 15.1. Template Loading Error Patterns
**For template loading with fallback strategies, reference:**

- **Primary Reference:** `nzgdc-morning-schedule-widget-modular.js` - See `loadTemplate()` method for complete error handling pattern
- **Key Pattern:** Try external fetch with timeout, fall back to embedded template string

### 15.2. Event Data Validation Patterns
**For data validation and error recovery, reference:**

- **Primary Reference:** `js/morning-schedule-generator.js` - See `loadSingleEvent()` method for data validation patterns
- **Secondary Reference:** `js/morning-event-loader.js` - See data availability checks and error panel creation

### 15.3. DOM Element Validation Patterns
**For template element validation, reference:**

- **Primary Reference:** `js/morning-event-loader.js` - See `updateEventContent()` method for element query validation
- **Pattern:** Always validate critical elements exist before attempting to populate them

### 15.4. Resource Cleanup Patterns
**For proper error cleanup and resource management, reference:**

- **Primary Reference:** `js/morning-widget-core.js` - See `destroy()` method for comprehensive error-safe cleanup
- **Secondary Reference:** `js/morning-event-loader.js` - See `destroy()` method for component cleanup patterns

---

## 16. Afternoon Configuration API Standards

**The afternoon widget must provide a consistent API matching the existing widget pattern:**

### 16.1. Constructor Options Reference
**For complete constructor options and configuration patterns, reference:**

- **Primary Reference:** `js/morning-widget-core.js` - See constructor and `this.options` object for exact option structure
- **Pattern:** Afternoon widget must support the same options as morning widget

### 16.2. Public Methods Reference
**For required public methods and their implementations, reference:**

- **Primary Reference:** `js/morning-widget-core.js` - See all public methods like `scrollToTimeSlot()`, `scrollToEvent()`, `getEventData()`, etc.
- **Requirement:** Afternoon widget must implement identical public API

### 16.3. Global API Pattern Reference
**For modular loader API structure, reference:**

- **Primary Reference:** `nzgdc-morning-schedule-widget-modular.js` - See `MorningWidgetAPI` object for complete API pattern
- **Pattern:** Replace "Morning" with "Afternoon" in all API names and maintain identical functionality

### 16.4. Auto-initialization Reference
**For data attribute patterns and auto-initialization, reference:**

- **Primary Reference:** `widget-demo.html` - See data attribute usage examples for morning widget
- **Pattern:** Use `data-nzgdc-afternoon-schedule` instead of `data-nzgdc-morning-schedule`

### 16.5. Custom Events Reference
**For event dispatching patterns, reference:**

- **Primary Reference:** `js/morning-widget-core.js` - See `addEventHandlers()` method for custom event dispatching examples
- **Pattern:** Replace "morning" with "afternoon" in all custom event names

---

## 17. Integration Execution Order

**CRITICAL:** Follow this exact sequence to avoid dependency errors:

### Phase 1: Foundation Files
1. Create `css/afternoon-schedule-bundle.css` (copy from morning bundle)
2. Create `templates/afternoon-event-panel.html` (copy from morning template)

### Phase 2: Data Layer
3. Create `js/afternoon-schedule-data.js` (copy from morning schedule data)
4. Create `js/afternoon-events.js` (copy from morning events)

### Phase 3: Logic Layer
5. Create `js/afternoon-event-loader.js` (copy from morning event loader)
6. Create `js/afternoon-schedule-generator.js` (copy from morning schedule generator)
7. Create `js/afternoon-widget-core.js` (copy from morning widget core)

### Phase 4: Entry Point
8. Create `nzgdc-afternoon-schedule-widget-modular.js` (copy from morning modular)

### Phase 5: Demo Integration
9. Update `widget-demo.html` to include afternoon widget container and toggle logic

### Phase 6: Testing & Documentation
10. Test all three widgets independently and together
11. Update `README.md` with afternoon widget documentation

**DO NOT** skip phases or change the order - dependencies must be satisfied in sequence.

---

**If you follow this guide, the Afternoon schedule view will be integrated cleanly, modularly, and without breaking or polluting the existing widget system.**

*For questions or further architectural guidance, consult the main README or contact the lead engineer.*