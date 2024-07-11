"use client";

import axios from "axios";
import { FC, useRef, useState } from "react";
import { LoadingButton } from "./ui/button";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { orUndefined } from "@/lib/utils";

interface ChatInputProps {
  chatPartner: User;
  chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);

    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (e) {
      toast.error("Something went wrong. Please try again later.");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t p-4">
      <div
        onClick={() => textareaRef.current?.focus()}
        className="relative flex flex-1 overflow-hidden p-2 rounded-[26px] p shadow-sm ring-1 ring-inset ring-border focus-within:ring-primary"
      >
        <Textarea
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          ref={textareaRef}
          rows={1}
          maxRows={10}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${chatPartner.name}`}
          className="resize-none sm:leading-6 customScrollBar scrolling-touch h-full self-center"
        />
        <LoadingButton
          aria-disabled={orUndefined(!input)}
          disabled={orUndefined(!input)}
          className="self-end justify-center items-center rounded-full hover:opacity-90"
          isLoading={isLoading}
          size={"icon"}
          type="submit"
          onClick={sendMessage}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={32}
              height={32}
              fill="none"
              viewBox="0 0 32 32"
              className="icon-2xl"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                clipRule="evenodd"
              />
            </svg>
          }
        ></LoadingButton>
      </div>
    </div>
  );
};

export default ChatInput;
