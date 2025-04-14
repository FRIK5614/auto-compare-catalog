
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { siteSettings, updateSiteSettings } from "@/lib/constants";

const AdminSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({ ...siteSettings });
  const [socialLinks, setSocialLinks] = useState({ ...siteSettings.socialLinks });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };
  
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks({ ...socialLinks, [name]: value });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update with new settings including social links
    const updatedSettings = updateSiteSettings({
      ...settings,
      socialLinks: socialLinks
    });
    
    toast({
      title: "Настройки сохранены",
      description: "Настройки сайта успешно обновлены"
    });
    
    // Force a refresh to apply changes
    window.location.reload();
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Настройки сайта</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="contacts">Контакты</TabsTrigger>
          <TabsTrigger value="social">Социальные сети</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>
                  Основные настройки сайта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Название сайта</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Часы работы</Label>
                  <Input
                    id="workingHours"
                    name="workingHours"
                    value={settings.workingHours}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
                <CardDescription>
                  Настройте контактную информацию, отображаемую на сайте
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Номер телефона</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={settings.phoneNumber}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Адрес</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Социальные сети</CardTitle>
                <CardDescription>
                  Ссылки на социальные сети и мессенджеры
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    name="telegram"
                    value={socialLinks.telegram}
                    onChange={handleSocialChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vk">ВКонтакте</Label>
                  <Input
                    id="vk"
                    name="vk"
                    value={socialLinks.vk}
                    onChange={handleSocialChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    name="whatsapp"
                    value={socialLinks.whatsapp}
                    onChange={handleSocialChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Сохранить настройки
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
