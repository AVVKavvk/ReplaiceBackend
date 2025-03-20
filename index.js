const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config("./.env");
const cookie = require("cookie-parser");

const {app,server} = require('./socket')

app.use(express.json({limit:"10mb"}))
app.use(cookie());
app.use(cors({
  origin: [process.env.CLIRNT_URL],
  credentials: true,
}));

const authRouter = require('./routes/authRouter');
const messageRouter = require('./routes/messageRouter');
const DB = require("./DB");
const PORT=process.env.PORT


app.use("/api/auth",authRouter)
app.use("/api/message",messageRouter)

server.listen(PORT, ()=>{
  DB()
  console.log(`server runing on port: ${PORT}`);
  
})