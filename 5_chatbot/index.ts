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
  Annotation,
} from "@langchain/langgraph"

import { v4 as uuidv4 } from "uuid"
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { AIMessage, HumanMessage, SystemMessage, trimMessages } from '@langchain/core/messages';

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate. Answer all questions to the best of your ability."
  ],
  [
    "placeholder",
    "{messages}"
  ],
])

const callModel = async (state: typeof MessagesAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state)
  const response = await llm.invoke(prompt)
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


const config = { configurable: { thread_id: uuidv4() } }

const input = [
  {
    role: "user",
    content: "Hi! I'm Bob",
  }
]

// const output = await app.invoke({ messages: input }, config)

// console.log(output.messages[output.messages.length - 1])

const input2 = [
  {
    role: "user",
    content: "What's my name?",
  }
]

// const output2 = await app.invoke({ messages: input2 }, config)

// console.log(output2.messages[output2.messages.length - 1])

const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
// const output3 = await app.invoke({ messages: input3 }, config2);
// console.log(output3.messages[output3.messages.length - 1]);

const config3 = { configurable: { thread_id: uuidv4() } };
const input4 = [
  {
    role: "user",
    content: "Hi! I'm Jim",
  },
];
// const output4 = await app.invoke({ messages: input4 }, config3);
// console.log(output4.messages[output4.messages.length - 1]);

const input5 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
// const output5 = await app.invoke({ messages: input5 }, config3);
// console.log(output5.messages[output5.messages.length - 1]);


const promptTemplate2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability in {language}."
  ],
  [
    "placeholder",
    "{messages}"
  ],
])

const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>()
})

const callModel2 = async (state: typeof GraphAnnotation.State) => {
  const prompt = await promptTemplate2.invoke(state)
  const response = await llm.invoke(prompt)
  return {
    messages: [response]
  }
}

const workflow2 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END)

const app2 = workflow2.compile({
  checkpointer: new MemorySaver(),
})

const config4 = { configurable: { thread_id: uuidv4() } };
const input6 = {
  messages: [

    {
      role: "user",
      content: "Hi! I'm Bob",
    }
  ],
  language: "Spanish",
}

const output6 = await app2.invoke(input6, config4)
// console.log(output6.messages[output6.messages.length - 1])
const input7 = {
  messages: [
    {
      role: "user",
      content: "What's my name?",
    }
  ]
}
// const output7 = await app2.invoke(input7, config4)
// console.log(output7.messages[output7.messages.length - 1])

const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human"
})

const messages = [
  new SystemMessage("you're a good assistant"),
  new HumanMessage("hi! I'm bob"),
  new AIMessage("hi!"),
  new HumanMessage("I like vanilla ice cream"),
  new AIMessage("nice"),
  new HumanMessage("whats 2 + 2"),
  new AIMessage("4"),
  new HumanMessage("thanks"),
  new AIMessage("no problem!"),
  new HumanMessage("having fun?"),
  new AIMessage("yes!"),
]

// const trimmed = await trimmer.invoke(messages)
// console.log(trimmed)
const promptTemplate3 = ChatPromptTemplate.fromMessages([
  [
    "placeholder",
    "{messages}"
  ],
])

const callModel3 = async (state: typeof GraphAnnotation.State) => {
  const trimmedMessages = await trimmer.invoke(state.messages)
  const prompt = await promptTemplate3.invoke({
    messages: trimmedMessages,
    language: state.language,
  })
  // console.log("///////")
  // console.log(prompt)
  const response = await llm.invoke(prompt)
  return {
    messages: [response]
  }
}

const workflow3 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel3)
  .addEdge(START, "model")
  .addEdge("model", END)

const app3 = workflow3.compile({
  checkpointer: new MemorySaver(),
})

const config5 = { configurable: { thread_id: uuidv4() } };
const input8 = {
  messages: [
    ...messages,
    new HumanMessage("What is my name?")
  ],
  language: "English",
}

// const output8 = await app3.invoke(input8, config5)
// console.log(output8.messages[output8.messages.length - 1])

const config6 = { configurable: { thread_id: uuidv4() } };
const input9 = {
  messages: [
    ...messages,
    new HumanMessage("What math problem did I ask?")
  ],
  language: "English",
}

const output9 = await app3.invoke(input9, config6)
console.log(output9.messages[output9.messages.length - 1])
