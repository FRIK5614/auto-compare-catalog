
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface TelegramPost {
  id: number;
  text: string;
  photos: string[];
  date: string;
  link: string;
}

interface TelegramPostCardProps {
  post: TelegramPost;
}

const TelegramPostCard: React.FC<TelegramPostCardProps> = ({ post }) => {
  const formattedDate = formatDistanceToNow(new Date(post.date), {
    addSuffix: true,
    locale: ru
  });
  
  // Truncate long text
  const maxLength = 120;
  const displayText = post.text.length > maxLength
    ? `${post.text.substring(0, maxLength)}...`
    : post.text;
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {post.photos && post.photos.length > 0 ? (
          <img
            src={post.photos[0]}
            alt={`Фото к посту ${post.id}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Нет изображения</span>
          </div>
        )}
        
        {/* Badge for multiple images */}
        {post.photos && post.photos.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            +{post.photos.length - 1} фото
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <p className="mb-4">{displayText}</p>
        
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Открыть в Telegram
          <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </CardContent>
    </Card>
  );
};

export default TelegramPostCard;
