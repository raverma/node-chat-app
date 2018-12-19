var socket = io();

function scrollToBottom(){
    //selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight') ;
    var scrollTop = messages.prop('scrollTop') ;
    var scrollHeight = messages.prop('scrollHeight') ;
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if ((clientHeight + scrollTop + newMessageHeight + lastMessageHeight) >= scrollHeight) {
       messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', function() {
   var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function(err){
        if (err){
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error');
        }
    })
   
});     

// socket.emit('createEmail', {
//     to : 'jen@example.com',
//     text: 'Hey, this is Rahul'
// });

socket.on('disconnect', function() {
    document.getElementById('lblmsg').innerHTML='Disconnected from server';
});

socket.on('updateUserList', function (users){
    console.log('Users list', users);
    var ol = $('<ol></ol>');
    users.forEach(function(user) {
        var li = $('<li></li>').text(user);
        ol.append(li);
    }, this);
    $('#users').html(ol);
});

socket.on('newMessage', function(newMsg){
    funcMessage(newMsg);
    scrollToBottom();
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
    scrollToBottom();
});

socket.on('userJoined', function(msg){
    funcMessage(msg);
    scrollToBottom();
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