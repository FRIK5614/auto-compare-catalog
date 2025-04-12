
import { useState, useEffect, useCallback, useRef } from "react";
import { Order } from "@/types/car";
import { useToast } from "@/hooks/use-toast";
import { processOrder as processOrderAction } from "../orderActions";
import { loadOrders } from "../dataLoaders";
import { saveOrdersToLocalStorage, loadOrdersFromLocalStorage } from "../utils";
import { supabase } from "@/integrations/supabase/client";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();
  const loadingRef = useRef(false);
  const pendingOrdersRef = useRef<{[key: string]: Order}>({});

  // Следим за состоянием сети
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // При восстановлении соединения синхронизируем отложенные заказы
      syncPendingOrders();
      // И обновляем список заказов из базы данных
      reloadOrdersFromDB();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      // При отключении от сети показываем уведомление
      toast({
        title: "Офлайн режим",
        description: "Работа с заказами будет ограничена. Данные синхронизируются при подключении к интернету",
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Загружаем заказы при инициализации
  useEffect(() => {
    const fetchOrders = async () => {
      if (loadingRef.current) return;
      
      loadingRef.current = true;
      setLoading(true);
      
      try {
        console.log("Загрузка заказов из API в хуке useOrders");
        
        if (isOnline) {
          // Если онлайн, загружаем из API
          const ordersData = await loadOrders();
          console.log("Загружены заказы из API:", ordersData);
          
          if (!ordersData || ordersData.length === 0) {
            console.warn("API не вернул ни одного заказа");
          }
          
          setOrders(ordersData);
          
          // Сохраняем в localStorage для офлайн-доступа
          saveOrdersToLocalStorage(ordersData);
        } else {
          // Если офлайн, используем локальное хранилище
          const localOrders = loadOrdersFromLocalStorage();
          console.log("Загружены заказы из localStorage:", localOrders);
          setOrders(localOrders);
        }
      } catch (error) {
        console.error("Не удалось загрузить заказы:", error);
        
        // В случае ошибки попробуем использовать локальное хранилище
        const localOrders = loadOrdersFromLocalStorage();
        if (localOrders.length > 0) {
          setOrders(localOrders);
        }
        
        toast({
          variant: "destructive",
          title: "Ошибка загрузки заказов",
          description: "Не удалось загрузить данные о заказах. Используются локальные данные."
        });
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };
    
    fetchOrders();
  }, [isOnline, toast]);

  // Синхронизация отложенных заказов с базой данных
  const syncPendingOrders = useCallback(async () => {
    const pendingOrders = pendingOrdersRef.current;
    const pendingOrderIds = Object.keys(pendingOrders);
    
    if (pendingOrderIds.length === 0) return;
    
    console.log(`Синхронизация ${pendingOrderIds.length} отложенных заказов...`);
    
    for (const orderId of pendingOrderIds) {
      const order = pendingOrders[orderId];
      
      try {
        // Проверяем, существует ли заказ в базе
        const { data: existingOrder, error: checkError } = await supabase
          .from('orders')
          .select('id')
          .eq('id', orderId)
          .single();
        
        if (checkError) {
          // Если заказа нет, создаем его
          const { error: insertError } = await supabase
            .from('orders')
            .insert({
              id: order.id,
              car_id: order.carId,
              customer_name: order.customerName,
              customer_phone: order.customerPhone,
              customer_email: order.customerEmail,
              status: order.status,
              message: order.message,
              created_at: order.createdAt || new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`Ошибка создания заказа ${orderId}:`, insertError);
            continue;
          }
          
          console.log(`Заказ ${orderId} успешно создан в базе`);
        } else {
          // Если заказ существует, обновляем его статус
          const { error: updateError } = await supabase
            .from('orders')
            .update({ 
              status: order.status,
              updated_at: new Date().toISOString()
            })
            .eq('id', orderId);
          
          if (updateError) {
            console.error(`Ошибка обновления заказа ${orderId}:`, updateError);
            continue;
          }
          
          console.log(`Заказ ${orderId} успешно обновлен в базе`);
        }
        
        // Удаляем из списка отложенных после успешной синхронизации
        delete pendingOrdersRef.current[orderId];
      } catch (error) {
        console.error(`Ошибка синхронизации заказа ${orderId}:`, error);
      }
    }
    
    const remainingOrders = Object.keys(pendingOrdersRef.current).length;
    if (remainingOrders > 0) {
      console.warn(`${remainingOrders} заказов не удалось синхронизировать`);
    } else {
      console.log("Все отложенные заказы успешно синхронизированы");
      // Обновляем список заказов из базы данных
      reloadOrdersFromDB();
    }
  }, []);

  // Загрузка заказов из базы данных
  const reloadOrdersFromDB = useCallback(async () => {
    if (loadingRef.current || !isOnline) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      console.log("Обновление заказов из API...");
      const ordersData = await loadOrders();
      console.log("Заказы обновлены:", ordersData);
      
      if (!ordersData || ordersData.length === 0) {
        console.warn("API не вернул ни одного заказа");
      }
      
      setOrders(ordersData);
      saveOrdersToLocalStorage(ordersData);
      
      toast({
        title: "Заказы обновлены",
        description: `Загружено ${ordersData.length} заказов`
      });
    } catch (error) {
      console.error("Не удалось обновить заказы:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки заказов",
        description: "Не удалось обновить данные о заказах"
      });
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [isOnline, toast]);

  // Обработка заказа (обновление статуса)
  const handleProcessOrder = useCallback(async (orderId: string, status: Order['status']) => {
    try {
      // Всегда обновляем локальное состояние
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      );
      setOrders(updatedOrders);
      saveOrdersToLocalStorage(updatedOrders);
      
      if (isOnline) {
        // Если онлайн, обновляем в базе данных
        const { error } = await supabase
          .from('orders')
          .update({ 
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', orderId);
        
        if (error) {
          throw error;
        }
      } else {
        // Если офлайн, добавляем в список отложенных
        const orderToUpdate = orders.find(order => order.id === orderId);
        if (orderToUpdate) {
          pendingOrdersRef.current[orderId] = {
            ...orderToUpdate,
            status
          };
          
          console.log(`Заказ ${orderId} добавлен в список отложенных`);
          
          toast({
            title: "Заказ обновлен локально",
            description: "Изменения будут синхронизированы при подключении к интернету"
          });
        }
      }
      
      toast({
        title: "Статус заказа обновлен",
        description: `Заказ #${orderId.substring(0, 8)} теперь имеет статус "${status}"`
      });
      
      return true;
    } catch (error) {
      console.error("Ошибка при обработке заказа:", error);
      toast({ 
        variant: "destructive", 
        title: "Ошибка", 
        description: "Не удалось обновить статус заказа" 
      });
      return false;
    }
  }, [orders, isOnline, toast]);

  // Получение всех заказов
  const getOrders = useCallback(() => {
    return orders;
  }, [orders]);

  return {
    orders,
    loading,
    isOnline,
    setOrders,
    processOrder: handleProcessOrder,
    getOrders,
    reloadOrders: reloadOrdersFromDB
  };
};
