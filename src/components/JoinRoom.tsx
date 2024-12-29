// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { supabase } from "@/integrations/supabase/client";

// interface JoinRoomProps {
//   onJoinRoom: (data: { roomId: string; password: string }) => void;
// }

// export const JoinRoom = ({ onJoinRoom }: JoinRoomProps) => {
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!password) {
//       toast.error("Please enter the room password");
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       // Find room by password
//       const { data: room, error } = await supabase
//         .from('rooms')
//         .select('id')
//         .eq('password', password)
//         .single();

//       if (error || !room) {
//         toast.error("Invalid room password");
//         return;
//       }

//       onJoinRoom({ roomId: room.id, password });
      
//       // Open chat in new tab
//       window.open(`/chat/${room.id}`, '_blank');
//     } catch (error: any) {
//       toast.error(error.message || "Failed to join room");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="w-[350px] animate-fadeIn">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">Join Room</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Input
//               type="password"
//               placeholder="Room Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full"
//               disabled={isLoading}
//             />
//           </div>
//           <Button 
//             type="submit" 
//             className="w-full bg-gradient-to-r from-chat-primary to-chat-secondary"
//             disabled={isLoading}
//           >
//             {isLoading ? "Joining..." : "Join Room"}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };