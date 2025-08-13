// NZGDC Schedule Widget - Workshop Events Data

const WORKSHOP_EVENTS = {
  "workshop-a1": {
    category: "Story & Narrative",
    categoryKey: "STORY_NARRATIVE",
    title: "Advanced Storytelling Techniques",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Jane Doe", position: "Lead Writer at GameStudio" },
      { name: "John Smith", position: "Narrative Designer at IndieDev" },
    ],
  },
  "workshop-a2": {
    category: "Programming",
    categoryKey: "PROGRAMMING",
    title: "Unity Performance Optimization",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Sarah Johnson", position: "Senior Developer at TechCorp" },
    ],
  },
  "workshop-a3": {
    category: "Game Design",
    categoryKey: "GAME_DESIGN",
    title: "Player Psychology in Game Design",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [{ name: "Mike Chen", position: "Game Designer at BigStudio" }],
  },
  "workshop-a4": {
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Indie Game Marketing Strategies",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Emma Wilson",
        position: "Marketing Director at IndiePublisher",
      },
    ],
  },
  "workshop-b1": {
    category: "Art",
    categoryKey: "ART",
    title: "3D Character Modeling Workshop",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Alex Rodriguez", position: "3D Artist at VisualStudio" },
    ],
  },
  "workshop-b2": {
    category: "Audio",
    categoryKey: "AUDIO",
    title: "Interactive Audio Design",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Lisa Park", position: "Audio Director at SoundDesign Co" },
    ],
  },
  "workshop-b3": {
    category: "Programming",
    categoryKey: "PROGRAMMING",
    title: "Advanced Shader Techniques",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "David Kim", position: "Graphics Programmer at TechEngine" },
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
    category: "Data, Testing or Research",
    categoryKey: "DATA_TESTING_RESEARCH",
    title: "Netcode for Indie Games",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Tom Anderson",
        position: "Network Engineer at MultiplayerSolutions",
      },
    ],
  },
  "workshop-b6": {
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Platform Publishing Guide",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Jennifer Lee",
        position: "Platform Relations at GamePublisher",
      },
    ],
  },
  "workshop-c1": {
    category: "Culture",
    categoryKey: "CULTURE",
    title: "Inclusive Game Design Workshop",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      {
        name: "Maya Singh",
        position: "Diversity Consultant at InclusiveGames",
      },
    ],
  },
  "workshop-c2": {
    category: "Production & QA",
    categoryKey: "PRODUCTION_QA",
    title: "Quality Assurance Best Practices",
    timeframe: "3 hours",
    thumbnail: "",
    speakers: [
      { name: "Carlos Rodriguez", position: "QA Lead at TestingStudio" },
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
