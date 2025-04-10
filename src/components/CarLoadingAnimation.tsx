
import { Loader2, Car } from "lucide-react";

interface CarLoadingAnimationProps {
  count?: number;
  className?: string;
}

const CarLoadingAnimation = ({ count = 3, className = "" }: CarLoadingAnimationProps) => {
  return (
    <div className={`flex items-center justify-center flex-col ${className}`}>
      <div className="w-16 h-16 rounded-full bg-auto-blue-100 flex items-center justify-center animate-pulse">
        <Car className="h-10 w-10 text-auto-blue-600 animate-bounce" />
      </div>
      <p className="mt-4 text-auto-gray-600">Загрузка автомобилей...</p>
    </div>
  );
};

export default CarLoadingAnimation;
