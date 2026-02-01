'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';
import type { Platform } from '@/types';

interface InfluencerFiltersProps {
    platform: Platform | 'all';
    minReach: number;
    maxReach: number;
    minEngagement: number;
    maxEngagement: number;
    minMatchScore: number;
    maxToxicity: number;
    sortBy: 'matchScore' | 'reach' | 'engagement' | 'toxicity';
    onPlatformChange: (platform: Platform | 'all') => void;
    onReachChange: (min: number, max: number) => void;
    onEngagementChange: (min: number, max: number) => void;
    onMatchScoreChange: (min: number) => void;
    onToxicityChange: (max: number) => void;
    onSortChange: (sort: 'matchScore' | 'reach' | 'engagement' | 'toxicity') => void;
    onClearAll: () => void;
}

export function InfluencerFilters({
    platform,
    minReach,
    maxReach,
    minEngagement,
    maxEngagement,
    minMatchScore,
    maxToxicity,
    sortBy,
    onPlatformChange,
    onReachChange,
    onEngagementChange,
    onMatchScoreChange,
    onToxicityChange,
    onSortChange,
    onClearAll,
}: InfluencerFiltersProps) {
    const platformOptions: Array<Platform | 'all'> = ['all', 'news', 'reddit', 'twitter'];
    const sortOptions = [
        { value: 'matchScore', label: 'Match Score (High to Low)' },
        { value: 'reach', label: 'Reach (High to Low)' },
        { value: 'engagement', label: 'Engagement (High to Low)' },
        { value: 'toxicity', label: 'Toxicity (Low to High)' },
    ];

    const hasActiveFilters =
        platform !== 'all' ||
        minReach > 0 ||
        maxReach < 1000000 ||
        minEngagement > 0 ||
        maxEngagement < 10 ||
        minMatchScore > 0 ||
        maxToxicity < 100;

    return (
        <GlassCard className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Platform Filter */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Platform</label>
                    <select
                        value={platform}
                        onChange={(e) => onPlatformChange(e.target.value as Platform | 'all')}
                        className="w-full px-3 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20"
                    >
                        {platformOptions.map(option => (
                            <option key={option} value={option}>
                                {option === 'all' ? 'All Platforms' : option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Match Score Filter */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">
                        Min Match Score: {minMatchScore}%
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={minMatchScore}
                        onChange={(e) => onMatchScoreChange(Number(e.target.value))}
                        className="w-full h-2 bg-charcoal-800 rounded-lg appearance-none cursor-pointer accent-electric-500"
                    />
                </div>

                {/* Max Toxicity Filter */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">
                        Max Toxicity: {maxToxicity}
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={maxToxicity}
                        onChange={(e) => onToxicityChange(Number(e.target.value))}
                        className="w-full h-2 bg-charcoal-800 rounded-lg appearance-none cursor-pointer accent-electric-500"
                    />
                </div>

                {/* Sort By */}
                <div>
                    <label className="block text-xs text-gray-400 mb-2">Sort By</label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value as any)}
                        className="w-full px-3 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20"
                    >
                        {sortOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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
