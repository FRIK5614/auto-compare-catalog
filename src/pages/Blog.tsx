
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Tag, User, Clock, ArrowRight } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { BlogAskAI } from '@/components/blog/BlogAskAI';

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

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  const formattedDate = formatDistance(
    new Date(post.published_at),
    new Date(),
    { addSuffix: true, locale: ru }
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.image_url || '/placeholder.svg'} 
          alt={post.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>{formattedDate}</span>
          
          {post.author && (
            <>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-1" />
              <span>{post.author}</span>
            </>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4">{post.excerpt}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <Link to={`/blog/${post.slug}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
          Читать далее <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

const BlogPostSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <div className="p-6">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setPosts(data || []);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Не удалось загрузить публикации блога');
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось загрузить публикации блога'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Блог автосалона</title>
        <meta 
          name="description" 
          content="Блог автосалона. Новости, статьи и полезная информация для автолюбителей." 
        />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Блог автосалона</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Новости, обзоры, статьи и полезная информация для автолюбителей
            </p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              <>
                <BlogPostSkeleton />
                <BlogPostSkeleton />
                <BlogPostSkeleton />
              </>
            ) : error ? (
              <div className="col-span-full text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchPosts}>Попробовать снова</Button>
              </div>
            ) : posts.length > 0 ? (
              posts.map(post => <BlogPostCard key={post.id} post={post} />)
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">В блоге пока нет публикаций</p>
                <p className="text-gray-400 text-sm mt-2">Загляните позже или свяжитесь с нами для получения информации</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Спросите у нашего ИИ-ассистента</h2>
            <BlogAskAI />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
