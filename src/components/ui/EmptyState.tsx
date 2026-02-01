import React from 'react';
import { AlertCircle, Inbox, Search, TrendingUp } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: 'inbox' | 'search' | 'alert' | 'trending';
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const icons = {
    inbox: Inbox,
    search: Search,
    alert: AlertCircle,
    trending: TrendingUp,
};

export function EmptyState({
    icon = 'inbox',
    title,
    description,
    action
}: EmptyStateProps) {
    const Icon = icons[icon];

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="glass-card rounded-full p-6 mb-4">
                <Icon className="w-12 h-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-400 max-w-md mb-6">
                {description}
            </p>
            {action && (
                <Button onClick={action.onClick} variant="primary">
                    {action.label}
                </Button>
            )}
        </div>
    );
}
