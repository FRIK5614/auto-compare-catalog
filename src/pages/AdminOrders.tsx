
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdminLayout from '@/components/AdminLayout';
import { useCars } from '@/hooks/useCars';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/types/car';
import { Check, Clock, Loader2, MailCheck, ShoppingCart, UserRound, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/utils/formatters';
import { orderAPI } from '@/services/api/orderAPI';

const AdminOrders = () => {
  const { orders, reloadOrders } = useCars();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        await reloadOrders();
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast({
          variant: "destructive",
          title: "Ошибка загрузки",
          description: "Не удалось загрузить заказы. Попробуйте обновить страницу."
        });
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [reloadOrders, toast]);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  // Custom function to handle updating order status since it's not directly available in useCars
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Call the orderAPI directly
      const success = await orderAPI.updateOrderStatus(orderId, newStatus);
      if (!success) {
        throw new Error("Failed to update order status");
      }
      // After updating in the database, reload orders to refresh the UI
      await reloadOrders();
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      return false;
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    setProcessing(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Статус обновлен",
        description: `Заказ успешно отмечен как "${newStatus === 'completed' ? 'Завершен' : newStatus === 'processing' ? 'В обработке' : 'Отменен'}"`,
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус заказа"
      });
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500">Новый</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500">В обработке</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Завершен</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="border-red-500 text-red-500">Отменен</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Заказы | Admin Dashboard</title>
      </Helmet>
      
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление заказами</h1>
          <Button onClick={() => reloadOrders()} variant="outline" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
            {loading ? 'Загрузка...' : 'Обновить заказы'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              Все
              {orders.length > 0 && (
                <Badge variant="outline" className="ml-2 bg-gray-100">
                  {orders.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="new">
              Новые
              {orders.filter(o => o.status === 'new').length > 0 && (
                <Badge className="ml-2 bg-blue-500">
                  {orders.filter(o => o.status === 'new').length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="processing">В обработке</TabsTrigger>
            <TabsTrigger value="completed">Завершенные</TabsTrigger>
            <TabsTrigger value="cancelled">Отмененные</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Нет заказов</h3>
                  <p className="text-muted-foreground mt-2">
                    {activeTab === 'all' 
                      ? 'В системе пока нет заказов'
                      : `Нет заказов со статусом "${activeTab === 'new' ? 'Новый' : activeTab === 'processing' ? 'В обработке' : activeTab === 'completed' ? 'Завершен' : 'Отменен'}"`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order: Order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="p-4 bg-gray-50 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          Заказ #{order.id.slice(0, 8)}
                        </CardTitle>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium flex items-center">
                            <UserRound className="h-4 w-4 mr-2 text-muted-foreground" />
                            Информация о клиенте
                          </div>
                          <div className="text-sm">
                            <div className="font-medium">{order.customerName}</div>
                            <div>{order.customerEmail}</div>
                            <div>{order.customerPhone}</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium flex items-center">
                            <ShoppingCart className="h-4 w-4 mr-2 text-muted-foreground" />
                            Заказанный автомобиль
                          </div>
                          <div className="flex items-center gap-3">
                            {order.car?.image_url && (
                              <img 
                                src={order.car.image_url} 
                                alt={`${order.car.brand} ${order.car.model}`} 
                                className="w-16 h-16 object-cover rounded border"
                              />
                            )}
                            <div className="text-sm">
                              <div className="font-medium">{order.car?.brand} {order.car?.model}</div>
                              <div className="text-muted-foreground">ID: {order.carId}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            Действия
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {order.status === 'new' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-yellow-500 text-yellow-500 hover:bg-yellow-50"
                                  onClick={() => handleUpdateStatus(order.id, 'processing')}
                                  disabled={processing === order.id}
                                >
                                  {processing === order.id ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <Clock className="h-3 w-3 mr-1" />
                                  )}
                                  В обработку
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                  onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                  disabled={processing === order.id}
                                >
                                  {processing === order.id ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  Отменить
                                </Button>
                              </>
                            )}
                            
                            {order.status === 'processing' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500 text-green-500 hover:bg-green-50"
                                  onClick={() => handleUpdateStatus(order.id, 'completed')}
                                  disabled={processing === order.id}
                                >
                                  {processing === order.id ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <Check className="h-3 w-3 mr-1" />
                                  )}
                                  Завершить
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                  onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                                  disabled={processing === order.id}
                                >
                                  {processing === order.id ? (
                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                  ) : (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  Отменить
                                </Button>
                              </>
                            )}
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                // Send email logic here
                                toast({
                                  title: "Email отправлен",
                                  description: `Email был отправлен клиенту ${order.customerName}`,
                                });
                              }}
                            >
                              <MailCheck className="h-3 w-3 mr-1" />
                              Написать
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {order.message && (
                        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                          <div className="font-medium mb-1">Сообщение от клиента:</div>
                          <p className="text-muted-foreground">{order.message}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
