# EXPANDED EVENT DETAILS OVERLAY IMPLEMENTATION GUIDE
## Detailed Instructions for AI Assistant Development

---

## 🎯 OBJECTIVE

Create a comprehensive HTML prototype of an Expanded Event Details overlay window that appears when users click on existing Event Panel overlays. This overlay displays detailed event information including expanded descriptions, speaker bios, and Audience Group tags that identify which audiences are suitable for attending the event.

**CRITICAL**: This overlay integrates with existing clickable overlay functionality - DO NOT create new buttons or click handlers.

---

## 📋 MANDATORY PRE-READING

**Before proceeding, you MUST read these documents:**
- `AI_ASSISTANT_QUICK_REFERENCE_GUIDE.md` - Essential project structure and patterns
- `CRITICAL_OVERLAY_BUTTON_WARNING.md` - ⚠️ CRITICAL: Understanding existing click functionality

**Key Understanding Required:**
- Event panel overlays are already clickable buttons
- Existing click handlers need to be extended, not replaced
- CSS architecture has strict boundaries (unified-event-panel.css vs bundle CSS files)
- Design must reuse existing CSS properties and patterns

---

## 🖼️ DESIGN SPECIFICATION

Based on the provided design image, the Expanded Event Details overlay consists of three main sections:

### **1. EVENT HEADER (Top Section)**
- **Event Title**: Large, prominent title using `var(--color-primary)` background and `var(--color-category-text)` text
- **Speaker Names**: Horizontally listed speaker names using `var(--color-category-text)` and `var(--font-family-medium)`
- **Background**: Uses `var(--color-primary)` (#f53e3e) from existing CSS variables

### **2. EVENT DESCRIPTION (Middle Section)**
- **Synopsis Text**: Event description using `var(--color-title)` and `var(--font-family-medium)`
- **Horizontal Separator Line**: 2px solid #ddd visual divider
- **Audience Group Tags**: "Who should attend?" label followed by styled tags
  - Red tags using `var(--color-primary)` background for specific audiences like "WRITERS"
  - Black (#333) background tags for "EVERYONE"
  - Use `var(--font-family-heavy)` font styling matching existing category elements

### **3. SPEAKER BIOS (Bottom Section)**
- **Business Card Layout**: Each speaker displayed as a card with:
  - **Left Side**: 120px x 120px speaker headshot image
  - **Right Side**:
    - "Speaker Bio" header using `var(--color-primary)` background and `var(--color-category-text)` text
    - Speaker name using `var(--color-title)` and `var(--font-family-demi)`
    - Position/title using `var(--color-intro)` and `var(--font-family-medium)`
    - Bio description using `var(--color-title)` and `var(--font-family-medium)`
    - Contact information using `var(--color-title)` and `var(--font-family-medium)`

---

## 🏗️ FILE STRUCTURE REQUIREMENTS

Create a single HTML prototype file: `expanded-event-details-overlay-prototype.html`

**File Contents Must Include:**
1. Complete HTML structure for the overlay
2. Embedded CSS styles (reusing existing design patterns)
3. JavaScript functionality for dynamic content population
4. Sample data for testing and demonstration
5. Responsive design considerations

---

## 📐 HTML STRUCTURE SPECIFICATIONS

### **Root Overlay Container**
```html
<div class="nzgdc-expanded-event-overlay">
    <div class="nzgdc-expanded-event-backdrop"></div>
    <div class="nzgdc-expanded-event-modal">
        <!-- Content sections here -->
    </div>
</div>
```

### **Event Header Structure**
```html
<div class="nzgdc-event-header">
    <div class="nzgdc-event-title-expanded">
        <h1 class="nzgdc-title-text-expanded">Event Title Here</h1>
    </div>
    <div class="nzgdc-event-speakers-list">
        <div class="nzgdc-speaker-name-item">First Name + Last Name</div>
        <div class="nzgdc-speaker-name-item">First Name + Last Name</div>
        <!-- Additional speakers as needed -->
    </div>
</div>
```

### **Event Description Structure**
```html
<div class="nzgdc-event-description">
    <div class="nzgdc-event-synopsis">
        <p class="nzgdc-synopsis-text">Event description text here...</p>
    </div>
    <hr class="nzgdc-content-separator">
    <div class="nzgdc-audience-section">
        <span class="nzgdc-audience-label">Who should attend?</span>
        <div class="nzgdc-audience-tags">
            <span class="nzgdc-audience-tag writers">WRITERS</span>
            <span class="nzgdc-audience-tag everyone">EVERYONE</span>
            <!-- Additional tags as needed -->
        </div>
    </div>
</div>
```

### **Speaker Bios Structure**
```html
<div class="nzgdc-speaker-bios">
    <div class="nzgdc-speaker-bio-card">
        <div class="nzgdc-speaker-headshot">
            <img src="placeholder-headshot.jpg" alt="Speaker Name">
        </div>
        <div class="nzgdc-speaker-bio-content">
            <div class="nzgdc-speaker-bio-header">
                <h3 class="nzgdc-bio-header-text">Speaker Bio</h3>
            </div>
            <div class="nzgdc-speaker-bio-details">
                <h4 class="nzgdc-speaker-name">First Name + Last Name</h4>
                <p class="nzgdc-speaker-position">Position/Title @ Company Name</p>
                <p class="nzgdc-speaker-description">Professional bio description...</p>
                <div class="nzgdc-speaker-contact">
                    <span class="nzgdc-contact-email">Email: emailaddress@domain</span>
                    <span class="nzgdc-contact-website">Website: foxstudios.nz</span>
                </div>
            </div>
        </div>
    </div>
    <!-- Repeat for additional speakers -->
</div>
```

---

## 🎨 CSS STYLING REQUIREMENTS

### **Design System Compliance**

**CRITICAL**: All styling must reuse existing CSS custom properties from `unified-event-panel.css`:

```css
/* Use existing CSS variables */
--font-family-demi: "Futura PT Demi", "Futura", Arial, sans-serif;
--font-family-bold: "Futura PT Bold", "Futura", Arial, sans-serif;
--font-family-heavy: "Futura PT Heavy", "Futura", Arial, sans-serif;
--font-family-medium: "Futura PT Medium", "Futura", Arial, sans-serif;
--color-primary: #f53e3e;
--color-bg: rgba(255, 255, 255, 1);
--color-overlay: rgba(0, 0, 0, 0.75);
--color-title: rgba(0, 0, 0, 1);
--color-category-text: rgba(255, 255, 255, 1);
--color-intro: rgba(245, 45, 49, 1);
```

### **Modal System Styling**

```css
.nzgdc-expanded-event-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 2000;
    display: none; /* Hidden by default */
}

.nzgdc-expanded-event-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--color-overlay);
}

.nzgdc-expanded-event-modal {
    position: relative;
    max-width: 1000px;
    max-height: 90vh;
    margin: 5vh auto;
    background-color: var(--color-bg);
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
```

### **Event Header Styling**

```css
.nzgdc-event-header {
    background-color: var(--color-primary);
    padding: 20px;
    text-align: center;
}

.nzgdc-title-text-expanded {
    color: var(--color-category-text);
    font-family: var(--font-family-heavy);
    font-size: 24px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 15px 0;
}

.nzgdc-event-speakers-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
}

.nzgdc-speaker-name-item {
    color: var(--color-category-text);
    font-family: var(--font-family-medium);
    font-size: 16px;
}
```

### **Event Description Styling**

```css
.nzgdc-event-description {
    padding: 30px;
    background-color: #f8f8f8;
}

.nzgdc-synopsis-text {
    color: var(--color-title);
    font-family: var(--font-family-medium);
    font-size: 16px;
    line-height: 1.6;
    margin: 0 0 20px 0;
}

.nzgdc-content-separator {
    border: none;
    border-top: 2px solid #ddd;
    margin: 20px 0;
}

.nzgdc-audience-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 15px;
}

.nzgdc-audience-label {
    color: var(--color-title);
    font-family: var(--font-family-demi);
    font-size: 16px;
    font-weight: 600;
}

.nzgdc-audience-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.nzgdc-audience-tag {
    padding: 8px 16px;
    font-family: var(--font-family-heavy);
    font-size: 12px;
    font-weight: 600;
    color: white;
    border-radius: 4px;
}

.nzgdc-audience-tag.writers {
    background-color: var(--color-primary);
}

.nzgdc-audience-tag.everyone {
    background-color: #333;
}
```

### **Speaker Bio Styling**

```css
.nzgdc-speaker-bios {
    padding: 0 30px 30px;
}

.nzgdc-speaker-bio-card {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    background-color: var(--color-bg);
}

.nzgdc-speaker-headshot {
    flex-shrink: 0;
    width: 120px;
    height: 120px;
}

.nzgdc-speaker-headshot img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.nzgdc-speaker-bio-content {
    flex: 1;
}

.nzgdc-speaker-bio-header {
    background-color: var(--color-primary);
    padding: 8px 15px;
    margin-bottom: 15px;
}

.nzgdc-bio-header-text {
    color: var(--color-category-text);
    font-family: var(--font-family-heavy);
    font-size: 18px;
    font-weight: 600;
    margin: 0;
}

.nzgdc-speaker-name {
    color: var(--color-title);
    font-family: var(--font-family-demi);
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 5px 0;
}

.nzgdc-speaker-position {
    color: var(--color-intro);
    font-family: var(--font-family-medium);
    font-size: 14px;
    font-style: italic;
    margin: 0 0 10px 0;
}

.nzgdc-speaker-description {
    color: var(--color-title);
    font-family: var(--font-family-medium);
    font-size: 14px;
    line-height: 1.4;
    margin: 0 0 10px 0;
}

.nzgdc-speaker-contact {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    font-family: var(--font-family-medium);
    font-size: 12px;
    color: var(--color-title);
}
```

---

## 💻 JAVASCRIPT FUNCTIONALITY REQUIREMENTS

### **Core Functionality Needed**

1. **Modal Show/Hide Functions**
   - `showExpandedEventDetails(eventData)` - Opens overlay with event data
   - `hideExpandedEventDetails()` - Closes overlay
   - Backdrop click to close functionality

2. **Dynamic Content Population**
   - Populate event title and speaker names in header
   - Fill description text and audience tags
   - Generate speaker bio cards dynamically
   - Handle multiple speakers correctly

3. **Sample Data Structure**
```javascript
const sampleEventData = {
    title: "This is a Placeholder Title occupying two lines of space",
    speakers: [
        {
            name: "First Name + Last Name",
            position: "Position/Title @ Company Name",
            bio: "Description details about the speaker's background, professional history, and possible contact information...",
            email: "emailaddress@domain",
            website: "foxstudios.nz",
            headshot: "path/to/headshot.jpg"
        }
        // Additional speakers...
    ],
    description: "Reprehenderit voluptate minim nostrud est et labore enim. Minim ipsum est et labore reprehenderit labore non amet sit officia qute adipisicing voluptate officia consequat...",
    audienceTags: ["WRITERS", "EVERYONE", "EVERYONE", "EVERYONE"]
};
```

4. **Integration Points**
```javascript
// Function to be called by existing overlay click handlers
function openExpandedEventDetails(eventId) {
    // Fetch event data (replace with actual data source)
    const eventData = getEventDataById(eventId);
    showExpandedEventDetails(eventData);
}

// Close functionality
function closeExpandedEventDetails() {
    hideExpandedEventDetails();
}
```

---

## 📱 RESPONSIVE DESIGN REQUIREMENTS

### **Desktop (768px+)**
- Modal width: 1000px maximum
- Two-column speaker bio layout where appropriate
- Full horizontal speaker name layout in header

### **Tablet (481px - 767px)**
- Modal width: 95% of viewport
- Single-column speaker bio layout
- Maintain horizontal speaker names with wrapping

### **Mobile (480px and below)**
- Modal width: 95% of viewport
- Stack speaker names vertically in header if needed
- Reduce padding and font sizes appropriately
- Ensure touch-friendly click targets

---

## 🔌 INTEGRATION GUIDELINES

### **Connection to Existing System**

**DO NOT MODIFY** existing overlay click handlers in `unified-event-loader.js`. Instead:

1. **Extend existing overlay click behavior** to call your new overlay function (the entire overlay is clickable, not just the CTA)
2. **Preserve all existing functionality** - overlays must still work as before
3. **Add your overlay as the destination** of existing click handlers

### **Testing Integration Points**

1. **Verify existing overlays still trigger** when clicked
2. **Ensure your overlay opens** from existing click handlers
3. **Test with both Big (620x300) and Main (300x300) panels**
4. **Confirm backdrop and escape key closing** works properly

---

## 🧪 TESTING REQUIREMENTS

### **Sample Test Data**
Include multiple test scenarios:

1. **Single Speaker Event**
   - One speaker with full bio details
   - Short description text
   - Multiple audience tags

2. **Multiple Speaker Event**
   - 2-3 speakers with varying bio lengths
   - Longer description text
   - Mixed audience tag types

3. **Edge Cases**
   - Very long event titles (test wrapping)
   - Missing speaker headshots (placeholder handling)
   - Long speaker bios (scrolling/truncation)
   - Mobile responsiveness testing

### **Visual Validation**
- Color scheme matches existing event panels
- Typography consistent with current widget fonts
- Spacing and padding follows existing patterns
- Category tag styling matches current implementation

---

## ⚡ PERFORMANCE CONSIDERATIONS

1. **Lazy Loading**: Only initialize overlay when first needed
2. **Image Optimization**: Provide placeholder for missing headshots
3. **Smooth Animations**: Use CSS transitions for show/hide (respecting prefers-reduced-motion)
4. **Memory Management**: Clean up event listeners when overlay is hidden

---

## 🚨 CRITICAL WARNINGS

### **What You Must NOT Do**

❌ **DO NOT create new buttons** for opening event details
❌ **DO NOT modify existing overlay click handlers** in unified-event-loader.js
❌ **DO NOT add competing click functionality** to event panels
❌ **DO NOT create separate CSS files** - embed all styles in the prototype
❌ **DO NOT use made-up CSS properties** - only use existing variables

### **What You MUST Do**

✅ **DO reuse existing CSS custom properties** from unified-event-panel.css
✅ **DO maintain existing overlay click functionality**
✅ **DO create a self-contained HTML prototype** with all code embedded
✅ **DO follow existing naming conventions** (nzgdc- prefix)
✅ **DO test responsive design** across all breakpoints
✅ **DO include sample data** for immediate testing

---

## 📝 DELIVERABLE CHECKLIST

Your completed prototype must include:

- [ ] Complete HTML structure with semantic markup
- [ ] Embedded CSS using existing design system properties
- [ ] JavaScript functions for show/hide and content population
- [ ] Sample event data for testing multiple scenarios
- [ ] Responsive design for desktop, tablet, and mobile
- [ ] Proper z-index layering above existing content
- [ ] Backdrop click-to-close functionality
- [ ] Keyboard accessibility (ESC key to close)
- [ ] Visual consistency with existing event panel designs
- [ ] Integration hooks for existing click handlers

---

## 🏁 SUCCESS CRITERIA

Your implementation is successful when:

1. **Visual Design**: Matches provided image exactly in layout and styling
2. **Code Quality**: Reuses existing CSS patterns and follows project conventions
3. **Functionality**: Opens/closes smoothly with proper content population
4. **Responsiveness**: Works seamlessly across all device sizes
5. **Integration Ready**: Can be easily connected to existing overlay click handlers
6. **Performance**: Loads quickly and handles dynamic content efficiently

---

**REMINDER**: This overlay system must integrate with existing functionality, not replace it. The overlays are already clickable - your job is to create what opens when they're clicked.

**Start by creating the HTML prototype file with all embedded styles and JavaScript, using the sample data provided for immediate testing and demonstration.**
