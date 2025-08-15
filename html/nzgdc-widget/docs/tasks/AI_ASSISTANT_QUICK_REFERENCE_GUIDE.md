# AI ASSISTANT QUICK REFERENCE GUIDE
## Essential Documentation & File References for NZGDC Widget Development

---

## 🎯 PURPOSE

This guide provides AI assistants with immediate access to all critical documentation and file paths needed for NZGDC Widget development. **READ THIS FIRST** before starting any development tasks to avoid wasting time searching through directories.

---

## 📚 MANDATORY READING ORDER

### 1. PRIMARY DOCUMENTATION (READ FIRST)
- **[README.md](../../README.md)** - Complete widget system overview, architecture, and usage instructions
- **[AI_ASSISTANT_QUICK_REFERENCE_GUIDE.md](AI_ASSISTANT_QUICK_REFERENCE_GUIDE.md)** - This document (you're reading it now)

### 2. ARCHITECTURAL SAFETY (READ BEFORE ANY CODE CHANGES)
- **[CONSOLIDATION_ARCHITECTURE_SAFETY_GUIDE.md](CONSOLIDATION_ARCHITECTURE_SAFETY_GUIDE.md)** - Critical implementation standards & error prevention
- **[CONSOLIDATION_IMPLEMENTATION_GUIDE.md](CONSOLIDATION_IMPLEMENTATION_GUIDE.md)** - Step-by-step technical implementation with code examples

### 3. CRITICAL WARNINGS (READ BEFORE SPECIFIC FEATURES)
- **[CRITICAL_OVERLAY_BUTTON_WARNING.md](../tasks-drafts/CRITICAL_OVERLAY_BUTTON_WARNING.md)** - ⚠️ OVERLAYS ARE ALREADY CLICKABLE BUTTONS - DO NOT DUPLICATE
- **[SPEAKER_DETAILS_HOVER_OVERLAY_IMPLEMENTATION.md](../tasks-drafts/SPEAKER_DETAILS_HOVER_OVERLAY_IMPLEMENTATION.md)** - Complete hover overlay implementation guide

---

## 🗂️ CORE FILE STRUCTURE

### Widget Entry Points (Bundle Files)
```
nzgdc-schedule-widget-modular.js              # Thursday Schedule Widget
nzgdc-friday-saturday-schedule-widget-modular.js  # Friday/Saturday Unified Widget
```

### Core JavaScript Architecture
```
js/
├── unified-event-loader.js          # ⭐ CRITICAL: All event panel creation & content
├── widget-core.js                   # Thursday schedule widget controller (includes ThursdayCategoryDropdownController)
├── schedule-generator.js            # Thursday DOM generation & event loading
├── friday-saturday-widget-core.js   # Friday/Saturday unified controller (includes filter coordination)
├── morning-schedule-generator.js    # Friday/Saturday morning DOM generation (includes filtering)
└── afternoon-schedule-generator.js  # Friday/Saturday afternoon DOM generation (includes filtering)
```

### CSS Architecture (CRITICAL LOADING ORDER)
```
css/
├── unified-event-panel.css          # ⭐ LOADS FIRST: All event panel styles
├── category-filter-overlay.css      # LOADS SECOND: Filter dropdown styles
├── thursday-schedule-bundle.css     # Thursday widget layout only
├── morning-schedule-bundle.css      # Morning widget layout only
├── afternoon-schedule-bundle.css    # Afternoon widget layout only
└── friday-saturday-schedule-bundle.css  # Unified Friday/Saturday layout
```

### Templates & Testing
```
templates/
├── unified-event-panel.html         # Event panel HTML template
└── category-filter-dropdown.html    # Category filter template

.widget-tests/
└── widget-demo.html                 # ⭐ TESTING: Live demo page for all widgets
```

---

## ⚡ QUICK DECISION TREE

### "I need to modify event panels..."
- **Event Panel Content/Styling** → `css/unified-event-panel.css` & `js/unified-event-loader.js`
- **Event Panel Creation Logic** → `js/unified-event-loader.js` (methods: `createBigEventPanel`, `createMainEventPanel`)
- **Event Panel Templates** → `templates/unified-event-panel.html`

### "I need to modify widget behavior..."
- **Thursday Widget** → `js/widget-core.js` & `js/schedule-generator.js`
- **Friday/Saturday Widget** → `js/friday-saturday-widget-core.js` & morning/afternoon generators
- **Thursday Category Filtering** → `js/widget-core.js` (ThursdayCategoryDropdownController class)
- **Friday/Saturday Category Filtering** → `js/friday-saturday-widget-core.js` + respective schedule generators

### "I need to modify widget layout..."
- **Thursday Layout** → `css/thursday-schedule-bundle.css`
- **Friday/Saturday Unified Layout** → `css/friday-saturday-schedule-bundle.css`
- **Morning/Afternoon Individual Layouts** → respective bundle CSS files

### "I need to test changes..."
- **Live Testing** → `.widget-tests/widget-demo.html`
- **Integration Testing** → Entry point bundle files

---

## 🚨 CRITICAL ARCHITECTURAL RULES

### CSS Architecture Boundaries
```
✅ CORRECT: Event panel styles → unified-event-panel.css
❌ WRONG: Event panel styles → widget bundle CSS files

✅ CORRECT: Widget layout → bundle CSS files  
❌ WRONG: Widget layout → unified-event-panel.css
```

### JavaScript Architecture Patterns
```
✅ CORRECT: Extend existing methods, preserve functionality
❌ WRONG: Replace or duplicate core methods

✅ CORRECT: Use unified-event-loader for all event panel operations
❌ WRONG: Create separate event panel logic
```

### Loading Order Dependencies
```
CRITICAL ORDER:
1. unified-event-panel.css (event styles)
2. category-filter-overlay.css (filter styles)  
3. widget-bundle.css (layout styles)
4. JavaScript modules (any order)
```

---

## 📋 PRE-DEVELOPMENT CHECKLIST

Before starting ANY development task:

### Documentation Review
- [ ] Read main README.md completely
- [ ] Read architectural safety guide for your task type
- [ ] Check for existing functionality warnings (especially overlay button warning)
- [ ] Review implementation guides for similar features

### File Identification
- [ ] Identify which widget type(s) you're modifying (Thursday, Friday/Saturday, or both)
- [ ] Identify correct CSS files based on what you're changing
- [ ] Identify correct JavaScript files based on functionality area
- [ ] Locate relevant template files if modifying HTML structure

### Architecture Validation
- [ ] Confirm you're not violating CSS boundary rules
- [ ] Confirm you're not duplicating existing functionality
- [ ] Confirm you understand the unified event panel system
- [ ] Confirm you understand the loading order requirements

---

## 🔍 DEBUGGING & VALIDATION

### Testing Your Changes
1. **Live Demo Testing**: Use `.widget-tests/widget-demo.html`
2. **Multiple Widget Testing**: Test Thursday, Friday Morning, Friday Afternoon
3. **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
4. **Mobile Testing**: Responsive behavior and touch interactions

### Validation Commands
```javascript
// Check widget status
console.log(window.NZGDC_DEBUG_STATUS);

// Enable debug mode
localStorage.setItem('nzgdc-debug', 'true');

// Check unified event loader
console.log(window.UnifiedEventLoader);
```

### Common Debug Locations
- **Event Panel Issues** → Check unified-event-loader.js console logs
- **Widget Loading Issues** → Check entry point bundle file console logs  
- **Styling Issues** → Check CSS loading order in browser dev tools
- **Thursday Filter Issues** → Check widget-core.js ThursdayCategoryDropdownController debug output
- **Friday/Saturday Filter Issues** → Check friday-saturday-widget-core.js and schedule generator debug output

---

## 🎨 COMMON MODIFICATION PATTERNS

### Adding New Event Panel Features
1. **CSS Changes** → `css/unified-event-panel.css` only
2. **JavaScript Logic** → Extend `js/unified-event-loader.js` methods
3. **Template Updates** → `templates/unified-event-panel.html` if needed
4. **Testing** → Verify in `.widget-tests/widget-demo.html`

### Adding New Widget Features  
1. **Identify Widget Type** → Thursday or Friday/Saturday
2. **Controller Updates** → Respective widget-core.js file
3. **Generator Updates** → Respective schedule-generator.js file
4. **Layout Updates** → Respective bundle CSS file
5. **Testing** → All affected widget types

### Adding New Styling
1. **Event Panels** → `css/unified-event-panel.css` + CSS variables
2. **Widget Layout** → Respective bundle CSS file
3. **Filters** → `css/category-filter-overlay.css`
4. **Testing** → Visual regression testing across widgets

---

## 🚀 DEPLOYMENT PREPARATION

### Pre-Deployment Validation
- [ ] All changes tested in demo environment
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility confirmed
- [ ] Mobile responsiveness verified
- [ ] Performance impact assessed

### Documentation Requirements
- [ ] Update appropriate changelog in `changelogs/` folder
- [ ] Update README.md if adding new features
- [ ] Update architectural guides if changing patterns
- [ ] Create rollback instructions for complex changes

---

## 📞 EMERGENCY PROCEDURES

### If You Break Something
1. **Check browser console** for JavaScript errors
2. **Verify CSS loading order** in Network tab
3. **Test in clean environment** (new browser session)
4. **Check recent changelogs** for similar issues
5. **Use rollback procedures** documented in changelog files

### If Functionality Already Exists
1. **STOP IMMEDIATELY** - Don't duplicate existing features
2. **Read the overlay button warning** if working with event interactions
3. **Search codebase** for existing implementations
4. **Test existing functionality** thoroughly before assuming it doesn't work
5. **Extend existing systems** rather than creating new ones

---

## 🎯 SUCCESS CRITERIA

Your implementation is successful when:
- **Functionality works** across all three widget types
- **No existing functionality is broken** 
- **CSS architecture boundaries are respected**
- **Performance is maintained or improved**
- **Code follows existing architectural patterns**
- **Documentation is updated appropriately**

---

**Remember: This widget system is mature and well-architected. Most functionality you think you need to build probably already exists. Always check first, then extend rather than replace.**