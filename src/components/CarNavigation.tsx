
import React from 'react';

interface CarNavigationProps {
  currentCarId: string;
  className?: string;
}

// This component returns null as per user request to remove navigation arrows
const CarNavigation: React.FC<CarNavigationProps> = () => {
  return null;
};

export default CarNavigation;
