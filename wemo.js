var wemoNode        = require('wemonode'),
    socket          = require('socket.io'),
    _               = require('underscore'),
    http            = require('http'),
    xml2js          = require('xml2js'),
    os              = require('os');

exports.sockets     = [];
exports.switches    = [];
exports.io          = null;
exports.wemo        = null;

exports.listen      = function(server) {

    exports.ip      = exports.getLocalIP();
    exports.io      = socket.listen(server);
    exports.wemo    = wemoNode.WemoNode()

    exports.io.sockets.on("connection", function(socket) {

        exports.sockets.push(socket);

        socket.on("state_changed", function(device) {

            var state           = parseInt(device.binarystate, 10);

            device.deviceType   = "socket";

            exports.wemo.sendCommand("socket_setbinarystate", device, { "binarystate": state});

        });

        socket.on("disconnect", function() {

            exports.sockets = _.reject(exports.sockets, function(s) {

                return (socket.id == s.id);

            });

            console.log("Disconnected... Now " + exports.sockets.length + " connections...");

        });

        _.each(exports.switches, function(s) {

            socket.emit("device_found", s);

        });

    });

    //Whenever a new device joins the network
    exports.wemo.on("device_found", function (device) {

        //Get the content from the device spec xml file
        exports.downloadUrlContent(device.location, function(content) {

            //parse the XML to JSON for easier consumption
            xml2js.parseString(content, {
                explicitArray: false,
                explicitRoot: false
            }, function(err, json) {

                exports.switches.push(_.extend(device, {
                    details: json 
                }));

            });

        });

    });

    //Whenever a device is lost off the network
    exports.wemo.on("device_lost", function (device) {

        //Remove the lost device
        exports.switches = _.reject(exports.switches, function(s) {
        
            return (device.USN == s.USN);

        });

        exports.io.sockets.emit("device_lost", device);

    });


    //Whenever a switch is turned on/off
    exports.wemo.on("state_changed", function (device) {
        
        //socket.emit("state_changed", device);

        exports.io.sockets.emit("state_changed", device);
        
    });

    exports.wemo.setBindAddress(exports.ip);
    exports.wemo.startDiscovery();

};

exports.downloadUrlContent = function(url, callback) {

  http.get(url, function(res) {

    var data = "";

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on("end", function() {
      callback(data);
    });

  }).on("error", function() {
    callback(null);
  });

};

exports.getLocalIP = function() {

    var interfaces = os.networkInterfaces();

    var addresses = _.map(interfaces, function(interface) {

        return _.find(interface, function(address) {

            return (address.family == "IPv4" && !address.internal);

        });

    });

    var address = _.find(addresses, function(address) {
    
        return (address != null);
    });

    if(address == null) {
        return null;
    } else {
        return address.address;
    }

};

