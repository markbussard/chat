import { IncomingMessage } from "http";
import { WebSocket } from "ws";

import { handleMessage } from "./message-handler";

export async function handleConnection(
  ws: WebSocket,
  request: IncomingMessage
) {
  try {
    const authToken = request.headers["cookie"];
    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(
          JSON.stringify({
            type: "signal",
            data: "open"
          })
        );
        clearInterval(interval);
      }
    }, 5);

    ws.on(
      "message",
      async (message) => await handleMessage(message.toString(), ws)
    );

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  } catch (error) {
    ws.send(
      JSON.stringify({
        type: "error",
        data: "Internal server error.",
        key: "INTERNAL_SERVER_ERROR"
      })
    );
    ws.close();
  }
}
