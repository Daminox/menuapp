angular.module('commons', [])
.controller('AccueilController',function($scope){

})
.controller('FooterController',function($scope){

})
.controller('HeaderController',function($scope){

}).service('WebSocketHelperService', function(){

    var helper = {};

    helper.createConnection = function(){
        window.WebSocket = window.WebSocket || window.MozWebSocket;
        var connection = new WebSocket('ws://127.0.0.1:1337');
        return connection;
    };

    return helper;


});