'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageCircle, Shield, ExternalLink, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn, formatNumber } from '@/lib/utils';
import type { Influencer } from '@/types';

interface InfluencerCardProps {
    influencer: Influencer;
    onViewProfile: (influencer: Influencer) => void;
    onAddToCompare: (influencer: Influencer) => void;
    isInComparison?: boolean;
}

function getMatchScoreColor(score: number): string {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
}

function getToxicityColor(score: number): string {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
}

function getPlatformIcon(platform: string) {
    switch (platform) {
        case 'twitter':
            return '𝕏';
        case 'reddit':
            return '🤖';
        case 'news':
            return '📰';
        default:
            return '👤';
    }
}

export function InfluencerCard({
    influencer,
    onViewProfile,
    onAddToCompare,
    isInComparison = false,
}: InfluencerCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
            className="group"
        >
            <GlassCard className="p-6 h-full hover:shadow-xl hover:shadow-electric-500/20 transition-all duration-300">
                {/* Header with Avatar and Match Score */}
                <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={influencer.avatarUrl}
                            alt={influencer.name}
                            className="w-16 h-16 rounded-full border-2 border-electric-500/30"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-charcoal-800 rounded-full flex items-center justify-center text-xs border border-white/10">
                            {getPlatformIcon(influencer.platform)}
                        </div>
                    </div>

                    {/* Name and Match Score */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{influencer.name}</h3>
                        <p className="text-sm text-gray-400 truncate">{influencer.handle}</p>

                        {/* Match Score */}
                        <div className="mt-2">
                            <div className={cn('text-2xl font-bold', getMatchScoreColor(influencer.matchScore))}>
                                {influencer.matchScore}%
                            </div>
                            <div className="text-xs text-gray-500">Match Score</div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {/* Reach */}
                    <div className="p-3 bg-charcoal-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4 text-electric-400" />
                            <span className="text-xs text-gray-400">Reach</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                            {formatNumber(influencer.reach)}
                        </div>
                    </div>

                    {/* Engagement */}
                    <div className="p-3 bg-charcoal-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-xs text-gray-400">Engagement</span>
                        </div>
                        <div className="text-lg font-bold text-white">
                            {influencer.engagementRate.toFixed(1)}%
                        </div>
                    </div>

                    {/* Toxicity */}
                    <div className="p-3 bg-charcoal-800 rounded-lg col-span-2">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400">Toxicity Score</span>
                            </div>
                            <span className={cn('text-lg font-bold', getToxicityColor(influencer.toxicityScore))}>
                                {influencer.toxicityScore}
                            </span>
                        </div>
                        <div className="h-2 bg-charcoal-900 rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all',
                                    influencer.toxicityScore <= 30 ? 'bg-green-500' :
                                        influencer.toxicityScore <= 60 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                )}
                                style={{ width: `${influencer.toxicityScore}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Recent Topics */}
                {influencer.recentTopics && influencer.recentTopics.length > 0 && (
                    <div className="mb-4">
                        <div className="text-xs text-gray-400 mb-2">Recent Topics</div>
                        <div className="flex flex-wrap gap-1">
                            {influencer.recentTopics.slice(0, 3).map((topic, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 text-xs bg-electric-500/10 text-electric-400 rounded border border-electric-500/20"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Why Recommended */}
                <div className="mb-4 p-3 bg-electric-500/5 border border-electric-500/20 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">Why Recommended</div>
                    <p className="text-sm text-gray-300 line-clamp-2">
                        {influencer.whyRecommended}
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onViewProfile(influencer)}
                        className="flex-1"
                    >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Profile
                    </Button>
                    <Button
                        variant={isInComparison ? 'secondary' : 'outline'}
                        size="sm"
                        onClick={() => onAddToCompare(influencer)}
                        disabled={isInComparison}
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Platform Badge */}
                <Badge
                    variant="default"
                    className="absolute top-4 right-4 capitalize"
                >
                    {influencer.platform}
                </Badge>
            </GlassCard>
        </motion.div>
    );
}
