/**
 * *************************************************************************************************************
 * Help functions
 */
function addToMessages(message) {
    var html, template;
    if (!message.url) {
            template = jQuery('#message-template').html();
            html = Mustache.render(template, {
                from: message.from,
                text: message.text,
                createdAt: message.createdAt
            }
        );
    } else {
            template = jQuery('#location-message-template').html();
            html = Mustache.render(template, {
                from: message.from,
                url: message.url,
                createdAt: message.createdAt
            }
        );
    }
    jQuery('#messages').append(html);
}

function createTimeStamp(time) {
    return moment(time).format('h:mm a');
}

/**
 * ***********************************************************************************************
 * Function to handle scrolling to the bottom of the chat page
 */
function scrollToBottom(){
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight'); 
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    /**
     * Condition for scrolling to the bottom
     * First alternative: scrolls down everytime somebody writes a message
     * Second alternative: does not scroll down if the user is not under the "before last" message
     */
    var scrollingCondition;
    //****************************************************
    // First alternative
    // scrollingCondition = clientHeight + scrollTop < scrollHeight;
    //****************************************************
    // Second alternative
    scrollingCondition = scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight;
    if(scrollingCondition){
        messages.prop('scrollTop', scrollHeight - clientHeight);
    }
}
/**
 * ***********************************************************************************************
 * Socket event handlers
 */
var socket = io();
socket.on("connect", function () {
    console.log("Connected");
});

socket.on("disconnect", function () {
    console.log("Disconnected from server");
});

socket.on("newMessage", function (message) {
    message.createdAt = createTimeStamp(message.createdAt)
    addToMessages(message);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    message.createdAt = createTimeStamp(message.createdAt);
    addToMessages(message);
    scrollToBottom();
});

function createMessage(from, text) {
    socket.emit('createMessage', {
        from: from.toString(),
        text: text.toString()
    }, function (data) {
        console.log("Message Created", data);
    });
};

/**
 * 
 * ***********************************************************************************************
 * GUI events
 */
jQuery(document).ready(function () {

    jQuery('#message-form').on('submit', function (e) {
        
        e.preventDefault();
        var messageTextBox = jQuery('#text');
        socket.emit('createMessage', {
            from: "me" /**jQuery('#from').val()*/ ,
            text: messageTextBox.val()
        }, function (data) {
            // jQuery('#message-form')
            messageTextBox.val('');
        });
    });

    var locationButton = jQuery('#send-location');
    locationButton.click(function () {
        if (!navigator.geolocation) {
            return alert("Geolocation unavailable");
        }
        locationButton.attr('disabled', true).text('Sending location...');
        navigator.geolocation.getCurrentPosition(function (location) {
            locationButton.removeAttr('disabled').text('Send location');
            console.log(location);
            socket.emit('createLocationMessage', {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            })
        }, function (err) {
            if (err) {
                alert('Unable to fetch location');
            }
            locationButton.removeAttr('disabled').text('Send location');
        });
    });
});