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
    <div className={`group relative rounded-2xl p-6 transition-all duration-300 border ${theme === 'dark'
      ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
      : 'bg-white border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1'
      }`}>
      <h3 className={`text-xl font-bold mb-3 leading-snug tracking-tight ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        <Link
          href={`/articles/${articleId}?url=${encodeURIComponent(item.link)}&title=${encodeURIComponent(item.title)}`}
          className="hover:text-blue-600 transition-colors"
        >
          {item.title}
        </Link>
      </h3>

      <div className={`mb-4 line-clamp-3 text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
        {sanitizedDescription}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className={`text-xs font-medium flex items-center gap-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
          {item.pubDate && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(item.pubDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
          {item.creator && (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              {item.creator}
            </span>
          )}
        </div>

        <Link
          href={`/articles/${articleId}?url=${encodeURIComponent(item.link)}&title=${encodeURIComponent(item.title)}`}
          className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-all ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}
        >
          Read Full
          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export { FeedCardSkeleton };