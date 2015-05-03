angular.module('commons', [])
.factory('StorageFactory', function(){

    var statusWS = 'pending';
    return {
        getStatus : function(){
            console.log('called !');
            return statusWS;  
        },
        updateStatus : function(data){
            statusWS = data;
        }
    };
})
.controller('AccueilController',function($scope){

})
.controller('FooterController',function($scope){

})
.controller('HeaderController',function($scope,StorageFactory){
    $scope.statusWS = StorageFactory.getStatus;
}).service('WebSocketHelperService', function(){

    var helper = {};

    helper.createConnection = function(){
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        var connection = new WebSocket('ws://127.0.0.1:1337');
        return connection;
    };

    return helper;


});