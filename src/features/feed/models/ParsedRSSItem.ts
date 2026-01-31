// Define interface for parsed RSS item
export interface ParsedRSSItem {
    title: string;
    description: string;
    link: string;
    pubDate: string;
    creator?: string;
}