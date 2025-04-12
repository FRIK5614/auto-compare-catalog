import { useState, useEffect, useCallback } from 'react';

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
  
  // Mock data for development
  const mockPosts: TelegramPost[] = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    text: `Горячее предложение #${i + 1}: Скидка на автомобили Toyota до конца месяца!`,
    photos: [
      `https://picsum.photos/id/${(i * 10) % 100}/800/600`,
      `https://picsum.photos/id/${(i * 10 + 5) % 100}/800/600`
    ],
    date: new Date(Date.now() - i * 86400000).toISOString(),
    link: `https://t.me/VoeAVTO/${i + 100}`
  }));
  
  const fetchPosts = useCallback(async (currentOffset: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real application, this would be an API call
      // For now, we'll use our mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      const fetchedPosts = mockPosts.slice(
        currentOffset, 
        currentOffset + postsPerPage
      );
      
      return {
        posts: fetchedPosts,
        hasMore: currentOffset + postsPerPage < mockPosts.length
      };
    } catch (err) {
      console.error('Error fetching Telegram posts:', err);
      throw new Error('Не удалось загрузить посты из Telegram');
    } finally {
      setLoading(false);
    }
  }, [postsPerPage, mockPosts]);
  
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
