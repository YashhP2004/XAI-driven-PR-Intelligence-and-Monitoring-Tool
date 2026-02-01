'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { getCompanies } from '@/lib/api';

export function CommandBar() {
    const { selectedBrand, setSelectedBrand, alertCount } = useStore();
    const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [companies, setCompanies] = useState<Array<{ id: string; display_name: string }>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCompanies() {
            try {
                const companiesData = await getCompanies();
                setCompanies(companiesData);

                // If current selected brand is not in the list, select the first one
                if (companiesData.length > 0 && !companiesData.find(c => c.display_name === selectedBrand)) {
                    setSelectedBrand(companiesData[0].display_name);
                }
            } catch (error) {
                console.error('Failed to load companies:', error);
            } finally {
                setLoading(false);
            }
        }

        loadCompanies();
    }, [selectedBrand, setSelectedBrand]);

    return (
        <header className="h-16 bg-navy-900 border-b border-white/10 flex items-center justify-between px-6">
            {/* Brand Selector */}
            <div className="relative">
                <button
                    onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 transition-colors border border-white/10"
                    disabled={loading}
                >
                    <span className="font-medium text-sm">
                        {loading ? 'Loading...' : selectedBrand}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {brandDropdownOpen && !loading && (
                    <div className="absolute top-full mt-2 left-0 w-64 glass-card rounded-lg p-2 z-50 animate-fade-in">
                        {companies.length === 0 ? (
                            <div className="px-3 py-2 text-sm text-gray-400">
                                No companies found. Run analysis first.
                            </div>
                        ) : (
                            companies.map((company) => (
                                <button
                                    key={company.id}
                                    onClick={() => {
                                        setSelectedBrand(company.display_name);
                                        setBrandDropdownOpen(false);
                                    }}
                                    className={cn(
                                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                                        company.display_name === selectedBrand
                                            ? 'bg-electric-500/20 text-electric-400'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    )}
                                >
                                    {company.display_name}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-2xl mx-8">
                <div
                    className={cn(
                        'relative transition-all duration-200',
                        searchFocused && 'scale-105'
                    )}
                >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search alerts, mentions, influencers... (⌘K)"
                        className="w-full pl-10 pr-4 py-2.5 bg-charcoal-800 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-electric-500/50 focus:ring-2 focus:ring-electric-500/20 transition-all"
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setSearchFocused(false)}
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 bg-charcoal-700 rounded border border-white/10">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Alert Indicator */}
                <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Bell className="w-5 h-5 text-gray-400" />
                    {alertCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse-glow">
                            {alertCount > 9 ? '9+' : alertCount}
                        </span>
                    )}
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-500 to-violet-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium hidden lg:block">Admin</span>
                </button>
            </div>
        </header>
    );
}
