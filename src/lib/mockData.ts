// Mock data generators for demo and development
// This file provides realistic data when backend is not available

import type {
    Alert,
    SentimentData,
    Influencer,
    Mention,
    XAIExplanation,
    RiskSummary,
    KeywordTrend,
    SpikeDetection,
    AlertSeverity,
    Sentiment,
    Platform,
} from '@/types';

const brands = ['Acme Corporation', 'TechStart Inc', 'Global Ventures', 'Innovation Labs'];
const keywords = ['product launch', 'customer service', 'innovation', 'sustainability', 'leadership', 'controversy', 'partnership', 'expansion'];
const authors = ['@techcrunch', '@forbes', '@bloomberg', '@reuters', '@wsj', 'u/tech_enthusiast', 'u/business_insider'];

function randomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}

function randomDate(daysAgo: number = 7): Date {
    const now = new Date();
    const past = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

export function generateRiskSummary(): RiskSummary {
    const levels: Array<'green' | 'amber' | 'red'> = ['green', 'amber', 'red'];
    const level = randomItem(levels);
    const scores = { green: [20, 40], amber: [40, 70], red: [70, 95] };
    const [min, max] = scores[level];

    return {
        currentLevel: level,
        score: Math.floor(Math.random() * (max - min) + min),
        trend: randomItem(['increasing', 'stable', 'decreasing']),
        lastUpdated: new Date(),
        topThreats: [
            'Negative sentiment spike on social media',
            'Competitor product launch',
            'Customer service complaints trending',
        ],
        recommendation: level === 'red'
            ? 'Immediate action required: Address customer concerns and prepare crisis response'
            : level === 'amber'
                ? 'Monitor closely: Engage with influencers and address emerging issues'
                : 'Maintain current strategy: Continue positive engagement',
    };
}

export function generateSentimentTimeSeries(days: number = 30): SentimentData[] {
    const data: SentimentData[] = [];
    const now = new Date();

    for (let i = days; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const positive = Math.floor(Math.random() * 40 + 30);
        const negative = Math.floor(Math.random() * 30 + 10);
        const neutral = 100 - positive - negative;

        data.push({
            timestamp: date,
            positive,
            neutral,
            negative,
            overall: (positive - negative) / 100,
        });
    }

    return data;
}

export function generateAlerts(count: number = 10): Alert[] {
    const severities: AlertSeverity[] = ['low', 'medium', 'high', 'critical'];
    const sentiments: Sentiment[] = ['positive', 'neutral', 'negative'];
    const platforms: Platform[] = ['twitter', 'reddit', 'news', 'wikipedia'];

    const titles = [
        'Negative sentiment spike detected',
        'Unusual mention volume increase',
        'Competitor comparison trending',
        'Customer service complaints rising',
        'Product quality concerns mentioned',
        'Positive brand advocacy detected',
        'Influencer engagement opportunity',
        'Crisis keyword detected',
    ];

    const descriptions = [
        'Social media mentions show increased negative sentiment over the past 24 hours',
        'Mention volume is 3x higher than normal baseline',
        'Users are comparing your product unfavorably to competitors',
        'Customer service response time complaints are trending',
        'Multiple mentions of product defects or quality issues',
        'Brand advocates are actively promoting your products',
        'High-reach influencer mentioned your brand positively',
        'Keywords associated with crisis situations detected',
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: `alert-${i + 1}`,
        title: randomItem(titles),
        description: randomItem(descriptions),
        severity: randomItem(severities),
        timestamp: randomDate(7),
        source: randomItem(platforms),
        relatedMentions: Math.floor(Math.random() * 500 + 50),
        keywords: Array.from({ length: 3 }, () => randomItem(keywords)),
        sentiment: randomItem(sentiments),
        isRead: Math.random() > 0.5,
    }));
}

