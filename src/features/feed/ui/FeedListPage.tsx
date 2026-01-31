import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMediaById } from '../../media';
import type { Media } from '../../media/services/mediaData';
import ThemeToggle from '../../common/ui/ThemeToggle';
import { fetchFeeds } from '../index';
import type { FeedItem } from '../models/FeedItem';
import { FeedCard } from '../components/FeedCard';
import { Spinner } from '../../../components/Spinner';




const FeedListPage: React.FC = () => {
  const navigate = useNavigate();
  const { mediaId } = useParams<{ mediaId: string }>();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  useEffect(() => {
    // Find the selected media
    if (mediaId) {
      const media = getMediaById(mediaId);
      if (!media) {
        setError('Media not found');
        setLoading(false);
        return;
      }

      setSelectedMedia(media);

      // Fetch RSS feed
      const fetchFeed = async () => {
        try {
          const feedItems = await fetchFeeds(media.feedUrl);

          // Map feed items to our interface
          const items: FeedItem[] = feedItems.slice(0, 20).map((item, index) => ({
            id: `${media.id}-${index}`,
            title: item.title || 'No title',
            description: item.description || 'No description',
            link: item.link || '#',
            pubDate: item.pubDate || '',
            creator: item.creator || undefined
          }));

          setFeedItems(items);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching RSS feed:', err);
          setError('Failed to load feed');
          setLoading(false);
        }
      };

      fetchFeed();
    }
  }, [mediaId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold">Loading feeds</h1>

          <ThemeToggle />
        </div>
        <div className="flex justify-center items-center">
          <Spinner size="lg" className="text-blue-500" />
          {/* <span className="ml-3 text-lg">Fetching latest articles...</span> */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
          >
            Back
          </button>
          <ThemeToggle />
        </div>

        <p>{error}</p>

        <button
          onClick={() => navigate(0)}
          className="mt-4 btn-primary py-2 px-4 rounded"
        >
          Retry
        </button>
      </div >
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => window.history.back()}
          className="hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Back
        </button>
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center mb-6">
        {selectedMedia?.logo && (
          <img
            src={selectedMedia.logo}
            alt={`${selectedMedia.name} logo`}
            className="h-16 object-contain mb-2"
            onError={(e) => {
              console.error(selectedMedia);
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = `https://placehold.co/150x60?text=${encodeURIComponent(selectedMedia?.name.substring(0, 3) || '')}`;
            }}
          />
        )}
        <h1 className="text-3xl font-bold mb-2">{selectedMedia?.name} Feeds</h1>
        <p className="text-center">{selectedMedia?.description}</p>
      </div>

      <div className="space-y-6">
        {feedItems.map((item) => (
          <FeedCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default FeedListPage;