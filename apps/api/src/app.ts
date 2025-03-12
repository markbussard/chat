import http from "http";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { PORT } from "./env";
import { startWebSocketServer } from "./websocket";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startWebSocketServer(server);

process.on("uncaughtException", (error, origin) => {
  console.error(`Uncaught Exception at ${origin}: ${error}`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});
