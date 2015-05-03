angular.module('serveur',[])
.controller('ServeurController',['ServeurService','$scope', function(ServeurService,$scope){
    ServeurService.initConnection();
}]).service('ServeurService',['WebSocketHelperService', function(WebSocketHelperService){

    var service = {};

    service.initConnection = function(callBackOpen, callBackError, callBackMessage){
        //On commence par initialiser la connection
        var connection = WebSocketHelperService.createConnection();

        connection.onopen = callBackOpen || function(){
            console.log('connection ouverte ! ');
        };

        connection.onerror = callBackError || function (error) {
            console.error('error recue !');
            console.error(error);
        };

        connection.onmessage = callBackMessage || function (message) {
            try {
                var json = JSON.parse(message.data);
            } catch (e) {
                console.error('Pas recu du json', message.data);
                return;
            }
            console.log('JSON valide recu : ', json);
        };

    };


    return service;

}]);