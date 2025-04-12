
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface TelegramHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  telegramUrl: string;
}

const TelegramHeader: React.FC<TelegramHeaderProps> = ({
  title,
  description,
  buttonText,
  telegramUrl
}) => {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-600 max-w-2xl mx-auto mb-6">{description}</p>
      
      <Button
        variant="default"
        asChild
        className="bg-[#0088cc] hover:bg-[#0077b5]"
      >
        <a 
          href={telegramUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <span className="mr-2">{buttonText}</span>
          <ExternalLink className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
};

export default TelegramHeader;
