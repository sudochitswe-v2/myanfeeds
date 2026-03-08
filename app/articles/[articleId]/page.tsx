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
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0b]' : 'bg-[#fdfdfd]'}`}>
      {/* Sticky Top Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${theme === 'dark'
        ? 'bg-black/80 border-gray-800'
        : 'bg-white/80 border-gray-100 shadow-sm'
        }`}>
        <div className="container mx-auto px-4 h-16 flex justify-between items-center max-w-4xl">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Feed
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {url && (
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${theme === 'dark'
                ? 'bg-blue-900/30 text-blue-300'
                : 'bg-blue-50 text-blue-600'
                }`}>
                {new URL(url).hostname.replace('www.', '')}
              </span>
            )}
          </div>

          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1] ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {title || 'Article Detail'}
          </h1>

          {url && (
            <div className="flex items-center gap-4 text-sm font-medium text-gray-400 dark:text-gray-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                  Read original article
                </a>
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full"></div>
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-5/6"></div>
            <div className="space-y-4 pt-10">
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-full"></div>
            </div>
            <div className="h-80 bg-gray-100 dark:bg-gray-800 rounded-2xl w-full mt-12"></div>
          </div>
        ) : error ? (
          <div className={`p-10 rounded-3xl border transition-all ${theme === 'dark'
              ? 'bg-red-950/20 border-red-900/50'
              : 'bg-red-50 border-red-100'
            }`}>
            <div className="flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                }`}>
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-black mb-3 ${theme === 'dark' ? 'text-red-300' : 'text-red-900'}`}>Content Unavailable</h3>
              <p className={`mb-8 max-w-md text-lg ${theme === 'dark' ? 'text-red-400/80' : 'text-red-700'}`}>
                We couldn't retrieve the content from the source. This usually happens when the publisher restricts automated access.
              </p>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-blue-500/20 active:scale-95"
                >
                  Read on Original Site
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="article-body transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
            <div
              className={`article-content prose prose-lg md:prose-xl max-w-none ${theme === 'dark' ? 'prose-invert text-gray-300' : 'text-gray-800'
                }`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}

        {url && !loading && !error && (
          <footer className="mt-24 pt-12 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-widest">
              End of Article
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 py-3 rounded-2xl font-bold transition-all border ${theme === 'dark'
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                View original
              </a>
              <Link
                href="/"
                className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-2xl font-bold transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Find more stories
              </Link>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
}