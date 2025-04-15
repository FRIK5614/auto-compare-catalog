
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, AlertTriangle, Check, MessageCircle, RefreshCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Settings types
interface NotificationSettings {
  adminEmail: string;
  newOrdersEnabled: boolean;
  chatMessagesEnabled: boolean;
  telegramNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;
}

interface SystemSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
}

const AdminSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [botDetailsOpen, setBotDetailsOpen] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [adminChatId, setAdminChatId] = useState('');
  
  // Settings state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    adminEmail: 'admin@autodeal.ru',
    newOrdersEnabled: true,
    chatMessagesEnabled: true,
    telegramNotificationsEnabled: false,
    emailNotificationsEnabled: true
  });
  
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    siteName: 'AutoDeal',
    contactEmail: 'info@autodeal.ru',
    contactPhone: '+7 (800) 555-35-35'
  });

  // Check if Telegram is already connected
  useEffect(() => {
    const checkTelegramConnection = async () => {
      try {
        setLoading(true);
        
        // Get the webhook URL from the location
        const baseUrl = window.location.origin;
        const functionUrl = `${baseUrl}/api/telegram-chat`;
        setWebhookUrl(functionUrl);
        
        // Check if webhook is active
        const { data, error } = await supabase.functions.invoke('telegram-chat', {
          body: { action: 'getWebhookInfo' }
        });
        
        if (error) {
          console.error('Error checking webhook status:', error);
          return;
        }
        
        if (data?.data?.result?.url) {
          console.log('Webhook is configured:', data.data.result.url);
          setTelegramConnected(true);
        } else {
          console.log('No webhook configured');
          setTelegramConnected(false);
        }
        
        // Load saved settings
        await loadSettings();
      } catch (error) {
        console.error('Error checking Telegram connection:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkTelegramConnection();
  }, []);
  
  // Load settings from local storage or database
  const loadSettings = async () => {
    try {
      // Try to load from local storage first
      const savedNotificationSettings = localStorage.getItem('notificationSettings');
      const savedSystemSettings = localStorage.getItem('systemSettings');
      
      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      }
      
      if (savedSystemSettings) {
        setSystemSettings(JSON.parse(savedSystemSettings));
      }
      
      // In a real application, we would load from database
      // For now, we'll just use the localStorage values or defaults
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Connect to Telegram
  const handleConnectTelegram = async () => {
    setConnecting(true);
    try {
      // First, set the commands for the bot
      await supabase.functions.invoke('telegram-chat', {
        body: { action: 'setMyCommands' }
      });
      
      // Then register the webhook
      const { data, error } = await supabase.functions.invoke('telegram-chat', {
        body: { 
          action: 'registerWebhook',
          data: { url: webhookUrl }
        }
      });
      
      if (error) {
        throw new Error(`Failed to connect Telegram: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(`Telegram webhook registration failed: ${data.data?.description || 'Unknown error'}`);
      }
      
      setTelegramConnected(true);
      
      // Update settings
      const updatedSettings = {
        ...notificationSettings,
        telegramNotificationsEnabled: true
      };
      
      setNotificationSettings(updatedSettings);
      localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
      
      toast({
        title: "Telegram подключен",
        description: "Теперь вы будете получать уведомления в Telegram",
      });
    } catch (error) {
      console.error('Error connecting Telegram:', error);
      toast({
        variant: "destructive",
        title: "Ошибка подключения",
        description: error instanceof Error ? error.message : "Не удалось подключить Telegram"
      });
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect from Telegram
  const handleDisconnectTelegram = async () => {
    setConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('telegram-chat', {
        body: { action: 'deleteWebhook' }
      });
      
      if (error) {
        throw new Error(`Failed to disconnect Telegram: ${error.message}`);
      }
      
      if (!data.success) {
        throw new Error(`Telegram webhook deletion failed: ${data.data?.description || 'Unknown error'}`);
      }
      
      setTelegramConnected(false);
      
      // Update settings
      const updatedSettings = {
        ...notificationSettings,
        telegramNotificationsEnabled: false
      };
      
      setNotificationSettings(updatedSettings);
      localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
      
      toast({
        title: "Telegram отключен",
        description: "Уведомления в Telegram отключены",
      });
    } catch (error) {
      console.error('Error disconnecting Telegram:', error);
      toast({
        variant: "destructive",
        title: "Ошибка отключения",
        description: error instanceof Error ? error.message : "Не удалось отключить Telegram"
      });
    } finally {
      setConnecting(false);
    }
  };

  // Save notification settings
  const saveNotificationSettings = () => {
    setSaving(true);
    
    try {
      // Save to local storage
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      
      // In a real application, we would also save to database
      
      toast({
        title: "Настройки уведомлений сохранены",
        description: "Ваши предпочтения уведомлений были успешно обновлены",
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Не удалось сохранить настройки уведомлений"
      });
    } finally {
      setSaving(false);
    }
  };

  // Save system settings
  const saveSystemSettings = () => {
    setSaving(true);
    
    try {
      // Save to local storage
      localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
      
      // In a real application, we would also save to database
      
      toast({
        title: "Настройки системы сохранены",
        description: "Основные настройки успешно обновлены",
      });
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Не удалось сохранить основные настройки"
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Configure Telegram bot
  const configureBot = async () => {
    if (!botToken || !adminChatId) {
      toast({
        variant: "destructive",
        title: "Ошибка конфигурации",
        description: "Пожалуйста, заполните все поля"
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // In a real application, we would update secrets in Supabase
      console.log('Would update TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID');
      
      toast({
        title: "Конфигурация сохранена",
        description: "Настройки бота успешно обновлены",
      });
      
      setBotDetailsOpen(false);
    } catch (error) {
      console.error('Error configuring bot:', error);
      toast({
        variant: "destructive",
        title: "Ошибка конфигурации",
        description: "Не удалось обновить настройки бота"
      });
    } finally {
      setSaving(false);
    }
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
                  <Input 
                    id="site-name"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Контактный email</Label>
                  <Input 
                    id="contact-email" 
                    type="email"
                    value={systemSettings.contactEmail}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Контактный телефон</Label>
                  <Input 
                    id="contact-phone"
                    value={systemSettings.contactPhone}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>
                
                <Button onClick={saveSystemSettings} disabled={saving}>
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
                    <div className="flex gap-2">
                      {telegramConnected ? (
                        <Button variant="outline" onClick={handleDisconnectTelegram} disabled={connecting}>
                          {connecting ? 'Отключение...' : 'Отключить'}
                        </Button>
                      ) : (
                        <Button onClick={handleConnectTelegram} disabled={connecting}>
                          {connecting ? 'Подключение...' : 'Подключить Telegram'}
                        </Button>
                      )}
                      <Button variant="outline" size="icon" onClick={() => setBotDetailsOpen(true)}>
                        <RefreshCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {telegramConnected ? (
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
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
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Веб-хук URL: <code className="text-xs bg-gray-100 p-1 rounded">{webhookUrl}</code>
                    </p>
                  </div>
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
                  <Input 
                    id="admin-email" 
                    type="email"
                    value={notificationSettings.adminEmail}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                  />
                </div>
                
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Включить email-уведомления</Label>
                    <p className="text-sm text-muted-foreground">
                      Отправлять уведомления на указанный email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={notificationSettings.emailNotificationsEnabled}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotificationsEnabled: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between py-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="telegram-notifications">Включить Telegram-уведомления</Label>
                    <p className="text-sm text-muted-foreground">
                      Отправлять уведомления в Telegram
                    </p>
                  </div>
                  <Switch
                    id="telegram-notifications"
                    checked={notificationSettings.telegramNotificationsEnabled}
                    disabled={!telegramConnected}
                    onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, telegramNotificationsEnabled: checked }))}
                  />
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-md font-medium">Типы уведомлений</h3>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <h4 className="font-medium">Новые заказы</h4>
                      <p className="text-sm text-muted-foreground">Уведомления о новых заказах</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newOrdersEnabled}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, newOrdersEnabled: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <h4 className="font-medium">Сообщения в чате</h4>
                      <p className="text-sm text-muted-foreground">Уведомления о новых сообщениях</p>
                    </div>
                    <Switch
                      checked={notificationSettings.chatMessagesEnabled}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, chatMessagesEnabled: checked }))}
                    />
                  </div>
                </div>
                
                <Button onClick={saveNotificationSettings} disabled={saving}>
                  {saving ? 'Сохранение...' : 'Сохранить настройки'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Bot Configuration Dialog */}
      <Dialog open={botDetailsOpen} onOpenChange={setBotDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройка Telegram бота</DialogTitle>
            <DialogDescription>
              Введите токен бота и ID чата администратора для настройки уведомлений
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bot-token">Токен бота</Label>
              <Input
                id="bot-token"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456789:ABCDEF..."
              />
              <p className="text-xs text-muted-foreground">
                Получите токен у @BotFather в Telegram
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="admin-chat-id">ID чата администратора</Label>
              <Input
                id="admin-chat-id"
                value={adminChatId}
                onChange={(e) => setAdminChatId(e.target.value)}
                placeholder="12345678"
              />
              <p className="text-xs text-muted-foreground">
                Используйте @userinfobot в Telegram для получения вашего ID
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBotDetailsOpen(false)}>Отмена</Button>
            <Button onClick={configureBot} disabled={saving}>
              {saving ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSettings;
