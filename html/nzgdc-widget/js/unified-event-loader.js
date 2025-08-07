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

          const response = await fetch("templates/unified-event-panel.html", {
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            this.template = doc.querySelector(".nzgdc-event-panel-big");

            if (this.template) {
              this.debug("External unified template loaded successfully");
              return this.template;
            }
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
          }
        }

        // Fallback to embedded template if external file fails
        if (window.UNIFIED_EVENT_PANEL_TEMPLATE) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(
            window.UNIFIED_EVENT_PANEL_TEMPLATE,
            "text/html",
          );
          this.template = doc.querySelector(".nzgdc-event-panel-big");

          if (this.template) {
            this.debug("Embedded unified template loaded successfully");
            return this.template;
          }
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
      this.updateBigEventContent(clone, eventData, widgetType);
      return clone;
    }

    // Create main event panel (300x300 square format) - unified for all widgets
    createMainEventPanel(eventData, widgetType = "schedule") {
      this.debug(`Creating main event panel for ${widgetType} widget`);
      const mainPanel = document.createElement("div");
      mainPanel.className = "nzgdc-event-panel-main";

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
        <div class="nzgdc-category-text-main">${eventData.category || "Event"}</div>
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

      // Update category
      if (categoryEl) {
        const categoryText = eventData.category || "Event";
        categoryEl.textContent = categoryText;
        this.debug("Set unified category:", categoryText);
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
