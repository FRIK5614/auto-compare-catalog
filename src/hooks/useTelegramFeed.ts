import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TelegramPost {
  id: number;
  text: string;
  photos: string[];
  date: string;
  link: string;
}

interface UseTelegramFeedProps {
  postsPerPage?: number;
  initialOffset?: number;
  channelName?: string;
}

export const useTelegramFeed = ({
  postsPerPage = 6,
  initialOffset = 0,
  channelName = "VoeAVTO"
}: UseTelegramFeedProps = {}) => {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(initialOffset);
  const [hasMore, setHasMore] = useState(true);
  
  // Function to fetch real Telegram posts from our edge function
  const fetchPosts = useCallback(async (currentOffset: number) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching Telegram posts from ${channelName}, offset: ${currentOffset}, limit: ${postsPerPage}`);
      
      // Call our Supabase edge function
      const { data, error } = await supabase.functions.invoke("telegram-feed", {
        query: { 
          channel: channelName,
          limit: postsPerPage.toString(),
          offset: currentOffset.toString()
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Telegram feed response:", data);
      
      // Check if we got valid data
      if (!data || !data.success || !data.posts || data.posts.length === 0) {
        console.warn("No valid telegram posts data received");
        throw new Error(data?.error || "No posts received from Telegram");
      }
      
      return {
        posts: data.posts,
        hasMore: data.posts.length >= postsPerPage // Assume there are more if we got at least the requested amount
      };
    } catch (err) {
      console.error('Error fetching Telegram posts:', err);
      throw new Error(err instanceof Error ? err.message : 'Не удалось загрузить посты из Telegram');
    } finally {
      setLoading(false);
    }
  }, [postsPerPage, channelName]);
  
  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        const result = await fetchPosts(initialOffset);
        setPosts(result.posts);
        setHasMore(result.hasMore);
      } catch (err) {
        console.error("Error loading initial posts:", err);
        setError(err instanceof Error ? err.message : "Ошибка загрузки постов");
        
        // Show error toast or other UI notification here
      }
    };
    
    loadInitialPosts();
  }, [fetchPosts, initialOffset]);
  
  // Load more posts
  const loadMorePosts = useCallback(async (newOffset?: number) => {
    const currentOffset = newOffset !== undefined ? newOffset : offset + postsPerPage;
    
    try {
      const result = await fetchPosts(currentOffset);
      
      // If loading from beginning, replace posts
      if (newOffset === 0) {
        setPosts(result.posts);
      } else {
        // Otherwise append posts
        setPosts(prevPosts => [...prevPosts, ...result.posts]);
      }
      
      setOffset(currentOffset);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки постов");
    }
  }, [fetchPosts, offset, postsPerPage]);
  
  return {
    posts,
    loading,
    error,
    offset,
    hasMore,
    loadMorePosts
  };
};
