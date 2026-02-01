// Core type definitions matching future API contract

export type RiskLevel = 'green' | 'amber' | 'red';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export type Platform = 'twitter' | 'reddit' | 'news' | 'wikipedia';

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: AlertSeverity;
    timestamp: Date;
    source: Platform;
    relatedMentions: number;
    keywords: string[];
    sentiment: Sentiment;
    isRead: boolean;
}

export interface SentimentData {
    timestamp: Date;
    positive: number;
    neutral: number;
    negative: number;
    overall: number; // -1 to 1 scale
}

export interface Influencer {
    id: string;
    name: string;
    handle: string;
    platform: Platform;
    avatarUrl?: string;
    matchScore: number; // 0-100
    reach: number;
    engagementRate: number;
    toxicityScore: number; // 0-100, lower is better
    recentTopics: string[];
    whyRecommended: string;
}

export interface Mention {
    id: string;
    text: string;
    author: string;
    authorHandle: string;
    platform: Platform;
    timestamp: Date;
    sentiment: Sentiment;
    engagement: {
        likes: number;
        shares: number;
        comments: number;
    };
    entities: string[]; // Highlighted entities (brand names, people, etc.)
    url: string;
    // Additional fields for mentions page
    title?: string;
    content?: string;
    source?: string;
    date?: string;
}

export interface XAIExplanation {
    alertId: string;
    confidence: number; // 0-1
    topFeatures: {
        feature: string;
        contribution: number; // -1 to 1
        explanation: string;
    }[];
    shapValues: {
        word: string;
        value: number; // Importance score
    }[];
    reasoning: string;
    attentionWeights?: number[][]; // Optional for advanced view
}

export interface RiskSummary {
    currentLevel: RiskLevel;
    score: number; // 0-100
    trend: 'increasing' | 'stable' | 'decreasing';
    lastUpdated: Date;
    topThreats: string[];
    recommendation: string;
}

export interface KeywordTrend {
    keyword: string;
    count: number;
    sentiment: Sentiment;
    trend: 'rising' | 'stable' | 'falling';
    intensity: number; // 0-100 for visualization
}

export interface SpikeDetection {
    timestamp: Date;
    metric: string;
    value: number;
    threshold: number;
    anomalyScore: number; // How unusual this spike is
    relatedAlerts: string[]; // Alert IDs
}
