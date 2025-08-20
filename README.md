
# SockRedis Broker

[English](#sockredis-broker-english) | [中文](#sockredis-broker-中文)

## SockRedis Broker (中文)

一个透明代理，能够将redis channel的消息通过socket.io 透明传输到网页。使用socket.io v4.8.1 和ioredis v5.7.0，使网页客户端可以使用sub命令订阅后端redis服务器上的消息通道。

## 系统要求

- **Node.js**: 18.0.0 或更高版本
- **Redis 服务器**: 本地或远程

## Windows环境安装Redis

在Windows环境下，可以通过以下方式安装Redis：

1. **使用Windows安装包**：
   - 访问 [Redis for Windows](https://github.com/tporadowski/redis/releases) 下载最新版本
   - 运行安装程序，按照向导完成安装
   - 安装完成后，Redis服务会自动启动

2. **使用Docker**：
   - 安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - 运行以下命令启动Redis容器：
     ```powershell
     docker run --name redis -p 6379:6379 -d redis:alpine
     ```

3. **使用WSL2（Windows Subsystem for Linux）**：
   - 安装WSL2
   - 在WSL2中安装Redis：
     ```bash
     sudo apt update
     sudo apt install redis-server
     sudo service redis-server start
     ```

## 新特性

- **依赖包更新**: 更新所有依赖包到最新版本，包括socket.io v4.8.1、ioredis v5.7.0和express v5.1.0
- **消息精确投递**: 消息只发送给订阅特定频道的客户端，提高性能和安全性
- **Redis连接池**: 使用连接池管理Redis连接，提高性能和可靠性
- **增强的错误处理**: 完善的错误处理和重连机制
- **集中配置管理**: 使用专门的配置模块管理所有配置项
- **Admin UI安全认证**: Socket.IO管理界面添加了基本认证保护

## How to use

### 环境变量设置

#### Linux/Mac环境

``` sh
# 设置后端代理的redis服务器,默认为 localhost:6379
export REDISHOST=localhost
export REDISPORT=6379
export REDISPASSWORD=  # Redis密码，默认为空
export REDISDB=0       # Redis数据库，默认为0
export REDIS_POOL_SIZE=2  # Redis连接池大小，默认为2

# 设置sockredis服务器的监听配置,默认为 0.0.0.0:3000
export LISTENHOST=0.0.0.0  # 监听地址，默认为0.0.0.0
export LISTENPORT=3000     # 监听端口，默认为3000

# Admin UI认证配置
export ADMIN_USERNAME=admin  # 管理界面用户名，默认为admin
export ADMIN_PASSWORD=      # 管理界面密码哈希，默认为"changeit"的哈希值

# 日志配置
export LOG_LEVEL=info      # 日志级别，默认为info
export LOG_CONSOLE=true    # 是否输出到控制台，默认为true
```

#### Windows环境

```powershell
# 设置后端代理的redis服务器,默认为 localhost:6379
$env:REDISHOST="localhost"
$env:REDISPORT="6379"
$env:REDISPASSWORD=""  # Redis密码，默认为空
$env:REDISDB="0"       # Redis数据库，默认为0
$env:REDIS_POOL_SIZE="2"  # Redis连接池大小，默认为2

# 设置sockredis服务器的监听配置,默认为 0.0.0.0:3000
$env:LISTENHOST="0.0.0.0"  # 监听地址，默认为0.0.0.0
$env:LISTENPORT="3000"     # 监听端口，默认为3000

# Admin UI认证配置
$env:ADMIN_USERNAME="admin"  # 管理界面用户名，默认为admin
$env:ADMIN_PASSWORD=""      # 管理界面密码哈希，默认为"changeit"的哈希值

# 日志配置
$env:LOG_LEVEL="info"      # 日志级别，默认为info
$env:LOG_CONSOLE="true"    # 是否输出到控制台，默认为true
```

或者直接运行项目中提供的PowerShell脚本：

```powershell
. .\setenv.ps1
```

### 启动sockredis broker

```sh
npm install
. ./setenv.sh
npm start
```

### 通过docker-compose启动

```sh
docker-compose up -d
```

## 客户端示例

./example目录中是测试网页的实现，参照该例子，可以迅速接入客户端。

## 测试

1. 启动sockredis
2. 打开浏览器访问 `http://localhost:3000`打开测试页面，在页面底部输入框中输入订阅的通道“test”
3. 执行测试客户端,向test通道中发布消息”Hello Sockredis！“

    ```sh
     /pub2test.sh
    ```

4. 上部页面中开始以每秒4次的速度显示 “Hello Sockredis!"
![testpage](./images/testpage.png)

5. 输入“none”命令，则停止接收所有消息。

## 监控

通过互联网，访问 `https://admin.socket.io`, 注册本地服务器 `https://localhost:3000/admin`, 将可以看到服务器状态和客户端连接情况。

> **注意**: 现在Admin UI已启用基本认证保护，默认用户名为`admin`，密码为`changeit`。可以通过环境变量`ADMIN_USERNAME`和`ADMIN_PASSWORD`修改。

![AdminUI](./images/adminUI.png)

---

## SockRedis Broker (English)

A transparent proxy that transmits messages from Redis channels to web pages via socket.io. Using socket.io v4.8.1 and ioredis v5.7.0, it allows web clients to subscribe to message channels on the backend Redis server using the sub command.

## System Requirements

- **Node.js**: 18.0.0 or higher
- **Redis Server**: Local or remote

## Installing Redis on Windows

In Windows environment, you can install Redis through the following methods:

1. **Using Windows Installation Package**:
   - Visit [Redis for Windows](https://github.com/tporadowski/redis/releases) to download the latest version
   - Run the installer and follow the wizard to complete the installation
   - After installation, the Redis service will start automatically

2. **Using Docker**:
   - Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - Run the following command to start a Redis container:
     ```powershell
     docker run --name redis -p 6379:6379 -d redis:alpine
     ```

3. **Using WSL2 (Windows Subsystem for Linux)**:
   - Install WSL2
   - Install Redis in WSL2:
     ```bash
     sudo apt update
     sudo apt install redis-server
     sudo service redis-server start
     ```

## New Features

- **Dependency Updates**: Updated all dependencies to the latest versions, including socket.io v4.8.1, ioredis v5.7.0, and express v5.1.0
- **Precise Message Delivery**: Messages are only sent to clients subscribing to specific channels, improving performance and security
- **Redis Connection Pool**: Using connection pools to manage Redis connections, improving performance and reliability
- **Enhanced Error Handling**: Comprehensive error handling and reconnection mechanisms
- **Centralized Configuration Management**: Using a dedicated configuration module to manage all configuration items
- **Admin UI Security Authentication**: Socket.IO management interface now has basic authentication protection

## How to Use

### Environment Variables Setup

#### Linux/Mac Environment

``` sh
# Set the backend proxy Redis server, default is localhost:6379
export REDISHOST=localhost
export REDISPORT=6379
export REDISPASSWORD=  # Redis password, default is empty
export REDISDB=0       # Redis database, default is 0
export REDIS_POOL_SIZE=2  # Redis connection pool size, default is 2

# Set the sockredis server listening configuration, default is 0.0.0.0:3000
export LISTENHOST=0.0.0.0  # Listening address, default is 0.0.0.0
export LISTENPORT=3000     # Listening port, default is 3000

# Admin UI authentication configuration
export ADMIN_USERNAME=admin  # Admin interface username, default is admin
export ADMIN_PASSWORD=      # Admin interface password hash, default is the hash of "changeit"

# Log configuration
export LOG_LEVEL=info      # Log level, default is info
export LOG_CONSOLE=true    # Whether to output to console, default is true
```

#### Windows Environment

```powershell
# Set the backend proxy Redis server, default is localhost:6379
$env:REDISHOST="localhost"
$env:REDISPORT="6379"
$env:REDISPASSWORD=""  # Redis password, default is empty
$env:REDISDB="0"       # Redis database, default is 0
$env:REDIS_POOL_SIZE="2"  # Redis connection pool size, default is 2

# Set the sockredis server listening configuration, default is 0.0.0.0:3000
$env:LISTENHOST="0.0.0.0"  # Listening address, default is 0.0.0.0
$env:LISTENPORT="3000"     # Listening port, default is 3000

# Admin UI authentication configuration
$env:ADMIN_USERNAME="admin"  # Admin interface username, default is admin
$env:ADMIN_PASSWORD=""      # Admin interface password hash, default is the hash of "changeit"

# Log configuration
$env:LOG_LEVEL="info"      # Log level, default is info
$env:LOG_CONSOLE="true"    # Whether to output to console, default is true
```

Or directly run the PowerShell script provided in the project:

```powershell
. .\setenv.ps1
```

### Starting the SockRedis Broker

```sh
npm install
. ./setenv.sh
npm start
```

### Starting with Docker Compose

```sh
docker-compose up -d
```

## Client Example

The ./example directory contains the implementation of a test page. By referring to this example, you can quickly integrate with the client.

## Testing

1. Start sockredis
2. Open a browser and visit `http://localhost:3000` to open the test page, enter the channel "test" in the input box at the bottom of the page
3. Run the test client to publish the message "Hello Sockredis!" to the test channel

    ```sh
     ./pub2test.sh
    ```

4. The upper part of the page will start displaying "Hello Sockredis!" at a rate of 4 times per second
![testpage](./images/testpage.png)

5. Enter the "none" command to stop receiving all messages.

## Monitoring

Through the internet, visit `https://admin.socket.io`, register the local server `https://localhost:3000/admin`, and you will be able to see the server status and client connections.

> **Note**: The Admin UI now has basic authentication protection enabled. The default username is `admin` and the password is `changeit`. You can modify them through the environment variables `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

![AdminUI](./images/adminUI.png)
