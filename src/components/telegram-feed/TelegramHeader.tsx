import React from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  return <div className="mb-8 text-center sticky top-0 z-10 bg-white py-6 shadow-md">
      
      <p className="text-gray-600 mb-6">{description}</p>
      <Button variant="blue" size="lg" className="font-bold" onClick={() => window.open(telegramUrl, '_blank')}>
        <ExternalLink className="mr-2 h-5 w-5" />
        {buttonText}
      </Button>
    </div>;
};
export default TelegramHeader;