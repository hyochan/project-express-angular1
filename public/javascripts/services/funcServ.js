/**
 * Created by hyochan on 2016. 4. 9..
 */
app
    .factory('funcServ', function() {
        return {
            setCookie: function (name, value, expireDays) {
                var todayDate = new Date();
                if (expireDays == null){
                    expireDays = 30;
                }
                // 쿠키가 저장될 기간을 설정 하루면 1을 입력.
                todayDate.setDate( todayDate.getDate() + expireDays );
                document.cookie = name + "=" + encodeURIComponent( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";";

            },
            getCookie: function (name) {
                var nameOfCookie = name + "=";
                var x = 0;
                while ( x <= document.cookie.length ){
                    var y = (x+nameOfCookie.length);
                    if ( document.cookie.substring( x, y ) == nameOfCookie ) {
                        if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
                            endOfCookie = document.cookie.length;
                        return decodeURIComponent( document.cookie.substring( y, endOfCookie ) );
                    }
                    x = document.cookie.indexOf( " ", x ) + 1;
                    if ( x == 0 )
                        break;
                }
                return "";
            },
            getWorldTime: function (tzOffset) {
                var now = new Date();
                var tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (tzOffset * 3600000);
                now.setTime(tz);

                var leadingZeros = function (n, digits) {
                    var zero = '';
                    n = n.toString();

                    if (n.length < digits) {
                        for (i = 0; i < digits - n.length; i++)
                            zero += '0';
                    }
                    return zero + n;
                };
                // leadingZeros(now.getFullYear(), 4) + '년' +
                var s =
                    leadingZeros(now.getHours(), 2) + ':' +
                    leadingZeros(now.getMinutes(), 2) + ':' +
                    leadingZeros(now.getSeconds(), 2) + ', ' +
                    leadingZeros(now.getMonth() + 1, 2) + '월 ' +
                    leadingZeros(now.getDate(), 2) + '일 ';


                return s;
            }
        }
    });