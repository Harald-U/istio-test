var express = require('express');
var app = express();
var vers = "Version 2";

app.get('/test', function(req, res) {
    res.send(vers + "\n"); 
    console.log(vers); 
});

// Start the server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
   });
