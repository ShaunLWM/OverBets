import io from "socket.io-client";

const ws = io.connect("http://localhost:3003");
export default ws;
