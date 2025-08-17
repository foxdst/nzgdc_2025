// NZGDC Thumbnail Z-Index Debug Script
// This script monitors and debugs z-index changes on thumbnail elements

(function () {
  "use strict";

  console.log(
    "%c[THUMBNAIL DEBUG] Starting z-index monitoring",
    "color: red; font-weight: bold",
  );

  // Function to check z-index of thumbnail elements
  function checkThumbnailZIndex() {
    const thumbnailElements = document.querySelectorAll(
      ".nzgdc-session-thumbnail-big, .nzgdc-session-thumbnail-main",
    );

    thumbnailElements.forEach((element, index) => {
      const computedStyle = window.getComputedStyle(element);
      const zIndex = computedStyle.zIndex;
      const inlineZIndex = element.style.zIndex;

      console.log(
        `%c[THUMBNAIL DEBUG] Element ${index + 1}:`,
        "color: blue; font-weight: bold",
      );
      console.log(`  Class: ${element.className}`);
      console.log(`  Computed z-index: ${zIndex}`);
      console.log(`  Inline z-index: ${inlineZIndex || "none"}`);
      console.log(`  Element:`, element);

      // Check if z-index is problematic
      if (zIndex === "-1" || inlineZIndex === "-1") {
        console.error(
          `%c[THUMBNAIL DEBUG] FOUND PROBLEMATIC Z-INDEX!`,
          "color: red; font-weight: bold; background: yellow",
        );
        console.error(`  Element with z-index -1:`, element);
        console.error(`  Computed style:`, computedStyle);
        console.error(`  All inline styles:`, element.style.cssText);

        // AUTOMATICALLY FIX IT IMMEDIATELY
        console.warn(
          `%c[THUMBNAIL DEBUG] AUTO-FIXING z-index for element`,
          "color: green; font-weight: bold",
        );
        element.style.zIndex = "0";
        element.style.setProperty("z-index", "0", "important");

        // Verify the fix
        const newZIndex = window.getComputedStyle(element).zIndex;
        console.log(
          `%c[THUMBNAIL DEBUG] After fix - computed z-index: ${newZIndex}`,
          "color: green",
        );
      }
    });

    return thumbnailElements.length;
  }

  // Function to monitor for new thumbnail elements
  function startMonitoring() {
    // Initial check
    console.log(
      `%c[THUMBNAIL DEBUG] Initial check found ${checkThumbnailZIndex()} thumbnail elements`,
      "color: green",
    );

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver(function (mutations) {
      let foundChanges = false;

      mutations.forEach(function (mutation) {
        // Check for added nodes
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Check if the added node is a thumbnail or contains thumbnails
              const thumbnails =
                node.matches &&
                node.matches(
                  ".nzgdc-session-thumbnail-big, .nzgdc-session-thumbnail-main",
                )
                  ? [node]
                  : node.querySelectorAll &&
                    node.querySelectorAll(
                      ".nzgdc-session-thumbnail-big, .nzgdc-session-thumbnail-main",
                    );

              if (thumbnails && thumbnails.length > 0) {
                console.log(
                  `%c[THUMBNAIL DEBUG] New thumbnail elements added to DOM`,
                  "color: orange; font-weight: bold",
                );
                foundChanges = true;

                // Immediately force-fix any new thumbnails
                Array.from(thumbnails).forEach((thumb) => {
                  thumb.style.zIndex = "0";
                  thumb.style.setProperty("z-index", "0", "important");
                });

                setTimeout(checkThumbnailZIndex, 100); // Small delay to let styles apply
              }
            }
          });
        }

        // Check for attribute changes (including style changes)
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          const element = mutation.target;
          if (
            element.matches &&
            element.matches(
              ".nzgdc-session-thumbnail-big, .nzgdc-session-thumbnail-main",
            )
          ) {
            console.log(
              `%c[THUMBNAIL DEBUG] Style attribute changed on thumbnail element`,
              "color: orange; font-weight: bold",
            );
            console.log(`  Element:`, element);
            console.log(`  New style:`, element.style.cssText);
            foundChanges = true;
            setTimeout(checkThumbnailZIndex, 10);
          }
        }
      });
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    console.log("%c[THUMBNAIL DEBUG] MutationObserver started", "color: green");

    // One-time periodic check after widget loading completes, then stop
    let periodicCheckCount = 0;
    const maxPeriodicChecks = 5; // Only check 5 times max

    const periodicInterval = setInterval(function () {
      periodicCheckCount++;
      const fixedCount = fixZIndexIssues();

      if (fixedCount > 0) {
        console.log(
          `%c[THUMBNAIL DEBUG] Periodic check ${periodicCheckCount}/${maxPeriodicChecks} - fixed ${fixedCount} elements`,
          "color: orange",
        );
      }

      // Stop periodic checks after max attempts or if no thumbnails need fixing
      if (periodicCheckCount >= maxPeriodicChecks) {
        clearInterval(periodicInterval);
        console.log(
          `%c[THUMBNAIL DEBUG] Periodic checks completed - monitoring via MutationObserver only`,
          "color: green; font-weight: bold",
        );
      }
    }, 1000); // Check every 1 second instead of 2, but only 5 times total
  }

  // Function to fix z-index issues when found
  function fixZIndexIssues() {
    const problematicElements = document.querySelectorAll(
      ".nzgdc-session-thumbnail-big, .nzgdc-session-thumbnail-main",
    );
    let fixedCount = 0;

    problematicElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const zIndex = computedStyle.zIndex;
      const inlineZIndex = element.style.zIndex;

      if (zIndex === "-1" || inlineZIndex === "-1") {
        console.log(
          `%c[THUMBNAIL DEBUG] Fixing z-index for element`,
          "color: green; font-weight: bold",
        );
        element.style.zIndex = "0";
        element.style.setProperty("z-index", "0", "important");
        fixedCount++;
      } else if (zIndex !== "0") {
        // Also fix any other non-zero z-index values
        console.log(
          `%c[THUMBNAIL DEBUG] Normalizing z-index (was: ${zIndex})`,
          "color: orange; font-weight: bold",
        );
        element.style.zIndex = "0";
        element.style.setProperty("z-index", "0", "important");
        fixedCount++;
      }
    });

    if (fixedCount > 0) {
      console.log(
        `%c[THUMBNAIL DEBUG] Fixed z-index for ${fixedCount} elements`,
        "color: green; font-weight: bold",
      );
    }

    return fixedCount;
  }

  // Function to get CSS rules affecting thumbnail elements
  function debugCSSRules() {
    console.log(
      "%c[THUMBNAIL DEBUG] Analyzing CSS rules affecting thumbnails",
      "color: purple; font-weight: bold",
    );

    const selectors = [
      ".nzgdc-session-thumbnail-big",
      ".nzgdc-session-thumbnail-main",
    ];

    selectors.forEach((selector) => {
      console.log(
        `%c[THUMBNAIL DEBUG] Rules for ${selector}:`,
        "color: purple",
      );

      // Check all stylesheets
      Array.from(document.styleSheets).forEach((stylesheet, sheetIndex) => {
        try {
          Array.from(stylesheet.cssRules || stylesheet.rules || []).forEach(
            (rule, ruleIndex) => {
              if (
                rule.selectorText &&
                rule.selectorText.includes(selector.replace(".", ""))
              ) {
                console.log(
                  `  Sheet ${sheetIndex}, Rule ${ruleIndex}:`,
                  rule.cssText,
                );

                if (rule.style && rule.style.zIndex) {
                  console.log(`    z-index: ${rule.style.zIndex}`);
                }
              }
            },
          );
        } catch (e) {
          console.log(
            `  Sheet ${sheetIndex}: Cannot access rules (CORS)`,
            stylesheet.href,
          );
        }
      });
    });
  }

  // Immediate fix for any existing elements with multiple attempts
  let initialFixAttempts = 0;
  const maxInitialAttempts = 3;

  function performInitialFix() {
    initialFixAttempts++;
    console.log(
      `%c[THUMBNAIL DEBUG] Initial z-index fix sweep (attempt ${initialFixAttempts}/${maxInitialAttempts})`,
      "color: blue; font-weight: bold",
    );

    const fixedCount = fixZIndexIssues();

    if (fixedCount > 0 && initialFixAttempts < maxInitialAttempts) {
      // If we fixed something and haven't reached max attempts, try again
      setTimeout(performInitialFix, 500);
    } else if (initialFixAttempts >= maxInitialAttempts) {
      console.log(
        "%c[THUMBNAIL DEBUG] Initial fix attempts completed",
        "color: green; font-weight: bold",
      );
    }
  }

  setTimeout(performInitialFix, 100);

  // Start monitoring when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      setTimeout(startMonitoring, 500);
    });
  } else {
    setTimeout(startMonitoring, 500);
  }

  // Global functions for manual debugging
  window.debugThumbnailZIndex = {
    check: checkThumbnailZIndex,
    fix: fixZIndexIssues,
    debugCSS: debugCSSRules,
    monitor: startMonitoring,
  };

  console.log(
    "%c[THUMBNAIL DEBUG] Debug script loaded. Use window.debugThumbnailZIndex.* for manual debugging",
    "color: blue; font-weight: bold",
  );
})();
