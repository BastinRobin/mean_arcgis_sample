var CONFIG    = require("./config")
var Donor     = require("./models/donor")
var validate  = require("./models/validation")

exports.start = function(io) {
    io.sockets.on("connection", function(client) {
    // Client requests the pinpoints in area
    client.on("2", function(msg) {
        var validated = true
        validated &= validate.double(msg.x1)
        validated &= validate.double(msg.x2)
        validated &= validate.double(msg.y1)
        validated &= validate.double(msg.y2)
        if (validated) {
            if (CONFIG.DEBUG) {
                console.log("Socket.io: Got valid lazy request. Processing...")
            }
            Donor.find({})
                .where("geo_x").gt(msg.x1).lt(msg.x2)
                .where("geo_y").gt(msg.y1).lt(msg.y2)
                .select("_id geo_x geo_y")
                .exec(function(err, result){
                    if (!err) {
                        // Respond back with pinpoints
                        client.emit("2", result)
                        if (CONFIG.DEBUG) {
                            console.log("Socket.io: Responding with " + result.length + " record(s)")
                        }
                    }
                    else {
                        if (CONFIG.DEBUG) {
                            console.log(err)
                        }
                        // Something went wrong
                        client.emit("0")
                    }
                })
        } else {
            if (CONFIG.DEBUG) {
                console.log("Socket.io: Invalid request:" + msg)
            }
            // Invalid request
            client.emit("0")
        }
    })
    exports.broadcastDelete = function(_id) {
        io.sockets.emit("3", {id: _id})
    }
})
}