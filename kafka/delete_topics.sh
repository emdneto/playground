#!/bin/bash
echo "Deleting topics"
kafta topic delete TEST --context local
kafta topic delete K6_EVENTS --context local

