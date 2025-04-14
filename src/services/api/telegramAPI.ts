
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
  
  // Get Telegram chat sessions - using direct SQL queries for now since we're setting up tables
  async getTelegramSessions(): Promise<any[]> {
    try {
      // This will be a placeholder until we create the actual tables
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .limit(0);
        
      if (error) {
        console.error('Error fetching Telegram sessions:', error);
        return [];
      }
      
      // For now, return an empty array until the tables are created
      return [];
    } catch (error) {
      console.error('Error fetching Telegram sessions:', error);
      return [];
    }
  },
  
  // Get messages for a specific chat session
  async getSessionMessages(sessionId: string): Promise<any[]> {
    try {
      // This will be a placeholder until we create the actual tables
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('user_id', sessionId)
        .limit(0);
        
      if (error) {
        console.error('Error fetching session messages:', error);
        return [];
      }
      
      // For now, return an empty array until the tables are created
      return [];
    } catch (error) {
      console.error('Error fetching session messages:', error);
      return [];
    }
  }
};
