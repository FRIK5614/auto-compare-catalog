
import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TelegramHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  telegramUrl: string;
}

const TelegramHeader = ({
  title,
  description,
  buttonText,
  telegramUrl
}: TelegramHeaderProps) => {
  return (
    <div className="mb-8 text-center sticky top-[56px] z-10 bg-white py-6 shadow-md">
      <h1 className="text-2xl font-bold mb-3 text-auto-blue-700">{title}</h1>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button 
        variant="blue" 
        size="lg" 
        className={cn(
          "font-bold relative overflow-hidden group",
          "transition-all duration-300 hover:shadow-lg active:scale-95"
        )}
        onClick={() => window.open(telegramUrl, '_blank')}
      >
        <span className="relative z-10 flex items-center">
          <ExternalLink className="mr-2 h-5 w-5 group-hover:animate-pulse" />
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            {buttonText}
          </span>
        </span>
        <span className="absolute inset-0 bg-gradient-to-r from-auto-blue-600 to-auto-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    </div>
  );
};

export default TelegramHeader;
