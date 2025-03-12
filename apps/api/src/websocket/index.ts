import http from "http";

import { initWebSocketServer } from "./server";

export const startWebSocketServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  initWebSocketServer(server);
};
