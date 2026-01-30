import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMediaSources } from '../utils/mediaData';
import type { Media } from '../utils/mediaData';
import ThemeToggle from './ThemeToggle';

const MediaListPage: React.FC = () => {
  const [mediaSources, setMediaSources] = useState<Media[]>([]);

  useEffect(() => {
    // Load media sources from JSON data
    setMediaSources(getMediaSources());
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center">Myan Feeds</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaSources.map((media) => (
          <Link
            key={media.id}
            to={`/feeds/${media.id}`}
            className="block card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              {media.logo && (
                <div className="flex justify-center mb-4">
                  <img
                    src={media.logo}
                    alt={`${media.name} logo`}
                    className="h-12 object-contain"
                    onError={(e) => {
                      // console.log(e);
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.src = `https://placehold.co/100x40?text=${encodeURIComponent(media.name.substring(0, 3))}`;
                    }}
                  />
                </div>
              )}
              <h2 className="text-xl font-semibold mb-2">{media.name}</h2>
              <p className="mb-4">{media.description}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                View Feeds
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MediaListPage;