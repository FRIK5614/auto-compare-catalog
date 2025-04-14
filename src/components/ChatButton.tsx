
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ChatButton: React.FC = () => {
  return (
    <Link to="/ai-chat">
      <Button 
        variant="ghost" 
        size="icon"
        className="relative"
        aria-label="ИИ-ассистент"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </Link>
  );
};

export default ChatButton;
