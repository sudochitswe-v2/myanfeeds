import { Media } from '../types/media';
import data from './data.json';



export const getMediaSources = (): Media[] => {
  return data.mediaSources;
};

export const getMediaById = (id: string): Media | undefined => {
  return data.mediaSources.find(media => media.id === id);
};