
        var socket = io();
        socket.on("connect", function(){
            console.log("Connected");
            
            // socket.emit("createMessage", {
            //     from: "client1",
            //     text: "answer"
            // });
        });

        socket.on("disconnect",function (){
            console.log("Disconnected from server");
        });

        socket.on("newMessage", function(msg){
            console.log("New message");
            Object.keys(msg).forEach(function(key){
                console.log(key,`: ${msg[key]}`);
            });
            var li = jQuery('<li></li>');
            li.text(`${msg.from.toString()}: ${msg.text.toString()}`);
       
            jQuery('#messages').append(li);
        });

        socket.emit('createMessage', {
            from: 'Mark',
            text: `Hi, this is ${navigator.appVersion}`
        }, function(data){
            console.log("Message Created", data);
        });

        function createMessage(from, text){
            socket.emit('createMessage', {
                from: from.toString(),
                text: text.toString()
            }, function(data){
                console.log("Message Created", data);
            });
        }

        jQuery('#message-form').on('submit', function(e){
            console.log("Form submited!")
            e.preventDefault();
            socket.emit('createMessage', {
                from: jQuery('#from').val(),
                text: jQuery('#text').val()
            }, function(data){
                // jQuery('#message-form')
            });
        });

