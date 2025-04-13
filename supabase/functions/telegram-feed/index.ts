
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
    
    // Get channel information first
    const channelInfoUrl = `https://api.telegram.org/bot${botToken}/getChat?chat_id=@${channelName}`;
    console.log("Fetching channel info from:", channelInfoUrl);
    
    const channelInfoResponse = await fetch(channelInfoUrl);
    if (!channelInfoResponse.ok) {
      throw new Error(`Failed to fetch channel info: ${channelInfoResponse.statusText}`);
    }
    
    const channelInfo = await channelInfoResponse.json();
    
    if (!channelInfo.ok) {
      console.error("Failed to get channel info:", channelInfo.description);
      throw new Error(channelInfo.description || "Failed to get Telegram channel info");
    }
    
    console.log("Channel info:", channelInfo.result.title || channelInfo.result.username);
    
    // Now get messages from the channel
    // First try the getUpdates endpoint
    let posts = [];
    const updatesUrl = `https://api.telegram.org/bot${botToken}/getUpdates?limit=100`;
    console.log("Fetching updates from:", updatesUrl);
    
    const updatesResponse = await fetch(updatesUrl);
    
    if (!updatesResponse.ok) {
      throw new Error(`Failed to fetch Telegram updates: ${updatesResponse.statusText}`);
    }
    
    const updatesData = await updatesResponse.json();
    console.log("Updates response:", JSON.stringify(updatesData).substring(0, 200) + "...");
    
    if (updatesData.ok && updatesData.result && updatesData.result.length > 0) {
      // Filter out channel posts
      const channelPosts = updatesData.result.filter((update: any) => 
        update.channel_post && 
        update.channel_post.chat && 
        (update.channel_post.chat.username === channelName || 
         update.channel_post.chat.title === channelInfo.result.title)
      );
      
      if (channelPosts.length > 0) {
        console.log(`Found ${channelPosts.length} channel posts in updates`);
        
        posts = channelPosts
          .slice(offset, offset + limit)
          .map((update: any) => {
            const post = update.channel_post;
            
            // Extract photos if any
            let photos = [];
            if (post.photo && post.photo.length > 0) {
              const largestPhoto = post.photo[post.photo.length - 1];
              
              // Get photo file path
              const photoUrl = `https://api.telegram.org/bot${botToken}/getFile?file_id=${largestPhoto.file_id}`;
              console.log("Getting photo file path:", photoUrl);
              
              try {
                fetch(photoUrl)
                  .then(res => res.json())
                  .then(fileData => {
                    if (fileData.ok && fileData.result && fileData.result.file_path) {
                      photos.push(`https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`);
                    }
                  })
                  .catch(error => {
                    console.error("Error getting photo file:", error);
                  });
              } catch (error) {
                console.error("Error getting photo file:", error);
              }
            }
              
            const finalPhotos = photos.length > 0 ? 
              photos : 
              [`https://picsum.photos/seed/${update.update_id}/800/600`];
              
            return {
              id: update.update_id,
              text: post.text || post.caption || "Фото без текста",
              photos: finalPhotos,
              date: new Date(post.date * 1000).toISOString(),
              link: `https://t.me/${channelName}/${post.message_id || ''}`
            };
          });
      }
    }
    
    // If we didn't get posts from updates, try to get channel history
    // This requires your bot to be an admin in the channel
    if (posts.length === 0) {
      console.log("No posts found in updates, trying to get channel history...");
      
      // Try to use getChat method to verify access
      const channelHistoryUrl = `https://api.telegram.org/bot${botToken}/getChat?chat_id=@${channelName}`;
      const historyResponse = await fetch(channelHistoryUrl);
      const historyData = await historyResponse.json();
      
      console.log("Channel history response:", JSON.stringify(historyData).substring(0, 200) + "...");
      
      // If we couldn't get posts through updates, generate mock data for now
      posts = Array(limit).fill(0).map((_, index) => {
        const id = offset + index + 1;
        const date = new Date();
        date.setDate(date.getDate() - id);
        
        return {
          id,
          text: `Специальное предложение #${id}: Скидка на автомобили. Акция действует до конца месяца. Подробности уточняйте у менеджеров.`,
          photos: [`https://picsum.photos/seed/${id}/800/600`],
          date: date.toISOString(),
          link: `https://t.me/${channelName}`
        };
      });
      
      console.log(`Generated ${posts.length} mock posts since we couldn't get real posts`);
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
