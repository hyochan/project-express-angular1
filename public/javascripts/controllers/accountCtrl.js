/**
 * Created by hyochan on 11/22/15.
 */

'use strict';

app
    .controller('accountCtrl', function($scope, $rootScope, $location, httpServ){
        /**  START : navBar active Class 부여하기  **/
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기

        $("#inputPhoto").change(function(){
            if (this.files && this.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#profile-img').attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });

        $scope.getProfile = function(){
            var $promise = httpServ.getProfile();
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        var user = data.user;
                        if(data.fileChanged) user.photo += '?' + new Date().getTime();
                        $scope.user = user;
                        console.log("img : " + user.photo);
                        break;
                    default:
                        console.log("result : " + data.resCode);
                        break;
                }
            });
        };
        $scope.getProfile();

        $scope.alertProfile = {};
        $scope.updateProfile = function(){
            var formData = new FormData(document.querySelector('form#profileUpdateForm'));
            var $promise = httpServ.updateProfile(formData);
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        var user = data.user;
                        if (user.photo != undefined) {
                            console.log("photo : " + user.photo);
                            // 이미지 사이즈가 크면 즉각 반영이 안되므로 3초 준다.
                            setTimeout(
                                $scope.user.photo =  user.photo + '?' + new Date().getTime()
                            , 3000);
                        }
                        $scope.alertProfile.flag = 'success';
                        $scope.alertProfile.text = '프로필이 수정되었습니다.';
                        break;
                    default :
                        $scope.alertProfile.flag = 'danger';
                        $scope.alertProfile.text = '프로필이 수정시 문제가 발생했습니다. 다시 시도해주세요.';
                        break;
                }
            });
        };
        $scope.updatePw = function(pw){
            var $promise = httpServ.updatePw(pw);
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        $scope.alertProfile.flag = 'success';
                        $scope.alertProfile.text = '암호가 변경되었습니다.';
                        break;
                    case httpServ.resCode.NO_REQ_PARAM:
                        $scope.alertProfile.flag = 'danger';
                        $scope.alertProfile.text = '암호를 올바로 입력해주세요.';
                        break;
                    case httpServ.resCode.NO_DATA:
                        $scope.alertProfile.flag = 'danger';
                        $scope.alertProfile.text = '이전 암호가 일치하지 않습니다.';
                        break;
                    case httpServ.resCode.FAILED:
                        $scope.alertProfile.flag = 'danger';
                        $scope.alertProfile.text = '로그인 되지 않았습니다.';
                        $location.path('/login');
                    default :
                        break;
                }
            });
        };
    });
