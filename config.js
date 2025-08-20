/**
 * 配置管理模块
 * 集中管理应用程序的所有配置项
 */

const config = {
    // 服务器配置
    server: {
        port: process.env.LISTENPORT || 3000,
        host: process.env.LISTENHOST || '0.0.0.0'
    },
    
    // Redis配置
    redis: {
        host: process.env.REDISHOST || 'localhost',
        port: parseInt(process.env.REDISPORT || '6379'),
        password: process.env.REDISPASSWORD || '',
        db: parseInt(process.env.REDISDB || '0'),
        poolSize: parseInt(process.env.REDIS_POOL_SIZE || '2'),
        retryStrategy: (times) => {
            const delay = Math.min(times * 100, 3000);
            return delay;
        },
        maxRetriesPerRequest: 3
    },
    
    // Socket.IO配置
    socketio: {
        cors: {
            origin: ["https://admin.socket.io"],
            credentials: true
        },
        adminUI: {
            auth: {
                type: "basic",
                username: process.env.ADMIN_USERNAME || "admin",
                password: process.env.ADMIN_PASSWORD || "$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS" // "changeit"
            }
        }
    },
    
    // 日志配置
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        console: process.env.LOG_CONSOLE !== 'false'
    }
};

// 验证必要的配置项
function validateConfig() {
    // 验证Redis配置
    if (!config.redis.host) {
        throw new Error('Redis host is required');
    }
    
    if (isNaN(config.redis.port) || config.redis.port <= 0 || config.redis.port > 65535) {
        throw new Error('Invalid Redis port');
    }
    
    // 验证服务器配置
    if (isNaN(config.server.port) || config.server.port <= 0 || config.server.port > 65535) {
        throw new Error('Invalid server port');
    }
    
    return true;
}

// 导出前验证配置
validateConfig();

module.exports = config;