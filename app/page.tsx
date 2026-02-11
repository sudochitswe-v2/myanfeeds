// 'use client';
import Image from 'next/image';
import { ThemeToggle } from "./components/theme-toggle";
import { getMediaSources } from './lib/reader';
import { MediaItemCard } from './components/MediaItemCard';

export default function Home() {
  const mediaSources = getMediaSources();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className='flex items-center gap-2'>
          <Image src="/icon1.png" alt='app log' width={50} height={50} />
          <h1 className="text-2xl font-bold text-center">MyanFeeds</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaSources.map((media) => (
          <MediaItemCard key={media.id} media={media} />
        ))}
      </div>
    </div>
  );
}
