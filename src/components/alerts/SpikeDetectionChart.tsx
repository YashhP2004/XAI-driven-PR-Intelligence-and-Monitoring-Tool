'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Scatter, ScatterChart, ZAxis } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import type { SpikeDetection } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';

interface SpikeDetectionChartProps {
    spikes: SpikeDetection[];
}

export function SpikeDetectionChart({ spikes }: SpikeDetectionChartProps) {
    const [selectedMetric, setSelectedMetric] = useState<string>('mention_volume');

    const metrics = [
        { value: 'mention_volume', label: 'Mention Volume' },
        { value: 'negative_sentiment', label: 'Negative Sentiment' },
        { value: 'engagement_rate', label: 'Engagement Rate' },
        { value: 'share_velocity', label: 'Share Velocity' },
    ];

    // Filter spikes by selected metric
    const filteredSpikes = spikes.filter(s => s.metric === selectedMetric);

    // Prepare chart data
    const chartData = filteredSpikes.map(spike => ({
        timestamp: spike.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: spike.value,
        threshold: spike.threshold,
        isAnomaly: spike.anomalyScore > 0.7,
        anomalyScore: spike.anomalyScore,
    }));

    const avgThreshold = filteredSpikes.length > 0
        ? filteredSpikes.reduce((sum, s) => sum + s.threshold, 0) / filteredSpikes.length
        : 0;

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-heading font-semibold mb-1 flex items-center gap-2">
                        Spike Detection
                        <Tooltip content="Identifies statistical anomalies in data streams. Red dots indicate values that deviate significantly from the expected baseline." position="top">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        </Tooltip>
                    </h3>
                    <p className="text-sm text-gray-400">Anomaly detection across key metrics</p>
                </div>

                {/* Metric Selector */}
                <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-4 py-2 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20"
                >
                    {metrics.map(metric => (
                        <option key={metric.value} value={metric.value}>
                            {metric.label}
                        </option>
                    ))}
                </select>
            </div>

            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <defs>
                            <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />

                        <XAxis
                            dataKey="timestamp"
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />

                        <YAxis
                            stroke="#9ca3af"
                            style={{ fontSize: '12px' }}
                        />

                        <RechartsTooltip
                            contentStyle={{
                                backgroundColor: '#1a1d2e',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                padding: '12px',
                            }}
                            labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px' }}
                            itemStyle={{ color: '#9ca3af' }}
                        />

                        {/* Threshold Line */}
                        <ReferenceLine
                            y={avgThreshold}
                            stroke="#ef4444"
                            strokeDasharray="5 5"
                            strokeWidth={2}
                            label={{
                                value: 'Threshold',
                                position: 'right',
                                fill: '#ef4444',
                                fontSize: 12,
                            }}
                        />

                        {/* Value Line */}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0ea5e9"
                            strokeWidth={2}
                            dot={(props: any) => {
                                const { cx, cy, payload } = props;
                                if (payload.isAnomaly) {
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill="#ef4444"
                                            stroke="#fff"
                                            strokeWidth={2}
                                            className="animate-pulse"
                                        />
                                    );
                                }
                                return <circle cx={cx} cy={cy} r={4} fill="#0ea5e9" />;
                            }}
                            activeDot={{ r: 6 }}
                            fill="url(#valueGradient)"
                            animationDuration={1000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-400">
                    No spike data available for this metric
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/10 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-electric-500 rounded-full" />
                    <span className="text-gray-400">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-gray-400">Anomaly Detected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-red-500 border-dashed" />
                    <span className="text-gray-400">Threshold</span>
                </div>
            </div>
        </GlassCard>
    );
}
