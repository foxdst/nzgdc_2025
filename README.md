# NZGDC Event Schedule Widget System

A comprehensive JavaScript widget system for displaying New Zealand Game Developers Conference (NZGDC) event schedules with interactive features, speaker information, and real-time data integration.

## 🏗️ Project Overview

This project provides a modular, embeddable widget system that displays NZGDC conference schedules with the following key features:

- **Real-time Event Data**: Integration with Entegy API for live schedule updates
- **Interactive Speaker Profiles**: Expandable speaker cards with detailed information
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Multiple Schedule Views**: Support for different days and event types
- **Category Filtering**: Dynamic filtering system for event categories
- **Event Panels**: Detailed event information with expandable descriptions

## 📁 Project Structure

```
JS Embed/
├── application.js                    # Core application logic and API integration
├── html/
│   ├── nzgdc-widget/                # Main widget system
│   │   ├── css/                     # Styling files
│   │   ├── js/                      # Widget JavaScript modules
│   │   ├── templates/               # HTML templates
│   │   ├── docs/                    # Documentation
│   │   ├── changelogs/              # Version history
│   │   ├── .widget-tests/           # Test files
│   │   ├── .deprecated/             # Legacy code
│   │   ├── *.js                     # Widget entry points
│   │   └── README.md                # Detailed widget documentation
│   └── development/                 # Development and testing files
│       ├── *.html                   # Test pages for different schedules
│       ├── eventCategories.js       # Category management
│       └── instructions-to-do/      # Development notes
├── .gitignore                       # Git ignore rules
└── README.md                        # This file
```

## 🚀 Quick Start

### Basic Implementation

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NZGDC Schedule</title>
</head>
<body>
    <!-- Widget container -->
    <div data-nzgdc-schedule></div>
    
    <!-- Load the widget -->
    <script src="path/to/nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
</body>
</html>
```

### Available Widget Types

1. **Thursday Workshop Schedule**: `nzgdc-schedule-widget-modular.js`
2. **Morning Schedule (Fri/Sat)**: `nzgdc-morning-schedule-widget-modular.js`
3. **Afternoon Schedule (Fri/Sat)**: `nzgdc-afternoon-schedule-widget-modular.js`

## ⚙️ Core Features

### API Integration
- **Entegy API**: Real-time event data fetching via webhook
- **Data Caching**: Efficient loading and caching mechanisms
- **Error Handling**: Graceful fallback for API failures

### Speaker Management
- **Speaker Profiles**: Interactive speaker cards with images and bios
- **Expandable Details**: Click-to-expand functionality for detailed information
- **Dynamic Loading**: Speaker data loaded from API

### Schedule System
- **Time-based Display**: Automatic time parsing and display
- **Event Comparison**: Smart date/time comparison for scheduling
- **Multiple Views**: Support for different schedule layouts

### Event Categories
- **Dynamic Filtering**: Category-based event filtering
- **Visual Indicators**: Color-coded event types
- **Interactive Controls**: Dropdown and button-based filtering

## 🔧 Technical Architecture

### Core Classes

#### `Speaker`
Manages individual speaker information and display:
- Speaker profile rendering
- Image handling
- Biography expansion/collapse
- Click event management

#### `ScheduleEvent`
Handles individual event display and interaction:
- Event time management
- Speaker association
- Event type classification
- Expandable event details

#### `ScheduleDay`
Manages daily schedule organization:
- Day-based event grouping
- Date handling
- Event list management

#### `Schedule`
Main schedule controller:
- Overall schedule coordination
- Data loading orchestration
- Widget rendering management

### API System
The `API` object provides:
- RESTful data fetching
- Error handling and logging
- Response parsing and validation

### Utility Functions
- `parseTime()`: Time string parsing
- `compareDate()`: Date comparison utilities
- `setElementsInnerText()`: DOM manipulation helpers
- `setImageDetails()`: Image element management

## 🎨 Styling System

The widget system uses a modular CSS architecture:

- **Unified Event Panels**: Consistent styling across all widget types
- **Widget-specific Styles**: Customized layouts for each schedule type
- **Responsive Design**: Mobile-first approach with breakpoints
- **CSS Variables**: Customizable color schemes and dimensions

## 🔗 Data Flow

1. **Initialization**: Widget loads and identifies container elements
2. **API Request**: Fetch schedule data from Entegy API
3. **Data Processing**: Parse and organize event/speaker information
4. **DOM Generation**: Create HTML elements from templates
5. **Event Binding**: Attach interactive behaviors
6. **Rendering**: Display the complete schedule widget

## 🐛 Development & Testing

### Development Files
- **Test Pages**: Individual HTML files for testing different schedules
- **Category Testing**: Dedicated files for filter functionality
- **Event Panel Testing**: Isolated testing for event details
- **Console Testing**: Debug and logging verification

### Testing Approach
- Component isolation testing
- Cross-browser compatibility
- Mobile responsiveness verification
- API integration testing

## 📱 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile Support**: iOS Safari 12+, Chrome Mobile 60+
- **Fallbacks**: Graceful degradation for older browsers

## 🔧 Configuration Options

The widget system supports various configuration methods:

- **Data Attributes**: HTML-based configuration
- **JavaScript Options**: Programmatic configuration
- **CSS Variables**: Style customization
- **Template Overrides**: Custom HTML templates

## 📦 Deployment

### Production Setup
1. Upload widget files to your server
2. Include the appropriate widget script
3. Add container elements with data attributes
4. Configure API endpoints if needed

### Content Management Integration
The widgets are designed to work with:
- WordPress
- Drupal
- Custom CMS systems
- Static site generators

## 🚀 Performance

- **Lazy Loading**: Components load on-demand
- **Caching**: API responses cached for performance
- **Minification**: Production files are optimized
- **CDN Ready**: Designed for CDN deployment

## 📞 Support & Documentation

- **Detailed Documentation**: See `html/nzgdc-widget/README.md` for comprehensive widget documentation
- **Changelog**: Version history available in `html/nzgdc-widget/changelogs/`
- **API Documentation**: Endpoint specifications and data formats
- **Integration Examples**: Sample implementations and use cases

## 🔄 Version Information

This is an active project with ongoing development. Check the changelog for the latest updates and feature additions.

For detailed implementation guides, API references, and advanced configuration options, please refer to the comprehensive documentation in the `html/nzgdc-widget/` directory.

---

**Project Type**: JavaScript Widget System  
**Target Event**: New Zealand Game Developers Conference  
**License**: [Specify License]  
**Maintainer**: Fox Studios NZ