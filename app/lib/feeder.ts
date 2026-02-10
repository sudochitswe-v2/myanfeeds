import Parser from 'rss-parser';
import { FeedItem } from '../types/feed';


// Server-compatible RSS parser function
export const fetchFeeds = async (feedUrl: string): Promise<FeedItem[]> => {
  try {
    // Create a parser instance
    const parser: Parser = new Parser({
      customFields: {
        item: ['creator', 'dc:creator', 'author'],
      }
    });
    
    // Use a CORS proxy service to fetch the RSS feed
    // This handles the server-side fetching of external RSS feeds
    // const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
    // console.log("Fetching RSS feed from:", feedUrl);
    const response = await fetch(feedUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const cleanXml = stripImageTags(xmlText); // Remove <img> and <image> tags before parsing
    // Parse the RSS feed
    const feed = await parser.parseString(cleanXml);

    // Map the feed items to our interface
    const items: FeedItem[] = feed.items.slice(0, 20).map((item, index) => ({
      id: `feed-${Date.now()}-${index}`, // Generate unique ID server-side
      title: item.title || 'No title',
      description: item.contentSnippet || item.content || item.summary || 'No description',
      link: item.link || '#',
      pubDate: item.pubDate || item.isoDate || '',
      creator: item.creator || item['dc:creator'] || item.author || undefined
    }));

    return items;
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw error;
  }
};
/**
 * Removes both <img> and <image> tags from the XML string.
 * This handles self-closing tags and tags with nested children.
 */
function stripImageTags(xmlString: string): string {
  // Regex Breakdown:
  // <(img|image)    : Matches either "img" or "image"
  // [^>]* : Matches any attributes inside the tag
  // (?:             : Start of a non-capturing group
  //   \/>           : Match self-closing tags like <img />
  //   |             : OR
  //   >[\s\S]*?<\/\1> : Match everything until the closing </img|image> tag
  // )
  const imageRegex = /<(img|image)[^>]*>(?:\/>|>[\s\S]*?<\/\1>)/gi;

  // Additional pass for unclosed <img> tags (common in poorly formatted RSS)
  const unclosedImgRegex = /<img[^>]*>/gi;

  return xmlString
    .replace(imageRegex, "")
    .replace(unclosedImgRegex, "");
}