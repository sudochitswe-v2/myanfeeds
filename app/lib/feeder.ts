import Parser from 'rss-parser';
import { FeedItem } from '../types/feed';
import { Media } from '../types/media';

// Server-compatible RSS parser function
export const fetchFeeds = async (media: Media): Promise<FeedItem[]> => {
  try {
    // Determine if we need to bypass CORS/Cloudflare
    const shouldByPassCORS = media.byPassCORS === true;
    const feedUrl = media.feedUrl;
    let response;

    if (shouldByPassCORS) {
      // Use a CORS proxy for Cloudflare-protected sites
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
      response = await fetch(proxyUrl); // Set a timeout of 10 seconds
    } else {

      response = await fetch(feedUrl);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Success, parse the response
    const xmlText = await response.text();
    const cleanXml = stripImageTags(xmlText); // Remove <img> and <image> tags before parsing

    // Parse the RSS feed
    const items = await parseXmlToFeed(cleanXml);

    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const parseXmlToFeed = async (xmlString: string): Promise<FeedItem[]> => {
  const parser: Parser = new Parser({
    customFields: {
      item: ['creator', 'dc:creator', 'author'],
    }
  });
  const feed = await parser.parseString(xmlString);
  // Map the feed items to our interface
  const items: FeedItem[] = feed.items.slice(0, 20).map((item, index) => ({
    id: item.guid || item.id || `feed-${Date.now()}-${index}`, // Use GUID from feed if available, otherwise generate
    title: item.title || 'No title',
    description: item.contentSnippet || item.content || item.summary || 'No description',
    link: item.link || '#',
    pubDate: item.pubDate || item.isoDate || '',
    creator: item.creator || item['dc:creator'] || item.author || undefined
  }));
  return items;
}

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