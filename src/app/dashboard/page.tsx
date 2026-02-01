'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { RiskStatusIndicator } from '@/components/dashboard/RiskStatusIndicator';
import { SentimentChart } from '@/components/dashboard/SentimentChart';
import { AlertsFeed } from '@/components/dashboard/AlertsFeed';
import { InfluencerRecommendations } from '@/components/dashboard/InfluencerRecommendations';
import { SkeletonCard, SkeletonChart } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';
import * as api from '@/lib/api';
import type { RiskSummary, SentimentData, Alert, Influencer } from '@/types';

import { WelcomeTour } from '@/components/tour/WelcomeTour';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';

export default function DashboardPage() {
    const { selectedBrand } = useStore();
    const [loading, setLoading] = useState(true);
    const [riskSummary, setRiskSummary] = useState<RiskSummary | null>(null);
    const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);

    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true);
            try {
                const companyId = selectedBrand.replace(/ /g, '_').toLowerCase();

                const [risk, sentiment, alertsData, influencersData] = await Promise.all([
                    api.getRiskSummary(companyId),
                    api.getSentimentData(companyId),
                    api.getAlerts(companyId),
                    api.getInfluencers(companyId),
                ]);

                setRiskSummary(risk);
                setSentimentData(sentiment);
                setAlerts(alertsData);
                setInfluencers(influencersData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [selectedBrand]);

    return (
        <MainLayout>
            <WelcomeTour />
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
                        Executive Dashboard
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        Real-time PR intelligence and risk monitoring for {selectedBrand}
                        <Tooltip content="This dashboard aggregates data from news, social media, and industry reports to provide a comprehensive view of your brand's reputation." position="right">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        </Tooltip>
                    </p>
                </div>

                {/* Risk Status */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1" data-tour="risk-score">
                        {loading || !riskSummary ? (
                            <SkeletonCard />
                        ) : (
                            <div className="relative">
                                <RiskStatusIndicator
                                    level={riskSummary.currentLevel}
                                    score={riskSummary.score}
                                    trend={riskSummary.trend}
                                    lastUpdated={riskSummary.lastUpdated}
                                />
                                <div className="absolute top-4 right-4 z-10">
                                    <Tooltip content="Composite score (0-100) combining sentiment, mention velocity, and crisis keywords. Higher score indicates higher risk." position="left">
                                        <Info className="w-4 h-4 text-gray-500 hover:text-white transition-colors cursor-help" />
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2" data-tour="sentiment-chart">
                        {loading || sentimentData.length === 0 ? (
                            <SkeletonChart />
                        ) : (
                            <div className="relative">
                                <SentimentChart data={sentimentData} />
                                <div className="absolute top-4 right-4 z-10 pointer-events-auto">
                                    <Tooltip content="7-day sentiment trend analysis showing net sentiment score over time. Positive values indicate favorable perception." position="left">
                                        <Info className="w-4 h-4 text-gray-500 hover:text-white transition-colors cursor-help" />
                                    </Tooltip>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alerts and Influencers */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div data-tour="active-alerts">
                        {loading ? (
                            <SkeletonCard />
                        ) : (
                            <div className="relative h-full">
                                <AlertsFeed alerts={alerts} maxItems={5} />
                            </div>
                        )}
                    </div>

                    <div>
                        {loading ? (
                            <SkeletonCard />
                        ) : (
                            <InfluencerRecommendations influencers={influencers} maxItems={3} />
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                {riskSummary && (
                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-heading font-semibold mb-3">Recommended Actions</h3>
                        <div className="space-y-2">
                            {riskSummary.topThreats.map((threat, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm">
                                    <span className="text-electric-400 font-bold">{i + 1}.</span>
                                    <span className="text-gray-300">{threat}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-sm text-gray-400 italic">
                                💡 {riskSummary.recommendation}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
