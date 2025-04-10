
import React, { useEffect, useState } from "react";
import { ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import ErrorState from "@/components/ErrorState";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext } from "@/components/ui/pagination";
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
  
  // Format the timestamp to a readable date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
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
          {loading && offset === 0 ? (
            // Loading skeletons for initial load
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={`skeleton-${index}`}>
                  <CardHeader>
                    <Skeleton className="h-5 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-40 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            // Error state
            <ErrorState 
              message={error}
              onRetry={() => fetchTelegramPosts(0)}
            />
          ) : posts.length === 0 ? (
            // Empty state
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">Публикации не найдены</p>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open('https://t.me/VoeAVTO', '_blank')}
                  >
                    Перейти в группу Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            // Display posts
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">Опубликовано {formatDate(post.date)}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Post text with line breaks preserved */}
                      <div className="whitespace-pre-line">{post.text}</div>
                      
                      {/* Display photo if available */}
                      {post.photo_url && (
                        <div className="mt-4">
                          <img 
                            src={post.photo_url} 
                            alt="Изображение из Telegram" 
                            className="rounded-lg max-h-[300px] w-auto mx-auto"
                            loading="lazy"
                            onError={(e) => {
                              // Fallback if image fails to load
                              console.error("Image failed to load:", post.photo_url);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Pagination controls */}
              <div className="mt-8 flex justify-center">
                {loading && offset > 0 ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-32" />
                    <MoreHorizontal className="text-gray-400" />
                  </div>
                ) : hasMore ? (
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={loadMorePosts}
                    disabled={loading}
                    className="w-full md:w-auto"
                  >
                    {loading ? "Загрузка..." : "Показать ещё"}
                  </Button>
                ) : posts.length > 0 ? (
                  <p className="text-gray-500 py-2">Больше публикаций нет</p>
                ) : null}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HotOffers;
