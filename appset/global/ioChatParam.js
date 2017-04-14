/**
 * Created by hyochan on 2016. 4. 13..
 */
var param = {
    CLIENTs: [],
    getUserOfSocket : function(socket_id){
        for(var i in param.CLIENTs){
            if(param.CLIENTs[i].socket_id == socket_id){
                return true;
            }
        }
        return false;
    },
    getUsers : function(){ // 접속한 아이디 불러오기
        var arr = [];
        var emails = [];
        for(var i in param.CLIENTs){
            if(emails.indexOf(param.CLIENTs[i].user.email) == -1){
                arr.push(param.CLIENTs[i].user);
                emails.push(param.CLIENTs[i].user.email);
                console.log("getUsers : " + JSON.stringify(param.CLIENTs[i].user.email));
            }
        }
        return arr;
    },
    isUserConnected: function(email){ // 똑같은 사용자가 접속현황에 뜨는 것 방지
        for(var i in param.CLIENTs){
            if(param.CLIENTs[i].user.email == email){
                return true;
            }
        }
        return false;
    },
    removeDisconnected : function(socket_id){
        for(var i in param.CLIENTs){
            if(param.CLIENTs[i].socket_id == socket_id){
                param.CLIENTs.splice(i);
            }
        }
    },
    removeLoggedout : function(email){
        for(var i in param.CLIENTs){
            if(param.CLIENTs[i].user.email == email){
                param.CLIENTs.splice(i);
            }
        }
    },
    printConnected : function(){
        console.log("socket count : " + param.CLIENTs.length + "\n" +JSON.stringify(param.CLIENTs));
    }
};

module.exports = param;