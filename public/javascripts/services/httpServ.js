/**
 * Created by hyochan on 12/4/15.
 */
'use strict';

var resCode = {
    NO_DATA : 0,
    SUCCESS : 1,
    FAILED : 2,
    NO_REQ_PARAM : 3,
    ERR_PARAM : 4, // 정수형이어야 되는데 문자가 들어오는 경우
    ALREADY_INSERTED : 5
};

app
    .factory('httpServ', function($http){
        return{
            resCode : resCode,
            isLogged: function(){
                console.log('httpServ.isLogged');
                return $http.get('/login/isLogged');
            },
            login: function(user){
                console.log('httpServ.login');
                return $http.post('/login', user);
            },
            sendMailFindPw: function(user){
                console.log('httpServ.sendFindPwMail');
                return $http.post('/find_pw/send_mail', user);
            },
            logout: function(){
                console.log('httpServ.logout');
                return $http.get('/login/logout');
            },
            getChatOnlineUsers: function(){
                console.log('httpServ.getChatOnlineUsers');
                return $http.get('/chat/online_users');
            },
            getChats: function(){
                console.log('httpServ.getChats');
                return $http.get('/chat/get_chats');
            },
            signup: function($scope, formData){
                console.log('httpServ.signup');
                // var $promise=$http.post(httpServer + "/signup", user);
                return $http({
                    method : 'POST',
                    url : '/signup',
                    data : formData,
                    responseType : 'json',
                    transformRequest : angular.identity,  // multipart
                    headers : {'Content-Type': undefined} // multipart
                });
            },
            getProfile: function(){
                console.log('httpServ.getProfile');
                return $http({
                    method : 'GET',
                    url : '/account/profile',
                    responseType : 'json',
                    withCredentials : true
                });
            },
            updateProfile: function(formData){
                console.log('httpServ.updateProfile');
                return $http({
                    method: 'POST',
                    url: '/account/profile_update',
                    data: formData,
                    responseType : 'json',
                    transformRequest : angular.identity,
                    headers : {'Content-Type': undefined},
                    withCredentials : true
                });
            },
            updatePw: function(pw){
                console.log('httpServ.updatePw');
                return $http({
                    method: 'POST',
                    url: '/account/pw_update',
                    data: pw,
                    responseType : 'json',
                    withCredentials : true
                });
            },
            getUsers: function(){
                console.log('httpServ.getUsers');
                return $http({
                    method: 'GET',
                    url: '/member/all',
                    responseType : 'json'
                });
            },
            getBoards: function(){
                console.log('httpServ.getBoards');
                return $http.get('/board/all');
            },
            readFiles: function(number){
                console.log('httpServ.readFiles');
                return $http.get('/board/read_files/' + number);
            },
            writeBoard: function(formData){
                console.log('httpServ.writeBoard');
                return $http({
                    method: 'POST',
                    url: '/board/write',
                    data: formData,
                    responseType : 'json',
                    transformRequest : angular.identity,
                    headers : {'Content-Type': undefined},
                    withCredentials : true
                });
            },
            deleteBoard: function(number){
                console.log('httpServ.deleteBoard');
                return $http.get('/board/delete/' + number);
            },
            sendMailAbout: function(mail){
                console.log('httpServ.sendMailAbout');
                return $http.post('/about/send_mail', mail);
            }
        };
    });