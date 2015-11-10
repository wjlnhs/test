/**
 * Created by chenshanlian on 2015/1/22.
 */
define(function(require,exports){

    var initSocket = function(option) {
       // console.log('initSocket');
        //console.log(option);
        //如果已经初始化，则不进行后续操作
        if(!!window.socket_initd){
            return;
        }

        window.socket_initd = true;
        var _option = option || {};
        var _roomId = _option.roomId,
            _url = _option.url||'',
            _location = location,
            _msgCallback = _option.callback;

        if(!_roomId){
            throw  new Error('请提供roomId');
            return;
        }

        //_url = _location.protocol+'//'+_location.host;  //i8_session.socket;//
        var _host = _location.host;
        var _host_arr = _host.split('.');
        _host_arr.shift();
        _url = _location.protocol+'//socketiopc.'+_host_arr.join('.');
        if(!_url) {
            throw new Error('请提供url');
            return;
        }

        //指示浏览器连接位于http://127.0.0.1:3000的SocketIO服务器
        var socket = null;
        try {
            socket = io.connect(_url);
        }catch(e){
            throw e.message;
        }


        //客户端监听push message事件,这是服务器端广播的,广播给除了发送消息的浏览器之外的全部浏览器
        socket.on('message', function (data) {

            var _data = data || {};
            //console.log(_data);
            if(typeof _msgCallback === 'function'){
                _msgCallback(_data);
            }

        });

        socket.emit('unsubscribe',{"room": _roomId});

        socket.emit('subscribe', {"room": _roomId});

    }

    exports.initSocket = initSocket;
});

