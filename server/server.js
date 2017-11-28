require('./config/config.js');

const path = require('path');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, "..", "public");
const routesPath = path.join(__dirname, "routes/routes.js");
const {
    routes
} = require(routesPath);
const {generateMessage} = require("./utils/message");

var server = http.createServer(app);
var io = socketio(server);
io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.broadcast.emit("newMessage",
        generateMessage(
            "Admin", 
            "A new User joined!"
        )
    );

    socket.emit("newMessage",
        generateMessage("Admin",
            "Wellcome to the chat app!")
    );

    socket.on("createMessage", (msg, callback) => {        
        io.emit('newMessage', 
        generateMessage(msg.from, msg.text));
        // socket.broadcast.emit('newMessage', msg);
        callback("Greetings from the server");
    })
});


app.use(express.static(publicPath));

// app.get('/', routes.home);

server.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
});