'use client'

// ive implemented a wrapper component to keep everything stateless
// ive also made story book launch on startup for your convenience
// you should be able to see the chat control component in the storybook
// under localhost:6006

import { ChangeEvent, useRef } from "react";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { ChatMessageList } from "./chat-message-list";

import {
  CornerDownLeft,
} from "lucide-react";
import { ChatInput } from "./chat-input";
import { Button } from "../button";
import { Message } from "@/app/api/chat/route";
import { ChatRequestOptions } from "ai";

export type ChatControlProps = {
  /**
   * The initial loading state of the chat on first render
   */
  input: string;
  messages: Message[];
  handleSubmit: (event?: { preventDefault?: (() => void) | undefined; } | undefined, chatRequestOptions?: ChatRequestOptions | undefined) => void;
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement> ) => void;
  isGenerating?: boolean;
};

export default function ChatControl(props: ChatControlProps) {

  const { input, messages, handleSubmit, isGenerating, handleInputChange } = props;

  const messagesRef = useRef<HTMLDivElement>(null);

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
                fallback={message ? "🤖" : "👨🏽"}
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
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={input}
            onChange={handleInputChange}
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
        </form>
      </div>
    </div>
  );
}