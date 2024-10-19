'use client'

import { type Message } from '@/app/api/chat/route';
import React, { createContext, useState, useContext, ReactNode } from 'react'



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

const sendMessage = async (message: string) : Promise<Message> => {
  const response = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ 
      messages: [
        { 
          content: message, 
          timestamp: new Date().toISOString(), 
          role: "user" 
        }
      ] 
    }),
  })

  return response.json()
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
  const onSubmit = async (message: string) => {
    // first lets add the message to the UI
    setMessages((prev) => [
      ...prev,
      { 
        content: message,
        timestamp: new Date().toISOString(), 
        role: "user", 
        type: "text" 
      },
    ])    

    // then lets clear the input
    setInput("")

    // set the generating state to true
    setIsGenerating(true)

    // send the message to the API endpoint
    const generatedMessage = await sendMessage(message)
    
    // set the generating state to true
    setIsGenerating(false)

    // if there is a response, add it to the UI
    setMessages((prev) => [
      ...prev,
      generatedMessage
    ])
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
