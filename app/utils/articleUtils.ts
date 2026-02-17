// Utility functions for article handling

/**
 * Generates a unique ID for an article based on its URL
 * @param url The URL of the article
 * @returns A unique encoded ID for the article
 */
export function generateArticleId(url: string): string {
  // Create a simple hash-like ID from the URL
  return encodeURIComponent(btoa(url));
}

/**
 * Decodes an article ID back to the original URL
 * @param articleId The encoded article ID
 * @returns The original URL
 */
export function decodeArticleId(articleId: string): string {
  try {
    return atob(decodeURIComponent(articleId));
  } catch (error) {
    console.error('Error decoding article ID:', error);
    return '';
  }
}