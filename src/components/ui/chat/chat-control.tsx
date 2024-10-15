// ive implemented a wrapper component to keep everything stateless
// ive also made story book launch on startup for your convenience
// you should be able to see the chat control component in the storybook
// under localhost:6006

import { useRef } from "react";
import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from "./chat-bubble";
import { ChatMessageList } from "./chat-message-list";

import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Volume2,
} from "lucide-react";
import { ChatInput } from "./chat-input";
import { Button } from "../button";

export type ChatControlProps = {
  /**
   * The initial loading state of the chat on first render
   */
  isLoading: boolean;
  isGenerating: boolean;
  input: string;
  messages: { content: string; timestamp: string, role: "assistant" | "user" }[];
  onSubmit: (message: string) => void | Promise<void>;
  onLoadMore: () => void | Promise<void>;
};

export const ChatControl = (props: ChatControlProps) => {

  const { isLoading, isGenerating, input, messages, onSubmit, onLoadMore } = props;

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const ChatAiIcons = [
    {
      icon: CopyIcon,
      label: "Copy",
    },
    {
      icon: RefreshCcw,
      label: "Refresh",
    },
    {
      icon: Volume2,
      label: "Volume",
    },
  ];

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
                {message.role === "assistant" &&
                  messages.length - 1 === index && (
                    <div className="flex items-center mt-1.5 gap-1">
                      {!isGenerating && (
                        <>
                          {ChatAiIcons.map((icon, iconIndex) => {
                            const Icon = icon.icon;
                            return (
                              <ChatBubbleAction
                                variant="outline"
                                className="size-5"
                                key={iconIndex}
                                icon={<Icon className="size-3" />}
                                // onClick={() =>
                                //   // handleActionClick(icon.label, index)
                                // }
                              />
                            );
                          })}
                        </>
                      )}
                    </div>
                  )}
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
          ref={formRef}
          // onSubmit={(ev) => onSubmit(ev.target.value)}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <ChatInput
            value={input}
            // onKeyDown={onKeyDown}
            // onChange={handleInputChange}
            placeholder="Type your message here..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button
              disabled={!input || isLoading}
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