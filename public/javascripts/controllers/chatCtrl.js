/**
 * Created by hyochan on 2016. 4. 13..
 */
app
    .controller('chatCtrl', function($scope, $rootScope, $location, httpServ, funcServ, ioChatServ, $route, $timeout){
        // ==> START : navBar Active class 부여하기
        $scope.$route = $route;
        // <== END : navBar Active class 부여하기

        console.log("login - " + $rootScope.email);

        $scope.chatQuery = {};
        $scope.chatQueryBy = '$';
        $scope.orderProp='date';

        // chat data : number, email, photo, date, name, msg
        $scope.chats = [];

        // onlines data
        $scope.onlines = [
/*            {
                name : "장효찬",
                email : "unix.zang@gmail.com"
            },
            {
                name : "조동현",
                email : "조동"
            }
*/
        ];

        $scope.sendChat = function(msg){
            var chat = {
                email : $rootScope.email,
                msg : msg
            };
            // $scope.chats.push(chat);
            ioChatServ.socket.emit('send_chat', chat);
        };

        /* TODO :
            시나리오 : 주요파일 - chatCtrl.js, ioChatServ.js, httpServ.js, www, ioChatParam

            1. 페이지가 로딩 될 때 getChat으로 httpServ를 거쳐서 채팅 내역을 불러온다.
            2. 1번과 동시에 getChatOnlineUsers로 httpServ를 거쳐서 현재 온라인된 사용자들을 불러온다. (/chat/online_users)
            3. sendChat 버튼을 누르면 send_chat 이벤트를 emit하고 채팅 내역을 서버에 저장한다. boardcast emit이므로 보낸이도 이벤트를 받는다.
            4. send_chat 이벤트를 .on 설정으로 리스닝을 한다. 이벤트를 받으면 $scope.chats 배열에 chat 를 추가한다.
            5. 채팅과로 별개로 사용자 이탈 밑 접속 현황을 관리한다. user_left, user_join 이벤트를 사용한다. 이벤트를 받았는데 이미 배열에 있는 리스트면 무시한다. 없으면 push한다.
            6. 마지막으로 app.js(angularjs 최상위) 파일에서 ioChatServ.on('send_chat'.... 로 리스닝을 하고 chat페이지가 아닌데 이벤트를 들었으면
                chat nav에 badge로 count up시켜주는 것 구현.
         */

        // 1. getChat
        var $promiseChat = httpServ.getChats();
        $scope.pad = function(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        };
        $promiseChat.then(function (msg){
            var data = msg.data;
            switch (data.resCode){
                case httpServ.resCode.SUCCESS:
                    // console.log("chats : " + JSON.stringify(data.chats));
                    for(var i in data.chats){
                        var date = new Date(data.chats[i].date);
                        data.chats[i].date =
                            $scope.pad(date.getHours())+":"+$scope.pad(date.getMinutes())+":" + $scope.pad(date.getSeconds()) +
                            ", " + $scope.pad(date.getMonth()+1)+"월 "+$scope.pad(date.getDate())+"일";
                        $scope.chats.push(data.chats[i]);
                    }
                    break;
                case httpServ.resCode.FAILED:
                    console.log("FAILED : " + data.err.toString());
                    break;
            }
        });
        // 2. getChatOnlineUsers - 소켓이 다 접속된 후에 쿼리 해야지 오류가 안생기므로 넉넉히 1초를 줌.
        $timeout(function() {
            var $promise = httpServ.getChatOnlineUsers();
            $promise.then(function (msg) {
                var data = msg.data;
                $scope.onlines = data.users;
            });
        }, 1000);

        /************************** 소켓 프로그래밍 ***********************/
        ioChatServ.socket.on('user_join', function(user){
            for(var i in $scope.onlines){
                console.log("onlines : " + JSON.stringify($scope.onlines[i]));
                if($scope.onlines[i].email == user.email){
                    return;
                }
            }
            $scope.$apply(function () {
                $scope.onlines.push(user);
            });

        });
        ioChatServ.socket.on('user_left', function(email){
            console.log("io - userLeft : " + email);
            for(var i in $scope.onlines){
                if($scope.onlines[i].email == email){
                    $scope.onlines.slice(i);
                }
            }
/*
            $scope.$apply(function(){ // 이렇게 해줘야 variable이 반영이 된다. socketio 이벤트에서 angular scope 레퍼런스가 없어지는 것 같다.
                $scope.BlueBtnRes = "이벤트 발생 - url :" + url;
            });
*/
        });
        ioChatServ.socket.on('receive_chat', function(chat){
            console.log("io - receiveChat : " + JSON.stringify(chat));
/*
            // mysql now() 시간을 변환
            var t = chat.date.split(/[- :]/);
            var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
            chat.date =
                $scope.pad(date.getHours())+":"+$scope.pad(date.getMinutes())+":" + $scope.pad(date.getSeconds()) +
                ", " + $scope.pad(date.getMonth()+1)+"월 "+$scope.pad(date.getDate())+"일";
*/
            chat.date = funcServ.getWorldTime(+9);
            $scope.$apply(function(){
                $scope.chats.push(chat);
            });
        });
    });