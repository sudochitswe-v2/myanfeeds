
import type { ParsedRSSItem } from '../index';

// Browser-compatible RSS parser function
export const fetchFeeds = async (feedUrl: string): Promise<ParsedRSSItem[]> => {
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
            // console.log(item);
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