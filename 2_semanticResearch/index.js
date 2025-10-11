import 'dotenv/config';

// 1 - Creating a document
import { Document } from "@langchain/core/documents";

const documents = [
    new Document({
        pageContent: "Dogs are great companions, known for their loyalty and friendliness.",
        metadata: { source: "mammal-pets-doc" },
    }),
    new Document({
        pageContent: "Cats are independent pets that often enjoy their own space.",
        metadata: { source: "mammal-pets-doc" },
    }),
];


// 2 - Loading a document
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const loader = new PDFLoader("./nke-10k-2023.pdf");

const docs = await loader.load();

// console.log(docs.length);
// console.log(docs[0].pageContent.slice(0, 200));
// console.log(docs[0].metadata);

// 3 - Splitting a document
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});

const allSplits = await splitter.splitDocuments(docs);
// console.log(allSplits.length);

// 4 - Generating embeddings
import { Embeddings } from "@langchain/core/embeddings";
import { pipeline } from '@xenova/transformers';

const generateEmbedding = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

class XenovaEmbeddings extends Embeddings {
    async embedDocuments(documents) {
      const embeddings = [];
      for (const doc of documents) {
        const output = await generateEmbedding(doc, {
          pooling: 'mean',
          normalize: true,
        });
        embeddings.push(output.data);
      }
      return embeddings;
    }
  
    async embedQuery(text) {
      const output = await generateEmbedding(text, {
        pooling: 'mean',
        normalize: true,
      });
      return output.data;
    }
}

const embeddings = new XenovaEmbeddings();

const vector1 = await generateEmbedding(allSplits[0].pageContent, { pooling: 'mean', normalize: true });
const vector2 = await generateEmbedding(allSplits[1].pageContent, { pooling: 'mean', normalize: true });

// console.assert(vector1.data.length === vector2.data.length);
// console.log(`Generated vector of length ${vector1.data.length}\n`);
// console.log(vector1.data.slice(0, 10));

import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const vectorStore = new MemoryVectorStore(embeddings);

await vectorStore.addDocuments(allSplits);

// const results = await vectorStore.similaritySearch("When was Nike incorporated?");
// console.log(results[0]);
// const results2 = await vectorStore.similaritySearchWithScore("What was Nike's revenue in 2023?");
// console.log(results2[0]);
const embedding = await embeddings.embedQuery("How were Nike's margins impacted in 2023?");
const results3 = await vectorStore.similaritySearchVectorWithScore(embedding, 1);
console.log(results3[0]);
