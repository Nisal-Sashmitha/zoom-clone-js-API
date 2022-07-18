const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const port = 3001

const users = []

app.get('/', (req, res) => {
  res.send('hello world');
});
 
const addUser = (userName, roomId)=>{
  
  users.push({
    userName: userName,
    roomId: roomId
  })
  console.log(getRoomUsers(roomId))

}

const getRoomUsers = (roomId) =>{
  return users.filter(user=>(user.roomId == roomId))
}


const userLeave = (userName)=>{
  users = users.filter(user=> user.userName != userName)
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("join-room",({roomId, userName})=>{
    console.log('User joined room');
    console.log(roomId);
    console.log(userName);
    socket.join(roomId);
    addUser(userName,roomId)
    socket.to(roomId).emit("user connected",userName);

    io.to(roomId).emit("all-users", getRoomUsers(roomId));


    socket.on("disconnect", ()=>{
      console.log("disconnected");
      socket.leave(roomId);
      userLeave(userName)
      io.to(roomId).emit("all-users", getRoomUsers(roomId))
    })
  })
});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});