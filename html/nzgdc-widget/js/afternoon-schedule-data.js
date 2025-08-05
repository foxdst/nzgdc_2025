// NZGDC Afternoon Schedule Widget - Schedule Data Configuration

const AFTERNOON_SCHEDULE_DATA = {
  timeSlots: [
    {
      id: "early-afternoon",
      timeRange: "1.25pm - 1.55pm",
      title: "Early Afternoon Panels",
      theme: "early", // Controls styling (blue theme)
      events: [
        {
          id: "panel-e1",
          category: "Story & Narrative",
          title: "Advanced Storytelling in Games",
          type: "main",
        },
        {
          id: "panel-e2",
          category: "Story & Narrative",
          title: "Character Development Workshop",
          type: "main",
        },
        {
          id: "panel-e3",
          category: "Story & Narrative",
          title: "Interactive Narrative Design",
          type: "main",
        },
        {
          id: "panel-e4",
          category: "Story & Narrative",
          title: "Branching Storylines",
          type: "main",
        },
        {
          id: "panel-e5",
          category: "Story & Narrative",
          title: "Writing for Games",
          type: "main",
        },
        {
          id: "panel-e6",
          category: "Story & Narrative",
          title: "Dialogue Systems",
          type: "main",
        },
        {
          id: "panel-e7",
          category: "Story & Narrative",
          title: "Narrative in VR",
          type: "main",
        },
        {
          id: "panel-e8",
          category: "Story & Narrative",
          title: "Player Choice Impact",
          type: "main",
        },
        {
          id: "panel-e9",
          category: "Story & Narrative",
          title: "Emotional Storytelling",
          type: "main",
        },
        {
          id: "panel-e10",
          category: "Story & Narrative",
          title: "Story Structure in Games",
          type: "main",
        },
      ],
    },
    {
      id: "afternoon-break",
      type: "break",
      title: "Afternoon Break",
      timeRange: "1.55pm - 2.20pm (25 mins)",
    },
    {
      id: "mid-afternoon",
      timeRange: "2.20pm - 3.10pm",
      title: "Mid Afternoon Sessions",
      theme: "mid", // Controls styling (blue theme)
      events: [
        {
          id: "panel-b1",
          category: "Game Design",
          title: "Panel: The Future of Multiplayer Design",
          type: "big",
        },
        {
          id: "panel-b2",
          category: "Business",
          title: "Workshop: Monetization Strategies for Indies",
          type: "big",
        },
        {
          id: "panel-m1",
          category: "Audio & Music",
          title: "Game Audio Fundamentals",
          type: "main",
        },
        {
          id: "panel-m2",
          category: "Game Design",
          title: "Level Design Principles",
          type: "main",
        },
        {
          id: "panel-m3",
          category: "UI/UX",
          title: "UI/UX for Indies",
          type: "main",
        },
        {
          id: "panel-m4",
          category: "Technical",
          title: "Procedural Generation",
          type: "main",
        },
        {
          id: "panel-m5",
          category: "Community",
          title: "Community Management 101",
          type: "main",
        },
      ],
    },
    {
      id: "late-afternoon",
      timeRange: "3.20pm - 3.50pm",
      title: "Late Afternoon Sessions",
      theme: "early",
      events: [
        {
          id: "panel-l1",
          category: "Programming",
          title: "Advanced Programming Techniques",
          type: "main",
        },
        {
          id: "panel-l2",
          category: "Art & Design",
          title: "Visual Design for Indie Games",
          type: "main",
        },
        {
          id: "panel-l3",
          category: "Marketing",
          title: "Social Media for Game Developers",
          type: "main",
        },
        {
          id: "panel-l4",
          category: "Business",
          title: "Funding Your Game Studio",
          type: "main",
        },
        {
          id: "panel-l5",
          category: "Career",
          title: "Portfolio Building Workshop",
          type: "main",
        },
        {
          id: "panel-l6",
          category: "Story & Narrative",
          title: "Panel: Advanced Story Development",
          type: "big",
        },
        {
          id: "panel-l7",
          category: "Art & Design",
          title: "Workshop: Character Design Mastery",
          type: "big",
        },
      ],
    },
    {
      id: "speaker-sponsor-party",
      type: "break",
      title: "Speaker & Sponsor Party",
      timeRange: "5.30pm - 7.30pm (2 hours)",
    },
  ],
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AFTERNOON_SCHEDULE_DATA;
} else if (typeof window !== "undefined") {
  window.AFTERNOON_SCHEDULE_DATA = AFTERNOON_SCHEDULE_DATA;
}
