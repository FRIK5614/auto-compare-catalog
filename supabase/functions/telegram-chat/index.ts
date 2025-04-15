
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

// Define chat types directly here instead of importing from src/types/chat
interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'admin' | 'system' | 'telegram';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: ChatAttachment[];
}

interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

interface ChatSession {
  id: string;
  userId?: string;
  userName: string;
  userContact?: string;
  status: 'active' | 'closed' | 'pending';
  lastActivity: string;
  unreadCount: number;
  telegramChatId?: string;
  source?: 'website' | 'telegram';
}

// Access environment variables
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function registerWebhook(url: string) {
  try {
    console.log(`Setting webhook URL: ${url}`);
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    console.log('Telegram webhook registration response:', data);
    
    return { success: data.ok, data };
  } catch (error) {
    console.error('Error registering webhook:', error);
    return { success: false, error: error.message };
  }
}

async function getWebhookInfo() {
  try {
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return { success: data.ok, data };
  } catch (error) {
    console.error('Error getting webhook info:', error);
    return { success: false, error: error.message };
  }
}

async function deleteWebhook() {
  try {
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook?drop_pending_updates=true`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return { success: data.ok, data };
  } catch (error) {
    console.error('Error deleting webhook:', error);
    return { success: false, error: error.message };
  }
}

async function sendToTelegram(chatId: string, text: string) {
  try {
    console.log(`Sending message to Telegram chat ID: ${chatId}`);
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML'
      })
    });
    
    const data = await response.json();
    console.log('Send to Telegram response:', data);
    
    if (!data.ok) {
      console.error('Telegram API error:', data.description);
      return { success: false, error: data.description };
    }
    
    return { success: data.ok, data };
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return { success: false, error: error.message };
  }
}

async function getMyCommands() {
  try {
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMyCommands`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    return { success: data.ok, data };
  } catch (error) {
    console.error('Error getting bot commands:', error);
    return { success: false, error: error.message };
  }
}

