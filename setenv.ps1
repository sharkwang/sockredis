# 设置后端代理的redis服务器,默认为 127.0.0.1:6379
$env:REDISHOST="127.0.0.1"
$env:REDISPORT="6379"

# 设置sockredis服务器的监听端口,默认为 *3000
$env:LISTENPORT="3000"
$env:LISTENHOST="0.0.0.0"

# Redis密码和数据库
$env:REDISPASSWORD=""
$env:REDISDB="0"
$env:REDIS_POOL_SIZE="2"

# Admin UI认证
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="$2b$10$heqvAkYMez.Va6Et2uXInOnkCT6/uQj1brkrbyG3LpopDklcq7ZOS"

# 日志配置
$env:LOG_LEVEL="info"
$env:LOG_CONSOLE="true"

Write-Host "环境变量已设置完成"