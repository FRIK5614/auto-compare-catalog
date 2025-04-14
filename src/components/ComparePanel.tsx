
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCars } from "@/hooks/useCars";
import { X, BarChart2, RefreshCw, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const ComparePanel = () => {
  const { 
    comparisonCars, 
    removeFromCompare, 
    clearCompare, 
    loading, 
    error, 
    reloadCars 
  } = useCars();

  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();
  
  // If there are no cars to compare, loading, or error, don't show the panel
  if (loading || error || comparisonCars.length === 0) {
    return null;
  }

  // Limit the number of visible cars in collapsed state
  const visibleCarsLimit = isMobile ? 1 : 3;
  const visibleCars = expanded ? comparisonCars : comparisonCars.slice(0, visibleCarsLimit);
  const hasMoreCars = comparisonCars.length > visibleCarsLimit;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-auto-gray-200 shadow-lg z-40 safe-bottom">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-auto-blue-600" />
              <span className="font-medium">Сравнение: {comparisonCars.length} {comparisonCars.length === 1 ? 'автомобиль' : comparisonCars.length < 5 ? 'автомобиля' : 'автомобилей'}</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 flex-wrap max-h-20 overflow-y-auto smooth-scroll">
              {visibleCars.map(car => (
                <div 
                  key={car.id} 
                  className="flex items-center bg-auto-gray-100 px-2 py-1 rounded mb-1"
                >
                  <span className="text-sm truncate max-w-[150px]">{car.brand} {car.model}</span>
                  <button 
                    onClick={() => removeFromCompare(car.id)}
                    className="ml-1 text-auto-gray-500 hover:text-auto-gray-700 min-h-0 min-w-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              {!expanded && hasMoreCars && (
                <div className="text-sm text-auto-gray-500">
                  и еще {comparisonCars.length - visibleCarsLimit}...
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {hasMoreCars && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-auto-gray-700"
              >
                {expanded ? 
                  <><ChevronDown className="h-4 w-4 mr-1" /> Свернуть</> : 
                  <><ChevronUp className="h-4 w-4 mr-1" /> Показать все</>
                }
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reloadCars}
              className="text-auto-gray-700 md:flex hidden items-center"
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} />
              Обновить
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCompare}
              className="text-auto-gray-700"
            >
              Очистить
            </Button>
            
            <Button 
              asChild
              size="sm"
              variant="blue"
            >
              <Link to="/compare">
                <BarChart2 className="mr-1 h-4 w-4" />
                Сравнить
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePanel;
