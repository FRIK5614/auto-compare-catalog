
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TelegramNews from '@/components/TelegramNews';
import { Helmet } from 'react-helmet-async';
import { useTelegramFeed } from '@/hooks/useTelegramFeed';

const SpecialOffers = () => {
  const { loadMorePosts } = useTelegramFeed({
    channelName: "VoeAVTO"
  });
  
  // Force refresh telegram feed when page loads
  useEffect(() => {
    console.log("Special Offers page loaded - forcing refresh from server");
    loadMorePosts(0); // Reload from the beginning
  }, [loadMorePosts]);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Специальные предложения и новости</title>
        <meta 
          name="description" 
          content="Специальные предложения, акции и последние новости нашего автосалона." 
        />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Специальные предложения и новости</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Узнайте первыми о наших акциях, скидках и других выгодных предложениях из нашего Telegram-канала
            </p>
          </div>
        </div>
        
        <TelegramNews channelName="VoeAVTO" limit={9} />
        
        <div className="bg-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-6">Подпишитесь на наш Telegram-канал</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Чтобы быть в курсе всех акций, специальных предложений и новостей нашего автосалона, 
              подпишитесь на наш официальный Telegram-канал.
            </p>
            <a 
              href="https://t.me/VoeAVTO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Подписаться на Telegram
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpecialOffers;
