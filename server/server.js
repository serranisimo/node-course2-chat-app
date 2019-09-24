require('./config/config.js');

const path = require('path');
const express = require('express');
const app = express();
const http = require('http');

const {socketRoutes } = require('./sockets/sockets')

const publicPath = path.join(__dirname, "..", "public");

var server = http.createServer(app);

socketRoutes(server);

app.use(express.static(publicPath));

server.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
});
