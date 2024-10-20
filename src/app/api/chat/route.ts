// app/api/hello/route.js

import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText, tool } from 'ai';
import z from 'zod';
import { UseChatHelpers } from 'ai/react';
import { searchDocuments } from '@/lib/ai/tools/document_search';

// some basic types to get the API working
// 
export type Message = UseChatHelpers['messages'][number]


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls. You can call tools multiple times
    to gather more information. Respond with short summarized answers of not more than 50 words unless
    the user asks for more details. If no relevant information is found in the tool calls, respond, 
    "Sorry, I don't know."`,
    messages: convertToCoreMessages(messages),
    maxSteps: 10,
    tools: {
      searchDocuments: tool({
        description: `Search documents for additional knowledge resources in the knowledge base. the response will return up to 3 results`,
        parameters: z.object({
          message: z.string().describe('The message to search for in the documents.'),
          skip: z.number().optional().describe('The number of results to skip ie pagination.'),
        }),
        execute: async ({ message }) => searchDocuments(message),
      }),
    },
  });


  return result.toDataStreamResponse();
}