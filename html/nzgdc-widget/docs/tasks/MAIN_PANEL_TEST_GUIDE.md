# Main Event Panel Testing Guide - Unified Architecture

## Overview
This guide helps you verify that the Main Event Panel system is working correctly within the current unified architecture for all widget types (Thursday, Morning, Afternoon). This guide reflects the post-consolidation architecture where all event panels use the UnifiedEventLoader system.

## Current Architecture Background
The Main Event Panel designs (300x300 square format) are now handled by the unified architecture:
- **Single Event Loader:** UnifiedEventLoader handles all panel creation
- **Single Template:** unified-event-panel.html used by all widgets
- **Single CSS:** unified-event-panel.css contains all panel styling
- **Widget Context:** Panels differentiated by widget context ("thursday", "morning", "afternoon")

## System Status
- ✅ **Unified Architecture:** All widgets use same event panel system
- ✅ **CSS Consolidation:** All event panel CSS in unified-event-panel.css
- ✅ **Template Consolidation:** Single template for all widgets
- ✅ **Category Integration Ready:** Architecture supports 11 event categories

## Testing Instructions

### 1. Open the Demo Page
Open `widget-demo.html` in your browser.

### 2. Visual Testing (All Widget Types)

#### Test Thursday Widget:
1. Click "Show Thursday Widget" button
2. Wait for the widget to load completely  
3. Look for 620x300 Big event panels (workshop format)
4. Verify panels show:
   - Category header with appropriate color
   - Event title
   - Speaker details overlay
   - Consistent styling

#### Test Morning Widget:
1. Click "Show Morning Widget" button
2. Wait for the widget to load completely
3. Look for both Big (620x300) and Main (300x300) event panels
4. Verify Main panels show:
   - Category header at top (currently red theme)
   - Event title in middle section
   - Dark overlay with speaker details at bottom
   - "Click for More Event Details" call-to-action

#### Test Afternoon Widget:
1. Click "Show Afternoon Widget" button  
2. Wait for the widget to load completely
3. Look for both Big (620x300) and Main (300x300) event panels
4. Verify same panel structure as morning widget but with blue theme

### 3. Console Testing

#### Automatic Unified System Verification:
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Run: `testUnifiedSystem()`
4. Check results - should show:
   ```
   🎉 SUCCESS: Unified Event Loader system working correctly!
   ✅ UnifiedEventLoader available and functional
   ✅ Unified template loaded successfully
   ✅ All widget contexts supported
   ```

#### CSS Integration Verification:
1. Run: `testMainEventPanelCSS()`
2. Check results - should show:
   ```
   🎉 SUCCESS: Main Event Panel CSS working correctly!
   ✅ All widgets have proper main panel styles
   ✅ Unified CSS architecture functioning
   ✅ No CSS conflicts detected
   ```

#### Manual CSS Inspection:
1. Right-click on a main event panel (300x300 square)
2. Select "Inspect Element"
3. Check computed styles for `.nzgdc-event-panel-main`
4. Should show:
   - `width: 300px`
   - `height: 300px` 
   - `display: flex`
   - `flex-direction: column`
5. Verify CSS source is `unified-event-panel.css`
6. Check for `data-category` attribute (if categories implemented)

### 4. Expected Results

#### ✅ Success Indicators:
- All three widget types load without errors
- Big panels (620x300) display correctly for all widgets
- Main panels (300x300) display correctly for Morning and Afternoon widgets
- Panels show proper content structure (category, title, speakers)
- Widget switching works without conflicts
- Console tests return success status
- CSS computed styles show correct dimensions
- All panels use unified-event-panel.css as CSS source

#### ❌ Failure Indicators:
- Empty white/gray boxes where panels should be
- Panels showing only "Loading..." text
- Console errors about UnifiedEventLoader not found
- Console errors about template loading failures
- Console test returns warning/error status
- CSS computed styles reference multiple CSS sources
- Widget switching causes style conflicts

### 5. Common Issues & Solutions

#### Issue: Panels Still Not Displaying
**Solution:** 
1. Clear browser cache and reload page
2. Check that unified-event-panel.css is loading
3. Verify UnifiedEventLoader is available: `typeof UnifiedEventLoader`
4. Check console for JavaScript errors

