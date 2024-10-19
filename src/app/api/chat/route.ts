// app/api/hello/route.js

import { interpretMessage } from '@/langchain/orchestrator';
import { NextRequest, NextResponse } from 'next/server';

// some basic types to get the API working
// 
export type Message = {
  content: string;
  timestamp: string;
  role: "assistant" | "user";
  type: "text" | "error"
}

type SendMessageRequest = {
  // we send all the messages here because state is 
  // stored on the client to avoid implementing a database
  messages: Message[];
}

// force a type of message to be sent
export async function POST(request: NextRequest) : Promise<NextResponse<Message>> {
  try {
    // Parse the incoming request's body
    const body = await request.json() as SendMessageRequest;
    const { messages } = body;

    // Return a response
    return NextResponse.json({ 
      content: await interpretMessage(messages[messages.length - 1].content),
      timestamp: new Date().toISOString(),
      role: "assistant",
      type: "text"
    });
  }
  catch (e: unknown) {
    return NextResponse.json({ 
      content: "An error occured, please try again: " + `${e}`, 
      timestamp: new Date().toISOString(), 
      role: "assistant", 
      type: "error" 
    });
  }
}
