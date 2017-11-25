
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
        });

