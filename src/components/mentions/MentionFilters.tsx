'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import type { Sentiment, Platform } from '@/types';

interface MentionFiltersProps {
    source: Platform | 'all';
    sentiment: Sentiment | 'all';
    searchQuery: string;
    dateRange: '24h' | '7d' | '30d' | 'all';
    onSourceChange: (source: Platform | 'all') => void;
    onSentimentChange: (sentiment: Sentiment | 'all') => void;
    onSearchChange: (query: string) => void;
    onDateRangeChange: (range: '24h' | '7d' | '30d' | 'all') => void;
    onClearAll: () => void;
}

export function MentionFilters({
    source,
    sentiment,
    searchQuery,
    dateRange,
    onSourceChange,
    onSentimentChange,
    onSearchChange,
    onDateRangeChange,
    onClearAll,
}: MentionFiltersProps) {
    const sourceOptions: Array<Platform | 'all'> = ['all', 'news', 'reddit', 'twitter'];
    const sentimentOptions: Array<Sentiment | 'all'> = ['all', 'positive', 'neutral', 'negative'];
    const dateRangeOptions = [
        { value: '24h', label: 'Last 24 hours' },
        { value: '7d', label: 'Last 7 days' },
        { value: '30d', label: 'Last 30 days' },
        { value: 'all', label: 'All time' },
    ];

    const hasActiveFilters = source !== 'all' || sentiment !== 'all' || dateRange !== 'all' || searchQuery !== '';

    return (
        <GlassCard className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Source Filter */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Source</label>
                    <select
                        value={source}
                        onChange={(e) => onSourceChange(e.target.value as Platform | 'all')}
                        className="w-full px-3 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20"
                    >
                        {sourceOptions.map(option => (
                            <option key={option} value={option}>
                                {option === 'all' ? 'All Sources' : option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sentiment Filter */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Sentiment</label>
                    <select
                        value={sentiment}
                        onChange={(e) => onSentimentChange(e.target.value as Sentiment | 'all')}
                        className="w-full px-3 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20"
                    >
                        {sentimentOptions.map(option => (
                            <option key={option} value={option}>
                                {option === 'all' ? 'All Sentiments' : option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range Filter */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Date Range</label>
                    <select
                        value={dateRange}
                        onChange={(e) => onDateRangeChange(e.target.value as '24h' | '7d' | '30d' | 'all')}
                        className="w-full px-3 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20"
                    >
                        {dateRangeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Search */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Search</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search mentions..."
                            className="w-full pl-10 pr-10 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => onSearchChange('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Clear All Button */}
            {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={onClearAll}>
                        <X className="w-4 h-4 mr-1" />
                        Clear All Filters
                    </Button>
                </div>
            )}
        </GlassCard>
    );
}
