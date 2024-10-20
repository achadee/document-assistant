"use client"

import ChatControl from "@/components/ui/chat/chat-control";
// import { useChat } from "@/providers/chat";
import { useChat } from 'ai/react';

export default function Home() {
  const chat = useChat()
  return <ChatControl {...chat} />
}
