'use client';

import { FeedItem } from '@/app/types/feed';
import { FeedCardSkeleton } from './FeedCardSkeleton';

interface FeedCardProps {
  item: FeedItem;
}

export function FeedCard({ item }: FeedCardProps) {
  // Sanitize the description to prevent XSS (using a client-side approach)
  const sanitizeHTML = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || html;
  };

  const sanitizedDescription = sanitizeHTML(item.description);

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {item.title}
        </a>
      </h3>
      <div className="text-gray-600 dark:text-gray-300 mb-3 feed-content">
        {sanitizedDescription}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {item.pubDate && (
          <span>
            Published: {item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Unknown date'}
          </span>
        )}
        {item.creator && <span className="ml-2">By: {item.creator}</span>}
      </div>
    </div>
  );
}

export { FeedCardSkeleton };