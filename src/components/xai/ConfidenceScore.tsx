'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfidenceScoreProps {
    score: number; // 0-100
    level: 'very_high' | 'high' | 'medium' | 'low';
    explanation: string;
    dataQuality?: string;
    className?: string;
}

function getConfidenceColor(level: string): string {
    switch (level) {
        case 'very_high':
            return 'text-green-400 border-green-500/30 bg-green-500/10';
        case 'high':
            return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10';
        case 'medium':
            return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
        case 'low':
            return 'text-red-400 border-red-500/30 bg-red-500/10';
        default:
            return 'text-gray-400 border-gray-500/30 bg-gray-500/10';
    }
}

function getConfidenceIcon(level: string) {
    switch (level) {
        case 'very_high':
            return CheckCircle2;
        case 'high':
            return AlertCircle;
        case 'medium':
            return AlertTriangle;
        case 'low':
            return XCircle;
        default:
            return AlertCircle;
    }
}

export function ConfidenceScore({
    score,
    level,
    explanation,
    dataQuality,
    className
}: ConfidenceScoreProps) {
    const Icon = getConfidenceIcon(level);
    const circumference = 2 * Math.PI * 45; // radius = 45
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className={cn('p-4 rounded-lg border', getConfidenceColor(level), className)}>
            <div className="flex items-start gap-4">
                {/* Circular Progress */}
                <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-white/10"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={cn(
                                level === 'very_high' && 'text-green-400',
                                level === 'high' && 'text-yellow-400',
                                level === 'medium' && 'text-orange-400',
                                level === 'low' && 'text-red-400'
                            )}
                        />
                    </svg>

                    {/* Percentage in center */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.3 }}
                            className="text-2xl font-bold"
                        >
                            {score}%
                        </motion.span>
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <h4 className="font-semibold text-white">
                            {level.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Confidence
                        </h4>
                    </div>

                    <p className="text-sm text-gray-300 mb-2">
                        {explanation}
                    </p>

                    {dataQuality && (
                        <div className="text-xs text-gray-400">
                            Data Quality: <span className="font-medium text-gray-300">{dataQuality}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
