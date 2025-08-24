/* NZGDC Expanded Event Details Manager */
/* Phase 1 Implementation - Complete overlay lifecycle management */
/* Handles showing/hiding expanded event details with proper data mapping */

class ExpandedEventDetailsManager {
  constructor(config = {}) {
    this.overlayContainer = null;
    this.currentEventData = null;
    this.isOverlayVisible = false;
    this.templateLoaded = false;
    this.isDestroyed = false;
    this.debugMode = false;
    this.templateLoading = false;

    // Configuration with defaults - use global config if available
    this.config = {
      basePath:
        config.basePath ||
        (window.NZGDC_CONFIG && window.NZGDC_CONFIG.basePath) ||
        this.detectBasePath(),
      ...config,
    };

    // Event listeners for cleanup
    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
    this.boundBackdropClickHandler = this.handleBackdropClick.bind(this);
    this.boundCloseButtonHandler = this.hideEventDetails.bind(this);
    this.boundResizeHandler = this.handleResize.bind(this);

    // Initialize debug mode
    this.debugMode =
      localStorage.getItem("nzgdc-expanded-details-debug") === "true" ||
      window.NZGDC_DEBUG === true;
    this.debug(
      "ExpandedEventDetailsManager initialized with config:",
      this.config,
    );
  }

  // Detect base path using same logic as widget loaders
  detectBasePath() {
    const currentPath = window.location.pathname;
    return currentPath.includes("/.widget-tests/") ? "../" : "";
  }

  // Debug logging
  debug(message, ...args) {
    if (this.debugMode) {
      console.log(`[ExpandedEventDetailsManager] ${message}`, ...args);
    }
  }

