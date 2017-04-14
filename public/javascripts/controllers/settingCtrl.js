/**
 * Created by hyochan on 11/22/15.
 */
'use strict';

app
    .controller('settingCtrl', function($scope, $rootScope, $location, httpServ) {
        /**  START : navBar active Class 부여하기  **/
        $scope.isActive = function (route) {
            return route === $location.path();
        };
    });
