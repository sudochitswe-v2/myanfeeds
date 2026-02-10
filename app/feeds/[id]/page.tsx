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
    feedItems = await fetchFeeds(media.feedUrl);
  } catch (err) {
    console.error('Error fetching RSS feed:', err);
    error = 'Failed to load feed';
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Back
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center mb-6">
        {media.logo && (
          <div className="flex justify-center mb-4">
            <Image
              width={200}
              height={200}
              src={media.logo}
              alt={`${media.name} logo`}
              className="h-16 object-contain"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2">{media.name} Feeds</h1>
        <p className="text-center">{media.description}</p>
      </div>

      {error ? (
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Link
            href={`/feeds/${mediaId}`}
            className="mt-4 btn-primary py-2 px-4 rounded inline-block bg-blue-500 text-white hover:bg-blue-600"
          >
            Retry
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {feedItems.length > 0 ? (
            feedItems.map((item) => (
              <FeedCard key={item.id} item={item} />
            ))
          ) : (
            <p>No feed items found.</p>
          )}
        </div>
      )}
    </div>
  );
}