import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// we are just using Open AI embeddings for now
// it might be better to use a more general embedding model
// that is more suited for document similarity
import { generateEmbeddings } from "../ai/embedding";
import { insertVectors } from "../../qdrant/client";

export const run = async (path: string) => {

  const docs = await convertPdfToText(path);

  /**
    simple chunk by paragraph
  */
  const embeddings = await generateEmbeddings(docs[0].pageContent);

  await insertVectors(embeddings);

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
