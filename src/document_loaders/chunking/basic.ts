
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"; // Import the text splitter
  
  /**
   * the chunk size could potentially be a dynamic variable
   * based on the size of the document, and the number of
   * documents that are being processed
   * 
   * I played around with the chunk size and overlap to find
   * the best values for the embeddings of the specific document
   * provided
   * 
   * Chunk size also has limitations based on the model being used
   * 
   * Preformance considerations:
   * - The chunk size should be large enough to provide meaningful
   *   embeddings
   * - The chunk size should be small enough to not exceed the 
   *   maximum input size of the model
   * - The chunk overlap should be large enough to provide context
   *   for the embeddings
   * - The chunk overlap should be small enough to not duplicate
   *   context in the embeddings
   */
  export const basicChunkSplitter = (docs: Document<Record<string, any>>[], size = 500, overlap = 50) => {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: size, // Specify the maximum chunk size
      chunkOverlap: overlap, // Specify the overlap between chunks
    });
    return textSplitter.splitDocuments(docs);
  }
