/**
 * Created by hyochan on 2016. 4. 13..
 */
// 채팅 박스에 사용 스크롤 자동으로 밑으로
app
    .directive('schrollBottom', function () {
        return {
            scope: {
                schrollBottom: "="
            },
            link: function (scope, element) {
                scope.$watchCollection('schrollBottom', function (newValue) {
                    if (newValue)
                    {
                        $(element).scrollTop($(element)[0].scrollHeight);
                    }
                });
            }
        }
    });