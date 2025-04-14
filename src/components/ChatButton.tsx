
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

const ChatButton: React.FC = () => {
  const { isOpen, toggleChat } = useChat();
  
  return (
    <Button 
      variant="ghost" 
      size="icon"
      onClick={toggleChat}
      className="relative"
      aria-label="Открыть чат"
    >
      <MessageCircle className="h-5 w-5" />
      {/* Optionally add an indicator if there are unread messages */}
      {/* {hasUnreadMessages && (
        <span className="absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500" />
      )} */}
    </Button>
  );
};

export default ChatButton;
