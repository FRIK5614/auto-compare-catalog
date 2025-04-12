
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

    console.log(`Fetching Telegram channel messages from ${channelName}`);
    
    // Use Telegram API to get channel history
    const url = `https://api.telegram.org/bot${botToken}/getUpdates?limit=100`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Telegram posts: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }

    console.log(`Got ${data.result?.length || 0} updates from Telegram API`);
    
    // Filter updates for channel posts
    let posts = [];
    
    if (data.result && data.result.length > 0) {
      posts = data.result
        .filter((update: any) => 
          update.channel_post || 
          (update.message && update.message.chat && update.message.chat.username === channelName)
        )
        .slice(offset, offset + limit)
        .map((update: any) => {
          const post = update.channel_post || update.message;
          
          // Extract photos if any
          const photos = post.photo 
            ? post.photo.map((photo: any) => {
                // Get the largest photo (they are sorted by size, largest last)
                const largestPhoto = post.photo[post.photo.length - 1];
                return `https://api.telegram.org/bot${botToken}/getFile?file_id=${largestPhoto.file_id}`;
              })
            : [];
            
          return {
            id: update.update_id,
            text: post.text || post.caption || "Фото без текста",
            photos: photos.length > 0 ? photos : [`https://picsum.photos/seed/${update.update_id}/800/600`],
            date: new Date(post.date * 1000).toISOString(),
            link: `https://t.me/${channelName}/${post.message_id || ''}`
          };
        });
    }
    
    // If no posts were found, try to fetch from the channel directly
    if (posts.length === 0) {
      console.log("No posts found through updates, fetching from channel directly");
      
      try {
        // Try to get channel info
        const channelInfoUrl = `https://api.telegram.org/bot${botToken}/getChat?chat_id=@${channelName}`;
        const channelInfoResponse = await fetch(channelInfoUrl);
        const channelInfo = await channelInfoResponse.json();
        
        console.log("Channel info response:", channelInfo);
        
        // If we got channel info, try to get recent messages
        if (channelInfo.ok) {
          console.log("Channel found, attempting to get recent messages");
          // Unfortunately, bot API doesn't allow getting messages directly from channel without admin rights
          // We would ideally use getUpdates with a channel filter
        }
      } catch (e) {
        console.error("Error fetching channel directly:", e);
      }
    }
    
    // If we still don't have posts, return with a clear error message
    if (posts.length === 0) {
      console.log("Still no posts found, please check bot permissions");
      return {
        success: false,
        error: "No posts could be retrieved. Make sure the bot has proper access to the channel and is set as an administrator.",
        posts: [],
        count: 0
      };
    }
    
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
    // Parse request body or query parameters
    let channelName = "VoeAVTO";
    let limit = 12;
    let offset = 0;
    
    // Process the request data
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        channelName = body.channel || channelName;
        limit = body.limit || limit;
        offset = body.offset || offset;
        console.log("POST request body:", body);
      } catch (e) {
        console.error("Error parsing JSON body:", e);
      }
    } else {
      const url = new URL(req.url);
      channelName = url.searchParams.get("channel") || channelName;
      limit = parseInt(url.searchParams.get("limit") || limit.toString(), 10);
      offset = parseInt(url.searchParams.get("offset") || offset.toString(), 10);
      console.log("GET request params:", { channelName, limit, offset });
    }
    
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
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        posts: []
      }),
      {
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        },
        status: 200
      }
    );
  }
});
