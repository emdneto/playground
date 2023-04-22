#!/bin/bash

echo "Configuring kafta (~/.kafta/config) and kaf (~/.kaf/config)"
#kaf
kaf config add-cluster local -b "localhost:9092,localhost:9093,localhost:9094"
kaf config use-cluster local
#kafta
echo | kafta config set-context local --server "localhost:9092,localhost:9093,localhost:9094" --schema-registry="" > /dev/null 2>&1
kafta config use-context local