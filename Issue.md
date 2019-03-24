
Tracing output

Deployment in Minikube, access Frontend via Ingress Gateway (port 31380):

Line 9 - 16:

app.get('/get', function(req, res) {
    const url = 'http://web-api:3000/test';
    const method = 'GET';
    const headers = {};

    console.log(req.headers);  [1]
    const parentSpanContext = tracer.extract(FORMAT_HTTP_HEADERS, req.headers);
    console.log(parentSpanContext);   [2]


Console Log shows:

[1]

{ host: '192.168.99.100:31380',
  'user-agent': 'curl/7.58.0',
  accept: '*/*',
  'x-forwarded-for': '172.17.0.1',
  'x-forwarded-proto': 'http',
  'x-request-id': 'dbf6f62a-2b16-9fa9-9b5d-182d8727f131',
  'x-b3-traceid': 'ba574306f5ae43d4',
  'x-b3-spanid': 'ba574306f5ae43d4',
  'x-b3-sampled': '1',
  'content-length': '0',
  'x-envoy-internal': 'true' }

and for [2]

SpanContext {
  _traceId: undefined,
  _spanId: undefined,
  _parentId: undefined,
  _traceIdStr: undefined,
  _spanIdStr: undefined,
  _parentIdStr: undefined,
  _flags: 0,
  _baggage: {},
  _debugId: '',
  _samplingFinalized: true }


I would expect
_traceId = x-b3-traceid
_spanId = x-b3-spanid

Why undefined?
