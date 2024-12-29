import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, ChevronLeft } from 'lucide-react';

// Utility functions
const generateUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getAvatarColor = (email: string) => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const getInitials = (email: string) => {
  return email
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();
};

// Types
interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender_email: string;
  created_at: string;
  message_type: 'text' | 'image' | 'video';
  file_url?: string;
}

interface TypingUser {
  email: string;
  isTyping: boolean;
}

// Sub-components
const ChatHeader: React.FC<{ roomName: string; roomId: string; onBack: () => void }> = ({ roomName, roomId, onBack }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-800">
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onBack}
        className="mr-2 hover:bg-gray-800"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </Button>
      <Avatar>
        <AvatarFallback 
          style={{ backgroundColor: getAvatarColor(roomName) }}
          className="text-white"
        >
          {getInitials(roomName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold text-lg">{roomName}</h2>
        <p className="text-sm text-gray-400">Room ID: {roomId}</p>
      </div>
    </div>
  </div>
);

const MessageBubble: React.FC<Message & { isOwnMessage: boolean }> = ({
  content,
  sender_email,
  created_at,
  isOwnMessage,
  message_type,
  file_url
}) => (
  <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
    {!isOwnMessage && (
      <Avatar className="h-8 w-8 mr-2">
        <AvatarFallback 
          style={{ backgroundColor: getAvatarColor(sender_email) }}
          className="text-white text-sm"
        >
          {getInitials(sender_email)}
        </AvatarFallback>
      </Avatar>
    )}
    <div
      className={`max-w-[70%] rounded-lg p-3 shadow-md ${
        isOwnMessage ? "bg-blue-600" : "bg-gray-800"
      }`}
    >
      {message_type === 'text' && <p className="text-sm">{content}</p>}
      {message_type === 'image' && file_url && (
        <img src={file_url} alt={content} className="max-w-full rounded" />
      )}
      {message_type === 'video' && file_url && (
        <video src={file_url} controls className="max-w-full rounded" />
      )}
      <p className="text-xs opacity-60 mt-1 text-white">
        {new Date(created_at).toLocaleTimeString()}
      </p>
    </div>
    {isOwnMessage && (
      <Avatar className="h-8 w-8 ml-2">
        <AvatarFallback 
          style={{ backgroundColor: getAvatarColor(sender_email) }}
          className="text-white text-sm"
        >
          {getInitials(sender_email)}
        </AvatarFallback>
      </Avatar>
    )}
  </div>
);

const TypingIndicator: React.FC<{ email: string }> = ({ email }) => (
  <div className="flex items-center space-x-2 p-3">
    <Avatar className="h-8 w-8">
      <AvatarFallback 
        style={{ backgroundColor: getAvatarColor(email) }}
        className="text-white text-sm"
      >
        {getInitials(email)}
      </AvatarFallback>
    </Avatar>
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
    <span className="text-sm text-gray-400">{email} is typing...</span>
  </div>
);

// Main ChatRoom component
const ChatRoom: React.FC = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [channel, setChannel] = useState<any>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails();
      fetchMessages();
      const unsubscribe = subscribeToMessages();
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [roomId]);

  useEffect(() => {
    if (messages.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [messages, isInitialLoad]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers, scrollToBottom]); // Updated useEffect hook

  const fetchRoomDetails = async () => {
    if (!roomId) return;
    const { data: room, error } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", roomId)
      .single();

    if (error) {
      toast.error("Failed to load room");
      return;
    }

    if (room) {
      setRoomName(room.name);
    }
  };

  const fetchMessages = async () => {
    if (!roomId) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load messages");
      return;
    }

    if (data) {
      setMessages(data as Message[]);
    }
  };

  const subscribeToMessages = () => {
    if (!roomId) return;
    
    const newChannel = supabase.channel(`room:${roomId}`);

    newChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = newChannel.presenceState();
        const typingUsers = Object.values(newState)
          .flat()
          .map((user: any) => ({
            email: user.email,
            isTyping: user.isTyping
          }));
        setTypingUsers(typingUsers);
      })
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
          setTypingUsers(prev => prev.filter(u => u.email !== newMessage.sender_email));
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await newChannel.track({ online_at: new Date().toISOString() });
        }
      });

    setChannel(newChannel);

    return () => {
      supabase.removeChannel(newChannel);
    };
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !roomId) return;

    updateTypingStatus(false);

    const message = {
      room_id: roomId,
      content: newMessage,
      sender_id: user.id,
      sender_email: user.email,
      message_type: 'text' as const,
    };

    const { error } = await supabase
      .from("messages")
      .insert([message]);

    if (error) {
      toast.error("Failed to send message");
      return;
    }

    setNewMessage("");
  };

  const handleFileUpload = async (file: File) => {
    if (!user || !roomId) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${generateUID()}.${fileExt}`;
      const filePath = `${roomId}/${fileName}`;
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';

      const { error: uploadError } = await supabase.storage
        .from('chat_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat_media')
        .getPublicUrl(filePath);

      const message = {
        room_id: roomId,
        content: file.name,
        sender_id: user.id,
        sender_email: user.email,
        message_type: fileType,
        file_url: publicUrl,
      };

      const { error: messageError } = await supabase
        .from("messages")
        .insert([message]);

      if (messageError) throw messageError;

      toast.success(`${fileType} uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const updateTypingStatus = async (isTyping: boolean) => {
    if (channel && user) {
      await channel.track({ isTyping, email: user.email });
    }
  };

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNewMessage(newValue);
    
    if ((newValue.length === 0 && newMessage.length > 0) || (newValue.length > 0 && newMessage.length === 0)) {
      updateTypingStatus(newValue.length > 0);
    }
    
    // Scroll to bottom when typing
    scrollToBottom();
  }, [newMessage, updateTypingStatus, scrollToBottom]); // Updated handleInputChange function

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <ChatHeader roomName={roomName} roomId={roomId!} onBack={() => navigate('/')} />
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              {...message}
              isOwnMessage={message.sender_id === user?.id}
            />
          ))}
          {typingUsers
            .filter(typingUser => typingUser.email !== user?.email && typingUser.isTyping)
            .map(typingUser => (
              <TypingIndicator key={typingUser.email} email={typingUser.email} />
            ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border-0 focus:ring-0 text-white placeholder-gray-400"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            accept="image/*,video/*"
            className="hidden"
          />
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatRoom;

