import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  onTypingChange: (isTyping: boolean) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onFileUpload,
  isUploading,
  onTypingChange,
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingChange(true);
    }
    // Reset typing status after 2 seconds of inactivity
    const timer = setTimeout(() => {
      setIsTyping(false);
      onTypingChange(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isTyping, onTypingChange]);

  useEffect(() => {
    if (message) {
      handleTyping();
    } else {
      setIsTyping(false);
      onTypingChange(false);
    }
  }, [message, handleTyping, onTypingChange]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      onTypingChange(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="flex items-center p-4 bg-background border-t">
      <Input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
        className="flex-grow mr-2"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Paperclip className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
      </label>
      <Button onClick={handleSendMessage} className="ml-2" disabled={!message.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

