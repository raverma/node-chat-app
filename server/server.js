const {generateMessage} = require('./utils/message');
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
    //when browser is closed
    socket.on('disconnect', ()=>{
        console.log('client disconnected');
    });
    

    socket.emit('welcome', generateMessage('admin','Welcome to the chat app'));

    socket.broadcast.emit('userJoined', generateMessage('admin','A new user has joined'));

    // socket.emit('newEmail',{
    //     from: 'rahul@gmail.com',
    //     text: 'Hey. How are you?',
    //     createdAt: 1233
    // });


    // socket.on('createEmail', (newEmail)=>{
    //     console.log('createEmail', newEmail);
    // });

   
    socket.on('createMessage', (message)=>{
        console.log('Message: ' + message.text + ' ..Received from ' + message.from);  
        io.emit('newMessage', generateMessage(message.from, message.text));
        
        // io.emit('newMessage',  {
        //     from: message.to,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
        // socket.broadcast.emit('newMessage',  {
        //         from: message.to,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     });
    });


});
server.listen(port, () => {
    console.log(`Started on port ${port}`);
});


//module.exports = {app};