require('./config/config.js');

const path = require('path');
const express = require('express');
const app = express();
const http = require('http');

const publicPath = path.join(__dirname, "..", "public");
const routesPath = path.join(__dirname, "routes/routes.js");
const {routes} = require(routesPath);

app.use(express.static(publicPath));

// app.get('/', routes.home);

http.createServer(app).listen(process.env.PORT);
console.log(`Listening to port ${process.env.PORT}`);