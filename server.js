var express     = require("express")
var web         = express()
var bodyParser  = require("body-parser")
var mongoose    = require("mongoose")
var http        = require("http").Server(web)
var sockets     = require("socket.io")(http)
var io          = require("./io").start(sockets)
var port        = 3000

// Setup body-parser
web.use(bodyParser.urlencoded({ extended: true }))
web.use(bodyParser.json())

// Load routes
web.use("/api/donor/",  require("./routes/api/donor.js"))
web.use(express.static(__dirname + "/public"))
web.get('*',            require("./routes/index.js"));

// Ready-set-GO!
mongoose.connect("mongodb://emirhan2:123123123@bloodonate-5692.mongo.dbs.appsdeck.eu/bloodonate-5692")
http.listen(port, function() {
    console.log()
    console.log("It's happening.")
})
//1337
