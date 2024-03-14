"use strict";

const Message = require("../models/message");

module.exports = (io) => {
  io.on("connection", (client) => {
    console.log("new connection");

    Message.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .then((messages) => {
        client.emit("load all messages", messages.reverse());
      });

    client.on("message", (data) => {
      const messageAttributes = {
        content: data.content,
        userName: data.userName,
        user: data.user
      };
      Message.create(messageAttributes).then(() => {
        io.emit("message", messageAttributes);
        client.broadcast.emit('new message')
        console.log("there's a message");
      });
    });

    client.on("disconnect", () => {
      client.broadcast.emit("user disconnected");
      console.log("user disconnected");
    });
  });
};
