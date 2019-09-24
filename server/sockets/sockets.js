const socketio = require('socket.io');

const {controllers} = require('./chatControllers');

module.exports.socketRoutes = (server) => {
    var io = socketio(server);
    io.on("connection", (socket) => {

        console.log("New user connected");

        socket.on('join', controllers.joinController(io, socket));

        socket.on('checkCredentials', controllers.checkCredentials(io, socket));

        socket.on("disconnect", controllers.disconnectController(io, socket));

        socket.on("createMessage", controllers.createMessageController(io, socket));

        socket.on('createLocationMessage', controllers.locationMessageController(io, socket));

        socket.on('fetchRomms', controllers.fetchRoomsController(io, socket))
    });
}
