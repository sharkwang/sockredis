#!/bin/bash 

REDISHOST=localhost
REDISPORT=6379
while getopts ":h:p:" opt
do
    case ${opt} in
        h) REDISHOST=${OPTARG};;
        p) REDISPORT=${OPTARG};;
    esac
done
shift $((${OPTIND} - 1))

while true
do
    exec 5>&-
    if [ "${REDISHOST}" != "" ] && [ "${REDISPORT}" != "" ]
    then
        exec 5<>/dev/tcp/${REDISHOST}/${REDISPORT} # open fd
    else
        echo "Wrong arguments"
        exit 255
    fi
     redis-cli PUBLISH test "Hello Sockredis! :"$RANDOM > /dev/null # PUBLISH to the channel
     sleep 0.25
done