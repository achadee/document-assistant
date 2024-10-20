import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { generateChunks } from './chunking';


const embeddingModel = openai.embedding('text-embedding-ada-002');

export const generateEmbeddings = async (
  value: string,
) => {
  const chunks = generateChunks(value);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });

  return embeddings.map((e, i) => ({ value: chunks[i], embedding: e }));
};

export const generateEmbedding = async (
  value: string,
) => {
  const { embedding } = await embed({
    model: embeddingModel,
    value,
  });
  return embedding;
};