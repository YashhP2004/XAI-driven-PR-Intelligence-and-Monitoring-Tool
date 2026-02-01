'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { CommandBar } from './CommandBar';
import { useStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
    children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const { sidebarCollapsed } = useStore();

    return (
        <div className="min-h-screen bg-navy-900">
            <Sidebar />

            <div
                className={cn(
                    'transition-all duration-300',
                    sidebarCollapsed ? 'ml-20' : 'ml-64'
                )}
            >
                <CommandBar />

                <main className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
