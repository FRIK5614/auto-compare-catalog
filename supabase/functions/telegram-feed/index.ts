
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Function to fetch Telegram posts from a channel
async function fetchTelegramPosts(channelName = "VoeAVTO", limit = 10) {
  try {
    // Use the Telegram API to fetch posts from a public channel
    const response = await fetch(
      `https://api.telegram.org/bot${Deno.env.get("TELEGRAM_BOT_TOKEN")}/getUpdates?chat_id=@${channelName}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Telegram posts: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }
    
    // Transform the data into a more usable format
    const posts = data.result
      .filter((update: any) => update.message && update.message.text)
      .map((update: any) => {
        const message = update.message;
        
        // Extract photos if any
        const photos = message.photo 
          ? [message.photo[message.photo.length - 1].file_id] 
          : [];
          
        return {
          id: update.update_id,
          text: message.text,
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
  try {
    // Parse request parameters
    const url = new URL(req.url);
    const channelName = url.searchParams.get("channel") || "VoeAVTO";
    const limit = parseInt(url.searchParams.get("limit") || "6", 10);
    
    // Fetch posts
    const result = await fetchTelegramPosts(channelName, limit);
    
    // Return response
    return new Response(
      JSON.stringify(result),
      {
        headers: { "Content-Type": "application/json" },
        status: result.success ? 200 : 500
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
