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
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt:formattedTime
    });

    $('#messages').append(html);

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
    var formattedTime = moment(msg.createdAt).format('h:mm a');
    var template = $('#location-message-template').html();
    var html = Mustache.render(template, {
        from: msg.from,
        url: msg.url,
        createdAt:formattedTime
    });

    $('#messages').append(html);
});

$('#message-form').on('submit', function (e) {
    //prevent the default behavior of submit event
    e.preventDefault();
    var messageTextbox = $('[name=message');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, function () {
        messageTextbox.val('');
    });
});


var locationButton = $('#send-location');

locationButton.on('click', function() {
    if (!navigator.geolocation){
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        //console.log(position);
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, function() {
        locationButton.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location');
    });
});