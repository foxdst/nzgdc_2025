// NZGDC Morning Schedule Widget - Schedule Data Configuration

const MORNING_SCHEDULE_DATA = {
    timeSlots: [
        {
            id: 'early-morning',
            timeRange: '10.00am - 10.30am',
            title: 'Early Morning Panels',
            theme: 'early', // Controls styling (yellow theme)
            events: [
                { id: 'panel-e1', category: 'Story & Narrative', title: 'Advanced Storytelling in Games', type: 'main' },
                { id: 'panel-e2', category: 'Story & Narrative', title: 'Character Development Workshop', type: 'main' },
                { id: 'panel-e3', category: 'Story & Narrative', title: 'Interactive Narrative Design', type: 'main' },
                { id: 'panel-e4', category: 'Story & Narrative', title: 'Branching Storylines', type: 'main' },
                { id: 'panel-e5', category: 'Story & Narrative', title: 'Writing for Games', type: 'main' },
                { id: 'panel-e6', category: 'Story & Narrative', title: 'Dialogue Systems', type: 'main' },
                { id: 'panel-e7', category: 'Story & Narrative', title: 'Narrative in VR', type: 'main' },
                { id: 'panel-e8', category: 'Story & Narrative', title: 'Player Choice Impact', type: 'main' },
                { id: 'panel-e9', category: 'Story & Narrative', title: 'Emotional Storytelling', type: 'main' },
                { id: 'panel-e10', category: 'Story & Narrative', title: 'Story Structure in Games', type: 'main' }
            ]
        },
        {
            id: 'morning-break',
            type: 'break',
            title: 'Morning Break',
            timeRange: '10.30am - 10.55am (25 mins)'
        },
        {
            id: 'mid-morning',
            timeRange: '10.55am - 11.45am',
            title: 'Mid Morning Sessions',
            theme: 'mid', // Controls styling (bright yellow theme)
            events: [
                { id: 'panel-b1', category: 'Game Design', title: 'Panel: The Future of Multiplayer Design', type: 'big' },
                { id: 'panel-b2', category: 'Business', title: 'Workshop: Monetization Strategies for Indies', type: 'big' },
                { id: 'panel-m1', category: 'Audio & Music', title: 'Game Audio Fundamentals', type: 'main' },
                { id: 'panel-m2', category: 'Game Design', title: 'Level Design Principles', type: 'main' },
                { id: 'panel-m3', category: 'UI/UX', title: 'UI/UX for Indies', type: 'main' },
                { id: 'panel-m4', category: 'Technical', title: 'Procedural Generation', type: 'main' },
                { id: 'panel-m5', category: 'Community', title: 'Community Management 101', type: 'main' }
            ]
        },
        {
            id: 'late-morning',
            timeRange: '11.55am - 12.25pm',
            title: 'Late Morning Sessions',
            theme: 'early',
            events: [
                { id: 'panel-l1', category: 'Programming', title: 'Advanced Programming Techniques', type: 'main' },
                { id: 'panel-l2', category: 'Art & Design', title: 'Visual Design for Indie Games', type: 'main' },
                { id: 'panel-l3', category: 'Marketing', title: 'Social Media for Game Developers', type: 'main' },
                { id: 'panel-l4', category: 'Business', title: 'Funding Your Game Studio', type: 'main' },
                { id: 'panel-l5', category: 'Career', title: 'Portfolio Building Workshop', type: 'main' },
                { id: 'panel-l6', category: 'Story & Narrative', title: 'Panel: Advanced Story Development', type: 'big' },
                { id: 'panel-l7', category: 'Art & Design', title: 'Workshop: Character Design Mastery', type: 'big' }
            ]
        },
        {
            id: 'lunch-break',
            type: 'break',
            title: 'Lunch Break',
            timeRange: '12.25pm - 1.25pm (1 hour)'
        }
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MORNING_SCHEDULE_DATA;
} else if (typeof window !== 'undefined') {
    window.MORNING_SCHEDULE_DATA = MORNING_SCHEDULE_DATA;
}
