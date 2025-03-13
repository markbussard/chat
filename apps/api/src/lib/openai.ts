import EventEmitter from "events";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

import { MessageSender } from "@repo/db";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function createOpenAIStream(
  message: string,
  history: [MessageSender, string][]
) {
  const eventEmitter = new EventEmitter();

  (async () => {
    try {
      const messages: ChatCompletionMessageParam[] = history.map(
        ([sender, text]) => ({
          role: sender === MessageSender.USER ? "user" : "assistant",
          content: text
        })
      );

      messages.push({ role: "user", content: message });
      const stream = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true
      });

      for await (const chunk of stream) {
        const chunkContent = chunk.choices[0]?.delta?.content || "";
        eventEmitter.emit("data", {
          content: chunkContent
        });
      }

      eventEmitter.emit("end");
    } catch (error) {
      eventEmitter.emit("error", {
        error
      });
    }
  })();

  return eventEmitter;
}
