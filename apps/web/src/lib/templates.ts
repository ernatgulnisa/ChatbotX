import type { Node, Edge } from '@xyflow/react';

export interface BotTemplate {
    id: string;
    name: string;
    description: string;
    nodes: Node[];
    edges: Edge[];
}

export const BOT_TEMPLATES: BotTemplate[] = [
    {
        id: 'welcome',
        name: 'Simple Welcome',
        description: 'A basic greeting bot that sends a welcome message.',
        nodes: [
            {
                id: '1',
                type: 'message',
                position: { x: 250, y: 50 },
                data: { label: 'Welcome Message', content: 'Hello! Welcome to our service. How can we help you today?' },
            },
        ],
        edges: [],
    },
    {
        id: 'lead-gen',
        name: 'Lead Generation',
        description: 'Collects visitor name and email address.',
        nodes: [
            {
                id: '1',
                type: 'message',
                position: { x: 250, y: 0 },
                data: { label: 'Greeting', content: 'Hi there! We would love to get to know you.' },
            },
            {
                id: '2',
                type: 'question',
                position: { x: 250, y: 150 },
                data: { label: 'Ask Name', question: 'What is your name?', variable: 'user_name' },
            },
            {
                id: '3',
                type: 'question',
                position: { x: 250, y: 350 },
                data: { label: 'Ask Email', question: 'Nice to meet you, {user_name}! What is your email?', variable: 'user_email' },
            },
            {
                id: '4',
                type: 'message',
                position: { x: 250, y: 550 },
                data: { label: 'Thank You', content: 'Thanks! We will be in touch soon.' },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' },
        ],
    },
    {
        id: 'support-menu',
        name: 'Support Menu',
        description: 'A menu with options for Sales and Support.',
        nodes: [
            {
                id: '1',
                type: 'button',
                position: { x: 250, y: 50 },
                data: {
                    label: 'Main Menu',
                    content: 'How can we assist you?',
                    options: ['Sales', 'Support', 'Hours'],
                },
            },
            {
                id: '2',
                type: 'message',
                position: { x: 0, y: 300 },
                data: { label: 'Sales Info', content: 'Our sales team is available M-F 9am-5pm. Call us at 555-0123.' },
            },
            {
                id: '3',
                type: 'message',
                position: { x: 250, y: 300 },
                data: { label: 'Support Info', content: 'For support, please email support@example.com.' },
            },
            {
                id: '4',
                type: 'message',
                position: { x: 500, y: 300 },
                data: { label: 'Hours Info', content: 'We are open 24/7 online!' },
            },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2', sourceHandle: 'Sales' },
            { id: 'e1-3', source: '1', target: '3', sourceHandle: 'Support' },
            { id: 'e1-4', source: '1', target: '4', sourceHandle: 'Hours' },
        ],
    },
];
