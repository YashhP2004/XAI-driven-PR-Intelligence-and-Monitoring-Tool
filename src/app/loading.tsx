export default function Loading() {
    return (
        <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Animated Logo/Spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-charcoal-700 rounded-full" />
                    <div className="absolute inset-0 border-4 border-t-electric-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                </div>

                <div className="text-electric-500 font-mono text-sm animate-pulse">
                    Loading Intelligence...
                </div>
            </div>
        </div>
    );
}
