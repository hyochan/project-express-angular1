/**
 * Created by hyochan on 10/21/15.
 */
'use strict';
app
    .controller('homeCtrl', function($location, $scope, $route, ModalService){
        /*  ==> START : navBar Active class 부여하기  */
		$scope.$route = $route;
        /*  <== END : navBar Active class 부여하기  */

		$scope.myInterval = 5000;
		$scope.noWrapSlides = false;
        $scope.active = 0;
        $scope.slides = [
            {
                id : 0,
                image : "images/gagetalk.png",
                text : "가게톡"
            },
            {
                id : 1,
                image : "images/gagebutogether.png",
                text : "가계부투게더"
            }/*,
            {
                image : "images/wunttok.png",
                text : "운똑"
            }*/
        ];

        /**************************  가계톡 **************************/
        $scope.gagetalks = [
            {  image : "images/gagetalk/1.png",
                title : " 웹 회원가입",
                content : "소호 상인이 웹에서 회원가입을 하는 과정."},
            {  image : "images/gagetalk/2.png",
                title : " 웹 채팅",
                content : "웹에서 socket.io와 통신하는 모습."},
            {  image : "images/gagetalk/3.png",
                title : " 웹에서 상인과 고객 채팅",
                content : "반응형 웹에서 상인과 고객이 채팅을 하는 모습."},
            {  image : "images/gagetalk/4.png",
                title : " 안드로이드 초기 화면",
                content : "안드로이드 앱 설치 후 초기 실행 화면."},
            {  image : "images/gagetalk/5.png",
                title : " 안드로이드 로그인",
                content : "안드로이드 앱 파업 로그인 창."},
            {  image : "images/gagetalk/6.png",
                title : " 안드로이드 상점 보기",
                content : "소호 정보 상세보기 화면."},
            {  image : "images/gagetalk/7.png",
                title : " 안드로이드 채팅",
                content : "앱에서 서버 socket.io와 통신."},
            {  image : "images/gagetalk/8.png",
                title : " 안드로이드 노티",
                content : "다른 채팅 이용 중 노티 팝업."},
            {  image : "images/gagetalk/9.png",
                title : " 안드로이드 채팅 리스트",
                content : "안드로이드 채팅 리스트 ui."}
        ];

        /**************************  가계부투게더 **************************/
        $scope.gagebutogethers = [
            {  image : "images/gagebutogether/1.png",
                title : " 앱 설치 후",
                content : "초기 앱 설치 후 진입 화면."},
            {  image : "images/gagebutogether/2.png",
                title : " 오른쪽 + 버튼 클릭",
                content : "가계부 입력을 위해 오른쪽 상단 버튼 클릭."},
            {  image : "images/gagebutogether/3.png",
                title : " 지출 리스트",
                content : "3번째 프래그먼트에서 지출 내역 확인."},
            {  image : "images/gagebutogether/4.png",
                title : " 수입 내역 입력",
                content : "수입 내역을 입력하기 위한 화면."},
            {  image : "images/gagebutogether/5.png",
                title : " 지출 내역 입력",
                content : "지출 내역을 입력하기 위한 화면."},
            {  image : "images/gagebutogether/6.png",
                title : " 대시보드 화면",
                content : "햄버거 버튼 또는 드래그시 대시보드 화면 노출."},
            {  image : "images/gagebutogether/7.png",
                title : " 설정 화면",
                content : "대시보드 또는 옵션 메뉴에서 진입."},
            {  image : "images/gagebutogether/8.png",
                title : " 종료 화면",
                content : "종료하기 전에 뜨는 팝업 화면."}
        ];



        $scope.selectedMemeber = '';
        $scope.showModalOn = function(selected){
            ModalService.showModal({
                templateUrl: 'showModal.html',
                controller: 'showModalCtrl',
                size: 'lg',
                inputs: {
                    selected : selected
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    switch (result){
                        default:
                            break;
                    }
                });
            }).catch(function(err){
                console.log(err);
            });
        };

    }).value('duScrollOffset', 120);

app.controller('showModalCtrl', function($scope, $element, selected, close) {
    $scope.close = function(result) {
        $element.modal('hide'); //  모바일에서 모달 없어졌을 때 까만 화면 방지 ==> Manually hide the modal using bootstrap.
        close(result, 500); // close, but give 500ms for bootstrap to animate
    };
    $scope.selected = {
        photo : selected
    };
});