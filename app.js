var app         = require('express')(),
    mongoose    = require('mongoose'),
    fs          = require('fs'),
    config      = require('./config/config'),
    http        = require('http'),
    server      = http.createServer(app),
    wemo        = require('./wemo');

mongoose.connect(config.db);

var db = mongoose.connection;

db.on('error', function () {

    throw new Error('unable to connect to database at ' + config.db);

});

var modelsPath = __dirname + '/app/models';

fs.readdirSync(modelsPath).forEach(function (file) {

    if (file.indexOf('.js') >= 0) {
        require(modelsPath + '/' + file);
    } 

});

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
