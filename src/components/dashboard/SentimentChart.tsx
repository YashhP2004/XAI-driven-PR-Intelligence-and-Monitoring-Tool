'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { GlassCard } from '@/components/ui/GlassCard';
import { Tooltip } from '@/components/ui/Tooltip';
import { TrendingUp } from 'lucide-react';
import type { SentimentData } from '@/types';

interface SentimentChartProps {
    data: SentimentData[];
}

export function SentimentChart({ data }: SentimentChartProps) {
    // Transform data for Recharts
    const chartData = data.map(d => ({
        date: d.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        positive: d.positive,
        neutral: d.neutral,
        negative: d.negative,
        overall: (d.overall * 100).toFixed(1),
    }));

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-heading font-semibold mb-1">Sentiment Velocity</h3>
                    <p className="text-sm text-gray-400">30-day sentiment trend analysis</p>
                </div>
                <Tooltip content="Shows the distribution of positive, neutral, and negative sentiment over time" position="left">
                    <div className="p-2 rounded-lg bg-electric-500/10 border border-electric-500/30">
                        <TrendingUp className="w-5 h-5 text-electric-400" />
                    </div>
                </Tooltip>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <defs>
                        <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />

                    <XAxis
                        dataKey="date"
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

                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="line"
                    />

                    <Line
                        type="monotone"
                        dataKey="positive"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ fill: '#22c55e', r: 4 }}
                        activeDot={{ r: 6 }}
                        fill="url(#positiveGradient)"
                        animationDuration={1000}
                    />

                    <Line
                        type="monotone"
                        dataKey="neutral"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                        animationDuration={1000}
                        animationBegin={200}
                    />

                    <Line
                        type="monotone"
                        dataKey="negative"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: '#ef4444', r: 4 }}
                        activeDot={{ r: 6 }}
                        fill="url(#negativeGradient)"
                        animationDuration={1000}
                        animationBegin={400}
                    />
                </LineChart>
            </ResponsiveContainer>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                    <div className="text-xs text-gray-400 mb-1">Avg Positive</div>
                    <div className="text-lg font-bold text-green-400">
                        {(chartData.reduce((sum, d) => sum + d.positive, 0) / chartData.length).toFixed(1)}%
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 mb-1">Avg Neutral</div>
                    <div className="text-lg font-bold text-blue-400">
                        {(chartData.reduce((sum, d) => sum + d.neutral, 0) / chartData.length).toFixed(1)}%
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-400 mb-1">Avg Negative</div>
                    <div className="text-lg font-bold text-red-400">
                        {(chartData.reduce((sum, d) => sum + d.negative, 0) / chartData.length).toFixed(1)}%
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
