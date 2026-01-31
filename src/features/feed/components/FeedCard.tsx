import type { FeedItem } from '../models/FeedItem';
import React from 'react';

interface FeedCardProps {
    item: FeedItem;
}

export const FeedCard: React.FC<FeedCardProps> = ({ item }) => {

    return (
        <div
            key={item.id}
            className="card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        {item.title}
                    </a>
                </h2>

                <div className="flex justify-between text-sm text-gray-500 mb-3 dark:text-gray-400">
                    {item.creator && <span>By: {item.creator}</span>}
                    {item.pubDate && <span>{new Date(item.pubDate).toLocaleDateString()}</span>}
                </div>

                <p className="mb-4">{item.description.substring(0, 200)}{item.description.length > 350 ? '...' : ''}</p>

                <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-2 px-4 rounded inline-block"
                >
                    Read Full Article
                </a>
            </div>
        </div>
    );
}