import http from "http";
import { WebSocketServer } from "ws";

import { PORT } from "~/env";
import { handleConnection } from "./connection-handler";

export function initWebSocketServer(
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) {
  const wss = new WebSocketServer({ server });

  wss.on("connection", handleConnection);

  console.log(`WebSocket server started running on port ${PORT}`);
}
