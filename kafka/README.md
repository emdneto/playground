# Kafka Playground environment

This environment setups: 
* Zookeeper (1)
* Kafka brokers (3)
* [kafdrop](https://github.com/obsidiandynamics/kafdrop)
* [kafka-ui](https://github.com/provectus/kafka-ui)
* Prometheus (To-do)
* Prometheus rules for alerting (To-do)
* Grafana dashboards (To-do)
* Producer and consumer apps (To-do)


## Deploy using docker-compose
### Requirements

* docker, docker-compose
* [kaf](https://github.com/birdayz/kaf)
* [kafta](https://github.com/electric-saw/kafta)

### Deploying the stack
```bash
docker-compose up -d
```


### Configuring `kaf` and `kafta` external clients
##### `kaf`
```bash
kaf config add-cluster local -b "localhost:9092,localhost:9093,localhost:9094"
```

##### `kafta`
```bash
kafta config set-context local --server "localhost:9092,localhost:9093,localhost:9094"
```


#### Verifying the list of nodes in the cluster using `kaf` and `kafta`
```bash
kaf node ls --cluster local
```

```bash
kafta cluster describe --context local 
```
#### Producing and consuming messages using `kafta`
* Creating the topic
    
    ```bash
    kafta topic create TEST --rf 3 --partitions 10 --context local
    ```

* Starting the consumer

    ```bash
    $ kafta console consumer TEST --context local
    ... Initializing Consumer with group [kafta-cli]...
    ... Consumer running, waiting for events...
    ```

* Producing

    ```bash
    $ kafta console producer TEST --context local
    >test:event
    >
    ```
* Event
    ```md
    ... Partition: 1 Key: test Message: event
    ```

## Deploy using k8s

### How-to
```bash
To do
```


## Running load test with k6
Load testing with [xk6-kafka](https://github.com/mostafa/xk6-kafka)
1. Create the topic `K6_EVENTS`
```bash
kafta topic create K6_EVENTS --rf 3 --partitions 32 --context local
```
2. Run the load test in the same network where kafka was deployed:
```bash
docker run --network kafka_default --rm -i mostafamoradian/xk6-kafka:latest run - <k6.js
```

# Useful links

[Kafka Docker for development. Kafka, Zookeeper, Schema Registry, Kafka-Connect, Landoop Tools, 20+ connectors](https://github.com/lensesio/fast-data-dev)
