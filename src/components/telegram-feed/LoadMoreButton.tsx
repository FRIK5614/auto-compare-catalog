
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadMoreButtonProps {
  loading: boolean;
  hasMore: boolean;
  postsExist: boolean;
  offset: number;
  onLoadMore: () => void;
}

const LoadMoreButton = ({ loading, hasMore, postsExist, offset, onLoadMore }: LoadMoreButtonProps) => {
  if (loading && offset > 0) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-32" />
        <MoreHorizontal className="text-gray-400" />
      </div>
    );
  }

  if (hasMore) {
    return (
      <Button 
        variant="outline" 
        size="lg"
        onClick={onLoadMore}
        disabled={loading}
        className="w-full md:w-auto"
      >
        {loading ? "Загрузка..." : "Показать ещё"}
      </Button>
    );
  }

  if (postsExist) {
    return <p className="text-gray-500 py-2">Больше публикаций нет</p>;
  }

  return null;
};

export default LoadMoreButton;
