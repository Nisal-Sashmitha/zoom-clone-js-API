const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3001

app.get('/', (req, res) => {
  res.send('hello world');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("join-room",({roomId, userName})=>{
    console.log('User joined room');
    console.log(roomId);
    console.log(userName);
  })
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});