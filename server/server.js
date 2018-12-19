const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js');
const {Users} = require('./utils/users');
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
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=> {
    console.log('New user connected');
    //when browser is closed
    socket.on('disconnect', ()=>{
        console.log('client disconnected');
        var user = users.removeUser(socket.id);
        console.log('user left', user);
        if (user){
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin',`${user.name} has left the room`));
        }
    });
    

    // socket.emit('welcome', generateMessage('admin','Welcome to the chat app'));

    // socket.broadcast.emit('userJoined', generateMessage('admin','A new user has joined'));
    //to join the room
    socket.on('join', (params, callback)=>{
        if (!isRealString(params.name) || !isRealString(params.room)) {
            callback('Chat name and room name cannot be blank');
        }

        socket.join(params.room);
        //first make sure to remove the user from any previous room 
        users.removeUser(socket.id);
        //add this user to the given room
        users.addUser(socket.id, params.name, params.room);
        //emit the event updateUserList
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',`${params.name} has joined`));
        callback();
    });
    // socket.emit('newEmail',{
    //     from: 'rahul@gmail.com',
    //     text: 'Hey. How are you?',
    //     createdAt: 1233
    // });


    // socket.on('createEmail', (newEmail)=>{
    //     console.log('createEmail', newEmail);
    // });

   
    socket.on('createMessage', (message, callback)=>{
        var user = users.getUser(socket.id);

        if (user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        
        callback();
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

    socket.on('createLocationMessage', (coords)=>{
        var user = users.getUser(socket.id);
        if (user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name,coords.latitude, coords.longitude));
        }
        
    });

});
server.listen(port, () => {
    console.log(`Started on port ${port}`);
});


//module.exports = {app};