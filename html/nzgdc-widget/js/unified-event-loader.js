// NZGDC Unified Event Loader - Replaces all separate event loaders
// Handles both "big" (620x300) and "main" (300x300) event panels for all widget types

// Prevent multiple declarations when loaded by multiple entry points
if (typeof window !== "undefined" && window.UnifiedEventLoader) {
  console.log(
    "[NZGDC Unified Widget] UnifiedEventLoader already loaded, skipping redeclaration",
  );
} else {
  class UnifiedEventLoader {
    constructor() {
      this.template = null;
      this.isLoading = false;
      this.loadError = null;
      this.REQUEST_TIMEOUT = 10000; // 10 seconds timeout
      this.isDestroyed = false;
      this.eventCounter = 0; // Counter for generating unique IDs

      // Category definitions with display names and brightness
      this.categoryDefinitions = new Map([
        ["ALL", { name: "All Audiences", brightness: "light" }],
        ["STORY_NARRATIVE", { name: "Story & Narrative", brightness: "light" }],
        ["PRODUCTION_QA", { name: "Production & QA", brightness: "dark" }],
        ["CULTURE", { name: "Culture", brightness: "light" }],
        [
          "BUSINESS_MARKETING",
          { name: "Business & Marketing", brightness: "light" },
        ],
        ["ART", { name: "Art", brightness: "light" }],
        ["AUDIO", { name: "Audio", brightness: "dark" }],
        ["PROGRAMMING", { name: "Programming", brightness: "light" }],
        [
          "DATA_TESTING_RESEARCH",
          { name: "Data, Testing or Research", brightness: "dark" },
        ],
        [
          "REALITIES_VR_AR_MR",
          { name: "Realities (VR, AR, MR)", brightness: "light" },
        ],
        ["GAME_DESIGN", { name: "Game Design", brightness: "light" }],
        [
          "SERIOUS_EDUCATIONAL",
          { name: "Serious & Educational Games", brightness: "light" },
        ],
      ]);
    }

    async loadTemplate() {
      if (this.template) return this.template;
      if (this.isLoading) {
        while (this.isLoading) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        return this.template;
      }

      this.isLoading = true;

      try {
        this.debug("Loading unified event panel template...");

        // Try to load external template file first
        try {
          // Create AbortController for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => {
            controller.abort();
          }, this.REQUEST_TIMEOUT);

          // Determine correct path based on current location
          const currentPath = window.location.pathname;
          const isInSubdirectory =
            currentPath.includes("/.widget-tests/") ||
            currentPath.includes("\\.widget-tests\\") ||
            currentPath.endsWith(
              "/.widget-tests/event-categories-test-demo.html",
            ) ||
            currentPath.endsWith("/.widget-tests/widget-demo.html");

          const templatePath = isInSubdirectory
            ? "../templates/unified-event-panel.html"
            : "templates/unified-event-panel.html";

          this.debug(`Attempting to fetch template from: ${templatePath}`);
          this.debug(`Current pathname: ${currentPath}`);
          this.debug(`Protocol: ${window.location.protocol}`);
          this.debug(`Using subdirectory detection: ${isInSubdirectory}`);

          // For file:// protocol, skip external loading and use embedded template
          if (window.location.protocol === "file:") {
            this.debug(
              "File protocol detected, skipping external template fetch",
            );
            throw new Error("Using embedded template due to file:// protocol");
          }

          const response = await fetch(templatePath, {
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const html = await response.text();
            this.debug(`Template HTML loaded, length: ${html.length}`);
            this.debug(`Template HTML preview: ${html.substring(0, 200)}...`);

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            this.template = doc.querySelector(".nzgdc-event-panel-big");

            if (this.template) {
              this.debug("External unified template loaded successfully");
              this.debug(
                `Template element found: ${this.template.outerHTML.substring(0, 100)}...`,
              );
              return this.template;
            } else {
              this.debug(
                "Template HTML loaded but no .nzgdc-event-panel-big element found",
              );
              this.debug(
                `Document body content: ${doc.body ? doc.body.innerHTML.substring(0, 200) : "No body"}...`,
              );
            }
          } else {
            this.debug(
              `Template fetch failed with status: ${response.status} ${response.statusText}`,
            );
          }
        } catch (fetchError) {
          if (fetchError.name === "AbortError") {
            this.debug(
              "External unified template timeout after",
              this.REQUEST_TIMEOUT + "ms, trying embedded template",
            );
          } else {
            this.debug(
              "External unified template failed, trying embedded template:",
              fetchError.message,
            );
            this.debug(`Fetch error details: ${fetchError.name}`);
            if (window.location.protocol === "file:") {
              this.debug("File protocol detected - this is expected behavior");
            }
          }
        }

        // Fallback to embedded template if external file fails
        this.debug(
          `Checking for embedded template: ${!!window.UNIFIED_EVENT_PANEL_TEMPLATE}`,
        );
        if (window.UNIFIED_EVENT_PANEL_TEMPLATE) {
          this.debug(
            `Embedded template length: ${window.UNIFIED_EVENT_PANEL_TEMPLATE.length}`,
          );
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            window.UNIFIED_EVENT_PANEL_TEMPLATE,
            "text/html",
          );
          this.template = doc.querySelector(".nzgdc-event-panel-big");

          if (this.template) {
            this.debug("Embedded unified template loaded successfully");
            return this.template;
          } else {
            this.debug(
              "Embedded template available but no .nzgdc-event-panel-big element found",
            );
          }
        } else {
          this.debug(
            "No embedded template available - window.UNIFIED_EVENT_PANEL_TEMPLATE is undefined",
          );
        }

        throw new Error(
          "No unified template available - this should never happen",
        );
      } catch (error) {
        console.error("Failed to load unified template:", error);
        this.loadError = error;
        throw error;
      } finally {
        this.isLoading = false;
      }
    }

    // Debug logging helper - checks global debug flag
    debug(...args) {
      if (window.NZGDC_DEBUG === true) {
        console.log("[NZGDC Unified Event Loader]", ...args);
      }
    }

    // Category validation and helper methods
    validateCategoryData(eventData) {
      const categoryKey =
        eventData.categoryKey || this.mapCategoryToKey(eventData.category);
      const definition = this.categoryDefinitions.get(categoryKey);

      if (!definition) {
        console.warn(
          `[NZGDC Unified Widget] Invalid category key: ${categoryKey}, falling back to default`,
        );
        return {
          categoryKey: "PROGRAMMING", // Default fallback
          displayName: "Programming",
          brightness: "light",
          isValid: false,
        };
      }

      return {
        categoryKey,
        displayName: definition.name,
        brightness: definition.brightness,
        isValid: true,
      };
    }

    getCategoryBrightness(categoryKey) {
      const definition = this.categoryDefinitions.get(categoryKey);
      return definition ? definition.brightness : "light";
    }

    getCategoryDisplayName(categoryKey) {
      const definition = this.categoryDefinitions.get(categoryKey);
      return definition ? definition.name : "Event";
    }

    // Map legacy category strings to new keys
    mapCategoryToKey(categoryString) {
      if (!categoryString) return "PROGRAMMING";

      const mapping = {
        "Story & Narrative": "STORY_NARRATIVE",
        "Production & QA": "PRODUCTION_QA",
        Culture: "CULTURE",
        "Business & Marketing": "BUSINESS_MARKETING",
        Business: "BUSINESS_MARKETING",
        Art: "ART",
        Audio: "AUDIO",
        Programming: "PROGRAMMING",
        "Data, Testing or Research": "DATA_TESTING_RESEARCH",
        "Realities (VR, AR, MR)": "REALITIES_VR_AR_MR",
        "Game Design": "GAME_DESIGN",
        "Serious & Educational Games": "SERIOUS_EDUCATIONAL",
      };

      return mapping[categoryString] || "PROGRAMMING";
    }

    // Generate unique ID for event panel elements
    generateUniqueId() {
      return `${Date.now()}-${++this.eventCounter}`;
    }

    // Replace template placeholders with actual unique ID
    processTemplate(template, uniqueId) {
      let templateHTML = template.innerHTML;
      templateHTML = templateHTML.replace(/{uniqueId}/g, uniqueId);
      template.innerHTML = templateHTML;
      return template;
    }

    // Extract uniqueId from existing panel elements
    extractUniqueIdFromPanel(panel) {
      // Try to find any element with an ID that contains our pattern
      const elementWithId = panel.querySelector('[id*="event-"]');
      if (elementWithId && elementWithId.id) {
        // Extract the unique ID from patterns like "event-category-{uniqueId}" or "event-category-main-{uniqueId}"
        const matches = elementWithId.id.match(
          /event-(?:category|title|thumbnail|speaker-name|cta-text)(?:-main)?-(.+)$/,
        );
        return matches ? matches[1] : null;
      }
      return null;
    }

    createEventPanel(eventData, eventType = "auto", widgetType = "schedule") {
      if (this.isDestroyed) {
        throw new Error("UnifiedEventLoader has been destroyed");
      }

      try {
        // Auto-detect event type based on speaker count if not explicitly specified
        let finalEventType = eventType;
        if (eventType === "auto") {
          const speakerCount = eventData.speakers
            ? eventData.speakers.length
            : 0;
          finalEventType = speakerCount > 1 ? "big" : "main";
          this.debug(
            `Auto-detected event type: ${finalEventType} (${speakerCount} speakers)`,
          );
        }

        this.debug(
          `Creating ${finalEventType} event panel for widget type: ${widgetType}`,
        );
        this.debug("Event data:", eventData);

        // Create the appropriate panel type
        if (finalEventType === "main") {
          return this.createMainEventPanel(eventData, widgetType);
        } else {
          return this.createBigEventPanel(eventData, widgetType);
        }
      } catch (error) {
        console.error(
          "Failed to create unified event panel:",
          error,
          eventData,
        );
        console.error("Stack trace:", error.stack);
        return this.createErrorPanel(error.message);
      }
    }

    // Create big event panel (620x300 format) - unified for all widgets
    createBigEventPanel(eventData, widgetType = "schedule") {
      if (!this.template) {
        console.error(
          "[NZGDC Unified Widget] Template not loaded - attempting to load now",
        );
        throw new Error("Template not loaded. Call loadTemplate() first.");
      }

      this.debug(`Creating big event panel for ${widgetType} widget`);
      const clone = this.template.cloneNode(true);

      // Generate unique ID for this panel and process template
      const uniqueId = this.generateUniqueId();
      this.processTemplate(clone, uniqueId);

      // Only add category data attributes if event data has valid category information
      if (eventData.categoryKey || eventData.category) {
        const categoryData = this.validateCategoryData(eventData);
        clone.setAttribute("data-category", categoryData.categoryKey);
        this.debug(`Added category attributes: ${categoryData.categoryKey}`);
      } else {
        this.debug("No category data found, skipping category attributes");
      }

      this.updateBigEventContent(clone, eventData, widgetType, uniqueId);
      return clone;
    }

    // Create main event panel (300x300 square format) - unified for all widgets
    createMainEventPanel(eventData, widgetType = "schedule") {
      this.debug(`Creating main event panel for ${widgetType} widget`);
      const mainPanel = document.createElement("div");
      mainPanel.className = "nzgdc-event-panel-main";

      // Generate unique ID for this panel
      const uniqueId = this.generateUniqueId();

      // Only add category data attributes if event data has valid category information
      let categoryData = null;
      if (eventData.categoryKey || eventData.category) {
        categoryData = this.validateCategoryData(eventData);
        mainPanel.setAttribute("data-category", categoryData.categoryKey);
        this.debug(`Added category attributes: ${categoryData.categoryKey}`);
      } else {
        this.debug("No category data found, skipping category attributes");
      }

      // Determine introduction text based on widget type
      let introText = "NZGDC 2025 Event by";
      switch (widgetType) {
        case "schedule":
        case "thursday":
          introText = "NZGDC 2025 Workshop by";
          break;
        case "morning":
          introText = "NZGDC 2025 Morning Event by";
          break;
        case "afternoon":
          introText = "NZGDC 2025 Afternoon Event by";
          break;
      }

      mainPanel.innerHTML = `
      <!-- Event Category (Top) -->
      <div class="nzgdc-event-category-main">
        <div class="nzgdc-category-text-main" id="event-category-main-${uniqueId}">${categoryData ? categoryData.displayName : eventData.category || "Event"}</div>
      </div>

      <!-- Event Panel Title (Middle) -->
      <div class="nzgdc-event-panel-title-main">
        <div class="nzgdc-title-text-main" id="event-title-main-${uniqueId}">${eventData.title || "Event Title"}</div>
      </div>

      <!-- Event Panel Thumbnail (Bottom) -->
      <div class="nzgdc-event-panel-thumbnail-main">
        <!-- Session Thumbnail (Background) -->
        <div class="nzgdc-session-thumbnail-main" id="event-thumbnail-main-${uniqueId}" style="${eventData.thumbnail ? `background-image: url('${eventData.thumbnail}')` : eventData.speakers?.[0]?.headshot ? `background-image: url('${eventData.speakers[0].headshot}')` : "background-image: none"}"></div>

        <!-- Event Panel Overlay -->
        <div class="nzgdc-event-panel-overlay-main">
          <!-- Speaker Details -->
          <div class="nzgdc-speaker-details-main">
            <div class="nzgdc-speaker-name-main" id="event-speaker-name-main-${uniqueId}">Presented by ${eventData.speakers?.[0]?.displayName || eventData.speakers?.[0]?.name || "Speaker Name"}</div>
            <div class="nzgdc-speaker-position-company-main" id="event-speaker-position-main-${uniqueId}">${eventData.speakers?.[0]?.position || "Position + Company"}</div>
          </div>

          <!-- Call To Action -->
          <div class="nzgdc-call-to-action-main">
            <div class="nzgdc-open-marker-main"></div>
            <div class="nzgdc-cta-text-main" id="event-cta-text-main-${uniqueId}">Click for More Event Details</div>
          </div>
        </div>
      </div>
    `;

      // NEW: Add speaker details hover functionality after panel creation
      setTimeout(() => {
        this.setupSpeakerDetailsHover(mainPanel, eventData);
      }, 0); // Allow DOM to update first

      return mainPanel;
    }

    updateBigEventContent(clone, eventData, widgetType = "schedule", uniqueId) {
      this.debug(
        "Updating unified event content for:",
        eventData?.title || "Unknown",
      );

      // Element queries - use IDs if available, fallback to classes for legacy panels
      let categoryEl, titleEl, thumbnailEl, timeframeEl, introEl;
      let speakerNameEl1,
        speakerPositionEl1,
        speakerNameEl2,
        speakerPositionEl2,
        speakerNameEl3,
        speakerPositionEl3;

      if (uniqueId) {
        // ID-based element queries for precise targeting
        categoryEl = clone.querySelector(`#event-category-${uniqueId}`);
        titleEl = clone.querySelector(`#event-title-${uniqueId}`);
        thumbnailEl = clone.querySelector(`#event-thumbnail-${uniqueId}`);
        timeframeEl = clone.querySelector(`#event-timeframe-${uniqueId}`);
        introEl = clone.querySelector(`#event-intro-${uniqueId}`);

        // For speakers, we need to get individual elements by their numbered IDs
        speakerNameEl1 = clone.querySelector(
          `#event-speaker-name-1-${uniqueId}`,
        );
        speakerPositionEl1 = clone.querySelector(
          `#event-speaker-position-1-${uniqueId}`,
        );
        speakerNameEl2 = clone.querySelector(
          `#event-speaker-name-2-${uniqueId}`,
        );
        speakerPositionEl2 = clone.querySelector(
          `#event-speaker-position-2-${uniqueId}`,
        );
        speakerNameEl3 = clone.querySelector(
          `#event-speaker-name-3-${uniqueId}`,
        );
        speakerPositionEl3 = clone.querySelector(
          `#event-speaker-position-3-${uniqueId}`,
        );
      } else {
        // Fallback to class-based queries for legacy panels
        this.debug(
          "No uniqueId provided, falling back to class-based targeting",
        );
        categoryEl = clone.querySelector(".nzgdc-category-text-big");
        titleEl = clone.querySelector(".nzgdc-title-text-big");
        thumbnailEl = clone.querySelector(".nzgdc-session-thumbnail-big");
        timeframeEl = clone.querySelector(".nzgdc-timeframe-text-big");
        introEl = clone.querySelector(".nzgdc-introduction-text-big");

        const speakerContainers = clone.querySelectorAll(
          ".nzgdc-speaker-biolines-big",
        );
        speakerNameEl1 = speakerContainers[0]?.querySelector(
          ".nzgdc-speaker-bioName-big",
        );
        speakerPositionEl1 = speakerContainers[0]?.querySelector(
          ".nzgdc-speaker-bioPosition-big",
        );
        speakerNameEl2 = speakerContainers[1]?.querySelector(
          ".nzgdc-speaker-bioName-big",
        );
        speakerPositionEl2 = speakerContainers[1]?.querySelector(
          ".nzgdc-speaker-bioPosition-big",
        );
        speakerNameEl3 = speakerContainers[2]?.querySelector(
          ".nzgdc-speaker-bioName-big",
        );
        speakerPositionEl3 = speakerContainers[2]?.querySelector(
          ".nzgdc-speaker-bioPosition-big",
        );
      }

      // Group speaker elements for easier iteration
      const speakerElements = [
        { name: speakerNameEl1, position: speakerPositionEl1 },
        { name: speakerNameEl2, position: speakerPositionEl2 },
        { name: speakerNameEl3, position: speakerPositionEl3 },
      ];

      // Verify elements found - critical for debugging data population issues
      const elementsFound = {
        category: !!categoryEl,
        title: !!titleEl,
        thumbnail: !!thumbnailEl,
        timeframe: !!timeframeEl,
        intro: !!introEl,
        speakers: speakerElements.filter((s) => s.name && s.position).length,
      };

      this.debug("Unified element query results:", elementsFound);

      // Alert if critical elements are missing
      if (
        !categoryEl ||
        !titleEl ||
        !timeframeEl ||
        speakerElements.filter((s) => s.name && s.position).length === 0
      ) {
        console.warn(
          "[NZGDC Unified Widget] Missing critical template elements:",
          elementsFound,
        );
      }

      // Update category display - only validate if category data exists
      if (categoryEl) {
        if (eventData.categoryKey || eventData.category) {
          const categoryData = this.validateCategoryData(eventData);
          categoryEl.textContent = categoryData.displayName;
          this.debug(
            "Set unified category:",
            categoryData.displayName,
            `(${categoryData.categoryKey})`,
          );
        } else {
          categoryEl.textContent = eventData.category || "Event";
          this.debug(
            "Set category without validation:",
            eventData.category || "Event",
          );
        }
      } else {
        console.warn(
          "[NZGDC Unified Widget] Category element not found - check template structure",
        );
      }

      // Update title
      if (titleEl) {
        const titleText = eventData.title || "Event Title";
        titleEl.textContent = titleText;
        this.debug("Set unified title:", titleText);
      } else {
        console.warn(
          "[NZGDC Unified Widget] Title element not found - check template structure",
        );
      }

      // Update introduction text based on widget type
      if (introEl) {
        let introText = "NZGDC 2025 Event by";
        switch (widgetType) {
          case "schedule":
          case "thursday":
            introText = "NZGDC 2025 Workshop by";
            break;
          case "morning":
            introText = "NZGDC 2025 Morning Event by";
            break;
          case "afternoon":
            introText = "NZGDC 2025 Afternoon Event by";
            break;
        }
        introEl.textContent = introText;
        this.debug("Set unified intro text:", introText);
      }

      // Update thumbnail (with speaker headshot fallback)
      if (thumbnailEl) {
        if (eventData.thumbnail) {
          thumbnailEl.style.backgroundImage = `url('${eventData.thumbnail}')`;
          this.debug("Set unified thumbnail:", eventData.thumbnail);
        } else if (eventData.speakers?.[0]?.headshot) {
          thumbnailEl.style.backgroundImage = `url('${eventData.speakers[0].headshot}')`;
          this.debug(
            "Set unified thumbnail from speaker headshot:",
            eventData.speakers[0].headshot,
          );
        } else {
          thumbnailEl.style.backgroundImage = "none";
          this.debug(
            "Cleared unified thumbnail - no thumbnail or headshot available",
          );
        }
      }

      // Update timeframe
      if (timeframeEl) {
        const timeframeText = eventData.timeframe || "TBA";
        timeframeEl.textContent = timeframeText;
        this.debug("Set unified timeframe:", timeframeText);
      } else {
        console.warn(
          "[NZGDC Unified Widget] Timeframe element not found - check template structure",
        );
      }

      // Update speakers with safety checks
      let speakers = [];
      if (
        eventData.speakers &&
        Array.isArray(eventData.speakers) &&
        eventData.speakers.length > 0
      ) {
        speakers = eventData.speakers.filter(
          (speaker) => speaker && typeof speaker === "object",
        );
      }

      // Fallback if no valid speakers
      if (speakers.length === 0) {
        speakers = [{ name: "TBA", position: "Speaker details coming soon" }];
      }

      this.debug(
        "Processing unified speakers:",
        speakers.length,
        "speakers found",
      );

      speakers.forEach((speaker, index) => {
        if (index < speakerElements.length) {
          const speakerElement = speakerElements[index];
          const nameEl = speakerElement.name;
          const positionEl = speakerElement.position;

          if (nameEl) {
            const speakerName =
              speaker.displayName || speaker.name || "Speaker TBA";
            nameEl.textContent = speakerName;
            this.debug(`Unified speaker ${index + 1} name:`, speakerName);
          } else {
            console.warn(
              `[NZGDC Unified Widget] Speaker ${index + 1} name element not found`,
            );
          }

          if (positionEl) {
            const speakerPosition = speaker.position || "Details coming soon";
            positionEl.textContent = speakerPosition;
            this.debug(
              `Unified speaker ${index + 1} position:`,
              speakerPosition,
            );
          } else {
            console.warn(
              `[NZGDC Unified Widget] Speaker ${index + 1} position element not found`,
            );
          }
        }
      });

      // Hide unused speaker containers
      for (let i = speakers.length; i < speakerElements.length; i++) {
        const speakerElement = speakerElements[i];
        if (speakerElement.name && speakerElement.name.parentElement) {
          speakerElement.name.parentElement.style.display = "none";
          this.debug(`Hiding unused unified speaker container ${i + 1}`);
        }
      }

      // NEW: Add speaker details hover functionality
      this.setupSpeakerDetailsHover(clone, eventData);
    }

    // NEW: Setup hover functionality for both panel types
    setupSpeakerDetailsHover(eventPanel, eventData) {
      try {
        // Detect panel type by checking for Big or Main panel elements
        const isBigPanel = eventPanel.querySelector(
          ".nzgdc-event-panel-big-thumbnail",
        );
        const isMainPanel = eventPanel.querySelector(
          ".nzgdc-event-panel-thumbnail-main",
        );

        if (isBigPanel) {
          this.setupBigPanelHover(eventPanel, eventData);
        } else if (isMainPanel) {
          this.setupMainPanelHover(eventPanel, eventData);
        } else {
          this.debug("Unknown panel type, skipping hover setup");
        }
      } catch (error) {
        this.debug("Error setting up overlay hover:", error);
        console.warn("Overlay hover setup failed:", error);
      }
    }

    // Setup hover for Big Event Panel (620x300) - show/hide entire overlay
    setupBigPanelHover(eventPanel, eventData) {
      const thumbnail = eventPanel.querySelector(
        ".nzgdc-event-panel-big-thumbnail",
      );
      const overlay = eventPanel.querySelector(
        ".nzgdc-event-detail-overlay-big",
      );

      if (!thumbnail || !overlay) {
        this.debug("Required Big panel hover elements not found");
        return;
      }

      // Setup hover events - show/hide entire overlay
      // Initial state and transition handled by CSS
      thumbnail.addEventListener("mouseenter", () => {
        overlay.style.opacity = "1";
        this.debug("Showing Big panel overlay for:", eventData.title);
      });

      thumbnail.addEventListener("mouseleave", () => {
        overlay.style.opacity = "0";
        this.debug("Hiding Big panel overlay for:", eventData.title);
      });

      // Make entire overlay clickable for accessibility
      overlay.style.cursor = "pointer";
      overlay.addEventListener("click", (e) => {
        // NEW: Trigger expanded event details if manager available
        if (window.ExpandedEventDetailsManager) {
          try {
            // Initialize manager if not already done
            if (!window.expandedEventDetailsManager) {
              const config = window.NZGDC_CONFIG || {};
              window.expandedEventDetailsManager =
                new window.ExpandedEventDetailsManager(config);
            }

            // Show expanded event details
            window.expandedEventDetailsManager.showEventDetails(
              eventData,
              "big-panel",
            );
            this.debug(
              "Big panel overlay clicked - expanded details shown for:",
              eventData.title,
            );
            return;
          } catch (error) {
            console.error(
              "[UnifiedEventLoader] Failed to show expanded event details:",
              error,
            );
            // Fall through to original behavior
          }
        }

        // Fallback to existing behavior
        const ctaElement = overlay.querySelector(".nzgdc-call-to-action-big");
        if (ctaElement) {
          // Trigger any existing click handlers on the CTA element
          ctaElement.click();
          this.debug("Big panel overlay clicked (fallback):", eventData.title);
        }
      });
    }

    // Setup hover for Main Event Panel (300x300) - show/hide entire overlay
    setupMainPanelHover(eventPanel, eventData) {
      const thumbnail = eventPanel.querySelector(
        ".nzgdc-event-panel-thumbnail-main",
      );
      const overlay = eventPanel.querySelector(
        ".nzgdc-event-panel-overlay-main",
      );

      if (!thumbnail || !overlay) {
        this.debug("Required Main panel hover elements not found");
        return;
      }

      // Setup hover events - show/hide entire overlay
      // Initial state and transition handled by CSS
      thumbnail.addEventListener("mouseenter", () => {
        overlay.style.opacity = "1";
        this.debug("Showing Main panel overlay for:", eventData.title);
      });

      thumbnail.addEventListener("mouseleave", () => {
        overlay.style.opacity = "0";
        this.debug("Hiding Main panel overlay for:", eventData.title);
      });

      // Make entire overlay clickable for accessibility
      overlay.style.cursor = "pointer";
      overlay.addEventListener("click", (e) => {
        // NEW: Trigger expanded event details if manager available
        if (window.ExpandedEventDetailsManager) {
          try {
            // Initialize manager if not already done
            if (!window.expandedEventDetailsManager) {
              const config = window.NZGDC_CONFIG || {};
              window.expandedEventDetailsManager =
                new window.ExpandedEventDetailsManager(config);
            }

            // Show expanded event details
            window.expandedEventDetailsManager.showEventDetails(
              eventData,
              "main-panel",
            );
            this.debug(
              "Main panel overlay clicked - expanded details shown for:",
              eventData.title,
            );
            return;
          } catch (error) {
            console.error(
              "[UnifiedEventLoader] Failed to show expanded event details:",
              error,
            );
            // Fall through to original behavior
          }
        }

        // Fallback to existing behavior
        const ctaElement = overlay.querySelector(".nzgdc-call-to-action-main");
        if (ctaElement) {
          // Trigger any existing click handlers on the CTA element
          ctaElement.click();
          this.debug("Main panel overlay clicked (fallback):", eventData.title);
        }
      });
    }

    createErrorPanel(errorMessage) {
      console.error(
        "[NZGDC Unified Widget] Creating error panel:",
        errorMessage,
      );
      const errorPanel = document.createElement("div");
      errorPanel.className = "nzgdc-error-placeholder";
      errorPanel.innerHTML = `
      <strong>Failed to load unified event panel</strong>
      <small>${errorMessage}</small>
      <small>Check console for detailed error information</small>
      <small>Template loaded: ${this.template ? "Yes" : "No"}</small>
    `;
      return errorPanel;
    }

    destroy() {
      this.debug("Destroying UnifiedEventLoader...");

      try {
        this.isDestroyed = true;
        this.template = null;
        this.isLoading = false;
        this.loadError = null;

        this.debug("UnifiedEventLoader destroyed successfully");
      } catch (error) {
        console.error("Error destroying UnifiedEventLoader:", error);
      }
    }

    /**
     * Update an existing event panel with new data
     * @param {HTMLElement} panelElement - The existing panel element to update
     * @param {Object} eventData - New event data to populate the panel with
     * @param {string} widgetType - Type of widget (schedule, thursday, morning, afternoon)
     */
    updateEventPanel(panelElement, eventData, widgetType = "schedule") {
      if (this.isDestroyed) {
        throw new Error("UnifiedEventLoader has been destroyed");
      }

      try {
        this.debug(
          "Updating event panel with new data:",
          eventData?.title || "Unknown",
        );

        // Determine panel type (big or main) based on class
        const isBigPanel =
          panelElement.classList.contains("nzgdc-event-panel-big") ||
          panelElement.querySelector(".nzgdc-event-panel-big");
        const isMainPanel =
          panelElement.classList.contains("nzgdc-event-panel-main") ||
          panelElement.querySelector(".nzgdc-event-panel-main");

        if (isBigPanel) {
          const bigPanelEl =
            panelElement.querySelector(".nzgdc-event-panel-big") ||
            panelElement;
          const uniqueId = this.extractUniqueIdFromPanel(bigPanelEl);
          this.updateBigEventContent(
            bigPanelEl,
            eventData,
            widgetType,
            uniqueId,
          );
        } else if (isMainPanel) {
          const mainPanelEl =
            panelElement.querySelector(".nzgdc-event-panel-main") ||
            panelElement;
          const uniqueId = this.extractUniqueIdFromPanel(mainPanelEl);
          this.updateMainEventContent(
            mainPanelEl,
            eventData,
            widgetType,
            uniqueId,
          );
        } else {
          console.warn("[NZGDC Unified Widget] Unknown panel type for update");
          // Fallback to recreating the panel
          const newPanel = this.createEventPanel(
            eventData,
            isBigPanel ? "big" : "main",
            widgetType,
          );
          panelElement.replaceWith(newPanel);
        }
      } catch (error) {
        console.error(
          "[NZGDC Unified Widget] Failed to update event panel:",
          error,
        );
      }
    }

    /**
     * Update content of a main event panel
     * @param {HTMLElement} mainPanel - The main panel element to update
     * @param {Object} eventData - New event data
     * @param {string} widgetType - Type of widget
     */
    updateMainEventContent(
      mainPanel,
      eventData,
      widgetType = "schedule",
      uniqueId,
    ) {
      this.debug(
        "Updating main event panel with new data:",
        eventData?.title || "Unknown",
      );

      // Update category data attributes if event data has valid category information
      let categoryData = null;
      if (eventData.categoryKey || eventData.category) {
        categoryData = this.validateCategoryData(eventData);
        mainPanel.setAttribute("data-category", categoryData.categoryKey);
        this.debug(`Updated category attributes: ${categoryData.categoryKey}`);
      } else {
        this.debug(
          "No category data found, keeping existing category attributes",
        );
      }

      // Element queries - use IDs if available, fallback to classes for legacy panels
      let categoryEl, titleEl, thumbnailEl, speakerNameEl, speakerPositionEl;

      if (uniqueId) {
        // ID-based targeting for panels with unique IDs
        categoryEl = mainPanel.querySelector(
          `#event-category-main-${uniqueId}`,
        );
        titleEl = mainPanel.querySelector(`#event-title-main-${uniqueId}`);
        thumbnailEl = mainPanel.querySelector(
          `#event-thumbnail-main-${uniqueId}`,
        );
        speakerNameEl = mainPanel.querySelector(
          `#event-speaker-name-main-${uniqueId}`,
        );
        speakerPositionEl = mainPanel.querySelector(
          `#event-speaker-position-main-${uniqueId}`,
        );
      } else {
        // Fallback to class-based targeting for legacy panels
        this.debug(
          "No uniqueId provided, falling back to class-based targeting",
        );
        categoryEl = mainPanel.querySelector(".nzgdc-category-text-main");
        titleEl = mainPanel.querySelector(".nzgdc-title-text-main");
        thumbnailEl = mainPanel.querySelector(".nzgdc-session-thumbnail-main");
        speakerNameEl = mainPanel.querySelector(".nzgdc-speaker-name-main");
        speakerPositionEl = mainPanel.querySelector(
          ".nzgdc-speaker-position-company-main",
        );
      }

      // Update category display
      if (categoryEl) {
        categoryEl.textContent = categoryData
          ? categoryData.displayName
          : eventData.category || "Event";
      }

      // Update title
      if (titleEl) {
        titleEl.textContent = eventData.title || "Event Title";
      }

      // Update thumbnail (with speaker headshot fallback)
      if (thumbnailEl) {
        if (eventData.thumbnail) {
          thumbnailEl.style.backgroundImage = `url('${eventData.thumbnail}')`;
        } else if (eventData.speakers?.[0]?.headshot) {
          thumbnailEl.style.backgroundImage = `url('${eventData.speakers[0].headshot}')`;
        } else {
          thumbnailEl.style.backgroundImage = "none";
        }
      }

      // Update speaker details

      if (speakerNameEl) {
        const displayText =
          eventData.speakers?.[0]?.displayName ||
          eventData.speakers?.[0]?.name ||
          "Speaker Name";
        speakerNameEl.textContent = `Presented by ${displayText}`;
      }

      if (speakerPositionEl) {
        speakerPositionEl.textContent =
          eventData.speakers?.[0]?.position || "Position + Company";
      }

      // Update speaker details hover functionality
      this.setupSpeakerDetailsHover(mainPanel, eventData);
    }
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = UnifiedEventLoader;
  } else if (typeof window !== "undefined") {
    window.UnifiedEventLoader = UnifiedEventLoader;
  }
} // End of declaration guard
