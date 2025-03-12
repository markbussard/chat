import { IncomingMessage } from "http";
import { WebSocket } from "ws";

import { createOpenSignalMessage } from "~/utils/messages";
import { handleMessage } from "./message-handler";

export async function handleConnection(
  ws: WebSocket,
  request: IncomingMessage
) {
  try {
    const authToken = request.headers["cookie"];
    const interval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(createOpenSignalMessage());
        console.debug("Web Socket connection established");
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
