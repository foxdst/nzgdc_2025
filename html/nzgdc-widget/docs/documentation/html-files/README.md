# NZGDC Widget HTML Files Documentation

This directory contains comprehensive documentation for all HTML files within the NZGDC widget system. These files serve as templates, testing environments, and demonstration interfaces for the three schedule widgets (Thursday, Morning, and Afternoon).

## File Overview

### Templates
- **[unified-event-panel-template.md](unified-event-panel-template.md)** - Core HTML template for all event panels

### Widget Testing Files
- **[cross-widget-height-consistency-test.md](cross-widget-height-consistency-test.md)** - Height standardization and visual consistency testing
- **[dropdown-filter-test.md](dropdown-filter-test.md)** - Event categories dropdown filter testing for Morning/Afternoon widgets
- **[event-categories-test-demo.md](event-categories-test-demo.md)** - Comprehensive Event Categories system validation
- **[thursday-dropdown-filter-test.md](thursday-dropdown-filter-test.md)** - Thursday widget dropdown filter integration testing
- **[widget-demo.md](widget-demo.md)** - Main demonstration and testing environment for all three widgets

## File Categories

### 🎯 Core Template System
The unified event panel template serves as the foundation for all widget implementations, ensuring consistent structure and styling across the entire system.

**Key File:**
- `unified-event-panel-template.md` - Documents the centralized HTML template used by all widgets

### 🧪 Specialized Testing Environments
Each testing file targets specific functionality areas with comprehensive validation suites.

**Testing Files:**
- **Height Consistency Testing** - Validates 60px standardization across all widgets
- **Dropdown Filter Testing** - Tests category filtering functionality for individual widget types
- **Event Categories Testing** - Validates the complete 11-category system implementation
- **Cross-Widget Integration** - Tests unified system compatibility and performance

### 🎮 Main Demo Interface
The primary demonstration environment provides a unified interface for testing and comparing all widget implementations.

**Demo File:**
- `widget-demo.md` - Central hub for widget development, testing, and demonstration

## Documentation Structure

Each documentation file follows a consistent structure:

### Standard Sections
1. **Overview** - Purpose and scope of the HTML file
2. **File Location** - Exact path within the project
3. **Purpose** - Detailed functionality description
4. **HTML Structure** - Complete markup analysis
5. **JavaScript Framework** - Core functionality and testing logic
6. **Integration Points** - Dependencies and API connections
7. **Usage in Development Workflow** - Practical applications

### Technical Details Covered
- **HTML Element Structure** - Detailed markup analysis
- **CSS Class Systems** - Styling dependencies and theming
- **JavaScript Functions** - Core functionality and testing methods
- **Data Integration** - Event data sources and population logic
- **Widget APIs** - Integration with widget systems
- **Testing Protocols** - Validation criteria and success metrics

## File Relationships

### Template Dependencies
```
unified-event-panel-template.html
├── Used by: Thursday Widget
├── Used by: Morning Widget  
├── Used by: Afternoon Widget
└── Tested by: All testing environments
```

### Testing Environment Hierarchy
```
widget-demo.html (Main Demo)
├── Cross-widget testing
├── Integration validation
└── Performance monitoring
    ├── cross-widget-height-consistency-test.html
    ├── dropdown-filter-test.html
    ├── event-categories-test-demo.html
    └── thursday-dropdown-filter-test.html
```

## Key Integration Points

### Widget APIs
- **NZGDCWidget** - Thursday schedule implementation
- **NZGDCMorningWidget** - Morning schedule implementation
- **NZGDCAfternoonWidget** - Afternoon schedule implementation

### Data Sources
- **WORKSHOP_EVENTS** - Thursday workshop data
- **MORNING_EVENTS** - Morning event data
- **AFTERNOON_EVENTS** - Afternoon event data
- **Schedule structure data** - Time slot and layout definitions

### CSS Dependencies
- **unified-event-panel.css** - Core component styles
- **Widget-specific bundles** - Layout and theming
- **category-filter-overlay.css** - Dropdown and category styling

## Testing Methodologies

### Validation Approaches
1. **Visual Consistency Testing** - Layout, spacing, and color validation
2. **Functional Testing** - User interaction and behavior validation
3. **Performance Testing** - Load times and resource usage monitoring
4. **Integration Testing** - Cross-widget compatibility verification
5. **Accessibility Testing** - Keyboard navigation and screen reader support

### Test Coverage Areas
- **Event Panel Rendering** - Template population and styling
- **Category Filter System** - Dropdown functionality and filtering logic
- **Height Standardization** - 60px compliance across all components
- **Responsive Design** - Mobile and desktop compatibility
- **Error Handling** - Graceful degradation and fallback mechanisms

## Development Workflow Usage

### For Developers
- **Template Modification** - Understanding structure for safe changes
- **Testing New Features** - Comprehensive validation environments
- **Debugging Issues** - Detailed debug information and logging
- **Performance Optimization** - Monitoring and measurement tools

### For QA Testing
- **Feature Validation** - Complete testing protocols and success criteria
- **Regression Testing** - Ensuring changes don't break existing functionality
- **Cross-browser Testing** - Compatibility validation across platforms
- **Accessibility Compliance** - Keyboard and screen reader testing

### For Stakeholders
- **Feature Demonstrations** - Visual showcases of widget functionality
- **Progress Tracking** - Clear status indicators and success metrics
- **Integration Validation** - Proof of system compatibility and performance

## Best Practices

### When Using Testing Files
1. **Start with widget-demo.html** for general functionality testing
2. **Use specialized tests** for specific feature validation
3. **Enable debug mode** for detailed logging and analysis
4. **Test on multiple browsers** and device types
5. **Validate all success criteria** before considering features complete

### When Modifying Templates
1. **Review unified-event-panel-template.md** first to understand structure
2. **Test changes** across all widget implementations
3. **Validate height consistency** using cross-widget testing
4. **Ensure accessibility compliance** through keyboard testing
5. **Document any breaking changes** for downstream dependencies

## File Status and Maintenance

All documentation files are actively maintained and updated to reflect the current state of the NZGDC widget system. Each file includes detailed integration information showing how HTML files connect to the broader JavaScript widget ecosystem.

### Last Updated
Documentation reflects the current state of the widget system with comprehensive coverage of:
- Event Categories system (11 categories)
- Unified Event Panel template system
- Cross-widget height consistency (60px standardization)
- Dropdown filter integration
- Performance monitoring and debugging capabilities

For the most current information about any specific HTML file, refer to its individual documentation file in this directory.