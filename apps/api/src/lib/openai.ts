import EventEmitter from "events";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function createOpenAIStream(prompt: string) {
  const eventEmitter = new EventEmitter();

  (async () => {
    try {
      const stream = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
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
