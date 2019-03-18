var express = require('express');
var app = express();
var request = require('request');
const initTracer = require('./tracing').initTracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');

const tracer = initTracer("frontend");  

app.get('/get', function(req, res) {
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers)
    const span = tracer.startSpan('frontend-get', {
        childOf: parentSpanContext,
        tags: {[Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER}
    });

    request('http://web-api:3000/test', function (error, response, body) {
//    request('http://localhost:3001/test', function (error, response, body) {
    res.send("=> Frontend calling Web-API, Result:  " + body);   
    console.log('error:', error);
    console.log('statusCode:', response && response.statusCode); 
    console.log('body:', body); 
    
    span.log({
        'event': '/get',
        'value': body
    });

    span.finish();   
    });
     
});

app.get('/test', function(req, res) {
    res.send("Frontend: OK\n"); 
    console.log("Frontend: OK"); 
});

// Start the server
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
   });
