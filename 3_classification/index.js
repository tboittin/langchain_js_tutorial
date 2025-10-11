import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
})

import  { ChatPromptTemplate } from "@langchain/core/prompts"
import { z } from "zod"

const taggingPrompt = ChatPromptTemplate.fromTemplate(
  `Extract the desired information from the following passage.
  
  Only extract the properties mentioned in the 'Classification' function.

  Passage:
  {input}
  `
);

const classificationSchema = z.object({
  sentiment: z.string().describe("The sentiment of the text"),
  aggressiveness: z
    .number()
    .int()
    .describe("How aggressive the text is on a scale from 1 to 10"),
  language: z.string().describe("The language the text is written in"),
});

const llmWithStructureOutput = llm.withStructuredOutput(classificationSchema, {
  name: "extractor",
});

const prompt1 = await taggingPrompt.invoke({
  input:
    "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!",
});

// const result = await llmWithStructureOutput.invoke(prompt1);

// console.log(result)


const classificationSchema2 = z.object({
  sentiment: z
    .enum(["happy", "neutral", "sad"])
    .describe("The sentiment of the text"),
  aggressiveness: z
    .number()
    .int()
    .describe("describes how aggressive the statement is on a scale from 1 to 5. The higher the number the more aggressive"),
  language: z
    .enum(["spanish", "english", "french", "german", "italian", "portuguese"])
    .describe("The language the text is written in"),
});

const taggingPrompt2 = ChatPromptTemplate.fromTemplate(
  `Extract the desired information from the following passage.
  
  Only extract the properties mentioned in the 'Classification' function.

  Passage:
  {input}
  `
);

const llmWithStructuredOutput2 = llm.withStructuredOutput(classificationSchema2, {
  name: "extractor",
});

const prompt2 = await taggingPrompt2.invoke({
  input:
    "Estoy increiblemente contento de haberte conocido! Creo que seremos muy buenos amigos!"
});

// const result2 = await llmWithStructuredOutput2.invoke(prompt2);

// console.log(result2);

// const prompt3 = await taggingPrompt2.invoke({
//   input: "Estoy muy enojado con vos! Te voy a dar tu merecido!",
// });
// const results3 = await llmWithStructuredOutput2.invoke(prompt3);
// console.log(results3)

const prompt4 = await taggingPrompt2.invoke({
  input: "Weather is ok here, I can go outside without much more than a coat",
});
const result4 = await llmWithStructuredOutput2.invoke(prompt4);
console.log(result4)