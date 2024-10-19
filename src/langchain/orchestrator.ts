import { queryCollection } from "@/qdrant/client";
import { embeddings } from "./embedding_models/open_ai";
import { type Document } from "@langchain/core/documents";

export const interpretMessage = async (message: string) : Promise<string> => {

  console.log("Interpreting message");  
  // Create vectors for each chunk
  const vector = await embeddings.embedQuery(message);

  // query the collection
  const searchResult = await queryCollection(vector, 3);

  const firstPoint = searchResult.points[0]

  if (!firstPoint || firstPoint.score < 0.16) {
    return "I'm sorry, I don't understand";
  }
  
  const payload = firstPoint.payload as {
    chunk: Document<Record<string, any>>
  }

  return payload.chunk.pageContent
}