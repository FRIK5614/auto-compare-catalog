import React, { useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { useCars } from '@/hooks/useCars';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  Settings, 
  Layout, 
  ListFilter, 
  Image, 
  Grid, 
  FileText, 
  Bot, 
  Bell, 
  Save 
} from 'lucide-react';

// Form validation schemas
const generalSettingsSchema = z.object({
  siteName: z.string().min(2, { message: "Название сайта должно содержать не менее 2 символов" }),
  siteDescription: z.string(),
  logo: z.string().url().optional().or(z.literal('')),
  favicon: z.string().url().optional().or(z.literal('')),
  contactEmail: z.string().email({ message: "Введите корректный email адрес" }),
  contactPhone: z.string(),
  footerText: z.string()
});

const catalogSettingsSchema = z.object({
  itemsPerPage: z.coerce.number().min(4).max(48),
  defaultSorting: z.string(),
  enableFiltering: z.boolean(),
  enableComparison: z.boolean(),
  enableFavorites: z.boolean(),
  hotOffersCount: z.coerce.number().min(1).max(20),
  featuredCarsCount: z.coerce.number().min(1).max(12)
});

const telegramSettingsSchema = z.object({
  botToken: z.string().min(10, { message: "Введите токен бота" }).optional().or(z.literal('')),
  adminChatId: z.string().optional().or(z.literal('')),
  notifyOnNewOrder: z.boolean(),
  notifyOnMessage: z.boolean()
});

const seoSettingsSchema = z.object({
  metaTitle: z.string(),
  metaDescription: z.string(),
  ogImage: z.string().url().optional().or(z.literal('')),
  googleAnalyticsId: z.string().optional().or(z.literal('')),
  yandexMetrikaId: z.string().optional().or(z.literal(''))
});

type TabType = 'general' | 'catalog' | 'appearance' | 'content' | 'telegram' | 'seo';

