import { useState, useEffect } from 'react';

interface DashboardLoadingScreenProps {
    progress?: number; // Optional prop for controlled progress
    currentStep?: string; // Optional prop to show current step
}

const DashboardLoadingScreen = ({
    progress: externalProgress,
    currentStep
}: DashboardLoadingScreenProps) => {
    const [internalProgress, setInternalProgress] = useState(0);

    // Use external progress if provided, otherwise use internal
    const progress = externalProgress !== undefined ? externalProgress : internalProgress;

    useEffect(() => {
        if (externalProgress === undefined) {
            const interval = setInterval(() => {
                setInternalProgress(prev => {
                    if (prev >= 0.99) {
                        clearInterval(interval);
                        return 0.99;
                    }
                    return prev + 0.01 + Math.random() * 0.05;
                });
            }, 300);

            return () => clearInterval(interval);
        }
    }, [externalProgress]);

    function getLoadingMessage(progress: number): import("react").ReactNode {
        if (progress < 0.2) {
            return "Initializing analysis...";
        } else if (progress < 0.4) {
            return "Gathering website data...";
        } else if (progress < 0.6) {
            return "Crunching numbers and analyzing content...";
        } else if (progress < 0.8) {
            return "Generating insights...";
        } else if (progress < 0.99) {
            return "Finalizing your dashboard...";
        } else {
            return "Almost done!";
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="relative w-32 h-32 mb-8">
                {/* Outer ring with gradient */}
                <div className="absolute inset-0 border-4 border-transparent rounded-full animate-spin"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent, #00FFFF, transparent)',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude'
                    }}></div>

                {/* Inner circle */}
                <div className="absolute inset-4 rounded-full bg-[#0D1117] flex items-center justify-center">
                    <div className="text-sm font-bold text-[#00FFFF] animate-pulse">
                        {/* {Math.min(99, Math.floor(progress * 100))}% */}
                        Please Wait...
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-[#00FFFF] mb-2">Analyzing Website</h2>

            <p className="text-green-500 max-w-md text-center mb-6 text-lg">
                {currentStep || getLoadingMessage(progress)}
            </p>

            {/* Animated dots */}
            {/* <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="w-3 h-3 bg-[#00FFFF] rounded-full"
                        style={{
                            animation: `bounce 1.4s infinite`,
                            animationDelay: `${i * 0.2}s`
                        }}
                    ></div>
                ))}
            </div> */}

            {/* Progress bar */}
            {/* <div className="w-full max-w-xs h-2 bg-[#30363D] rounded-full mt-8">
                <div
                    className="h-full bg-gradient-to-r from-[#00BFFF] to-[#00FFFF] rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(99, progress * 100)}%` }}
                ></div>
            </div> */}

            {/* Fun tip */}
            {/* <p className="text-[#6E7681] text-sm mt-4 italic">
                Did you know? {funFacts[Math.floor(progress * funFacts.length) % funFacts.length]}
            </p> */}
        </div>
    );
};

// Example fun facts array
const funFacts = [
    "Honey never spoils.",
    "Octopuses have three hearts.",
    "Bananas are berries, but strawberries aren't.",
    "A group of flamingos is called a 'flamboyance'.",
    "The Eiffel Tower can be 15 cm taller during hot days.",
    "Some cats are allergic to humans.",
    "There are more stars in the universe than grains of sand on Earth.",
    "Wombat poop is cube-shaped.",
    "The unicorn is the national animal of Scotland.",
    "Mosquitoes are attracted to people who just ate bananas."
];

// ... (keep your existing getLoadingMessage)

export default DashboardLoadingScreen;