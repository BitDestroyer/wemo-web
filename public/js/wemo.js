function WemoController($scope) {

    $scope.socket           = io.connect(); 
    $scope.switches         = [];
    $scope.toggleAllState   = 0;

    $scope.toggleSwitch     = function(device) {

        var state = parseInt(device.binarystate, 10);

        //Flip the "bit"
        device.binarystate = 1 - state;

        $scope.socket.emit("state_changed", device);

    };

    $scope.toggleAll        = function() {

        $scope.toggleAllState = 1 - $scope.toggleAllState;

        _.each($scope.switches, function(s) {

            s.binarystate = $scope.toggleAllState;

            $scope.socket.emit("state_changed", s);

        });

    };

    $scope.socket.on("device_found", function(device) {

        /* We have to put this in an $apply function
         * because the events are fired from socket.io
         * and cause angular to not apply vm changes. */
        $scope.$apply(function() {

            var state = parseInt(device.binarystate, 10);

            console.log(device.details.device.friendlyName + "'s state: " + state);

            device = _.extend(device, {
                isOn: state == 1,
                friendlyState: (state == 1) ? "On" : "Off"
            });

            $scope.switches.push(device);

        });

    });

    $scope.socket.on("state_changed", function(device) {

        $scope.$apply(function() {

            var state = parseInt(device.binarystate, 10);

            _.each($scope.switches, function(s) {

                if(s.USN == device.USN) {

                    s.isOn = state == 1;
                    s.friendlyState = (state == 1) ? "On" : "Off";

                }

            });

        });

    });

}
