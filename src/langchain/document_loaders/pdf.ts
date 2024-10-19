import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const run = async (path: string) => {

  const docs = await convertPdfToText(path);

  return docs;
  
};


const convertPdfToText = async (path: string) => {
  const loader = new PDFLoader(path);
  const docs = await loader.load();
  console.log({ docs });

  return docs;
}

// cli execution
if (require.main === module) {
  run(process.argv[2]);
}