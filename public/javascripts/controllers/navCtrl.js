'use strict';

app
    .controller('navCtrl', function($scope, $rootScope, $location, $route, httpServ, ioChatServ){
        // ==> START : navBar Active class 부여하기
        $scope.$route = $route;
        console.log("navCtrl");
        $scope.isNavbarActive = function(viewLocation) {
            return viewLocation === $location.path();
        };
        // <== END : navBar Active class 부여하기

        $scope.logout=function(){
            var $promise = httpServ.logout();
            $promise.then(function(msg){
                var data = msg.data;
                if(data.resCode === httpServ.resCode.SUCCESS){
                    ioChatServ.logout($rootScope.email);
                    delete $rootScope.email;
                    $rootScope.logout = true;
                    delete $rootScope.email;
                    $location.path('/login');
                }
            });
        };

        // navbar 클릭하면 없어지게
        var navMain = $("#myNavbar");
/*
        navMain.on("click", "a", null, function () {
            navMain.collapse('hide');
        });
*/
        navMain.on('click', function(){
            if($('.navbar-toggle').css('display') !='none'){
                $(".navbar-toggle").trigger( "click" );
            }
        });
    });