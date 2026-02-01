'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-charcoal-900 text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 flex justify-center"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full" />
                        <AlertTriangle className="w-24 h-24 text-red-500 relative z-10" />
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-heading font-bold gradient-text mb-4"
                >
                    404 - Page Not Found
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 mb-8"
                >
                    The page you are looking for doesn&apos;t exist or has been moved.
                    Let&apos;s get you back to monitoring your PR risks.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link href="/dashboard">
                        <Button className="w-full sm:w-auto gap-2">
                            <Home className="w-4 h-4" />
                            Return to Dashboard
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
