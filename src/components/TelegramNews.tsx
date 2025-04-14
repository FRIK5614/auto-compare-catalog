
import React, { useEffect } from 'react';
import { Rss, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTelegramFeed } from '@/hooks/useTelegramFeed';
import { 
  TelegramHeader, 
  PostsGrid, 
  LoadMoreButton 
} from '@/components/telegram-feed';

interface TelegramNewsProps {
  channelName?: string;
  limit?: number;
}

const TelegramNews: React.FC<TelegramNewsProps> = ({ 
  channelName = "VoeAVTO",
  limit = 9 
}) => {
  const { toast } = useToast();
  const { 
    posts, 
    loading, 
    error, 
    hasMore, 
    loadMorePosts,
    offset
  } = useTelegramFeed({
    postsPerPage: limit,
    channelName
  });

  // Force refresh on component mount
  useEffect(() => {
    console.log("TelegramNews component mounted - forcing refresh from server");
    loadMorePosts(0);
  }, [loadMorePosts]);

  const handleRefresh = () => {
    loadMorePosts(0);
    toast({
      title: "Обновление",
      description: "Обновляем ленту сообщений из Telegram"
    });
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <TelegramHeader 
          title="Новости и специальные предложения"
          description="Актуальные новости и специальные предложения из нашего Telegram-канала"
          buttonText="Подписаться на Telegram"
          telegramUrl={`https://t.me/${channelName}`}
        />
        
        <div className="flex justify-center mb-6">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Обновить ленту
          </button>
        </div>
        
        <PostsGrid 
          posts={posts}
          loading={loading}
          error={error}
          offset={offset}
          onRetry={() => loadMorePosts(0)}
        />
        
        <LoadMoreButton 
          loading={loading}
          hasMore={hasMore}
          postsExist={posts.length > 0}
          offset={offset}
          onLoadMore={loadMorePosts}
        />
      </div>
    </div>
  );
};

export default TelegramNews;
