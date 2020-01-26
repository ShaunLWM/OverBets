import io from "socket.io-client";

const ws = io.connect("http://localhost:3001");
export default ws;
