/**
 * Created by unixz on 2016-04-13.
 * 'on' 에빈트는 개별 스크립트에서 진행.
 * 'emit' 이벤트는 ioChatServ에서 진행.
 */

var socket = io.connect(SOCKET_SERVER_URL + "/ioChat");
// var socket = io.connect("http://hyochan.org:3000/ioChat");

app
    .factory('ioChatServ', function() {
        return {
            socket : socket,
            login: function (user) {
                socket.emit('login', user);
            },
            logout: function(email){
                socket.emit('logout', email);
            },
            sendChat: function(chat){
                socket.emit('chat', chat);
            }
        }
    });