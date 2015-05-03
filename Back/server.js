// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

// list of currently connected clients (users)
var clients = [ ];


/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    httpServer: server
});


var cmd = [];


wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;

    console.log((new Date()) + ' Connection accepted.');

    connection.sendUTF(JSON.stringify( { type: 'STATUS', data: 'OKE'} ));


    // user sent some message
    connection.on('message', function(message) {
        console.log('Message recu : ' + message);
         console.log(message.utf8Data);
        var obj = JSON.parse(message.utf8Data);
        switch (obj.type){
            case 'ADDCMD' : {
             
                var newCmd = { id : cmd.length };
                cmd.push(newCmd);
                connection.sendUTF(JSON.stringify( { type: 'MAJCMD', data: JSON.stringify(cmd)} ));
                break;
            }
        }   
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
        // remove user from the list of connected clients
        clients.splice(index, 1);
    });

});