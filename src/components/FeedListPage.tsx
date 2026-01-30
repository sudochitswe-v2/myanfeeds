import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMediaById } from '../utils/mediaData';
import type { Media } from '../utils/mediaData';
import ThemeToggle from './ThemeToggle';

// Define the FeedItem interface
interface FeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  creator?: string;
}

// Define interface for parsed RSS item
interface ParsedRSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  creator?: string;
}

// Browser-compatible RSS parser function
const parseRSSFeed = async (feedUrl: string): Promise<ParsedRSSItem[]> => {
  try {
    // Use a CORS proxy service to fetch the RSS feed
    // Note: In production, you'd want to set up your own proxy service
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();

    // Parse the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      throw new Error('Error parsing XML: ' + parserError[0].textContent);
    }

    // Extract items from the RSS feed
    const items = Array.from(xmlDoc.querySelectorAll('item, entry')).map(item => {
      const title = item.querySelector('title')?.textContent || 'No title';
      const description = item.querySelector('description, summary')?.textContent || 'No description';
      const linkElement = item.querySelector('link');
      const link = linkElement?.textContent ||
                   linkElement?.getAttribute('href') || '#';
      const pubDate = item.querySelector('pubDate, published, updated')?.textContent || '';
      const creatorElement = item.querySelector('creator, author name, dc\\:creator');
      const creator = creatorElement?.textContent || undefined;

      return {
        title: title.trim(),
        description: description.trim(),
        link: link.trim(),
        pubDate: pubDate.trim(),
        creator: creator?.trim()
      };
    });

    return items;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    // More detailed error reporting
    if (error instanceof TypeError && error.message.includes('CORS')) {
      throw new Error('CORS error: Cannot fetch RSS feed directly from browser. Using proxy service.');
    }
    throw error;
  }
};

const FeedListPage: React.FC = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const navigate = useNavigate();
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
          const feedItems = await parseRSSFeed(media.feedUrl);

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
          <h1 className="text-2xl font-bold">Loading feeds...</h1>
          <ThemeToggle />
        </div>
        <p>Loading {selectedMedia?.name} feeds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <ThemeToggle />
        </div>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 btn-primary py-2 px-4 rounded"
        >
          Back to Media List
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          ← Back to Media List
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
          <div
            key={item.id}
            className="card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {item.title}
                </a>
              </h2>

              <div className="flex justify-between text-sm text-gray-500 mb-3 dark:text-gray-400">
                {item.creator && <span>By: {item.creator}</span>}
                {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString()}</span>}
              </div>

              <p className="mb-4">{item.description.substring(0, 200)}{item.description.length > 200 ? '...' : ''}</p>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-2 px-4 rounded inline-block"
              >
                Read Full Article
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedListPage;