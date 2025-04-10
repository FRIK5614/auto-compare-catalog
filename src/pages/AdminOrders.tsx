
import React, { useState, useEffect } from 'react';
import { useCars } from '@/hooks/useCars';
import { useAdmin } from '@/contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Order } from '@/types/car';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CheckCircle, Clock, XCircle, AlertCircle, MessageSquare, Trash2, Phone, Mail, PenLine } from 'lucide-react';

type TabValue = 'all' | 'new' | 'processing' | 'completed' | 'canceled';

const OrderStatusBadge = ({ status }: { status: Order['status'] }) => {
  switch (status) {
    case 'new':
      return <Badge className="bg-blue-500"><AlertCircle className="w-3 h-3 mr-1" /> Новый</Badge>;
    case 'processing':
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> В обработке</Badge>;
    case 'completed':
      return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Завершен</Badge>;
    case 'canceled':
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Отменен</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const AdminOrders: React.FC = () => {
  const { orders, getCarById, processOrder, loading } = useCars();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderComment, setOrderComment] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [orderComments, setOrderComments] = useState<Record<string, string>>({});

  // Load order comments from localStorage on initial load
  useEffect(() => {
    const savedComments = localStorage.getItem('tmcavto_order_comments');
    if (savedComments) {
      try {
        setOrderComments(JSON.parse(savedComments));
      } catch (error) {
        console.error("Failed to parse order comments:", error);
      }
    }
  }, []);

  // Save order comments to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(orderComments).length > 0) {
      localStorage.setItem('tmcavto_order_comments', JSON.stringify(orderComments));
    }
  }, [orderComments]);

  // Filter orders based on active tab
  const filteredOrders = React.useMemo(() => {
    if (!orders || orders.length === 0) return [];
    
    if (activeTab === 'all') {
      return [...orders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    
    return orders
      .filter(order => order.status === activeTab)
      .sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [orders, activeTab]);

  // Calculate order counts for tabs
  const orderCounts = React.useMemo(() => {
    if (!orders || orders.length === 0) {
      return { all: 0, new: 0, processing: 0, completed: 0, canceled: 0 };
    }
    
    return {
      all: orders.length,
      new: orders.filter(order => order.status === 'new').length,
      processing: orders.filter(order => order.status === 'processing').length,
      completed: orders.filter(order => order.status === 'completed').length,
      canceled: orders.filter(order => order.status === 'canceled').length
    };
  }, [orders]);

  // Refresh orders data periodically to sync between different admin users
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Checking for order updates");
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    processOrder(orderId, newStatus);
    setIsOrderDialogOpen(false);
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    // Load existing comment if available
    setOrderComment(orderComments[order.id] || '');
    setIsOrderDialogOpen(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteOrder = () => {
    if (orderToDelete) {
      // In a real application, you would call an API to delete the order
      // For now, let's just remove it from localStorage
      const updatedOrders = orders.filter(o => o.id !== orderToDelete.id);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      
      // Remove comment if it exists
      const updatedComments = {...orderComments};
      delete updatedComments[orderToDelete.id];
      setOrderComments(updatedComments);
      
      // Close dialog and reload page to show updated orders
      setIsDeleteDialogOpen(false);
      window.location.reload();
    }
  };

  const saveOrderComment = () => {
    if (selectedOrder) {
      const updatedComments = {
        ...orderComments,
        [selectedOrder.id]: orderComment
      };
      setOrderComments(updatedComments);
      setIsOrderDialogOpen(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Загрузка заказов...</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Управление заказами</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Список заказов</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
              <TabsList className="mb-4 w-full justify-start">
                <TabsTrigger value="all" className="flex items-center">
                  Все
                  <Badge variant="outline" className="ml-2">{orderCounts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="new" className="flex items-center">
                  Новые
                  {orderCounts.new > 0 && (
                    <Badge className="ml-2 bg-blue-500">{orderCounts.new}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="processing" className="flex items-center">
                  В обработке
                  {orderCounts.processing > 0 && (
                    <Badge variant="secondary" className="ml-2">{orderCounts.processing}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center">
                  Завершенные
                  {orderCounts.completed > 0 && (
                    <Badge className="ml-2 bg-green-500">{orderCounts.completed}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="canceled" className="flex items-center">
                  Отмененные
                  {orderCounts.canceled > 0 && (
                    <Badge variant="destructive" className="ml-2">{orderCounts.canceled}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Нет заказов для отображения</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Дата</TableHead>
                          <TableHead>Клиент</TableHead>
                          <TableHead>Контакты</TableHead>
                          <TableHead>Автомобиль</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Комментарий</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => {
                          const car = getCarById(order.carId);
                          const comment = orderComments[order.id];
                          
                          return (
                            <TableRow key={order.id} className="cursor-pointer hover:bg-muted" onClick={() => handleOrderClick(order)}>
                              <TableCell>
                                {format(new Date(order.createdAt), 'dd MMM yyyy HH:mm', { locale: ru })}
                              </TableCell>
                              <TableCell>{order.customerName}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="flex items-center">
                                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                                    {order.customerPhone}
                                  </span>
                                  <span className="flex items-center text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3 mr-1" />
                                    {order.customerEmail}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {car ? `${car.brand} ${car.model}` : 'Автомобиль не найден'}
                              </TableCell>
                              <TableCell>
                                <OrderStatusBadge status={order.status} />
                              </TableCell>
                              <TableCell>
                                {comment ? (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    <span className="truncate max-w-[150px]">{comment}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-muted-foreground">Нет комментария</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOrderClick(order);
                                    }}
                                  >
                                    <PenLine className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteOrder(order);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Детали заказа</DialogTitle>
            <DialogDescription>
              {selectedOrder && (
                <span>
                  Заказ от {format(new Date(selectedOrder.createdAt), 'dd MMMM yyyy, HH:mm', { locale: ru })}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Клиент</Label>
                  <div className="font-medium">{selectedOrder.customerName}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Статус</Label>
                  <div><OrderStatusBadge status={selectedOrder.status} /></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Телефон</Label>
                  <div className="font-medium">{selectedOrder.customerPhone}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="font-medium">{selectedOrder.customerEmail}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm text-muted-foreground">Автомобиль</Label>
                <div className="font-medium">
                  {(() => {
                    const car = getCarById(selectedOrder.carId);
                    return car 
                      ? `${car.brand} ${car.model} (${car.year})`
                      : 'Автомобиль не найден';
                  })()}
                </div>
              </div>
              
              <div>
                <Label htmlFor="comment">Комментарий к заказу</Label>
                <Textarea
                  id="comment"
                  value={orderComment}
                  onChange={(e) => setOrderComment(e.target.value)}
                  placeholder="Добавьте комментарий к заказу..."
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              {selectedOrder && selectedOrder.status === 'new' && (
                <Button
                  onClick={() => handleStatusChange(selectedOrder.id, 'processing')}
                  variant="default"
                >
                  В обработку
                </Button>
              )}
              
              {selectedOrder && selectedOrder.status === 'processing' && (
                <Button
                  onClick={() => handleStatusChange(selectedOrder.id, 'completed')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Завершить
                </Button>
              )}
              
              {selectedOrder && (selectedOrder.status === 'new' || selectedOrder.status === 'processing') && (
                <Button
                  onClick={() => handleStatusChange(selectedOrder.id, 'canceled')}
                  variant="destructive"
                >
                  Отменить
                </Button>
              )}
            </div>
            
            <Button type="button" onClick={saveOrderComment}>
              Сохранить комментарий
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Order Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Удаление заказа</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот заказ? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteOrder}
            >
              Удалить заказ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
