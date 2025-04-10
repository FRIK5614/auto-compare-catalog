
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import ErrorState from "@/components/ErrorState";
import TelegramPostCard from "./TelegramPostCard";

interface TelegramPost {
  id: number;
  date: number;
  text: string;
  photo_url?: string;
}

interface PostsGridProps {
  posts: TelegramPost[];
  loading: boolean;
  error: string | null;
  offset: number;
  onRetry: () => void;
}

const PostsGrid = ({ posts, loading, error, offset, onRetry }: PostsGridProps) => {
  if (loading && offset === 0) {
    // Loading skeletons for initial load
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={`skeleton-${index}`}>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    // Error state
    return (
      <ErrorState 
        message={error}
        onRetry={onRetry}
      />
    );
  }

  if (posts.length === 0) {
    // Empty state
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500">Публикации не найдены</p>
          <div className="mt-4">
            <a 
              href="https://t.me/VoeAVTO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Перейти в группу Telegram
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display posts
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <TelegramPostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostsGrid;
