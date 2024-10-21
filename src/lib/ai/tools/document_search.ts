'use server';

import { queryCollection } from '@/qdrant/client';
import { generateEmbedding } from '../embedding';

export const searchDocuments = async (input: string, take = 3, skip = 0) => {

  console.log('searching for:', input);

  const embedding = await generateEmbedding(input);

  try {
    const response = await queryCollection(embedding, 3);

    if (response.points.length === 0) {
      throw new Error('No results found');
    }

    return response.points.map((p) => p.payload?.value).join('\n\n');
  } catch (e) {
    if (e instanceof Error)
      return e.message.length > 0 ? e.message : 'No results found';
  }
};