// NZGDC Afternoon Schedule Widget - Afternoon Event Loader

class AfternoonEventLoader {
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
      this.debug("Loading afternoon event panel template...");

      // Try to load external template file first
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, this.REQUEST_TIMEOUT);

        const response = await fetch(
          "nzgdc-widget/templates/afternoon-event-panel.html",
          {
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          this.template = doc.querySelector(".nzgdc-afternoon-event-panel-big");

          if (this.template) {
            this.debug("External afternoon template loaded successfully");
            return this.template;
          }
        }
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          this.debug(
            "External afternoon template timeout after",
            this.REQUEST_TIMEOUT + "ms, trying embedded template",
          );
        } else {
          this.debug(
            "External afternoon template failed, trying embedded template:",
            fetchError.message,
          );
        }
      }

      // Fallback to embedded template if external file fails
      if (window.AFTERNOON_EVENT_PANEL_TEMPLATE) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          window.AFTERNOON_EVENT_PANEL_TEMPLATE,
          "text/html",
        );
        this.template = doc.querySelector(".nzgdc-afternoon-event-panel-big");

        if (this.template) {
          this.debug("Embedded afternoon template loaded successfully");
          return this.template;
        }
      }

      throw new Error(
        "No afternoon template available - this should never happen",
      );
    } catch (error) {
      console.error("Failed to load afternoon template:", error);
      this.loadError = error;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Afternoon Event Loader]", ...args);
    }
  }

  createEventPanel(eventData, eventType = "big") {
    if (this.isDestroyed) {
      throw new Error("AfternoonEventLoader has been destroyed");
    }

    try {
      // If we need main panel style, create that instead
      if (eventType === "main") {
        return this.createMainEventPanel(eventData);
      }

      if (!this.template) {
        throw new Error("Template not loaded. Call loadTemplate() first.");
      }

      const clone = this.template.cloneNode(true);
      this.updateEventContent(clone, eventData);
      return clone;
    } catch (error) {
      console.error("Failed to create afternoon event panel:", error, eventData);
      return this.createErrorPanel(error.message);
    }
  }

  // Create main event panel (square format) - afternoon theme
  createMainEventPanel(eventData) {
    const mainPanel = document.createElement("div");
    mainPanel.className = "nzgdc-afternoon-event-panel-main";

    mainPanel.innerHTML = `
      <!-- Event Category (Top) -->
      <div class="nzgdc-afternoon-event-category-main">
        <div class="nzgdc-afternoon-category-text-main">${eventData.category || "Story & Narrative"}</div>
      </div>

      <!-- Event Panel Title (Middle) -->
      <div class="nzgdc-afternoon-event-panel-title-main">
        <div class="nzgdc-afternoon-title-text-main">${eventData.title || "This is a Placeholder Title occupying two lines of space"}</div>
      </div>

      <!-- Event Panel Thumbnail (Bottom) -->
      <div class="nzgdc-afternoon-event-panel-thumbnail-main">
        <!-- Session Thumbnail (Background) -->
        <div class="nzgdc-afternoon-session-thumbnail-main"></div>

        <!-- Event Panel Overlay -->
        <div class="nzgdc-afternoon-event-panel-overlay-main">
          <!-- Speaker Details -->
          <div class="nzgdc-afternoon-speaker-details-main">
            <div class="nzgdc-afternoon-speaker-name-main">Presented by ${eventData.speakers?.[0]?.name || "Speaker Name"}</div>
            <div class="nzgdc-afternoon-speaker-position-company-main">${eventData.speakers?.[0]?.position || "Position + Company"}</div>
          </div>

          <!-- Call To Action -->
          <div class="nzgdc-afternoon-call-to-action-main">
            <div class="nzgdc-afternoon-open-marker-main"></div>
            <div class="nzgdc-afternoon-cta-text-main">Click for More Event Details</div>
          </div>
        </div>
      </div>
    `;

    return mainPanel;
  }

  updateEventContent(clone, eventData) {
    this.debug(
      "Updating afternoon event content for:",
      eventData?.title || "Unknown",
    );

    // Direct element queries - more reliable than caching
    const categoryEl = clone.querySelector(".nzgdc-afternoon-category-text-big");
    const titleEl = clone.querySelector(".nzgdc-afternoon-title-text-big");
    const thumbnailEl = clone.querySelector(
      ".nzgdc-afternoon-session-thumbnail-big",
    );
    const timeframeEl = clone.querySelector(
      ".nzgdc-afternoon-timeframe-text-big",
    );
    const speakerContainers = clone.querySelectorAll(
      ".nzgdc-afternoon-speaker-biolines-big",
    );

    // Verify elements found - critical for debugging data population issues
    const elementsFound = {
      category: !!categoryEl,
      title: !!titleEl,
      thumbnail: !!thumbnailEl,
      timeframe: !!timeframeEl,
      speakers: speakerContainers.length,
    };

    this.debug("Afternoon element query results:", elementsFound);

    // Alert if critical elements are missing
    if (
      !categoryEl ||
      !titleEl ||
      !timeframeEl ||
      speakerContainers.length === 0
    ) {
      console.warn(
        "[NZGDC Afternoon Widget] Missing critical template elements:",
        elementsFound,
      );
    }

    // Update category
    if (categoryEl) {
      const categoryText = eventData.category || "Panel";
      categoryEl.textContent = categoryText;
      this.debug("Set afternoon category:", categoryText);
    } else {
      console.warn(
        "[NZGDC Afternoon Widget] Category element not found - check template structure",
      );
    }

    // Update title
    if (titleEl) {
      const titleText = eventData.title || "Panel Session";
      titleEl.textContent = titleText;
      this.debug("Set afternoon title:", titleText);
    } else {
      console.warn(
        "[NZGDC Afternoon Widget] Title element not found - check template structure",
      );
    }

    // Update thumbnail (only if provided)
    if (thumbnailEl && eventData.thumbnail) {
      thumbnailEl.style.backgroundImage = `url('${eventData.thumbnail}')`;
      this.debug("Set afternoon thumbnail:", eventData.thumbnail);
    }

    // Update timeframe
    if (timeframeEl) {
      const timeframeText = eventData.timeframe || "TBA";
      timeframeEl.textContent = timeframeText;
      this.debug("Set afternoon timeframe:", timeframeText);
    } else {
      console.warn(
        "[NZGDC Afternoon Widget] Timeframe element not found - check template structure",
      );
    }

    // Update speakers
    const speakers = eventData.speakers || [
      { name: "TBA", position: "Speaker details coming soon" },
    ];

    this.debug(
      "Processing afternoon speakers:",
      speakers.length,
      "speakers found",
    );

    speakers.forEach((speaker, index) => {
      if (index < speakerContainers.length) {
        const container = speakerContainers[index];
        const nameEl = container.querySelector(
          ".nzgdc-afternoon-speaker-bioName-big",
        );
        const positionEl = container.querySelector(
          ".nzgdc-afternoon-speaker-bioPosition-big",
        );

        if (nameEl) {
          const speakerName = speaker.name || "Speaker TBA";
          nameEl.textContent = speakerName;
          this.debug(`Afternoon speaker ${index + 1} name:`, speakerName);
        } else {
          console.warn(
            `[NZGDC Afternoon Widget] Speaker ${index + 1} name element not found`,
          );
        }

        if (positionEl) {
          const speakerPosition = speaker.position || "Details coming soon";
          positionEl.textContent = speakerPosition;
          this.debug(`Afternoon speaker ${index + 1} position:`, speakerPosition);
        } else {
          console.warn(
            `[NZGDC Afternoon Widget] Speaker ${index + 1} position element not found`,
          );
        }
      }
    });

    // Hide unused speaker containers
    for (let i = speakers.length; i < speakerContainers.length; i++) {
      speakerContainers[i].style.display = "none";
      this.debug(`Hiding unused afternoon speaker container ${i + 1}`);
    }
  }

  createErrorPanel(errorMessage) {
    const errorPanel = document.createElement("div");
    errorPanel.className = "nzgdc-afternoon-error-placeholder";
    errorPanel.innerHTML = `
      <strong>Failed to load afternoon event</strong>
      <small>${errorMessage}</small>
      <small>Please check console for details</small>
    `;
    return errorPanel;
  }

  destroy() {
    this.debug("Destroying AfternoonEventLoader...");

    try {
      this.isDestroyed = true;
      this.template = null;
      this.isLoading = false;
      this.loadError = null;

      this.debug("AfternoonEventLoader destroyed successfully");
    } catch (error) {
      console.error("Error destroying AfternoonEventLoader:", error);
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AfternoonEventLoader;
} else if (typeof window !== "undefined") {
  window.AfternoonEventLoader = AfternoonEventLoader;
}
