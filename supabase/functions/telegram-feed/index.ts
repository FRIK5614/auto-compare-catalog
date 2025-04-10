
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Используем токен из базы, но не отправляем сообщения в канал
const TELEGRAM_BOT_TOKEN = "7829427763:AAEbz_SNa835tCr0u4tJ2wcDx68MuIsbftM";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body parameters
    const { channelName = 'VoeAVTO', limit = 12, offset = 0 } = await req.json();
    
    console.log(`Fetching posts from channel: ${channelName}, limit: ${limit}, offset: ${offset}`);

    // Use getChat first to get the chat ID
    const getChatResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=@${channelName}`);
    
    if (!getChatResponse.ok) {
      const errorData = await getChatResponse.json();
      console.error('Telegram API error (getChat):', errorData);
      throw new Error(`Telegram API error: ${errorData.description || 'Could not get chat info'}`);
    }
    
    const chatData = await getChatResponse.json();
    console.log('Chat info:', JSON.stringify(chatData).slice(0, 200) + '...');
    
    if (!chatData.ok || !chatData.result || !chatData.result.id) {
      throw new Error('Could not get chat ID');
    }
    
    const chatId = chatData.result.id;
    
    // Получаем сообщения из канала через getChatHistory
    // Использум getUpdates для получения последних сообщений
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=100`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error (getUpdates):', errorData);
      throw new Error(`Telegram API error: ${errorData.description || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Telegram API response:', JSON.stringify(data).slice(0, 200) + '...');

    // Получаем сообщения из канала
    const messages = [];
    
    // Попробуем использовать более подходящий метод - getHistory если доступно
    try {
      // Используем getHistory если доступно, иначе пользуемся getUpdates
      const historyResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatHistory?chat_id=${chatId}&limit=${limit + offset}`);
      
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.ok && historyData.result) {
          // Используем данные из getChatHistory
          messages.push(...historyData.result);
        }
      }
    } catch (historyError) {
      console.error('Could not use getChatHistory, falling back to getUpdates:', historyError);
    }
    
    // Если getChatHistory не получилось, используем getUpdates
    if (messages.length === 0) {
      if (data.ok && data.result) {
        const channelUpdates = data.result.filter(update => 
          update.channel_post && 
          update.channel_post.chat && 
          update.channel_post.chat.id === chatId
        );
        
        for (const update of channelUpdates) {
          messages.push(update.channel_post);
        }
      }
    }
    
    console.log(`Found ${messages.length} messages from channel`);
    
    // Если не получаем сообщений из API, то возвращаем пустой список вместо тестовых данных
    const allPosts = [];
    
    // Обрабатываем сообщения только если они существуют
    if (messages.length > 0) {
      for (const post of messages) {
        // Получаем URL фото, если оно есть
        let photoUrl = null;
        if (post.photo && post.photo.length > 0) {
          // Получаем самое большое фото
          const largestPhoto = post.photo.reduce((max, photo) => 
            photo.file_size > max.file_size ? photo : max, post.photo[0]);
          
          try {
            // Получаем путь к файлу из API
            const fileResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${largestPhoto.file_id}`);
            const fileData = await fileResponse.json();
            
            if (fileData.ok && fileData.result && fileData.result.file_path) {
              photoUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${fileData.result.file_path}`;
            }
          } catch (fileError) {
            console.error('Error getting photo URL:', fileError);
          }
        }
        
        allPosts.push({
          id: post.message_id,
          date: post.date,
          text: post.text || post.caption || '',
          photo_url: photoUrl
        });
      }
    }
    
    // Сортируем сообщения от новых к старым
    allPosts.sort((a, b) => b.date - a.date);
    
    // Применяем пагинацию
    const paginatedPosts = allPosts.slice(offset, offset + limit);
    const totalPosts = allPosts.length;

    return new Response(JSON.stringify({
      posts: paginatedPosts,
      total: totalPosts,
      hasMore: offset + limit < totalPosts
    }), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  } catch (error) {
    console.error('Error in telegram-feed function:', error.message);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      posts: [],
      total: 0,
      hasMore: false
    }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
});
