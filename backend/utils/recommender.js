// migrate.js
import mongoose from "mongoose";
import { pipeline } from "@xenova/transformers";


// 3. Load embedding model
const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

// 4. Generate and store embeddings
async function migrate() {
  const schemes = await Scheme.find();

  for (let scheme of schemes) {
    if (!scheme.embedding || scheme.embedding.length === 0) {
      const text = `${scheme.name}. ${scheme.description}. ${scheme.eligibility}`;
      const output = await embedder(text, { pooling: "mean", normalize: true });

      scheme.embedding = Array.from(output.data);
      await scheme.save();

      console.log(`✅ Embedded: ${scheme.name}`);
    }
  }

  console.log("🎉 Migration complete!");
  process.exit(0);
}

migrate();
