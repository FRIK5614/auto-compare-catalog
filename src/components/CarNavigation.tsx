
import React from 'react';

interface CarNavigationProps {
  currentCarId: string;
  className?: string;
}

// This component is now empty as per user request to remove navigation arrows
const CarNavigation: React.FC<CarNavigationProps> = ({ currentCarId, className = '' }) => {
  return null; // Return null to render nothing
};

export default CarNavigation;
