import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
})

const call = await llm.invoke(
  [
    { role: "user", content: "Hi! I'm Bob" },
    { role: "assistant", content: "Hello Bob! How can I assist you today?" },
    { role: "user", content: "What's my name?" },
  ]
)

// console.log(call);

import {
  START,
  END,
  MessagesAnnotation,
  StateGraph,
  MemorySaver,
} from "@langchain/langgraph"

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages)
  return {
    messages: response,
  }
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END)

const memory = new MemorySaver()
const app = workflow.compile({ checkpointer: memory })

import { v4 as uuidv4 } from "uuid"

const config = { configurable: { thread_id: uuidv4() } }

const input = [
  {
    role: "user",
    content: "Hi! I'm Bob",
  }
]

const output = await app.invoke({ messages: input }, config)

// console.log(output.messages[output.messages.length - 1])

const input2 = [
  {
    role: "user",
    content: "What's my name?",
  }
]

const output2 = await app.invoke({ messages: input2 }, config)

// console.log(output2.messages[output2.messages.length - 1])

const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
const output3 = await app.invoke({ messages: input3 }, config2);
console.log(output3.messages[output3.messages.length - 1]);