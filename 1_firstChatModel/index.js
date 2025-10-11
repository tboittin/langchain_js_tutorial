import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
});

const messages = [
    new SystemMessage("Translate the following from English to French:"),
    new HumanMessage("Hello, how are you?")
];


// const response = await model.invoke(messages);
// console.log(response);

import { ChatPromptTemplate } from '@langchain/core/prompts';

const systemTemplate = "Translate the following from English to {language}";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"]
]);

const promptValue = await promptTemplate.invoke({
    language: "Italian",
    text: "Hello, how are you?"
});

// console.log(promptValue.toChatMessages());

const response = await model.invoke(promptValue);
console.log(response.content);