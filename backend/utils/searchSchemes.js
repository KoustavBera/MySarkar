// utils/vectorSearch.js
import { MongoClient } from "mongodb";
import { pipeline } from "@xenova/transformers";

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Lazy load embedder
let embedder = null;
async function initEmbedder() {
	if (!embedder) {
		embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
	}
	return embedder;
}

// Local embeddings generator
async function getEmbeddings(text) {
	const model = await initEmbedder();
	const output = await model(text, {
		pooling: "mean",
		normalize: true,
	});
	return Array.from(output.data); // convert to plain array
}

// Vector search in MongoDB Atlas
export async function vectorSearch(queryText) {
	try {
		await client.connect();
		const db = client.db("MyScheme");
		const collection = db.collection("unique_schemes");

		// 1. Embed the search query locally
		const queryEmbedding = await getEmbeddings(queryText);

		// 2. Run MongoDB Atlas Vector Search
		const results = await collection
			.aggregate([
				{
					$vectorSearch: {
						queryVector: queryEmbedding,
						path: "embedding", // must match your DB field
						numCandidates: 200,
						limit: 5,
						index: "default",
					},
				},
				{
					$project: {
						embedding: 0, // exclude heavy embedding field
						score: { $meta: "vectorSearchScore" },
					},
				},
			])
			.toArray();

		return results;
	} catch (err) {
		console.error(err);
		return { error: err.message };
	} finally {
		await client.close();
	}
}
