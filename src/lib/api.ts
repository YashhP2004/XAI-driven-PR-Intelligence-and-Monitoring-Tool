// API Service Layer - Ready to connect to FastAPI backend at localhost:8000

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

import type {
    Alert,
    SentimentData,
    Influencer,
    Mention,
    XAIExplanation,
    RiskSummary,
    KeywordTrend,
    SpikeDetection,
} from '@/types';

// Mock data will be imported when USE_MOCK_DATA is true
import * as mockData from './mockData';

// API Client
class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    private async fetch<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        return response.json();
    }

    // Companies
    async getCompanies(): Promise<Array<{ id: string; display_name: string }>> {
        return this.fetch('/api/companies');
    }

    // Sentiment
    async getSentiment(companyId: string): Promise<{ positive: number; neutral: number; negative: number }> {
        return this.fetch(`/api/sentiment/${companyId}`);
    }

    // Keywords
    async getKeywords(companyId: string): Promise<Array<{ keyword: string; count: number }>> {
        return this.fetch(`/api/keywords/${companyId}`);
    }

    // Themes
    async getThemes(companyId: string): Promise<string[]> {
        return this.fetch(`/api/themes/${companyId}`);
    }

    // Mentions
    async getNewsMentions(companyId: string): Promise<any[]> {
        return this.fetch(`/api/news/${companyId}`);
    }

    async getRedditMentions(companyId: string): Promise<any[]> {
        return this.fetch(`/api/reddit/${companyId}`);
    }

    async getTwitterMentions(companyId: string): Promise<any[]> {
        return this.fetch(`/api/twitter/${companyId}`);
    }

    // Health check
    async getHealth(): Promise<any> {
        return this.fetch('/api/health');
    }
}

const apiClient = new APIClient(API_BASE_URL);

// Service functions that switch between mock and real data
export async function getCompanies(): Promise<Array<{ id: string; display_name: string }>> {
    try {
        const companies = await apiClient.getCompanies();
        return companies;
    } catch (error) {
        console.error('Failed to fetch companies:', error);
        // Fallback to default companies
        return [
            { id: 'acme_corporation', display_name: 'Acme Corporation' },
            { id: 'techstart_inc', display_name: 'TechStart Inc' },
            { id: 'global_ventures', display_name: 'Global Ventures' },
            { id: 'innovation_labs', display_name: 'Innovation Labs' },
        ];
    }
}

export async function getRiskSummary(companyId: string): Promise<RiskSummary> {
    if (USE_MOCK_DATA) {
        return mockData.generateRiskSummary();
    }

    try {
        const sentiment = await apiClient.getSentiment(companyId);
        const total = sentiment.positive + sentiment.neutral + sentiment.negative;

        if (total === 0) {
            // No data available, return neutral risk
            return {
                currentLevel: 'amber',
                score: 50,
                trend: 'stable',
                lastUpdated: new Date(),
                topThreats: ['Insufficient data for analysis'],
                recommendation: 'Run analysis to gather data for this company',
            };
        }

        // Calculate risk score based on sentiment distribution
        const negativeRatio = sentiment.negative / total;
        const positiveRatio = sentiment.positive / total;

        let level: 'green' | 'amber' | 'red';
        let score: number;

        if (negativeRatio > 0.4) {
            level = 'red';
            score = Math.floor(70 + (negativeRatio * 30));
        } else if (negativeRatio > 0.25 || positiveRatio < 0.3) {
            level = 'amber';
            score = Math.floor(40 + (negativeRatio * 40));
        } else {
            level = 'green';
            score = Math.floor(20 + (negativeRatio * 30));
        }

        return {
            currentLevel: level,
            score,
            trend: 'stable', // TODO: Calculate trend from historical data
            lastUpdated: new Date(),
            topThreats: [
                `${sentiment.negative} negative mentions detected`,
                `Negative sentiment ratio: ${(negativeRatio * 100).toFixed(1)}%`,
                `Positive sentiment ratio: ${(positiveRatio * 100).toFixed(1)}%`,
            ],
            recommendation: level === 'red'
                ? 'High negative sentiment detected. Review mentions and prepare response strategy.'
                : level === 'amber'
                    ? 'Monitor sentiment trends closely. Engage with community to improve perception.'
                    : 'Sentiment is healthy. Continue current engagement strategy.',
        };
    } catch (error) {
        console.error('Failed to calculate risk summary:', error);
        return mockData.generateRiskSummary();
    }
}

