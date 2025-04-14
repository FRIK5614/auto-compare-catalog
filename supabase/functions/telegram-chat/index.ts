
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

async function registerWebhook(url: string) {
  try {
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

async function sendToTelegram(chatId: string, text: string) {
  try {
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
    return { success: data.ok, data };
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    return { success: false, error: error.message };
  }
}

async function handleTelegramUpdate(update: any) {
  try {
    // Handle only message updates for now
    if (!update.message) {
      return { success: true, message: 'No message in update' };
    }
    
    const message = update.message;
    const chatId = message.chat.id.toString();
    const text = message.text || '';
    const userName = message.from.first_name || 'Пользователь Telegram';
    const userId = message.from.id.toString();
    const sessionId = `telegram-${chatId}`;
    
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
          telegram_chat_id: chatId
        });
    } else {
      // Update existing session
      await supabase
        .from('chat_sessions')
        .update({
          last_activity: new Date().toISOString(),
          unread_count: existingSession.unread_count + 1
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
        content: text,
        is_read: false
      });
    
    return { success: true };
  } catch (error) {
    console.error('Error handling Telegram update:', error);
    return { success: false, error: error.message };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    });
  }
  
  try {
    const { action, data } = await req.json();
    
    if (action === 'registerWebhook') {
      const result = await registerWebhook(data.url);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    if (action === 'sendToTelegram') {
      const result = await sendToTelegram(data.chatId, data.text);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    }
    
    // If no action specified, assume it's a webhook update from Telegram
    const update = await req.json();
    const result = await handleTelegramUpdate(update);
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
})
