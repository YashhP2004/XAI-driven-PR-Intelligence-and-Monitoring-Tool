'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateSHAPValues } from '@/lib/mockXAI';

interface SHAPWordHighlighterProps {
    text: string;
    className?: string;
}

function getSHAPColor(value: number): string {
    const absValue = Math.abs(value);

    if (value > 0) {
        // Positive impact - green
        if (absValue > 0.7) return 'bg-green-500/40 border-green-500/60';
        if (absValue > 0.4) return 'bg-green-500/25 border-green-500/40';
        return 'bg-green-500/10 border-green-500/20';
    } else if (value < 0) {
        // Negative impact - red
        if (absValue > 0.7) return 'bg-red-500/40 border-red-500/60';
        if (absValue > 0.4) return 'bg-red-500/25 border-red-500/40';
        return 'bg-red-500/10 border-red-500/20';
    }

    // Neutral
    return '';
}

export function SHAPWordHighlighter({ text, className }: SHAPWordHighlighterProps) {
    const shapValues = generateSHAPValues(text);

    return (
        <div className={cn('leading-relaxed', className)}>
            {shapValues.map(({ word, value, index }) => {
                const absValue = Math.abs(value);
                const isSignificant = absValue > 0.3;

                if (!isSignificant) {
                    return (
                        <span key={index} className="text-gray-300">
                            {word}{' '}
                        </span>
                    );
                }

                return (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, backgroundColor: 'transparent' }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                            'relative inline-block px-1 py-0.5 rounded border transition-all cursor-help',
                            getSHAPColor(value)
                        )}
                        title={`SHAP value: ${value.toFixed(3)} (${value > 0 ? 'positive' : 'negative'} impact)`}
                    >
                        {word}
                        {' '}
                    </motion.span>
                );
            })}
        </div>
    );
}
