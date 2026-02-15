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
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
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