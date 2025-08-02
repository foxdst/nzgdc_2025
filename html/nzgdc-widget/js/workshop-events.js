// NZGDC Schedule Widget - Workshop Events Data

const WORKSHOP_EVENTS = {
    'workshop-a1': {
        category: 'Story & Narrative',
        title: 'Advanced Storytelling Techniques',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Jane Doe', position: 'Lead Writer at GameStudio' },
            { name: 'John Smith', position: 'Narrative Designer at IndieDev' }
        ]
    },
    'workshop-a2': {
        category: 'Technical Skills',
        title: 'Unity Performance Optimization',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Sarah Johnson', position: 'Senior Developer at TechCorp' }
        ]
    },
    'workshop-a3': {
        category: 'Game Design',
        title: 'Player Psychology in Game Design',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Mike Chen', position: 'Game Designer at BigStudio' }
        ]
    },
    'workshop-a4': {
        category: 'Business',
        title: 'Indie Game Marketing Strategies',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Emma Wilson', position: 'Marketing Director at IndiePublisher' }
        ]
    },
    'workshop-b1': {
        category: 'Art & Animation',
        title: '3D Character Modeling Workshop',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Alex Rodriguez', position: '3D Artist at VisualStudio' }
        ]
    },
    'workshop-b2': {
        category: 'Audio',
        title: 'Interactive Audio Design',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Lisa Park', position: 'Audio Director at SoundDesign Co' }
        ]
    },
    'workshop-b3': {
        category: 'Programming',
        title: 'Advanced Shader Techniques',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'David Kim', position: 'Graphics Programmer at TechEngine' }
        ]
    },
    'workshop-b4': {
        category: 'VR/AR',
        title: 'Virtual Reality Game Development',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Rachel Green', position: 'VR Developer at ImmersiveTech' }
        ]
    },
    'workshop-b5': {
        category: 'Multiplayer',
        title: 'Netcode for Indie Games',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Tom Anderson', position: 'Network Engineer at MultiplayerSolutions' }
        ]
    },
    'workshop-b6': {
        category: 'Publishing',
        title: 'Platform Publishing Guide',
        timeframe: '3 hours',
        thumbnail: '',
        speakers: [
            { name: 'Jennifer Lee', position: 'Platform Relations at GamePublisher' }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WORKSHOP_EVENTS;
} else if (typeof window !== 'undefined') {
    window.WORKSHOP_EVENTS = WORKSHOP_EVENTS;
}
