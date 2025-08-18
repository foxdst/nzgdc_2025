# NZGDC Widget Data Flow Diagram

```mermaid
flowchart TD
    %% Data Sources
    A1[Webhook URL] --> A[n8n-entegyapi.json<br/>Raw API Data]
    A2[Local File Path] --> A
    
    %% Core Data Pipeline
    A --> B[js/data-manager.js<br/>Data Coordinator]
    B --> |loadApiData<br/>transformApiData| C[js/data-transformer.js<br/>Data Standardization]
    
    %% Data Transformation Process
    C --> C1[transformSpeakers]
    C --> C2[transformEvents]
    C --> C3[transformCategories]
    C --> C4[transformRooms/Streams/SessionTypes]
    C --> C5[transformSchedules]
    
    C1 --> D[Standardized Data Maps]
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    
    %% Data Storage & Population
    D --> |populateDataStores| B
    
    %% API Access Layer
    B --> |getDataManager| E[API Access Layer]
    E --> E1[js/speaker-api.js]
    E --> E2[js/event-api.js]
    E --> E3[js/category-api.js]
    E --> E4[js/room-api.js]
    E --> E5[js/stream-api.js]
    E --> E6[js/session-type-api.js]
    E --> E7[js/schedule-api.js]
    
    %% Widget Orchestration
    B --> |scheduleData<br/>eventData| F[Widget Orchestration]
    F --> F1[js/widget-core.js]
    F --> F2[js/friday-saturday-widget-core.js]
    
    %% Schedule Generation
    F1 --> |renderSchedule| G[Schedule Generators]
    F2 --> |renderSchedule| G
    G --> G1[js/schedule-generator.js]
    G --> G2[js/morning-schedule-generator.js]
    G --> G3[js/afternoon-schedule-generator.js]
    
    %% Event Panel Creation
    G1 --> |loadSingleEvent<br/>eventData| H[js/unified-event-loader.js<br/>Panel Creation & Rendering]
    G2 --> |loadSingleEvent<br/>eventData| H
    G3 --> |loadSingleEvent<br/>eventData| H
    
    %% Panel Content Population
    H --> H1[createEventPanel]
    H --> H2[updateEventContent]
    H --> H3[setupSpeakerDetailsHover]
    
    %% Modal Display
    H3 --> |showEventDetails<br/>standardized eventData| I[js/expanded-event-details-manager.js<br/>Modal Display Manager]
    
    %% Modal Content Population
    I --> I1[populateEventContent]
    I --> I2[populateSpeakerBios]
    I --> I3[populateDescription]
    I --> I4[populateAudienceTags]
    
    %% Styling
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fff8e1
    style F fill:#fce4ec
    style G fill:#e0f2f1
    style H fill:#f1f8e9
    style I fill:#fff3e0
```

## Data Flow Summary

This diagram illustrates the systematic data flow in the NZGDC widget system:

1. **Raw Data Ingestion**: Data enters through `n8n-entegyapi.json` via webhook or local file
2. **Centralized Management**: `data-manager.js` serves as the single source of truth
3. **Data Standardization**: `data-transformer.js` processes and cleans the raw data
4. **API Layer**: Specialized API modules provide structured access to standardized data
5. **Widget Orchestration**: Core widget modules initialize the rendering process
6. **Schedule Rendering**: Generator modules build the HTML layout structure
7. **Panel Creation**: Unified loader creates individual event panels with full details
8. **User Interaction**: Expanded details manager handles click events for detailed modals

The dotted lines represent data retrieval and event-driven interactions, while solid lines show the primary data transformation pipeline. This architecture ensures data consistency, modularity, and maintainability across the entire system.