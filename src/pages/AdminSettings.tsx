
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { siteSettings, updateSiteSettings } from '@/lib/constants';
import { Save, AlertTriangle, RefreshCw, Check } from 'lucide-react';
import { telegramAPI } from '@/services/api/telegramAPI';
import { useChat } from '@/contexts/ChatContext';

const AdminSettings = () => {
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { telegramConnected, connectTelegram, disconnectTelegram } = useChat();
  
  const [settings, setSettings] = useState({ ...siteSettings });
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);
  
  const handleSettingChange = (key: string, value: string) => {
    setSettings(prev => {
      if (key.includes('.')) {
        // Handle nested objects like socialLinks.telegram
        const [parent, child] = key.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value
          }
        };
      }
      
      return {
        ...prev,
        [key]: value
      };
    });
  };
  
  const saveSettings = () => {
    setSaving(true);
    
    try {
      const updatedSettings = updateSiteSettings(settings);
      
      toast({
        title: "Настройки сохранены",
        description: "Изменения успешно сохранены"
      });
    } catch (error) {
      console.error("Ошибка при сохранении настроек:", error);
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить настройки"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleConnectTelegram = async () => {
    setConnecting(true);
    
    try {
      const success = await connectTelegram();
      
      if (success) {
        toast({
          title: "Telegram подключен",
          description: "Бот успешно подключен и готов к работе"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Ошибка подключения",
          description: "Не удалось подключить Telegram бота"
        });
      }
    } catch (error) {
      console.error("Ошибка при подключении Telegram:", error);
      
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при подключении Telegram"
      });
    } finally {
      setConnecting(false);
    }
  };
  
  const handleDisconnectTelegram = () => {
    disconnectTelegram();
    
    toast({
      title: "Telegram отключен",
      description: "Бот отключен от системы чата"
    });
  };
  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Настройки сайта</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="contacts">Контакты</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Основные настройки</CardTitle>
              <CardDescription>
                Настройте основную информацию о вашем сайте
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Название сайта</Label>
                  <Input 
                    id="siteName" 
                    value={settings.siteName} 
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Часы работы</Label>
                  <Input 
                    id="workingHours" 
                    value={settings.workingHours} 
                    onChange={(e) => handleSettingChange('workingHours', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
              <CardDescription>
                Настройте контактные данные вашей компании
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Телефон</Label>
                  <Input 
                    id="phoneNumber" 
                    value={settings.phoneNumber} 
                    onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={settings.email} 
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <Textarea 
                    id="address" 
                    value={settings.address} 
                    onChange={(e) => handleSettingChange('address', e.target.value)}
                  />
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium">Социальные сети</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input 
                    id="telegram" 
                    value={settings.socialLinks.telegram} 
                    onChange={(e) => handleSettingChange('socialLinks.telegram', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vk">ВКонтакте</Label>
                  <Input 
                    id="vk" 
                    value={settings.socialLinks.vk} 
                    onChange={(e) => handleSettingChange('socialLinks.vk', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input 
                    id="whatsapp" 
                    value={settings.socialLinks.whatsapp} 
                    onChange={(e) => handleSettingChange('socialLinks.whatsapp', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={saving}>
                {saving ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Сохранить
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Интеграции</CardTitle>
              <CardDescription>
                Настройте интеграции с внешними сервисами
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Telegram</h3>
                
                {telegramConnected ? (
                  <div className="flex flex-col gap-4">
                    <Alert className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <AlertDescription className="text-green-800">
                        Telegram бот подключен и активен
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        onClick={handleDisconnectTelegram}
                      >
                        Отключить Telegram
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Telegram бот не подключен. Подключите для получения сообщений от клиентов.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex items-center">
                      <Button 
                        onClick={handleConnectTelegram}
                        disabled={connecting}
                      >
                        {connecting ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Подключение...
                          </>
                        ) : (
                          <>Подключить Telegram</>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Уведомления о заказах</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="orderNotifications">Отправлять уведомления о новых заказах на Telegram</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="orderNotifications" 
                      placeholder="ID чата администратора Telegram"
                      // value={} 
                      // onChange={}
                    />
                    <Button variant="outline">Сохранить</Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Укажите ID чата Telegram администратора для получения уведомлений о новых заказах.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
