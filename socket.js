const {Server}  = require('socket.io');
const http = require('http')
const express = require('express')

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
  cors: {
    origin: [process.env.CLIRNT_URL],
    credentials:true
  }
})

const userIdSocketMap = {} // {userId:socketId}

function  getReciverSocketId(userId){
  return userIdSocketMap[userId];
}


io.on('connection',(socket)=>{
  console.log("A user connected",socket.id);

  const userId = socket.handshake.query.userId;
  userIdSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers",Object.keys(userIdSocketMap));

  socket.on('disconnect',()=>{

    delete userIdSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userIdSocketMap));
    console.log("A user disconnected",socket.id);
  })
})
module.exports = {io,app,server, getReciverSocketId}