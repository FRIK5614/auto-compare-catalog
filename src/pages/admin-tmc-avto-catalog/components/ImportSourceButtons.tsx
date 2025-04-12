
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ImportSourceButtonsProps {
  catalogUrl: string;
  blockedSources: string[];
  onSourceChange: (source: string) => void;
  defaultUrls: {
    china: string;
    japan: string;
    korea: string;
    all: string;
  };
}

export const ImportSourceButtons: React.FC<ImportSourceButtonsProps> = ({ 
  catalogUrl, 
  blockedSources, 
  onSourceChange,
  defaultUrls
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      <Button 
        variant={catalogUrl === defaultUrls.china ? "default" : "outline"} 
        onClick={() => onSourceChange('china')}
        disabled={blockedSources.includes('china')}
      >
        {blockedSources.includes('china') && <AlertCircle className="mr-2 h-4 w-4" />}
        Китай
      </Button>
      <Button 
        variant={catalogUrl === defaultUrls.japan ? "default" : "outline"} 
        onClick={() => onSourceChange('japan')}
        disabled={blockedSources.includes('japan')}
      >
        {blockedSources.includes('japan') && <AlertCircle className="mr-2 h-4 w-4" />}
        Япония
      </Button>
      <Button 
        variant={catalogUrl === defaultUrls.korea ? "default" : "outline"} 
        onClick={() => onSourceChange('korea')}
        disabled={blockedSources.includes('korea')}
      >
        {blockedSources.includes('korea') && <AlertCircle className="mr-2 h-4 w-4" />}
        Корея
      </Button>
      <Button 
        variant={catalogUrl === defaultUrls.all ? "default" : "outline"} 
        onClick={() => onSourceChange('all')}
      >
        Все
      </Button>
    </div>
  );
};
