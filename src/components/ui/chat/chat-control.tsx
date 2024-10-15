'use client'

// ive implemented a wrapper component to keep everything stateless
// ive also made story book launch on startup for your convenience
// you should be able to see the chat control component in the storybook
// under localhost:6006

import { useRef } from "react";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { ChatMessageList } from "./chat-message-list";

import {
  CornerDownLeft,
} from "lucide-react";
import { ChatInput } from "./chat-input";
import { Button } from "../button";

export type ChatControlProps = {
  /**
   * The initial loading state of the chat on first render
   */
  isGenerating: boolean;
  input: string;
  messages: { content: string; timestamp: string, role: "assistant" | "user" }[];
  onSubmit: (message: string) => void | Promise<void>;
  onChange: (text: string) => void;
};

export default function ChatControl(props: ChatControlProps) {

  const { isGenerating, input, messages, onSubmit } = props;

  const messagesRef = useRef<HTMLDivElement>(null);

  const onKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      onSubmit(input);
    }
  };

  return (
    <div>
      <ChatMessageList ref={messagesRef} className="w-full">
        {/* Messages */}
        {messages &&
          messages.map((message, index) => (
            <ChatBubble
              key={index}
              variant={message.role == "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                src=""
                fallback={message.role == "user" ? "👨🏽" : "🤖"}
              />
              <ChatBubbleMessage
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

        {/* Loading */}
        {isGenerating && (
          <ChatBubble variant="received">
            <ChatBubbleAvatar src="" fallback="🤖" />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
      </ChatMessageList>
      <div className="w-full px-4">
        <div
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={input}
            onKeyDown={onKeyDown}
            onChange={(ev) => props.onChange(ev.target.value)}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button
              disabled={!input}
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}