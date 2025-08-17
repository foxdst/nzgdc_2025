# Day Filtering Fix - NZGDC Schedule Widget

## Issue Summary

The NZGDC Schedule Widget system was incorrectly distributing events across the three widget views (Thursday, Friday/Saturday Morning, Friday/Saturday Afternoon). All events were appearing in the Thursday view while the Friday/Saturday views showed no events.

## Root Cause Analysis

The issue was caused by incorrect date/time handling in the day filtering logic across all three widgets:

### 1. Data Structure Misunderstanding
- **API Data Format**: The API provides:
  - `schedule.date`: YYYY-MM-DD format (e.g., "2025-09-25")
  - `session.startTime`: HH:MM format (e.g., "09:00")
- **Widget Expectation**: The widgets were trying to create `Date` objects from `session.startTime` alone
- **Problem**: `new Date("09:00")` is invalid - you need a full datetime string

### 2. Flawed Fallback Logic
- **Thursday Widget**: Included any event that didn't explicitly mention other days
- **Friday/Saturday Widgets**: Required explicit day mentions in text, which rarely existed
- **Result**: All events defaulted to Thursday view

### 3. Incorrect Date Object Creation
```javascript
// BROKEN - This was the original approach
const dateObj = event.startTime ? new Date(event.startTime) : null;
// event.startTime = "09:00" -> Invalid Date

// FIXED - Combine schedule date with session time
const fullDateTimeString = `${schedule.date}T${event.startTime}:00`;
const dateObj = new Date(fullDateTimeString);
// "2025-09-25T09:00:00" -> Valid Date object
```

## Solution Implementation

### 1. Created Helper Method - `createFullDateTime()`
```javascript
// For Thursday Widget (widget-core.js)
NZGDCScheduleWidget.prototype.createFullDateTime = function(scheduleDate, sessionTime) {
  if (!scheduleDate || !sessionTime) return null;
  try {
    const fullDateTimeString = `${scheduleDate}T${sessionTime}:00`;
    const dateObj = new Date(fullDateTimeString);
    return isNaN(dateObj.getTime()) ? null : dateObj;
  } catch (error) {
    return null;
  }
};

// For Friday/Saturday Widget (friday-saturday-widget-core.js)
createFullDateTime(schedules, event) {
  if (!event.startTime) return null;
  
  // Find the schedule that contains this event
  for (const schedule of schedules) {
    if (schedule.date && schedule.sessions) {
      const eventInSchedule = schedule.sessions.find(session => session.id === event.id);
      if (eventInSchedule) {
        try {
          const fullDateTimeString = `${schedule.date}T${event.startTime}:00`;
          const dateObj = new Date(fullDateTimeString);
          if (!isNaN(dateObj.getTime())) return dateObj;
        } catch (error) {
          // Log and continue
        }
      }
    }
  }
  return null;
}
```

### 2. Updated Day Filtering Logic

#### Thursday Widget (widget-core.js)
```javascript
const thursdayEvents = events.filter((event) => {
  // Create proper date object by combining schedule date with event time
  const fullDateTime = this.createFullDateTime(schedule.date, event.startTime);

  // Primary filter: Use actual date if available
  if (fullDateTime && !isNaN(fullDateTime.getTime())) {
    // 4 = Thursday (0=Sunday, 1=Monday, ..., 6=Saturday)
    return fullDateTime.getDay() === 4;
  }

  // Fallback: Check schedule date directly
  if (schedule.date) {
    const scheduleDate = new Date(schedule.date);
    if (!isNaN(scheduleDate.getTime())) {
      return scheduleDate.getDay() === 4;
    }
  }

  // Last resort fallback
  const eventText = (event.title + " " + (event.copy || "")).toLowerCase();
  return eventText.includes("thursday") && !eventText.includes("friday") && !eventText.includes("saturday");
});
```

#### Friday/Saturday Widgets (friday-saturday-widget-core.js)
```javascript
const morningEvents = events.filter((event) => {
  // Create proper date object
  const fullDateTime = this.createFullDateTime(schedules, event);

  // Primary filter: Use actual date and time
  if (fullDateTime && !isNaN(fullDateTime.getTime())) {
    const dayOfWeek = fullDateTime.getDay(); // 5=Friday, 6=Saturday
    const hour = fullDateTime.getHours();
    const isFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;
    const isMorning = hour >= 9 && hour < 12;
    return isFridayOrSaturday && isMorning;
  }

  // Fallback: Check schedule context
  for (const schedule of schedules) {
    if (schedule.date) {
      const scheduleDate = new Date(schedule.date);
      if (!isNaN(scheduleDate.getTime())) {
        const dayOfWeek = scheduleDate.getDay();
        const isFridayOrSaturday = dayOfWeek === 5 || dayOfWeek === 6;
        
        if (isFridayOrSaturday && schedule.sessions && schedule.sessions.find(s => s.id === event.id)) {
          // Check if time suggests morning
          const hour = parseInt(event.startTime.split(':')[0]);
          return hour >= 9 && hour < 12;
        }
      }
    }
  }

  return false;
});
```

## Files Modified

1. **`js/widget-core.js`**
   - Added `createFullDateTime()` helper method
   - Updated Thursday event filtering logic
   - Fixed date object creation in `createCompatibleScheduleStructure()`

2. **`js/friday-saturday-widget-core.js`**
   - Added `createFullDateTime()` helper method
   - Updated morning and afternoon event filtering logic
   - Fixed date handling in `createCompatibleMorningSchedule()` and `createCompatibleAfternoonSchedule()`

3. **`.widget-tests/widget-demo.html`**
   - Added debugging functions: `testDayFiltering()` and `quickDebug()`
   - Updated existing debug functions to use new date logic
   - Added test buttons to the demo interface

## Testing

### Debug Functions Added
- **`testDayFiltering()`**: Tests the filtering logic with current DataManager data
- **`quickDebug()`**: Shows current widget state and event distribution
- **Updated `verifyData()`**: Enhanced with DataManager event analysis

### Expected Results After Fix
- **Thursday Widget**: Shows only Thursday events (day of week = 4)
- **Friday/Saturday Morning**: Shows only Friday/Saturday events with times 09:00-11:59
- **Friday/Saturday Afternoon**: Shows only Friday/Saturday events with times 12:00-16:59
- **No Overlaps**: Each event should appear in exactly one widget view

## How to Verify the Fix

1. Open the widget demo page
2. Click "Quick Debug" to see current event distribution
3. Click "Test Day Filtering" to verify the filtering logic
4. Toggle between widget views to confirm proper event distribution
5. Check browser console for detailed filtering results

## Future Considerations

- The fix assumes the API will continue providing dates in YYYY-MM-DD format and times in HH:MM format
- If the API structure changes, the `createFullDateTime()` methods may need updates
- Consider adding timezone handling if events span multiple timezones
- Add more robust error handling for malformed date/time data