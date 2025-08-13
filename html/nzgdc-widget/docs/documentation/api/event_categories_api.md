# NZGDC Event Categories API Documentation

## Overview

The NZGDC Event Categories system provides a centralized way to manage and dynamically change event categories across both Main (300x300) and Big (620x300) event panels. This system ensures consistent styling and easy integration with external APIs.

## Features

- **12 Different Event Categories** with unique colors and styling
- **Dynamic Category Switching** for both panel types
- **API-Friendly Methods** for external integration
- **Cross-Frame Communication** for iframe implementations
- **Automatic Initialization** with sensible defaults
- **Error Handling** and validation

## Available Categories

| Category Key | Display Name | Color | Text Color |
|--------------|--------------|-------|------------|
| `STORY_NARRATIVE` | Story & Narrative | #F53E3E | #FFFFFF |
| `BUSINESS_MARKETING` | Business & Marketing | #FF8C42 | #FFFFFF |
| `CODING_DEVELOPMENT` | Coding & Development | #FFD93D | #000000 |
| `PRODUCTION_QA` | Production & QA | #6BCF7F | #000000 |
| `DATA_TESTING_RESEARCH` | Data, Testing, Research | #4ECDC4 | #000000 |
| `GAME_DESIGN_CREATIVE_ARTS` | Game Design & Creative Arts | #4D79A4 | #FFFFFF |
| `REALITIES_VR_AR_MR_XR` | Realities (VR, AR, MR, XR) | #9B59B6 | #FFFFFF |
| `SERIOUS_EDUCATIONAL` | Serious & Educational | #8E44AD | #FFFFFF |
| `SOUND_MUSIC` | Sound & Music | #E91E63 | #FFFFFF |
| `CULTURE` | Culture | #8D6E63 | #FFFFFF |
| `CODING_DEVELOPMENT_ALT` | Coding & Development | #000000 | #FFFFFF |
| `GAME_DESIGN_CREATIVE_ARTS_ALT` | Game Design & Creative Arts | #000000 | #FFFFFF |

## Installation

### 1. Include the Script

Add the event categories script to your HTML files:

```html
<script src="../../eventCategories.js"></script>
```

### 2. Basic Usage

The system auto-initializes with the default "Story & Narrative" category. You can immediately start using it:

```javascript
// Change category for both panels
EventCategories.setCategory('CODING_DEVELOPMENT');

// Change category for main panel only
EventCategories.setCategoryMain('BUSINESS_MARKETING');

// Change category for big panel only
EventCategories.setCategoryBig('SOUND_MUSIC');
```

## API Methods

### Core Methods

#### `setCategory(categoryKey)`
Updates both Main and Big event panels with the specified category.

**Parameters:**
- `categoryKey` (string): The category key from the available categories

**Returns:** `boolean` - Success status

**Example:**
```javascript
EventCategories.setCategory('REALITIES_VR_AR_MR_XR');
```

#### `setCategoryMain(categoryKey, panelId?)`
Updates only the Main event panel.

**Parameters:**
- `categoryKey` (string): The category key
- `panelId` (string, optional): Custom panel class name (default: 'nzgdc-event-panel-main')

**Returns:** `boolean` - Success status

#### `setCategoryBig(categoryKey, panelId?)`
Updates only the Big event panel.

**Parameters:**
- `categoryKey` (string): The category key
- `panelId` (string, optional): Custom panel class name (default: 'nzgdc-event-panel-big')

**Returns:** `boolean` - Success status

### Information Methods

#### `getCategory(categoryKey)`
Retrieves information about a specific category.

**Parameters:**
- `categoryKey` (string): The category key

**Returns:** `object|null` - Category object or null if not found

**Example:**
```javascript
const category = EventCategories.getCategory('SOUND_MUSIC');
console.log(category);
// Output: { name: 'Sound & Music', color: '#E91E63', textColor: '#FFFFFF' }
```

#### `getAllCategories()`
Returns all available categories.

**Returns:** `object` - All categories

**Example:**
```javascript
const allCategories = EventCategories.getAllCategories();
Object.keys(allCategories).forEach(key => {
    console.log(`${key}: ${allCategories[key].name}`);
});
```

### API Integration Method

#### `updateFromAPI(config)`
Primary method for external API integration with comprehensive error handling.

