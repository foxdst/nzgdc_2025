// NZGDC Morning Schedule Widget - Morning Event Loader

class MorningEventLoader {
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
      this.debug("Loading morning event panel template...");

      // Try to load external template file first
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, this.REQUEST_TIMEOUT);

        const response = await fetch(
          "nzgdc-widget/templates/morning-event-panel.html",
          {
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          this.template = doc.querySelector(".nzgdc-morning-event-panel-big");

          if (this.template) {
            this.debug("External morning template loaded successfully");
            return this.template;
          }
        }
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          this.debug(
            "External morning template timeout after",
            this.REQUEST_TIMEOUT + "ms, trying embedded template",
          );
        } else {
          this.debug(
            "External morning template failed, trying embedded template:",
            fetchError.message,
          );
        }
      }

      // Fallback to embedded template if external file fails
      if (window.MORNING_EVENT_PANEL_TEMPLATE) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          window.MORNING_EVENT_PANEL_TEMPLATE,
          "text/html",
        );
        this.template = doc.querySelector(".nzgdc-morning-event-panel-big");

        if (this.template) {
          this.debug("Embedded morning template loaded successfully");
          return this.template;
        }
      }

      throw new Error(
        "No morning template available - this should never happen",
      );
    } catch (error) {
      console.error("Failed to load morning template:", error);
      this.loadError = error;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Morning Event Loader]", ...args);
    }
  }

  createEventPanel(eventData, eventType = "big") {
    if (this.isDestroyed) {
      throw new Error("MorningEventLoader has been destroyed");
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
      console.error("Failed to create morning event panel:", error, eventData);
      return this.createErrorPanel(error.message);
    }
  }

  // Create main event panel (square format) - matches eventPanel_Main.html exactly
  createMainEventPanel(eventData) {
    const mainPanel = document.createElement("div");
    mainPanel.className = "nzgdc-event-panel-main";

    mainPanel.innerHTML = `
      <!-- Event Category (Top) -->
      <div class="nzgdc-event-category-main">
        <div class="nzgdc-category-text-main">${eventData.category || "Story & Narrative"}</div>
      </div>

      <!-- Event Panel Title (Middle) -->
      <div class="nzgdc-event-panel-title-main">
        <div class="nzgdc-title-text-main">${eventData.title || "This is a Placeholder Title occupying two lines of space"}</div>
      </div>

      <!-- Event Panel Thumbnail (Bottom) -->
      <div class="nzgdc-event-panel-thumbnail-main">
        <!-- Session Thumbnail (Background) -->
        <div class="nzgdc-session-thumbnail-main"></div>

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

  updateEventContent(clone, eventData) {
    this.debug(
      "Updating morning event content for:",
      eventData?.title || "Unknown",
    );

    // Direct element queries - more reliable than caching
    const categoryEl = clone.querySelector(".nzgdc-morning-category-text-big");
    const titleEl = clone.querySelector(".nzgdc-morning-title-text-big");
    const thumbnailEl = clone.querySelector(
      ".nzgdc-morning-session-thumbnail-big",
    );
    const timeframeEl = clone.querySelector(
      ".nzgdc-morning-timeframe-text-big",
    );
    const speakerContainers = clone.querySelectorAll(
      ".nzgdc-morning-speaker-biolines-big",
    );

    // Verify elements found - critical for debugging data population issues
    const elementsFound = {
      category: !!categoryEl,
      title: !!titleEl,
      thumbnail: !!thumbnailEl,
      timeframe: !!timeframeEl,
      speakers: speakerContainers.length,
    };

    this.debug("Morning element query results:", elementsFound);

    // Alert if critical elements are missing
    if (
      !categoryEl ||
      !titleEl ||
      !timeframeEl ||
      speakerContainers.length === 0
    ) {
      console.warn(
        "[NZGDC Morning Widget] Missing critical template elements:",
        elementsFound,
      );
    }

    // Update category
    if (categoryEl) {
      const categoryText = eventData.category || "Panel";
      categoryEl.textContent = categoryText;
      this.debug("Set morning category:", categoryText);
    } else {
      console.warn(
        "[NZGDC Morning Widget] Category element not found - check template structure",
      );
    }

    // Update title
    if (titleEl) {
      const titleText = eventData.title || "Panel Session";
      titleEl.textContent = titleText;
      this.debug("Set morning title:", titleText);
    } else {
      console.warn(
        "[NZGDC Morning Widget] Title element not found - check template structure",
      );
    }

    // Update thumbnail (only if provided)
    if (thumbnailEl && eventData.thumbnail) {
      thumbnailEl.style.backgroundImage = `url('${eventData.thumbnail}')`;
      this.debug("Set morning thumbnail:", eventData.thumbnail);
    }

    // Update timeframe
    if (timeframeEl) {
      const timeframeText = eventData.timeframe || "TBA";
      timeframeEl.textContent = timeframeText;
      this.debug("Set morning timeframe:", timeframeText);
    } else {
      console.warn(
        "[NZGDC Morning Widget] Timeframe element not found - check template structure",
      );
    }

    // Update speakers
    const speakers = eventData.speakers || [
      { name: "TBA", position: "Speaker details coming soon" },
    ];

    this.debug(
      "Processing morning speakers:",
      speakers.length,
      "speakers found",
    );

    speakers.forEach((speaker, index) => {
      if (index < speakerContainers.length) {
        const container = speakerContainers[index];
        const nameEl = container.querySelector(
          ".nzgdc-morning-speaker-bioName-big",
        );
        const positionEl = container.querySelector(
          ".nzgdc-morning-speaker-bioPosition-big",
        );

        if (nameEl) {
          const speakerName = speaker.name || "Speaker TBA";
          nameEl.textContent = speakerName;
          this.debug(`Morning speaker ${index + 1} name:`, speakerName);
        } else {
          console.warn(
            `[NZGDC Morning Widget] Speaker ${index + 1} name element not found`,
          );
        }

        if (positionEl) {
          const speakerPosition = speaker.position || "Details coming soon";
          positionEl.textContent = speakerPosition;
          this.debug(`Morning speaker ${index + 1} position:`, speakerPosition);
        } else {
          console.warn(
            `[NZGDC Morning Widget] Speaker ${index + 1} position element not found`,
          );
        }
      }
    });

    // Hide unused speaker containers
    for (let i = speakers.length; i < speakerContainers.length; i++) {
      speakerContainers[i].style.display = "none";
      this.debug(`Hiding unused morning speaker container ${i + 1}`);
    }
  }

  createErrorPanel(errorMessage) {
    const errorPanel = document.createElement("div");
    errorPanel.className = "nzgdc-morning-error-placeholder";
    errorPanel.innerHTML = `
      <strong>Failed to load morning event</strong>
      <small>${errorMessage}</small>
      <small>Please check console for details</small>
    `;
    return errorPanel;
  }

  destroy() {
    this.debug("Destroying MorningEventLoader...");

    try {
      this.isDestroyed = true;
      this.template = null;
      this.isLoading = false;
      this.loadError = null;

      this.debug("MorningEventLoader destroyed successfully");
    } catch (error) {
      console.error("Error destroying MorningEventLoader:", error);
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = MorningEventLoader;
} else if (typeof window !== "undefined") {
  window.MorningEventLoader = MorningEventLoader;
}
