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

socket.on('newEmail', function(Email){
    document.getElementById('lblmsg').innerHTML='New Email';

    console.log(Email);
});

socket.on('newMessage', function(newMsg){
    document.getElementById('lblmsg').innerHTML='New message received :<br /> From: ' + newMsg.from + ' <br />Message:' + newMsg.text + '<br/>';
});


socket.on('welcome', function(msg){
    document.getElementById('lblmsg').innerHTML = 'New message received :<br /> From: ' + msg.from + ' <br />Message:' + msg.text + '<br/>';
});

socket.on('userJoined', function(msg){
    document.getElementById('lblmsg').innerHTML = 'New message received :<br /> From: ' + msg.from + ' <br />Message:' + msg.text + '<br/>';
});

function sendMessage(){
    var user = document.getElementById('txtuser').value;
    var text = document.getElementById('txtmsg').value;

    socket.emit('createMessage', {
        from: user,
        text: text
    });
}

