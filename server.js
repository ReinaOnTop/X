const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const rooms = {};

io.on("connection", (socket) => {

    socket.on("join-room", ({ room, name }) => {

        if (!rooms[room]) {
            rooms[room] = [];
        }

        if (rooms[room].length >= 2) {
            socket.emit("room-full");
            return;
        }

        rooms[room].push({
            id: socket.id,
            name
        });

        socket.join(room);

        io.to(room).emit("room-users", rooms[room]);

        socket.on("send-message", (data) => {
            io.to(room).emit("receive-message", data);
        });

        socket.on("disconnect", () => {

            rooms[room] = rooms[room].filter(
                user => user.id !== socket.id
            );

            io.to(room).emit("room-users", rooms[room]);

        });

    });

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
