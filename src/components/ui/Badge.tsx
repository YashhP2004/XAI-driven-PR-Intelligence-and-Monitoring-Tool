import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'positive' | 'neutral' | 'negative' | 'low' | 'medium' | 'high' | 'critical';
    className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
    const variantStyles = {
        default: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
        positive: 'bg-green-500/20 text-green-400 border-green-500/30',
        neutral: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        negative: 'bg-red-500/20 text-red-400 border-red-500/30',
        low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        critical: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse-glow',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
