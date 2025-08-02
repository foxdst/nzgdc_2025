// NZGDC Schedule Widget - Schedule Data Configuration

const SCHEDULE_DATA = {
    timeSlots: [
        {
            id: 'morning',
            timeRange: '9.00am - 12.00pm',
            title: 'Morning Workshops',
            theme: 'a', // Controls styling (yellow theme)
            workshops: [
                { id: 'workshop-a1', category: 'Story & Narrative', title: 'Advanced Storytelling Techniques' },
                { id: 'workshop-a2', category: 'Technical Skills', title: 'Unity Performance Optimization' },
                { id: 'workshop-a3', category: 'Game Design', title: 'Player Psychology in Game Design' },
                { id: 'workshop-a4', category: 'Business', title: 'Indie Game Marketing Strategies' }
            ]
        },
        {
            id: 'afternoon',
            timeRange: '12.00pm - 3.00pm',
            title: 'Afternoon Workshops',
            theme: 'b', // Controls styling (blue theme)
            workshops: [
                { id: 'workshop-b1', category: 'Art & Animation', title: '3D Character Modeling Workshop' },
                { id: 'workshop-b2', category: 'Audio', title: 'Interactive Audio Design' },
                { id: 'workshop-b3', category: 'Programming', title: 'Advanced Shader Techniques' },
                { id: 'workshop-b4', category: 'VR/AR', title: 'Virtual Reality Game Development' },
                { id: 'workshop-b5', category: 'Multiplayer', title: 'Netcode for Indie Games' },
                { id: 'workshop-b6', category: 'Publishing', title: 'Platform Publishing Guide' }
            ]
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SCHEDULE_DATA;
} else if (typeof window !== 'undefined') {
    window.SCHEDULE_DATA = SCHEDULE_DATA;
}
