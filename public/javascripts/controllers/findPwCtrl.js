'use strict';

app
    .controller('findPwCtrl', function($location, $scope, httpServ){
        console.log("findPwCtrl");
        $scope.isSuccess = false;
        $scope.isAlert = false;


        $scope.find_pw = function(user){
            console.log("user.email : " + user.email);
            var $promise = httpServ.sendMailFindPw(user);
            $promise.then(function(msg){
                var data = msg.data;
                $scope.isAlert = true;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        $scope.isSuccess = true;
                        $scope.fieldAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                            ' 메일을 보냈습니다. 확인해주세요.';
                        break;
                    case httpServ.resCode.FAILED:
                        $scope.isSuccess = false;
                        $scope.txtAlert = (data.resCode === httpServ.resCode.NO_DATA ? '해당 메일주소에 대한 회원이 없습니다.' : '메일 전송 오류입니다. 다시 시도해주세요');
                        $scope.fieldAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                            $scope.txtAlert;
                        break;
                }
            });
        };
    });