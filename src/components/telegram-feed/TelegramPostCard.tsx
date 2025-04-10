
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TelegramPostProps {
  id: number;
  date: number;
  text: string;
  photo_url?: string;
}

const TelegramPostCard = ({ post }: { post: TelegramPostProps }) => {
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
  );
};

export default TelegramPostCard;
