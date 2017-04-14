/**
 * Created by hyochan on 10/19/15.
 */
'use strict';

app.directive('tooltip', function(){
    return {
        restrict: 'A',
        link: function(scope, element){
            (element).hover(function(){
                // on mouseenter
                (element).tooltip('show');
            }, function(){
                // on mouseleave
                (element).tooltip('hide');
            });
        }
    };
});