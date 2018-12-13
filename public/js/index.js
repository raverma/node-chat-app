var socket = io();

socket.on('connect', function() {
    document.getElementById('lblmsg').innerHTML='Connected to the server';

   
});     

// socket.emit('createEmail', {
//     to : 'jen@example.com',
//     text: 'Hey, this is Rahul'
// });

socket.on('disconnect', function() {
    document.getElementById('lblmsg').innerHTML='Disconnected from server';
});

socket.on('newMessage', function(newMsg){
    funcMessage(newMsg);
});


var funcMessage = function(message) {
    var li = $('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    $("#messages").append(li);
};

socket.on('welcome', function(msg){
    funcMessage(msg);
});

socket.on('userJoined', function(msg){
    funcMessage(msg);
});

// function sendMessage(){
//     var user = document.getElementById('txtuser').value;
//     var text = document.getElementById('txtmsg').value;

//     socket.emit('createMessage', {
//         from: user,
//         text: text
//     });
// }

$('#message-form').on('submit', function (e) {
    //prevent the default behavior of submit event
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name=message').val()
    }, function () {
        console.log('asdf');
    });
});