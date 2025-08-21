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

// 导入配置模块
const config = require('./config');

// 创建Socket.io服务器
const io = new Server(httpServer, config.socketio.cors);

// 配置Socket.io Admin UI
instrument(io, {
    auth: config.socketio.adminUI.auth
});

// Redis连接配置
const Redis = require('ioredis');
const redisOptions = {
    ...config.redis,
    reconnectOnError(err) {
        console.error(`Redis connection error: ${err.message}`);
        // 重连所有错误，不仅仅是READONLY
        return true;
    },
    // 确保密码为空字符串时不传递密码参数
    password: config.redis.password || undefined,
};

// 创建Redis连接池
class RedisPool {
    constructor(options, poolSize = 2) {
        this.options = options;
        this.poolSize = poolSize;
        this.index = 0;
        this.clients = [];
        this.initialize();
    }

    initialize() {
        // 创建连接池
        for (let i = 0; i < this.poolSize; i++) {
            const client = new Redis(this.options);
            
            // 添加事件监听
            client.on('error', (err) => {
                console.error(`Redis client ${i} error: ${err.message}`);
            });
            
            client.on('connect', () => {
                console.log(`Redis client ${i} connected to ${this.options.host}:${this.options.port}`);
            });
            
            client.on('reconnecting', (time) => {
                console.log(`Redis client ${i} reconnecting... attempt: ${time}`);
            });
            
            client.on('close', () => {
                console.log(`Redis client ${i} connection closed`);
            });
            
            this.clients.push(client);
        }
    }

    // 获取连接池中的一个客户端（轮询方式）
    getClient() {
        const client = this.clients[this.index];
        this.index = (this.index + 1) % this.poolSize;
        return client;
    }

    // 获取专用于订阅的客户端（固定使用第一个客户端）
    getSubscriber() {
        return this.clients[0];
    }

    // 获取专用于发布的客户端（固定使用第二个客户端，如果有的话）
    getPublisher() {
        return this.clients[Math.min(1, this.poolSize - 1)];
    }

    // 关闭所有连接
    quitAll() {
        return Promise.all(this.clients.map(client => client.quit()));
    }
}

// 创建Redis连接池实例
const redisPool = new RedisPool(redisOptions, 2);

// 获取专用于订阅的Redis客户端
const redis = redisPool.getSubscriber();

// 获取专用于发布的Redis客户端（如果需要发布消息）
const redisPublisher = redisPool.getPublisher();

// 进程退出时关闭所有Redis连接
process.on('SIGINT', async () => {
    console.log('Closing all Redis connections...');
    await redisPool.quitAll();
    process.exit(0);
});


// Server Start
httpServer.listen(config.server.port, config.server.host, () => {
    console.log('Sockredis server listening on %s:%d', config.server.host, config.server.port);
});

//Server routing
app.use(express.static(path.join(__dirname, 'example')));

// 健康检查端点
app.get('/health', (req, res) => {
    // 检查Redis连接状态
    const redisStatus = redis.status;
    if (redisStatus === 'ready' || redisStatus === 'connecting') {
        res.status(200).json({
            status: 'healthy',
            redis: redisStatus,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(503).json({
            status: 'unhealthy',
            redis: redisStatus,
            timestamp: new Date().toISOString()
        });
    }
});

//SockRedis
// 全局设置一次Redis消息监听器，避免重复添加
redis.on("message", (channel, message) => {
    // console.log(`Received ${message} from ${channel}`);
    io.to(channel).emit('payload', message);
});

io.on('connection', (socket) => {
    console.log('client connected');
    // 存储该客户端订阅的频道
    const subscribedChannels = new Set();

    socket.on('disconnect', () => {
        console.log('client disconnected');
        // 只取消该客户端订阅的频道
        subscribedChannels.forEach(channel => {
            socket.leave(channel);
        });
        subscribedChannels.clear();
    });

    socket.on('sub', (channel) => {
        console.log('sub:' + channel);
        
        // 处理取消订阅所有频道的情况
        if (channel === 'none') {
            // 取消该客户端的所有订阅
            subscribedChannels.forEach(ch => {
                socket.leave(ch);
            });
            subscribedChannels.clear();
            console.log("Unsubscribed from all channels successfully!");
            return;
        }
        
        // 加入新频道
        socket.join(channel);
        subscribedChannels.add(channel);
        console.log(`Socket ${socket.id} joined room: ${channel}`);
        
        // 确保Redis订阅该频道
        redis.subscribe(channel, (err, count) => {
            if (err) {
                console.error("Failed to subscribe: %s", err.message);
                socket.emit('error', `Failed to subscribe: ${err.message}`);
            } else {
                console.log(
                    `Subscribed successfully! Redis is currently subscribed to ${count} channels.`
                );
            }
        });
    });

    socket.on('payload', (msg) => {
        console.log('payload: ' + msg);
        // 只发送给该客户端所在的房间/频道
        subscribedChannels.forEach(channel => {
            io.to(channel).emit('payload', msg);
        });
    });

});