/**
 * Private functions
 */
function addToMessages(li){
    jQuery('#messages').append(li);
}

var socket = io();
socket.on("connect", function () {
    console.log("Connected");

    // socket.emit("createMessage", {
    //     from: "client1",
    //     text: "answer"
    // });
});

socket.on("disconnect", function () {
    console.log("Disconnected from server");
});

socket.on("newMessage", function (msg) {
    console.log("New message");
    Object.keys(msg).forEach(function (key) {
        console.log(key, `: ${msg[key]}`);
    });
    var li = jQuery('<li></li>');
    li.text(`${msg.from.toString()}: ${msg.text.toString()}`);
    addToMessages(li);
});

socket.on('newLocationMessage', function(message){
    var li = jQuery('<li></li>');
    var a = jQuery('<a>My current location</a>');
    li.text(`${message.from}: `);
    a.attr('target', 'blank');
    a.attr('href', message.url);
    li.append(a);
    addToMessages(li);
    
});

// socket.emit('createMessage', {
//     from: 'Mark',
//     text: `Hi, this is ${navigator.appVersion}`
// }, function(data){
//     console.log("Message Created", data);
// });

function createMessage(from, text) {
    socket.emit('createMessage', {
        from: from.toString(),
        text: text.toString()
    }, function (data) {
        console.log("Message Created", data);
    });
};

jQuery(document).ready(function () {

    jQuery('#message-form').on('submit', function (e) {
        console.log("Form submited!")
        e.preventDefault();
        var messageTextBox = jQuery('#text');
        socket.emit('createMessage', {
            from: "me"/**jQuery('#from').val()*/,
            text: messageTextBox.val()
        }, function (data) {
            // jQuery('#message-form')
            messageTextBox.val('');
        });
    });

    var locationButton = jQuery('#send-location');
    locationButton.click(function(){
        if(!navigator.geolocation){
            return alert("Geolocation unavailable");
        }
        locationButton.attr('disabled', true).text('Sending location...');
        navigator.geolocation.getCurrentPosition(function(location){
            locationButton.removeAttr('disabled').text('Send location');
            console.log(location);
            socket.emit('createLocationMessage', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        }, function(err){
            if(err){
                alert('Unable to fetch location');
            }            
            locationButton.removeAttr('disabled').text('Send location');
        });
    });
});