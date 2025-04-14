
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Telegram bot token from environment variables
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '7829427763:AAEbz_SNa835tCr0u4tJ2wcDx68MuIsbftM';

// Function to fetch posts from Telegram channel
async function fetchTelegramPosts(channelName: string, limit: number = 10, offset: number = 0) {
  console.log(`Fetching Telegram posts from ${channelName}, limit: ${limit}, offset: ${offset}`);
  
  try {
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?limit=${limit}&offset=${offset}`;
    console.log(`Making API request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Telegram API error: ${response.status} ${errorText}`);
      throw new Error(`Failed to fetch from Telegram API: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Received response from Telegram API:`, data);
    
    if (!data.ok) {
      throw new Error(`Telegram API returned error: ${data.description}`);
    }
    
    // Transform Telegram updates into our standard format
    const posts = data.result
      .filter(update => update.message && update.message.chat && 
              (update.message.chat.username === channelName || 
               update.message.chat.title?.includes(channelName)))
      .map(update => {
        const message = update.message;
        const photos = [];
        
        // Extract photos if available
        if (message.photo && message.photo.length > 0) {
          // Get the largest photo
          const largestPhoto = message.photo.reduce((prev, current) => 
            (prev.file_size > current.file_size) ? prev : current
          );
          
          if (largestPhoto && largestPhoto.file_id) {
            photos.push(`https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${largestPhoto.file_id}`);
          }
        }
        
        return {
          id: update.update_id,
          text: message.text || message.caption || '',
          photos: photos,
          date: new Date(message.date * 1000).toISOString(),
          link: `https://t.me/${channelName}/${message.message_id}`
        };
      });
    
    return {
      success: true,
      posts,
    };
  } catch (error) {
    console.error('Error fetching Telegram posts:', error);
    return {
      success: false,
      error: error.message,
      posts: [],
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request parameters
    const { channel = 'VoeAVTO', limit = 10, offset = 0 } = await req.json();
    
    // Fetch posts from Telegram
    const result = await fetchTelegramPosts(channel, limit, offset);
    
    // Return the result
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error('Error in telegram-feed edge function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      posts: [],
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
