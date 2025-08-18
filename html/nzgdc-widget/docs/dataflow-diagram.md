# NZGDC Widget Data Flow Diagram

```mermaid
flowchart TD
    A[n8n-entegyapi.json<br/>Raw Data Source] --> B[js/data-manager.js<br/>Centralized Management]
    A1[Webhook] --> A
    A2[Local File] --> A
    
    B --> C[js/data-transformer.js<br/>Data Standardization]
    C --> C1[Resolve Duplicates]
    C --> C2[Clean Text]
    C --> C3[Consistent Format]
    
    C3 --> D[API Layer]
    D --> D1[js/speaker-api.js]
    D --> D2[js/event-api.js]
    D --> D3[Other API modules]
    
    D --> E[Widget Orchestration]
    E --> E1[js/widget-core.js]
    E --> E2[js/friday-saturday-widget-core.js]
    
    E1 --> F[Schedule Rendering]
    E2 --> F
    F --> F1[js/schedule-generator.js]
    F --> F2[js/morning-schedule-generator.js]
    F --> F3[js/afternoon-schedule-generator.js]
    
    F1 --> G[js/unified-event-loader.js<br/>Panel Creation]
    F2 --> G
    F3 --> G
    
    G --> G1[Render Event Panels]
    G --> G2[Add Event Listeners]
    G --> G3[Populate Titles/Speakers/Thumbnails]
    
    G2 --> H[js/expanded-event-details-manager.js<br/>Detailed Modal Display]
    
    B -.->|Retrieves scheduleData<br/>and eventData| E1
    B -.->|Retrieves scheduleData<br/>and eventData| E2
    F1 -.->|Requests detailed<br/>eventData for panels| G
    F2 -.->|Requests detailed<br/>eventData for panels| G
    F3 -.->|Requests detailed<br/>eventData for panels| G
    G -.->|Passes full standardized<br/>eventData object| H
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec
    style F fill:#e0f2f1
    style G fill:#f1f8e9
    style H fill:#fff8e1
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