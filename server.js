var express     = require("express")
var app         = express()
var bodyParser  = require("body-parser")
var mongoose    = require("mongoose")
var http        = require("http").Server(app)
var io          = require("socket.io")(http)
var CONFIG    = require("./config")
var Donor       = require("./models/donor")
var validate    = require("./models/validation")
var port        = 3000

// Setup body-parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Load routes
app.use("/api/donor/",  require("./routes/api/donor.js"))
app.use(express.static(__dirname + "/public"))
app.get('*',            require("./routes/index.js"));


io.on("connection", function(client) {
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
})
// Ready-set-GO!
mongoose.connect("mongodb://localhost/bloodonate+")
http.listen(port, function() {
    console.log()
    console.log("It's happening.")
})
//1337
