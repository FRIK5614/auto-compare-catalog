
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.6';
import { v4 as uuidv4 } from 'https://deno.land/std@0.119.0/uuid/mod.ts';

// Define chat types locally for the edge function
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
  messages: ChatMessage[];
  awaitingPhoneNumber?: boolean;
  telegramChatId?: string;
  source?: 'website' | 'telegram';
}

// Define CORS headers
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
    // Fetch Telegram bot token from environment
    const telegramToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    if (!telegramToken) {
      throw new Error('TELEGRAM_BOT_TOKEN not found in environment variables');
    }

    // Get request body
    const { action, data } = await req.json();
    
    // Connect to Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process based on action type
    let result;
    
    switch (action) {
      case 'webhook':
        // Handle Telegram webhook updates
        result = await processTelegramUpdate(data, telegramToken, supabase);
        break;
        
      case 'sendToTelegram':
        // Send website chat message to Telegram
        result = await sendToTelegram(data, telegramToken);
        break;
        
      case 'registerWebhook':
        // Set up Telegram webhook
        result = await registerWebhook(telegramToken, data.url);
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in telegram-chat function:', error.message);
    
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Process updates from Telegram webhook
async function processTelegramUpdate(update: any, token: string, supabase: any) {
  console.log('Processing Telegram update:', JSON.stringify(update));
  
  if (!update.message) {
    return { status: 'no_message' };
  }
  
  const { message } = update;
  const chatId = message.chat.id;
  const userName = message.from.first_name || 'Telegram User';
  const messageText = message.text || '';
  
  // Create or get session for this Telegram user
  const sessionId = `telegram-${chatId}`;
  
  // Check if this session exists in our database
  const { data: sessionData } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
    
  if (!sessionData) {
    // Create new session for this Telegram user
    await supabase.from('chat_sessions').insert({
      id: sessionId,
      user_name: userName,
      source: 'telegram',
      telegram_chat_id: chatId.toString(),
      status: 'active',
      last_activity: new Date().toISOString(),
      unread_count: 0
    });
  }
  
  // Add message to our system
  const newMessage = {
    id: uuidv4(),
    session_id: sessionId,
    sender_id: chatId.toString(),
    sender_name: userName,
    sender_type: 'telegram',
    content: messageText,
    timestamp: new Date().toISOString(),
    is_read: false
  };
  
  await supabase.from('chat_messages').insert(newMessage);
  
  return { status: 'processed', sessionId };
}

// Send message from website chat to Telegram
async function sendToTelegram(data: any, token: string) {
  const { chatId, text } = data;
  
  if (!chatId || !text) {
    throw new Error('Missing chatId or text in sendToTelegram');
  }
  
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML'
    }),
  });
  
  const responseData = await response.json();
  
  if (!responseData.ok) {
    throw new Error(`Telegram API error: ${JSON.stringify(responseData)}`);
  }
  
  return responseData;
}

// Register a webhook URL with Telegram
async function registerWebhook(token: string, webhookUrl: string) {
  if (!webhookUrl) {
    throw new Error('Missing webhookUrl in registerWebhook');
  }
  
  const url = `https://api.telegram.org/bot${token}/setWebhook`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: webhookUrl }),
  });
  
  return await response.json();
}
