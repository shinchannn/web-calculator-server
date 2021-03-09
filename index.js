const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express(); // create an Express application
const server = http.createServer(app); // create a server
const io = socketio(server);

app.use(router); // call it as middleware
app.use(cors());

const ROOM = "ROOM";

io.on("connection", (socket) => {
  console.log("We have a new connection");
  // managing the specific socket that has just connected

  socket.on("join", ({}, callback) => {
    console.log("New user joined.");
    socket.join(ROOM);
    callback();
  });

  socket.on("sendRecord", ({ r, username, createdTime }, callback) => {
    io.to(ROOM).emit("record", {
      text: r,
      username: username,
      createdTime: createdTime,
    });
    callback();
  });

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`)); // make server listen on PORT
