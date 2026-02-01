import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'card' | 'chart' | 'circle';
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
    const variantStyles = {
        text: 'h-4 w-full',
        card: 'h-32 w-full rounded-2xl',
        chart: 'h-64 w-full rounded-xl',
        circle: 'h-12 w-12 rounded-full',
    };

    return (
        <div
            className={cn(
                'animate-pulse bg-gradient-to-r from-charcoal-800 via-charcoal-700 to-charcoal-800 bg-[length:200%_100%]',
                variantStyles[variant],
                className
            )}
            style={{
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
        />
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-card rounded-2xl p-6 space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
    );
}

export function SkeletonChart() {
    return (
        <div className="glass-card rounded-2xl p-6">
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton variant="chart" />
        </div>
    );
}
