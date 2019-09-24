const {generateMessage, generateLocationMessage} = require("../utils/message");
const {isRealString} = require('../utils/validation');

const {Users} = require('../utils/users');

var UsersChatContainer = new Users();

const joinController = function (io, socket) {
    return (params, callback) => {
        //This should make rooms case insensitive
        if (params) {
            params.room = params.room.toUpperCase();
        }
        /**Check if the requirements to access a chat are met */
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        } else if (UsersChatContainer.isUserNameTaken(params.name).length > 0) {
            return callback('Name is already being used');
        } else {//handle the join event
            socket.join(params.room);
            callback();
            UsersChatContainer.removeUser(socket.id);
            UsersChatContainer.addUser(socket.id, params.name, params.room);

            io.to(params.room).emit('updateUserList', UsersChatContainer.getUsersList(params.room));
            socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", `${params.name} has joined`));

            socket.emit("newMessage", generateMessage( /*from*/ "Admin", /*message*/ "Wellcome to the chat app!"));
            callback();
        }
    }
}

const checkCredentials = function(io, socket) {
    return (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Name and room name are required');
        } else if (UsersChatContainer.isUserNameTaken(params.name).length > 0) {
            callback('Name is already being used');
        } else {
            callback();
        }
    }
}

const disconnectController = function(io, socket) {
    return () => {
        console.log("Client disconnected");
        var user = UsersChatContainer.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', UsersChatContainer.getUsersList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `The user ${user.name} has left`));
        }
    };
}

const createMessageController = function(io, socket) {
    return (msg, callback) => {
        var user = UsersChatContainer.getUser(socket.id);
        if (isRealString(msg.text) && user) {
            io.to(user.room)
                .emit('newMessage', generateMessage(user.name, msg.text)
                );
            //callback is called to tell the client when the server processing is done
        }
        callback();
    };
}

const locationMessageController = function(io, socket){
    return (coords) => {
        var user = UsersChatContainer.getUser(socket.id);
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(
            user.name, coords.latitude, coords.longitude
        ));
    };
}

const fetchRoomsController = function (io, socket) {
    return () => {
        socket.emit('roomsListAupdate', {rooms: UsersChatContainer.getRooms()});
    };
}

module.exports = {
    controllers: {
        joinController,
        checkCredentials,
        disconnectController,
        createMessageController,
        locationMessageController,
        fetchRoomsController
    }
};
