// utils/mediaData.ts
import mediaJson from '../data/media.json';

export interface Media {
  id: string;
  name: string;
  description: string;
  logo?: string;
  feedUrl: string;
}

export const getMediaSources = (): Media[] => {
  return mediaJson.mediaSources;
};

export const getMediaById = (id: string): Media | undefined => {
  return mediaJson.mediaSources.find(media => media.id === id);
};