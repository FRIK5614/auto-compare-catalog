
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface UseTelegramFeedOptions {
  channelName?: string;
  postsPerPage?: number;
  initialLoad?: boolean;
}

export const useTelegramFeed = ({
  channelName = 'VoeAVTO',
  postsPerPage = 12,
  initialLoad = true
}: UseTelegramFeedOptions = {}) => {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(initialLoad);
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
          channelName,
          limit: postsPerPage,
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
      fetchTelegramPosts(offset + postsPerPage);
    }
  };
  
  const refreshPosts = () => {
    fetchTelegramPosts(0);
  };
  
  useEffect(() => {
    if (initialLoad) {
      fetchTelegramPosts(0);
    }
  }, [channelName]); // Refresh when channel changes
  
  return {
    posts,
    loading,
    error,
    offset,
    hasMore,
    totalPosts,
    loadMorePosts,
    refreshPosts
  };
};
