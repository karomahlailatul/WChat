import { io } from "socket.io-client";

const URL = process.env.REACT_APP_API_SOCKET_IO;

const socket = io(URL, { autoConnect: false, transports: ["websocket"] });

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;
