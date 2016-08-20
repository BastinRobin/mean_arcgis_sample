angular.module("bloodonateApp")
.factory("restful", function(transfer, $http, $location) {
    // Error codes indexed as bits. Please refer to
    // SRS Chapter #3 Status codes for more detail
    var validationMessages = [
        "Success",
        "Firstname",
        "Lastname",
        "Phone",
        "Email",
        "Bloodtype",
        "IP",
        "GEO_X",
        "GEO_Y"
    ]
    // Make HTTP Request
    var REST = function(options) {
        return $http(options.methods).then(
            // Callbacks
            options.success,
            options.error
        )
    }
    var decodeError = function(error_code) {
        // Detect errors
        var errors = [];
        // Check for each bit
        for (var i = 0; i != 8; i+=1) {
        if ((error_code >> i) & 1 == 1) {
            // Push the corresponding error to array
            errors.push(validationMessages[i+1])
            }
        }
        return errors;
    }
    var ipToString = function(int) {
        var part1 = int & 255
        var part2 = ((int >> 8) & 255)
        var part3 = ((int >> 16) & 255)
        var part4 = ((int >> 24) & 255)
        return part4 + "." + part3 + "." + part2 + "." + part1
    }
    return {
        REST: REST,
        // Server validation error decoder
        decodeError: decodeError,
        ipToString: ipToString,
        redirect: {
            success: function(response) {
                // Convert 32 bit IP returned from server to string
                response.saved_data.ipv4 = ipToString(response.saved_data.ipv4)
                var saved = {
                    data: response.saved_data,
                    uniqueLink: '/donor/' + response.unique_param,
                }
                // Transfer saved data to DonorSavedController
                transfer.saved = saved
                $location.path("/donor/success")
            }
        }
    }
})