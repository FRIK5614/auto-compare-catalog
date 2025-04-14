
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/contexts/ChatContext';
import { MessageCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const { telegramConnected, connectTelegram, disconnectTelegram } = useChat();
  const [connecting, setConnecting] = useState(false);

  const handleConnectTelegram = async () => {
    setConnecting(true);
    try {
      await connectTelegram();
    } finally {
      setConnecting(false);
    }
  };

  const saveSettings = () => {
    setSaving(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Настройки сохранены",
        description: "Все настройки успешно сохранены",
      });
    }, 1000);
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Настройки | Admin Dashboard</title>
      </Helmet>
      
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Настройки системы</h1>
          <p className="text-muted-foreground">Управление основными настройками системы</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-6">
            <TabsTrigger value="general">Основные</TabsTrigger>
            <TabsTrigger value="integrations">Интеграции</TabsTrigger>
            <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Основные настройки</CardTitle>
                <CardDescription>
                  Настройте основные параметры работы системы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Название сайта</Label>
                  <Input id="site-name" defaultValue="AutoDeal" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Контактный email</Label>
                  <Input id="contact-email" type="email" defaultValue="info@autodeal.ru" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Контактный телефон</Label>
                  <Input id="contact-phone" defaultValue="+7 (800) 555-35-35" />
                </div>
                
                <Button onClick={saveSettings} disabled={saving}>
                  {saving ? 'Сохранение...' : 'Сохранить настройки'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Интеграции</CardTitle>
                <CardDescription>
                  Управление интеграциями с внешними сервисами
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border p-4 rounded-md">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-lg font-medium">Телеграм</h3>
                      <p className="text-sm text-muted-foreground">
                        Интеграция чата с мессенджером Telegram
                      </p>
                    </div>
                    {telegramConnected ? (
                      <Button variant="outline" onClick={disconnectTelegram}>
                        Отключить
                      </Button>
                    ) : (
                      <Button onClick={handleConnectTelegram} disabled={connecting}>
                        {connecting ? 'Подключение...' : 'Подключить Telegram'}
                      </Button>
                    )}
                  </div>
                  
                  {telegramConnected ? (
                    <Alert className="bg-green-50 border-green-200">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
                        Интеграция с Telegram активна. Сообщения будут перенаправляться между сайтом и Telegram.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-600">
                        Интеграция с Telegram не настроена. Подключите бота для получения сообщений.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <div className="border p-4 rounded-md opacity-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">WhatsApp</h3>
                      <p className="text-sm text-muted-foreground">
                        Интеграция с WhatsApp Business API
                      </p>
                    </div>
                    <Button disabled>Скоро</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Настройки уведомлений</CardTitle>
                <CardDescription>
                  Управление системой уведомлений
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email для уведомлений</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@autodeal.ru" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Типы уведомлений</h3>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <h4 className="font-medium">Новые заказы</h4>
                      <p className="text-sm text-muted-foreground">Уведомления о новых заказах</p>
                    </div>
                    <Button variant="outline" size="sm">Настроить</Button>
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <h4 className="font-medium">Сообщения в чате</h4>
                      <p className="text-sm text-muted-foreground">Уведомления о новых сообщениях</p>
                    </div>
                    <Button variant="outline" size="sm">Настроить</Button>
                  </div>
                </div>
                
                <Button onClick={saveSettings} disabled={saving}>
                  {saving ? 'Сохранение...' : 'Сохранить настройки'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
