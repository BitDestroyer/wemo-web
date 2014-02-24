var app         = require('express')(),
    fs          = require('fs'),
    config      = require('./config/config'),
    http        = require('http'),
    server      = http.createServer(app),
    wemo        = require('./wemo');

require('./config/express')(app, config);
require('./config/routes')(app);

server.listen(config.port);

wemo.listen(server);

/*wemoNode.on("device_found", function (object) {

    //if (object.deviceType == 'socket')
    //  wemoNode.sendCommand("socket_setbinarystate", object, {"binarystate": 1});

}.bind(this));

var turnOffWemoSwitch = function(object){
    wemoNode.sendCommand("socket_setbinarystate", object, {"binarystate": 0});
}*/


//setTimeout(wemoNode.stopDiscovery,10000);
