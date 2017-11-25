
        var socket = io();
        socket.on("connect", function(){
            console.log("Connected");
            // socket.emit('createEmail', {
            //     to:'me@me.com',
            //     text: "oooochen"
            // });
        });

        socket.on("disconnect",function (){
            console.log("Disconnected from server");
        });

        //custom event
        // socket.on('newEmail', function(email){
        //     console.log("New email", email);
        // });

        socket.on("newMessage", function(msg){
            Object.keys(msg).forEach(function(key){
                console.log(key,`: ${msg[key]}`);
            });

            socket.emit("createMessage", {
                from: "client1",
                text: "answer"
            })
        });

