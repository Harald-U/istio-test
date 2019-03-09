## minimal istio request routing sample on minikube

the web-api application reads a string ("Version 1" or "Version 2") from an environment variable that is set in the deployment.yaml and returns that string when called with the URI /test:

```
curl http://192.168.99.100:31380/test
=> Version 1
curl http://192.168.99.100:31380/test
=> Version 2
```

### prep 

use docker environment of minikube

```
eval $(minikube docker-env)
```

### web-api

cd web-api

```
docker build -t web-api:1 .
```

### deploy

cd deployment

if needed: 

`kubectl label namespace default istio-injection=enabled`

```
kubectl apply -f service.yaml 
kubectl apply -f deployment.yaml 
kubectl apply -f istio-ingress.yaml 
```

### test

`while true; do curl http://192.168.99.100:31380/test; sleep 1; done`

--> accessing service web-app thru ingress gateway at nodeport 31380

==> v1 / v2 balanced

### istio

```
kubectl apply -f destinationrule.yaml
kubectl apply -f istio-svc-web-app.yaml
```

==> 80% should go thru v1, 20% thru v2, BUT IT DOESN'T