**Parameters:**
- `config` (object): Configuration object
  - `category` (string): Category key (required)
  - `panelType` (string): 'main', 'big', or 'both' (default: 'both')
  - `panelId` (string, optional): Custom panel ID

**Returns:** `object` - Result object with success status and details

**Example:**
```javascript
const result = EventCategories.updateFromAPI({
    category: 'GAME_DESIGN_CREATIVE_ARTS',
    panelType: 'both'
});

console.log(result);
// Success: { success: true, category: {...}, panelType: 'both' }
// Error: { success: false, error: 'Invalid category: INVALID_KEY' }
```

## Integration Examples

### 1. Direct JavaScript Integration

```javascript
// Initialize with specific category
EventCategories.init('CODING_DEVELOPMENT');

// Update category dynamically
EventCategories.setCategory('BUSINESS_MARKETING');

// Get current category info
const categoryInfo = EventCategories.getCategory('BUSINESS_MARKETING');
```

### 2. REST API Integration

```javascript
// Example API endpoint handler
app.post('/api/update-event-category', (req, res) => {
    const { category, panelType } = req.body;
    
    const result = EventCategories.updateFromAPI({
        category: category,
        panelType: panelType || 'both'
    });
    
    res.json(result);
});
```

### 3. Real-time Updates (WebSocket)

```javascript
socket.on('categoryUpdate', (data) => {
    EventCategories.updateFromAPI({
        category: data.category,
        panelType: data.panelType || 'both'
    });
});
```

### 4. React Integration

```javascript
import React, { useEffect } from 'react';

const EventPanel = ({ category }) => {
    useEffect(() => {
        if (window.EventCategories) {
            window.EventCategories.setCategory(category);
        }
    }, [category]);

    return <iframe src="/eventPanel_Main.html" />;
};
```

### 5. Vue.js Integration

```javascript
export default {
    props: ['category'],
    watch: {
        category(newCategory) {
            if (window.EventCategories) {
                window.EventCategories.setCategory(newCategory);
            }
        }
    }
}
```

## Iframe Communication

For iframe implementations, the system supports postMessage communication:

```javascript
// Send message to iframe
iframe.contentWindow.postMessage({
    type: 'updateCategory',
    category: 'SOUND_MUSIC',
    panelType: 'main'
}, '*');
```

The event panels automatically listen for these messages and update accordingly.

## Error Handling

The system includes comprehensive error handling:

```javascript
// Check if category exists
const category = EventCategories.getCategory('INVALID_KEY');
if (!category) {
    console.warn('Category not found');
}

// API method with error handling
const result = EventCategories.updateFromAPI({
    category: 'INVALID_CATEGORY'
});

if (!result.success) {
    console.error('Update failed:', result.error);
}
```

## Customization

### Adding New Categories

To add new categories, modify the `categories` object in `eventCategories.js`:

```javascript
'NEW_CATEGORY': {
    name: 'New Category Name',
    color: '#HEXCOLOR',
    textColor: '#FFFFFF'
}
```

### Custom Panel IDs

If you're using custom panel class names, specify them in the method calls:

```javascript
EventCategories.setCategoryMain('CODING_DEVELOPMENT', 'my-custom-panel-class');
```

## Best Practices

1. **Always validate category keys** before updating
2. **Use the API method** (`updateFromAPI`) for external integrations
3. **Handle errors gracefully** using the returned success status
4. **Cache category information** for better performance
5. **Use appropriate panel types** (main/big/both) based on your layout

## Browser Support

- Modern browsers with ES5+ support
- IE11+ (with polyfills for Object methods if needed)
- All mobile browsers

## Performance Notes

- Category updates are DOM operations and should be batched when possible
- The system caches category information for fast lookups
- No external dependencies or network requests required

## Troubleshooting

### Common Issues

1. **Script not loading**: Ensure the script path is correct relative to your HTML file
2. **Category not updating**: Check browser console for error messages
3. **Iframe communication fails**: Verify postMessage origin settings

### Debug Mode

Enable debug logging by setting:
```javascript
window.NZGDC_DEBUG = true;
```

This will provide additional console output for troubleshooting.

## Version History

- **v1.0.0**: Initial release with 12 categories and full API support
- Support for both Main and Big event panels
- Comprehensive error handling and validation
- Cross-frame communication support

## Support

For issues or feature requests, please refer to the project documentation or contact the development team.