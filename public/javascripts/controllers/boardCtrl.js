/**
 * Created by hyochan on 11/7/15.
 */

'use strict';

app
    .controller('boardCtrl', function($scope, $rootScope, $location, filterFilter, ModalService, httpServ){

        console.log("boardCtrl");

        // ==> START : navBar active Class 부여하기
        $scope.isActive = function(route) {
            return route === $location.path();
        };
        // ==> END : navBar active Class 부여하기

        /** START : sample data for board **/
        $scope.boards = [];
        $rootScope.getBoards = function(){
            var $promise = httpServ.getBoards();
            $promise.then(function(msg){
                var data = msg.data;

                switch (data.resCode){
                    case httpServ.resCode.SUCCESS:
                        // 마지막에 더미가 생기므로 하나 지워줌
                        // data.boards.splice(-1, 1);
                        $scope.boards = data.boards;
                        break;
                    case httpServ.resCode.FAILED:
                        console.log("error : " + data.err);
                        break;
                    default:
                        console.log("result : " + data.resCode);
                        break;
                }
            });
        };
        $rootScope.getBoards();
        /// END : sample data for board ///

        $scope.predicate = 'name';
        $scope.reverse = true;
        $scope.currentPage = 1;
        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };


        /**  START : boardQuery  **/
        $scope.selectBoardQuery = function(select){
            $scope.boardQueryBy = select;
        };
        $scope.boardQuery = {};
        $scope.boardQueryBy = { name : '$', value : '$'};
        $scope.boardQueryIndexes =[
            { name : '$', value : '$'},
            { name : '제목', value: 'title'},
            { name : '글쓴이', value : 'name'},
            { name : '글', value : 'content'}
        ];
        ///  END : boardQuery ///

        /**  START : pagination  **/
        $scope.totalItems = $scope.boards.length;
        $scope.numPerPage = 5;
        $scope.paginate = function (value) {
            var begin, end, index;
            begin = ($scope.currentPage - 1) * $scope.numPerPage;
            end = begin + $scope.numPerPage;
            index = $scope.boards.indexOf(value);
            console.log('begin : ' + begin + ', end : ' + end + ', index : ' + index);
            return (begin <= index && index < end);
        };
        ///  END : pagination  ///

        /**  START : MODAL  **/
        $scope.readModalOn = function(board){
            ModalService.showModal({
                templateUrl: 'readModal.html',
                controller: 'readModalCtrl',
                inputs: {
                    board : board
                }
            }).then(function(modal) {
                modal.element.modal();
                modal.close
                    .then(function(result) {
                        console.log("result : " + result);
                        switch (result){
                            case 'delete':
                                // var number = $scope.boards.indexOf(board) + 1;
                                var number = board.number;
                                console.log("number : " + board.number);
                                // 서버 게시글도 지워야 함
                                var $promise = httpServ.deleteBoard(number);
                                $promise.then(function (msg){
                                    var data = msg.data;
                                    switch (data.resCode){
                                        case httpServ.resCode.SUCCESS:
                                            var board_html_number = $scope.boards.indexOf(board);
                                            $scope.boards.splice(board_html_number,1);
                                            console.log("board number (" + number + ") deleted");
                                            break;
                                        case httpServ.resCode.FAILED:
                                            console.log("board number (" + number + ") delete failed");
                                            break;
                                    }
                                });
                                break;
                            default :
                                break;
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
            });
        };
        $scope.writeModalOn = function(){
            ModalService.showModal({
                templateUrl: 'writeModal.html',
                controller: 'writeModalCtrl'
            }).then(function(modal){
                modal.element.modal();
                modal.close.then(function(result){
                    console.log("result : " + result);
                });
            });
        };
        //////////////  END : MODALS  //////////////
    })

    .controller('readModalCtrl', function($scope, $rootScope, $element, board, close, httpServ) {
        console.log("readModalCtrl : " + board.number);
        $scope.close = function (result) {
            $element.modal('hide'); //  모바일에서 모달 없어졌을 때 까만 화면 방지 ==> Manually hide the modal using bootstrap.
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
        $scope.board = board;
        $scope.fileHTML = "";
        // 삭제 버튼 표시 여부 : 내 글인지 아닌지 확인
        (board.email == $rootScope.email) ? $scope.isMine = true : $scope.isMine = false;
        console.log("isMine : " + $scope.isMine);

        var $promise = httpServ.readFiles(board.number);
        $promise.then(function(msg){
            var data = msg.data;
            switch (data.resCode){
                case httpServ.resCode.SUCCESS:
                    console.log(data.files);
                    $scope.fileHTML = "<hr>";
                    for(var i in data.files){
                        var url = 'upload/board/' + board.number + "/" + data.files[i];
                        $scope.fileHTML += "<p><a href=" + url + ">" + data.files[i] + "</a></p>"
                    }
                    break;
                case httpServ.resCode.FAILED:
                    console.log("error : " + data.err);
                    break;
                default:
                    console.log("result : " + data.resCode);
                    break;
            }
        });
    })

    .controller('writeModalCtrl', function($scope, $rootScope, $element, close, httpServ){

        console.log("writeModalCtrl");

        $(document).on("change", "div.filebox #ex_filename", function() {
            console.log("filebox has changed");
            var filename;
            if(window.FileReader){
                if($(this)[0].files.length > 1){
                    filename = $(this)[0].files.length + "개 파일 선택";
                } else if ($(this)[0].files.length == 1){
                    filename = $(this)[0].files[0].name;
                } else {
                    filename = "파일 선택";
                }
            } else {
                filename = $(this).val().split('/').pop().split('\\').pop();
            }

            $(this).siblings('.upload-name').val(filename);
        });

        $scope.write = function(){
            // inputTitle, inputContent, inputUpload
            var formData = new FormData(document.querySelector('form#writeBoardForm'));
            var $promise = httpServ.writeBoard(formData);
            $promise.then(function(msg){
                var data = msg.data;
                $scope.isAlert = true;
                if(data.resCode === httpServ.resCode.SUCCESS){
                    console.log("req success");
                    $rootScope.getBoards();
                    $element.modal('hide'); //  모바일에서 모달 없어졌을 때 까만 화면 방지 ==> Manually hide the modal using bootstrap.
                    close('write', 500); // close, but give 500ms for bootstrap to animate
                    // $location.path('/');
                    $scope.isSuccess = true;
                    $scope.txt = "글이 등록되었습니다.";
                }
                else if(data.resCode === httpServ.resCode.NO_REQ_PARAM){
                    console.log("no req params");
                    $scope.isSuccess = false;
                    $scope.txt = "제목은 꼭 입력해주셔야 합니다.";
                }
                else if(data.resCode === httpServ.resCode.FAILED){
                    console.log("req failed");
                    $scope.isSuccess = false;
                    $scope.txt = "글을 등록하지 못했습니다. 다시 로그인해주세요."
                }
                $scope.writeAlertHTML=
                    '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ' +
                    $scope.txt;
            });
        };
    });