
import React from 'react';

interface CarNavigationProps {
  currentCarId: string;
  className?: string;
}

// This component returns null as navigation arrows have been removed
const CarNavigation: React.FC<CarNavigationProps> = () => {
  return null;
};

export default CarNavigation;