  // Load overlay template from templates directory
  async loadTemplate() {
    if (this.templateLoaded || this.isDestroyed) {
      this.debug("Template already loaded or manager destroyed");
      return;
    }

    if (this.templateLoading) {
      this.debug("Template already loading, waiting...");
      // Wait for the current loading operation to complete
      while (
        this.templateLoading &&
        !this.templateLoaded &&
        !this.isDestroyed
      ) {
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      return;
    }

    try {
      this.templateLoading = true;
      this.debug("Loading expanded event details template...");

      // Try to load template from templates directory
      let templateHTML = "";

      if (window.EXPANDED_EVENT_DETAILS_TEMPLATE) {
        // Use cached template if available
        templateHTML = window.EXPANDED_EVENT_DETAILS_TEMPLATE;
        this.debug("Using cached template");
      } else {
        // Try to fetch template
        try {
          const templatePath =
            this.config.basePath +
            "templates/expanded-event-details-overlay.html";
          this.debug("Loading template from:", templatePath);
          const response = await fetch(templatePath);
          if (response.ok) {
            templateHTML = await response.text();
            window.EXPANDED_EVENT_DETAILS_TEMPLATE = templateHTML; // Cache it
            this.debug("Template loaded from file");
          } else {
            throw new Error("Template fetch failed");
          }
        } catch (fetchError) {
          this.debug("Template fetch failed, using inline template");
          // Fallback to inline template
          templateHTML = this.getInlineTemplate();
        }
      }

      // Create overlay container and inject template
      this.overlayContainer = document.createElement("div");
      this.overlayContainer.innerHTML = templateHTML;

      // Get the actual overlay element
      const overlayElement = this.overlayContainer.querySelector(
        ".nzgdc-expanded-event-overlay",
      );
      if (!overlayElement) {
        throw new Error("Overlay element not found in template");
      }

      // Append to body
      document.body.appendChild(overlayElement);
      this.overlayContainer = overlayElement;

      this.debug(
        "Overlay element appended to body, overlayContainer set:",
        this.overlayContainer,
      );

      // Setup event listeners
      this.setupEventListeners();

      this.templateLoaded = true;
      this.debug("Template loaded and event listeners attached");
    } catch (error) {
      console.error(
        "[ExpandedEventDetailsManager] Failed to load template:",
        error,
      );
      this.templateLoaded = false;
      this.overlayContainer = null;
      throw error;
    } finally {
      this.templateLoading = false;
    }
  }

  // Fallback inline template
  getInlineTemplate() {
    return `
      <div class="nzgdc-expanded-event-overlay" id="nzgdc-expanded-event-overlay">
        <div class="nzgdc-expanded-event-backdrop"></div>
        <div class="nzgdc-expanded-event-modal">
          <button class="nzgdc-modal-close" aria-label="Close event details">×</button>
          <div class="nzgdc-event-header">
            <div class="nzgdc-event-title-expanded">
              <h1 class="nzgdc-title-text-expanded" id="expanded-event-title">Event Title</h1>
            </div>
            <div class="nzgdc-event-speakers-list" id="expanded-speakers-list"></div>
          </div>
          <div class="nzgdc-expanded-event-description">
            <div class="nzgdc-event-synopsis">
              <div class="nzgdc-synopsis-text" id="expanded-event-synopsis"></div>
            </div>
            <hr class="nzgdc-content-separator">
            <div class="nzgdc-audience-section">
              <div class="nzgdc-audience-label">Intended Audience:</div>
              <div class="nzgdc-audience-tags" id="expanded-audience-tags"></div>
            </div>
          </div>
          <div class="nzgdc-speaker-bios" id="expanded-speaker-bios">
            <div class="nzgdc-mobile-speaker-bio-header" style="display: none;">
              <h3>Speaker Details</h3>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Setup event listeners for overlay interaction
  setupEventListeners() {
    if (!this.overlayContainer) {
      this.debug("No overlay container available for event listeners");
      return;
    }

    // Close button
    const closeButton =
      this.overlayContainer.querySelector(".nzgdc-modal-close");
    if (closeButton) {
      closeButton.addEventListener("click", this.boundCloseButtonHandler);
    }

    // Backdrop click to close
    const backdrop = this.overlayContainer.querySelector(
      ".nzgdc-expanded-event-backdrop",
    );
    if (backdrop) {
      backdrop.addEventListener("click", this.boundBackdropClickHandler);
    }

    // Keyboard events (ESC to close)
    document.addEventListener("keydown", this.boundKeyDownHandler);

    // Window resize for responsive adjustments
    window.addEventListener("resize", this.boundResizeHandler);

    this.debug("Event listeners attached");
  }

  // Handle keyboard events
  handleKeyDown(event) {
    if (this.isOverlayVisible && event.key === "Escape") {
      event.preventDefault();
      this.hideEventDetails();
    }
  }

  // Handle backdrop clicks
  handleBackdropClick(event) {
    if (event.target.classList.contains("nzgdc-expanded-event-backdrop")) {
      this.hideEventDetails();
    }
  }

  // Handle window resize
  handleResize() {
    if (this.isOverlayVisible) {
      this.adjustForMobile();
    }
  }

  // Main entry point for showing overlay
  async showEventDetails(eventData, sourceWidget = "unknown") {
    if (this.isDestroyed) {
      this.debug("Manager destroyed, cannot show event details");
      return;
    }

    try {
      this.debug(
        "Showing event details for:",
        eventData.title,
        "from:",
        sourceWidget,
      );

      // Ensure template is loaded
      if (!this.templateLoaded) {
        this.debug("Template not loaded, calling loadTemplate()");
        await this.loadTemplate();
        this.debug(
          "loadTemplate() completed, overlayContainer:",
          this.overlayContainer,
        );
      }

      // Recreate overlay if it was removed from DOM
      if (
        !this.overlayContainer ||
        !document.body.contains(this.overlayContainer)
      ) {
        this.debug("Overlay container missing from DOM, recreating...");
        await this.loadTemplate();
        this.debug(
          "Overlay recreated, overlayContainer:",
          this.overlayContainer,
        );
      }

      // Final safety check to ensure overlay container is ready
      if (!this.overlayContainer) {
        throw new Error(
          "Failed to initialize overlay container after template loading",
        );
      }

      // Validate event data
      if (!this.validateEventData(eventData)) {
        throw new Error("Invalid event data provided");
      }

      // Store current event data
      this.currentEventData = eventData;

      // Populate overlay content
      this.populateEventContent(eventData);

      // Show overlay with animation
      this.showOverlayWithAnimation();

      // Adjust for mobile if needed
      this.adjustForMobile();

      this.isOverlayVisible = true;
      this.debug("Event details overlay shown successfully");
    } catch (error) {
      console.error(
        "[ExpandedEventDetailsManager] Failed to show event details:",
        error,
      );
      this.hideEventDetails(); // Cleanup on error
    }
  }

  // Validate event data structure
  validateEventData(eventData) {
    if (!eventData || typeof eventData !== "object") {
      this.debug("Event data is not an object");
      return false;
    }

    // Required fields
    if (!eventData.title) {
      this.debug("Event data missing title");
      return false;
    }

    // Speakers should be an array (can be empty)
    if (eventData.speakers && !Array.isArray(eventData.speakers)) {
      this.debug("Event speakers is not an array");
      return false;
    }

    return true;
  }

  // Populate overlay content with event data
  populateEventContent(eventData) {
    if (!this.overlayContainer) {
      throw new Error("Overlay container not available");
    }

    // Adapt event data to standard format
    const standardData = this.adaptEventData(eventData);

    // Populate title
    this.populateTitle(standardData.title);

    // Populate speakers list
    this.populateSpeakersList(standardData.speakers);

    // Populate description/synopsis
    this.populateDescription(standardData.description);

    // Populate audience tags
    this.populateAudienceTags(standardData.audienceTags);

    // Populate speaker bios
    this.populateSpeakerBios(standardData.speakers);

    this.debug("Content populated successfully");
  }

  // Adapt different widget event data formats to standard format
  adaptEventData(eventData) {
    return {
      title: eventData.title || "Event Title",
      description:
        eventData.description ||
        eventData.synopsis ||
        eventData.copy ||
        "Event description not available.",
      speakers: this.adaptSpeakerData(eventData.speakers || []),
      audienceTags: this.extractAudienceTags(eventData),
      category: eventData.category || eventData.categoryKey || "Event",
      timeframe: eventData.timeframe || "",
      thumbnail: eventData.thumbnail || null,
    };
  }

  // Adapt speaker data to standard format
  adaptSpeakerData(speakers) {
    if (!Array.isArray(speakers)) {
      return [];
    }

    return speakers.map((speaker) => ({
      name: speaker.displayName || speaker.name || "Speaker Name",
      position: speaker.position || speaker.title || "Position",
      bio:
        speaker.bio ||
        speaker.description ||
        speaker.copy ||
        "Speaker bio not available.",
      email: speaker.email || null,
      website: speaker.website || null,
      headshot:
        speaker.headshot || speaker.image || speaker.speakerImage || null,
    }));
  }

  // Extract audience tags from event data
  extractAudienceTags(eventData) {
    // Try different possible sources for audience tags
    if (eventData.audienceTags && Array.isArray(eventData.audienceTags)) {
      return eventData.audienceTags;
    }

    if (eventData.audience && Array.isArray(eventData.audience)) {
      return eventData.audience;
    }

    // Handle Friday/Saturday API categories array
    if (eventData.categories && Array.isArray(eventData.categories)) {
      return eventData.categories.map((cat) => cat.name || cat);
    }

    if (eventData.category) {
      return [eventData.category];
    }

    if (eventData.categoryKey) {
      return [eventData.categoryKey];
    }

    return ["EVERYONE"]; // Default fallback
  }

  // Populate event title
  populateTitle(title) {
    const titleElement = this.overlayContainer.querySelector(
      "#expanded-event-title",
    );
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  // Populate speakers list in header
  populateSpeakersList(speakers) {
    const speakersListElement = this.overlayContainer.querySelector(
      "#expanded-speakers-list",
    );
    if (!speakersListElement) return;

    speakersListElement.innerHTML = "";

    if (speakers.length === 0) {
      speakersListElement.innerHTML =
        '<div class="nzgdc-speaker-name-item">Speaker information not available</div>';
      return;
    }

    speakers.forEach((speaker, index) => {
      const speakerItem = document.createElement("div");
      speakerItem.className = "nzgdc-speaker-name-item";
      speakerItem.textContent =
        speaker.displayName || speaker.name || "Speaker TBA";
      speakersListElement.appendChild(speakerItem);
    });
  }

  // Populate event description
  populateDescription(description) {
    const descriptionElement = this.overlayContainer.querySelector(
      "#expanded-event-synopsis",
    );
    if (descriptionElement) {
      descriptionElement.innerHTML = description;
    }
  }

  // Populate audience tags
  populateAudienceTags(audienceTags) {
    const audienceTagsElement = this.overlayContainer.querySelector(
      "#expanded-audience-tags",
    );
    if (!audienceTagsElement) return;

    audienceTagsElement.innerHTML = "";

    audienceTags.forEach((tag) => {
      const tagElement = document.createElement("div");
      tagElement.className = "nzgdc-audience-tag";

      // Add specific class for tag type
      const tagClass = this.getAudienceTagClass(tag);
      if (tagClass) {
        tagElement.classList.add(tagClass);
      }

      tagElement.textContent = this.formatAudienceTag(tag);
      audienceTagsElement.appendChild(tagElement);
    });
  }

  // Get CSS class for audience tag
  getAudienceTagClass(tag) {
    const tagKey = tag.toLowerCase();

    if (tagKey.includes("writer") || tagKey.includes("narrative")) {
      return "writers";
    }

    return "everyone"; // Default
  }

  // Format audience tag for display
  formatAudienceTag(tag) {
    // Convert category keys to display names
    const displayNames = {
      WRITERS: "Writers",
      PROGRAMMING: "Programming",
      ART: "Art & Design",
      BUSINESS: "Business",
      EVERYONE: "Everyone",
      STUDENTS: "Students",
      INDIE: "Indie Developers",
    };

    return displayNames[tag] || tag;
  }

  // Populate speaker bio cards
  populateSpeakerBios(speakers) {
    const speakerBiosElement = this.overlayContainer.querySelector(
      "#expanded-speaker-bios",
    );
    if (!speakerBiosElement) return;

    // Clear existing content
    speakerBiosElement.innerHTML = "";

    // Create single mobile header for all speakers
    const mobileHeader = document.createElement("div");
    mobileHeader.className = "nzgdc-mobile-speaker-bio-header";
    mobileHeader.style.display = "none"; // Will be shown by CSS at mobile breakpoints

    const headerTitle = document.createElement("h3");
    // Use singular/plural based on speaker count as discussed in conversation
    headerTitle.textContent =
      speakers.length === 1 ? "Speaker Bio" : "Speaker Bios";
    mobileHeader.appendChild(headerTitle);
    speakerBiosElement.appendChild(mobileHeader);

    if (speakers.length === 0) {
      const noSpeakersMessage = document.createElement("div");
      noSpeakersMessage.style.padding = "20px";
      noSpeakersMessage.style.textAlign = "center";
      noSpeakersMessage.style.color = "#666";
      noSpeakersMessage.textContent = "Speaker information not available";
      speakerBiosElement.appendChild(noSpeakersMessage);
      return;
    }

    speakers.forEach((speaker) => {
      const bioCard = this.createSpeakerBioCard(speaker);
      speakerBiosElement.appendChild(bioCard);
    });
  }

  // Create speaker bio card element
  createSpeakerBioCard(speaker) {
    const bioCard = document.createElement("div");
    bioCard.className = "nzgdc-speaker-bio-card";

    // Create headshot section
    const headshotDiv = document.createElement("div");
    headshotDiv.className = "nzgdc-speaker-headshot";

    if (speaker.headshot) {
      const img = document.createElement("img");
      img.src = speaker.headshot;
      img.alt = speaker.displayName || speaker.name || "Speaker";
      headshotDiv.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "nzgdc-speaker-headshot-placeholder";
      placeholder.textContent = "No Photo Available";
      headshotDiv.appendChild(placeholder);
    }

    // Create bio content section
    const bioContent = document.createElement("div");
    bioContent.className = "nzgdc-speaker-bio-content";

    // Bio header (desktop only - mobile uses single header)
    const bioHeader = document.createElement("div");
    bioHeader.className = "nzgdc-speaker-bio-header";

    const headerText = document.createElement("div");
    headerText.className = "nzgdc-bio-header-text";
    headerText.textContent = "Speaker Bio";
    bioHeader.appendChild(headerText);

    // Bio details
    const bioDetails = document.createElement("div");
    bioDetails.className = "nzgdc-speaker-bio-details";

    const speakerInfoTop = document.createElement("div");
    speakerInfoTop.className = "nzgdc-speaker-info-top";

    const descriptionContainer = document.createElement("div");
    descriptionContainer.className = "nzgdc-speaker-description-container";

    // Speaker name
    const nameDiv = document.createElement("div");
    nameDiv.className = "nzgdc-expanded-speaker-name";
    nameDiv.textContent = speaker.displayName || speaker.name || "Speaker Name";

    // Speaker position
    const positionDiv = document.createElement("div");
    positionDiv.className = "nzgdc-expanded-speaker-position";
    positionDiv.textContent = speaker.position || "Position";

    // Speaker bio description
    const descriptionDiv = document.createElement("div");
    descriptionDiv.className = "nzgdc-expanded-speaker-description";
    descriptionDiv.innerHTML = speaker.bio || "Bio information not available";

    // Contact information
    const contactDiv = document.createElement("div");
    contactDiv.className = "nzgdc-expanded-speaker-contact";

    if (speaker.email) {
      const emailLink = document.createElement("a");
      emailLink.className = "nzgdc-contact-email";
      emailLink.href = `mailto:${speaker.email}`;
      emailLink.textContent = speaker.email;
      contactDiv.appendChild(emailLink);
    }

    if (speaker.website) {
      const websiteLink = document.createElement("a");
      websiteLink.className = "nzgdc-contact-website";
      websiteLink.href = speaker.website.startsWith("http")
        ? speaker.website
        : `https://${speaker.website}`;
      websiteLink.target = "_blank";
      websiteLink.rel = "noopener noreferrer";
      websiteLink.textContent = speaker.website;
      contactDiv.appendChild(websiteLink);
    }

    // Assemble the structure
    descriptionContainer.appendChild(nameDiv);
    descriptionContainer.appendChild(positionDiv);
    descriptionContainer.appendChild(descriptionDiv);
    descriptionContainer.appendChild(contactDiv);

    speakerInfoTop.appendChild(descriptionContainer);
    bioDetails.appendChild(speakerInfoTop);
    bioContent.appendChild(bioHeader);
    bioContent.appendChild(bioDetails);

    bioCard.appendChild(headshotDiv);
    bioCard.appendChild(bioContent);

    return bioCard;
  }

