
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
    // Get order data from request body
    const { order, adminChatIds } = await req.json();
    
    if (!order) {
      throw new Error('Order data is required');
    }

    if (!adminChatIds || !adminChatIds.length) {
      throw new Error('Admin chat IDs are required for notification');
    }

    // Fetch the Telegram bot token from the environment
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
    }

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

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to send notification to chat ID ${chatId}:`, errorData);
        return { chatId, success: false, error: errorData };
      }

      return { chatId, success: true };
    });

    const results = await Promise.all(notificationPromises);
    
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
