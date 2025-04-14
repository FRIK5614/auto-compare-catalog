
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Save, ArrowLeft, Globe, Image, Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import AdminLayout from '@/components/AdminLayout';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  image_url: string;
  author: string;
  published_at: string;
  published: boolean;
  tags: string[];
  slug: string;
}

const AdminBlogEdit = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    author: '',
    published: false,
    tags: [],
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (isNew) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          navigate('/admin/blog');
          return;
        }
        
        setPost(data);
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

    fetchPost();
  }, [id, isNew, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value }));
  };

  const handlePublishedChange = (checked: boolean) => {
    setPost(prev => ({ ...prev, published: checked }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    setPost(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }));
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\sа-яё]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[а-яё]/g, c => {
        const cyrillicToLatin: Record<string, string> = {
          'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
          'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
          'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
          'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
          'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        return cyrillicToLatin[c] || c;
      });
  };

  const handleSave = async () => {
    if (!post.title) {
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Заголовок публикации обязателен'
      });
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const slug = post.slug || `${generateSlug(post.title)}-${Date.now().toString(36)}`;
      
      const postData = {
        ...post,
        slug,
        published_at: post.published_at || now,
        updated_at: now
      };
      
      if (isNew) {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            id: uuidv4(),
            created_at: now
          })
          .select();
        
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Успешно!',
          description: 'Публикация успешно создана'
        });
        
        navigate('/admin/blog');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: 'Успешно!',
          description: 'Публикация успешно обновлена'
        });
      }
    } catch (err) {
      console.error('Error saving blog post:', err);
      toast({
        variant: 'destructive',
        title: 'Ошибка',
        description: 'Не удалось сохранить публикацию'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {isNew ? 'Новая публикация' : 'Редактирование публикации'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={post.published || false}
                onCheckedChange={handlePublishedChange}
              />
              <Label htmlFor="published" className="cursor-pointer">
                {post.published ? 'Опубликовано' : 'Черновик'}
              </Label>
            </div>
            
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>Сохранение...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                name="title"
                value={post.title || ''}
                onChange={handleChange}
                placeholder="Введите заголовок публикации"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Содержание</Label>
              <Textarea
                id="content"
                name="content"
                value={post.content || ''}
                onChange={handleChange}
                placeholder="Введите содержание публикации"
                className="min-h-[400px]"
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="excerpt">Краткое описание</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={post.excerpt || ''}
                onChange={handleChange}
                placeholder="Введите краткое описание публикации"
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">URL изображения</Label>
              <Input
                id="image_url"
                name="image_url"
                value={post.image_url || ''}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              {post.image_url && (
                <div className="mt-2 relative h-32 rounded-md overflow-hidden">
                  <img
                    src={post.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="author">Автор</Label>
              <Input
                id="author"
                name="author"
                value={post.author || ''}
                onChange={handleChange}
                placeholder="Имя автора"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">URL-адрес (slug)</Label>
              <Input
                id="slug"
                name="slug"
                value={post.slug || ''}
                onChange={handleChange}
                placeholder="url-statyi"
              />
              <p className="text-xs text-gray-500">
                Оставьте пустым для автоматической генерации
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Теги</Label>
              <div className="flex">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Добавить тег"
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  className="rounded-l-none"
                  disabled={!tagInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {post.tags && post.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map(tag => (
                    <div key={tag} className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full flex items-center">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Нет тегов</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogEdit;
