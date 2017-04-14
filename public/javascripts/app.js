/**
 * Created by hyochan on 10/19/15.
 */
'use strict';

/**
 * @ngdoc overview
 * @name wunttok
 * @description
 * # wunttok angular app
 *
 * Main module of the application.
 */

const SOCKET_SERVER_URL = "https://hyochan.herokuapp.com";

var app = angular.module('hyochanApp', [
    'ui.bootstrap',
    'ngAnimate',
    'ngSanitize', // ng-bind-html
    'ngRoute',
    'angularModalService',
    'angularUtils.directives.dirPagination',
    'duScroll'
]);

app
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider
            .when('/login', { // login
                templateUrl: '/login',
                controller: 'loginCtrl',
                activeTab: 'login'
            })
            .when('/signup', { // signup
                templateUrl: '/signup',
                controller: 'signupCtrl',
                activeTab: 'signup'
            })
            .when('/find_pw', { // login
                templateUrl: '/find_pw',
                controller: 'findPwCtrl',
                activeTab: 'find_pw'
            })
            .when('/', { // home
                templateUrl: '/home',
                controller: 'homeCtrl',
                activeTab: 'home'
            })
            .when('/chat', { // member
                templateUrl: '/chat',
                controller: 'chatCtrl',
                activeTab: 'chat'
            })
            .when('/member', { // member
                templateUrl: '/member',
                controller: 'memberCtrl',
                activeTab: 'member'
            })
            .when('/board', { // board
                templateUrl: '/board',
                controller: 'boardCtrl',
                activeTab: 'board'
            })
            .when('/about', { // about
                templateUrl: '/about',
                controller: 'aboutCtrl',
                activeTab: 'about'
            })
            .when('/account', { // account
                templateUrl: '/account',
                controller: 'accountCtrl',
                activeTab: 'account'
            })
            .when('/setting', { // setting
                templateUrl: '/setting',
                controller: 'settingCtrl',
                activeTab: 'setting'
            })
            .otherwise({
                redirectTo: '/',
                activeTab: 'home'
            });
    })
    .run(function($rootScope, $location, httpServ, ioChatServ){
        var routesPermission=['/signup', '/login', '/find_pw']; //route that doesn't require login
        $rootScope.$on('$routeChangeStart', function(){
            if(routesPermission.indexOf($location.path()) === -1){
                var $promise = httpServ.isLogged();
                 $promise.then(function(msg){
                     var data = msg.data;
                     console.log("디버그 : " + JSON.stringify(data));
                        if(data.resCode === httpServ.resCode.FAILED){
                            $location.path('/login');
                        } else{
                            $rootScope.email = data.email;
                            ioChatServ.login(data.email);
                        }
                 })
                 .catch(function(){
                    $location.path('/login');
                 });
            }
        });
    });
