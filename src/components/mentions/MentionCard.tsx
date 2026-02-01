'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, MessageCircle, ThumbsUp, Share2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { cn, formatRelativeTime } from '@/lib/utils';
import type { Mention } from '@/types';

interface MentionCardProps {
    mention: Mention;
    index: number;
}

function getSentimentColor(sentiment: string): string {
    const s = sentiment.toLowerCase();
    if (s === 'positive') return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (s === 'negative') return 'text-red-400 bg-red-500/10 border-red-500/30';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
}

function getSourceIcon(source: string) {
    switch (source.toLowerCase()) {
        case 'twitter':
            return '𝕏';
        case 'reddit':
            return '🤖';
        case 'news':
            return '📰';
        default:
            return '📝';
    }
}

export function MentionCard({ mention, index }: MentionCardProps) {
    const [mounted, setMounted] = useState(false);
    const sentiment = mention.sentiment || 'neutral';
    const source = mention.source || 'unknown';

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
        >
            <GlassCard className="p-5 hover:border-electric-500/30 transition-all duration-200">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        {/* Source Badge */}
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{getSourceIcon(source)}</span>
                            <Badge variant="default" className="capitalize">
                                {source}
                            </Badge>
                        </div>

                        {/* Sentiment Badge */}
                        <Badge className={cn('capitalize', getSentimentColor(sentiment))}>
                            {sentiment}
                        </Badge>
                    </div>

                    {/* Date - Client-side only to prevent hydration errors */}
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {mounted && mention.date ? formatRelativeTime(new Date(mention.date)) : 'Loading...'}
                    </div>
                </div>

                {/* Title */}
                {mention.title && (
                    <h3 className="font-semibold text-white mb-2 line-clamp-2">
                        {mention.title}
                    </h3>
                )}

                {/* Content - Simplified without entity highlighting for now */}
                {mention.content && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-3">
                        {mention.content}
                    </p>
                )}

                {/* Author */}
                {mention.author && (
                    <div className="text-sm text-gray-500 mb-3">
                        by <span className="text-electric-400">{mention.author}</span>
                    </div>
                )}

                {/* Footer with Engagement Metrics */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        {mention.engagement && (
                            <>
                                {mention.engagement.likes !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp className="w-3 h-3" />
                                        {mention.engagement.likes}
                                    </div>
                                )}
                                {mention.engagement.comments !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <MessageCircle className="w-3 h-3" />
                                        {mention.engagement.comments}
                                    </div>
                                )}
                                {mention.engagement.shares !== undefined && (
                                    <div className="flex items-center gap-1">
                                        <Share2 className="w-3 h-3" />
                                        {mention.engagement.shares}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Link */}
                    {mention.url && (
                        <a
                            href={mention.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-electric-400 hover:text-electric-300 transition-colors"
                        >
                            <span>View Source</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </GlassCard>
        </motion.div>
    );
}
