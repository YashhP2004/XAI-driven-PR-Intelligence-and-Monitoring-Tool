'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { SHAPWordHighlighter } from '@/components/xai/SHAPWordHighlighter';
import { FeatureContributionBars } from '@/components/xai/FeatureContributionBars';
import { ConfidenceScore } from '@/components/xai/ConfidenceScore';
import { ReasoningPanel } from '@/components/xai/ReasoningPanel';
import { GlassCard } from '@/components/ui/GlassCard';
import { generateFeatureContributions, generateConfidenceScore, generateReasoning } from '@/lib/mockXAI';
import { Tooltip } from '@/components/ui/Tooltip';
import { Info } from 'lucide-react';



export default function AIInsightsPage() {
    const sampleText = "The product is terrible and disappointing. Customer service was broken and the experience was awful. However, the delivery was excellent and packaging was great.";

    const features = generateFeatureContributions({ negativeRatio: 0.65, mentionCount: 75 });
    const confidence = generateConfidenceScore({ dataPoints: 85, consistency: 0.88 });
    const reasoning = generateReasoning({ type: 'alert', severity: 'high', features });

    return (
        <MainLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
                        AI Insights
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2">
                        Explainable AI features demonstrating how our system makes decisions
                        <Tooltip content="Visualizes the decision-making process of our AI models. Understand *why* an alert was triggered or a recommendation was made." position="right">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                        </Tooltip>
                    </p>
                </div>

                {/* SHAP Word Highlighter Demo */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">
                        SHAP Word Highlighting
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Words are highlighted based on their importance to the AI&apos;s decision.
                        <span className="text-red-400"> Red</span> indicates negative impact,
                        <span className="text-green-400"> green</span> indicates positive impact.
                        Hover over highlighted words to see their exact SHAP values.
                    </p>
                    <SHAPWordHighlighter text={sampleText} className="text-lg" />
                </GlassCard>

                {/* Feature Contributions Demo */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">
                        Feature Contribution Analysis
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Shows which features contributed most to the AI&apos;s decision.
                        Hover over the <span className="text-gray-400">ⓘ</span> icons for detailed explanations.
                    </p>
                    <FeatureContributionBars features={features} />
                </GlassCard>

                {/* Confidence Score Demo */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">
                        Confidence Score
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Indicates how confident the AI is in its prediction based on data quality and consistency.
                    </p>
                    <ConfidenceScore
                        score={confidence.score}
                        level={confidence.level}
                        explanation={confidence.explanation}
                        dataQuality={confidence.dataQuality}
                    />
                </GlassCard>

                {/* Reasoning Panel Demo */}
                <div>
                    <h2 className="text-xl font-heading font-semibold mb-4">
                        Plain English Reasoning
                    </h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Translates technical AI decisions into actionable insights.
                    </p>
                    <ReasoningPanel
                        why={reasoning.why}
                        watch={reasoning.watch}
                        actions={reasoning.actions}
                    />
                </div>

                {/* Integration Example */}
                <GlassCard className="p-6">
                    <h2 className="text-xl font-heading font-semibold mb-4">
                        Complete XAI Integration Example
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                        All XAI components working together to explain an alert.
                    </p>

                    <div className="space-y-6">
                        {/* Alert Header with Confidence */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    🔴 CRITICAL - Negative Sentiment Spike
                                </h3>
                                <p className="text-sm text-gray-400">
                                    75 negative mentions detected in the last hour
                                </p>
                            </div>
                        </div>

                        {/* Confidence Score */}
                        <ConfidenceScore
                            score={confidence.score}
                            level={confidence.level}
                            explanation={confidence.explanation}
                            dataQuality={confidence.dataQuality}
                        />

                        {/* Sample Text with SHAP */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-400 mb-2">Sample Mention:</h4>
                            <SHAPWordHighlighter text={sampleText} />
                        </div>

                        {/* Feature Contributions */}
                        <FeatureContributionBars features={features.slice(0, 4)} />

                        {/* Reasoning */}
                        <ReasoningPanel
                            why={reasoning.why}
                            watch={reasoning.watch}
                            actions={reasoning.actions}
                        />
                    </div>
                </GlassCard>
            </div>
        </MainLayout>
    );
}
