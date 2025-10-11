import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
})

import  { ChatPromptTemplate } from "@langchain/core/prompts"
import { z } from "zod"

const personSchema = z.object({
  name: z
    .string()
    .describe("The name of the person"),
  hair_color: z
    .string()
    .describe("The color of the person's hair if known"),
  height_in_meters: z
    .string()
    .describe("Height measured in meters"),
})

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are an expert extraction algorithm.
    Only extract relevant information from the text.
    If you do not know the value of an attribute asked to extract,
    return null for the attribute's value.`
  ],
  ["human", "{text}"],
])

const structured_llm = llm.withStructuredOutput(personSchema);

const prompt = await promptTemplate.invoke({
  text: "Alan Smith has blond hair."
});

// const result = await structured_llm.invoke(prompt);
// console.log(result);

const dataSchema = z.object({
  people: z.array(personSchema).describe("Extracted data about people"),
});

const structured_llm2 = llm.withStructuredOutput(dataSchema);

const prompt2 = await promptTemplate.invoke({
  text: "My name is Jeff, my hair is black and i am 6 feet tall. Anna has the same color hair as me."
});

const result2 = await structured_llm2.invoke(prompt2);
console.log(result2);

