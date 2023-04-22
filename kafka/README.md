# Kafka Playground environment

This environment setups: 
1. Zookeeper
2. Kafka brokers -> 3, 
3. kafdrop
4. kafka-ui


## Deploy using docker-compose
### Requirements

1. docker, docker-compose
2. kaf

```bash
docker-compose up -d
```

### Validating
```
$ kaf node ls -b "localhost:9092"
ID    ADDRESS          CONTROLLER   
1     localhost:9092   false        
2     localhost:9093   true         
3     localhost:9094   false  
```

## Deploy using k8s

### How-to
```bash
To do
```


## Running load test with k6

1. Create the topic `K6_EVENTS`
```bash

```
2. Run the load test in the same network where kafka was deployed:
```bash
docker run --network kafka_default --rm -i mostafamoradian/xk6-kafka:latest run - <k6.js
```