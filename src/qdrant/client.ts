import { QdrantClient } from "@qdrant/js-client-rest";
import { v4 as uuidv4 } from 'uuid';
const client = new QdrantClient({ host: "vector-db", port: 6333 });

// because tsnode its run from outside docker
const tsNodeClient = new QdrantClient({ host: "localhost", port: 6333 });

export type VectorWithMeta = {
  embedding: number[];
  value: string;
}

type SupportedDistance =
  "Dot" |
  "Cosine"

const createCollection = async (
  collectionName: string, 
  vectorSize: number, 
  distance: SupportedDistance
) => {
  return await tsNodeClient.createCollection(collectionName, {
    vectors: { size: vectorSize, distance },
  });
}

export const queryCollection = async (
  vector: number[],
  limit: number = 3
) => {
  const collectionName = process.env.QDRANT_COLLECTION_NAME || "documents";
  const distance = (process.env.QDRANT_DISTANCE || "Dot") as SupportedDistance

  const generatedCollectionName = `${collectionName}_${vector.length}_${distance}`;

  return await client.query(generatedCollectionName, {
    query: vector,
    limit,
    offset: 0,
    with_payload: true,
  });

}

export const insertVectors = async (
  vectors: VectorWithMeta[]
) => {

  // pull defaults from env
  const collectionName = process.env.QDRANT_COLLECTION_NAME || "documents";
  const distance = (process.env.QDRANT_DISTANCE || "Dot") as SupportedDistance

  const firstVector = vectors[0];

  if(!firstVector) {
    throw new Error("No vectors provided");
  }

  // generated collection name
  const generatedCollectionName = `${collectionName}_${firstVector.embedding.length}_${distance}`;

  // get the collection to see if it exists
  try {
    const collection = await tsNodeClient.getCollection(generatedCollectionName);
    if (!collection) {
      await createCollection(generatedCollectionName, firstVector.embedding.length, distance);
    }
  }
  catch (e) {
    await createCollection(generatedCollectionName, firstVector.embedding.length, distance);
  }

  return await tsNodeClient.upsert(generatedCollectionName, {
    wait: true,
    points: vectors.map(v => ({ 
      id: uuidv4(),
      vector: v.embedding, 
      payload: {
        value: v.value 
      }
    })),
  });
}

export default client;