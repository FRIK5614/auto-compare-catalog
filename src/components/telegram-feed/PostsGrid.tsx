
import React from 'react';
import { TelegramPostCard } from '.';
import { TelegramSkeleton } from '.';

interface TelegramPost {
  id: number;
  text: string;
  photos: string[];
  date: string;
  link: string;
}

interface PostsGridProps {
  posts: TelegramPost[];
  loading: boolean;
  error: string | null;
  offset: number;
  onRetry: () => void;
}

const PostsGrid: React.FC<PostsGridProps> = ({
  posts,
  loading,
  error,
  offset,
  onRetry
}) => {
  // Error state
  if (error && posts.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <div className="text-center max-w-lg">
          <h3 className="text-xl font-semibold mb-2 text-red-600">Ошибка загрузки</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Loaded posts */}
      {posts.map(post => (
        <TelegramPostCard key={post.id} post={post} />
      ))}
      
      {/* Loading skeletons */}
      {loading && offset === 0 && (
        <>
          <TelegramSkeleton />
          <TelegramSkeleton />
          <TelegramSkeleton />
        </>
      )}
      
      {/* Empty state */}
      {!loading && posts.length === 0 && (
        <div className="col-span-full py-12 text-center">
          <p className="text-lg text-gray-500">Нет доступных предложений</p>
          <p className="text-sm text-gray-400 mt-2">
            Убедитесь, что бот имеет доступ к каналу и добавлен как администратор
          </p>
        </div>
      )}
    </div>
  );
};

export default PostsGrid;
