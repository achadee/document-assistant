'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react'

type Message = {
  content: string;
  timestamp: string;
  role: "assistant" | "user";
}

interface ChatContextType {
  /**
   * the messages that are displayed in the chat
   */
  messages: Message[];

  /**
   * the generating state of the chat (for the bot)
   */
  isGenerating: boolean;

  /**
   * the current displayed text in the input field
   */
  input: string;

  /**
   * the function to submit a new message
   */
  onSubmit: (message: string) => void | Promise<void>;

  /**
   * the function to change the input text
   */
  onChange: (text: string) => void;

}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

interface ChatProviderProps {
  children: ReactNode
}


export function ChatProvider({ children }: ChatProviderProps) {
  /**
   * initial state of the chat
   */
  const [messages, setMessages] = useState<Message[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [input, setInput] = useState("")

  /**
   * function to submit a new message
   */
  const onSubmit = (message: string) => {
    // first lets add the message to the UI
    setMessages((prev) => [
      ...prev,
      { content: message, timestamp: new Date().toISOString(), role: "user" },
    ])    

    // then lets clear the input
    setInput("")

    // send the message to the API endpoint
    // TODO implement TRPC call here

    // set the generating state to true
    setIsGenerating(true)

  }
  /**
   * function to change the input text
   */
  const onChange = (text: string) => {
    setInput(text)
  }



  return (
    <ChatContext.Provider value={{ 
      messages, 
      input, 
      isGenerating, 
      onChange,
      onSubmit 
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)

  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
