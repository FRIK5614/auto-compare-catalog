
import { Link } from "react-router-dom";
import { Car } from "@/types/car";

interface CarBasicInfoProps {
  car: Car;
}

const CarBasicInfo = ({ car }: CarBasicInfoProps) => {
  return (
    <div className="mb-2">
      <h3 className="text-lg font-semibold text-auto-gray-900 hover:text-auto-blue-600 transition-colors">
        <Link to={`/car/${car.id}`}>
          {car.brand} {car.model}
        </Link>
      </h3>
      <p className="text-auto-gray-500 text-sm">
        {car.year} • {car.engine.fuelType} • {car.bodyType}
      </p>
    </div>
  );
};

export default CarBasicInfo;
