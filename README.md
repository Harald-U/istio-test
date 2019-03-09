## Minimal Istio request routing sample on Minikube

I used this scenario to test the behaviour ingress traffic routing (used for blue/green and canary deployments). In the end it is made up of two applications: Web-API in 2 versions (v1 and v2) and a Frontend that simply passes request thru to web-api.

## Web-API

the Web-API application reads a string ("Version 1" or "Version 2") from an environment variable that is set in the deployment.yaml and returns that string when called with the URI /test:

```
curl http://192.168.99.100:31380/test
=> Version 1
curl http://192.168.99.100:31380/test
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

### Deploy

cd deployment

If needed (automatic envoy injection): 

`kubectl label namespace default istio-injection=enabled`

```
kubectl apply -f service.yaml 
kubectl apply -f deployment.yaml 
kubectl apply -f istio-ingress.yaml 
```

### Test

```
while true; do curl http://192.168.99.100:31380/test; sleep 1; done
```

--> Accessing service web-app thru ingress gateway at nodeport 31380

==> v1 / v2 balanced

### Apply Istio rules

```
kubectl apply -f destinationrule.yaml
kubectl apply -f istio-svc-web-app.yaml
```
==> Now 80% should go thru v1, 20% thru v2, **but it doesn't work!**

```
while true; do curl http://192.168.99.100:31380/test; sleep 1; done
```
![web-api only](images/web-api.png)
You can see that 100% of the traffic goes to the web-api service and although an istio virtualservice (istio-svc-web-app.yaml) is providing a 80/20 weight between v1 and v2, in reality the traffic is evenly split (50/50). Not what I would expect.


## Add Frontend

The Frontend app simply passes a GET request on /get thru to web-api /test. Result:

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

## Deploy Frontend

cd deployment

```
kubectl apply -f service-w-frontend.yaml 
kubectl apply -f deployment-w-frontend.yaml  
```


Now test by calling the GET /get URI of the frontend app:

```
while true; do curl http://192.168.99.100:31380/get; sleep 1; done
```
![fronend and web-api](images/frontend+web-api.png)
The Istio VirtualService is now working as expected: ~80% of the requests go to v1, ~20% g to v2.

