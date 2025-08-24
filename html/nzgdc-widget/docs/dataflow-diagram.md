# NZGDC Widget Data Flow Diagram

```mermaid
flowchart TD
    %% Data Sources
    A1[Webhook URL] --> A[n8n-entegyapi.json<br/>Raw API Data]
    A2[Local File Path] --> A
    
    %% ACTUAL IMPLEMENTATION (Used by Widget)
    subgraph ACTIVE ["🟢 ACTIVE DATA FLOW - ENHANCED v1.6"]
        A --> B[js/data-manager.js<br/>Data Coordinator<br/>✅ ENHANCED: Error handling<br/>✅ ENHANCED: Validation & fallbacks]
        B --> |loadApiData<br/>transformApiData<br/>✅ Enhanced validation| C[js/data-transformer.js<br/>Data Standardization<br/>✅ FIXED: Speaker field prioritization<br/>✅ ENHANCED: displayName → name fallback<br/>✅ ENHANCED: speakerImage → headshot mapping<br/>✅ FIXED: web → website protocol handling]
        
        %% Data Transformation Process
        C --> C1[transformSpeakers<br/>✅ FIXED: Consistent field priority<br/>✅ ENHANCED: Contact field mapping]
        C --> C2[transformEvents<br/>✅ FIXED: Missing endTime handling<br/>✅ ENHANCED: Time validation]
        C --> C3[transformCategories<br/>✅ ENHANCED: Dynamic CSS classes]
        C --> C4[transformRooms/Streams/SessionTypes<br/>✅ ENHANCED: Validation & fallbacks]
        C --> C5[transformSchedules<br/>✅ ENHANCED: Date/time processing]
        
        C1 --> D[Standardized Data Maps<br/>✅ FIXED: Consistent field mapping<br/>✅ ENHANCED: Error handling<br/>✅ ENHANCED: Validation throughout]
        C2 --> D
        C3 --> D
        C4 --> D
        C5 --> D
        
        %% Data Storage & Population
        D --> |populateDataStores<br/>✅ Enhanced validation| B
        
        %% DIRECT DataManager Access (What Actually Happens)
        B --> |DIRECT ACCESS<br/>this.dataManager methods<br/>✅ Performance optimized| F[Widget Orchestration<br/>✅ ENHANCED: View switching<br/>✅ ENHANCED: Filter coordination]
        F --> F1[js/widget-core.js<br/>✅ ENHANCED: Filter system<br/>✅ ENHANCED: Error handling]
        F --> F2[js/friday-saturday-widget-core.js<br/>✅ ENHANCED: Seamless view switching<br/>✅ ENHANCED: Filter state preservation]
        
        %% Static Data Files (Legacy/Fallback)
        STATIC[js/schedule-data.js<br/>js/workshop-events.js<br/>Static JSON Files] -.-> |FALLBACK<br/>✅ Enhanced fallback logic| F
        
        %% Dynamic Time Management (NEW)
        F1 --> |✅ NEW: Dynamic time organization| TM[js/schedule-time-manager.js<br/>✅ NEW: Intelligent time grouping<br/>✅ NEW: Semantic CSS class generation<br/>✅ NEW: API-driven scheduling]
        F2 --> |✅ NEW: Dynamic time organization| TM
        TM --> |✅ Dynamic time blocks<br/>✅ Semantic CSS classes| G[Schedule Generators<br/>✅ ENHANCED: Dynamic layouts<br/>✅ FIXED: Layout consistency]
        
        %% Schedule Generation
        F1 --> |renderSchedule<br/>✅ Enhanced error handling| G
        F2 --> |renderSchedule<br/>✅ Enhanced error handling| G
        G --> G1[js/schedule-generator.js<br/>✅ ENHANCED: Dynamic time blocks<br/>✅ FIXED: Width constraints<br/>✅ ENHANCED: Error handling]
        G --> G2[js/morning-schedule-generator.js<br/>✅ ENHANCED: Dynamic organization<br/>✅ FIXED: Layout gaps & padding<br/>✅ ENHANCED: Filter support]
        G --> G3[js/afternoon-schedule-generator.js<br/>✅ ENHANCED: Dynamic organization<br/>✅ FIXED: Layout consistency<br/>✅ ENHANCED: Filter support]
        
        %% Event Panel Creation
        G1 --> |loadSingleEvent<br/>eventData<br/>✅ Enhanced validation| H[js/unified-event-loader.js<br/>Panel Creation & Rendering<br/>✅ FIXED: Speaker field mapping<br/>✅ ENHANCED: ID + Class separation<br/>✅ ENHANCED: Thumbnail fallback logic<br/>✅ FIXED: displayName prioritization]
        G2 --> |loadSingleEvent<br/>eventData<br/>✅ Enhanced validation| H
        G3 --> |loadSingleEvent<br/>eventData<br/>✅ Enhanced validation| H
        
        %% Panel Content Population
        H --> H1[createEventPanel<br/>✅ ENHANCED: ID + Class pattern<br/>✅ ENHANCED: Thumbnail logic<br/>✅ FIXED: Panel type logic]
        H --> H2[updateEventContent<br/>✅ FIXED: Field prioritization<br/>✅ ENHANCED: Contact integration<br/>✅ FIXED: Layout corrections]
        H --> H3[setupSpeakerDetailsHover<br/>✅ ENHANCED: Accessibility<br/>✅ ENHANCED: Error handling]
        
        %% Modal Display
        H3 --> |showEventDetails<br/>standardized eventData<br/>✅ Enhanced speaker mapping| I[js/expanded-event-details-manager.js<br/>Modal Display Manager<br/>✅ FIXED: Complete speaker mapping<br/>✅ ENHANCED: Contact integration<br/>✅ FIXED: displayName → .nzgdc-expanded-speaker-name<br/>✅ ENHANCED: email → .nzgdc-contact-email (mailto)<br/>✅ ENHANCED: website → .nzgdc-contact-website (protocol)]
    end
    
    %% UNUSED API LAYER (Architecture vs Implementation)
    subgraph UNUSED ["⚠️ ARCHITECTURAL LAYER - NOT LOADED BY WIDGETS"]
        E[API Access Layer<br/>✅ EXISTS: Architectural completeness<br/>❌ UNUSED: Performance optimization]
        E --> E1[js/speaker-api.js<br/>✅ Available but not loaded<br/>Direct DataManager access preferred]
        E --> E2[js/event-api.js<br/>✅ Available but not loaded<br/>Direct DataManager access preferred]
        E --> E3[js/category-api.js<br/>✅ Available but not loaded<br/>Direct DataManager access preferred]
        E --> E4[js/room-api.js<br/>✅ Available but not loaded<br/>Direct DataManager access preferred]
        E --> E5[js/stream-api.js<br/>✅ Available but not loaded<br/>Direct DataManager access preferred]
        E --> E6[js/session-type-api.js<br/>✅ Available but not loaded<br/>Direct DataManager access preferred]
        E --> E7[js/schedule-api.js<br/>✅ Available but not loaded<br/>Direct DataManager access preferred]
    end
    
    %% Show the architectural vs implementation reality
    B -.-> |ARCHITECTURAL INTENT<br/>✅ Clean abstraction layer<br/>❌ Performance: Direct access preferred| E
    
    %% Modal Content Population
    I --> I1[populateEventContent<br/>✅ ENHANCED: Error handling<br/>✅ ENHANCED: Content validation]
    I --> I2[populateSpeakerBios<br/>✅ FIXED: Contact info integration<br/>✅ ENHANCED: Field prioritization<br/>✅ ENHANCED: Link generation]
    I --> I3[populateDescription<br/>✅ ENHANCED: HTML cleaning<br/>✅ ENHANCED: Text formatting]
    I --> I4[populateAudienceTags<br/>✅ ENHANCED: Category mapping<br/>✅ ENHANCED: Visual consistency]
    
    %% Styling
    style A fill:#e1f5fe
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style STATIC fill:#FFE4B5
    style TM fill:#98FB98,stroke:#32CD32,stroke-width:3px
    style E fill:#FFA07A
    style E1 fill:#FFA07A
    style E2 fill:#FFA07A
    style E3 fill:#FFA07A
    style E4 fill:#FFA07A
    style E5 fill:#FFA07A
    style E6 fill:#FFA07A
    style E7 fill:#FFA07A
    style F fill:#90EE90
    style G fill:#98FB98
    style H fill:#98FB98
    style I fill:#98FB98
    style ACTIVE fill:#E0FFE0,stroke:#228B22,stroke-width:3px
    style UNUSED fill:#FFEFD5,stroke:#FF8C00,stroke-width:2px,stroke-dasharray: 5 5
```

