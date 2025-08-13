// NZGDC Schedule Widget - Workshop Events Data

const WORKSHOP_EVENTS = {
  "workshop-a1": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "Advanced VR Storytelling Techniques",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Jane Doe", position: "VR Director at GameStudio" },
      { name: "John Smith", position: "AR Designer at IndieDev" },
    ],
  },
  "workshop-a2": {
    category: "Serious & Educational Games",
    categoryKey: "SERIOUS_EDUCATIONAL",
    title: "Educational Game Development",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Sarah Johnson",
        position: "Educational Game Designer at TechCorp",
      },
    ],
  },
  "workshop-a3": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "Player Psychology in VR Design",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [{ name: "Mike Chen", position: "VR Designer at BigStudio" }],
  },
  "workshop-a4": {
    category: "Serious & Educational Games",
    categoryKey: "SERIOUS_EDUCATIONAL",
    title: "Educational Game Marketing Strategies",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Emma Wilson",
        position: "Educational Game Marketer at IndiePublisher",
      },
    ],
  },
  "workshop-b1": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "3D VR Character Modeling Workshop",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Alex Rodriguez", position: "VR 3D Artist at VisualStudio" },
    ],
  },
  "workshop-b2": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "Spatial Audio Design for VR",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Lisa Park", position: "VR Audio Director at SoundDesign Co" },
    ],
  },
  "workshop-b3": {
    category: "Serious & Educational Games",
    categoryKey: "SERIOUS_EDUCATIONAL",
    title: "Educational Game Programming",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "David Kim",
        position: "Educational Game Programmer at TechEngine",
      },
    ],
  },
  "workshop-b4": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "Virtual Reality Game Development",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Rachel Green", position: "VR Developer at ImmersiveTech" },
    ],
  },
  "workshop-b5": {
    category: "Serious & Educational Games",
    categoryKey: "SERIOUS_EDUCATIONAL",
    title: "Multiplayer Educational Games",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Tom Anderson",
        position: "Educational Game Developer at MultiplayerSolutions",
      },
    ],
  },
  "workshop-b6": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "VR Platform Publishing Guide",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Jennifer Lee",
        position: "VR Platform Relations at GamePublisher",
      },
    ],
  },
  "workshop-c1": {
    category: "Serious & Educational Games",
    categoryKey: "SERIOUS_EDUCATIONAL",
    title: "Inclusive Educational Game Workshop",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Maya Singh",
        position: "Educational Game Consultant at InclusiveGames",
      },
    ],
  },
  "workshop-c2": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "VR/AR Quality Assurance",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Carlos Rodriguez", position: "VR QA Lead at TestingStudio" },
    ],
  },
  "workshop-c3": {
    category: "Serious & Educational Games",
    categoryKey: "SERIOUS_EDUCATIONAL",
    title: "Educational Game Development",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Dr. Amanda Foster", position: "EdTech Researcher at EduGames" },
    ],
  },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = WORKSHOP_EVENTS;
} else if (typeof window !== "undefined") {
  window.WORKSHOP_EVENTS = WORKSHOP_EVENTS;
}
