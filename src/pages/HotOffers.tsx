
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  PostsGrid, 
  LoadMoreButton,
  TelegramHeader 
} from "@/components/telegram-feed";
import { useTelegramFeed } from "@/hooks/useTelegramFeed";

const POSTS_PER_PAGE = 12;
const TELEGRAM_CHANNEL = "VoeAVTO";

const HotOffers = () => {
  const { 
    posts,
    loading,
    error,
    offset,
    hasMore,
    loadMorePosts
  } = useTelegramFeed({
    postsPerPage: POSTS_PER_PAGE,
    channelName: TELEGRAM_CHANNEL
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-0">
        <TelegramHeader 
          title="Горячие предложения"
          description="Следите за обновлениями в нашей Telegram группе VoeAVTO!"
          buttonText="Перейти в группу Telegram"
          telegramUrl={`https://t.me/${TELEGRAM_CHANNEL}`}
        />
        
        <div className="grid gap-6 pt-4">
          {/* Posts Grid Component */}
          <PostsGrid 
            posts={posts}
            loading={loading}
            error={error}
            offset={offset}
            onRetry={() => loadMorePosts(0)} // Сбрасываем и загружаем сначала
          />
          
          {/* Pagination controls */}
          <div className="mt-8 flex justify-center pb-8">
            <LoadMoreButton
              loading={loading}
              hasMore={hasMore}
              postsExist={posts.length > 0}
              offset={offset}
              onLoadMore={loadMorePosts}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default HotOffers;
