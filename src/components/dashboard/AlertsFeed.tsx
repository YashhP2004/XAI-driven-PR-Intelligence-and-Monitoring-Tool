'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { cn, formatRelativeTime, getSeverityColor } from '@/lib/utils';
import type { Alert } from '@/types';

interface AlertsFeedProps {
    alerts: Alert[];
    maxItems?: number;
}

export function AlertsFeed({ alerts, maxItems = 5 }: AlertsFeedProps) {
    const displayAlerts = alerts.slice(0, maxItems);

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-heading font-semibold mb-1">Real-time Alerts</h3>
                    <p className="text-sm text-gray-400">{alerts.length} active alerts</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-electric-500 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400">Live</span>
                </div>
            </div>

            <div className="space-y-3">
                {displayAlerts.map((alert, index) => (
                    <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className={cn(
                            'p-4 rounded-lg border transition-all duration-200 hover:bg-white/5 cursor-pointer',
                            alert.severity === 'critical' && 'border-red-500/30 bg-red-500/5 animate-pulse-glow',
                            alert.severity === 'high' && 'border-orange-500/30 bg-orange-500/5',
                            alert.severity === 'medium' && 'border-yellow-500/30 bg-yellow-500/5',
                            alert.severity === 'low' && 'border-blue-500/30 bg-blue-500/5',
                            !alert.isRead && 'border-l-4'
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <div className={cn(
                                'p-2 rounded-lg flex-shrink-0',
                                alert.severity === 'critical' && 'bg-red-500/20',
                                alert.severity === 'high' && 'bg-orange-500/20',
                                alert.severity === 'medium' && 'bg-yellow-500/20',
                                alert.severity === 'low' && 'bg-blue-500/20'
                            )}>
                                <AlertCircle className={cn('w-4 h-4', getSeverityColor(alert.severity))} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h4 className="font-medium text-sm text-white line-clamp-1">
                                        {alert.title}
                                    </h4>
                                    <Badge variant={alert.severity}>{alert.severity}</Badge>
                                </div>

                                <p className="text-xs text-gray-400 line-clamp-2 mb-3">
                                    {alert.description}
                                </p>

                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {formatRelativeTime(alert.timestamp)}
                                        </div>
                                        <div className="text-gray-500">
                                            {alert.relatedMentions} mentions
                                        </div>
                                    </div>

                                    <button className="flex items-center gap-1 text-electric-400 hover:text-electric-300 transition-colors">
                                        <span>View</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Keywords */}
                                {alert.keywords && alert.keywords.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {alert.keywords.slice(0, 3).map((keyword, i) => (
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
                        </div>
                    </motion.div>
                ))}
            </div>

            {alerts.length > maxItems && (
                <button className="w-full mt-4 py-2 text-sm text-electric-400 hover:text-electric-300 transition-colors">
                    View all {alerts.length} alerts →
                </button>
            )}
        </GlassCard>
    );
}
