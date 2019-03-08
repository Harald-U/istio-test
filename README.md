## minimal istio request routing sample on minikube

### prep

`eval $(minikube docker-env)`

#### web-api:v1

cd web-api-v1

`docker build -t web-api:v1 .`

### web-api:v1

cd web-api-v2

`docker build -t web-api:v2 .`

### deploy

cd deployment

if needed: `kubectl label namespace default istio-injection=enabled`

```
kubectl apply -f service.yaml 
kubectl apply -f deployment-v1.yaml 
kubectl apply -f deployment-v2.yaml 
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

==> everything should go thru v1 only, BUT DOESN'T
