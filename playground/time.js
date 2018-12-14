const moment = require('moment');

var today = moment();
today.add(1, 'years');
console.log(today.format('MMM Do YYYY, hh:mm:ss a'));

console.log(today.format('MMM Do YYYY, kk:m:s'));