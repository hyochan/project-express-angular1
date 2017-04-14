'use strict';

app
	.controller('loginCtrl', function($location, $scope, $rootScope, httpServ, funcServ, ioChatServ){
        console.log("loginCtrl");
        $scope.user = {
            auto : false,
            autoLogin : false
        };

        // 로그아웃 된거면 자동로그인 안함
        if(!$rootScope.logout && funcServ.getCookie("email") != ""){
            console.log("is not logout");
            $scope.user = {
                auto : true,
                autoLogin : true,
                email : funcServ.getCookie("email"),
                pw : funcServ.getCookie("pw")
            };
            var $promise = httpServ.login($scope.user); // call login service
            $promise.then(function(msg){
                var data = msg.data;
                $scope.isAlert = true;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        $rootScope.email = $scope.user.email;
                        ioChatServ.login($scope.user.email);
                        $scope.isSuccess = true;
                        $scope.loginAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                            ' 로그인 성공.';
                        // 여긴 이미 쿠키가 있으므로 저장 안해도 됨.
                        $location.path('/');
                        break;
                    case httpServ.resCode.NO_DATA:
                        $scope.isSuccess = false;
                        $scope.txtLogin = (data.resCode === httpServ.resCode.NO_DATA ? '해당 아이디와 암호에 대한 회원이 없습니다.' : '아이디와 비밀번호를 입력해주세요.');
                        console.log($scope.txtLogin);
                        $scope.loginAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                            $scope.txtLogin;

                        // 쿠키 지움
                        funcServ.setCookie("email", "");
                        funcServ.setCookie("pw", "");
                        break;
                    default:
                        // 쿠키 지움
                        funcServ.setCookie("email", "");
                        funcServ.setCookie("pw", "");
                        break;
                }
            });
        } else {  // 로그아웃 되었으면 쿠키 지움
            funcServ.setCookie("email", "");
            funcServ.setCookie("pw", "");
        }

        $scope.isSuccess = false;
        $scope.isAlert = false;
        $scope.alertClass = function(name){
            var className = 'hidden';
            if (name === 'default') {
                className = 'hidden';
            } else if (name === 'success') {
                className = 'alert alert-success';
            } else if (name === 'failed') {
                className = 'alert alert-danger';
            }  else if (name === 'no_req_param') {
                className = 'alert alert-warning';
            }
            return className;
        };
		// user : id, pw
		$scope.login=function(user){
			var $promise = httpServ.login(user); // call login service
            $promise.then(function(msg){
                var data = msg.data;
                $scope.isAlert = true;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        $rootScope.email = $scope.user.email;
                        ioChatServ.login($scope.user.email);

                        $scope.isSuccess = true;
                        $scope.loginAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                            ' 로그인 성공.';
                        // 쿠키 저장
                        if(data.email){
                            funcServ.setCookie("email", data.email);
                            funcServ.setCookie("pw", data.cookie);

                        }
                        $location.path('/');
                        break;
                    case httpServ.resCode.NO_DATA:
                        $scope.isSuccess = false;
                        $scope.txtLogin = (data.resCode === httpServ.resCode.NO_DATA ? '해당 아이디와 암호에 대한 회원이 없습니다.' : '아이디와 비밀번호를 입력해주세요.');
                        console.log($scope.txtLogin);
                        $scope.loginAlertHTML=
                            '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                            $scope.txtLogin;
                        break;
                }
            });
		};

		$scope.facebook_login = function (){
            $scope.isAlert = true;
            $scope.isSuccess = false;
            $scope.txtLogin = '페이스북 로그인은 아직 준비중 입니다';
            console.log($scope.txtLogin);
            $scope.loginAlertHTML=
                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                $scope.txtLogin;
        };

        $scope.google_login = function() {
            $scope.isAlert = true;
            $scope.isSuccess = false;
            $scope.txtLogin = '구글 로그인은 아직 준비중 입니다';
            console.log($scope.txtLogin);
            $scope.loginAlertHTML=
                '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                $scope.txtLogin;

        };
/*
        $scope.modal = {
			'title': 'Black Pearl 이용 안내',
			'content': 'Black Pearl 서비스를 이용하기 위해서는 계정이 필요합니다. 계정이 없으시면 회원가입을 해주세요.'
		};
*/
	});