## Data Flow Summary - ENHANCED IMPLEMENTATION v1.6

### 🟢 **ENHANCED IMPLEMENTATION (Recent Major Improvements)**

This diagram shows the **enhanced data flow** with comprehensive system improvements implemented across multiple development cycles:

1. **Raw Data Ingestion**: Data enters through `n8n-entegyapi.json` via webhook or local file ✅
2. **Enhanced Centralized Management**: `data-manager.js` with improved error handling and validation ✅
3. **Enhanced Data Standardization**: `data-transformer.js` with comprehensive fixes ✅
   - **✅ FIXED: Speaker Field Mapping**: Consistent `displayName` prioritization with `name` fallback
   - **✅ ENHANCED: Contact Integration**: Proper `web` → `website` protocol handling and `email` mapping
   - **✅ FIXED: Time Handling**: Graceful handling of missing `endTime` properties
   - **✅ ENHANCED: Validation**: Comprehensive data validation throughout transformation process
4. **~~API Layer~~**: **⚠️ ARCHITECTURAL - Available but not loaded for performance optimization**
5. **Enhanced Widget Orchestration**: Direct DataManager access with improved view switching and filter coordination ✅
6. **✅ NEW: Dynamic Time Management**: `schedule-time-manager.js` provides intelligent event grouping by actual API times with semantic CSS class generation
7. **Enhanced Schedule Rendering**: Generator modules with dynamic time organization and layout fixes ✅
8. **Enhanced Panel Creation**: Unified loader with comprehensive improvements ✅
   - **✅ FIXED: Speaker Data Consistency**: Reliable field prioritization across all components
   - **✅ ENHANCED: Thumbnail System**: Robust fallback to speaker headshots with validation
   - **✅ ENHANCED: Separation of Concerns**: ID + Class pattern for maintainable architecture
   - **✅ FIXED: Layout Issues**: Proper width constraints, padding, and spacing
