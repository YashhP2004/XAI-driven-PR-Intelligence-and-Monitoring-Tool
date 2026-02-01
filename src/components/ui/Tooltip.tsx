'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
}

export function Tooltip({ content, children, position = 'top', className }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={cn(
                            'absolute z-50 px-3 py-2 text-xs text-white rounded-lg pointer-events-none',
                            'bg-charcoal-800 border border-white/20 shadow-xl',
                            'backdrop-blur-sm',
                            'max-w-xs whitespace-normal',
                            positionClasses[position],
                            className
                        )}
                    >
                        {content}

                        {/* Arrow */}
                        <div
                            className={cn(
                                'absolute w-2 h-2 bg-charcoal-800 border-white/20 rotate-45',
                                position === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r',
                                position === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2 border-t border-l',
                                position === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-t',
                                position === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b'
                            )}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
