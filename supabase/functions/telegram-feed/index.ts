
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchTelegramPosts(channelName = "VoeAVTO", limit = 10, offset = 0) {
  try {
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!botToken) {
      throw new Error("Telegram Bot Token is not configured");
    }

    const url = `https://api.telegram.org/bot${botToken}/getUpdates?chat_id=@${channelName}&limit=${limit}&offset=${offset}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Telegram posts: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }
    
    // Transform the data into a more usable format
    const posts = data.result
      .filter((update: any) => update.message && (update.message.text || update.message.photo))
      .map((update: any) => {
        const message = update.message;
        
        // Extract photos if any
        const photos = message.photo 
          ? message.photo.map((photo: any) => photo.file_id)
          : [];
          
        return {
          id: update.update_id,
          text: message.text || "Фото без текста",
          photos: photos,
          date: new Date(message.date * 1000).toISOString(),
          link: `https://t.me/${channelName}/${message.message_id}`
        };
      });
    
    return {
      success: true,
      posts: posts,
      count: posts.length
    };
  } catch (error) {
    console.error("Error fetching Telegram posts:", error);
    return {
      success: false,
      error: error.message,
      posts: [],
      count: 0
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request parameters
    const url = new URL(req.url);
    const channelName = url.searchParams.get("channel") || "VoeAVTO";
    const limit = parseInt(url.searchParams.get("limit") || "6", 10);
    const offset = parseInt(url.searchParams.get("offset") || "0", 10);
    
    // Fetch posts
    const result = await fetchTelegramPosts(channelName, limit, offset);
    
    // Return response
    return new Response(
      JSON.stringify(result),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: result.success ? 200 : 500
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 500
      }
    );
  }
});

