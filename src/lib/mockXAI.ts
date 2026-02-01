/**
 * Mock XAI Data Generator
 * Generates realistic explainable AI data for demonstrations
 */

import type { XAIExplanation } from '@/types';

// Generate SHAP values for text highlighting
export function generateSHAPValues(text: string): Array<{ word: string; value: number; index: number }> {
    const words = text.split(/\s+/);
    const negativeWords = ['terrible', 'awful', 'bad', 'poor', 'disappointing', 'broken', 'issue', 'problem', 'complaint', 'negative', 'worst', 'hate', 'angry', 'frustrated'];
    const positiveWords = ['excellent', 'great', 'amazing', 'good', 'love', 'best', 'fantastic', 'wonderful', 'perfect', 'outstanding', 'brilliant', 'superb'];

    return words.map((word, index) => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');

        // Check if word is negative
        if (negativeWords.some(neg => cleanWord.includes(neg))) {
            return {
                word,
                value: -(0.5 + Math.random() * 0.5), // -0.5 to -1.0
                index,
            };
        }

        // Check if word is positive
        if (positiveWords.some(pos => cleanWord.includes(pos))) {
            return {
                word,
                value: 0.5 + Math.random() * 0.5, // 0.5 to 1.0
                index,
            };
        }

        // Neutral words
        return {
            word,
            value: (Math.random() - 0.5) * 0.3, // -0.15 to 0.15
            index,
        };
    });
}

// Generate feature contributions
export function generateFeatureContributions(context: {
    sentiment?: string;
    mentionCount?: number;
    negativeRatio?: number;
}): Array<{ feature: string; contribution: number; explanation: string }> {
    const { sentiment = 'negative', mentionCount = 50, negativeRatio = 0.6 } = context;

    const features = [
        {
            feature: 'negative_keywords',
            contribution: negativeRatio * 100,
            explanation: 'Frequency of crisis-related words like "broken", "terrible", "issue"',
        },
        {
            feature: 'sentiment_score',
            contribution: sentiment === 'negative' ? 45 : sentiment === 'positive' ? -30 : 20,
            explanation: 'Overall sentiment polarity from -1 (very negative) to +1 (very positive)',
        },
        {
            feature: 'mention_velocity',
            contribution: Math.min(40, (mentionCount / 100) * 40),
            explanation: 'Rate of mention increase compared to baseline',
        },
        {
            feature: 'source_credibility',
            contribution: 15 + Math.random() * 10,
            explanation: 'Trustworthiness and reach of sources mentioning the brand',
        },
        {
            feature: 'engagement_rate',
            contribution: 10 + Math.random() * 15,
            explanation: 'How viral the mentions are (likes, shares, comments)',
        },
        {
            feature: 'temporal_pattern',
            contribution: 5 + Math.random() * 10,
            explanation: 'Time-based patterns indicating coordinated activity or organic growth',
        },
    ];

    return features.sort((a, b) => b.contribution - a.contribution);
}

// Generate confidence score
export function generateConfidenceScore(context: {
    dataPoints?: number;
    consistency?: number;
}): {
    score: number;
    level: 'very_high' | 'high' | 'medium' | 'low';
    explanation: string;
    dataQuality: string;
} {
    const { dataPoints = 50, consistency = 0.8 } = context;

    // Calculate confidence based on data points and consistency
    let score = Math.min(95, (dataPoints / 100) * 50 + consistency * 50);
    score = Math.max(50, score); // Minimum 50%

    let level: 'very_high' | 'high' | 'medium' | 'low';
    let explanation: string;

    if (score >= 90) {
        level = 'very_high';
        explanation = 'Very high confidence based on large sample size and consistent patterns';
    } else if (score >= 75) {
        level = 'high';
        explanation = 'High confidence with sufficient data and clear trends';
    } else if (score >= 60) {
        level = 'medium';
        explanation = 'Moderate confidence - monitor for additional data points';
    } else {
        level = 'low';
        explanation = 'Low confidence due to limited data or inconsistent patterns';
    }

    const dataQuality = dataPoints >= 100 ? 'Excellent' : dataPoints >= 50 ? 'Good' : dataPoints >= 20 ? 'Fair' : 'Limited';

    return { score, level, explanation, dataQuality };
}

