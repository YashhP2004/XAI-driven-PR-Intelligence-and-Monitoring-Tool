'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, MessageCircle, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn, formatNumber } from '@/lib/utils';
import type { Influencer } from '@/types';

interface InfluencerRecommendationsProps {
    influencers: Influencer[];
    maxItems?: number;
}

export function InfluencerRecommendations({ influencers, maxItems = 5 }: InfluencerRecommendationsProps) {
    const displayInfluencers = influencers.slice(0, maxItems);

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-heading font-semibold mb-1">Recommended Influencers</h3>
                    <p className="text-sm text-gray-400">High-match, low-risk opportunities</p>
                </div>
                <Tooltip content="Influencers ranked by reach, engagement, and brand alignment" position="left">
                    <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/30">
                        <Users className="w-5 h-5 text-violet-400" />
                    </div>
                </Tooltip>
            </div>

            <div className="space-y-4">
                {displayInfluencers.map((influencer, index) => (
                    <motion.div
                        key={influencer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="p-4 rounded-lg border border-white/10 hover:border-violet-500/30 hover:bg-white/5 transition-all duration-200"
                    >
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                                <img
                                    src={influencer.avatarUrl}
                                    alt={influencer.name}
                                    className="w-12 h-12 rounded-full border-2 border-violet-500/30"
                                />
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-charcoal-900 rounded-full flex items-center justify-center border border-white/10">
                                    <span className="text-xs">{influencer.platform === 'twitter' ? '𝕏' : '🔴'}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <h4 className="font-medium text-white">{influencer.name}</h4>
                                        <p className="text-sm text-gray-400">{influencer.handle}</p>
                                    </div>
                                    <Tooltip content={`Match score based on reach, engagement, and topic relevance`} position="left">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-violet-400">{influencer.matchScore}</div>
                                            <div className="text-xs text-gray-500">match</div>
                                        </div>
                                    </Tooltip>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 mb-3">
                                    <Tooltip content="Total follower reach" position="top">
                                        <div className="flex items-center gap-1.5">
                                            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-sm font-medium">{formatNumber(influencer.reach)}</span>
                                        </div>
                                    </Tooltip>

                                    <Tooltip content="Average engagement rate" position="top">
                                        <div className="flex items-center gap-1.5">
                                            <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                                            <span className="text-sm font-medium">{influencer.engagementRate.toFixed(1)}%</span>
                                        </div>
                                    </Tooltip>

                                    <Tooltip content="Toxicity risk score (lower is better)" position="top">
                                        <div className="flex items-center gap-1.5">
                                            <Shield className={cn(
                                                'w-3.5 h-3.5',
                                                influencer.toxicityScore < 30 ? 'text-green-400' :
                                                    influencer.toxicityScore < 60 ? 'text-yellow-400' :
                                                        'text-red-400'
                                            )} />
                                            <span className="text-sm font-medium">{influencer.toxicityScore}</span>
                                        </div>
                                    </Tooltip>
                                </div>

                                {/* Topics */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {influencer.recentTopics.map((topic, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-0.5 text-xs bg-violet-500/10 text-violet-400 rounded border border-violet-500/20"
                                        >
                                            {topic}
                                        </span>
                                    ))}
                                </div>

                                {/* Why Recommended */}
                                <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">
                                    &quot;{influencer.whyRecommended}&quot;
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button variant="primary" size="sm" className="flex-1">
                                        Engage
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {influencers.length > maxItems && (
                <button className="w-full mt-4 py-2 text-sm text-violet-400 hover:text-violet-300 transition-colors">
                    View all {influencers.length} recommendations →
                </button>
            )}
        </GlassCard>
    );
}
