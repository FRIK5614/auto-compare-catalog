
import { Car } from "@/types/car";

interface CarSpecificationsProps {
  car: Car;
}

const CarSpecifications = ({ car }: CarSpecificationsProps) => {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
      <div className="flex items-center">
        <span className="text-auto-gray-600">Двигатель:</span>
      </div>
      <div className="text-right">
        <span className="text-auto-gray-900 font-medium">
          {car.engine.displacement} л, {car.engine.power} л.с.
        </span>
      </div>
      
      <div className="flex items-center">
        <span className="text-auto-gray-600">КПП:</span>
      </div>
      <div className="text-right">
        <span className="text-auto-gray-900 font-medium">
          {car.transmission.type}
        </span>
      </div>
      
      <div className="flex items-center">
        <span className="text-auto-gray-600">Привод:</span>
      </div>
      <div className="text-right">
        <span className="text-auto-gray-900 font-medium">
          {car.drivetrain}
        </span>
      </div>
    </div>
  );
};

export default CarSpecifications;
