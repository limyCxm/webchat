var socket=io.connect(),//与服务器进行连接
button=document.getElementById('sendBtn'),
textArea=document.getElementById('messageInput');;
button.onclick=function(){
socket.emit('chat message', textArea.value);//发送一个名为foo的事件，并且传递一个字符串数据‘hello’
textArea.value = "";
return false;
}
window.onload = function() {
    var webchat = new WebChat();
    webchat.init();
}

//定义我们的类

var WebChat = function() {
    this.socket = null;
}


//向原型添加业务方法
WebChat.prototype = {
    init: function(){
        var that = this;
        this.socket = io.connect();
        this.socket.on('connect',function() {
            document.getElementById('info').textContent = 'get yourself a nickname';
            document.getElementById('wrapper').style.display = "block";
            document.getElementById('nickname').focus();
        })
        var that = this;
        document.getElementById('loginBtn').addEventListener('click', function() {
            var nickName = document.getElementById('nickname').value;
            console.log(nickName);
            //检查昵称输入框是否为空
            if (nickName.trim().length != 0) {
                //不为空，则发起一个login事件并将输入的昵称发送到服务器
                that.socket.emit('login', nickName);
            } else {
                //否则输入框获得焦点
                document.getElementById('nickname').focus();
            };
        }, false);

        this.socket.on('nickExisted', function() {
            document.getElementById('info').textContent = "nickname is token ,please choose another";
        })
        this.socket.on('loginSuccess', function(){
            document.getElementById('title').textContent = "welcome "+ document.getElementById('nickname').value;
            document.getElementById('shade').style.display = "none";
            document.getElementById('messageInput').focus();//让消息输入框获得焦点
        })
        this.socket.on('system', function(nickname,userCount, type){
            var msg = nickname + (type == 'login' ? ' joined' : ' left');
            var p = document.createElement('p');
            p.textContent = msg;
            document.getElementById('chats').appendChild(p);
        })

        this.socket.on('chat message', function(msg){
            var p = document.createElement('p');
            console.log(that.socket);
            p.textContent = msg;
            document.getElementById('chats').appendChild(p);
        })
    }
}