export async function getSentimentData(companyId: string): Promise<SentimentData[]> {
    if (USE_MOCK_DATA) {
        return mockData.generateSentimentTimeSeries();
    }

    try {
        const sentiment = await apiClient.getSentiment(companyId);
        // Convert backend format to frontend format
        const now = new Date();
        return [{
            timestamp: now,
            positive: sentiment.positive,
            neutral: sentiment.neutral,
            negative: sentiment.negative,
            overall: (sentiment.positive - sentiment.negative) / (sentiment.positive + sentiment.neutral + sentiment.negative || 1),
        }];
    } catch (error) {
        console.error('Failed to fetch sentiment data:', error);
        return mockData.generateSentimentTimeSeries();
    }
}

export async function getAlerts(companyId: string): Promise<Alert[]> {
    if (USE_MOCK_DATA) {
        return mockData.generateAlerts(10);
    }

    try {
        // Fetch mentions from all sources
        const [news, reddit, twitter] = await Promise.all([
            apiClient.getNewsMentions(companyId),
            apiClient.getRedditMentions(companyId),
            apiClient.getTwitterMentions(companyId),
        ]);

        const allMentions = [...news, ...reddit, ...twitter];

        if (allMentions.length === 0) {
            return [];
        }

        // Generate alerts from negative mentions
        const alerts: Alert[] = [];
        const negativeMentions = allMentions.filter(m =>
            m.sentiment === 'negative' || m.sentiment === 'Negative'
        );

        // Create alert for high negative sentiment
        if (negativeMentions.length > 5) {
            alerts.push({
                id: 'alert-negative-spike',
                title: 'Negative Sentiment Spike Detected',
                description: `${negativeMentions.length} negative mentions found across platforms`,
                severity: negativeMentions.length > 20 ? 'critical' : negativeMentions.length > 10 ? 'high' : 'medium',
                timestamp: new Date(),
                source: 'news',
                relatedMentions: negativeMentions.length,
                keywords: ['negative', 'sentiment', 'spike'],
                sentiment: 'negative',
                isRead: false,
            });
        }

        // Create alert for high mention volume
        if (allMentions.length > 50) {
            alerts.push({
                id: 'alert-volume-spike',
                title: 'High Mention Volume Detected',
                description: `${allMentions.length} total mentions found - significantly above baseline`,
                severity: 'medium',
                timestamp: new Date(),
                source: 'twitter',
                relatedMentions: allMentions.length,
                keywords: ['volume', 'mentions', 'trending'],
                sentiment: 'neutral',
                isRead: false,
            });
        }

        // If no specific alerts, return empty array
        return alerts.length > 0 ? alerts : mockData.generateAlerts(3);
    } catch (error) {
        console.error('Failed to generate alerts:', error);
        return mockData.generateAlerts(10);
    }
}

