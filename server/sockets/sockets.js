const socketio = require('socket.io'); 
const {
    generateMessage,
    generateLocationMessage
} = require("../utils/message");
const {
    isRealString
} = require('../utils/validation');

const {
    Users
} = require('../utils/users');

var socket, io;
var users = new Users();

module.exports.socketRoutes = (server) => {
    io = socketio(server);

    io.on("connection", (inputSocket) => {
        socket = inputSocket;
        console.log("New user connected");

        socket.on('join', joinController);

        socket.on('checkCredentials', checkCredentials);

        socket.on("disconnect", disconnectController);

        socket.on("createMessage", createMessageController);

        socket.on('createLocationMessage', locationMessageController);

        socket.on('fetchRomms', fetchRoomsController)
    });
}

const joinController  = (params, callback) => {
    //This should make rooms case insensitive
    if (params) {
        params.room = params.room.toUpperCase();
    }
    /**Check if the requirements to access a chat are met */
    if (!isRealString(params.name) || !isRealString(params.room)) {
        return callback('Name and room name are required');
    } else if (users.isUserNameTaken(params.name).length > 0) {
        return callback('Name is already being used');
    } else {//handle the join event
        socket.join(params.room);
        callback();
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined`));

        socket.emit("newMessage", generateMessage( /*from*/ "Admin", /*message*/ "Wellcome to the chat app!"));
        callback();
    }
}

const checkCredentials = (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
        callback('Name and room name are required');
    } else if (users.isUserNameTaken(params.name).length > 0) {
        callback('Name is already being used');
    } else {
        callback();
    }
}

const disconnectController = () => {
    console.log("Client disconnected");
    var user = users.removeUser(socket.id);
    if (user) {
        io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `The user ${user.name} has left`));
    }
};

const createMessageController = (msg, callback) => {
    var user = users.getUser(socket.id);
    if (isRealString(msg.text) && user) {
        io.to(user.room)
            .emit('newMessage', generateMessage(user.name, msg.text)
            );
        //callback is called to tell the client when the server processing is done
    }
    callback();
};

const locationMessageController = (coords) => {
    var user = users.getUser(socket.id);
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(
        user.name, coords.latitude, coords.longitude
    ));
};

const fetchRoomsController = () => {
    socket.emit('roomsListAupdate', { rooms: users.getRooms() });
};
