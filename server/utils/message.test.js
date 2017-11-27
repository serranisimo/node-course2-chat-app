var expect = require('expect');

var {generateMessage} = require('./message');

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