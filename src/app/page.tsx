'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldAlert, BarChart3, Users, Zap, Search, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-navy-900 text-white overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-electric-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5 bg-navy-900/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-400 to-indigo-600 flex items-center justify-center shadow-lg shadow-electric-500/20">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-heading font-bold text-xl tracking-wide">SpectraX</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>

                    <Link href="/dashboard">
                        <Button className="px-6">
                            Launch Dashboard
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs font-semibold uppercase tracking-wider mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-500"></span>
                            </span>
                            Next-Gen PR Monitoring
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
                            Predict & Prevent <br />
                            <span className="gradient-text">PR Crises</span> Before They Hit
                        </h1>

                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            The world&apos;s first AI-driven PR intelligence platform. Monitor millions of data points, detect anomalies, and get actionable recommendations in real-time.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/dashboard">
                                <Button className="h-12 px-8 text-lg group w-full sm:w-auto">
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <button className="h-12 px-8 text-lg text-gray-300 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-all w-full sm:w-auto">
                                Watch Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-20 bg-charcoal-900/50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 text-center">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                            Intelligence at Scale
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Replace your outdated media monitoring tools with AI that actually understands context, sentiment, and risk.
                        </p>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={<ShieldAlert className="w-8 h-8 text-red-400" />}
                            title="Crisis Detection"
                            description="Identify potential PR risks hours before they go viral. Our AI analyzes sentiment velocity and anomaly spikes."
                            variants={itemVariants}
                        />
                        <FeatureCard
                            icon={<BrainCircuit className="w-8 h-8 text-electric-400" />}
                            title="XAI Explanations"
                            description="Don't just trust the score. See exactly why an alert was triggered with transparent, explainable AI insights."
                            variants={itemVariants}
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8 text-purple-400" />}
                            title="Influencer Matching"
                            description="Find the perfect brand ambassadors. Our engine matches audience demographics and values to your brand."
                            variants={itemVariants}
                        />
                    </motion.div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-20 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <Stat value="2M+" label="Sources Monitored" />
                    <Stat value="99.9%" label="Uptime Reliability" />
                    <Stat value="<5min" label="Alert Latency" />
                    <Stat value="500+" label="Enterprise Brands" />
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-navy-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-electric-500/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-electric-400" />
                        </div>
                        <span className="font-heading font-bold text-lg">SpectraX</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        © 2024 SpectraX Inc. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description, variants }: { icon: React.ReactNode, title: string, description: string, variants: any }) {
    return (
        <motion.div
            variants={variants}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-electric-500/30 hover:bg-white/[0.07] transition-all group"
        >
            <div className="mb-6 p-3 rounded-lg bg-navy-900 w-fit border border-white/10 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="text-xl font-heading font-semibold mb-3 text-white">
                {title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    );
}

function Stat({ value, label }: { value: string, label: string }) {
    return (
        <div>
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{value}</div>
            <div className="text-gray-500 text-sm uppercase tracking-wider">{label}</div>
        </div>
    );
}