// Generate plain English reasoning
export function generateReasoning(context: {
    type: 'alert' | 'sentiment' | 'risk';
    severity?: string;
    features?: Array<{ feature: string; contribution: number }>;
}): {
    why: string[];
    watch: string[];
    actions: string[];
} {
    const { type, severity = 'high', features = [] } = context;

    const topFeature = features[0];
    const secondFeature = features[1];

    let why: string[] = [];
    let watch: string[] = [];
    let actions: string[] = [];

    if (type === 'alert') {
        why = [
            `High frequency of negative keywords detected (${topFeature?.contribution.toFixed(0)}% contribution)`,
            `Sentiment score ${secondFeature ? `and ${secondFeature.feature.replace('_', ' ')} ` : ''}dropped below threshold`,
            `Mention velocity increased ${Math.floor(Math.random() * 3 + 2)}x above baseline`,
        ];

        watch = [
            'Monitor "broken", "terrible", "disappointed" keywords',
            'Track sentiment trend over next 24 hours',
            'Check if mentions are from credible sources',
            'Observe engagement patterns for viral spread',
        ];

        actions = [
            'Prepare response statement addressing key concerns',
            'Engage with top negative mentions to show responsiveness',
            'Monitor competitor mentions for context',
            'Alert PR team for potential escalation',
        ];
    } else if (type === 'sentiment') {
        why = [
            `Sentiment analysis based on ${Math.floor(Math.random() * 50 + 50)} recent mentions`,
            `${topFeature?.contribution.toFixed(0)}% of signal from ${topFeature?.feature.replace('_', ' ')}`,
            'Consistent pattern across multiple sources',
        ];

        watch = [
            'Sentiment trend direction over time',
            'Ratio of positive to negative mentions',
            'Source diversity and credibility',
        ];

        actions = [
            'Continue monitoring sentiment shifts',
            'Identify root causes of sentiment changes',
            'Engage with community to improve perception',
        ];
    } else if (type === 'risk') {
        why = [
            `Risk assessment based on ${features.length} contributing factors`,
            `Primary risk driver: ${topFeature?.feature.replace('_', ' ')} (${topFeature?.contribution.toFixed(0)}%)`,
            `${severity.charAt(0).toUpperCase() + severity.slice(1)} severity level triggered`,
        ];

        watch = [
            'Negative sentiment ratio trends',
            'Mention volume spikes',
            'Source credibility changes',
            'Engagement rate anomalies',
        ];

        actions = [
            'Review and update crisis response plan',
            'Monitor situation closely for next 48 hours',
            'Prepare stakeholder communication',
            'Consider proactive engagement strategy',
        ];
    }

    return { why, watch, actions };
}

// Generate complete XAI explanation
export function generateXAIExplanation(alertId: string): XAIExplanation {
    const features = generateFeatureContributions({ negativeRatio: 0.65 });
    const confidence = generateConfidenceScore({ dataPoints: 75, consistency: 0.85 });
    const reasoning = generateReasoning({ type: 'alert', severity: 'high', features });

    return {
        alertId,
        confidence: confidence.score / 100,
        topFeatures: features.slice(0, 5).map(f => ({
            feature: f.feature,
            contribution: f.contribution / 100,
            explanation: f.explanation,
        })),
        shapValues: [
            { word: 'terrible', value: -0.85 },
            { word: 'broken', value: -0.72 },
            { word: 'disappointed', value: -0.68 },
            { word: 'issue', value: -0.55 },
            { word: 'excellent', value: 0.45 },
        ],
        reasoning: reasoning.why.join(' ') + ' ' + reasoning.actions.join(' '),
    };
}
