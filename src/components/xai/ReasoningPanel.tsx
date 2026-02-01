'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface ReasoningPanelProps {
    why: string[];
    watch: string[];
    actions: string[];
    className?: string;
}

export function ReasoningPanel({ why, watch, actions, className }: ReasoningPanelProps) {
    return (
        <GlassCard className={cn('p-5', className)}>
            <div className="space-y-5">
                {/* Why This Happened */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-5 h-5 text-electric-400" />
                        <h4 className="font-semibold text-white">Why This Happened</h4>
                    </div>
                    <ul className="space-y-2">
                        {why.map((reason, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-2 text-sm text-gray-300"
                            >
                                <span className="text-electric-400 mt-1">•</span>
                                <span>{reason}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* What to Watch */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Eye className="w-5 h-5 text-yellow-400" />
                        <h4 className="font-semibold text-white">What to Watch</h4>
                    </div>
                    <ul className="space-y-2">
                        {watch.map((item, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-start gap-2 text-sm text-gray-300"
                            >
                                <span className="text-yellow-400 mt-1">•</span>
                                <span>{item}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>

                {/* Recommended Actions */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <h4 className="font-semibold text-white">Recommended Actions</h4>
                    </div>
                    <ul className="space-y-2">
                        {actions.map((action, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                                className="flex items-start gap-2 text-sm text-gray-300"
                            >
                                <span className="text-green-400 mt-1">•</span>
                                <span>{action}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </GlassCard>
    );
}