#### Issue: Console Test Shows UnifiedEventLoader Not Found
**Solution:** Check that unified-event-loader.js loaded correctly:
- Verify network tab shows successful load of `js/unified-event-loader.js`
- Check for JavaScript syntax errors in console
- Ensure all widget entry points load unified-event-loader.js

#### Issue: Mixed Results (One Widget Works, Others Don't)
**Solution:** 
1. Verify all widget entry points load unified-event-panel.css first
2. Check that each widget correctly passes widget context to UnifiedEventLoader
3. Ensure no CSS conflicts between schedule bundles and unified CSS

### 6. Verification Checklist (Unified Architecture)

- [ ] Thursday widget loads without errors
- [ ] Morning widget loads without errors
- [ ] Afternoon widget loads without errors  
- [ ] Big event panels (620x300) display correctly in all widgets
- [ ] Main event panels (300x300) display correctly where used
- [ ] All panels show unified content structure (category, title, speaker details)
- [ ] Console test `testUnifiedSystem()` returns success
- [ ] Console test `testMainEventPanelCSS()` returns success
- [ ] Widget switching works without style conflicts
- [ ] All panels source CSS from unified-event-panel.css
- [ ] No console errors related to missing CSS classes or UnifiedEventLoader
- [ ] Responsive behavior works on mobile screens
- [ ] Category system ready for implementation (data-category attributes present)

### 7. Browser Compatibility Testing

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

### 8. Performance Verification

- [ ] Widget loading time is reasonable (< 3 seconds)
- [ ] No noticeable lag when switching between widgets
- [ ] Memory usage stable (check Developer Tools > Performance)

## Success Criteria

The unified architecture is successful when:
1. **Visual**: All event panels display correctly with proper dimensions
2. **Functional**: Panel content loads and displays properly across all widget types
3. **Technical**: Console tests pass without warnings for unified system
4. **Architectural**: All widgets use UnifiedEventLoader and unified CSS
5. **Cross-browser**: Works consistently across browsers
6. **Responsive**: Adapts properly to different screen sizes
7. **Widget Switching**: No conflicts when switching between widget types
8. **Category Ready**: System ready for Event Categories integration

## Reporting Issues

If testing fails, report the following information:
- Browser name and version
- Console error messages (copy full text)
- Results of `testUnifiedSystem()` function
- Results of `testMainEventPanelCSS()` function
- Which widget types are affected (Thursday/Morning/Afternoon)
- Screenshots of broken panels
- Network tab showing any failed CSS or JS requests
- Whether issue occurs during widget switching

## Current Architecture Files

- ✅ `css/unified-event-panel.css` - ALL event panel styles (single source)
- ✅ `js/unified-event-loader.js` - Single event loader for all widgets
- ✅ `templates/unified-event-panel.html` - Single template for all widgets
- ✅ `css/*-schedule-bundle.css` - Widget-specific layout only (NO event panel CSS)
- ✅ `.tasks/CONSOLIDATION_TASKS.md` - Consolidation history and status
- ✅ `.tasks/CURRENT_ARCHITECTURE_STATUS.md` - Complete architecture reference

## Next Steps After Testing

If all tests pass:
1. ✅ Mark unified architecture as working correctly
2. ✅ System ready for Event Categories integration
3. ✅ Architecture validation complete

If tests fail:
1. ⚠️ Review console error messages for UnifiedEventLoader issues
2. ⚠️ Verify unified CSS and JS file loading in Network tab
3. ⚠️ Check for JavaScript errors in unified-event-loader.js
4. ⚠️ Verify widget entry points correctly load unified components
5. ⚠️ Test widget switching for conflicts
6. ⚠️ Contact development team with complete test results and affected widgets

---

**Note:** This testing guide validates the unified architecture that consolidates all event panel functionality into a single, maintainable system. The architecture provides the foundation for current operations and future enhancements, including Event Categories integration.

**Architecture Status:** ✅ Production Ready - Unified v1.9  
**Category Integration:** ✅ Ready for implementation  
**Next Steps:** Implement Event Categories system using unified architecture