require('./config/config.js');

const path = require('path');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname, "..", "public");
const routesPath = path.join(__dirname, "routes/routes.js");
const {routes} = require(routesPath);

var server = http.createServer(app);
var io = socketio(server);
io.on("connection",(socket)=>{
    console.log("New user connected");
    
    socket.on("disconnect", ()=>{
        console.log("Client disconnected");
    })
});

app.use(express.static(publicPath));

// app.get('/', routes.home);

server.listen(process.env.PORT, ()=>{
    console.log(`Listening to port ${process.env.PORT}`);
});