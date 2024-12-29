import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trash2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface RoomCardProps {
  name: string;
  id: string;
  memberCount: number;
  createdBy: string;
  onJoin: () => void;
  onDelete: () => void;
}

export const RoomCard = ({ name, id, memberCount, createdBy, onJoin, onDelete }: RoomCardProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === createdBy;
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success("Room deleted successfully");
      onDelete();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete room");
    }
  };

  const handleJoinClick = () => {
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = async () => {
    setIsVerifying(true);
    try {
      // Verify room password
      const { data, error } = await supabase
        .from('rooms')
        .select('password')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data.password === password) {
        setIsPasswordDialogOpen(false);
        setPassword("");
        onJoin();
      } else {
        toast.error("Incorrect password");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify password");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Card className="w-full animate-fadeIn hover:shadow-lg hover:shadow-green-500 hover:transition-shadow">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{name}</span>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {memberCount}/10
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="text-sm text-gray-500">ID: {id}</div>
            <div className="flex gap-2">
              {isOwner && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              )}
              <Button
                onClick={handleJoinClick}
                size="sm"
                className="flex items-center gap-1 bg-gradient-to-r from-chat-primary to-chat-secondary"
                disabled={memberCount >= 10}
              >
                <Lock className="w-4 h-4 mr-1" />
                {memberCount >= 10 ? "Full" : "Join"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Room Password</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && password) {
                  handlePasswordSubmit();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              disabled={!password || isVerifying}
              className="bg-gradient-to-r from-chat-primary to-chat-secondary"
            >
              {isVerifying ? "Verifying..." : "Join Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};