9. **Enhanced User Interaction**: Expanded details manager with comprehensive contact integration ✅
   - **✅ ENHANCED: Contact Links**: Mailto and website links with proper protocol handling and validation
   - **✅ IMPROVED: Field Mapping**: Consistent speaker field display across all modal components
   - **✅ ENHANCED: Error Handling**: Graceful fallbacks for missing speaker data

### ⚠️ **ARCHITECTURE vs IMPLEMENTATION REALITY**

The **API layer files** (`speaker-api.js`, `event-api.js`, `category-api.js`, etc.) represent:
- **Architectural Intent**: Clean abstraction layer providing structured access to standardized data
- **Implementation Reality**: Not loaded by widget entry points for performance optimization
- **Current Approach**: Widget cores directly access DataManager methods for improved efficiency
- **Benefit**: Reduced file loading overhead and simplified data access patterns
- **Trade-off**: Less modular but more performant architecture

### 📊 **Enhanced Static Data Fallback**

The system maintains robust backward compatibility with enhanced fallback logic:
- **Enhanced Fallback Files**: `js/schedule-data.js` and `js/workshop-events.js` with improved error handling
- **Smart Fallback Logic**: Automatic detection when DataManager is unavailable with graceful degradation
- **Hybrid Approach**: Seamless switching between dynamic API data and static fallbacks
- **Validation**: Enhanced validation ensures data consistency regardless of source

### 🏗️ **Enhanced Architecture Conclusion**

The enhanced implementation provides **optimal performance with architectural integrity**:
- **Performance Optimized**: Direct DataManager access eliminates unnecessary abstraction overhead
- **Architecturally Sound**: API layer exists for future extensibility when needed
- **Robust Fallbacks**: Multiple fallback layers ensure reliability in various deployment scenarios
- **Enhanced Pipeline**: DataManager → DataTransformer → Generators flow with comprehensive error handling
- **Dynamic Time Management**: New intelligent time organization system provides API-responsive scheduling
- **Separation of Concerns**: ID + Class pattern ensures maintainable and scalable architecture

### 🔧 **Comprehensive System Enhancements (v1.6)**

**✅ JavaScript Error Resolution**:
- Fixed undefined `endTime` errors in time block processing
- Resolved duplicate/conflicting method definitions 
- Corrected Set/Map usage issues throughout codebase
- Enhanced error handling and validation across all components

**✅ Enhanced Speaker Data Consistency**:
- Fixed `displayName` field prioritization with reliable `name` fallback across all components
- Enhanced thumbnail fallback system with validation and speaker headshot integration
- Comprehensive contact field integration with protocol handling
- Proper mapping of API fields to HTML elements with enhanced validation:
  - `displayName` → `.nzgdc-speaker-bioName-big`, `.nzgdc-speaker-name-main`, `.nzgdc-expanded-speaker-name`, `.nzgdc-speaker-name-item`
  - `position` (enhanced) → `.nzgdc-speaker-bioPosition-big`, `.nzgdc-speaker-position-company-main`, `.nzgdc-expanded-speaker-position`
  - `headshot` → `.nzgdc-speaker-headshot` and enhanced thumbnail fallbacks with validation
  - `email` → `.nzgdc-contact-email` (with mailto link generation)
  - `website` → `.nzgdc-contact-website` (with proper protocol handling)

**✅ Dynamic Time Management System**:
- New `ScheduleTimeManager` for intelligent event grouping by actual API startTime/endTime
- Semantic CSS class generation based on time categories (replaces hardcoded approach)
- API-responsive scheduling that adapts to data changes
- Enhanced time block organization with proper sorting (duration → alphabetical within type)

**✅ Layout and Styling Fixes**:
- Resolved CSS architecture issues with proper separation of concerns
- Fixed width constraints, padding, and spacing inconsistencies
- Corrected panel type logic (Thursday always uses 'Big' panels, Main panels display 5 per row)
- Enhanced dynamic time category styling with data-driven CSS classes
- Implemented ID + Class separation pattern for maintainable architecture

**✅ Filter System Enhancements**:
- Refactored to support both legacy and dynamic layouts with appropriate selectors
- Enhanced state preservation during view switching
- Improved error handling and validation in filter operations