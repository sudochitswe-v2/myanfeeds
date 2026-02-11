import Parser from 'rss-parser';
import { FeedItem } from '../types/feed';
import { Media } from '../types/media';
import { Agent, fetch as ufetch } from 'undici';

// Server-compatible RSS parser function
export const fetchFeeds = async (media: Media): Promise<FeedItem[]> => {
  try {
    // Determine if we need to bypass CORS/Cloudflare
    const shouldByPassCORS = media.byPassCORS === true;
    const feedUrl = media.feedUrl;
    let text;

    if (shouldByPassCORS) {
      // Use a CORS proxy for Cloudflare-protected sites
      // const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
      text = await fetchWithBypass(feedUrl); // Set a timeout of 10 seconds

    } else {

      text = await fetchNormal(feedUrl);
    }

    // Success, parse the response
    const cleanXml = stripImageTags(text); // Remove <img> and <image> tags before parsing
    console.log(text);
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

const fetchNormal = async (feedUrl: string): Promise<string> => {
  const response = await fetch(feedUrl);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // Success, parse the response
  const xmlText = await response.text();
  return xmlText;
}
const fetchWithBypass = async (feedUrl: string): Promise<string> => {
  console.log("Fetching with bypass for URL:", feedUrl);
  const client = new Agent({
    connect: {
      // This helps bypass some TLS fingerprinting
      rejectUnauthorized: false,
      servername: getDomainName(feedUrl)
    }
  });
  const response = await ufetch(feedUrl, {
    dispatcher: client,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/rss+xml, application/xml'
    }
  });
  return await response.text();
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

/**
 * Extracts the domain name (hostname) from a URL string.
 * @param {string} urlString - The full URL (e.g., https://news.example.com/rss)
 * @returns {string} - The domain name (e.g., news.example.com)
 */
function getDomainName(urlString: string): string {
  try {
    const url = new URL(urlString);
    return url.hostname;
  } catch (error) {
    console.error("Invalid URL provided:", error);
    return "";
  }
}