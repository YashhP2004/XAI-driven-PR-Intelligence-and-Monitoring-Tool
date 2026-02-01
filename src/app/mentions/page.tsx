'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MentionCard } from '@/components/mentions/MentionCard';
import { MentionFilters } from '@/components/mentions/MentionFilters';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';
import * as api from '@/lib/api';
import type { Mention, Sentiment, Platform } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';

export default function MentionsPage() {
    const { selectedBrand } = useStore();
    const [loading, setLoading] = useState(true);
    const [mentions, setMentions] = useState<Mention[]>([]);
    const [mounted, setMounted] = useState(false);

    // Filter states
    const [source, setSource] = useState<Platform | 'all'>('all');
    const [sentiment, setSentiment] = useState<Sentiment | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'all'>('all');

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        async function loadMentions() {
            setLoading(true);
            try {
                const companyId = selectedBrand.replace(/ /g, '_').toLowerCase();
                const data = await api.getMentions(companyId);
                setMentions(data);
            } catch (error) {
                console.error('Failed to load mentions:', error);
            } finally {
                setLoading(false);
            }
        }

        if (mounted) {
            loadMentions();
        }
    }, [selectedBrand, mounted]);

    // Filter mentions
    const filteredMentions = mentions.filter(mention => {
        // Source filter
        if (source !== 'all' && mention.source !== source) return false;

        // Sentiment filter
        if (sentiment !== 'all' && mention.sentiment?.toLowerCase() !== sentiment) return false;

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesTitle = mention.title?.toLowerCase().includes(query);
            const matchesContent = mention.content?.toLowerCase().includes(query);
            const matchesAuthor = mention.author?.toLowerCase().includes(query);
            if (!matchesTitle && !matchesContent && !matchesAuthor) return false;
        }

        // Date range filter
        if (dateRange !== 'all' && mention.date) {
            const now = new Date();
            const mentionDate = new Date(mention.date);
            const hoursDiff = (now.getTime() - mentionDate.getTime()) / (1000 * 60 * 60);

            if (dateRange === '24h' && hoursDiff > 24) return false;
            if (dateRange === '7d' && hoursDiff > 24 * 7) return false;
            if (dateRange === '30d' && hoursDiff > 24 * 30) return false;
        }

        return true;
    });

    const handleClearFilters = () => {
        setSource('all');
        setSentiment('all');
        setSearchQuery('');
        setDateRange('all');
    };

    // Calculate stats
    const stats = {
        total: filteredMentions.length,
        positive: filteredMentions.filter(m => m.sentiment?.toLowerCase() === 'positive').length,
        neutral: filteredMentions.filter(m => m.sentiment?.toLowerCase() === 'neutral').length,
        negative: filteredMentions.filter(m => m.sentiment?.toLowerCase() === 'negative').length,
    };

    return (
        <MainLayout>
            {!mounted ? (
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
                            Mentions
                        </h1>
                        <p className="text-gray-400">Loading...</p>
                    </div>
                    <div className="space-y-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
                            Mentions
                        </h1>
                        <p className="text-gray-400 flex items-center gap-2">
                            All mentions of {selectedBrand} across news, social media, and forums
                            <Tooltip content="Comprehensive feed of all brand mentions. Use filters to drill down into specific sentiment, sources, or date ranges." position="right">
                                <Info className="w-4 h-4 text-gray-500 cursor-help" />
                            </Tooltip>
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-charcoal-800 rounded-lg border border-white/10 relative group">
                            <div className="text-2xl font-bold text-white">{stats.total}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                Total Mentions
                                <Tooltip content="Total number of mentions matching current filters" position="top">
                                    <Info className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="p-4 bg-charcoal-800 rounded-lg border border-green-500/20 relative group">
                            <div className="text-2xl font-bold text-green-400">{stats.positive}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                Positive
                                <Tooltip content="Mentions with favorable sentiment towards the brand" position="top">
                                    <Info className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="p-4 bg-charcoal-800 rounded-lg border border-gray-500/20 relative group">
                            <div className="text-2xl font-bold text-gray-400">{stats.neutral}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                Neutral
                                <Tooltip content="Mentions with objective or mixed sentiment" position="top">
                                    <Info className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="p-4 bg-charcoal-800 rounded-lg border border-red-500/20 relative group">
                            <div className="text-2xl font-bold text-red-400">{stats.negative}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                Negative
                                <Tooltip content="Mentions with critical or unfavorable sentiment - prioritize these!" position="top">
                                    <Info className="w-3 h-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <MentionFilters
                        source={source}
                        sentiment={sentiment}
                        searchQuery={searchQuery}
                        dateRange={dateRange}
                        onSourceChange={setSource}
                        onSentimentChange={setSentiment}
                        onSearchChange={setSearchQuery}
                        onDateRangeChange={setDateRange}
                        onClearAll={handleClearFilters}
                    />

                    {/* Mentions List */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-heading font-semibold">
                                All Mentions
                                <span className="ml-2 text-sm text-gray-400">
                                    ({filteredMentions.length} {filteredMentions.length === 1 ? 'mention' : 'mentions'})
                                </span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                                <SkeletonCard />
                            </div>
                        ) : filteredMentions.length > 0 ? (
                            <div className="space-y-4">
                                {filteredMentions.map((mention, index) => (
                                    <MentionCard key={mention.id || index} mention={mention} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p>No mentions found matching your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
