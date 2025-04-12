
import { useEffect, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCars } from "@/contexts/CarsContext";

const NetworkStatus = () => {
  const [visible, setVisible] = useState(false);
  const { isOnline, refreshFavorites, reloadOrders, reloadCars } = useCars();
  
  useEffect(() => {
    if (isOnline === false) {
      // Если перешли в офлайн, показываем индикатор
      setVisible(true);
    } else if (isOnline === true) {
      // Если подключились после офлайна, показываем на 3 секунды
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline]);
  
  // Обработчик для ручной синхронизации данных
  const handleSync = () => {
    if (isOnline) {
      refreshFavorites?.();
      reloadOrders();
      reloadCars();
    }
  };
  
  if (!visible) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`fixed bottom-20 right-4 z-50 flex items-center px-3 py-2 space-x-2 rounded-full shadow-lg cursor-pointer ${
              isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
            onClick={handleSync}
          >
            {isOnline ? (
              <>
                <Wifi size={16} />
                <span className="text-sm font-medium">Онлайн</span>
              </>
            ) : (
              <>
                <WifiOff size={16} />
                <span className="text-sm font-medium">Офлайн</span>
              </>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="left">
          {isOnline 
            ? "Вы снова в сети. Данные синхронизированы." 
            : "Вы работаете в офлайн режиме. Данные будут синхронизированы при подключении к интернету."}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NetworkStatus;
