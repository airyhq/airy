import {ChatOpenAI} from 'langchain/chat_models/openai';
import {HumanMessage} from 'langchain/schema';
import {OpenAI} from 'langchain/llms/openai';

export class ToolkitAI {
  private static instance: ToolkitAI;

  private static model = new OpenAI({
    openAIApiKey: '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',
    maxTokens: 32000,
    temperature: 0.9,
  });

  private static chat = new ChatOpenAI({
    openAIApiKey: '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',
    maxTokens: 40000,
    streaming: true,
  });

  private constructor() {}

  public static getInstance(): ToolkitAI {
    if (!ToolkitAI.instance) {
      ToolkitAI.instance = new ToolkitAI();
    }
    return ToolkitAI.instance;
  }

  public askQuestion = async (question: string): Promise<string> => {
    //const res = await ToolkitAI.model.call(question);
    const res = 'HI'
    return new Promise(resolve => resolve(res));
  };

  public chatQuestion = async (question: string) => {
    await ToolkitAI.chat.call([new HumanMessage(question)], {
      callbacks: [
        {
          handleLLMNewToken(token: string) {
            console.log({token});
          },
        },
      ],
    });
  };
}
