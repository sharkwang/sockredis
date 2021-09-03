// SockRedis - A transparent broker. Transferring messages from Redis Channel transparently via socket.io. Then browser could get the realtime message.
// Author: sharkwang 
// 
// v0.1 2021/9/3

const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const httpServer = http.createServer(app);
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

// Enviornment
const port = process.env.LISTENPORT || 3000;
const redishost = process.env.REDISHOST || 'localhost';
const redisport = process.env.REDISPORT || 6379;

// Create Socket.io Server
//const io = new Server(httpServer);
const io = new Server(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"],
        credentials: true
    }
});

instrument(io, {
    auth: false
});

// Create redis server connection
const Redis = require('ioredis');
const redis = new Redis({
    host: redishost,
    port: redisport,
    reconnectOnError(err) {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
            // Only reconnect when the error contains "READONLY"
            return true; // or `return 1;`
        }
    },
});


// Server Start
httpServer.listen(port, () => {
    console.log('Sockredis server listening on *:%d', port);
});

//Server routing
app.use(express.static(path.join(__dirname, 'example')));

//SockRedis
io.on('connection', (socket) => {
    console.log('client connected');

    socket.on('disconnect', () => {
        console.log('client disconnected');
        redis.unsubscribe();
    });
    socket.on('sub', (channel) => {
        console.log('sub:' + channel);
        socket.join(channel);
        console.log("Socket Rooms:" + socket.rooms + "|" + socket.id);

        if (channel == 'none') {
            redis.unsubscribe();
            console.log("Unsubscribe successfully!");
        } else {
            redis.subscribe(channel, (err, count) => {
                if (err) {
                    console.error("Failed to subscribe: %s", err.message);
                } else {
                    console.log(
                        `Subscribed successfully! This client is currently subscribed to ${count} channels.`
                    );
                }
            });
        }

        redis.on("message", (channel, message) => {
            // console.log(`Received ${message} from ${channel}`);
            io.emit('payload', message);
        });

    });


    socket.on('payload', (msg) => {
        console.log('payload: ' + msg);
        io.emit('payload', msg);
    });

});