async function setMyCommands() {
  try {
    const commands = [
      { command: "start", description: "Начать взаимодействие с ботом" },
      { command: "help", description: "Получить справку" },
      { command: "orders", description: "Проверить список заказов" }
    ];
    
    const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyCommands`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commands })
    });
    
    const data = await response.json();
    return { success: data.ok, data };
  } catch (error) {
    console.error('Error setting bot commands:', error);
    return { success: false, error: error.message };
  }
}

async function handleTelegramUpdate(update: any) {
  try {
    console.log('Processing Telegram update:', JSON.stringify(update).substring(0, 200) + '...');
    
    // Handle different types of updates
    if (update.message) {
      return await handleTelegramMessage(update.message);
    } else if (update.callback_query) {
      return await handleCallbackQuery(update.callback_query);
    }
    
    return { success: true, message: 'No relevant data in update' };
  } catch (error) {
    console.error('Error handling Telegram update:', error);
    return { success: false, error: error.message };
  }
}

async function handleTelegramMessage(message: any) {
  const chatId = message.chat.id.toString();
  const messageText = message.text || '';
  const userName = message.from.first_name || 'Пользователь Telegram';
  const userId = message.from.id.toString();
  const sessionId = `telegram-${chatId}`;
  
  console.log(`Received message from ${userName} (${userId}): ${messageText}`);
  
  // Handle commands
  if (messageText.startsWith('/')) {
    return await handleTelegramCommand(message, sessionId);
  }
  
  // Get or create chat session
  const { data: existingSession } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  
  if (!existingSession) {
    // Create a new session
    await supabase
      .from('chat_sessions')
      .insert({
        id: sessionId,
        user_name: userName,
        user_contact: userId,
        status: 'active',
        unread_count: 1,
        source: 'telegram',
        telegram_chat_id: chatId,
        last_activity: new Date().toISOString()
      });
      
    // Send welcome message
    await sendToTelegram(chatId, `Привет, ${userName}! Ваше сообщение будет передано администратору. Скоро вам ответят.`);
  } else {
    // Update existing session
    await supabase
      .from('chat_sessions')
      .update({
        last_activity: new Date().toISOString(),
        unread_count: existingSession.unread_count + 1,
        status: 'active'
      })
      .eq('id', sessionId);
  }
  
  // Store the message
  await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      sender_id: userId,
      sender_name: userName,
      sender_type: 'telegram',
      content: messageText,
      is_read: false
    });
  
  return { success: true };
}

async function handleTelegramCommand(message: any, sessionId: string) {
  const chatId = message.chat.id.toString();
  const command = message.text.split(' ')[0];
  
  switch (command) {
    case '/start':
      await sendToTelegram(chatId, 'Добро пожаловать в AutoDeal! Вы можете задать любой вопрос о наших автомобилях, и наш менеджер скоро вам ответит.');
      break;
      
    case '/help':
      await sendToTelegram(chatId, `
<b>Доступные команды:</b>
/start - Начать взаимодействие с ботом
/help - Получить справку
/orders - Проверить список ваших заказов
      `);
      break;
      
    case '/orders':
      // Get orders from database
      const { data: orders, error } = await supabase
        .from('orders')
        .select(`
          *,
          vehicles:car_id (
            id, 
            brand, 
            model, 
            image_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching orders:', error);
        await sendToTelegram(chatId, 'Произошла ошибка при загрузке заказов');
        return { success: false, error: error.message };
      }
      
      if (!orders || orders.length === 0) {
        await sendToTelegram(chatId, 'У вас пока нет заказов');
        return { success: true };
      }
      
      let orderMessage = '<b>Ваши последние заказы:</b>\n\n';
      
      orders.forEach((order, index) => {
        const car = order.vehicles ? `${order.vehicles.brand} ${order.vehicles.model}` : 'Неизвестный автомобиль';
        const status = getStatusText(order.status);
        const date = new Date(order.created_at).toLocaleDateString();
        
        orderMessage += `<b>${index + 1}. ${car}</b>\n`;
        orderMessage += `Статус: ${status}\n`;
        orderMessage += `Дата: ${date}\n\n`;
      });
      
      await sendToTelegram(chatId, orderMessage);
      break;
      
    default:
      await sendToTelegram(chatId, 'Неизвестная команда. Введите /help для получения списка команд.');
  }
  
  return { success: true };
}

function getStatusText(status: string): string {
  switch (status) {
    case 'new': return '🆕 Новый';
    case 'processing': return '⏳ В обработке';
    case 'completed': return '✅ Завершен';
    case 'canceled': return '❌ Отменен';
    default: return status;
  }
}

async function handleCallbackQuery(query: any) {
  const chatId = query.message.chat.id.toString();
  const data = query.data;
  
  // Process callback data (button clicks)
  await sendToTelegram(chatId, `Вы выбрали: ${data}`);
  
  return { success: true };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Extract parameters from the request
    let action, data;
    
    try {
      // Try to parse as JSON
      const requestData = await req.json();
      action = requestData.action;
      data = requestData.data;
    } catch (parseError) {
      // If not JSON, assume it's a webhook update from Telegram
      action = null;
      data = null;
    }
    
    // Handle various actions
    if (action === 'registerWebhook') {
      const result = await registerWebhook(data.url);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      });
    }
    
    if (action === 'getWebhookInfo') {
      const result = await getWebhookInfo();
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      });
    }
    
    if (action === 'deleteWebhook') {
      const result = await deleteWebhook();
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      });
    }
    
    if (action === 'sendToTelegram') {
      const result = await sendToTelegram(data.chatId, data.text);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      });
    }
    
    if (action === 'getMyCommands') {
      const result = await getMyCommands();
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      });
    }
    
    if (action === 'setMyCommands') {
      const result = await setMyCommands();
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      });
    }
    
    // If no action specified, assume it's a webhook update from Telegram
    try {
      const update = await req.json();
      const result = await handleTelegramUpdate(update);
      
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200
      });
    } catch (webhookError) {
      console.error('Failed to parse webhook data:', webhookError);
      return new Response(JSON.stringify({ success: false, error: 'Invalid webhook data' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 400
      });
    }
    
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500
    });
  }
})
