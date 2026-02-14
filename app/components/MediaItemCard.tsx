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
            className="block"
        >
            <div className={`rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border p-6 ${currentTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
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
                <h2 className={`text-xl font-semibold mb-2 ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{media.name}</h2>
                {/* <p className={`mb-4 ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{media.description}</p> */}
            </div>
        </Link>
    );
}