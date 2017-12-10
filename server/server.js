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
const {
    generateMessage,
    generateLocationMessage
} = require("./utils/message");
const {
    isRealString
} = require('./utils/validation');

const {
    Users
} = require('./utils/users');

var server = http.createServer(app);
var io = socketio(server);
var users = new Users();

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room name are required')
        } else {
            //This should make rooms case insensitive
            params.room = params.room.toUpperCase();

            socket.join(params.room);
            users.removeUser(socket.id);
            users.addUser(socket.id, params.name, params.room);

            io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
            socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined`));

            socket.emit("newMessage", generateMessage( /*from*/ "Admin", /*message*/ "Wellcome to the chat app!"));
            callback();
        }
        /**
         * socket.leave(room) --> leaves a room
         * 
         * io.emit -> sends message to everyone
         * socket.broadcast.emit -> sends message to everyone except to the sender
         * socket.emit -> sends message to sender
         * io.to(room) -> sends message to an specific user
         * socket.broadcast.to(room).emit --> sends message to everyone in the room except for the sender
         */
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `The user ${user.name} has left`));
        }
    });

    socket.on("createMessage", (msg, callback) => {
        var user = users.getUser(socket.id);
        if (isRealString(msg.text) && user) {
            io.to(user.room).emit('newMessage',
                generateMessage(user.name, msg.text));
            //callback is called to tell the client when the server processing is done
        }
        callback();
    });

    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(
            user.name, coords.latitude, coords.longitude
        ))
    });
});


app.use(express.static(publicPath));

// app.get('/', routes.home);

server.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
});