// Define the FeedItem interface
export interface FeedItem {
    id: string;
    title: string;
    description: string;
    link: string;
    pubDate: string;
    creator?: string;
}