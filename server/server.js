const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');

var port = process.env.PORT || 3000; 

// console.log(__dirname + '/../public');
// console.log(publicPath);


var app = express();
app.use(express.static(publicPath));
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});


module.exports = {app};