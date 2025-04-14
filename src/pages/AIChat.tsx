
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Alert as AlertIcon } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Add initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: 'Здравствуйте! Я ИИ-ассистент AutoDeal. Чем я могу вам помочь сегодня?\n\nЯ могу рассказать о наших автомобилях, дать советы по выбору машины или ответить на вопросы о кредитовании.',
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input on component mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    
    // Simulate AI response
    setTimeout(() => {
      let aiResponse = '';
      
      // Simple response logic based on keywords
      const lowerCaseMessage = inputMessage.toLowerCase();
      
      if (lowerCaseMessage.includes('привет') || lowerCaseMessage.includes('здравств')) {
        aiResponse = 'Здравствуйте! Рад приветствовать вас в AutoDeal. Чем я могу вам помочь?';
      } else if (lowerCaseMessage.includes('цена') || lowerCaseMessage.includes('стоимость') || lowerCaseMessage.includes('цены')) {
        aiResponse = 'В нашем автосалоне представлены автомобили в разных ценовых категориях. Цены начинаются от 1 200 000 рублей. Если вас интересует конкретная модель, пожалуйста, уточните, и я предоставлю более точную информацию.';
      } else if (lowerCaseMessage.includes('кредит')) {
        aiResponse = 'Мы предлагаем выгодные кредитные программы со ставкой от 5.9% годовых. Первоначальный взнос от 10%. Для оформления кредита вам понадобится паспорт и второй документ, удостоверяющий личность. Хотите, чтобы наш менеджер связался с вами для подробной консультации?';
      } else if (lowerCaseMessage.includes('тест') || lowerCaseMessage.includes('драйв') || lowerCaseMessage.includes('тест-драйв')) {
        aiResponse = 'Вы можете записаться на тест-драйв любого автомобиля из нашего каталога. Для этого оставьте заявку на сайте или позвоните по телефону +7 (800) 555-35-35. Тест-драйв проводится ежедневно с 10:00 до 19:00.';
      } else if (lowerCaseMessage.includes('контакт') || lowerCaseMessage.includes('адрес') || lowerCaseMessage.includes('телефон')) {
        aiResponse = 'Наш автосалон находится по адресу: г. Москва, ул. Автомобильная, 10. Телефон: +7 (800) 555-35-35. Email: info@autodeal.ru. Мы работаем ежедневно с 9:00 до 20:00.';
      } else if (lowerCaseMessage.includes('trade') || lowerCaseMessage.includes('трейд')) {
        aiResponse = 'Да, у нас действует программа Trade-in. Вы можете обменять свой автомобиль на новый с доплатой. Для оценки вашего автомобиля необходимо приехать в наш автосалон. Предварительную оценку можно получить, отправив фотографии и данные автомобиля на нашу почту.';
      } else {
        aiResponse = 'Благодарю за ваше сообщение. Если у вас есть конкретные вопросы о наших автомобилях, условиях покупки или сервисном обслуживании, я с радостью на них отвечу. Также вы можете оставить заявку на сайте, и наш менеджер свяжется с вами для детальной консультации.';
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <Helmet>
        <title>ИИ-ассистент | AutoDeal</title>
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 min-h-[calc(100vh-200px)]">
        <Card className="mx-auto max-w-3xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <Sparkles className="mr-2 h-5 w-5" />
              ИИ-ассистент AutoDeal
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="flex flex-col h-[600px]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'ai' && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarFallback className="bg-blue-500 text-white">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div 
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.sender === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 border'
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.text}</p>
                        <div className="text-xs opacity-70 mt-1 text-right">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      {message.sender === 'user' && (
                        <Avatar className="h-8 w-8 ml-2 mt-1">
                          <AvatarFallback className="bg-gray-200">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarFallback className="bg-blue-500 text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-100 border rounded-lg px-4 py-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <Alert variant="destructive" className="my-4">
                      <AlertIcon className="h-4 w-4 mr-2" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите сообщение..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Отправить
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </>
  );
};

export default AIChat;
