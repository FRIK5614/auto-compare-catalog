
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
    console.log("Received telegram-notify request");
    
    // Get order data from request body
    const { order, adminChatIds } = await req.json();
    
    if (!order) {
      throw new Error('Order data is required');
    }

    if (!adminChatIds || !adminChatIds.length) {
      console.log("No admin chat IDs provided, using default");
      // If no admin IDs are provided, use default from environment variable
      adminChatIds = [Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')];
      
      if (!adminChatIds[0]) {
        throw new Error('No admin chat IDs available for notification');
      }
    }

    // Fetch the Telegram bot token from the environment
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
    }

    console.log(`Found Telegram token, sending to ${adminChatIds.length} admins`);

    // Create the message text
    const car = order.car || { brand: 'Неизвестно', model: 'Неизвестно' };
    const messageText = `
🔔 *НОВЫЙ ЗАКАЗ #${order.id}*

👤 *Клиент:* ${order.customerName}
📱 *Телефон:* ${order.customerPhone}
📧 *Email:* ${order.customerEmail || 'Не указан'}

🚗 *Автомобиль:* ${car.brand} ${car.model}
💰 *Стоимость:* ${car.price?.base || 'Не указана'} ₽

⏰ *Дата создания:* ${new Date(order.createdAt).toLocaleString('ru-RU')}
    `;

    // Send notification to each admin
    const notificationPromises = adminChatIds.map(async (chatId) => {
      if (!chatId) return { success: false, error: "Invalid chat ID" };
      
      console.log(`Sending notification to chat ID: ${chatId}`);
      
      const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'Markdown',
        }),
      });

      const responseData = await response.json();
      console.log("Telegram API response:", JSON.stringify(responseData));

      if (!response.ok) {
        console.error(`Failed to send notification to chat ID ${chatId}:`, responseData);
        return { chatId, success: false, error: responseData };
      }

      return { chatId, success: true };
    });

    const results = await Promise.all(notificationPromises);
    console.log("Notification results:", JSON.stringify(results));
    
    return new Response(JSON.stringify({ 
      message: 'Notifications sent',
      results 
    }), {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  } catch (error) {
    console.error('Error in telegram-notify function:', error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        ...corsHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
});
