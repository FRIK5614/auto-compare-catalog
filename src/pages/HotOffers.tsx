
import React, { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import ErrorState from "@/components/ErrorState";

interface TelegramPost {
  id: number;
  date: number;
  text: string;
  photo_url?: string;
}

const HotOffers = () => {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchTelegramPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching Telegram posts...');
      
      const { data, error } = await supabase.functions.invoke('telegram-feed', {
        body: { channelName: 'VoeAVTO' }
      });
      
      if (error) {
        console.error('Error invoking telegram-feed function:', error);
        throw new Error(error.message);
      }
      
      console.log('Telegram posts received:', data);
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error fetching Telegram posts:', err);
      setError('Не удалось загрузить ленту Telegram. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTelegramPosts();
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
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
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
            ))
          ) : error ? (
            // Error state
            <ErrorState 
              message={error}
              onRetry={fetchTelegramPosts}
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
            posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
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
                        className="rounded-lg max-h-[500px] w-auto mx-auto"
                        loading="lazy"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HotOffers;
