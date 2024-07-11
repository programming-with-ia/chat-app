"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/button";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      console.log("function got called");
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
    };

    pusherClient.bind("incoming_friend_requests", friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/friends/deny", { id: senderId });

    setFriendRequests((prev) =>
      prev.filter((request) => request.senderId !== senderId)
    );

    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div
            key={request.senderId}
            className="flex gap-4 items-center bg-card rounded-lg px-4 py-2 border shadow-sm"
          >
            <UserPlus className="text-current" />
            <p className="font-medium text-lg text-card-foreground">
              {request.senderEmail}
            </p>
            <hr className="mx-auto opacity-0" />
            <Button
              variant={"success"}
              size={"icon"}
              onClick={() => acceptFriend(request.senderId)}
              aria-label="accept friend"
              className="w-8 h-8 rounded-full hover:shadow-md hover:opacity-80"
            >
              <Check className="font-semibold text-current w-3/4 h-3/4" />
            </Button>

            <Button
              variant={"destructive"}
              size={"icon"}
              onClick={() => denyFriend(request.senderId)}
              aria-label="deny friend"
              className="w-8 h-8 rounded-full hover:shadow-md hover:opacity-80"
            >
              <X className="font-semibold text-current w-3/4 h-3/4" />
            </Button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
