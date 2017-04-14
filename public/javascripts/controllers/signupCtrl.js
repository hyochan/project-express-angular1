'use strict';

app
	.controller('signupCtrl', function($scope, $location, httpServ){

        $("#inputPhoto").change(function(){
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#profile-img').attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        $scope.msgtxt='';
        $scope.isSuccess = false;
        $scope.isAlert = false;
        $scope.signupForm = document.querySelector('form#signupForm');

        // check if pw and pwOk match
		$scope.checkPwMatch = function () {
            console.log("pw : " + $scope.user.pw + ", pwOk : " + $scope.user.pwOk);
		    if($scope.user.pw !== $scope.user.pwOk){
                $scope.isSuccess = false;
                $scope.isAlert = true;
                $scope.signupAlert=
                    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                    ' 암호가 일치하지 않습니다!';
            }else{
                $scope.isAlert = false;
            }

		};
		// user : inputEmail, inputPw, inputName, inputEmail
		$scope.signup=function(){
            var formData = new FormData($scope.signupForm);

			var $promise = httpServ.signup($scope, formData); // call signup service
            $promise.then(function(msg){
                var data = msg.data;
                if(data.resCode === httpServ.resCode.SUCCESS){
                    $scope.isSuccess = true;
                    $scope.isAlert = true;
                    $scope.signupAlert=
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        ' 회원가입이 완료되었습니다. 로그인 해주세요.';
                    // $location.path('/');
                }
                else if(data.resCode === httpServ.resCode.ALREADY_INSERTED){
                    $scope.isSuccess = false;
                    $scope.isAlert = true;
                    $scope.signupAlert=
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        ' 중복된 아이디입니다. 다른 아이디로 시도해주세요.';
                }
                else if(data.resCode === httpServ.resCode.NO_REQ_PARAM){
                    $scope.isSuccess = false;
                    $scope.isAlert = true;
                    $scope.signupAlert=
                        '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>' +
                        ' 회원정보를 모두 입력해주세요.';
                }
            });
		};
	});