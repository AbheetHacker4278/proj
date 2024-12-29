import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MediaMessage } from "./MediaMessage";

interface MessageBubbleProps {
  content: string;
  senderEmail: string;
  createdAt: string;
  isOwnMessage: boolean;
  messageType: 'text' | 'image' | 'video';
  fileUrl?: string;
}

export const MessageBubble = ({ 
  content, 
  senderEmail, 
  createdAt, 
  isOwnMessage,
  messageType,
  fileUrl 
}: MessageBubbleProps) => {
  return (
    <div className={`flex items-start gap-2 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback>{senderEmail[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-medium mb-1">{senderEmail}</p>
        )}
        {messageType === 'text' ? (
          <p>{content}</p>
        ) : (
          <MediaMessage 
            type={messageType} 
            url={fileUrl!} 
            fileName={content}
          />
        )}
        <p className="text-xs opacity-70 mt-1">
          {new Date(createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};