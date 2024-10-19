import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { paragraphSplitter } from "./chunking/paragraph";
import { v4 as uuidv4 } from 'uuid';

// we are just using Open AI embeddings for now
// it might be better to use a more general embedding model
// that is more suited for document similarity
import { embeddings } from "../langchain/embedding_models/open_ai";
import { insertVectors, type VectorWithMeta } from "../qdrant/client";

export const run = async (path: string) => {

  const docs = await convertPdfToText(path);

  /**

   * I played around with the chunk size and overlap to find
   * the best values for the embeddings of the specific document
   * provided
  */
  // const chunks = await basicChunkSplitter(docs, 1000, 200);

  // because its a legal document, we can split by paragraph
  // this might be more favorable for the embeddings
  const chunks = await paragraphSplitter(docs, 1200, 200);

  // // Create vectors for each chunk
  const vectorsPromises = chunks.map(async (chunk) => {
    const vector = await embeddings.embedQuery(chunk.pageContent);
    return vector;
  });

  // // Wait for all vectors to be created
  const vectors = await Promise.all(vectorsPromises);



  // match the vectors with the original chunks
  const vectorsWithMeta : VectorWithMeta[] = chunks.map((chunk, index) => {
    return {
      id: uuidv4(),
      vector: vectors[index],
      payload: {
        chunk,
        document: path
      },
    };
  });

  await insertVectors(vectorsWithMeta);

  return docs;
  
};


const convertPdfToText = async (path: string) => {
  const loader = new PDFLoader(path, {
    parsedItemSeparator: "",
    splitPages: false,
  });
  const docs = await loader.load();

  return docs;
}


// cli execution
if (require.main === module) {
  run(process.argv[2]);
}
