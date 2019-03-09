var express = require('express');
var app = express();
var request = require('request');

app.get('/get', function(req, res) {
    request('http://web-api.default.svc.cluster.local:3000/test', function (error, response, body) {
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode); 
    console.log('body:', body); 
    res.send("=> Frontend calling Web-API, Result:  " + body); 
    });

});

app.get('/test', function(req, res) {
    res.send("Frontend: OK\n"); 
    console.log("Frontend: OK"); 
});

// Start the server
app.listen(3000, function () {
    console.log('Example app listening on port 3001!')
   });
