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
    
    // socket.emit("newEmail", {
    //     from: "Mike@example.com",
    //     text: "Hey, wie gehts?",
    //     createdAt: 123
    // });

    socket.emit("newMessage", {
        from: "server",
        text: "Hey, wie gehts?",
        createdAt: new Date().getTime()
    });

    
    // socket.on("createEmail", function(newEmail){
    //     console.log(`createEmail`);
    //     Object.keys(newEmail).forEach((key)=>{
    //         console.log(key, `: ${newEmail[key]}`)
    //     });
    // });

    socket.on("createMessage", (msg)=>{
        msg.completedAt= new Date().getTime();
        Object.keys(msg).forEach((key)=>{
            console.log(key, `: ${msg[key]}`)
        });
    })
});


app.use(express.static(publicPath));

// app.get('/', routes.home);

server.listen(process.env.PORT, ()=>{
    console.log(`Listening to port ${process.env.PORT}`);
});