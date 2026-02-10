'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from "./components/theme-toggle";
import { getMediaSources } from './lib/reader';

export default function Home() {
  const mediaSources = getMediaSources();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className='flex items-center gap-2'>
          <Image src="/icon1.png" alt='app log' width={50} height={50} />
          <h1 className="text-2xl font-bold text-center">MyanFeeds</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaSources.map((media) => (
          <Link
            key={media.id}
            href={`/feeds/${media.id}`}
            className="block card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              {media.logo && (
                <div className="flex justify-center mb-4">
                  <Image
                    src={media.logo}
                    alt={`${media.name} logo`}
                    width={200}
                    height={80}
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
              <p className="mb-4 text-gray-600 dark:text-gray-300">{media.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
