import { io } from "socket.io-client";
import { toSocketIo } from "@mswjs/socket.io-binding";
import { ws } from "msw";
import { setupWorker } from "msw/browser";

const chat = ws.link("ws://localhost:3000/socket.io/");

export const handlers = [
  chat.addEventListener("connection", (connection) => {
    const io = toSocketIo(connection);

    io.client.on("connect", () => {
      io.client.emit("message", "Connected to the server!");
    });
  }),
];

const worker = setupWorker(...handlers);

worker.start().then(() => {
  // const ws = new WebSocket("ws://localhost:3000/socket.io/?EIO=4&transport=websocket");

  const socket = io("ws://localhost:3000", {
    retries: 1,
    transports: ["websocket"],
    port: 3000,
  });

  socket.connect();
});

export default function App() {
  return <div></div>;
}
