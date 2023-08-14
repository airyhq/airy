import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import {OpenAI} from 'langchain/llms/openai';
// import { Conversation, Message } from 'model';
// import { FaissStore } from "langchain/vectorstores/faiss";
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export class ToolkitAI {
  private static instance: ToolkitAI;

  private static model = new OpenAI({
    openAIApiKey: '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',
    temperature: 0.9,
  });

  private static chat = new ChatOpenAI({
    openAIApiKey: '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',
    maxTokens: 100,
    streaming: true,
  });

  private constructor() {}

  public static getInstance(): ToolkitAI {
    if (!ToolkitAI.instance) {
      ToolkitAI.instance = new ToolkitAI();
    }
    return ToolkitAI.instance;
  }

  // public loadConversations = async (conversations: string[]) => {
  //   // Create a vector store through any method, here from texts as an example
  //   const vectorStore = await FaissStore.fromTexts(conversations,
  //     [{ id: 2 }, { id: 1 }, { id: 3 }],
  //     new OpenAIEmbeddings()
  //   );
  // };

  public askQuestion = async (question: string): Promise<string> => {
    const res = await ToolkitAI.model.call(question);
    return new Promise(resolve => resolve(res));
  };

  public chatQuestion = async (question: string) => { 
    await ToolkitAI.chat.call([new HumanMessage(question)], {
    callbacks: [
      {
        handleLLMNewToken(token: string) {
          console.log({ token });
        },
      },
    ],
    })
  };
}