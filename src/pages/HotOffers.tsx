
import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PostsGrid, LoadMoreButton } from "@/components/telegram-feed";

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
        <div className="mb-8 text-center sticky top-0 bg-white py-4 shadow-md z-10">
          <h1 className="text-3xl font-bold mb-4">Горячие предложения</h1>
          <p className="text-gray-600 mb-4">Следите за обновлениями в нашей Telegram группе!</p>
          <Button 
            variant="blue" 
            size="lg" 
            className="font-bold"
            onClick={() => window.open('https://t.me/VoeAVTO', '_blank')}
          >
            <ExternalLink className="mr-2 h-5 w-5" />
            Перейти в группу Telegram
          </Button>
        </div>
        
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