  // Show overlay with smooth animation
  showOverlayWithAnimation() {
    if (!this.overlayContainer) return;

    // Show overlay
    this.overlayContainer.style.display = "block";

    // Trigger animation after DOM update
    requestAnimationFrame(() => {
      this.overlayContainer.classList.add("visible");
    });

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  // Hide overlay with animation
  hideEventDetails() {
    if (!this.isOverlayVisible || !this.overlayContainer) {
      return;
    }

    this.debug("Hiding event details overlay");

    // Start hide animation
    this.overlayContainer.classList.remove("visible");

    // Wait for animation to complete, then hide
    setTimeout(() => {
      if (this.overlayContainer) {
        this.overlayContainer.style.display = "none";

        // CRITICAL: Remove the overlay completely from DOM to prevent click blocking
        if (this.overlayContainer.parentNode) {
          this.overlayContainer.parentNode.removeChild(this.overlayContainer);
        }

        this.overlayContainer = null;
        this.templateLoaded = false; // Reset flag so template gets reloaded next time
        this.templateLoading = false;
      }

      // Restore body scroll
      document.body.style.overflow = "";

      this.isOverlayVisible = false;
      this.currentEventData = null;

      this.debug("Event details overlay hidden");
    }, 300); // Match CSS transition duration
  }

  // Adjust layout for mobile devices
  adjustForMobile() {
    if (!this.overlayContainer) return;

    const isMobileOrTablet = window.innerWidth <= 768;
    const mobileHeader = this.overlayContainer.querySelector(
      ".nzgdc-mobile-speaker-bio-header",
    );

    if (mobileHeader) {
      mobileHeader.style.display = isMobileOrTablet ? "block" : "none";
    }

    // Additional mobile adjustments could go here
    this.debug("Mobile layout adjusted, mobile mode:", isMobileOrTablet);
  }

  // Get current status for debugging
  getStatus() {
    return {
      templateLoaded: this.templateLoaded,
      isOverlayVisible: this.isOverlayVisible,
      isDestroyed: this.isDestroyed,
      currentEvent: this.currentEventData ? this.currentEventData.title : null,
      debugMode: this.debugMode,
    };
  }

  // Clean up event listeners and remove overlay
  destroy() {
    this.debug("Destroying ExpandedEventDetailsManager");

    // Remove event listeners
    document.removeEventListener("keydown", this.boundKeyDownHandler);
    window.removeEventListener("resize", this.boundResizeHandler);

    // Hide overlay if visible
    if (this.isOverlayVisible) {
      this.hideEventDetails();
    }

    // Remove overlay from DOM
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
    }

    // Reset state
    this.overlayContainer = null;
    this.currentEventData = null;
    this.isOverlayVisible = false;
    this.templateLoaded = false;
    this.templateLoading = false;
    this.isDestroyed = true;

    this.debug("ExpandedEventDetailsManager destroyed");
  }
}

// Export for module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = ExpandedEventDetailsManager;
} else if (
  typeof window !== "undefined" &&
  !window.ExpandedEventDetailsManager
) {
  window.ExpandedEventDetailsManager = ExpandedEventDetailsManager;
}
