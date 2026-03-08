// 'use client';
import Image from 'next/image';
import { ThemeToggle } from "./components/theme-toggle";
import { getMediaSources } from './lib/reader';
import { MediaItemCard } from './components/MediaItemCard';

export default function Home() {
  const mediaSources = getMediaSources();

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center max-w-6xl">
          <div className='flex items-center gap-3'>
            {/* <div className="p-1.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20"> */}
            <Image src="/icon1.png" alt='app log' width={48} height={48} />
            {/* </div> */}
            <h1 className="text-xl font-black tracking-tighter uppercase">MyanFeeds</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Stay Connected.</h2>
          <p className="text-muted-foreground max-w-md mx-auto font-medium">Your daily curated feed of Myanmar news and culture, redesigned for a focused reading experience.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {mediaSources.map((media) => (
            <MediaItemCard key={media.id} media={media} />
          ))}
        </div>
      </main>
    </div>
  );
}
