
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  count: number;
  type?: "card" | "list" | "table";
}

const LoadingState = ({ count, type = "card" }: LoadingStateProps) => {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm border">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-6 w-1/2 mb-4" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4">
          <Skeleton className="h-6 w-full max-w-md" />
        </div>
        <div className="divide-y">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="p-4 flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingState;
