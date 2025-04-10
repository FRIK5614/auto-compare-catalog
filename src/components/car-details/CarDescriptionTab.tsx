
import React from "react";

interface CarDescriptionTabProps {
  description: string;
}

const CarDescriptionTab: React.FC<CarDescriptionTabProps> = ({ description }) => {
  return (
    <div className="prose max-w-none">
      <p className="text-auto-gray-700 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default CarDescriptionTab;
