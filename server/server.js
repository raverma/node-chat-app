const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');

const socketIO = require('socket.io');
const http = require('http');

var port = process.env.PORT || 3000; 

// console.log(__dirname + '/../public');
// console.log(publicPath);

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket)=> {
    console.log('New user connected');

    socket.on('disconnect', ()=>{
        console.log('client disconnected');
    });
});

server.listen(port, () => {
    console.log(`Started on port ${port}`);
});


//module.exports = {app};