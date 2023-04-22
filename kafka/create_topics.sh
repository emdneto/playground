#!/bin/bash
echo "Creating topics: TEST|K6_EVENTS..."
kafta topic create TEST --rf 3 --partitions 10 --context local
kafta topic create K6_EVENTS --rf 3 --partitions 32 --context local