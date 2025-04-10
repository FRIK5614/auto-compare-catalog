import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  PostsGrid, 
  LoadMoreButton,
  TelegramHeader 
} from "@/components/telegram-feed";

interface TelegramPost {
  id: number;
  date: number;
  text: string;
  photo_url?: string;
}

interface TelegramResponse {
  posts: TelegramPost[];
  total: number;
  hasMore: boolean;
}

const POSTS_PER_PAGE = 12;

const HotOffers = () => {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const { toast } = useToast();
  
  const fetchTelegramPosts = async (newOffset = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Fetching Telegram posts with offset ${newOffset}...`);
      
      const { data, error } = await supabase.functions.invoke('telegram-feed', {
        body: { 
          channelName: 'VoeAVTO',
          limit: POSTS_PER_PAGE,
          offset: newOffset
        }
      });
      
      if (error) {
        console.error('Error invoking telegram-feed function:', error);
        throw new Error(error.message);
      }
      
      console.log('Telegram posts received:', data);
      
      if (data && typeof data === 'object') {
        const response = data as TelegramResponse;
        
        if (newOffset === 0) {
          // First page - replace existing posts
          setPosts(response.posts || []);
        } else {
          // Subsequent pages - append to existing posts
          setPosts(prev => [...prev, ...(response.posts || [])]);
        }
        
        setTotalPosts(response.total || 0);
        setHasMore(response.hasMore || false);
        setOffset(newOffset);
      } else {
        throw new Error('Received invalid data format');
      }
    } catch (err: any) {
      console.error('Error fetching Telegram posts:', err);
      setError('Не удалось загрузить ленту Telegram. Пожалуйста, попробуйте позже.');
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить посты из Telegram",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const loadMorePosts = () => {
    if (hasMore && !loading) {
      fetchTelegramPosts(offset + POSTS_PER_PAGE);
    }
  };
  
  useEffect(() => {
    fetchTelegramPosts(0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <TelegramHeader 
          title="Горячие предложения"
          description="Следите за обновлениями в нашей Telegram группе!"
          buttonText="Перейти в группу Telegram"
          telegramUrl="https://t.me/VoeAVTO"
        />
        
        <div className="grid gap-6">
          {/* Posts Grid Component */}
          <PostsGrid 
            posts={posts}
            loading={loading}
            error={error}
            offset={offset}
            onRetry={() => fetchTelegramPosts(0)}
          />
          
          {/* Pagination controls */}
          <div className="mt-8 flex justify-center">
            <LoadMoreButton
              loading={loading}
              hasMore={hasMore}
              postsExist={posts.length > 0}
              offset={offset}
              onLoadMore={loadMorePosts}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HotOffers;
