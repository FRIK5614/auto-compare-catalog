
import React, { useState, useEffect } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChatMessage, ChatSession } from '@/types/chat';
import { Send, MessageCircle, User, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MessageBubble: React.FC<{ message: ChatMessage; isAdmin?: boolean }> = ({ message, isAdmin = false }) => {
  const isUserMessage = message.senderType === 'user';
  const isTelegramMessage = message.senderType === 'telegram';
  
  const getMessageStyle = () => {
    switch (message.senderType) {
      case 'user':
        return 'bg-blue-100';
      case 'admin':
        return 'bg-green-100';
      case 'system':
        return 'bg-gray-100 w-full text-center';
      case 'telegram':
        return 'bg-blue-100 border-l-4 border-blue-500';
      default:
        return 'bg-gray-100';
    }
  };
  
  return (
    <div className={`flex items-start mb-3 ${isAdmin && isUserMessage ? 'justify-start' : ''}`}>
      {(isUserMessage || isTelegramMessage) && (
        <Avatar className="h-8 w-8 mr-2 mt-1">
          {isTelegramMessage ? (
            <AvatarFallback className="bg-blue-500 text-white">
              <MessageSquare className="h-4 w-4" />
            </AvatarFallback>
          ) : (
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
      )}
      
      <div className={`rounded-lg px-3 py-2 max-w-[85%] ${getMessageStyle()}`}>
        <div className="text-xs font-medium opacity-75 mb-1">
          {message.senderName} 
          {isTelegramMessage && <span className="ml-1 text-blue-500">(Telegram)</span>}
        </div>
        <div className="break-words">{message.content}</div>
        <div className="text-xs opacity-75 mt-1 text-right">
          {format(new Date(message.timestamp), 'dd.MM.yyyy HH:mm', { locale: ru })}
        </div>
      </div>
    </div>
  );
};

const AdminChat: React.FC = () => {
  const { 
    chatState, 
    sendMessage, 
    setActiveSession, 
    closeSession,
    telegramConnected,
    connectTelegram,
    disconnectTelegram
  } = useChat();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [connecting, setConnecting] = useState(false);
  
  const { sessions, activeSessionId } = chatState;
  const activeSession = sessions.find(session => session.id === activeSessionId);
  const activeSessions = sessions.filter(session => session.status === 'active');
  const closedSessions = sessions.filter(session => session.status === 'closed');
  const telegramSessions = sessions.filter(session => session.source === 'telegram');
  
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeSessionId) return;
    
    sendMessage(messageText);
    setMessageText('');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleConnectTelegram = async () => {
    setConnecting(true);
    try {
      await connectTelegram();
    } finally {
      setConnecting(false);
    }
  };
  
  const getTotalUnread = (sessionList: ChatSession[]) => {
    return sessionList.reduce((total, session) => total + session.unreadCount, 0);
  };
  
  if (!isAdmin) {
    return null;
  }

  const totalUnread = getTotalUnread(sessions);
  const totalTelegramUnread = getTotalUnread(telegramSessions);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Чат с клиентами</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Список чатов
                {totalUnread > 0 && (
                  <Badge variant="destructive">{totalUnread}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                {activeSessions.length} активных чатов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="active" className="flex-1">
                    Активные
                    {activeSessions.length > 0 && (
                      <Badge variant="secondary" className="ml-2">{activeSessions.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="closed" className="flex-1">
                    Закрытые
                    {closedSessions.length > 0 && (
                      <Badge variant="outline" className="ml-2">{closedSessions.length}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="telegram" className="flex-1">
                    Telegram
                    {telegramSessions.length > 0 && (
                      <Badge variant={totalTelegramUnread > 0 ? "destructive" : "outline"} className="ml-2">
                        {telegramSessions.length}
                        {totalTelegramUnread > 0 && `(${totalTelegramUnread})`}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="active">
                  <ScrollArea className="h-[400px]">
                    {activeSessions.filter(s => s.source !== 'telegram').length > 0 ? (
                      <div className="space-y-2">
                        {activeSessions
                          .filter(s => s.source !== 'telegram')
                          .map(session => (
                          <Card
                            key={session.id}
                            className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                              session.id === activeSessionId ? 'border-primary' : ''
                            }`}
                            onClick={() => setActiveSession(session.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>
                                      {session.userName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{session.userName}</div>
                                    <div className="text-xs text-muted-foreground flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {format(new Date(session.lastActivity), 'HH:mm', { locale: ru })}
                                    </div>
                                  </div>
                                </div>
                                {session.unreadCount > 0 && (
                                  <Badge variant="destructive">{session.unreadCount}</Badge>
                                )}
                              </div>
                              {session.messages.length > 0 && (
                                <div className="mt-2 text-sm line-clamp-1 text-muted-foreground">
                                  {session.messages[session.messages.length - 1].content}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Нет активных чатов</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="closed">
                  <ScrollArea className="h-[400px]">
                    {closedSessions.length > 0 ? (
                      <div className="space-y-2">
                        {closedSessions.map(session => (
                          <Card
                            key={session.id}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                            onClick={() => setActiveSession(session.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>
                                      {session.userName.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">{session.userName}</div>
                                    <div className="text-xs text-muted-foreground flex items-center">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Закрыт {format(new Date(session.lastActivity), 'dd.MM.yyyy', { locale: ru })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        <p>Нет закрытых чатов</p>
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="telegram">
                  <div className="h-[400px] flex flex-col">
                    {telegramConnected ? (
                      telegramSessions.length > 0 ? (
                        <ScrollArea className="h-full">
                          <div className="space-y-2">
                            {telegramSessions.map(session => (
                              <Card
                                key={session.id}
                                className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                                  session.id === activeSessionId ? 'border-primary' : ''
                                }`}
                                onClick={() => setActiveSession(session.id)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <Avatar className="h-8 w-8 mr-2 bg-blue-500 text-white">
                                        <AvatarFallback>
                                          <MessageSquare className="h-4 w-4" />
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="font-medium">{session.userName}</div>
                                        <div className="text-xs text-muted-foreground flex items-center">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {format(new Date(session.lastActivity), 'HH:mm', { locale: ru })}
                                        </div>
                                      </div>
                                    </div>
                                    {session.unreadCount > 0 && (
                                      <Badge variant="destructive">{session.unreadCount}</Badge>
                                    )}
                                  </div>
                                  {session.messages.length > 0 && (
                                    <div className="mt-2 text-sm line-clamp-1 text-muted-foreground">
                                      {session.messages[session.messages.length - 1].content}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="h-full flex items-center justify-center flex-col text-center p-4">
                          <MessageSquare className="h-12 w-12 text-blue-500 mb-4" />
                          <h3 className="font-medium mb-1">Нет сообщений из Telegram</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Telegram подключен, но пока нет входящих сообщений от пользователей
                          </p>
                          <Alert className="mb-4">
                            <AlertDescription>
                              Убедитесь, что ваш бот добавлен в группу или пользователи знают о его существовании
                            </AlertDescription>
                          </Alert>
                          <Button variant="outline" onClick={disconnectTelegram}>
                            Отключить Telegram
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="h-full flex items-center justify-center flex-col text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium mb-1">Telegram не подключен</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Для получения сообщений из Telegram подключите бота
                        </p>
                        <Button 
                          onClick={handleConnectTelegram} 
                          disabled={connecting}
                        >
                          {connecting ? 'Подключение...' : 'Подключить Telegram'}
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            {activeSession ? (
              <>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      {activeSession.source === 'telegram' ? (
                        <Avatar className="h-8 w-8 mr-2 bg-blue-500 text-white">
                          <AvatarFallback>
                            <MessageSquare className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>{activeSession.userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div>
                          {activeSession.userName}
                          {activeSession.source === 'telegram' && (
                            <Badge variant="outline" className="ml-2">Telegram</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activeSession.source === 'telegram' 
                            ? `ID: ${activeSession.telegramChatId}` 
                            : (activeSession.userContact || 'Контакт не указан')
                          }
                        </div>
                      </div>
                    </CardTitle>
                    <div>
                      {activeSession.status === 'active' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => closeSession(activeSession.id)}
                        >
                          Закрыть чат
                        </Button>
                      ) : (
                        <Badge variant="outline">Закрыт</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden flex flex-col">
                  <ScrollArea className="flex-1 h-[400px] pr-4 pb-4">
                    <div className="space-y-3">
                      {activeSession.messages.map(message => (
                        <MessageBubble key={message.id} message={message} isAdmin />
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {activeSession.status === 'active' && (
                    <div className="border-t pt-4 mt-4">
                      <div className="flex space-x-2">
                        <Input
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Введите сообщение..."
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                          <Send className="h-4 w-4 mr-2" />
                          {activeSession.source === 'telegram' ? 'Ответить' : 'Отправить'}
                        </Button>
                      </div>
                      {activeSession.source === 'telegram' && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Сообщение будет отправлено пользователю в Telegram
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Выберите чат</h3>
                  <p className="text-muted-foreground">
                    Выберите чат из списка слева для начала общения
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
