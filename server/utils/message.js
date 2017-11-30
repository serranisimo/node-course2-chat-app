var generateMessage = function(from, text){
    return {
        from: from,
        text: text,
        createdAt: new Date().getTime()
    };
};

var generateLocationMessage = function(from, latitude, longitude){
    return {
        from,
        url: `http://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};