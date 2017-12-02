var moment = require('moment');

function getTimeStamp(){
    // return moment().format('Do MMMM YYYY; h:mm:ss a');
    // return new Date().getTime();
    return moment().valueOf(new Date().getTime());
}

var generateMessage = function(from, text){
    return {
        from: from,
        text: text,
        createdAt: getTimeStamp()
    };
};

var generateLocationMessage = function(from, latitude, longitude){
    return {
        from,
        url: `http://www.google.com/maps?q=${latitude},${longitude}`,
        createdAt: getTimeStamp()
    };
};

module.exports = {
    generateMessage,
    generateLocationMessage
};