export function generateInfluencers(count: number = 5): Influencer[] {
    const names = [
        'Sarah Tech', 'Mike Business', 'Emma Innovation', 'John Industry', 'Lisa Digital',
        'Alex Marketing', 'Chris Strategy', 'Taylor Growth', 'Jordan Analytics', 'Casey Brand'
    ];

    const topics = [
        ['technology', 'innovation', 'startups'],
        ['business', 'leadership', 'strategy'],
        ['marketing', 'branding', 'social media'],
        ['sustainability', 'ESG', 'corporate responsibility'],
        ['customer experience', 'service', 'support'],
    ];

    return Array.from({ length: count }, (_, i) => ({
        id: `influencer-${i + 1}`,
        name: names[i % names.length],
        handle: `@${names[i % names.length].toLowerCase().replace(' ', '')}`,
        platform: randomItem(['twitter', 'reddit'] as Platform[]),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        matchScore: Math.floor(Math.random() * 30 + 70),
        reach: Math.floor(Math.random() * 900000 + 100000),
        engagementRate: Math.random() * 8 + 2,
        toxicityScore: Math.floor(Math.random() * 30),
        recentTopics: topics[i % topics.length],
        whyRecommended: 'High reach in target demographic, low toxicity, recent relevant content about industry trends',
    }));
}

export function generateMentions(count: number = 20): Mention[] {
    const texts = [
        'Just tried the new product and I\'m impressed! Great quality and customer service.',
        'Disappointed with the recent update. Several features are now broken.',
        'Neutral experience overall. Product works as advertised but nothing special.',
        'Customer support was incredibly helpful in resolving my issue quickly.',
        'Pricing seems high compared to competitors offering similar features.',
        'Love the company\'s commitment to sustainability and ethical practices.',
        'The latest announcement shows they\'re really listening to customer feedback.',
        'Had a terrible experience with shipping delays and poor communication.',
    ];

    const platforms: Platform[] = ['twitter', 'reddit', 'news'];
    const sentiments: Sentiment[] = ['positive', 'neutral', 'negative'];

    return Array.from({ length: count }, (_, i) => ({
        id: `mention-${i + 1}`,
        text: randomItem(texts),
        author: randomItem(authors).split('/')[1] || randomItem(authors),
        authorHandle: randomItem(authors),
        platform: randomItem(platforms),
        timestamp: randomDate(14),
        sentiment: randomItem(sentiments),
        engagement: {
            likes: Math.floor(Math.random() * 1000),
            shares: Math.floor(Math.random() * 500),
            comments: Math.floor(Math.random() * 200),
        },
        entities: Array.from({ length: 2 }, () => randomItem(keywords)),
        url: `https://example.com/post/${i + 1}`,
    }));
}

export function generateKeywordTrends(): KeywordTrend[] {
    return keywords.map((keyword, i) => ({
        keyword,
        count: Math.floor(Math.random() * 500 + 50),
        sentiment: randomItem(['positive', 'neutral', 'negative'] as Sentiment[]),
        trend: randomItem(['rising', 'stable', 'falling'] as const),
        intensity: Math.floor(Math.random() * 100),
    }));
}

export function generateXAIExplanation(alertId: string): XAIExplanation {
    const features = [
        { feature: 'negative_keywords', contribution: 0.45, explanation: 'High frequency of negative keywords like "disappointed", "broken", "terrible"' },
        { feature: 'sentiment_score', contribution: 0.35, explanation: 'Overall sentiment score is -0.72 (highly negative)' },
        { feature: 'mention_velocity', contribution: 0.15, explanation: 'Mention rate increased 3.2x in last 24 hours' },
        { feature: 'source_credibility', contribution: 0.05, explanation: 'Mentions from high-credibility news sources' },
    ];

    const words = [
        { word: 'disappointed', value: 0.89 },
        { word: 'broken', value: 0.76 },
        { word: 'terrible', value: 0.82 },
        { word: 'issue', value: 0.45 },
        { word: 'problem', value: 0.52 },
    ];

    return {
        alertId,
        confidence: Math.random() * 0.2 + 0.8,
        topFeatures: features,
        shapValues: words,
        reasoning: 'This alert was triggered due to a significant increase in negative sentiment mentions containing crisis-related keywords. The model detected a pattern of customer complaints about product quality and service issues.',
    };
}

export function generateSpikeDetections(): SpikeDetection[] {
    const metrics = ['mention_volume', 'negative_sentiment', 'engagement_rate', 'share_velocity'];

    return Array.from({ length: 5 }, (_, i) => ({
        timestamp: randomDate(3),
        metric: randomItem(metrics),
        value: Math.random() * 1000 + 500,
        threshold: Math.random() * 500 + 200,
        anomalyScore: Math.random() * 0.5 + 0.5,
        relatedAlerts: [`alert-${i + 1}`, `alert-${i + 2}`],
    }));
}
