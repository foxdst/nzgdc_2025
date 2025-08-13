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
    category: "Audio",
    categoryKey: "AUDIO",
    title: "Advanced Audio Design in Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      {
        name: "Sarah Mitchell",
        position: "Lead Audio Designer at Sound Studios",
      },
    ],
  },
  "panel-e2": {
    category: "Production & QA",
    categoryKey: "PRODUCTION_QA",
    title: "Quality Assurance Workshop",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Jessica Chen", position: "QA Lead at GameCorp" }],
  },
  "panel-e3": {
    category: "Culture",
    categoryKey: "CULTURE",
    title: "Inclusive Game Design",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      {
        name: "Marcus Williams",
        position: "Diversity Director at InclusiveGames",
      },
    ],
  },
  "panel-e4": {
    category: "Audio",
    categoryKey: "AUDIO",
    title: "Interactive Audio Systems",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      {
        name: "Emily Roberts",
        position: "Senior Audio Engineer at Interactive Media",
      },
    ],
  },
  "panel-e5": {
    category: "Culture",
    categoryKey: "CULTURE",
    title: "Cultural Representation in Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Mike Johnson", position: "Cultural Consultant" }],
  },
  "panel-e6": {
    category: "Production & QA",
    categoryKey: "PRODUCTION_QA",
    title: "Testing and QA Systems",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Anna Davis", position: "QA Manager at TestGames" }],
  },
  "panel-e7": {
    category: "Data, Testing or Research",
    categoryKey: "DATA_TESTING_RESEARCH",
    title: "Player Data Analysis",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Tom Wilson", position: "Data Analyst" }],
  },
  "panel-e8": {
    category: "Data, Testing or Research",
    categoryKey: "DATA_TESTING_RESEARCH",
    title: "Player Research Methods",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Lisa Park", position: "Research Consultant" }],
  },
  "panel-e9": {
    category: "Audio",
    categoryKey: "AUDIO",
    title: "Emotional Audio Design",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "David Kim", position: "Audio Director at SoundGames" }],
  },
  "panel-e10": {
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Marketing Strategy Structure",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Rachel Green", position: "Marketing Strategist at BrandCraft" },
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
    category: "Production & QA",
    categoryKey: "PRODUCTION_QA",
    title: "Production Pipeline Principles",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Alex Chen", position: "Production Lead at ProjectCraft" },
    ],
  },
  "panel-m3": {
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Business Strategy for Indies",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Priya Patel", position: "Business Consultant at IndieSpark" },
    ],
  },
  "panel-m4": {
    category: "Data, Testing or Research",
    categoryKey: "DATA_TESTING_RESEARCH",
    title: "Data-Driven Game Design",
    timeframe: "50 minutes",
    thumbnail: "",
    speakers: [
      { name: "Samira Khan", position: "Data Analyst at Analytics Games" },
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
    category: "Business & Marketing",
    categoryKey: "BUSINESS_MARKETING",
    title: "Advanced Business Techniques",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Robert Chen", position: "Business Strategist at TechCorp" },
    ],
  },
  "panel-l2": {
    category: "Audio",
    categoryKey: "AUDIO",
    title: "Audio Design for Indie Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Emma Wilson", position: "Audio Director at Creative Studios" },
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
    title: "QA Portfolio Building Workshop",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [{ name: "Jason Park", position: "QA Portfolio Consultant" }],
  },
  "panel-l6": {
    category: "Culture",
    categoryKey: "CULTURE",
    title: "Panel: Cultural Sensitivity in Games",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Maria Rodriguez", position: "Cultural Consultant" },
      { name: "Tom Wilson", position: "Diversity Advisor" },
      { name: "Lisa Park", position: "Inclusion Director" },
    ],
  },
  "panel-l7": {
    category: "Data, Testing or Research",
    categoryKey: "DATA_TESTING_RESEARCH",
    title: "Workshop: Player Research Mastery",
    timeframe: "30 minutes",
    thumbnail: "",
    speakers: [
      { name: "Anna Davis", position: "Research Lead" },
      { name: "Mike Johnson", position: "Data Analyst" },
    ],
  },
};

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = AFTERNOON_EVENTS;
} else if (typeof window !== "undefined") {
  window.AFTERNOON_EVENTS = AFTERNOON_EVENTS;
}
