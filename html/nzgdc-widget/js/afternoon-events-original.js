// NZGDC Afternoon Schedule Widget - Afternoon Events Data

const AFTERNOON_EVENTS = {
  "panel-b1": {
    category: "Game Design",
    categoryKey: "GAME_DESIGN",
    title: "Panel: The Future of Multiplayer Design",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Riley Adams", position: "Network Engineer at NetPlay" },
      { name: "Morgan Yu", position: "Game Director at Massive Online" },
      {
        name: "Alex Thompson",
        position: "Multiplayer Specialist at ConnectGames",
      },
    ],
  },
  "panel-b2": {
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Workshop: Monetization Strategies for Indies",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Dana Kim", position: "Business Analyst at GameBiz" },
      { name: "Marcus Cole", position: "Revenue Consultant at ProfitPlay" },
    ],
  },
  "panel-e1": {
    category: "Story & Narrative",
    categoryKey: "STORY_NARRATIVE",
    title: "Advanced Storytelling in Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Sarah Mitchell", position: "Lead Writer at Narrative Studios" },
    ],
  },
  "panel-e2": {
    category: "Programming",
    categoryKey: "PROGRAMMING",
    title: "Character Development Workshop",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Jessica Chen", position: "Character Designer at GameCorp" },
    ],
  },
  "panel-e3": {
    category: "Art",
    categoryKey: "ART",
    title: "Interactive Narrative Design",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Marcus Williams", position: "Narrative Director at StoryGames" },
    ],
  },
  "panel-e4": {
    category: "Audio",
    categoryKey: "AUDIO",
    title: "Branching Storylines",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Emily Roberts", position: "Senior Writer at Interactive Media" },
    ],
  },
  "panel-e5": {
    category: "Culture",
    categoryKey: "CULTURE",
    title: "Writing for Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Mike Johnson", position: "Freelance Game Writer" }],
  },
  "panel-e6": {
    category: "Production & QA",
    categoryKey: "PRODUCTION_QA",
    title: "Dialogue Systems",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Anna Davis", position: "Dialogue Writer at VoiceGames" },
    ],
  },
  "panel-e7": {
    category: "Realities (VR, AR, MR)",
    categoryKey: "REALITIES_VR_AR_MR",
    title: "Narrative in VR",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Tom Wilson", position: "VR Narrative Designer" }],
  },
  "panel-e8": {
    category: "Data, Testing or Research",
    categoryKey: "DATA_TESTING_RESEARCH",
    title: "Player Choice Impact",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Lisa Park", position: "Game Design Consultant" }],
  },
  "panel-e9": {
    category: "Serious & Educational Games",
    categoryKey: "SERIOUS_EDUCATIONAL",
    title: "Emotional Storytelling",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "David Kim", position: "Creative Director at FeelGames" },
    ],
  },
  "panel-e10": {
    category: "Story & Narrative",
    categoryKey: "STORY_NARRATIVE",
    title: "Story Structure in Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Rachel Green", position: "Story Architect at PlotCraft" },
    ],
  },
  "panel-m1": {
    category: "Audio",
    categoryKey: "AUDIO",
    title: "Game Audio Fundamentals",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Jamie Lee", position: "Audio Director at SoundWave Studios" },
    ],
  },
  "panel-m2": {
    category: "Game Design",
    categoryKey: "GAME_DESIGN",
    title: "Level Design Principles",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Alex Chen", position: "Lead Level Designer at MapCraft" },
    ],
  },
  "panel-m3": {
    category: "Art",
    categoryKey: "ART",
    title: "UI/UX for Indies",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Priya Patel", position: "UI/UX Specialist at IndieSpark" },
    ],
  },
  "panel-m4": {
    category: "Programming",
    categoryKey: "PROGRAMMING",
    title: "Procedural Generation",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Samira Khan", position: "Technical Artist at GenArt Games" },
    ],
  },
  "panel-m5": {
    category: "Culture",
    categoryKey: "CULTURE",
    title: "Community Management 101",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Ben Smith", position: "Community Lead at PlayTogether" },
    ],
  },
  "panel-l1": {
    category: "Programming",
    categoryKey: "PROGRAMMING",
    title: "Advanced Programming Techniques",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Robert Chen", position: "Senior Developer at TechCorp" },
    ],
  },
  "panel-l2": {
    category: "Art",
    categoryKey: "ART",
    title: "Visual Design for Indie Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Emma Wilson", position: "Art Director at Creative Studios" },
    ],
  },
  "panel-l3": {
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Social Media for Game Developers",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "David Smith", position: "Marketing Manager at Indie Games" },
    ],
  },
  "panel-l4": {
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Funding Your Game Studio",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Sarah Lee", position: "Investment Advisor at Game Fund" },
    ],
  },
  "panel-l5": {
    category: "Production & QA",
    categoryKey: "PRODUCTION_QA",
    title: "Portfolio Building Workshop",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Jason Park", position: "Portfolio Consultant" }],
  },
  "panel-l6": {
    category: "Story & Narrative",
    categoryKey: "STORY_NARRATIVE",
    title: "Panel: Advanced Story Development",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Maria Rodriguez", position: "Lead Narrative Designer" },
      { name: "Tom Wilson", position: "Story Consultant" },
      { name: "Lisa Park", position: "Writing Director" },
    ],
  },
  "panel-l7": {
    category: "Art",
    categoryKey: "ART",
    title: "Workshop: Character Design Mastery",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Anna Davis", position: "Character Development Lead" },
      { name: "Mike Johnson", position: "Character Artist" },
    ],
  },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AFTERNOON_EVENTS;
} else if (typeof window !== "undefined") {
  window.AFTERNOON_EVENTS = AFTERNOON_EVENTS;
}
