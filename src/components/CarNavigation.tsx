
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCars } from '@/hooks/useCars';
import { Car } from '@/types/car';

interface CarNavigationProps {
  currentCarId: string;
  className?: string;
}

// This component is now empty as per user request to remove navigation arrows
const CarNavigation: React.FC<CarNavigationProps> = ({ currentCarId, className = '' }) => {
  return null; // Return null to render nothing
};

export default CarNavigation;
