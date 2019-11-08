import app from './app'
import http from 'http'
import socketio from "socket.io";
import SocketService from "../src/services/socket.service";
const server = http.createServer(app)
const io = socketio(server);
const port = process.env.PORT || 3000

server.listen(port, () => {
  SocketService(io);
  console.log(`Api ejemplo seidor running on port ${port} - env: ${process.env.NODE_ENV}`);
})
