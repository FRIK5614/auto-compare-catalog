
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Tag, User, ArrowLeft, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BlogAskAI } from '@/components/blog/BlogAskAI';
import { Separator } from '@/components/ui/separator';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  published_at: string;
  tags: string[];
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPost = async () => {
    if (!slug) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        setError('Публикация не найдена');
        return;
      }
      
      setPost(data as BlogPost);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Не удалось загрузить публикацию');
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить публикацию'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-64 mb-8" />
          <Skeleton className="h-80 w-full mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {error || 'Публикация не найдена'}
          </h1>
          <p className="mb-6 text-gray-600">
            К сожалению, запрашиваемая публикация не существует или была удалена.
          </p>
          <Link to="/blog" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Вернуться к блогу
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formattedDate = format(
    new Date(post.published_at),
    'dd MMMM yyyy',
    { locale: ru }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{post.title} | Блог автосалона</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-700 to-blue-900">
          {post.image_url && (
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover opacity-40"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center justify-center text-sm">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formattedDate}</span>
                
                {post.author && (
                  <>
                    <span className="mx-2">•</span>
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="mb-6">
                <Link to="/blog" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Вернуться к блогу
                </Link>
              </div>
              
              <article className="prose prose-lg max-w-none mb-12">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between items-center mb-12">
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" /> Нравится
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" /> Комментировать
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" /> Поделиться
                  </Button>
                </div>
              </div>
              
              <Separator className="my-8" />
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-gray-50 rounded-lg p-6 shadow-sm sticky top-8">
                <h2 className="text-xl font-bold mb-4">Спросите у ИИ-ассистента</h2>
                <p className="text-gray-600 mb-4">
                  Задайте вопрос нашему ИИ-ассистенту по автомобильной тематике
                </p>
                <BlogAskAI />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
