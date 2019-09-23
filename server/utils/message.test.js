var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate correct message object', ()=>{
        var messageData = {
            from: "Mwier4ölkdf",
            text: "lkjsd \"öalsdk ääöl ...,,"
        };

        var generatedMessage = generateMessage(
            messageData.from, 
            messageData.text
        );
        //Foult seeding
        // generatedMessage.from += "d";
        expect(generatedMessage).toMatchObject(messageData);
        expect(typeof generatedMessage.createdAt).toBe("number");
    })
});

describe('generate location message', () => {
    it('should generate correct location object', () => {
        var from = 'Tester der Testr';
        var latitude = Math.random() * 100;
        var longitude = Math.random() * 100;
        var url = `http://www.google.com/maps?q=${latitude},${longitude}`;
        var message = generateLocationMessage(from, latitude, longitude);
        
        expect(message).toMatchObject({from, url});
        expect(typeof message.createdAt).toBe('number');
        console.log(message.url);
    });
});