const AdminSettings = () => {
  const { isAdmin, siteConfig, updateSiteConfig } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('general');

  // Initialize forms with site configuration
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: siteConfig?.siteName || 'TMC Авто',
      siteDescription: siteConfig?.siteDescription || 'Продажа автомобилей',
      logo: siteConfig?.logo || '',
      favicon: siteConfig?.favicon || '',
      contactEmail: siteConfig?.contactEmail || 'info@tmcavto.ru',
      contactPhone: siteConfig?.contactPhone || '+7 (999) 123-45-67',
      footerText: siteConfig?.footerText || '© 2023 TMC Авто. Все права защищены.'
    }
  });

  const catalogForm = useForm<z.infer<typeof catalogSettingsSchema>>({
    resolver: zodResolver(catalogSettingsSchema),
    defaultValues: {
      itemsPerPage: siteConfig?.catalog?.itemsPerPage || 12,
      defaultSorting: siteConfig?.catalog?.defaultSorting || 'price-asc',
      enableFiltering: siteConfig?.catalog?.enableFiltering !== false,
      enableComparison: siteConfig?.catalog?.enableComparison !== false,
      enableFavorites: siteConfig?.catalog?.enableFavorites !== false,
      hotOffersCount: siteConfig?.catalog?.hotOffersCount || 8,
      featuredCarsCount: siteConfig?.catalog?.featuredCarsCount || 6
    }
  });

  const telegramForm = useForm<z.infer<typeof telegramSettingsSchema>>({
    resolver: zodResolver(telegramSettingsSchema),
    defaultValues: {
      botToken: siteConfig?.telegram?.botToken || '',
      adminChatId: siteConfig?.telegram?.adminChatId || '',
      notifyOnNewOrder: siteConfig?.telegram?.notifyOnNewOrder !== false,
      notifyOnMessage: siteConfig?.telegram?.notifyOnMessage !== false
    }
  });

  const seoForm = useForm<z.infer<typeof seoSettingsSchema>>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      metaTitle: siteConfig?.seo?.metaTitle || 'TMC Авто - Продажа автомобилей',
      metaDescription: siteConfig?.seo?.metaDescription || 'Большой выбор автомобилей от TMC Авто',
      ogImage: siteConfig?.seo?.ogImage || '',
      googleAnalyticsId: siteConfig?.seo?.googleAnalyticsId || '',
      yandexMetrikaId: siteConfig?.seo?.yandexMetrikaId || ''
    }
  });

  // Form submission handlers
  const onGeneralSubmit = (values: z.infer<typeof generalSettingsSchema>) => {
    updateSiteConfig({
      ...siteConfig,
      ...values
    });
    toast({
      title: "Настройки сохранены",
      description: "Общие настройки сайта успешно обновлены"
    });
  };

  const onCatalogSubmit = (values: z.infer<typeof catalogSettingsSchema>) => {
    // Fixed: Ensure all required properties are present
    updateSiteConfig({
      ...siteConfig,
      catalog: {
        itemsPerPage: values.itemsPerPage,
        defaultSorting: values.defaultSorting,
        enableFiltering: values.enableFiltering,
        enableComparison: values.enableComparison,
        enableFavorites: values.enableFavorites,
        hotOffersCount: values.hotOffersCount,
        featuredCarsCount: values.featuredCarsCount
      }
    });
    toast({
      title: "Настройки сохранены",
      description: "Настройки каталога успешно обновлены"
    });
  };

  const onTelegramSubmit = (values: z.infer<typeof telegramSettingsSchema>) => {
    // Fixed: Ensure all required properties are present
    updateSiteConfig({
      ...siteConfig,
      telegram: {
        botToken: values.botToken,
        adminChatId: values.adminChatId,
        notifyOnNewOrder: values.notifyOnNewOrder,
        notifyOnMessage: values.notifyOnMessage
      }
    });
    toast({
      title: "Настройки сохранены",
      description: "Настройки Telegram успешно обновлены"
    });
  };

  const onSeoSubmit = (values: z.infer<typeof seoSettingsSchema>) => {
    // Fixed: Ensure all required properties are present
    updateSiteConfig({
      ...siteConfig,
      seo: {
        metaTitle: values.metaTitle,
        metaDescription: values.metaDescription,
        ogImage: values.ogImage,
        googleAnalyticsId: values.googleAnalyticsId,
        yandexMetrikaId: values.yandexMetrikaId
      }
    });
    toast({
      title: "Настройки сохранены",
      description: "SEO настройки успешно обновлены"
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Настройки сайта</h1>
          <p className="text-muted-foreground">
            Управляйте настройками вашего сайта
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <ScrollArea className="w-full">
            <TabsList className="w-full justify-start mb-6">
              <TabsTrigger value="general" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Общие
              </TabsTrigger>
              <TabsTrigger value="catalog" className="flex items-center">
                <Grid className="mr-2 h-4 w-4" />
                Каталог
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Layout className="mr-2 h-4 w-4" />
                Внешний вид
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Контент
              </TabsTrigger>
              <TabsTrigger value="telegram" className="flex items-center">
                <Bot className="mr-2 h-4 w-4" />
                Telegram
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center">
                <ListFilter className="mr-2 h-4 w-4" />
                SEO
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Общие настройки</CardTitle>
                <CardDescription>
                  Основные настройки сайта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={generalForm.control}
                        name="siteName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Название сайта</FormLabel>
                            <FormControl>
                              <Input placeholder="TMC Авто" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email для связи</FormLabel>
                            <FormControl>
                              <Input placeholder="info@tmcavto.ru" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={generalForm.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Телефон для связи</FormLabel>
                            <FormControl>
                              <Input placeholder="+7 (999) 123-45-67" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL логотипа</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/logo.png" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={generalForm.control}
                      name="siteDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Описание сайта</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Краткое описание вашего сайта" 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={generalForm.control}
                      name="footerText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Текст в футере</FormLabel>
                          <FormControl>
                            <Input placeholder="© 2023 TMC Авто. Все права защищены." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full md:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить настройки
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Catalog Settings */}
          <TabsContent value="catalog" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки каталога</CardTitle>
                <CardDescription>
                  Управление отображением и функциями каталога
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...catalogForm}>
                  <form onSubmit={catalogForm.handleSubmit(onCatalogSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={catalogForm.control}
                        name="itemsPerPage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Товаров на странице</FormLabel>
                            <FormControl>
                              <Input type="number" min={4} max={48} {...field} />
                            </FormControl>
                            <FormDescription>
                              Количество автомобилей на одной странице каталога
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={catalogForm.control}
                        name="defaultSorting"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Сортировка по умолчанию</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Выберите сортировку" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="price-asc">По цене (возрастание)</SelectItem>
                                <SelectItem value="price-desc">По цене (убывание)</SelectItem>
                                <SelectItem value="year-desc">По году (новые сверху)</SelectItem>
                                <SelectItem value="year-asc">По году (старые сверху)</SelectItem>
                                <SelectItem value="popular">По популярности</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={catalogForm.control}
                        name="hotOffersCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Количество горячих предложений</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} max={20} {...field} />
                            </FormControl>
                            <FormDescription>
                              Сколько автомобилей показывать в разделе "Горячие предложения"
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={catalogForm.control}
                        name="featuredCarsCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Рекомендуемые автомобили</FormLabel>
                            <FormControl>
                              <Input type="number" min={1} max={12} {...field} />
                            </FormControl>
                            <FormDescription>
                              Сколько автомобилей показывать в разделе "Рекомендуемые"
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <FormField
                        control={catalogForm.control}
                        name="enableFiltering"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Фильтрация</FormLabel>
                              <FormDescription>
                                Разрешить фильтрацию автомобилей
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={catalogForm.control}
                        name="enableComparison"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Сравнение</FormLabel>
                              <FormDescription>
                                Разрешить сравнение автомобилей
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={catalogForm.control}
                        name="enableFavorites"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Избранное</FormLabel>
                              <FormDescription>
                                Разрешить добавление автомобилей в избранное
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить настройки
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Внешний вид</CardTitle>
                <CardDescription>
                  Настройте внешний вид вашего сайта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Баннер на главной</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="banner-image">URL изображения</Label>
                            <Input id="banner-image" placeholder="https://example.com/banner.jpg" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="banner-title">Заголовок баннера</Label>
                            <Input id="banner-title" placeholder="Большой выбор автомобилей" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="banner-text">Текст баннера</Label>
                            <Textarea id="banner-text" placeholder="Описание для баннера на главной странице" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base">Цветовая схема</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="primary-color">Основной цвет</Label>
                            <div className="flex gap-2">
                              <Input type="color" id="primary-color" className="w-16" defaultValue="#0066cc" />
                              <Input id="primary-color-text" defaultValue="#0066cc" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="secondary-color">Дополнительный цвет</Label>
                            <div className="flex gap-2">
                              <Input type="color" id="secondary-color" className="w-16" defaultValue="#f59e0b" />
                              <Input id="secondary-color-text" defaultValue="#f59e0b" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить изменения
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings */}
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Управление контентом</CardTitle>
                <CardDescription>
                  Редактируйте текстовое содержимое сайта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Главная страница</h3>
                    <div className="space-y-2">
                      <Label htmlFor="home-title">Заголовок</Label>
                      <Input id="home-title" defaultValue="TMC Авто - Продажа автомобилей" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="home-subtitle">Подзаголовок</Label>
                      <Input id="home-subtitle" defaultValue="Большой выбор автомобилей по доступным ценам" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="home-description">Описание</Label>
                      <Textarea id="home-description" className="min-h-[100px]" 
                        defaultValue="TMC Авто предлагает большой выбор автомобилей от ведущих производителей. 
                        Мы гарантируем качество и надежность. Каждый автомобиль проходит тщательную предпродажную подготовку." />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">О компании</h3>
                    <div className="space-y-2">
                      <Label htmlFor="about-title">Заголовок</Label>
                      <Input id="about-title" defaultValue="О компании TMC Авто" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about-content">Содержание</Label>
                      <Textarea id="about-content" className="min-h-[150px]" 
                        defaultValue="TMC Авто - это компания с многолетним опытом работы на автомобильном рынке.
                        Мы специализируемся на продаже автомобилей различных марок и моделей.
                        Наша цель - предоставить клиентам лучший сервис и помочь выбрать идеальный автомобиль." />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Контакты</h3>
                    <div className="space-y-2">
                      <Label htmlFor="contact-address">Адрес</Label>
                      <Input id="contact-address" defaultValue="г. Москва, ул. Автомобильная, д. 1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-worktime">Время работы</Label>
                      <Input id="contact-worktime" defaultValue="Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact-map">Код карты</Label>
                      <Textarea id="contact-map" className="min-h-[100px]" 
                        defaultValue="<iframe src='https://www.google.com/maps/embed?...'></iframe>" />
                    </div>
                  </div>
                </div>

                <Button className="mt-6">
                  <Save className="mr-2 h-4 w-4" />
                  Сохранить изменения
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Telegram Settings */}
          <TabsContent value="telegram" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Настройки Telegram</CardTitle>
                <CardDescription>
                  Настройка уведомлений через Telegram бота
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...telegramForm}>
                  <form onSubmit={telegramForm.handleSubmit(onTelegramSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={telegramForm.control}
                        name="botToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Токен бота</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789:ABCDefGhIJklmNoPQrsTUVwxyz" {...field} />
                            </FormControl>
                            <FormDescription>
                              Токен бота, полученный от @BotFather
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={telegramForm.control}
                        name="adminChatId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ID чата администратора</FormLabel>
                            <FormControl>
                              <Input placeholder="123456789" {...field} />
                            </FormControl>
                            <FormDescription>
                              ID вашего чата для получения уведомлений
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={telegramForm.control}
                        name="notifyOnNewOrder"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Уведомления о заказах</FormLabel>
                              <FormDescription>
                                Получать уведомления о новых заказах
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={telegramForm.control}
                        name="notifyOnMessage"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Уведомления о сообщениях</FormLabel>
                              <FormDescription>
                                Получать уведомления о новых сообщениях от клиентов
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="rounded-lg border bg-blue-50 p-4">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-blue-500" />
                        <h3 className="font-medium text-blue-700">Как настроить бота</h3>
                      </div>
                      <ol className="ml-6 mt-2 list-decimal space-y-1 text-blue-700">
                        <li>Создайте нового бота через @BotFather в Telegram</li>
                        <li>Скопируйте полученный токен в поле выше</li>
                        <li>Отправьте любое сообщение вашему боту</li>
                        <li>Откройте https://api.telegram.org/botXXXX:YYYY/getUpdates, где XXXX:YYYY ваш токен</li>
                        <li>Найдите и скопируйте значение "id" из поля "chat" - это ваш ID чата</li>
                      </ol>
                    </div>

                    <Button type="submit" className="w-full md:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить настройки
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SEO настройки</CardTitle>
                <CardDescription>
                  Настройки для поисковой оптимизации
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...seoForm}>
                  <form onSubmit={seoForm.handleSubmit(onSeoSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={seoForm.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meta Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              Заголовок страницы для поисковых систем
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={seoForm.control}
                        name="ogImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Open Graph Image</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/og-image.jpg" {...field} />
                            </FormControl>
                            <FormDescription>
                              Изображение при шаринге в соцсетях
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={seoForm.control}
                        name="googleAnalyticsId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Google Analytics ID</FormLabel>
                            <FormControl>
                              <Input placeholder="G-XXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={seoForm.control}
                        name="yandexMetrikaId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Яндекс Метрика ID</FormLabel>
                            <FormControl>
                              <Input placeholder="XXXXXXXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={seoForm.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Описание сайта для поисковых систем
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full md:w-auto">
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить настройки
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
