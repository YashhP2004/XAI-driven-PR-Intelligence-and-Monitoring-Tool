'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    AlertTriangle,
    Users,
    Brain,
    MessageSquare,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const navigation = [
    { name: 'Executive Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Risk & Crisis', href: '/risk', icon: AlertTriangle },
    { name: 'Influencers', href: '/influencers', icon: Users },
    { name: 'AI Insights', href: '/ai-insights', icon: Brain },
    { name: 'Mentions', href: '/mentions', icon: MessageSquare },
];

export function Sidebar() {
    const pathname = usePathname();
    const { sidebarCollapsed, toggleSidebar } = useStore();

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-screen bg-charcoal-900 border-r border-white/10 transition-all duration-300 z-40',
                sidebarCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                {!sidebarCollapsed && (
                    <h1 className="text-xl font-heading font-bold gradient-text">
                        SpectraX
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                    aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {sidebarCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                                isActive
                                    ? 'bg-electric-500/20 text-electric-400 border border-electric-500/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                                sidebarCollapsed && 'justify-center'
                            )}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!sidebarCollapsed && (
                                <span className="font-medium text-sm">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            {!sidebarCollapsed && (
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <div className="glass-card p-3 rounded-lg">
                        <p className="text-xs text-gray-400">
                            Mission-critical PR intelligence platform
                        </p>
                    </div>
                </div>
            )}
        </aside>
    );
}
