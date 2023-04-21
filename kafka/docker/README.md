# Kafka Playground environment

This environment setups Kafka, Zookeeper and some other stuff.


## How-to
```bash
docker-compose up -d
```

## Connecting to brokers
```
$ kaf node ls -b "localhost:9092"
ID    ADDRESS          CONTROLLER   
1     localhost:9092   false        
2     localhost:9093   true         
3     localhost:9094   false  
```