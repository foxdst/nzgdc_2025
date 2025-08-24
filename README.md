# NZGDC Event Schedule Widget System

A production-ready, embeddable JavaScript widget system for displaying New Zealand Game Developers Conference (NZGDC) event schedules with unified event panel architecture and advanced filtering capabilities.

## 🚀 Quick Start

### Thursday Workshop Widget
```html
<div data-nzgdc-schedule></div>
<script src="nzgdc-widget/nzgdc-schedule-widget-modular.js"></script>
```

### Friday/Saturday Events Widget
```html
<div data-nzgdc-friday-saturday-schedule></div>
<script src="nzgdc-widget/nzgdc-friday-saturday-schedule-widget-modular.js"></script>
```

## 🏗️ Key Features

- **Unified Event Panel Architecture**: Consistent 620x300px event panels across all widgets
- **Advanced Category Filtering**: 12 predefined event categories with visual indicators
- **Consolidated Friday/Saturday Widget**: Seamless morning/afternoon view switching
- **Real-time Data Integration**: API connectivity for live schedule updates
- **Production-Grade Architecture**: Comprehensive error handling and debugging
- **Mobile-First Responsive Design**: Optimized for all device sizes

## 📁 Project Structure Overview

```
JS Embed/
├── application.js                                    # Legacy API integration
├── html/nzgdc-widget/                               # 🎯 MAIN WIDGET SYSTEM
│   ├── nzgdc-schedule-widget-modular.js            # Thursday workshops entry point
│   ├── nzgdc-friday-saturday-schedule-widget-modular.js  # Fri/Sat unified entry point
│   ├── css/                                         # Critical CSS files (load order matters)
│   ├── js/                                          # Core JavaScript modules
│   ├── templates/                                   # Event panel HTML template
│   ├── docs/                                        # Technical specifications
│   ├── changelogs/                                  # Complete development history
│   ├── .widget-tests/                              # Testing environment
│   ├── .deprecated/                                 # Legacy files (do not use)
│   └── README.md                                    # 📖 COMPREHENSIVE DOCUMENTATION
└── README.md                                        # This overview file
```

## ⚠️ Critical Information

### 🚨 MANDATORY: Read Detailed Documentation First
**Before developing or integrating, read the comprehensive documentation:**
- **Complete Guide**: [`html/nzgdc-widget/README.md`](html/nzgdc-widget/README.md) - 1,700+ lines of detailed documentation
- **Architecture Details**: CSS loading order, file dependencies, debugging procedures
- **AI/LLM Warnings**: Critical sections for automated development tools

### 🔧 Production Requirements
- **CSS Loading Order**: `unified-event-panel.css` MUST load first
- **File Dependencies**: Complex dependency chain - see detailed docs
- **Container Elements**: Specific data attributes required for auto-initialization
- **Debug Mode**: Available for troubleshooting (`window.NZGDC_DEBUG = true`)

### 🎯 Widget Types
1. **Thursday Workshop Widget** - Workshop schedule with time slots and category filtering
2. **Friday/Saturday Unified Widget** - Consolidated morning/afternoon events with seamless switching
3. **Complete Integration** - All widgets together with toggle controls

## 🔧 Core Architecture

### Unified Event Panel System
- **Template**: `templates/unified-event-panel.html`
- **Styling**: `css/unified-event-panel.css` (critical first load)
- **Generator**: `js/unified-event-loader.js`
- **Features**: Speaker thumbnails, category color coding, expandable details

### Category Filter System
12 predefined categories with visual indicators:
- Story & Narrative, Production & QA, Culture, Business & Marketing
- Art, Audio, Programming, Game Design, Indie Development
- VR/AR, Publishing, Community

### Data Management
- **API Integration**: Real-time schedule updates
- **Event Details**: Speaker information, descriptions, time slots
- **Configuration**: Flexible widget options and customization

## 📦 Integration Examples

### WordPress
```php
wp_enqueue_script('nzgdc-thursday',
    get_template_directory_uri() . '/js/nzgdc-schedule-widget-modular.js');
```

### React/Vue/Angular
```javascript
useEffect(() => {
    const script = document.createElement('script');
    script.src = '/js/nzgdc-schedule-widget-modular.js';
    script.onload = () => window.NZGDCScheduleWidget?.create(containerId);
    document.head.appendChild(script);
    return () => window.NZGDCScheduleWidget?.destroyAll();
}, []);
```

## 🧪 Testing & Development

### Demo Environment
- **Test Page**: `.widget-tests/widget-demo.html` - Comprehensive testing environment
- **Development Files**: `development/*.html` - Individual component testing
- **Debug Tools**: Built-in debugging and system status APIs

### Production Deployment
1. Upload CSS files in exact order (see detailed docs)
2. Upload core JavaScript modules
3. Upload data and event files
4. Upload templates
5. Upload entry points last

## 🔄 Version History

### Current: v1.7 (August 2025) - Production Ready ✅
- **Separation of Concerns Refactoring**: Unified ID + Class pattern architecture
- Enhanced data management architecture
- Comprehensive testing suite
- API integration improvements
- Complete documentation overhaul

⚠️ **CRITICAL: Separation of Concerns (SoC) Principles**
All event panel targeting now follows the unified **ID + Class pattern** as outlined in [`separation-of-concerns-refactoring.md`](html/nzgdc-widget/changelogs/2025-08-24_dynamic_time_categories/separation-of-concerns-refactoring.md). Use **IDs for JavaScript targeting** and **Classes for CSS styling**. This ensures architectural consistency across all widgets and prevents technical debt.

### Previous Major Versions
- **v1.6**: Enhanced data management architecture
- **v1.5**: Data transformation and API modules
- **v1.4**: Speaker data mapping and dynamic organization
- **v1.3**: Friday/Saturday widget consolidation (50% file reduction)

## 📞 Support & Documentation

### 🎯 Essential Resources
1. **[Comprehensive Documentation](html/nzgdc-widget/README.md)** - Complete technical guide
2. **[Change History](html/nzgdc-widget/changelogs/)** - Development and deployment logs
3. **[Testing Demo](html/nzgdc-widget/.widget-tests/widget-demo.html)** - Live testing environment

### Getting Help
1. **Read the detailed README first**: All implementation details, troubleshooting, and examples
2. **Enable debug mode**: Add `?debug=true` to URL and check browser console
3. **Test in demo environment**: Use the comprehensive testing page
4. **Check recent changes**: Review changelog for known issues and fixes

### 🚨 For AI/LLM Developers
**CRITICAL**: The detailed README contains essential warnings about existing functionality. Many features you might think need to be built already exist and are fully functional. Always test existing functionality before attempting to rebuild it.

---

**Production Status**: Deployed and Validated ✅
**Architecture**: Unified Event Panel System with Modular Widget Architecture
**Maintainer**: Fox Studios NZ
**Version**: 1.7.0 (August 2025)
**License**: Apache 2.0

**📖 For complete implementation details, architecture specifications, troubleshooting guides, and production deployment procedures, see: [`html/nzgdc-widget/README.md`](html/nzgdc-widget/README.md)**
