"use client"

import ChatControl from "@/components/ui/chat/chat-control";
import { useChat } from "@/providers/chat";

export default function Home() {
  const chat = useChat()
  return <ChatControl {...chat} />
}
