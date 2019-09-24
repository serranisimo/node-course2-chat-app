const socketio = require('socket.io'); 
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

/**
 * socket.leave(room) --> leaves a room
 * 
 * io.emit -> sends message to everyone
 * socket.broadcast.emit -> sends message to everyone except to the sender
 * socket.emit -> sends message to sender
 * io.to(room) -> sends message to an specific user
 * socket.broadcast.to(room).emit --> sends message to everyone in the room except for the sender
 */

module.exports.socketRoutes = (server) => {
    var io = socketio(server);
    var users = new Users();

    io.on("connection", (socket) => {
        console.log("New user connected");

        socket.on('join', (params, callback) => {
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
        });

        socket.on('checkCredentials', (params, callback) => {
            if (!isRealString(params.name) || !isRealString(params.room)) {
                callback('Name and room name are required');
            } else if (users.isUserNameTaken(params.name).length > 0) {
                callback('Name is already being used');
            } else {
                callback();
            }
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
                io.to(user.room)
                    .emit('newMessage', generateMessage(user.name, msg.text)
                    );
                //callback is called to tell the client when the server processing is done
            }
            callback();
        });

        socket.on('createLocationMessage', (coords) => {
            var user = users.getUser(socket.id);
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(
                user.name, coords.latitude, coords.longitude
            ));
        });

        socket.on('fetchRomms', () => {
            socket.emit('roomsListAupdate', { rooms: users.getRooms() });
        })
    });
}
