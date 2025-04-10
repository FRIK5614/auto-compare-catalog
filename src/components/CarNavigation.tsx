
import React from 'react';

interface CarNavigationProps {
  currentCarId: string;
  className?: string;
}

// This component now returns null as navigation arrows have been removed in favor of swipe gestures
const CarNavigation: React.FC<CarNavigationProps> = () => {
  return null;
};

export default CarNavigation;
