/**
 * Created by hyochan on 10/19/15.
 */
'use strict';

app
    .controller('aboutCtrl', function($scope, $location, httpServ, $route){
        // ==> START : navBar Active class 부여하기
        $scope.$route = $route;
        // <== END : navBar Active class 부여하기
        $scope.alertAbout={};
        $scope.btnClicked = false;


        $scope.sendMail = function(mail){
            $scope.btnClicked = true;
            var $promise = httpServ.sendMailAbout(mail);
            $promise.then(function(msg){
                $scope.btnClicked = false;
                var data = msg.data;
                $scope.isAlert = true;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        $scope.alertAbout.flag = 'success';
                        $scope.alertAbout.text = '메일 문의가 전달되었습니다. 감사합니다.';
                        break;
                    case httpServ.resCode.FAILED:
                        $scope.alertAbout.flag = 'failed';
                        $scope.alertAbout.text = '메일 전송 오류입니다. 다시 시도해주세요';
                        break;
                }
            });
        };
    });