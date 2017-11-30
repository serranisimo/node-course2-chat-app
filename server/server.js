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
const {generateMessage, generateLocationMessage} = require("./utils/message");

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
        //callback is called to tell the client when the server processing is done
        callback();
    });

    socket.on('createLocationMessage', (coords)=>{
        io.emit('newLocationMessage', generateLocationMessage(
            'Admin', coords.latitude, coords.longitude
        ))
    });
});


app.use(express.static(publicPath));

// app.get('/', routes.home);

server.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
});