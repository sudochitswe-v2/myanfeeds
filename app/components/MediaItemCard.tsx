'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

import { Media } from '@/app/types/media';

interface MediaItemCardProps {
    media: Media;
}

export function MediaItemCard({ media }: MediaItemCardProps) {
    const { theme, resolvedTheme } = useTheme();
    const [isMounted, setIsMounted] = useState(false);

    // Mark component as mounted after client-side hydration
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    // Use resolvedTheme if available, otherwise fallback to theme
    const currentTheme = resolvedTheme || theme;

    // During initial render (server-side or before hydration), show consistent styling
    // Apply both light and dark classes to prevent flash of incorrect theme
    if (!isMounted) {
        return (
            <Link
                key={media.id}
                href={`/feeds/${media.id}`}
                className="block"
            >
                <div className="rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border p-6 bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    {media.logo && (
                        <div className="flex justify-center mb-4">
                            <Image
                                src={media.logo}
                                alt={`${media.name} logo`}
                                width={200}
                                height={200}
                                className="h-12 object-contain"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null; // Prevent infinite loop
                                    target.src = `https://placehold.co/100x40?text=${encodeURIComponent(media.name.substring(0, 3))}`;
                                }}
                            />
                        </div>
                    )}
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{media.name}</h2>
                    {/* <p className="mb-4 text-gray-600 dark:text-gray-300">{media.description}</p> */}
                </div>
            </Link>
        );
    }

    return (
        <Link
            key={media.id}
            href={`/feeds/${media.id}`}
            className="block group"
        >
            <div className={`
                relative rounded-2xl p-6 h-full transition-all duration-300 
                ${currentTheme === 'dark'
                    ? 'bg-gray-900 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/80'
                    : 'bg-white border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1'
                }
            `}>
                {media.logo && (
                    <div className="flex justify-center mb-6 h-12">
                        <Image
                            src={media.logo}
                            alt={`${media.name} logo`}
                            width={200}
                            height={200}
                            className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null; // Prevent infinite loop
                                target.src = `https://placehold.co/100x40?text=${encodeURIComponent(media.name.substring(0, 3))}`;
                            }}
                        />
                    </div>
                )}
                <div className="text-center">
                    <h2 className={`text-xl font-bold tracking-tight ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                        {media.name}
                    </h2>
                    <div className="mt-4 flex justify-center">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full transition-colors ${currentTheme === 'dark' ? 'bg-blue-900/30 text-blue-300 group-hover:bg-blue-900/50' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'}`}>
                            View Feed
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}