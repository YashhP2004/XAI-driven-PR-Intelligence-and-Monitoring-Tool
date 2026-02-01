import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'alert' | 'success' | 'danger';
    hover?: boolean;
}

export function GlassCard({
    children,
    className,
    variant = 'default',
    hover = false
}: GlassCardProps) {
    const variantStyles = {
        default: 'border-white/10',
        alert: 'border-yellow-500/30 bg-yellow-500/5',
        success: 'border-green-500/30 bg-green-500/5',
        danger: 'border-red-500/30 bg-red-500/5',
    };

    return (
        <div
            className={cn(
                'glass-card rounded-2xl p-6',
                hover && 'glass-card-hover cursor-pointer',
                variantStyles[variant],
                className
            )}
        >
            {children}
        </div>
    );
}
