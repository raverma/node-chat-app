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

socket.on('newLocationMessage', function(msg) {
    var li = $('<li></li>');
    var a = $('<a target="_blank">My current location</a>');

    li.text(`${msg.from}:`);
    a.attr('href', msg.url);
    li.append(a);
    $('#messages').append(li);
});

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


var locationButton = $('#send-location');

locationButton.on('click', function() {
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }
    navigator.geolocation.getCurrentPosition(function(position) {
        //console.log(position);
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        alert('Unable to fetch location');
    });
});