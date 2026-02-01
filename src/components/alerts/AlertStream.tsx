'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ExternalLink, Clock, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { ConfidenceScore } from '@/components/xai/ConfidenceScore';
import { FeatureContributionBars } from '@/components/xai/FeatureContributionBars';
import { ReasoningPanel } from '@/components/xai/ReasoningPanel';
import { SHAPWordHighlighter } from '@/components/xai/SHAPWordHighlighter';
import { cn, formatRelativeTime, getSeverityColor } from '@/lib/utils';
import { generateConfidenceScore, generateReasoning, generateFeatureContributions } from '@/lib/mockXAI';
import type { Alert, XAIExplanation } from '@/types';

interface AlertStreamProps {
    alerts: Alert[];
    onAlertClick?: (alert: Alert) => void;
}

interface AlertCardProps {
    alert: Alert;
    xaiExplanation?: XAIExplanation;
    onLoadExplanation: () => void;
}

function AlertCard({ alert, xaiExplanation, onLoadExplanation }: AlertCardProps) {
    const [expanded, setExpanded] = useState(false);

    const handleExpand = () => {
        if (!expanded && !xaiExplanation) {
            onLoadExplanation();
        }
        setExpanded(!expanded);
    };

    return (
        <motion.div
            layout
            className={cn(
                'rounded-lg border transition-all duration-200',
                alert.severity === 'critical' && 'border-red-500/30 bg-red-500/5 animate-pulse-glow',
                alert.severity === 'high' && 'border-orange-500/30 bg-orange-500/5',
                alert.severity === 'medium' && 'border-yellow-500/30 bg-yellow-500/5',
                alert.severity === 'low' && 'border-blue-500/30 bg-blue-500/5',
                !alert.isRead && 'border-l-4'
            )}
        >
            {/* Alert Header */}
            <button
                onClick={handleExpand}
                className="w-full p-4 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-start gap-3">
                    {/* Severity Indicator */}
                    <div className={cn(
                        'p-2 rounded-lg flex-shrink-0 mt-1',
                        alert.severity === 'critical' && 'bg-red-500/20',
                        alert.severity === 'high' && 'bg-orange-500/20',
                        alert.severity === 'medium' && 'bg-yellow-500/20',
                        alert.severity === 'low' && 'bg-blue-500/20'
                    )}>
                        <TrendingUp className={cn('w-5 h-5', getSeverityColor(alert.severity))} />
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="font-semibold text-white">{alert.title}</h3>
                            <Badge variant={alert.severity}>{alert.severity.toUpperCase()}</Badge>
                        </div>

                        <p className="text-sm text-gray-400 mb-3">{alert.description}</p>

                        {/* Metadata */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatRelativeTime(alert.timestamp)}
                            </div>
                            <div>{alert.relatedMentions} mentions</div>
                            <div className="capitalize">{alert.source}</div>
                        </div>

                        {/* Keywords */}
                        {alert.keywords && alert.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                                {alert.keywords.map((keyword, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-0.5 text-xs bg-charcoal-800 text-gray-400 rounded"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Expand Icon */}
                    <div className="flex-shrink-0 mt-1">
                        {expanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </button>

            {/* Expanded Content - XAI Explanation */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 border-t border-white/10">
                            {xaiExplanation ? (
                                <div className="pt-4 space-y-4">
                                    {/* Confidence Score with new component */}
                                    <ConfidenceScore
                                        score={(xaiExplanation.confidence * 100)}
                                        level={xaiExplanation.confidence > 0.9 ? 'very_high' : xaiExplanation.confidence > 0.75 ? 'high' : xaiExplanation.confidence > 0.6 ? 'medium' : 'low'}
                                        explanation={`Based on ${alert.relatedMentions} mentions with consistent patterns`}
                                        dataQuality={alert.relatedMentions > 50 ? 'Excellent' : 'Good'}
                                    />

                                    {/* Alert Description with SHAP highlighting */}
                                    <div>
                                        <div className="text-sm font-medium mb-2">Alert Description</div>
                                        <SHAPWordHighlighter text={alert.description} />
                                    </div>

                                    {/* Feature Contributions with new component */}
                                    <FeatureContributionBars
                                        features={xaiExplanation.topFeatures.map(f => ({
                                            feature: f.feature,
                                            contribution: f.contribution * 100,
                                            explanation: f.explanation
                                        }))}
                                    />

                                    {/* Reasoning Panel with new component */}
                                    <ReasoningPanel
                                        why={[
                                            `${alert.relatedMentions} mentions detected with ${alert.sentiment} sentiment`,
                                            `Key features: ${xaiExplanation.topFeatures.slice(0, 2).map(f => f.feature.replace(/_/g, ' ')).join(', ')}`,
                                            `Confidence level: ${(xaiExplanation.confidence * 100).toFixed(0)}%`
                                        ]}
                                        watch={[
                                            `Monitor ${alert.keywords.slice(0, 3).join(', ')} keywords`,
                                            'Track sentiment trend over next 24 hours',
                                            'Check source credibility and engagement patterns'
                                        ]}
                                        actions={[
                                            'Review related mentions for context',
                                            'Prepare response if sentiment worsens',
                                            'Engage with community to address concerns'
                                        ]}
                                    />

                                    {/* Action Button */}
                                    <button className="flex items-center gap-2 text-sm text-electric-400 hover:text-electric-300 transition-colors">
                                        <span>View Related Mentions</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-4 text-center text-gray-400">
                                    Loading explanation...
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function AlertStream({ alerts, onAlertClick }: AlertStreamProps) {
    const [xaiExplanations, setXaiExplanations] = useState<Record<string, XAIExplanation>>({});

    const loadXAIExplanation = async (alertId: string) => {
        // Simulate loading XAI explanation
        // In real app, this would call: await getXAIExplanation(alertId)
        const { getXAIExplanation } = await import('@/lib/api');
        const explanation = await getXAIExplanation(alertId);
        setXaiExplanations(prev => ({ ...prev, [alertId]: explanation }));
    };

    return (
        <div className="space-y-3">
            {alerts.map((alert, index) => (
                <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                    <AlertCard
                        alert={alert}
                        xaiExplanation={xaiExplanations[alert.id]}
                        onLoadExplanation={() => loadXAIExplanation(alert.id)}
                    />
                </motion.div>
            ))}

            {alerts.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>No alerts found</p>
                </div>
            )}
        </div>
    );
}
