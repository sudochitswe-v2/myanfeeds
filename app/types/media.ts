export interface Media {
  id: string;
  name: string;
  description: string;
  logo?: string;
  feedUrl: string;
  byPassCORS?: boolean; // Optional flag to indicate if CORS bypass is needed
}