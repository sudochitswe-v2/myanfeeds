'use client';

import { FeedItem } from '@/app/types/feed';
import { FeedCardSkeleton } from './FeedCardSkeleton';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { generateArticleId } from '@/app/utils/articleUtils';

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
  const { theme } = useTheme();

  // Generate a unique ID for the article based on the link
  const articleId = generateArticleId(item.link);

  return (
    <div className={`rounded-lg shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        <Link
          href={`/articles/${articleId}?url=${encodeURIComponent(item.link)}&title=${encodeURIComponent(item.title)}`}
          className="hover:underline" 
        >
          {item.title}
        </Link>
      </h3>
      <div className={`mb-3 feed-content ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {sanitizedDescription}
      </div>
      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
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