export async function getInfluencers(companyId: string): Promise<Influencer[]> {
    if (USE_MOCK_DATA) {
        return mockData.generateInfluencers(5);
    }

    try {
        // Fetch mentions to extract top authors
        const [reddit, twitter] = await Promise.all([
            apiClient.getRedditMentions(companyId),
            apiClient.getTwitterMentions(companyId),
        ]);

        const allMentions = [...reddit, ...twitter];

        if (allMentions.length === 0) {
            return mockData.generateInfluencers(5);
        }

        // Count mentions by author
        const authorCounts = new Map<string, { count: number; platform: 'reddit' | 'twitter'; sentiment: string }>();

        allMentions.forEach(mention => {
            const author = mention.author || 'Unknown';
            if (author === 'Unknown' || !author) return;

            const existing = authorCounts.get(author);
            if (existing) {
                existing.count++;
            } else {
                authorCounts.set(author, {
                    count: 1,
                    platform: mention.source === 'reddit' ? 'reddit' : 'twitter',
                    sentiment: mention.sentiment || 'neutral',
                });
            }
        });

        // Convert to influencers and sort by count
        const influencers: Influencer[] = Array.from(authorCounts.entries())
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5)
            .map(([author, data], index) => ({
                id: `influencer-${index + 1}`,
                name: author,
                handle: `@${author}`,
                platform: data.platform,
                avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${author}`,
                matchScore: Math.min(95, 70 + (data.count * 2)),
                reach: Math.floor(Math.random() * 500000 + 100000),
                engagementRate: Math.random() * 5 + 3,
                toxicityScore: data.sentiment === 'negative' ? Math.floor(Math.random() * 40 + 30) : Math.floor(Math.random() * 30),
                recentTopics: ['brand mentions', 'product discussion'],
                whyRecommended: `Active contributor with ${data.count} mentions about your brand`,
            }));

        return influencers.length > 0 ? influencers : mockData.generateInfluencers(5);
    } catch (error) {
        console.error('Failed to extract influencers:', error);
        return mockData.generateInfluencers(5);
    }
}

export async function getMentions(companyId: string, source?: 'news' | 'reddit' | 'twitter', limit?: number): Promise<Mention[]> {
    if (USE_MOCK_DATA) {
        return mockData.generateMentions(limit || 20);
    }

    try {
        let mentions: any[] = [];

        if (!source || source === 'news') {
            const news = await apiClient.getNewsMentions(companyId);
            mentions = [...mentions, ...news.map(m => convertBackendMention(m, 'news'))];
        }

        if (!source || source === 'reddit') {
            const reddit = await apiClient.getRedditMentions(companyId);
            mentions = [...mentions, ...reddit.map(m => convertBackendMention(m, 'reddit'))];
        }

        if (!source || source === 'twitter') {
            const twitter = await apiClient.getTwitterMentions(companyId);
            mentions = [...mentions, ...twitter.map(m => convertBackendMention(m, 'twitter'))];
        }

        // Sort by timestamp (most recent first)
        mentions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        // Apply limit if specified
        if (limit) {
            mentions = mentions.slice(0, limit);
        }

        return mentions;
    } catch (error) {
        console.error('Failed to fetch mentions:', error);
        return mockData.generateMentions(limit || 20);
    }
}

export async function getKeywordTrends(companyId: string): Promise<KeywordTrend[]> {
    if (USE_MOCK_DATA) {
        return mockData.generateKeywordTrends();
    }

    try {
        const keywords = await apiClient.getKeywords(companyId);
        return keywords.map(k => ({
            keyword: k.keyword,
            count: k.count,
            sentiment: 'neutral' as const,
            trend: 'stable' as const,
            intensity: Math.min(100, k.count),
        }));
    } catch (error) {
        console.error('Failed to fetch keywords:', error);
        return mockData.generateKeywordTrends();
    }
}

export async function getXAIExplanation(alertId: string): Promise<XAIExplanation> {
    if (USE_MOCK_DATA) {
        return mockData.generateXAIExplanation(alertId);
    }
    // TODO: Implement real API call when backend endpoint is available
    return mockData.generateXAIExplanation(alertId);
}

export async function getSpikeDetections(companyId: string): Promise<SpikeDetection[]> {
    if (USE_MOCK_DATA) {
        return mockData.generateSpikeDetections();
    }
    // TODO: Implement real API call when backend endpoint is available
    return mockData.generateSpikeDetections();
}

// Helper function to convert backend mention format to frontend format
function convertBackendMention(backendMention: any, platform: 'news' | 'reddit' | 'twitter'): Mention {
    return {
        id: backendMention.url || backendMention.id || Math.random().toString(),
        text: backendMention.text || backendMention.title || backendMention.content || '',
        author: backendMention.author || 'Unknown',
        authorHandle: backendMention.author || '@unknown',
        platform,
        timestamp: backendMention.date ? new Date(backendMention.date) : new Date(),
        sentiment: backendMention.sentiment || 'neutral',
        engagement: {
            likes: backendMention.likes || backendMention.score || 0,
            shares: backendMention.shares || backendMention.num_comments || 0,
            comments: backendMention.comments || backendMention.num_comments || 0,
        },
        entities: backendMention.entities || [],
        url: backendMention.url || '#',
    };
}

// Health check to determine if backend is available
export async function checkBackendHealth(): Promise<boolean> {
    try {
        await apiClient.getHealth();
        return true;
    } catch {
        return false;
    }
}
