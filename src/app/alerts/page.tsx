'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AlertStream } from '@/components/alerts/AlertStream';
import { SpikeDetectionChart } from '@/components/alerts/SpikeDetectionChart';
import { CrisisKeywords } from '@/components/alerts/CrisisKeywords';
import { AlertFilters } from '@/components/alerts/AlertFilters';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';
import * as api from '@/lib/api';
import type { Alert, SpikeDetection, KeywordTrend, AlertSeverity, Sentiment, Platform } from '@/types';

import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';

export default function AlertsPage() {
    const { selectedBrand } = useStore();
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [spikes, setSpikes] = useState<SpikeDetection[]>([]);
    const [keywords, setKeywords] = useState<KeywordTrend[]>([]);

    // Filter states
    const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all');
    const [source, setSource] = useState<Platform | 'all'>('all');
    const [sentiment, setSentiment] = useState<Sentiment | 'all'>('all');
    const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | 'custom'>('30d');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function loadAlertsData() {
            setLoading(true);
            try {
                const companyId = selectedBrand.replace(/ /g, '_').toLowerCase();

                const [alertsData, spikesData, keywordsData] = await Promise.all([
                    api.getAlerts(companyId),
                    api.getSpikeDetections(companyId),
                    api.getKeywordTrends(companyId),
                ]);

                setAlerts(alertsData);
                setSpikes(spikesData);
                setKeywords(keywordsData);
            } catch (error) {
                console.error('Failed to load alerts data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadAlertsData();
    }, [selectedBrand]);

    // Filter alerts
    const filteredAlerts = alerts.filter(alert => {
        if (severity !== 'all' && alert.severity !== severity) return false;
        if (source !== 'all' && alert.source !== source) return false;
        if (sentiment !== 'all' && alert.sentiment !== sentiment) return false;
        if (searchQuery && !alert.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !alert.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        // Date range filter
        const now = new Date();
        const alertDate = new Date(alert.timestamp);
        const hoursDiff = (now.getTime() - alertDate.getTime()) / (1000 * 60 * 60);

        if (dateRange === '24h' && hoursDiff > 24) return false;
        if (dateRange === '7d' && hoursDiff > 24 * 7) return false;
        if (dateRange === '30d' && hoursDiff > 24 * 30) return false;

        return true;
    });

    const handleClearFilters = () => {
        setSeverity('all');
        setSource('all');
        setSentiment('all');
        setDateRange('30d');
        setSearchQuery('');
    };

    const handleKeywordClick = (keyword: string) => {
        setSearchQuery(keyword);
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
                        Risk Alerts
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        Real-time threat monitoring and explainable AI analysis for {selectedBrand}
                        <Tooltip content="This page monitors potential PR crises by analyzing sentiment spikes, engaging negative content, and trending crisis keywords." position="right">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        </Tooltip>
                    </p>
                </div>

                {/* Filters */}
                <AlertFilters
                    severity={severity}
                    source={source}
                    sentiment={sentiment}
                    dateRange={dateRange}
                    searchQuery={searchQuery}
                    onSeverityChange={setSeverity}
                    onSourceChange={setSource}
                    onSentimentChange={setSentiment}
                    onDateRangeChange={setDateRange}
                    onSearchChange={setSearchQuery}
                    onClearAll={handleClearFilters}
                />

                {/* Spike Detection Chart */}
                {loading ? (
                    <SkeletonCard />
                ) : (
                    <SpikeDetectionChart spikes={spikes} />
                )}

                {/* Crisis Keywords */}
                {loading ? (
                    <SkeletonCard />
                ) : (
                    <CrisisKeywords keywords={keywords} onKeywordClick={handleKeywordClick} />
                )}

                {/* Alert Stream */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-heading font-semibold">
                            Alert Stream
                            <span className="ml-2 text-sm text-gray-400">
                                ({filteredAlerts.length} {filteredAlerts.length === 1 ? 'alert' : 'alerts'})
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    ) : (
                        <AlertStream alerts={filteredAlerts} />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
