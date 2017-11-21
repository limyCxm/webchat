var http = require('http'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server); 
    var users = [];

app.use('/', express.static(__dirname + '/www')); //指定静态HTML文件的位置
server.listen(80);

//socket部分
io.on('connection', function(socket){
    //接受并处理客户端发送的foo事件
    socket.on('login', function(nickname){
        //将消息输出到控制台
        console.log(nickname);
        if(users.indexOf(nickname) > -1){
            socket.emit('nickExisted');
        }else{
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname,users.length,'login');   //向所有链接到服务器的客户端发送当前登录用户的昵称
        }
    })
    socket.on('disconnect', function(){
        users.splice(socket.userIndex,1);
        io.sockets.emit('system', socket.nickname, users.length, 'logout')
    })
})