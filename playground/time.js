var moment = require('moment');

var createdAt = new Date().getTime();
var date = moment(createdAt);
console.log(moment().format('h:mm:ss a; Do MMMM YYYY'));
console.log(date.format('h:mm:ss a; Do MMMM YYYY'));