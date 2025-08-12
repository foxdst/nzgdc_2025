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

      // Category definitions with display names and brightness
      this.categoryDefinitions = new Map([
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

    createEventPanel(eventData, eventType = "big", widgetType = "schedule") {
      if (this.isDestroyed) {
        throw new Error("UnifiedEventLoader has been destroyed");
      }

      try {
        this.debug(
          `Creating ${eventType} event panel for widget type: ${widgetType}`,
        );
        this.debug("Event data:", eventData);

        // Create the appropriate panel type
        if (eventType === "main") {
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

      // Only add category data attributes if event data has valid category information
      if (eventData.categoryKey || eventData.category) {
        const categoryData = this.validateCategoryData(eventData);
        clone.setAttribute("data-category", categoryData.categoryKey);
        this.debug(`Added category attributes: ${categoryData.categoryKey}`);
      } else {
        this.debug("No category data found, skipping category attributes");
      }

      this.updateBigEventContent(clone, eventData, widgetType);
      return clone;
    }

    // Create main event panel (300x300 square format) - unified for all widgets
    createMainEventPanel(eventData, widgetType = "schedule") {
      this.debug(`Creating main event panel for ${widgetType} widget`);
      const mainPanel = document.createElement("div");
      mainPanel.className = "nzgdc-event-panel-main";

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
        <div class="nzgdc-category-text-main">${categoryData ? categoryData.displayName : eventData.category || "Event"}</div>
      </div>

      <!-- Event Panel Title (Middle) -->
      <div class="nzgdc-event-panel-title-main">
        <div class="nzgdc-title-text-main">${eventData.title || "Event Title"}</div>
      </div>

      <!-- Event Panel Thumbnail (Bottom) -->
      <div class="nzgdc-event-panel-thumbnail-main">
        <!-- Session Thumbnail (Background) -->
        <div class="nzgdc-session-thumbnail-main" ${eventData.thumbnail ? `style="background-image: url('${eventData.thumbnail}')"` : ""}></div>

        <!-- Event Panel Overlay -->
        <div class="nzgdc-event-panel-overlay-main">
          <!-- Speaker Details -->
          <div class="nzgdc-speaker-details-main">
            <div class="nzgdc-speaker-name-main">Presented by ${eventData.speakers?.[0]?.name || "Speaker Name"}</div>
            <div class="nzgdc-speaker-position-company-main">${eventData.speakers?.[0]?.position || "Position + Company"}</div>
          </div>

          <!-- Call To Action -->
          <div class="nzgdc-call-to-action-main">
            <div class="nzgdc-open-marker-main"></div>
            <div class="nzgdc-cta-text-main">Click for More Event Details</div>
          </div>
        </div>
      </div>
    `;

      return mainPanel;
    }

    updateBigEventContent(clone, eventData, widgetType = "schedule") {
      this.debug(
        "Updating unified event content for:",
        eventData?.title || "Unknown",
      );

      // Direct element queries - more reliable than caching
      const categoryEl = clone.querySelector(".nzgdc-category-text-big");
      const titleEl = clone.querySelector(".nzgdc-title-text-big");
      const thumbnailEl = clone.querySelector(".nzgdc-session-thumbnail-big");
      const timeframeEl = clone.querySelector(".nzgdc-timeframe-text-big");
      const introEl = clone.querySelector(".nzgdc-introduction-text-big");
      const speakerContainers = clone.querySelectorAll(
        ".nzgdc-speaker-biolines-big",
      );

      // Verify elements found - critical for debugging data population issues
      const elementsFound = {
        category: !!categoryEl,
        title: !!titleEl,
        thumbnail: !!thumbnailEl,
        timeframe: !!timeframeEl,
        intro: !!introEl,
        speakers: speakerContainers.length,
      };

      this.debug("Unified element query results:", elementsFound);

      // Alert if critical elements are missing
      if (
        !categoryEl ||
        !titleEl ||
        !timeframeEl ||
        speakerContainers.length === 0
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

      // Update thumbnail (only if provided)
      if (thumbnailEl && eventData.thumbnail) {
        thumbnailEl.style.backgroundImage = `url('${eventData.thumbnail}')`;
        this.debug("Set unified thumbnail:", eventData.thumbnail);
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

      // Update speakers
      const speakers = eventData.speakers || [
        { name: "TBA", position: "Speaker details coming soon" },
      ];

      this.debug(
        "Processing unified speakers:",
        speakers.length,
        "speakers found",
      );

      speakers.forEach((speaker, index) => {
        if (index < speakerContainers.length) {
          const container = speakerContainers[index];
          const nameEl = container.querySelector(".nzgdc-speaker-bioName-big");
          const positionEl = container.querySelector(
            ".nzgdc-speaker-bioPosition-big",
          );

          if (nameEl) {
            const speakerName = speaker.name || "Speaker TBA";
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
      for (let i = speakers.length; i < speakerContainers.length; i++) {
        speakerContainers[i].style.display = "none";
        this.debug(`Hiding unused unified speaker container ${i + 1}`);
      }
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
  }

  // Export for use in other modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = UnifiedEventLoader;
  } else if (typeof window !== "undefined") {
    window.UnifiedEventLoader = UnifiedEventLoader;
  }
} // End of declaration guard
