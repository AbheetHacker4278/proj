import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, MoreVertical } from "lucide-react";

interface ChatHeaderProps {
  roomName: string;
  roomId: string;
}

export const ChatHeader = ({ roomName, roomId }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{roomName}</h2>
          <p className="text-sm text-muted-foreground">Room ID: {roomId}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};