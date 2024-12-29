import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image, Video } from "lucide-react";
import { useState } from "react";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}

export const MessageInput = ({ onSendMessage, onFileUpload, isUploading }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileUpload(file);
          }}
          disabled={isUploading}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
          disabled={isUploading}
        >
          <Image className="h-5 w-5 mr-1" />
          <Video className="h-5 w-5" />
        </Button>
        <Button type="submit" disabled={isUploading}>
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};