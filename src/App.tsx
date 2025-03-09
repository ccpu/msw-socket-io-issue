import { io } from "socket.io-client";
import { toSocketIo } from "@mswjs/socket.io-binding";
import { ws } from "msw";
import { setupWorker } from "msw/browser";

const chat = ws.link("ws://localhost:3000");

export const handlers = [
  chat.addEventListener("connection", (connection) => {
    const io = toSocketIo(connection);

    console.log("Connected");

    io.client.on("connect", () => {
      io.client.emit("message", "Connected to the server!");
    });
  }),
];

const worker = setupWorker(...handlers);

worker
  .start({
    onUnhandledRequest(request) {
      console.log(`Oops, unhandled ${request.url}`);
    },
  })
  .then(() => {
    // const ws = new WebSocket("ws://localhost:3000");

    const socket = io("ws://localhost:3000", {
      transports: ["websocket"],
      path: "/",
    });

    socket.connect();
  });

export default function App() {
  return <div></div>;
}
