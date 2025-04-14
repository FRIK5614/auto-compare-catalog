
import { supabase } from '@/integrations/supabase/client';

export const telegramAPI = {
  // Initialize Telegram integration with the website chat
  async initializeIntegration(webhookUrl: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('telegram-chat', {
        body: { 
          action: 'registerWebhook', 
          data: { url: webhookUrl } 
        }
      });
      
      if (error) {
        console.error('Error initializing Telegram integration:', error);
        return false;
      }
      
      console.log('Telegram integration initialized:', data);
      return data.success;
    } catch (error) {
      console.error('Error initializing Telegram integration:', error);
      return false;
    }
  },
  
  // Send a message from website chat to Telegram
  async sendMessageToTelegram(telegramChatId: string, text: string): Promise<boolean> {
    try {
      if (!telegramChatId || !text) {
        console.error('Missing telegramChatId or text');
        return false;
      }
      
      const { data, error } = await supabase.functions.invoke('telegram-chat', {
        body: { 
          action: 'sendToTelegram', 
          data: { 
            chatId: telegramChatId, 
            text 
          } 
        }
      });
      
      if (error) {
        console.error('Error sending message to Telegram:', error);
        return false;
      }
      
      return data.success;
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
      return false;
    }
  },
  
  // Get Telegram chat sessions
  async getTelegramSessions(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('source', 'telegram')
        .order('last_activity', { ascending: false });
        
      if (error) {
        console.error('Error fetching Telegram sessions:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching Telegram sessions:', error);
      return [];
    }
  },
  
  // Get messages for a specific chat session
  async getSessionMessages(sessionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });
        
      if (error) {
        console.error('Error fetching session messages:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching session messages:', error);
      return [];
    }
  }
};
