'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { InfluencerCard } from '@/components/influencers/InfluencerCard';
import { ComparisonView } from '@/components/influencers/ComparisonView';
import { InfluencerFilters } from '@/components/influencers/InfluencerFilters';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useStore } from '@/store/useStore';
import * as api from '@/lib/api';
import type { Influencer, Platform } from '@/types';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';

export default function InfluencersPage() {
    const { selectedBrand } = useStore();
    const [loading, setLoading] = useState(true);
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [comparisonList, setComparisonList] = useState<Influencer[]>([]);

    // Filter states
    const [platform, setPlatform] = useState<Platform | 'all'>('all');
    const [minReach, setMinReach] = useState(0);
    const [maxReach, setMaxReach] = useState(1000000);
    const [minEngagement, setMinEngagement] = useState(0);
    const [maxEngagement, setMaxEngagement] = useState(10);
    const [minMatchScore, setMinMatchScore] = useState(0);
    const [maxToxicity, setMaxToxicity] = useState(100);
    const [sortBy, setSortBy] = useState<'matchScore' | 'reach' | 'engagement' | 'toxicity'>('matchScore');

    useEffect(() => {
        async function loadInfluencers() {
            setLoading(true);
            try {
                const companyId = selectedBrand.replace(/ /g, '_').toLowerCase();
                const data = await api.getInfluencers(companyId);
                setInfluencers(data);
            } catch (error) {
                console.error('Failed to load influencers:', error);
            } finally {
                setLoading(false);
            }
        }

        loadInfluencers();
    }, [selectedBrand]);

    // Filter and sort influencers
    const filteredInfluencers = influencers
        .filter(inf => {
            if (platform !== 'all' && inf.platform !== platform) return false;
            if (inf.reach < minReach || inf.reach > maxReach) return false;
            if (inf.engagementRate < minEngagement || inf.engagementRate > maxEngagement) return false;
            if (inf.matchScore < minMatchScore) return false;
            if (inf.toxicityScore > maxToxicity) return false;
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'matchScore':
                    return b.matchScore - a.matchScore;
                case 'reach':
                    return b.reach - a.reach;
                case 'engagement':
                    return b.engagementRate - a.engagementRate;
                case 'toxicity':
                    return a.toxicityScore - b.toxicityScore;
                default:
                    return 0;
            }
        });

    const handleAddToCompare = (influencer: Influencer) => {
        if (comparisonList.length >= 3) {
            alert('You can only compare up to 3 influencers at a time');
            return;
        }
        if (!comparisonList.find(i => i.id === influencer.id)) {
            setComparisonList([...comparisonList, influencer]);
        }
    };

    const handleRemoveFromCompare = (id: string) => {
        setComparisonList(comparisonList.filter(i => i.id !== id));
    };

    const handleClearComparison = () => {
        setComparisonList([]);
    };

    const handleViewProfile = (influencer: Influencer) => {
        // TODO: Implement detail modal
        console.log('View profile:', influencer);
    };

    const handleClearFilters = () => {
        setPlatform('all');
        setMinReach(0);
        setMaxReach(1000000);
        setMinEngagement(0);
        setMaxEngagement(10);
        setMinMatchScore(0);
        setMaxToxicity(100);
        setSortBy('matchScore');
    };

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
                        Influencer Intelligence
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        Discover and evaluate influencers for brand partnerships with {selectedBrand}
                        <Tooltip content="Our AI analyzes thousands of profiles to find influencers who align with your brand values and have authentic audience engagement." position="right">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        </Tooltip>
                    </p>
                </div>

                {/* Filters */}
                <InfluencerFilters
                    platform={platform}
                    minReach={minReach}
                    maxReach={maxReach}
                    minEngagement={minEngagement}
                    maxEngagement={maxEngagement}
                    minMatchScore={minMatchScore}
                    maxToxicity={maxToxicity}
                    sortBy={sortBy}
                    onPlatformChange={setPlatform}
                    onReachChange={(min, max) => {
                        setMinReach(min);
                        setMaxReach(max);
                    }}
                    onEngagementChange={(min, max) => {
                        setMinEngagement(min);
                        setMaxEngagement(max);
                    }}
                    onMatchScoreChange={setMinMatchScore}
                    onToxicityChange={setMaxToxicity}
                    onSortChange={setSortBy}
                    onClearAll={handleClearFilters}
                />

                {/* Comparison View */}
                {comparisonList.length > 0 && (
                    <ComparisonView
                        influencers={comparisonList}
                        onRemove={handleRemoveFromCompare}
                        onClearAll={handleClearComparison}
                    />
                )}

                {/* Influencer Grid */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-heading font-semibold">
                            Recommended Influencers
                            <span className="ml-2 text-sm text-gray-400">
                                ({filteredInfluencers.length} {filteredInfluencers.length === 1 ? 'influencer' : 'influencers'})
                            </span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    ) : filteredInfluencers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredInfluencers.map(influencer => (
                                <InfluencerCard
                                    key={influencer.id}
                                    influencer={influencer}
                                    onViewProfile={handleViewProfile}
                                    onAddToCompare={handleAddToCompare}
                                    isInComparison={comparisonList.some(i => i.id === influencer.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <p>No influencers found matching your filters</p>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
