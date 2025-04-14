
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoadMoreButtonProps {
  loading: boolean;
  hasMore: boolean;
  postsExist: boolean;
  offset: number;
  onLoadMore: (offset?: number) => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({
  loading,
  hasMore,
  postsExist,
  offset,
  onLoadMore
}) => {
  if (!postsExist) {
    return (
      <div className="text-center mt-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.open('https://t.me/VoeAVTO', '_blank')}
          className="min-w-[180px]"
        >
          Посетить канал Telegram
        </Button>
      </div>
    );
  }
  
  if (!hasMore) {
    return (
      <div className="text-center text-gray-500 mt-4">
        Все предложения загружены
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center mt-6">
      <Button
        variant="outline"
        size="lg"
        onClick={() => onLoadMore()}
        disabled={loading}
        className="min-w-[180px]"
      >
        {loading && offset > 0 ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Загрузка...
          </>
        ) : (
          'Загрузить еще'
        )}
      </Button>
    </div>
  );
};

export default LoadMoreButton;
