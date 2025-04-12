
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
}

export const useTelegramFeed = ({
  postsPerPage = 6,
  initialOffset = 0
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
      // Call our Supabase edge function
      const { data, error } = await supabase.functions.invoke("telegram-feed", {
        body: { 
          limit: postsPerPage,
          offset: currentOffset
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // If we don't have real data, use mock data for development
      if (!data.success || data.posts.length === 0) {
        console.warn("Falling back to mock telegram posts data");
        // Generate mock data (same as before)
        const mockPosts: TelegramPost[] = Array.from({ length: postsPerPage }).map((_, i) => ({
          id: i + 1 + currentOffset,
          text: `Горячее предложение #${i + 1 + currentOffset}: Скидка на автомобили Toyota до конца месяца!`,
          photos: [
            `https://picsum.photos/id/${((i + currentOffset) * 10) % 100}/800/600`
          ],
          date: new Date(Date.now() - (i + currentOffset) * 86400000).toISOString(),
          link: `https://t.me/VoeAVTO/${i + 100 + currentOffset}`
        }));
        
        return {
          posts: mockPosts,
          hasMore: currentOffset + postsPerPage < 30 // Limit mock data to 30 posts
        };
      }
      
      return {
        posts: data.posts,
        hasMore: data.posts.length === postsPerPage // Assume there are more if we got the requested number
      };
    } catch (err) {
      console.error('Error fetching Telegram posts:', err);
      throw new Error('Не удалось загрузить посты из Telegram');
    } finally {
      setLoading(false);
    }
  }, [postsPerPage]);
  
  // Load initial posts
  useEffect(() => {
    const loadInitialPosts = async () => {
      try {
        const result = await fetchPosts(initialOffset);
        setPosts(result.posts);
        setHasMore(result.hasMore);
      } catch (err) {
        setError((err as Error).message);
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
      setError((err as Error).message);
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
