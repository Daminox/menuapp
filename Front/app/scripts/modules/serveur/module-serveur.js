angular.module('serveur',[])
.controller('ServeurController',['ServeurService','$scope','StorageFactory', function(ServeurService,$scope,StorageFactory){
    $scope.onMessage = function(data){
        console.log(data);
        var obj = JSON.parse(data.data);
        switch (obj.type){
            case 'MAJCMD' : {
                $scope.commandes = JSON.parse(obj.data);
                break;
            }
            case 'STATUS' : {
                StorageFactory.updateStatus(obj.data);
                break;
            }
        }
    };

    $scope.addCommande = function(){
        var obj ={type : 'ADDCMD'};
        console.log(JSON.stringify(obj));
        var objstr = JSON.stringify(obj);
        $scope.connection.send(objstr);   
    };
    
    $scope.connection = ServeurService.initConnection(null,null,$scope.onMessage);


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

        connection.onclose = function(){
            console.log('clooooosed!!!');    
        };
        
        connection.onmessage = callBackMessage || function (message) {
            try {
                var json = JSON.parse(message.data);
                console.log('JSON valide recu : ', json);
            } catch (e) {
                console.error('Pas recu du json', message.data);
                return;
            }

        };

        return connection;
    };


    return service;

}]);