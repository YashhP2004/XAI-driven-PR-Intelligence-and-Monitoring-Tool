'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Info } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import type { KeywordTrend } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';

interface CrisisKeywordsProps {
    keywords: KeywordTrend[];
    onKeywordClick?: (keyword: string) => void;
}

export function CrisisKeywords({ keywords, onKeywordClick }: CrisisKeywordsProps) {
    // Filter for negative keywords only
    const crisisKeywords = keywords
        .filter(k => k.sentiment === 'negative')
        .sort((a, b) => b.count - a.count)
        .slice(0, 20);

    const maxCount = Math.max(...crisisKeywords.map(k => k.count), 1);

    return (
        <GlassCard className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-heading font-semibold mb-1 flex items-center gap-2">
                    Crisis Keywords
                    <Tooltip content="Visualizes frequently occurring negative terms. Larger size indicates higher frequency, and red color indicates high intensity." position="top">
                        <Info className="w-4 h-4 text-gray-500 cursor-help" />
                    </Tooltip>
                </h3>
                <p className="text-sm text-gray-400">
                    Trending negative terms - size indicates frequency
                </p>
            </div>

            {crisisKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {crisisKeywords.map((keyword, index) => {
                        const intensity = keyword.count / maxCount;
                        const size = Math.max(0.8, intensity * 1.5);
                        const isRising = keyword.trend === 'rising';

                        return (
                            <motion.button
                                key={keyword.keyword}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03, duration: 0.3 }}
                                onClick={() => onKeywordClick?.(keyword.keyword)}
                                className={cn(
                                    'px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-110 hover:shadow-lg',
                                    'border',
                                    intensity > 0.7
                                        ? 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
                                        : intensity > 0.4
                                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30'
                                            : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/30'
                                )}
                                style={{
                                    fontSize: `${size}rem`,
                                }}
                            >
                                {keyword.keyword}
                                {isRising && (
                                    <TrendingUp className="inline-block w-4 h-4 ml-1 text-red-400" />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-400">
                    No crisis keywords detected
                </div>
            )}

            {/* Stats */}
            {crisisKeywords.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Total Keywords</div>
                        <div className="text-lg font-bold text-white">{crisisKeywords.length}</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Rising Trends</div>
                        <div className="text-lg font-bold text-red-400">
                            {crisisKeywords.filter(k => k.trend === 'rising').length}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1">Total Mentions</div>
                        <div className="text-lg font-bold text-white">
                            {crisisKeywords.reduce((sum, k) => sum + k.count, 0)}
                        </div>
                    </div>
                </div>
            )}
        </GlassCard>
    );
}
