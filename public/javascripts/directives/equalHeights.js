/**
 * Created by hyochan on 7/11/16.
 */
app.directive('equalHeights', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            scope: {
                equalHeightsItems: '='
            },
            link: function(scope, element, attrs) {

                var selector = attrs.equalHeights;

                scope.$watch('equalHeightsItems', function(newVal) {
                    if (newVal && newVal.length) {
                        $timeout(function() {
                            equalize();
                        });
                    }
                });

                function equalize() {
                    var height = 0;

                    var $elements = element.find(selector);

                    _.each($elements, function(el) {
                        var $el = angular.element(el);
                        var elHeight = $el.outerHeight();

                        if (elHeight > height) height = elHeight;
                    });

                    $elements.height(height);
                }
            }
        };
    }
]);