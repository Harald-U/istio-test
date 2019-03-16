## Istio Request Routing and Tracing sample on Minikube

I used this scenario to test the behaviour of Ingress traffic routing (used for blue/green and canary deployments). In the end it is made up of two applications: Web-API in 2 versions (v1 and v2) and a Frontend that simply passes request thru to web-api.

I have started to add OpenTracing / Jaeger elements to the services. Not complete, yet

## Web-API

The Web-API application reads a string ("Version 1" or "Version 2") from an environment variable that is set in the deployment yaml and returns that string when called with the URI /test:

```
curl http://192.168.99.100:[NodePort]/test
=> Version 1
curl http://192.168.99.100:[NodePort]/test
=> Version 2
```

### Preparation 

Use the docker environment of Minikube

```
eval $(minikube docker-env)
```

### Web-API

cd web-api

```
docker build -t web-api:1 .
```

## Add Frontend

The Frontend app simply passes a GET request on /get thru to web-api /test. Result with Istio Ingress deployed:

```
curl 192.168.99.100:31380/get
=> Frontend calling Web-API, Result:  => Version 1
curl 192.168.99.100:31380/get
=> Frontend calling Web-API, Result:  => Version 2
```

cd frontend

```
docker build -t frontend:1 .
```

## Deploy 

If needed (automatic envoy injection): 

`kubectl label namespace default istio-injection=enabled`

cd deployment

```
kubectl apply -f service-w-frontend.yaml 
kubectl apply -f deployment-w-frontend.yaml 
kubectl apply -f destinationrule.yaml 
kubectl apply -f istio-svc-web-api.yaml
kubectl apply -f istio-ingress-w-frontend.yaml 
```


Now test by calling the GET /get URI of the frontend app:

```
while true; do curl http://192.168.99.100:31380/get; sleep 1; done
```
![frontend and web-api](images/frontend+web-api.png)
The Istio VirtualService is working as expected: ~80% of the requests go to v1, ~20% g to v2.

