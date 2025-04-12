import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/AdminLayout";
import { useCars } from "@/hooks/useCars";
import { Order } from "@/types/car";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  AlertCircle, 
  ClipboardList, 
  Eye, 
  FileEdit, 
  Loader2, 
  MessageSquare, 
  Search, 
  Trash2, 
  UserCheck 
} from "lucide-react";

type OrderStatus = "new" | "processing" | "completed" | "canceled";

interface ExtendedOrder extends Order {
  comments?: string;
  adminNotes?: string;
}

const statusColors: Record<OrderStatus, string> = {
  new: "bg-blue-500",
  processing: "bg-yellow-500",
  completed: "bg-green-500",
  canceled: "bg-red-500",
};

const statusLabels: Record<OrderStatus, string> = {
  new: "Новый",
  processing: "В обработке",
  completed: "Завершен",
  canceled: "Отменен",
};

const AdminOrders = () => {
  const { cars, orders: initialOrders, processOrder, getCarById } = useCars();
  const { siteConfig } = useAdmin();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [adminNote, setAdminNote] = useState("");
  const [sendNotification, setSendNotification] = useState(true);
  
  useEffect(() => {
    if (initialOrders && initialOrders.length > 0) {
      const extendedOrders = initialOrders.map(order => ({
        ...order,
        comments: "",
        adminNotes: ""
      }));
      setOrders(extendedOrders);
    } else {
      const storedOrders = localStorage.getItem("tmcavto_admin_orders");
      if (storedOrders) {
        try {
          setOrders(JSON.parse(storedOrders));
        } catch (e) {
          console.error("Failed to parse stored orders:", e);
        }
      }
    }
  }, [initialOrders]);
  
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("tmcavto_admin_orders", JSON.stringify(orders));
    }
  }, [orders]);
  
  const filteredOrders = orders
    .filter(order => {
      if (filter !== "all" && order.status !== filter) {
        return false;
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          order.customerName.toLowerCase().includes(searchLower) ||
          order.customerEmail.toLowerCase().includes(searchLower) ||
          order.customerPhone.toLowerCase().includes(searchLower) ||
          (order.comments && order.comments.toLowerCase().includes(searchLower)) ||
          (order.adminNotes && order.adminNotes.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
  
  const orderCounts = {
    all: orders.length,
    new: orders.filter(order => order.status === "new").length,
    processing: orders.filter(order => order.status === "processing").length,
    completed: orders.filter(order => order.status === "completed").length,
    canceled: orders.filter(order => order.status === "canceled").length,
  };
  
  const handleViewOrder = (order: ExtendedOrder) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
    setIsEditMode(false);
    
    if (order.status === "new") {
      handleUpdateOrderStatus(order, "processing");
    }
  };
  
  const handleEditOrder = (order: ExtendedOrder) => {
    setSelectedOrder({...order});
    setIsOrderDialogOpen(true);
    setIsEditMode(true);
    setAdminNote(order.adminNotes || "");
  };
  
  const handleDeleteOrder = (order: ExtendedOrder) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteOrder = () => {
    if (!selectedOrder) return;
    
    const updatedOrders = orders.filter(o => o.id !== selectedOrder.id);
    setOrders(updatedOrders);
    
    toast({
      title: "Заказ удален",
      description: `Заказ от ${selectedOrder.customerName} был удален`,
    });
    
    setIsDeleteDialogOpen(false);
    setSelectedOrder(null);
  };
  
  const saveOrderChanges = () => {
    if (!selectedOrder) return;
    
    setProcessing(true);
    
    try {
      const updatedOrders = orders.map(o => 
        o.id === selectedOrder.id ? {...selectedOrder, adminNotes: adminNote} : o
      );
      
      setOrders(updatedOrders);
      
      toast({
        title: "Заказ обновлен",
        description: "Изменения сохранены успешно",
      });
      
      setIsOrderDialogOpen(false);
      setSelectedOrder(null);
      setIsEditMode(false);
    } catch (error) {
      console.error("Error saving order changes:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить изменения",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const handleUpdateOrderStatus = async (order: ExtendedOrder, newStatus: OrderStatus) => {
    setProcessing(true);
    
    try {
      await processOrder(order.id, newStatus);
      
      const updatedOrders = orders.map(o => 
        o.id === order.id ? {...o, status: newStatus} : o
      );
      
      setOrders(updatedOrders);
      
      if (selectedOrder && selectedOrder.id === order.id) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
      
      if (sendNotification && 
          siteConfig.telegram?.notifyOnNewOrder && 
          siteConfig.telegram?.adminChatId) {
        
        try {
          const carName = getCarById(order.carId)?.brand + " " + getCarById(order.carId)?.model;
          const statusText = statusLabels[newStatus];
          
          console.log(`Notification would be sent to ${siteConfig.telegram.adminChatId} about order status change to ${statusText} for ${carName}`);
          
          toast({
            title: "Уведомление отправлено",
            description: "Уведомление о изменении статуса заказа отправлено в Telegram",
          });
        } catch (notifyError) {
          console.error("Failed to send notification:", notifyError);
        }
      }
      
      toast({
        title: "Статус обновлен",
        description: `Статус заказа изменен на "${statusLabels[newStatus]}"`,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить статус заказа",
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const createManualOrder = () => {
    if (cars.length === 0) {
      toast({
        variant: "destructive",
        title: "Нет автомобилей",
        description: "Невозможно создать заказ без автомобилей в системе",
      });
      return;
    }
    
    const now = new Date().toISOString();
    const newOrder: ExtendedOrder = {
      id: uuidv4(),
      carId: cars[0].id,
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      status: "new",
      createdAt: now,
      updatedAt: now,
      comments: "",
      adminNotes: "Заказ создан вручную администратором"
    };
    
    setSelectedOrder(newOrder);
    setIsOrderDialogOpen(true);
    setIsEditMode(true);
    setAdminNote(newOrder.adminNotes || "");
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Управление заказами</h1>
          <Button onClick={createManualOrder}>Создать заказ</Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Фильтр заказов</CardTitle>
            <CardDescription>
              {orders.length} {orders.length === 1 ? "заказ" : (orders.length >= 2 && orders.length <= 4) ? "заказа" : "заказов"} в системе
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Поиск</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Имя, email, телефон..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Статус</Label>
                    <Select value={filter} onValueChange={(value) => setFilter(value as OrderStatus | "all")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Все заказы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все заказы ({orderCounts.all})</SelectItem>
                        <SelectItem value="new">Новые ({orderCounts.new})</SelectItem>
                        <SelectItem value="processing">В обработке ({orderCounts.processing})</SelectItem>
                        <SelectItem value="completed">Завершенные ({orderCounts.completed})</SelectItem>
                        <SelectItem value="canceled">Отмененные ({orderCounts.canceled})</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Сортировка</Label>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Сначала новые</SelectItem>
                        <SelectItem value="oldest">Сначала старые</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="notify" 
                  checked={sendNotification} 
                  onCheckedChange={(checked) => setSendNotification(checked as boolean)} 
                />
                <Label htmlFor="notify" className="text-sm cursor-pointer">
                  Отправлять уведомления в Telegram при изменении статуса
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="table" className="mb-6">
          <TabsList>
            <TabsTrigger value="table">Таблица</TabsTrigger>
            <TabsTrigger value="cards">Карточки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Клиент</TableHead>
                      <TableHead>Автомобиль</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Заметки</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <ClipboardList className="h-8 w-8 mb-2" />
                            <p>Нет заказов, соответствующих фильтрам</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const car = getCarById(order.carId);
                        return (
                          <TableRow key={order.id}>
                            <TableCell>
                              {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", { locale: ru })}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{order.customerName}</div>
                              <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                            </TableCell>
                            <TableCell>
                              {car ? (
                                <>
                                  <div className="font-medium">{car.brand} {car.model}</div>
                                  <div className="text-sm text-muted-foreground">{car.year} г.</div>
                                </>
                              ) : (
                                <span className="text-muted-foreground">Автомобиль не найден</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${statusColors[order.status as OrderStatus]}`}>
                                {statusLabels[order.status as OrderStatus]}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {order.adminNotes ? (
                                <div className="max-w-[200px] truncate" title={order.adminNotes}>
                                  {order.adminNotes}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Нет</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewOrder(order)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditOrder(order)}
                                >
                                  <FileEdit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteOrder(order)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cards">
            {filteredOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ClipboardList className="h-12 w-12 mb-4" />
                <p className="text-xl">Нет заказов, соответствующих фильтрам</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => {
                  const car = getCarById(order.carId);
                  return (
                    <Card key={order.id} className="overflow-hidden">
                      <div className={`h-2 ${statusColors[order.status as OrderStatus]}`} />
                      <CardHeader className="p-4">
                        <div className="flex justify-between">
                          <Badge className={`${statusColors[order.status as OrderStatus]}`}>
                            {statusLabels[order.status as OrderStatus]}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm", { locale: ru })}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{order.customerName}</CardTitle>
                        <CardDescription>
                          <div>{order.customerPhone}</div>
                          <div>{order.customerEmail}</div>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="p-4 pt-0">
                        <div className="bg-muted/50 p-3 rounded-md mb-3">
                          <div className="font-medium">{car ? `${car.brand} ${car.model}, ${car.year} г.` : "Автомобиль не найден"}</div>
                          {car && car.price && (
                            <div className="text-sm mt-1">{car.price.base.toLocaleString()} ₽</div>
                          )}
                        </div>
                        
                        {order.adminNotes && (
                          <div className="text-sm">
                            <div className="font-medium mb-1">Заметки:</div>
                            <div className="text-muted-foreground">{order.adminNotes}</div>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Просмотр
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => handleEditOrder(order)}
                        >
                          <FileEdit className="h-4 w-4 mr-1" />
                          Ред.
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedOrder && (
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? "Редактирование заказа" : "Просмотр заказа"}
              </DialogTitle>
              <DialogDescription>
                {format(new Date(selectedOrder.createdAt), "dd MMMM yyyy, HH:mm", { locale: ru })}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Детали заказа</TabsTrigger>
                <TabsTrigger value="customer">Клиент</TabsTrigger>
                <TabsTrigger value="notes">Заметки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Статус заказа</h3>
                    <Badge className={`${statusColors[selectedOrder.status as OrderStatus]}`}>
                      {statusLabels[selectedOrder.status as OrderStatus]}
                    </Badge>
                  </div>
                  
                  {isEditMode ? (
                    <Select 
                      value={selectedOrder.status} 
                      onValueChange={(value) => setSelectedOrder({...selectedOrder, status: value as OrderStatus})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">Новый</SelectItem>
                        <SelectItem value="processing">В обработке</SelectItem>
                        <SelectItem value="completed">Завершен</SelectItem>
                        <SelectItem value="canceled">Отменен</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        disabled={selectedOrder.status === "processing" || processing} 
                        onClick={() => handleUpdateOrderStatus(selectedOrder, "processing")}
                        variant={selectedOrder.status === "processing" ? "outline" : "default"}
                      >
                        {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <UserCheck className="h-4 w-4 mr-2" />}
                        В обработке
                      </Button>
                      <Button 
                        disabled={selectedOrder.status === "completed" || processing} 
                        onClick={() => handleUpdateOrderStatus(selectedOrder, "completed")}
                        variant={selectedOrder.status === "completed" ? "outline" : "default"}
                      >
                        {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckIcon className="h-4 w-4 mr-2" />}
                        Завершен
                      </Button>
                      <Button 
                        disabled={selectedOrder.status === "new" || processing} 
                        onClick={() => handleUpdateOrderStatus(selectedOrder, "new")}
                        variant={selectedOrder.status === "new" ? "outline" : "default"}
                      >
                        {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <AlertCircle className="h-4 w-4 mr-2" />}
                        Новый
                      </Button>
                      <Button 
                        disabled={selectedOrder.status === "canceled" || processing} 
                        onClick={() => handleUpdateOrderStatus(selectedOrder, "canceled")}
                        variant={selectedOrder.status === "canceled" ? "outline" : "destructive"}
                      >
                        {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XIcon className="h-4 w-4 mr-2" />}
                        Отменен
                      </Button>
                    </div>
                  )}
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2">Информация об автомобиле</h3>
                    
                    {isEditMode ? (
                      <Select 
                        value={selectedOrder.carId} 
                        onValueChange={(value) => setSelectedOrder({...selectedOrder, carId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите автомобиль" />
                        </SelectTrigger>
                        <SelectContent>
                          {cars.map(car => (
                            <SelectItem key={car.id} value={car.id}>
                              {car.brand} {car.model}, {car.year} г.
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <>
                        {(() => {
                          const car = getCarById(selectedOrder.carId);
                          if (!car) return <div className="text-muted-foreground">Автомобиль не найден</div>;
                          
                          return (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="md:col-span-1">
                                {car.image_url ? (
                                  <img 
                                    src={car.image_url} 
                                    alt={`${car.brand} ${car.model}`} 
                                    className="w-full h-auto rounded-md object-cover aspect-[4/3]"
                                  />
                                ) : (
                                  <div className="w-full bg-muted rounded-md aspect-[4/3] flex items-center justify-center">
                                    <span className="text-muted-foreground">Нет изображения</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="md:col-span-2">
                                <h4 className="text-xl font-semibold">{car.brand} {car.model}</h4>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <div>
                                    <div className="text-sm text-muted-foreground">Год</div>
                                    <div>{car.year}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-muted-foreground">Цена</div>
                                    <div>{car.price.base.toLocaleString()} ₽</div>
                                  </div>
                                  {car.engine && (
                                    <>
                                      <div>
                                        <div className="text-sm text-muted-foreground">Двигатель</div>
                                        <div>{car.engine.type}, {car.engine.displacement} л</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-muted-foreground">Трансмиссия</div>
                                        <div>{car.transmission?.type}</div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="customer">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customer_name">ФИО клиента</Label>
                    <Input
                      id="customer_name"
                      value={selectedOrder.customerName}
                      onChange={(e) => isEditMode && setSelectedOrder({...selectedOrder, customerName: e.target.value})}
                      readOnly={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customer_phone">Телефон</Label>
                    <Input
                      id="customer_phone"
                      value={selectedOrder.customerPhone}
                      onChange={(e) => isEditMode && setSelectedOrder({...selectedOrder, customerPhone: e.target.value})}
                      readOnly={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customer_email">Email</Label>
                    <Input
                      id="customer_email"
                      value={selectedOrder.customerEmail}
                      onChange={(e) => isEditMode && setSelectedOrder({...selectedOrder, customerEmail: e.target.value})}
                      readOnly={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="customer_comment">Комментарий клиента</Label>
                    <Textarea
                      id="customer_comment"
                      value={selectedOrder.comments || ""}
                      onChange={(e) => isEditMode && setSelectedOrder({...selectedOrder, comments: e.target.value})}
                      readOnly={!isEditMode}
                      rows={3}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="admin_notes">Заметки администратора</Label>
                      {!isEditMode && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditMode(true);
                            setAdminNote(selectedOrder.adminNotes || "");
                          }}
                        >
                          <FileEdit className="h-4 w-4 mr-2" />
                          Редактировать
                        </Button>
                      )}
                    </div>
                    
                    <Textarea
                      id="admin_notes"
                      value={isEditMode ? adminNote : (selectedOrder.adminNotes || "")}
                      onChange={(e) => isEditMode && setAdminNote(e.target.value)}
                      readOnly={!isEditMode}
                      placeholder="Добавьте заметки и комментарии для внутреннего использования"
                      rows={6}
                    />
                    
                    <p className="text-sm text-muted-foreground mt-2">
                      <MessageSquare className="h-4 w-4 inline mr-1" />
                      Заметки видны только администраторам и не отображаются клиентам
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              {isEditMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditMode(false);
                      if (selectedOrder.id === uuidv4()) {
                        setIsOrderDialogOpen(false);
                      }
                    }}
                  >
                    Отмена
                  </Button>
                  <Button 
                    onClick={saveOrderChanges}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      "Сохранить"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsOrderDialogOpen(false)}
                  >
                    Закрыть
                  </Button>
                  <Button 
                    onClick={() => setIsEditMode(true)}
                  >
                    <FileEdit className="h-4 w-4 mr-2" />
                    Редактировать
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот заказ? Это действие невозможно отменить.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p>
                <span className="font-medium">Клиент:</span> {selectedOrder.customerName}
              </p>
              <p>
                <span className="font-medium">Телефон:</span> {selectedOrder.customerPhone}
              </p>
              <p>
                <span className="font-medium">Дата заказа:</span> {format(new Date(selectedOrder.createdAt), "dd.MM.yyyy HH:mm", { locale: ru })}
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={confirmDeleteOrder}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const CheckIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default AdminOrders;
