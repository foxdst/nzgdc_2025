// NZGDC Schedule Widget - Workshop Event Loader

class WorkshopEventLoader {
  constructor() {
    this.template = null;
    this.isLoading = false;
    this.loadError = null;
    this.REQUEST_TIMEOUT = 10000; // 10 seconds timeout
    this.isDestroyed = false;

    // Debug mode controlled by global NZGDC_DEBUG flag
    this.debugMode = false; // Will be set by debug system if enabled
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
      this.debug("Loading event panel template...");

      // Try to load external template file first
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
        }, this.REQUEST_TIMEOUT);

        const response = await fetch(
          "nzgdc-widget/templates/event-panel.html",
          {
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          this.template = doc.querySelector(".nzgdc-event-panel-big");

          if (this.template) {
            this.debug("External template loaded successfully");
            return this.template;
          }
        }
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          this.debug(
            "External template timeout after",
            this.REQUEST_TIMEOUT + "ms, trying embedded template",
          );
        } else {
          this.debug(
            "External template failed, trying embedded template:",
            fetchError.message,
          );
        }
      }

      // Fallback to embedded template if external file fails
      if (window.EVENT_PANEL_TEMPLATE) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          window.EVENT_PANEL_TEMPLATE,
          "text/html",
        );
        this.template = doc.querySelector(".nzgdc-event-panel-big");

        if (this.template) {
          this.debug("Embedded template loaded successfully");
          return this.template;
        }
      }

      // If we reach here, use the global fallback template that's always set by the loader
      if (window.EVENT_PANEL_TEMPLATE) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(
          window.EVENT_PANEL_TEMPLATE,
          "text/html",
        );
        this.template = doc.querySelector(".nzgdc-event-panel-big");

        if (this.template) {
          this.debug("Using global fallback template");
          return this.template;
        }
      }

      throw new Error("No template available - this should never happen");
    } catch (error) {
      console.error("Failed to load template:", error);
      this.loadError = error;
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // Debug logging helper - checks global debug flag
  debug(...args) {
    if (window.NZGDC_DEBUG === true) {
      console.log("[NZGDC Workshop Loader]", ...args);
    }
  }

  createEventPanel(eventData) {
    if (this.isDestroyed) {
      throw new Error("WorkshopEventLoader has been destroyed");
    }

    if (!this.template) {
      throw new Error("Template not loaded. Call loadTemplate() first.");
    }

    const clone = this.template.cloneNode(true);

    try {
      this.updateEventContentOptimized(clone, eventData);
      return clone;
    } catch (error) {
      console.error("Failed to create event panel:", error, eventData);
      return this.createErrorPanel(error.message);
    }
  }

  updateEventContentOptimized(clone, eventData) {
    this.debug(
      "Updating event content for workshop:",
      eventData?.title || "Unknown",
    );

    // Direct element queries - more reliable than caching
    const categoryEl = clone.querySelector(".nzgdc-category-text-big");
    const titleEl = clone.querySelector(".nzgdc-title-text-big");
    const thumbnailEl = clone.querySelector(".nzgdc-session-thumbnail-big");
    const timeframeEl = clone.querySelector(".nzgdc-timeframe-text-big");
    const speakerContainers = clone.querySelectorAll(
      ".nzgdc-speaker-biolines-big",
    );

    // Verify elements found - critical for debugging data population issues
    const elementsFound = {
      category: !!categoryEl,
      title: !!titleEl,
      thumbnail: !!thumbnailEl,
      timeframe: !!timeframeEl,
      speakers: speakerContainers.length,
    };

    this.debug("Element query results:", elementsFound);

    // Alert if critical elements are missing
    if (
      !categoryEl ||
      !titleEl ||
      !timeframeEl ||
      speakerContainers.length === 0
    ) {
      console.warn(
        "[NZGDC Widget] Missing critical template elements:",
        elementsFound,
      );
    }

    // Update category
    if (categoryEl) {
      const categoryText = eventData.category || "Workshop";
      categoryEl.textContent = categoryText;
      this.debug("Set category:", categoryText);
    } else {
      console.warn(
        "[NZGDC Widget] Category element not found - check template structure",
      );
    }

    // Update title
    if (titleEl) {
      const titleText = eventData.title || "Workshop Session";
      titleEl.textContent = titleText;
      this.debug("Set title:", titleText);
    } else {
      console.warn(
        "[NZGDC Widget] Title element not found - check template structure",
      );
    }

    // Update thumbnail (only if provided)
    if (thumbnailEl && eventData.thumbnail) {
      thumbnailEl.style.backgroundImage = `url('${eventData.thumbnail}')`;
      this.debug("Set thumbnail:", eventData.thumbnail);
    }

    // Update timeframe
    if (timeframeEl) {
      const timeframeText = eventData.timeframe || "TBA";
      timeframeEl.textContent = timeframeText;
      this.debug("Set timeframe:", timeframeText);
    } else {
      console.warn(
        "[NZGDC Widget] Timeframe element not found - check template structure",
      );
    }

    // Update speakers
    const speakers = eventData.speakers || [
      { name: "TBA", position: "Speaker details coming soon" },
    ];

    this.debug("Processing speakers:", speakers.length, "speakers found");

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
          this.debug(`Speaker ${index + 1} name:`, speakerName);
        } else {
          console.warn(
            `[NZGDC Widget] Speaker ${index + 1} name element not found`,
          );
        }

        if (positionEl) {
          const speakerPosition = speaker.position || "Details coming soon";
          positionEl.textContent = speakerPosition;
          this.debug(`Speaker ${index + 1} position:`, speakerPosition);
        } else {
          console.warn(
            `[NZGDC Widget] Speaker ${index + 1} position element not found`,
          );
        }
      }
    });

    // Hide unused speaker containers
    for (let i = speakers.length; i < speakerContainers.length; i++) {
      speakerContainers[i].style.display = "none";
      this.debug(`Hiding unused speaker container ${i + 1}`);
    }
  }

  createErrorPanel(errorMessage) {
    const errorPanel = document.createElement("div");
    errorPanel.className = "nzgdc-error-placeholder";
    errorPanel.innerHTML = `
            <strong>Failed to load workshop</strong>
            <small>${errorMessage}</small>
            <small>Please check console for details</small>
        `;
    return errorPanel;
  }

  destroy() {
    console.log("Destroying WorkshopEventLoader...");

    try {
      this.isDestroyed = true;
      this.template = null;
      this.isLoading = false;
      this.loadError = null;

      this.debug("WorkshopEventLoader destroyed successfully");
    } catch (error) {
      console.error("Error destroying WorkshopEventLoader:", error);
    }
  }
}

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = WorkshopEventLoader;
} else if (typeof window !== "undefined") {
  window.WorkshopEventLoader = WorkshopEventLoader;
}
