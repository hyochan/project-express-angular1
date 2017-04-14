/**
 * Created by hyochan on 9/28/15.
 */
'use strict';

const storedConst = {

};

app
    .factory('storageServ', function(){
        return{
            storedConst : storedConst,
            set:function(key, value){
                return localStorage.setItem(key,value);
            },
            get:function(key){
                return localStorage.getItem(key);
            },
            destroy:function(key){
                return localStorage.removeItem(key);
            }
        };
    });