'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureContribution {
    feature: string;
    contribution: number;
    explanation: string;
}

interface FeatureContributionBarsProps {
    features: FeatureContribution[];
    className?: string;
}

function getFeatureColor(contribution: number): string {
    if (contribution > 50) return 'bg-gradient-to-r from-red-500 to-red-600';
    if (contribution > 30) return 'bg-gradient-to-r from-orange-500 to-orange-600';
    if (contribution > 0) return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    if (contribution > -30) return 'bg-gradient-to-r from-blue-500 to-blue-600';
    return 'bg-gradient-to-r from-green-500 to-green-600';
}

function formatFeatureName(feature: string): string {
    return feature
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function FeatureContributionBars({ features, className }: FeatureContributionBarsProps) {
    const maxContribution = Math.max(...features.map(f => Math.abs(f.contribution)));

    return (
        <div className={cn('space-y-3', className)}>
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Top Contributing Features</h4>

            {features.map((feature, index) => {
                const percentage = (Math.abs(feature.contribution) / maxContribution) * 100;

                return (
                    <div key={feature.feature} className="space-y-1">
                        {/* Feature name and percentage */}
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium">
                                    {formatFeatureName(feature.feature)}
                                </span>
                                <div className="group relative">
                                    <HelpCircle className="w-3 h-3 text-gray-500 cursor-help" />
                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-10 w-64 p-2 bg-charcoal-800 border border-white/10 rounded-lg text-xs text-gray-300">
                                        {feature.explanation}
                                    </div>
                                </div>
                            </div>
                            <span className="text-electric-400 font-semibold">
                                {feature.contribution.toFixed(0)}%
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="h-3 bg-charcoal-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.1,
                                    ease: 'easeOut'
                                }}
                                className={cn(
                                    'h-full rounded-full',
                                    getFeatureColor(feature.contribution)
                                )}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
