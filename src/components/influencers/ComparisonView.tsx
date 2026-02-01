'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Users, MessageCircle, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { cn, formatNumber } from '@/lib/utils';
import type { Influencer } from '@/types';

interface ComparisonViewProps {
    influencers: Influencer[];
    onRemove: (id: string) => void;
    onClearAll: () => void;
}

export function ComparisonView({ influencers, onRemove, onClearAll }: ComparisonViewProps) {
    if (influencers.length === 0) return null;

    const maxReach = Math.max(...influencers.map(i => i.reach), 1);
    const maxEngagement = Math.max(...influencers.map(i => i.engagementRate), 1);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <GlassCard className="p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-heading font-semibold">
                        Influencer Comparison ({influencers.length}/3)
                    </h3>
                    <Button variant="ghost" size="sm" onClick={onClearAll}>
                        <X className="w-4 h-4 mr-1" />
                        Clear All
                    </Button>
                </div>

                <div className={cn(
                    'grid gap-4',
                    influencers.length === 1 && 'grid-cols-1',
                    influencers.length === 2 && 'grid-cols-2',
                    influencers.length === 3 && 'grid-cols-3'
                )}>
                    <AnimatePresence mode="popLayout">
                        {influencers.map((influencer, index) => (
                            <motion.div
                                key={influencer.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative p-4 bg-charcoal-800 rounded-lg"
                            >
                                {/* Remove Button */}
                                <button
                                    onClick={() => onRemove(influencer.id)}
                                    className="absolute top-2 right-2 p-1 hover:bg-red-500/20 rounded transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
                                </button>

                                {/* Avatar and Name */}
                                <div className="flex flex-col items-center mb-4">
                                    <img
                                        src={influencer.avatarUrl}
                                        alt={influencer.name}
                                        className="w-16 h-16 rounded-full border-2 border-electric-500/30 mb-2"
                                    />
                                    <h4 className="font-semibold text-white text-center">{influencer.name}</h4>
                                    <p className="text-sm text-gray-400">{influencer.handle}</p>
                                </div>

                                {/* Match Score */}
                                <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-electric-400">
                                        {influencer.matchScore}%
                                    </div>
                                    <div className="text-xs text-gray-500">Match Score</div>
                                </div>

                                {/* Metrics Comparison */}
                                <div className="space-y-3">
                                    {/* Reach */}
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-gray-400 flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                Reach
                                            </span>
                                            <span className="text-white">{formatNumber(influencer.reach)}</span>
                                        </div>
                                        <div className="h-2 bg-charcoal-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-electric-500 rounded-full"
                                                style={{ width: `${(influencer.reach / maxReach) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Engagement */}
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-gray-400 flex items-center gap-1">
                                                <TrendingUp className="w-3 h-3" />
                                                Engagement
                                            </span>
                                            <span className="text-white">{influencer.engagementRate.toFixed(1)}%</span>
                                        </div>
                                        <div className="h-2 bg-charcoal-900 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: `${(influencer.engagementRate / maxEngagement) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Toxicity */}
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-gray-400 flex items-center gap-1">
                                                <Shield className="w-3 h-3" />
                                                Toxicity
                                            </span>
                                            <span className={cn(
                                                'font-semibold',
                                                influencer.toxicityScore <= 30 ? 'text-green-400' :
                                                    influencer.toxicityScore <= 60 ? 'text-yellow-400' :
                                                        'text-red-400'
                                            )}>
                                                {influencer.toxicityScore}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-charcoal-900 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    'h-full rounded-full',
                                                    influencer.toxicityScore <= 30 ? 'bg-green-500' :
                                                        influencer.toxicityScore <= 60 ? 'bg-yellow-500' :
                                                            'bg-red-500'
                                                )}
                                                style={{ width: `${influencer.toxicityScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Platform */}
                                    <div className="pt-2 border-t border-white/10">
                                        <div className="text-xs text-gray-400">Platform</div>
                                        <div className="text-sm text-white capitalize">{influencer.platform}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </motion.div>
    );
}
