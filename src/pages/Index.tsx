import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { CreateRoom } from "@/components/CreateRoom";
import { RoomCard } from "@/components/RoomCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { UserMenu } from "@/components/UserMenu";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

const Index = () => {
  const { user, signOut } = useAuth();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      toast.error("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleJoinRoom = (roomId: string) => {
    window.open(`/chat/${roomId}`, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1E1E2E] text-[#CDD6F4]">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E1E2E] p-8 text-[#CDD6F4]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">🤫Whisper Rooms</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => {
                setShowCreateRoom(true);
                setShowJoinRoom(false);
              }}
              className="bg-gradient-to-r from-[#B4BEFE] to-[#CBA6F7] text-[#1E1E2E]"
            >
              Create Room
            </Button>
            <UserMenu email={user.email || ''} onSignOut={handleSignOut} />
          </div>
        </div>

        {showCreateRoom && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="relative bg-[#313244] p-6 rounded-lg shadow-xl">
              <Button
                className="absolute -top-4 -right-4 rounded-full w-8 h-8 p-0 bg-[#B4BEFE] text-[#1E1E2E]"
                onClick={() => setShowCreateRoom(false)}
              >
                ×
              </Button>
              <CreateRoom onCreateRoom={fetchRooms} onClose={() => setShowCreateRoom(false)} />
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p className="text-[#A6ADC8]">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p className="text-[#A6ADC8]">No rooms available. Create one to get started!</p>
          ) : (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                name={room.name}
                id={room.id}
                memberCount={room.member_count || 0}
                createdBy={room.created_by}
                onJoin={() => handleJoinRoom(room.id)}
                onDelete={fetchRooms}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

