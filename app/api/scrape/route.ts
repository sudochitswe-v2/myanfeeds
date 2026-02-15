import { NextRequest } from 'next/server';
import { load } from 'cheerio';
import { Agent, fetch as ufetch } from 'undici';

// Export the scraping function for server-side use
export async function scrapeArticleContent(url: string) {
  if (!url) {
    throw new Error('URL parameter is required');
  }

  try {
    // Validate URL
    new URL(url);

    // Configure undici agent for better compatibility
    const client = new Agent({
      connect: {
        rejectUnauthorized: false,
        servername: getDomainName(url)
      }
    });

    // Fetch the webpage content
    const response = await ufetch(url, {
      dispatcher: client,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
      // Set timeout to 10 seconds
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();

    // Load the HTML into cheerio
    const $ = load(html);

    // Remove script and style elements to avoid unwanted content
    $('script').remove();
    $('style').remove();
    $('nav').remove();
    $('header').remove();
    $('footer').remove();
    $('aside').remove();
    $('.advertisement').remove();
    $('.ads').remove();
    $('.ad').remove();

    const contentElement = $('body');
    // Extract the content

    let content = contentElement.html() || '';
    // Clean up the content - remove extra whitespace and empty paragraphs
    content = content.replace(/\s+/g, ' ').trim();
    content = content.replace(/<p>\s*<\/p>/g, '');

    return content;
  } catch (error) {
    console.error('Scraping error:', error);
    throw error instanceof Error ? error : new Error('An unexpected error occurred during scraping');
  }
}
async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return Response.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    const content = await scrapeArticleContent(url);

    return Response.json({
      content: content,
      sourceUrl: url
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return Response.json({
      error: error instanceof Error ? error.message : 'An unexpected error occurred during scraping'
    }, { status: 500 });
  }
}

/**
 * Extracts the domain name (hostname) from a URL string.
 * @param {string} urlString - The full URL
 * @returns {string} - The domain name
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

export { GET };
