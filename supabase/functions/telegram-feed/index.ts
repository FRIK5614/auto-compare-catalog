
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body or fallback to default channel
    const { channelName = 'VoeAVTO' } = await req.json();

    // Fetch the Telegram bot token from the environment
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
    }

    // Get channel updates from Telegram API
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/getUpdates`);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Telegram API error:', errorData);
      throw new Error(`Telegram API error: ${errorData.description || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Telegram API response:', JSON.stringify(data).slice(0, 200) + '...');

    // Process the messages, focusing on channel posts
    let posts = [];
    
    if (data.ok && data.result) {
      // Extract channel posts
      posts = data.result
        .filter(update => 
          update.channel_post || 
          (update.message && update.message.chat && update.message.chat.username === channelName)
        )
        .map(update => {
          const post = update.channel_post || update.message;
          
          // Get the largest photo if available
          let photoUrl = null;
          if (post.photo && post.photo.length > 0) {
            const largestPhoto = post.photo.reduce((max, photo) => 
              photo.file_size > max.file_size ? photo : max, post.photo[0]);
            
            photoUrl = `https://api.telegram.org/file/bot${telegramToken}/${largestPhoto.file_id}`;
          }
          
          return {
            id: post.message_id,
            date: post.date,
            text: post.text || post.caption || '',
            photo_url: photoUrl
          };
        })
        .slice(0, 20); // Limit to 20 most recent posts
    }

    return new Response(JSON.stringify(posts), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  } catch (error) {
    console.error('Error in telegram-feed function:', error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
});
