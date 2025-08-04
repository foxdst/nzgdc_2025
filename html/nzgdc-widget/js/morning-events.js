// NZGDC Morning Schedule Widget - Morning Events Data

const MORNING_EVENTS = {
    'panel-b1': {
        category: 'Game Design',
        title: 'Panel: The Future of Multiplayer Design',
        timeframe: '50 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Riley Adams', position: 'Network Engineer at NetPlay' },
            { name: 'Morgan Yu', position: 'Game Director at Massive Online' },
            { name: 'Alex Thompson', position: 'Multiplayer Specialist at ConnectGames' }
        ]
    },
    'panel-b2': {
        category: 'Business',
        title: 'Workshop: Monetization Strategies for Indies',
        timeframe: '50 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Dana Kim', position: 'Business Analyst at GameBiz' },
            { name: 'Marcus Cole', position: 'Revenue Consultant at ProfitPlay' }
        ]
    },
    'panel-e1': {
        category: 'Story & Narrative',
        title: 'Advanced Storytelling in Games',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Sarah Mitchell', position: 'Lead Writer at Narrative Studios' }
        ]
    },
    'panel-e2': {
        category: 'Story & Narrative',
        title: 'Character Development Workshop',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Jessica Chen', position: 'Character Designer at GameCorp' }
        ]
    },
    'panel-e3': {
        category: 'Story & Narrative',
        title: 'Interactive Narrative Design',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Marcus Williams', position: 'Narrative Director at StoryGames' }
        ]
    },
    'panel-e4': {
        category: 'Story & Narrative',
        title: 'Branching Storylines',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Emily Roberts', position: 'Senior Writer at Interactive Media' }
        ]
    },
    'panel-e5': {
        category: 'Story & Narrative',
        title: 'Writing for Games',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Mike Johnson', position: 'Freelance Game Writer' }
        ]
    },
    'panel-e6': {
        category: 'Story & Narrative',
        title: 'Dialogue Systems',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Anna Davis', position: 'Dialogue Writer at VoiceGames' }
        ]
    },
    'panel-e7': {
        category: 'Story & Narrative',
        title: 'Narrative in VR',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Tom Wilson', position: 'VR Narrative Designer' }
        ]
    },
    'panel-e8': {
        category: 'Story & Narrative',
        title: 'Player Choice Impact',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Lisa Park', position: 'Game Design Consultant' }
        ]
    },
    'panel-e9': {
        category: 'Story & Narrative',
        title: 'Emotional Storytelling',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'David Kim', position: 'Creative Director at FeelGames' }
        ]
    },
    'panel-e10': {
        category: 'Story & Narrative',
        title: 'Story Structure in Games',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Rachel Green', position: 'Story Architect at PlotCraft' }
        ]
    },
    'panel-m1': {
        category: 'Audio & Music',
        title: 'Game Audio Fundamentals',
        timeframe: '50 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Jamie Lee', position: 'Audio Director at SoundWave Studios' }
        ]
    },
    'panel-m2': {
        category: 'Game Design',
        title: 'Level Design Principles',
        timeframe: '50 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Alex Chen', position: 'Lead Level Designer at MapCraft' }
        ]
    },
    'panel-m3': {
        category: 'UI/UX',
        title: 'UI/UX for Indies',
        timeframe: '50 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Priya Patel', position: 'UI/UX Specialist at IndieSpark' }
        ]
    },
    'panel-m4': {
        category: 'Technical',
        title: 'Procedural Generation',
        timeframe: '50 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Samira Khan', position: 'Technical Artist at GenArt Games' }
        ]
    },
    'panel-m5': {
        category: 'Community',
        title: 'Community Management 101',
        timeframe: '50 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Ben Smith', position: 'Community Lead at PlayTogether' }
        ]
    },
    'panel-l1': {
        category: 'Programming',
        title: 'Advanced Programming Techniques',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Robert Chen', position: 'Senior Developer at TechCorp' }
        ]
    },
    'panel-l2': {
        category: 'Art & Design',
        title: 'Visual Design for Indie Games',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Emma Wilson', position: 'Art Director at Creative Studios' }
        ]
    },
    'panel-l3': {
        category: 'Marketing',
        title: 'Social Media for Game Developers',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'David Smith', position: 'Marketing Manager at Indie Games' }
        ]
    },
    'panel-l4': {
        category: 'Business',
        title: 'Funding Your Game Studio',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Sarah Lee', position: 'Investment Advisor at Game Fund' }
        ]
    },
    'panel-l5': {
        category: 'Career',
        title: 'Portfolio Building Workshop',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Jason Park', position: 'Portfolio Consultant' }
        ]
    },
    'panel-l6': {
        category: 'Story & Narrative',
        title: 'Panel: Advanced Story Development',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Maria Rodriguez', position: 'Lead Narrative Designer' },
            { name: 'Tom Wilson', position: 'Story Consultant' },
            { name: 'Lisa Park', position: 'Writing Director' }
        ]
    },
    'panel-l7': {
        category: 'Art & Design',
        title: 'Workshop: Character Design Mastery',
        timeframe: '30 minutes',
        thumbnail: '',
        speakers: [
            { name: 'Anna Davis', position: 'Character Development Lead' },
            { name: 'Mike Johnson', position: 'Character Artist' }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MORNING_EVENTS;
} else if (typeof window !== 'undefined') {
    window.MORNING_EVENTS = MORNING_EVENTS;
}
