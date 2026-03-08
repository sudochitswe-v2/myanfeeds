import { FeedCard } from '@/app/components/FeedCard';
import { fetchFeeds } from '@/app/lib/feeder';
import { FeedItem } from '@/app/types/feed';
import { ThemeToggle } from '@/app/components/theme-toggle';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMediaById } from '@/app/lib/reader';
import Image from 'next/image';

interface FeedPageProps {
  params: Promise<{ id: string }>; // params is a promise in Next.js 13+
}

export default async function FeedPage({ params }: FeedPageProps) {
  const { id: mediaId } = await params; // Await the params

  // Get media info
  const media = getMediaById(mediaId);

  if (!media) {
    notFound(); // Show 404 page if media not found
  }

  // Fetch feed items server-side
  let feedItems: FeedItem[] = [];
  let error: string | null = null;

  try {
    // Validate feed URL before attempting to fetch
    const url = new URL(media.feedUrl);
    if (!url.protocol.startsWith('http')) {
      throw new Error('Invalid URL protocol');
    }

    feedItems = await fetchFeeds(media);
  } catch (err) {
    console.error('Error in FeedPage:', err);
    error = err instanceof Error ? err.message : 'Failed to load feed';
    feedItems = []; // Ensure feedItems is always defined
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center max-w-4xl">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-accent transition-colors"
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
          {media.logo && (
            <div className="relative w-24 h-24 mb-6 rounded-2xl bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-center">
              <Image
                width={150}
                height={150}
                src={media.logo}
                alt={`${media.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <h1 className="text-4xl font-black tracking-tight text-center">{media.name}</h1>
          <div className="mt-4 flex items-center gap-2 text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest italic">Live Feed</span>
          </div>
        </div>

        {error ? (
          <div className="text-center p-12 bg-red-50 dark:bg-red-950/20 rounded-3xl border border-red-100 dark:border-red-900/30">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-900 dark:text-red-300 mb-2">Feed Connection Error</h3>
            <p className="text-red-700 dark:text-red-400/80 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Browse Other Sources
            </Link>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {feedItems.length > 0 ? (
              feedItems.map((item) => (
                <FeedCard key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center py-20">
                <div className="inline-block p-6 rounded-full bg-gray-50 dark:bg-gray-900/50 mb-4">
                  <svg className="w-10 h-10 text-gray-300 dark:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2m2 2l-2-2m2 2v-1m2 1l-2-2m2 2v-1" />
                  </svg>
                </div>
                <p className="text-xl font-bold text-gray-400">Nothing here yet</p>
                <p className="text-gray-400 mt-2">Checking for updates...</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}