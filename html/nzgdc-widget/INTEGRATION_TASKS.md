# NZGDC Widget System: Integration Tasks & Guide for Friday/Saturday Afternoon Schedule View

## Overview

This document provides **step-by-step, expert-level instructions** for integrating a new "Afternoon" schedule view (for Friday/Saturday event days) into the modular `nzgdc-widget` system. The Afternoon view will closely resemble the existing Morning schedule widget, but with a **blue background** and corresponding color changes for text, buttons, and filters.

**This guide is designed to prevent common integration mistakes and ensure a seamless, maintainable addition to the codebase.**

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
  - Global API: `window.NZGDCafternoonWidget` (and alias `window.NZGDCafternoonSchedule`)

**Data Structure & Event Mapping:**  
If the Afternoon schedule requires a different data structure or new fields, document the changes in README.md and update all relevant JS modules and templates accordingly. Do not force-fit data into the morning structure.

 ---

## 5. Widget Demo Integration

### 5.1. Update Demo Page

- **File:** `widget-demo.html`
- **Add:** A new toggle state for the Afternoon schedule.
- **Controls:** Update the toggle button to cycle through Thursday, Friday/Saturday Morning, and Friday/Saturday Afternoon schedules.

**Demo Toggle Logic:**  
The demo toggle button must cycle in this order: Thursday → Morning → Afternoon → Thursday. The initial state is Thursday. If a widget fails to load, display an error and do not attempt to load the next widget automatically. Always ensure only one widget is visible at a time.
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

## 9. Example: Afternoon Widget CSS Variable Block

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

## 10. Final Checklist

- [ ] All new files use the `.nzgdc-afternoon-` prefix.
- [ ] No CSS or JS is shared between morning and afternoon widgets except for utility variables.
- [ ] The Afternoon widget can be loaded, toggled, and destroyed independently.
- [ ] The demo page toggle cycles through Thursday, Morning, and Afternoon widgets.
- [ ] All color, layout, and accessibility requirements are met.
- [ ] Documentation is updated and clear.

---

**If you follow this guide, the Afternoon schedule view will be integrated cleanly, modularly, and without breaking or polluting the existing widget system.**

*For questions or further architectural guidance, consult the main README or contact the lead engineer.*