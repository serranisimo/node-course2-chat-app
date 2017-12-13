var socket = io();

var dropDownUpdate= function(rooms){

}

socket.on('connect', function(){
    socket.emit('fetchRomms', function(err){
        console.log('Server not available');
    });
});

socket.on('roomsListAupdate', function(data){
    addToRooms(data);
})

/**
 * Handle GUI events
 */

 //select room from dropdown
jQuery(document).ready( function(){

    jQuery('#rooms_selection').on('change', function(){//feed DropDownmenu with room
        jQuery('#room_name').val(jQuery('option:selected').html());
    });

    jQuery('#login_form').on('submit', function(e){//submit event handling
        jQuery(".error").remove();//remove errors from UI
        e.preventDefault();//stop submit
        var params = {
            name:jQuery('#user_name').val(),
            room:jQuery('#room_name').val()     
         };
        socket.emit('checkCredentials', params, function(err){//check credentials
            if (err) {//if errors then add error messages to UI
                addErrorMessages(err);
                return false
            } else {//else submit
                console.log('No error by joining room');
                var form = jQuery('#login_form'); 
                form.find('#dropDown_rooms').remove();
                form.off().submit();
            }
        });
    });
});
 

/**
 * *************************************************************************************************************
 * Help functions
 */
function addToRooms(data) {
    jQuery(".room_option").remove();
    var html, template;
    template = jQuery('#message-template').html();
    data.rooms.unshift({room:""})
    html = Mustache.render(template, {
        rooms: data.rooms
    });    
    jQuery('#rooms_selection').append(html);
}

function addErrorMessages(data) {
    jQuery(".error").remove();
    var html, template;
    template = jQuery('#error-template').html();
    html = Mustache.render(template, {
        error: data
    });    
    jQuery('#errors').append(html);
}