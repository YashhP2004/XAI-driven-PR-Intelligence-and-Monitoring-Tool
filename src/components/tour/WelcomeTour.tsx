'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

interface TourStep {
    target: string; // CSS selector
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export function WelcomeTour() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasSeenTour, setHasSeenTour] = useState(true); // Default to true to prevent flash

    useEffect(() => {
        // Check if user has seen tour
        const seen = localStorage.getItem('has_seen_tour_v1');
        if (!seen) {
            setHasSeenTour(false);
            // Small delay to let page load
            setTimeout(() => setIsOpen(true), 1500);
        }
    }, []);

    const steps: TourStep[] = [
        {
            target: 'body', // General welcome
            title: 'Welcome to SpectraX',
            content: 'Your AI-powered command center for real-time brand monitoring and risk assessment. Let\'s take a quick tour.',
            position: 'bottom'
        },
        {
            target: '[data-tour="risk-score"]',
            title: 'Real-Time Risk Score',
            content: 'Instant assessment of your brand\'s health combining sentiment, crisis keywords, and velocity.',
            position: 'bottom'
        },
        {
            target: '[data-tour="active-alerts"]',
            title: 'Active Alerts',
            content: 'Critical issues requiring your attention. Click any alert to see AI-explained reasons.',
            position: 'bottom'
        },
        {
            target: '[data-tour="sentiment-chart"]',
            title: 'Sentiment Analysis',
            content: 'Track how perception changes over time across news, social media, and forums.',
            position: 'top'
        },
        {
            target: '[data-tour="nav-influencers"]',
            title: 'Influencer Discovery',
            content: 'Find the perfect brand ambassadors with our AI matching engine.',
            position: 'right'
        },
        {
            target: '[data-tour="nav-mentions"]',
            title: 'Mentions Explorer',
            content: 'Review every conversation with entity highlighting and source breakdown.',
            position: 'right'
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem('has_seen_tour_v1', 'true');
    };

    if (hasSeenTour && !isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={handleClose}
                    />

                    {/* Tour Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="relative z-10 w-full max-w-md p-4 pointer-events-auto"
                    >
                        <GlassCard className="p-6 border-electric-500/30 shadow-2xl shadow-electric-500/10">
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xs font-mono text-electric-400 bg-electric-500/10 px-2 py-0.5 rounded">
                                    STEP {currentStep + 1}/{steps.length}
                                </span>
                            </div>

                            <h3 className="text-xl font-heading font-bold gradient-text mb-2">
                                {steps[currentStep].title}
                            </h3>

                            <p className="text-gray-300 mb-6 leading-relaxed">
                                {steps[currentStep].content}
                            </p>

                            <div className="flex items-center justify-between">
                                <button
                                    onClick={handleClose}
                                    className="text-sm text-gray-500 hover:text-white transition-colors"
                                >
                                    Skip Tour
                                </button>

                                <Button onClick={handleNext} className="group">
                                    {currentStep === steps.length - 1 ? 'Get Started' : 'Next Step'}
                                    {currentStep === steps.length - 1 ? (
                                        <Check className="w-4 h-4 ml-2" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    )}
                                </Button>
                            </div>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 bg-charcoal-800 w-full rounded-b-lg overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                    className="h-full bg-electric-500"
                                />
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
