'use strict';

app
	.controller('memberCtrl', function($location, $scope, $route, ModalService, httpServ){
        // ==> START : navBar Active class 부여하기
        $scope.$route = $route;
        // <== END : navBar Active class 부여하기

		// member data
        /*
        $scope.members = [
            {
                _id : 1,
                email : "unix.zang@gmail.com",
                name : "장효찬",
                photo : "./upload/profile/장효찬.png"
            },
            {
                _id : 2,
                email : "asdf@aa",
                name : "asdf",
                photo : "./upload/profile/asdf@aa.png"
            }
        ];*/
        $scope.getUsers=function(){
            var $promise = httpServ.getUsers(); // call users
            $promise.then(function(msg){
                var data = msg.data;
                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        // 마지막에 더미가 생기므로 하나 지워줌
                        // data.users.splice(-1, 1);
                        $scope.members =  data.users;
                }
            });
        };
        $scope.getUsers();


        $scope.memberQuery = {};
        $scope.memberQueryBy = '$';
        $scope.orderProp='_id';

        /*************  START : MODALS  *************/
        $scope.selectedMemeber = '';
        $scope.memberModalOn = function(_id){
            ModalService.showModal({
                templateUrl: 'memberModal.html',
                controller: 'MemberModalCtrl',
                inputs: {
                    member : $scope.members[_id]
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
        //////////////  END : MODALS  //////////////

    })
    .controller('MemberModalCtrl', function($scope, $element, member, close) {
        $scope.close = function(result) {
            $element.modal('hide'); //  모바일에서 모달 없어졌을 때 까만 화면 방지 ==> Manually hide the modal using bootstrap.
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
        $scope.selectedMember = member;
    });