import { QdrantClient } from "@qdrant/js-client-rest";
const client = new QdrantClient({ host: "vector-db", port: 6333 });

export type VectorWithMeta = {
  id: string | number,
  vector: number[],
  payload: Record<string, unknown>
}

type SupportedDistance =
  "Dot" |
  "Cosine"

const createCollection = async (
  collectionName: string, 
  vectorSize: number, 
  distance: SupportedDistance
) => {
  return await client.createCollection(collectionName, {
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

  console.log(`Querying collection ${generatedCollectionName}`, vector.length);

  return await client.query(generatedCollectionName, {
    query: vector,
    limit,
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
  const generatedCollectionName = `${collectionName}_${firstVector.vector.length}_${distance}`;

  // get the collection to see if it exists
  try {
    const collection = await client.getCollection(generatedCollectionName);
    if (!collection) {
      console.log(`Creating collection ${generatedCollectionName}`);
      await createCollection(generatedCollectionName, firstVector.vector.length, distance);
    }
  }
  catch (e) {
    console.log(`Creating collection ${generatedCollectionName}`);
    await createCollection(generatedCollectionName, firstVector.vector.length, distance);
  }

  return await client.upsert(generatedCollectionName, {
    wait: true,
    points: vectors,
  });
}

export default client;