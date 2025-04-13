
import React, { useEffect, useState } from 'react';
import { Rss, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTelegramFeed } from '@/hooks/useTelegramFeed';
import { Skeleton } from '@/components/ui/skeleton';

interface TelegramPost {
  id: number;
  text: string;
  photos: string[];
  date: string;
  link: string;
}

const TelegramNewsItem = ({ post }: { post: TelegramPost }) => {
  const postDate = new Date(post.date);
  const formattedDate = postDate.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.photos && post.photos.length > 0 && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={post.photos[0]} 
            alt="Telegram post image" 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if the Telegram image fails to load
              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${post.id}/800/600`;
            }}
          />
        </div>
      )}
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <p className="text-gray-800 line-clamp-3 mb-3">{post.text}</p>
        <a 
          href={post.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          Читать полностью <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

const TelegramNewsSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-4">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-3" />
      <Skeleton className="h-4 w-32" />
    </div>
  </div>
);

const TelegramNews = () => {
  const { toast } = useToast();
  const { posts, loading, error, hasMore, loadMorePosts } = useTelegramFeed({
    postsPerPage: 9,
    channelName: "VoeAVTO"
  });

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Rss className="text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-center">Новости и специальные предложения</h2>
        </div>
        
        {error && (
          <div className="text-center text-red-500 mb-8">
            <p>{error}</p>
            <button 
              onClick={() => loadMorePosts(0)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && posts.length === 0 ? (
            <>
              <TelegramNewsSkeleton />
              <TelegramNewsSkeleton />
              <TelegramNewsSkeleton />
            </>
          ) : (
            posts.map(post => (
              <TelegramNewsItem key={post.id} post={post} />
            ))
          )}
        </div>
        
        {posts.length === 0 && !loading && !error && (
          <div className="text-center py-8">
            <p className="text-gray-500">Нет доступных новостей из Telegram-канала</p>
          </div>
        )}
        
        {hasMore && posts.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => loadMorePosts()}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Загрузка..." : "Загрузить больше новостей"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramNews;
