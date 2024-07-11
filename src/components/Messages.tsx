"use client";

import { pusherClient } from "@/lib/pusher";
import { cn, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { format } from "date-fns";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

const formatTimestamp = (timestamp: number) => {
  return format(timestamp, "HH:mm");
};

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  sessionImg: string | null | undefined;
  chatPartner: User;
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`));

    const messageHandler = (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    };

    pusherClient.bind("incoming-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`));
      pusherClient.unbind("incoming-message", messageHandler);
    };
  }, [chatId]);

  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto customScrollBar scrolling-touch"
    >
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;

        const hasNextMessageFromSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <MessageComp
            key={`${message.id}-${message.timestamp}`}
            image={isCurrentUser ? (sessionImg as string) : chatPartner.image}
            alignRignt={!isCurrentUser}
            showImage={hasNextMessageFromSameUser}
            message={message}
          />
        );
      })}
    </div>
  );
};

interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {
  alignRignt: boolean;
  showImage: boolean;
  image: string;
  message: Message;
}

const MessageComp: FC<MessageProps> = ({
  alignRignt,
  showImage,
  image,
  message,
}) => {
  return (
    <div
      className={cn("flex items-end gap-x-2", alignRignt && "flex-row-reverse")}
    >
      <div className={cn("relative w-6 h-6", showImage && "invisible")}>
        <Image
          fill
          src={image}
          alt="Profile picture"
          referrerPolicy="no-referrer"
          className="rounded-full"
        />
      </div>
      <span
        className={cn(
          "px-4 py-2 rounded-lg inline-block",
          !alignRignt
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
          !showImage
            ? alignRignt
              ? "rounded-br-none"
              : "rounded-bl-none"
            : null
        )}
      >
        {message.text}{" "}
        <span className="ml-2 text-xs text-muted-foreground">
          {formatTimestamp(message.timestamp)}
        </span>
      </span>
    </div>
  );
};

export default Messages;
