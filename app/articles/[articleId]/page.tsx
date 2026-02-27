'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/app/components/theme-toggle';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { decodeArticleId } from '@/app/utils/articleUtils';

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const searchParams = useSearchParams();
  const urlFromParam = searchParams.get('url');
  const title = searchParams.get('title');
  
  // Decode the URL from the articleId if not provided in search params
  const url = urlFromParam || decodeArticleId(articleId);
  
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!url) {
      setError('No article URL provided');
      setLoading(false);
      return;
    }

    const fetchArticleContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the article page content
        const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch article: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setContent(data.content);
      } catch (err) {
        console.error('Error fetching article content:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchArticleContent();
  }, [url]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="#"
          onClick={() => window.history.back()}
          className="hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Back
        </Link>
        <ThemeToggle />
      </div>

      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          {title || 'Article Detail'}
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Source: <a 
            href={url || ''} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {url ? new URL(url).hostname : ''}
          </a>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-4 rounded relative dark:bg-yellow-900 dark:border-yellow-600 dark:text-yellow-100" role="alert">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="font-bold text-lg mb-2">Unable to Load Article</h3>
              <p className="mb-3">
                We encountered an error while fetching this article from our end. This is a temporary issue on our side.
              </p>
              <p className="mb-4">
                You can still read the full article directly on the source website:
              </p>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                >
                  <span>Read on {new URL(url).hostname}</span>
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert dark' : ''} prose-lg`}>
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      )}

      {url && !loading && !error && (
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">
            Original article: <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on source website
            </a>
          </p>
        </div>
      )}
    </div>
  );
}