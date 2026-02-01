'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types';

interface RiskStatusIndicatorProps {
    level: RiskLevel;
    score: number;
    trend: 'increasing' | 'stable' | 'decreasing';
    lastUpdated: Date;
}

export function RiskStatusIndicator({ level, score, trend, lastUpdated }: RiskStatusIndicatorProps) {
    const config = {
        green: {
            label: 'Low Risk',
            color: 'text-green-400',
            bgColor: 'bg-green-500/20',
            borderColor: 'border-green-500/30',
            glowClass: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]',
            description: 'Brand reputation is healthy with positive sentiment trends',
        },
        amber: {
            label: 'Medium Risk',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            borderColor: 'border-yellow-500/30',
            glowClass: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]',
            description: 'Monitoring required - some negative trends detected',
        },
        red: {
            label: 'High Risk',
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-500/30',
            glowClass: 'shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse-glow',
            description: 'Immediate attention required - significant reputation threats',
        },
    };

    const { label, color, bgColor, borderColor, glowClass, description } = config[level];

    const TrendIcon = trend === 'increasing' ? TrendingUp : trend === 'decreasing' ? TrendingDown : Minus;

    return (
        <GlassCard className={cn('p-8 border-2', borderColor, glowClass)}>
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Current Risk Level</h3>
                    <Tooltip content={description} position="bottom">
                        <div className={cn('text-4xl font-heading font-bold', color)}>
                            {label}
                        </div>
                    </Tooltip>
                </div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={cn('p-4 rounded-full', bgColor)}
                >
                    <AlertTriangle className={cn('w-8 h-8', color)} />
                </motion.div>
            </div>

            <div className="space-y-4">
                {/* Risk Score */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Risk Score</span>
                        <span className={cn('text-2xl font-bold', color)}>{score}</span>
                    </div>
                    <div className="h-2 bg-charcoal-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={cn('h-full rounded-full', level === 'green' ? 'bg-green-500' : level === 'amber' ? 'bg-yellow-500' : 'bg-red-500')}
                        />
                    </div>
                </div>

                {/* Trend */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-sm text-gray-400">24h Trend</span>
                    <div className="flex items-center gap-2">
                        <TrendIcon className={cn('w-4 h-4',
                            trend === 'increasing' ? 'text-red-400' :
                                trend === 'decreasing' ? 'text-green-400' :
                                    'text-gray-400'
                        )} />
                        <span className="text-sm font-medium capitalize">{trend}</span>
                    </div>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-gray-500 pt-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
            </div>
        </GlassCard>
    );
}
