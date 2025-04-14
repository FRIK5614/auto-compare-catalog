import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatSession, ChatMessage, ChatState } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import { useLocation } from 'react-router-dom';
import { telegramAPI } from '@/services/api/telegramAPI';
import { supabase } from '@/integrations/supabase/client';

interface ChatContextType {
  chatState: ChatState;
  isOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  minimizeChat: () => void;
  maximizeChat: () => void;
  sendMessage: (content: string, attachments?: any[]) => void;
  setActiveSession: (sessionId: string) => void;
  startNewSession: (userName?: string, userContact?: string) => void;
  closeSession: (sessionId: string) => void;
  submitPhoneNumber: (phone: string) => void;
  telegramConnected: boolean;
  connectTelegram: () => Promise<boolean>;
  disconnectTelegram: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({
    sessions: [],
    activeSessionId: null,
    isMinimized: false
  });
  const [responseTimeoutId, setResponseTimeoutId] = useState<number | null>(null);
  const [hasRequestedContact, setHasRequestedContact] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const { toast } = useToast();
  const { isAdmin } = useAdmin();
  const location = useLocation();

  // Load chat sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions);
        setChatState(prevState => ({
          ...prevState,
          sessions: parsedSessions
        }));
      } catch (error) {
        console.error('Failed to parse saved chat sessions:', error);
      }
    }
    
    // Check if Telegram is already connected
    const telegramStatus = localStorage.getItem('telegramConnected');
    if (telegramStatus === 'true') {
      setTelegramConnected(true);
    }
  }, []);

  // Save chat sessions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatState.sessions));
  }, [chatState.sessions]);

  // Load Telegram chat sessions when admin views the chat
  useEffect(() => {
    if (isAdmin && location.pathname.includes('/admin/chat')) {
      loadTelegramSessions();
    }
  }, [isAdmin, location.pathname]);

  // Subscribe to real-time changes for chat messages
  useEffect(() => {
    if (!isAdmin) return;
    
    const channel = supabase
      .channel('chat-updates')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages' 
      }, (payload) => {
        const newMessage = payload.new as any;
        
        // Update our local state with the new message
        setChatState(prevState => {
          // Find the session this message belongs to
          const sessionIndex = prevState.sessions.findIndex(s => s.id === newMessage.session_id);
          
          if (sessionIndex >= 0) {
            // Update existing session
            const updatedSessions = [...prevState.sessions];
            const session = updatedSessions[sessionIndex];
            
            // Convert the message to our format
            const chatMessage: ChatMessage = {
              id: newMessage.id,
              senderId: newMessage.sender_id,
              senderName: newMessage.sender_name,
              senderType: newMessage.sender_type,
              content: newMessage.content,
              timestamp: newMessage.timestamp,
              isRead: newMessage.is_read,
              attachments: newMessage.attachments
            };
            
            // Add message to session
            updatedSessions[sessionIndex] = {
              ...session,
              messages: [...session.messages, chatMessage],
              lastActivity: newMessage.timestamp,
              unreadCount: session.id === prevState.activeSessionId ? 0 : session.unreadCount + 1
            };
            
            return {
              ...prevState,
              sessions: updatedSessions
            };
          } else if (newMessage.session_id.startsWith('telegram-')) {
            // This is a new Telegram session
            loadTelegramSessions();
          }
          
          return prevState;
        });
        
        // Show notification for new messages
        if (isAdmin && (!isOpen || chatState.isMinimized)) {
          toast({
            title: "Новое сообщение",
            description: "Получено новое сообщение в чате"
          });
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, isOpen, chatState.isMinimized]);

  // Don't show chat widget on admin pages
  useEffect(() => {
    if (isAdmin && isOpen && location.pathname.startsWith('/admin')) {
      setIsOpen(false);
    }
  }, [isAdmin, isOpen, location]);

  // Add a system message to welcome the user when they start a new session
  const addSystemMessage = (sessionId: string, content: string = 'Здравствуйте! Чем мы можем вам помочь?') => {
    const systemMessage: ChatMessage = {
      id: uuidv4(),
      senderId: 'system',
      senderName: 'Система',
      senderType: 'system',
      content,
      timestamp: new Date().toISOString(),
      isRead: true
    };

    setChatState(prevState => ({
      ...prevState,
      sessions: prevState.sessions.map(session => 
        session.id === sessionId 
          ? { ...session, messages: [...session.messages, systemMessage] }
          : session
      )
    }));
  };

  const loadTelegramSessions = async () => {
    if (!telegramConnected) return;
    
    try {
      const telegramSessions = await telegramAPI.getTelegramSessions();
      
      if (telegramSessions.length > 0) {
        // Convert Telegram sessions to our format
        const formattedSessions = await Promise.all(
          telegramSessions.map(async (session) => {
            // Get messages for this session
            const messages = await telegramAPI.getSessionMessages(session.id);
            
            // Format messages
            const formattedMessages: ChatMessage[] = messages.map(msg => ({
              id: msg.id,
              senderId: msg.sender_id,
              senderName: msg.sender_name,
              senderType: msg.sender_type,
              content: msg.content,
              timestamp: msg.timestamp,
              isRead: msg.is_read,
              attachments: msg.attachments
            }));
            
            // Create session object
            return {
              id: session.id,
              userName: session.user_name,
              userContact: session.telegram_chat_id,
              status: session.status,
              lastActivity: session.last_activity,
              unreadCount: session.unread_count,
              messages: formattedMessages,
              telegramChatId: session.telegram_chat_id,
              source: 'telegram'
            } as ChatSession;
          })
        );
        
        // Update state with Telegram sessions
        setChatState(prevState => {
          // Filter out existing Telegram sessions
          const existingSessionsFiltered = prevState.sessions.filter(
            s => !s.id.startsWith('telegram-')
          );
          
          return {
            ...prevState,
            sessions: [...existingSessionsFiltered, ...formattedSessions]
          };
        });
      }
    } catch (error) {
      console.error('Error loading Telegram sessions:', error);
    }
  };

  const connectTelegram = async (): Promise<boolean> => {
    try {
      // Generate a webhook URL for the Telegram bot
      // For production, this should be your actual domain
      const host = window.location.host;
      const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
      const webhookUrl = isLocal 
        ? `https://efqxihbtoftrqqkvemgb.supabase.co/functions/v1/telegram-chat`
        : `https://${host}/api/telegram-chat`;
      
      const success = await telegramAPI.initializeIntegration(webhookUrl);
      
      if (success) {
        setTelegramConnected(true);
        localStorage.setItem('telegramConnected', 'true');
        
        // Load Telegram sessions
        await loadTelegramSessions();
        
        toast({
          title: "Telegram подключен",
          description: "Бот активирован и готов к получению сообщений"
        });
      }
      
      return success;
    } catch (error) {
      console.error('Failed to connect Telegram:', error);
      
      toast({
        variant: "destructive",
        title: "Ошибка подключения",
        description: "Не удалось по��ключить Telegram"
      });
      
      return false;
    }
  };

  const disconnectTelegram = () => {
    setTelegramConnected(false);
    localStorage.removeItem('telegramConnected');
    
    // Remove Telegram sessions from state
    setChatState(prevState => {
      const nonTelegramSessions = prevState.sessions.filter(
        session => !session.id.startsWith('telegram-')
      );
      
      return {
        ...prevState,
        sessions: nonTelegramSessions,
        activeSessionId: nonTelegramSessions.length > 0 
          ? nonTelegramSessions[0].id 
          : null
      };
    });
    
    toast({
      title: "Telegram отключен",
      description: "Бот деактивирован"
    });
  };

  const openChat = () => {
    // Don't open chat on admin pages
    if (isAdmin && location.pathname.startsWith('/admin')) {
      return;
    }

    setIsOpen(true);
    setChatState(prev => ({ ...prev, isMinimized: false }));
    setHasRequestedContact(false);
    
    // If there's no active session, start a new one
    if (!chatState.activeSessionId && chatState.sessions.length === 0) {
      startNewSession();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    
    // Clear any pending response timeouts
    if (responseTimeoutId) {
      clearTimeout(responseTimeoutId);
      setResponseTimeoutId(null);
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const minimizeChat = () => {
    setChatState(prev => ({ ...prev, isMinimized: true }));
  };

  const maximizeChat = () => {
    setChatState(prev => ({ ...prev, isMinimized: false }));
  };

  const requestPhoneNumber = (sessionId: string) => {
    if (hasRequestedContact) return;
    
    const systemMessage: ChatMessage = {
      id: uuidv4(),
      senderId: 'system',
      senderName: 'Система',
      senderType: 'system',
      content: 'Кажется, наши менеджеры сейчас заняты. Пожалуйста, оставьте свой номер телефона, и мы свяжемся с вами в ближайшее время или оставьте заявку на консультацию.',
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    setChatState(prevState => ({
      ...prevState,
      sessions: prevState.sessions.map(session => 
        session.id === sessionId 
          ? { 
              ...session, 
              messages: [...session.messages, systemMessage],
              awaitingPhoneNumber: true
            }
          : session
      )
    }));
    
    setHasRequestedContact(true);
  };

  const submitPhoneNumber = (phone: string) => {
    if (!chatState.activeSessionId) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      senderId: 'user',
      senderName: 'Вы',
      senderType: 'user',
      content: `Мой номер телефона: ${phone}`,
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    const confirmationMessage: ChatMessage = {
      id: uuidv4(),
      senderId: 'system',
      senderName: 'Система',
      senderType: 'system',
      content: 'Спасибо! Мы получили ваш номер телефона и свяжемся с вами в ближайшее время.',
      timestamp: new Date().toISOString(),
      isRead: true
    };
    
    setChatState(prevState => ({
      ...prevState,
      sessions: prevState.sessions.map(session => 
        session.id === prevState.activeSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, userMessage, confirmationMessage],
              userContact: phone,
              awaitingPhoneNumber: false
            }
          : session
      )
    }));
    
    // Clear any pending response timeouts
    if (responseTimeoutId) {
      clearTimeout(responseTimeoutId);
      setResponseTimeoutId(null);
    }
  };

  const sendMessage = (content: string, attachments: any[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    
    // If there's no active session, create one
    if (!chatState.activeSessionId) {
      startNewSession();
      return;
    }
    
    const message: ChatMessage = {
      id: uuidv4(),
      senderId: 'user',
      senderName: 'Вы',
      senderType: 'user',
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachments: attachments.map(att => ({
        id: uuidv4(),
        ...att
      }))
    };
    
    // Clear any pending response timeouts
    if (responseTimeoutId) {
      clearTimeout(responseTimeoutId);
      setResponseTimeoutId(null);
    }
    
    setChatState(prevState => {
      const activeSession = prevState.sessions.find(session => session.id === prevState.activeSessionId);
      
      if (!activeSession) return prevState;
      
      const isPhoneNumberSubmission = activeSession.awaitingPhoneNumber && 
        content.match(/\+?\d[\d\s-]{8,}/); // Simple phone number regex
      
      // If this is a Telegram session, send the message to Telegram
      if (activeSession.source === 'telegram' && activeSession.telegramChatId) {
        telegramAPI.sendMessageToTelegram(
          activeSession.telegramChatId,
          `<b>Администратор:</b> ${content}`
        );
      }
      
      if (isPhoneNumberSubmission) {
        // If this is a phone number submission, handle it differently
        return {
          ...prevState,
          sessions: prevState.sessions.map(session => 
            session.id === prevState.activeSessionId 
              ? { 
                  ...session, 
                  messages: [...session.messages, message],
                  userContact: content,
                  awaitingPhoneNumber: false,
                  lastActivity: new Date().toISOString()
                }
              : session
          )
        };
      }
      
      const updatedSessions = prevState.sessions.map(session => 
        session.id === prevState.activeSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, message],
              lastActivity: new Date().toISOString()
            }
          : session
      );
      
      return {
        ...prevState,
        sessions: updatedSessions
      };
    });
    
    // Set a timeout for the system to request a phone number if no response
    const timeoutId = window.setTimeout(() => {
      if (chatState.activeSessionId) {
        requestPhoneNumber(chatState.activeSessionId);
      }
    }, 10000); // 10 seconds
    
    setResponseTimeoutId(timeoutId);
    
    // Simulate a response from the admin after a delay (unless its a Telegram session)
    const activeSession = chatState.sessions.find(session => session.id === chatState.activeSessionId);
    if (!activeSession?.source || activeSession.source !== 'telegram') {
      setTimeout(() => {
        simulateAdminResponse(content);
      }, 1000);
    }
  };

  const simulateAdminResponse = (userMessage: string) => {
    // Only respond if there's an active session
    if (!chatState.activeSessionId) return;
    
    // Clear any pending response timeouts
    if (responseTimeoutId) {
      clearTimeout(responseTimeoutId);
      setResponseTimeoutId(null);
    }
    
    let responseContent = 'Спасибо за ваше сообщение! Наш специалист ответит вам в ближайшее время.';
    
    // Some basic responses based on keywords
    if (userMessage.toLowerCase().includes('цена') || userMessage.toLowerCase().includes('стоимость')) {
      responseContent = 'Цены на наши автомобили начинаются от 1 200 000 рублей. Для получения более подробной информации, пожалуйста, уточните модель автомобиля, которая вас интересует.';
    } else if (userMessage.toLowerCase().includes('тест-драйв')) {
      responseContent = 'Вы можете записаться на тест-драйв, позвонив по телефону +7 (999) 123-45-67 или оставив заявку на нашем сайте. Мы свяжемся с вами для согласования даты и времени.';
    } else if (userMessage.toLowerCase().includes('кредит')) {
      responseContent = 'Мы предлагаем выгодные кредитные программы от наших банков-партнеров. Первоначальный взнос от 10%, ставка от 5.9% годовых. Для расчета кредита, пожалуйста, свяжитесь с нашими консультантами.';
    }
    
    const adminMessage: ChatMessage = {
      id: uuidv4(),
      senderId: 'admin',
      senderName: 'Менеджер',
      senderType: 'admin',
      content: responseContent,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setChatState(prevState => ({
      ...prevState,
      sessions: prevState.sessions.map(session => 
        session.id === prevState.activeSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, adminMessage],
              lastActivity: new Date().toISOString(),
              unreadCount: session.id === prevState.activeSessionId ? 0 : session.unreadCount + 1
            }
          : session
      )
    }));
    
    // Show notification if chat is minimized
    if (chatState.isMinimized || !isOpen) {
      toast({
        title: "Новое сообщение",
        description: "Вы получили новое сообщение от менеджера"
      });
    }
  };

  const setActiveSession = (sessionId: string) => {
    setChatState(prevState => ({
      ...prevState,
      activeSessionId: sessionId,
      sessions: prevState.sessions.map(session => 
        session.id === sessionId 
          ? { ...session, unreadCount: 0 } // Mark all messages as read
          : session
      )
    }));
  };

  const startNewSession = (userName = 'Гость', userContact = '') => {
    const sessionId = uuidv4();
    const newSession: ChatSession = {
      id: sessionId,
      userName,
      userContact,
      status: 'active',
      lastActivity: new Date().toISOString(),
      unreadCount: 0,
      messages: [],
      awaitingPhoneNumber: false
    };
    
    setChatState(prevState => ({
      ...prevState,
      activeSessionId: sessionId,
      sessions: [...prevState.sessions, newSession]
    }));
    
    // Add welcome message
    setTimeout(() => {
      addSystemMessage(sessionId);
    }, 300);
  };

  const closeSession = (sessionId: string) => {
    setChatState(prevState => {
      const updatedSessions = prevState.sessions.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'closed' as const }
          : session
      );
      
      // If the closed session was active, set another session as active
      let newActiveSessionId = prevState.activeSessionId;
      if (prevState.activeSessionId === sessionId) {
        const activeSession = updatedSessions.find(s => s.status === 'active');
        newActiveSessionId = activeSession ? activeSession.id : null;
      }
      
      return {
        ...prevState,
        activeSessionId: newActiveSessionId,
        sessions: updatedSessions
      };
    });
  };

  return (
    <ChatContext.Provider
      value={{
        chatState,
        isOpen,
        openChat,
        closeChat,
        toggleChat,
        minimizeChat,
        maximizeChat,
        sendMessage,
        setActiveSession,
        startNewSession,
        closeSession,
        submitPhoneNumber,
        telegramConnected,
        connectTelegram,
        disconnectTelegram
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
