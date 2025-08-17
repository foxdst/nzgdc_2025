# Category vs Stream Mapping Fix - NZGDC Schedule Widget

## Issue Summary

The NZGDC Schedule Widget system was incorrectly using "audience categories" (like "Student", "Mid Career", "Late Career") for visual categorization instead of "streams" (like "Game Design", "Programming", "Art"). This caused all events to appear with incorrect category styling, often defaulting to "PROGRAMMER" category.

## Root Cause Analysis

### API Data Structure Misunderstanding

The API provides two different types of categorization data:

1. **`session.stream`** - Subject area categorization for visual styling:
   ```json
   "stream": {
     "title": "Game Design",
     "streamColour": "9ee6ab"
   }
   ```

2. **`session.categories`** - Audience level/experience targeting:
   ```json
   "categories": [
     {
       "name": "Mid Career",
       "id": 4
     }
   ]
   ```

### The Problem

The data transformer was incorrectly using `session.categories` (audience level) for the `categoryKey` field that controls visual styling:

```javascript
// BROKEN - This was the original approach
const categories = session.categories || [];
const primaryCategory = categories.length > 0 ? categories[0] : null;
const categoryKey = primaryCategory 
  ? this._mapCategoryNameToKey(primaryCategory.name) 
  : null;

// This meant categoryKey became "MID_CAREER" instead of "GAME_DESIGN"
```

### The Symptom

The unified event loader would receive category keys like:
- `"STUDENT"` 
- `"MID_CAREER"`
- `"LATE_CAREER"`
- `"EARLY_CAREER"`

Since these weren't recognized in the visual category definitions, they would:
1. Generate console warnings: `"Invalid category key: CAREER, falling back to default"`
2. Default to `"PROGRAMMING"` category styling
3. Display incorrect category names on event panels

## Solution Implementation

### 1. Updated Data Transformer

Modified `_standardizeEvent()` method in `js/data-transformer.js`:

```javascript
// FIXED - Use stream for visual categorization
const stream = session.stream || null;
const categoryKey = stream ? this._mapStreamToKey(stream.title) : null;
const categoryName = stream ? stream.title : null;

// Keep original categories for audience targeting
const categories = session.categories || [];

return {
  // ... other fields ...
  categories: categories, // Audience level (Student, Mid Career, etc.)
  audienceCategories: categories, // Explicit audience categorization
  category: categoryName, // Subject area for visual categorization
  categoryKey: categoryKey, // Subject area key for CSS/styling
  stream: session.stream, // Original stream data
  // ... other fields ...
};
```

### 2. Added Stream-to-Key Mapping

Created `_mapStreamToKey()` method to properly map stream titles to category keys:

```javascript
DataTransformer.prototype._mapStreamToKey = function (streamTitle) {
  if (!streamTitle) return "PROGRAMMING";

  const mapping = {
    "Story and Narrative": "STORY_NARRATIVE",
    "Story & Narrative": "STORY_NARRATIVE", 
    "Production & QA": "PRODUCTION_QA",
    "Culture": "CULTURE",
    "Business & Marketing": "BUSINESS_MARKETING",
    "Business": "BUSINESS_MARKETING",
    "Art": "ART",
    "Audio": "AUDIO",
    "Programming": "PROGRAMMING",
    "Data, Testing or Research": "DATA_TESTING_RESEARCH",
    "Realities (VR, AR, MR)": "REALITIES_VR_AR_MR",
    "Realities (AR, MR, VR)": "REALITIES_VR_AR_MR",
    "Game Design": "GAME_DESIGN",
    "Serious & Educational Games": "SERIOUS_EDUCATIONAL",
  };

  return mapping[streamTitle] || "PROGRAMMING";
};
```

### 3. Updated Event Data Structure

Events now properly separate visual and audience categorization:

- **`event.categoryKey`** → Stream-based key for CSS styling (e.g., `"GAME_DESIGN"`)
- **`event.category`** → Stream title for display (e.g., `"Game Design"`)
- **`event.audienceCategories`** → Array of audience levels (e.g., `[{name: "Mid Career"}]`)
- **`event.stream`** → Original stream data with color information

## Expected Results

### Before Fix
```
Event: "ABC Design Workshop"
categoryKey: "MID_CAREER" ❌
category: "Mid Career" ❌
Console: "Invalid category key: CAREER, falling back to default"
Visual: Default "Programming" styling ❌
```

### After Fix  
```
Event: "ABC Design Workshop"
categoryKey: "GAME_DESIGN" ✅
category: "Game Design" ✅
audienceCategories: [{name: "Mid Career"}] ✅
Visual: Correct "Game Design" styling ✅
```

## Testing & Verification

### Debug Functions Added

1. **`testCategoryMapping()`** - Comprehensive analysis of stream vs category usage
2. **Updated `quickDebug()`** - Shows stream distribution and potential issues
3. **Enhanced console logging** - Displays category mapping process

### Test Commands

Run in browser console:
```javascript
testCategoryMapping(); // Full category mapping analysis
quickDebug(); // Quick overview of data distribution
```

### Expected Test Results

- **No "CAREER" category keys** in the output
- **Stream titles properly mapped** to visual category keys
- **Audience categories preserved** in `audienceCategories` field
- **No console warnings** about invalid category keys

## Files Modified

1. **`js/data-transformer.js`**
   - Updated `_standardizeEvent()` method
   - Added `_mapStreamToKey()` method  
   - Deprecated old `_mapCategoryNameToKey()` method

2. **`.widget-tests/widget-demo.html`**
   - Added `testCategoryMapping()` debug function
   - Enhanced `quickDebug()` with stream analysis
   - Added test button to UI

## Backward Compatibility

- **`event.categories`** field preserved for any existing code
- **`event.audienceCategories`** added as explicit audience targeting
- **Old `_mapCategoryNameToKey()`** method deprecated but still functional

## Future Considerations

1. **Stream Colors**: Consider using `stream.streamColour` for dynamic category styling
2. **Audience Filtering**: Implement filtering by audience level if needed
3. **API Changes**: Monitor for changes in stream vs category structure
4. **Performance**: Stream mapping is now O(1) lookup vs previous text matching

## Validation Checklist

- [ ] Events display correct category names from streams
- [ ] Category styling matches stream colors/themes
- [ ] No console warnings about invalid category keys
- [ ] Audience level data preserved for future use
- [ ] All event types (Thursday, Friday AM/PM) working correctly
- [ ] Category dropdown filters work with new stream-based keys