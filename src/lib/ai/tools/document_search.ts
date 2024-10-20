'use server';

import { queryCollection } from '@/qdrant/client';
import { generateEmbedding } from '../embedding';

export const searchDocuments = async (input: string, take = 3, skip = 0) => {
  const embedding = await generateEmbedding(input);

  console.log("Searching for:", input);

  try {
    const response = await queryCollection(embedding, 3);

    console.log("Results:", response.points.map((p) => p.payload?.value));

    if (response.points.length === 0) {
      throw new Error('No results found');
    }

    return response.points[0].payload?.value;
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'No results found';
  }
};