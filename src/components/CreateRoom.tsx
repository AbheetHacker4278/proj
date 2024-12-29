import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

interface CreateRoomProps {
  onCreateRoom: (data: { name: string; password: string }) => void;
  onClose?: () => void;
}

export const CreateRoom = ({ onCreateRoom, onClose }: CreateRoomProps) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a room");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .insert([
          {
            name,
            password,
            created_by: user.id,
            member_count: 1
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Room created successfully!");
      onCreateRoom({ name, password });
      if (onClose) onClose();
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast.error(error.message || "Failed to create room");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-[350px] animate-fadeIn">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Create Room</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Room Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Room Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-chat-primary to-chat-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};