var express = require('express');
var app = express();
var vers = process.env.VERS;
const initTracer = require('./tracing').initTracer;
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');

const tracer = initTracer("web-api");  


app.get('/test', function(req, res) {
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);
    const span = tracer.startSpan('web-api', {
      childOf: parentSpanContext,
      tags: {[Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER}
    });

    res.send(vers + "\n"); 
    console.log(vers); 

    span.finish();    
});

// Start the server
app.listen(3001, function () {
    console.log('Example app listening on port 3000!')
   });
